import { ref, shallowRef, markRaw, toRaw, unref } from "vue";
import { fabric } from "fabric";
// ✨ 引入 routeToObject 用于路由跳转
import { useEditorState, ZOOM_PADDING } from "./useEditorState";

import {
    registerCropModule,
    constrainCrop,
    cropObject,
    cancelCrop,
    rotateActive as rotateCrop,
    flipActive as flipCrop
} from "@/components/modules/adjust/useCanvasCrop";

export function useCanvas() {
  const canvas = shallowRef(null);
  // ✨ 获取 routeToObject
  const { setHistoryState, setActiveTool, setSidebarDisabled, routeToObject } = useEditorState();
  const zoom = ref(1);

  // 交互状态变量
  let isPotentialClick = false;
  let dragStartPoint = null;

  // === 历史记录 ===
  const history = [];
  let historyIndex = -1;
  let historyProcessing = false;

  const saveHistory = () => {
    if (!canvas.value || historyProcessing) return;
    if (historyIndex < history.length - 1) {
      history.splice(historyIndex + 1);
    }
    const json = JSON.stringify(
        canvas.value.toJSON(["id", "selectable", "name", "isMainImage", "isPuzzleImage", "cellIndex", "isMaskObject"])
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

  // === 撤销 (Undo) ===
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

  // === 重做 (Redo) ===
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

    const handleSelection = (target) => {
      // 🔍 Debug 日志 1: 看看函数有没有被触发
    console.log('1. handleSelection triggered. Target:', target);
        // 1. 点击空白处 -> 进入残影模式
        if (!target) {
          console.log('Target is null, disabling sidebar'); // Log
            setSidebarDisabled(true);
            return;
        }
console.log('2. Target Type:', target.type);
        // 2. 过滤特殊对象 (遮罩、不导出对象)
        if (target.isMaskObject || target.excludeFromExport) {
            return;
        }

        // 3. ✨ 过滤多选 (ActiveSelection)
        // 根据你的要求 "不需要多选"，这里检测到多选直接返回，不做任何路由跳转
        // 侧边栏保持上一次的状态，或者你可以选择在这里 setSidebarDisabled(true)
        if (target.type === 'activeSelection') {
             console.log('[Router] Multi-selection ignored.');
             return; 
        }

        // 4. ✨ 核心：将整个 target 对象传给 State
        // State 层会分析 target.type 或 target.customTab，决定跳到哪个 Tool + 哪个 Tab
        const routed = routeToObject(target);
        console.log('3. Routing result:', routed);
        // 5. 兜底逻辑：如果选中的对象在路由表里没配置（比如背景控制点）
        // 我们至少要保证侧边栏是“可用”的，而不是禁用的
        if (!routed) {
            setSidebarDisabled(false);
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
            isPotentialClick = false; // 判定为拖拽
        }
    });

    // ✨ 路由触发点 1: 点击松开 (主要交互)
   c.on("mouse:up", (opt) => {
        if (!isPotentialClick || c.isDrawingMode || cropObject.value) return;
        const target = c.getActiveObject();
        handleSelection(target);
    });

    // ✨ 路由触发点 2: 选区创建 (处理 API 调用 setActiveObject 或 框选)
    // 确保非点击产生的选中也能触发路由
   // 触发点 2: API 调用 (如 addText) 或 框选
    c.on("selection:created", (e) => {
        if (!isPotentialClick && (e.target || (e.selected && e.selected.length > 0))) { 
         handleSelection(e.target || e.selected[0]);
    }
    });
    
    // ✨ 路由触发点 3: 选区更新 (例如从单选变为多选)
    c.on("selection:updated", (e) => {
        handleSelection(e.target);
    });

    // ✨ 路由触发点 4: 选区清除 (进入残影)
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

  // === 通用 API ===
  const addImage = (url) => {
    fabric.Image.fromURL(
      url,
      (img) => {
        const canvasWidth = canvas.value.width;
        const canvasHeight = canvas.value.height;
        if (img.width > canvasWidth || img.height > canvasHeight) {
          const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height) * ZOOM_PADDING;
          img.scale(scale);
        }
        
        // 设置基础属性
        img.set({
          isMainImage: true,
          id: 'main-image'
        });
        
        zoom.value = canvas.value.getZoom();
        historyProcessing = true;
        
        canvas.value?.add(img);
        canvas.value?.centerObject(img);
        
        // ✨ 关键：触发选中事件，让系统自动路由到 (Adjust -> Filter)
        canvas.value?.setActiveObject(img); 
        
        historyProcessing = false;
        saveHistory();
        canvas.value.fire('image:updated');
      },
      { crossOrigin: "anonymous" }
    );
  };

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
        obj.set({
          stroke: obj._originalStroke,
          fill: obj._originalFill
        });
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
      left: 100,
      top: 100,
      fontSize: 40,
      fill: "#333",
      // ✨ 进阶用法演示（可选）：
      // 如果你想让这个特定的文本创建时直接跳到 "颜色" Tab，可以解开下面这行注释：
      // customTab: 'color' 
    });
    
    canvas.value.add(text);
    
    // ✨ 关键：这行代码会触发 fabric 的 'selection:created' 事件
    // 进而触发 handleSelection -> routeToObject -> 自动跳转到 Text 面板的 Style Tab
    canvas.value.setActiveObject(text);
    
    canvas.value.requestRenderAll(); // 刷新画布
    saveHistory(); // 记录历史
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