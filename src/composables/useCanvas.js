import { ref, shallowRef, markRaw, toRaw } from "vue";
import { fabric } from "fabric";
// 确保这里的路径与你项目实际结构一致
import { useEditorState } from "./useEditorState";

let aspectRatioValue = null;

export function useCanvas() {
  // 使用 shallowRef 避免 Vue 深度代理导致 Fabric 对象移除失败
  const canvas = shallowRef(null);
  const cropObject = shallowRef(null);
  const { setHistoryState } = useEditorState();
  const zoom = ref(1);

  // === 历史记录状态 ===
  const history = [];
  let historyIndex = -1;
  let historyProcessing = false;

  // === 1. 保存历史记录 ===
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
    setHistoryState(
      historyIndex > 0,
      historyIndex > 0
    );
  };

  // === 2. 撤销 ===
  const undo = () => {
    if (historyIndex <= 0 || historyProcessing) return;
    if (cropObject.value) {
      cancelCrop();
    }
    historyProcessing = true;
    historyIndex--;

    const content = history[historyIndex];
    canvas.value.loadFromJSON(content, () => {
      canvas.value.renderAll();
      historyProcessing = false;
      updateStoreHistory();
    });
  };

  // === 3. 重做 ===
  const redo = () => {
    if (historyIndex === 0 || historyProcessing) return;
    if (cropObject.value) {
      cancelCrop();
    }
    historyProcessing = true;
    historyIndex = 0;

    const content = history[historyIndex];
    canvas.value.loadFromJSON(content, () => {
      canvas.value.renderAll();
      historyProcessing = false;
      updateStoreHistory();
    });
  };

  // === 核心限制逻辑：确保裁剪框不超出底图 ===
  const constrainCrop = (activeObj) => {
    if (!canvas.value || !activeObj) return;

    const cropRect = toRaw(cropObject.value);
    if (!cropRect || activeObj !== cropRect) return;

    const bgImage = canvas.value.getObjects().find((o) => o.type === "image");
    if (!bgImage) return;

    const rect = bgImage.getBoundingRect();
    const bgWidth = rect.width;
    const bgHeight = rect.height;
    const bgLeft = rect.left;
    const bgTop = rect.top;

    let top = activeObj.top;
    let left = activeObj.left;
    const scaleX = activeObj.scaleX;
    const scaleY = activeObj.scaleY;
    const width = activeObj.width * scaleX;
    const height = activeObj.height * scaleY;

    // --- 限制移动 ---
    if (left < bgLeft) activeObj.set("left", bgLeft);
    if (top < bgTop) activeObj.set("top", bgTop);
    if (left + width > bgLeft + bgWidth)
      activeObj.set("left", bgLeft + bgWidth - width);
    if (top + height > bgTop + bgHeight)
      activeObj.set("top", bgTop + bgHeight - height);

    // --- 限制缩放 ---
    const currentWidth = activeObj.getScaledWidth();
    const currentHeight = activeObj.getScaledHeight();

    if (currentWidth > bgWidth) activeObj.scaleToWidth(bgWidth);
    if (currentHeight > bgHeight) activeObj.scaleToHeight(bgHeight);

    // 二次检查位置
    if (activeObj.left < bgLeft) activeObj.set("left", bgLeft);
    if (activeObj.top < bgTop) activeObj.set("top", bgTop);
  };

  // === 初始化 ===
  const init = (id, width, height) => {
    const c = new fabric.Canvas(id, {
      width: width,
      height: height,
      backgroundColor: "#f3f3f3",
      preserveObjectStacking: true,
    });
    canvas.value = markRaw(c);

    // === 绑定 Fabric 事件 ===
    c.on("object:moving", (e) => constrainCrop(e.target));
    c.on("object:scaling", (e) => constrainCrop(e.target));
    c.on("object:modified", (e) => {
      if (e.target && e.target.type !== "rect") saveHistory();
    });
    c.on("object:added", (e) => {
      if (e.target && e.target.type !== "rect") saveHistory();
    });
    c.on("object:removed", (e) => {
      if (e.target && e.target.type !== "rect") saveHistory();
    });

    // 绑定原生 Wheel 事件
    // 注意：这里显式设置 { passive: false } 是为了允许调用 e.preventDefault()
    // 这会导致 Chrome 报 [Violation] 警告，这是正常的性能提示，请忽略。
    const canvasEl = c.upperCanvasEl;
    canvasEl.addEventListener(
      "wheel",
      (e) => {
        // 1. 阻止默认的页面滚动行为 (必须在 passive: false 下才生效)
        e.preventDefault();
        e.stopPropagation();

        // 2. 执行缩放逻辑
        const delta = e.deltaY;
        let newZoom = c.getZoom();

        // 0.999 ** delta 提供了平滑的指数缩放体验
        newZoom *= 0.999 ** delta;

        // 限制缩放范围 (10% ~ 500%)
        if (newZoom > 5) newZoom = 5;
        if (newZoom < 0.1) newZoom = 0.1;

        // 以鼠标指针为中心进行缩放
        c.zoomToPoint({ x: e.offsetX, y: e.offsetY }, newZoom);

        // 更新响应式状态
        zoom.value = newZoom;
      },
      { passive: false } // <--- 这一行是必须的，不要删除
    );

    saveHistory();
  };

  const addImage = (url) => {
    fabric.Image.fromURL(
      url,
      (img) => {
        const canvasWidth = canvas.value.width;
        const canvasHeight = canvas.value.height;

        // 自适应缩放
        if (img.width > canvasWidth || img.height > canvasHeight) {
          const scale =
            Math.min(canvasWidth / img.width, canvasHeight / img.height) * 0.8;
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

  // === 裁剪模式 ===
  const startCrop = (aspectRatio = null) => {
    if (!canvas.value) return;
    aspectRatioValue = aspectRatio || null;
    let activeObj = canvas.value.getObjects().find((obj) => obj.type === "image");
    if (!activeObj) return;

    cancelCrop();

    const rect = activeObj.getBoundingRect();
    const imgWidth = rect.width;
    const imgHeight = rect.height;

    let width = imgWidth * 0.8;
    let height = imgHeight * 0.8;

    if (aspectRatio) {
      height = width / aspectRatio;
      if (height > imgHeight) {
        height = imgHeight;
        width = height * aspectRatio;
      }
    }

    const cropZone = new fabric.Rect({
      left: rect.left + (imgWidth - width) / 2,
      top: rect.top + (imgHeight - height) / 2,
      width: width,
      height: height,
      fill: "rgba(0,0,0,0.3)",
      stroke: "#409eff",
      strokeWidth: 2,
      cornerColor: "white",
      cornerStrokeColor: "#409eff",
      cornerSize: 10,
      transparentCorners: false,
      lockRotation: true,
      hasRotatingPoint: false,
    });

    if (aspectRatio) {
      cropZone.set({ lockUniScaling: true });
      cropZone.set("height", width / aspectRatio);
    } else {
      cropZone.set({ lockUniScaling: false });
    }

    canvas.value.add(cropZone);
    canvas.value.setActiveObject(cropZone);
    cropObject.value = cropZone;
    canvas.value.renderAll();
  };

  const setCropBoxSize = (width, height) => {
    if (!cropObject.value || !canvas.value) return;
    cropObject.value.set({ width, height });
    cropObject.value.setCoords();
    canvas.value.renderAll();
  };

  const confirmCrop = () => {
    if (!canvas.value || !cropObject.value) return;
    const cropRect = cropObject.value;
    const bgImage = canvas.value.getObjects().find((o) => o.type === "image");
    if (!bgImage) return cancelCrop();

    cropRect.visible = false;
    const croppedDataUrl = canvas.value.toDataURL({
      left: cropRect.left,
      top: cropRect.top,
      width: cropRect.getScaledWidth(),
      height: cropRect.getScaledHeight(),
      format: "png",
      multiplier: 1,
    });

    bgImage.setSrc(croppedDataUrl, () => {
      bgImage.set({
        originX: "left",
        originY: "top",
        left: cropRect.left,
        top: cropRect.top,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        flipX: false,
        flipY: false,
        width: cropRect.getScaledWidth(),
        height: cropRect.getScaledHeight(),
      });
      bgImage.setCoords();
      cancelCrop();
      canvas.value.renderAll();
      saveHistory();
    });
  };

  const cancelCrop = () => {
    if (canvas.value && cropObject.value) {
      const rawObj = toRaw(cropObject.value);
      canvas.value.remove(rawObj);
      cropObject.value = null;
      canvas.value.renderAll();
    }
  };

  const rotateActive = (angle) => {
    if (cropObject.value) {
      const bgImage = canvas.value.getObjects().find((o) => o.type === "image");
      if (bgImage) {
        bgImage.rotate((bgImage.angle || 0) + angle);
        canvas.value.centerObject(bgImage);
        bgImage.setCoords();
        canvas.value.renderAll();
        startCrop(aspectRatioValue);
      }
      return;
    }
    const activeObj = canvas.value?.getActiveObject();
    if (activeObj) {
      activeObj.rotate((activeObj.angle || 0) + angle);
      canvas.value.requestRenderAll();
      saveHistory();
    }
  };

  const flipActive = (axis) => {
    if (cropObject.value) {
      const bgImage = canvas.value?.getObjects().find((o) => o.type === "image");
      if (bgImage) {
        if (axis === "X") bgImage.set("flipX", !bgImage.flipX);
        if (axis === "Y") bgImage.set("flipY", !bgImage.flipY);
        canvas.value.requestRenderAll();
      }
      return;
    }
    const activeObj = canvas.value?.getActiveObject();
    if (activeObj) {
      if (axis === "X") activeObj.set("flipX", !activeObj.flipX);
      if (axis === "Y") activeObj.set("flipY", !activeObj.flipY);
      canvas.value.requestRenderAll();
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
    zoomIn,
    zoomOut,
    zoomReset,
    setZoom,
    init,
    initImage,
    addImage,
    startCrop,
    setCropBoxSize,
    confirmCrop,
    cancelCrop,
    rotateActive,
    flipActive,
    toggleDrawing,
    exportMask,
    replaceActiveImage,
    addText,
    undo,
    redo,
    saveHistory,
  };
}