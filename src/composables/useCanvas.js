import { ref, shallowRef, markRaw, toRaw, unref, onMounted, onUnmounted } from "vue";
import { fabric } from "fabric";
// ✨ 引入 state 以便读取当前的 activeTool/activeTab
import { useEditorState, ZOOM_PADDING } from "./useEditorState";

import {
  registerCropModule,
  constrainCrop,
  cropObject,
  cancelCrop,
  rotateActive as rotateCrop,
  flipActive as flipCrop
} from "@/components/modules/adjust/useCanvasCrop";

const ROUTING_ALLOWLIST = ['ruler'];

export function useCanvas() {
  const canvas = shallowRef(null);
  // ✨ 获取 state 对象
  const { state, setHistoryState, setActiveTool, setSidebarDisabled, routeToObject } = useEditorState();
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
      canvas.value.toJSON([
        "id", "selectable", "name", "isMainImage", "isPuzzleImage", 
        "cellIndex", "isMaskObject",
        "customTab", "customTool", "isRuler", "excludeFromExport"
      ])
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

  const undo = () => { /* ...保持原样... */ 
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

  const redo = () => { /* ...保持原样... */ 
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

  const zoomToRect = (rect, minZoomLimit = 0.1) => { /* ...保持原样... */ 
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

  // === 🛡️ 路由安保核心 ===
  const handleSelection = (eventOrObject) => {
    let target = null;
    
    // 1. 解析目标
    if (eventOrObject && eventOrObject.selected) {
        target = eventOrObject.selected.find(obj => 
            obj.customTab && ROUTING_ALLOWLIST.includes(obj.customTab)
        );
        if (!target) target = eventOrObject.selected[0];
    } else {
        target = eventOrObject;
    }

    if (!target) {
      if (state.activeTool === 'adjust' && state.activeTab) return; 
      setSidebarDisabled(true);
      return;
    }

    // ✨✨✨ 独占模式拦截器 (Exclusive Mode Guard) 优化 ✨✨✨
    if (state.activeTool === 'adjust' && state.activeTab) {
        // ✨ 增加容错：如果点击的目标就是标尺，且我们正在处理标尺逻辑，则直接放行
        // 防止 state.activeTab 还没来得及更新导致的死锁
        const isRulerEmergency = target.isRuler || target.customTab === 'ruler';
        
        if (!isRulerEmergency && target.customTab !== state.activeTab) {
            console.log(`[Router] Blocked by Exclusive Mode. Current: ${state.activeTab}`);
            return;
        }
    }

    if (target.isMaskObject || target.excludeFromExport) return;

    // 白名单路由
    if (target.customTab && ROUTING_ALLOWLIST.includes(target.customTab)) {
        routeToObject(target);
    } else {
        setSidebarDisabled(false);
    }
  };

  const handleMouseDown = (opt) => {
      const target = opt.target;
      if (!target) return;

      // ✨ 唤醒逻辑也受独占模式约束
      if (state.activeTool === 'adjust' && state.activeTab && target.customTab !== state.activeTab) {
          return; // 拦截唤醒
      }

      const activeObj = canvas.value?.getActiveObject();
      if (activeObj === target) {
          handleSelection({ selected: [target] });
      }
  };

  // ... 初始化与辅助函数 (init, addImage, setZoom, etc.) 保持原样 ...
  // 为节省篇幅，后续函数未变动，请保持您原有的代码
  // 仅需确保 handleSelection 和 handleMouseDown 已按上述逻辑更新

  const init = (id, width, height) => {
    // ... 原有 init 代码 ...
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

    c.on("mouse:down", (opt) => {
      isPotentialClick = true;
      const pointer = c.getPointer(opt.e);
      dragStartPoint = { x: pointer.x, y: pointer.y };
      handleMouseDown(opt);
    });

    c.on("mouse:move", (opt) => {
      if (!isPotentialClick) return;
      const pointer = c.getPointer(opt.e);
      const dist = Math.sqrt(
        Math.pow(pointer.x - dragStartPoint.x, 2) +
        Math.pow(pointer.y - dragStartPoint.y, 2)
      );
      if (dist > 5) {
        isPotentialClick = false; 
      }
    });

    c.on("mouse:up", (opt) => {
      if (!isPotentialClick || c.isDrawingMode || cropObject.value) return;
      const target = c.getActiveObject();
      if (!target) {
          handleSelection(null);
      }
    });

    c.on("selection:created", (e) => {
      if (!isPotentialClick && (e.target || (e.selected && e.selected.length > 0))) {
        handleSelection(e); 
      }
    });

    c.on("selection:updated", (e) => {
      handleSelection(e); 
    });

    c.on("selection:cleared", () => {
      setSidebarDisabled(true);
    });
    
    // ... zoom event ...
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
  
  // ... helper functions ...
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
    }, { crossOrigin: "anonymous" });
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
    canvas.value.setBackgroundColor("#f3f3f3", () => { canvas.value.renderAll(); });
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
    activeObj.setSrc(newUrl, () => {
        canvas.value.renderAll();
        saveHistory();
        canvas.value.fire('image:updated');
      }, { crossOrigin: "anonymous" }
    );
  };

  const addText = (textStr = "双击编辑") => {
    if (!canvas.value) return;
    const text = new fabric.IText(textStr, {
      left: 100, top: 100, fontSize: 40, fill: "#333",
      // customTab: 'text' 
    });
    canvas.value.add(text);
    canvas.value.setActiveObject(text);
    canvas.value.requestRenderAll(); 
    saveHistory();
  };

  return {
    canvas, zoom, init, initImage, addImage, zoomIn, zoomOut, zoomReset, zoomToRect, setZoom,
    undo, redo, saveHistory, toggleDrawing, exportMask, replaceActiveImage, addText, rotateActive, flipActive
  };
}