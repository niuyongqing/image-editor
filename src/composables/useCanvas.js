// src/composables/useCanvas.js
import { ref, shallowRef, markRaw, toRaw } from "vue";
import { fabric } from "fabric";
import { useEditorState } from "./useEditorState";

// === 引入剪裁模块：使用 Singleton 模式，导入所有需要的公共方法和状态 ===
import { 
  registerCropModule, // 用于在 init 中注入 canvas 依赖
  constrainCrop, 
  cropObject, 
  startCrop, 
  cancelCrop,
  confirmCrop,
  setCropBoxSize,
  startManualSelection,
  isManualCropping,
  rotateActive as rotateCrop, // 别名，避免命名冲突
  flipActive as flipCrop
} from "@/components/modules/adjust/useCanvasCrop"; // <--- 修正后的路径

export function useCanvas() {
  const canvas = shallowRef(null);
  const { setHistoryState } = useEditorState();
  const zoom = ref(1);

  // === 历史记录 (保留在全局) ===
  const history = [];
  let historyIndex = -1;
  let historyProcessing = false;

  const saveHistory = () => {
    if (!canvas.value || historyProcessing) return;
    if (historyIndex < history.length - 1) {
      history.splice(historyIndex + 1);
    }
    const json = JSON.stringify(
      canvas.value.toJSON(["id", "selectable", "name"])
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
    setHistoryState(historyIndex > 0, historyIndex > 0);
  };
  
// === 撤销 (Undo) ===
  const undo = () => {
    // 【增强】确保有 canvas 实例，并且不在历史记录的起点
    if (!canvas.value || historyIndex <= 0 || historyProcessing) return;
    
    if (cropObject.value) cancelCrop(); 
    
    historyProcessing = true;
    historyIndex--;
    const content = history[historyIndex];
    
    // 使用可选链 ? 防止 canvas 在异步操作中变为 null
    canvas.value?.loadFromJSON(content, () => {
      canvas.value?.renderAll();
      historyProcessing = false;
      updateStoreHistory();
    });
  };

// === 重做 (Redo) ===
  const redo = () => {
    // 【修正】确保有 canvas 实例，并且不在历史记录的终点
    if (!canvas.value || historyIndex >= history.length - 1 || historyProcessing) return;
    
    if (cropObject.value) cancelCrop();

    historyProcessing = true;
    
    historyIndex++; // 【修正】前进到下一个历史状态
    const content = history[historyIndex];
    
    // 使用可选链 ? 防止 canvas 在异步操作中变为 null
    canvas.value?.loadFromJSON(content, () => {
      canvas.value?.renderAll();
      historyProcessing = false;
      updateStoreHistory();
    });
  };

  // === 初始化与事件 ===
  const init = (id, width, height) => {
    const c = new fabric.Canvas(id, {
      width: width,
      height: height,
      backgroundColor: "#f3f3f3",
      preserveObjectStacking: true,
    });
    canvas.value = markRaw(c);

    // 【关键步骤】注册 Crop 模块，注入依赖
    registerCropModule(canvas, saveHistory);

    // 绑定约束检查：无论移动什么，都检查裁剪框
    const checkConstraint = () => {
      if (cropObject.value) {
        constrainCrop(toRaw(cropObject.value));
      }
    };

    c.on("object:moving", checkConstraint);
    c.on("object:scaling", checkConstraint);
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
        if (newZoom > 5) newZoom = 5;
        if (newZoom < 0.1) newZoom = 0.1;
        c.zoomToPoint({ x: e.offsetX, y: e.offsetY }, newZoom);
        zoom.value = newZoom;
      },
      { passive: false }
    );

    saveHistory();
  };

  // === 通用 API ===
  // ... (addImage, setZoom, zoomIn, zoomOut, zoomReset, initImage 保持不变) ...
  const addImage = (url) => {
    fabric.Image.fromURL(
      url,
      (img) => {
        const canvasWidth = canvas.value.width;
        const canvasHeight = canvas.value.height;
        if (img.width > canvasWidth || img.height > canvasHeight) {
          const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height) * 0.8;
          img.scale(scale);
        }
        zoom.value = canvas.value.getZoom();
        historyProcessing = true;
        canvas.value?.add(img);
        canvas.value?.centerObject(img);
        canvas.value?.setActiveObject(img);
        historyProcessing = false;
        saveHistory();
      },
      { crossOrigin: "anonymous" }
    );
  };

  const setZoom = (value) => {
    if (!canvas.value) return;
    let newZoom = value;
    if (newZoom > 5) newZoom = 5;
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
  
  // 聚合：旋转/翻转 (优先使用 Crop 模块的逻辑，如果没有裁剪框则执行通用逻辑)
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

  // 其他工具 (保持不变)
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

  const exportMask = () => { /* ...保持之前的代码... */
    if (!canvas.value) return null;
    const originalBg = canvas.value.backgroundColor;
    const objects = canvas.value.getObjects();
    objects.forEach((obj) => {
      if (obj.type === "path") {
        obj._originalStroke = obj.stroke;
        obj.set({ stroke: "#ffffff" });
      } else {
        obj._originalOpacity = obj.opacity;
        obj.set({ opacity: 0 });
      }
    });
    canvas.value.setBackgroundColor("#000000", null);
    canvas.value.renderAll();
    const dataURL = canvas.value.toDataURL({ format: "png", multiplier: 1 });
    objects.forEach((obj) => {
      if (obj.type === "path") {
        obj.set({ stroke: obj._originalStroke || "rgba(255, 0, 0, 0.5)" });
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
    });
    canvas.value.add(text);
    canvas.value.setActiveObject(text);
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
    setZoom,
    undo,
    redo,
    saveHistory,
    toggleDrawing,
    exportMask,
    replaceActiveImage,
    addText,

    // === 导出 Crop API (直接导出导入的方法) ===
    startCrop,
    cancelCrop,
    confirmCrop,
    setCropBoxSize,
    startManualSelection,
    isManualCropping,
    rotateActive, 
    flipActive    
  };
}