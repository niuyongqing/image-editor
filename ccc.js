import { ref, shallowRef, markRaw, toRaw, unref } from "vue";
import { fabric } from "fabric";
// 引入状态管理
import { useEditorState, ZOOM_PADDING } from "./useEditorState";

// 引入剪裁模块
import {
    registerCropModule,
    constrainCrop,
    cropObject,
    cancelCrop,
    rotateActive as rotateCrop,
    flipActive as flipCrop
} from "@/components/modules/adjust/useCanvasCrop";

// ✨ 路由映射表
const TOOL_MAP = {
    'i-text': 'text',
    'textbox': 'text',
    'image': 'adjust', // 默认图片去调整
    'path': 'draw',
    'rect': 'draw',
    'circle': 'draw',
    'triangle': 'draw'
};

export function useCanvas() {
    const canvas = shallowRef(null);
    const { setHistoryState, setActiveTool, setSidebarDisabled } = useEditorState(); // ✨ 获取 Action
    const zoom = ref(1);

    // 交互状态变量
    let isPotentialClick = false;
    let dragStartPoint = null;

    // === 历史记录 (保持不变) ===
    const history = [];
    let historyIndex = -1;
    let historyProcessing = false;

    const saveHistory = () => {
        if (!canvas.value || historyProcessing) return;
        if (historyIndex < history.length - 1) {
            history.splice(historyIndex + 1);
        }
        const json = JSON.stringify(
            canvas.value.toJSON(["id", "selectable", "name", "isMainImage", "isPuzzleImage", "cellIndex", "isMaskObject"]) // ✨ 增加序列化字段
        );
        history.push(json);
        historyIndex++;
        if (history.length > 50) {
            history.shift();
            historyIndex--;
        }
        updateStoreHistory();
    };

    const updateStoreHistory = () => {
        setHistoryState(historyIndex > 0, historyIndex < history.length - 1);
    };

    // === 撤销/重做 (保持不变) ===
    const undo = () => {
        if (!canvas.value || historyIndex <= 0 || historyProcessing) return;
        if (cropObject.value) cancelCrop();
        historyProcessing = true;
        historyIndex--;
        const content = history[historyIndex];
        canvas.value?.loadFromJSON(content, () => {
            canvas.value?.renderAll();
            historyProcessing = false;
            updateStoreHistory();
        });
    };

    const redo = () => {
        if (!canvas.value || historyIndex >= history.length - 1 || historyProcessing) return;
        if (cropObject.value) cancelCrop();
        historyProcessing = true;
        historyIndex++;
        const content = history[historyIndex];
        canvas.value?.loadFromJSON(content, () => {
            canvas.value?.renderAll();
            historyProcessing = false;
            updateStoreHistory();
        });
    };

    const zoomToRect = (rect, minZoomLimit = 0.1) => {
        if (!canvas.value) return;
        const width = canvas.value.width;
        const height = canvas.value.height;
        let targetZoom = Math.min(width / rect.width, height / rect.height) * ZOOM_PADDING;
        targetZoom = Math.max(minZoomLimit, Math.min(targetZoom, 50));
        const rectCenterX = rect.left + rect.width / 2;
        const rectCenterY = rect.top + rect.height / 2;
        const panX = (width / 2) - (rectCenterX * targetZoom);
        const panY = (height / 2) - (rectCenterY * targetZoom);
        canvas.value.setViewportTransform([targetZoom, 0, 0, targetZoom, panX, panY]);
        zoom.value = targetZoom;
        canvas.value.requestRenderAll();
    };

    // === ✨ 核心：智能导航逻辑 ===
    const handleSelection = (target) => {
        if (!target) {
            // 点击空白处 -> 进入残影模式 (保持当前工具面板但置灰)
            setSidebarDisabled(true);
            return;
        }

        // 解除禁用
        setSidebarDisabled(false);

        // 1. 拼图特判
        if (target.isPuzzleImage || target.isPuzzleController) {
            setActiveTool('puzzle');
            return;
        }

        // 2. 遮罩/辅助线特判 (不跳转)
        if (target.isMaskObject || target.excludeFromExport) {
            return;
        }

        // 3. 通用映射
        const type = target.type;
        const targetTool = TOOL_MAP[type];
        if (targetTool) {
            setActiveTool(targetTool);
        }
    };

    // === 初始化与事件 ===
    const init = (id, width, height) => {
        console.log("init canvas", id, width, height);
        const c = new fabric.Canvas(id, {
            width: width,
            height: height,
            backgroundColor: "#f3f3f3",
            preserveObjectStacking: true,
            fireRightClick: true,
            stopContextMenu: false
        });
        canvas.value = markRaw(c);

        registerCropModule(canvas, saveHistory, zoomToRect);

        // === 事件监听 ===
        const checkConstraint = () => {
            if (cropObject.value) {
                constrainCrop(toRaw(cropObject.value));
            }
        };

        c.on("object:modified", (e) => {
            checkConstraint();
            if (e.target && e.target.type !== "rect") saveHistory();
        });
        c.on("object:added", (e) => {
            if (e.target && e.target.type !== "rect") saveHistory();
        });
        c.on("object:removed", (e) => {
            if (e.target && e.target.type !== "rect") saveHistory();
        });

        // ✨ 交互消歧：按下时记录坐标
        c.on("mouse:down", (opt) => {
            isPotentialClick = true;
            const pointer = c.getPointer(opt.e);
            dragStartPoint = { x: pointer.x, y: pointer.y };
        });

        // ✨ 交互消歧：移动时检测阈值
        c.on("mouse:move", (opt) => {
            if (!isPotentialClick) return;
            const pointer = c.getPointer(opt.e);
            const dist = Math.sqrt(
                Math.pow(pointer.x - dragStartPoint.x, 2) +
                Math.pow(pointer.y - dragStartPoint.y, 2)
            );
            if (dist > 5) { // 阈值 5px
                isPotentialClick = false; // 判定为拖拽，取消点击标记
            }
        });

        // ✨ 交互消歧：松开时触发路由
        c.on("mouse:up", (opt) => {
            // 如果是拖拽操作，或者正在剪裁中，不触发自动跳转
            if (!isPotentialClick || c.isDrawingMode) return;

            const target = c.getActiveObject();
            handleSelection(target);
        });

        // ✨ 选中事件 (处理框选等非点击产生的情况)
        // 注意：mouse:up 负责点击交互，selection:created 负责框选/API调用
        // 为了避免冲突，这里主要处理 "selection:cleared"
        c.on("selection:cleared", () => {
            setSidebarDisabled(true);
        });

        // Zoom 事件
        const canvasEl = c.upperCanvasEl;
        canvasEl.addEventListener(
            "wheel",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                const delta = e.deltaY;
                let newZoom = c.getZoom();
                newZoom *= 0.999 ** delta;
                if (newZoom > 50) newZoom = 50;
                if (newZoom < 0.1) newZoom = 0.1;
                c.zoomToPoint({ x: e.offsetX, y: e.offsetY }, newZoom);
                zoom.value = newZoom;
            },
            { passive: false }
        );

        saveHistory();
    };

    // ... (其余 API 方法如 addImage, zoomIn 等保持不变，此处省略以节省篇幅) ...
    // 请确保保留 addImage, initImage, rotateActive 等原有逻辑

    const addImage = (url) => {
        fabric.Image.fromURL(url, (img) => {
            const canvasWidth = canvas.value.width;
            const canvasHeight = canvas.value.height;
            if (img.width > canvasWidth || img.height > canvasHeight) {
                const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height) * ZOOM_PADDING;
                img.scale(scale);
            }
            img.set({ isMainImage: true, id: 'main-image' });
            zoom.value = canvas.value.getZoom();
            historyProcessing = true;
            canvas.value?.add(img);
            canvas.value?.centerObject(img);
            canvas.value?.setActiveObject(img);
            historyProcessing = false;
            saveHistory();
            canvas.value.fire('image:updated');

            // ✨ 新增：添加图片后自动激活调整模块
            setActiveTool('adjust');
            setSidebarDisabled(false);
        },
            { crossOrigin: "anonymous" }
        );
    };

    // 其他辅助函数保持原样...
    // setZoom, zoomIn, zoomOut, zoomReset...
    const setZoom = (value) => {
        if (!canvas.value) return;
        let newZoom = value;
        if (newZoom > 50) newZoom = 50;
        if (newZoom < 0.1) newZoom = 0.1;
        const center = canvas.value.getCenter();
        canvas.value.zoomToPoint({ x: center.left, y: center.top }, newZoom);
        zoom.value = newZoom;
    };

    const zoomIn = () => setZoom(zoom.value + 0.1);
    const zoomOut = () => setZoom(zoom.value - 0.1);
    const zoomReset = () => setZoom(1);

    const initImage = (url) => {
        if (!canvas.value) return;
        historyProcessing = true;
        canvas.value.clear();
        canvas.value.setBackgroundColor("#f3f3f3", () => {
            canvas.value.renderAll();
        });
        historyProcessing = false;
        history.length = 0;
        historyIndex = -1;
        updateStoreHistory();
        addImage(url);
    };

    const rotateActive = (angle) => {
        const handled = rotateCrop(angle);
        if (!handled) {
            const activeObj = canvas.value?.getActiveObject();
            if (activeObj) {
                activeObj.rotate((activeObj.angle || 0) + angle);
                canvas.value.requestRenderAll();
                saveHistory();
            }
        }
    };

    const flipActive = (axis) => {
        const handled = flipCrop(axis);
        if (!handled) {
            const activeObj = canvas.value?.getActiveObject();
            if (activeObj) {
                if (axis === "X") activeObj.set("flipX", !activeObj.flipX);
                if (axis === "Y") activeObj.set("flipY", !activeObj.flipY);
                canvas.value.requestRenderAll();
            }
        }
    };

    const toggleDrawing = (enable) => {
        if (!canvas.value) return;
        canvas.value.isDrawingMode = enable;
        if (enable) {
            const brush = new fabric.PencilBrush(canvas.value);
            brush.color = "rgba(255, 0, 0, 0.5)";
            brush.width = 30;
            canvas.value.freeDrawingBrush = brush;
        }
    };

    const exportMask = () => {
        if (!canvas.value) return null;
        const originalBg = canvas.value.backgroundColor;
        const objects = canvas.value.getObjects();
        objects.forEach((obj) => {
            if (obj.type === "path" || obj.isMaskObject) {
                obj._originalStroke = obj.stroke;
                obj._originalFill = obj.fill;
                obj.set({ stroke: "#ffffff", fill: "#ffffff" });
            } else {
                obj._originalOpacity = obj.opacity;
                obj.set({ opacity: 0 });
            }
        });
        canvas.value.setBackgroundColor("#000000", null);
        canvas.value.renderAll();
        const dataURL = canvas.value.toDataURL({ format: "png", multiplier: 1 });
        objects.forEach((obj) => {
            if (obj.type === "path" || obj.isMaskObject) {
                obj.set({ stroke: obj._originalStroke, fill: obj._originalFill });
            } else {
                obj.set({ opacity: obj._originalOpacity ?? 1 });
            }
        });
        canvas.value.setBackgroundColor(originalBg, null);
        canvas.value.renderAll();
        return dataURL;
    };

    const replaceActiveImage = (newUrl) => {
        const activeObj = canvas.value?.getActiveObject();
        if (!activeObj || activeObj.type !== "image") return;
        activeObj.setSrc(
            newUrl,
            () => {
                canvas.value.renderAll();
                saveHistory();
                canvas.value.fire('image:updated');
            },
            { crossOrigin: "anonymous" }
        );
    };

    const addText = (textStr = "双击编辑") => {
        if (!canvas.value) return;
        const text = new fabric.IText(textStr, {
            left: 100, top: 100, fontSize: 40, fill: "#333",
        });
        canvas.value.add(text);
        canvas.value.setActiveObject(text);
        // ✨ 新增：添加文本后自动跳转文本模块
        setActiveTool('text');
        setSidebarDisabled(false);
    };

    return {
        canvas,
        zoom,
        init,
        initImage,
        addImage,
        zoomIn,
        zoomOut,
        zoomReset,
        zoomToRect,
        setZoom,
        undo,
        redo,
        saveHistory,
        toggleDrawing,
        exportMask,
        replaceActiveImage,
        addText,
        rotateActive,
        flipActive
    };
}