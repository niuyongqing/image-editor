import { ref, shallowRef, markRaw, toRaw, unref, onMounted, onUnmounted } from "vue";
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

const ROUTING_ALLOWLIST = ['ruler'];

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

  // === 🕵️‍♂️ 调试核心：Handle Selection ===
  const handleSelection = (eventOrObject) => {
    console.group('🔍 [Router Debug] handleSelection Triggered');

    let target = null;
    let source = '';

    // 情况 A: 传入的是 Fabric 事件对象
    if (eventOrObject && eventOrObject.selected) {
      source = 'Event Object';
      console.log('📋 Raw Selected Array:', eventOrObject.selected.map(o => ({
        type: o.type,
        customTab: o.customTab,
        isRuler: o.isRuler,
        id: o.id
      })));

      // 智能雷达扫描
      target = eventOrObject.selected.find(obj =>
        obj.customTab && ROUTING_ALLOWLIST.includes(obj.customTab)
      );

      if (target) {
        console.log('✅ Smart Scan found WhiteListed Target:', target.customTab);
      } else {
        console.log('⚠️ Smart Scan failed, fallback to index 0');
        target = eventOrObject.selected[0];
      }
    }
    // 情况 B: 传入的是直接的对象
    else {
      source = 'Direct Object';
      target = eventOrObject;
      console.log('📦 Direct Target:', target ? { type: target.type, customTab: target.customTab } : 'NULL');
    }

    // 1. 无效目标
    if (!target) {
      console.log('❌ Target is null -> Disabling Sidebar');
      setSidebarDisabled(true);
      console.groupEnd();
      return;
    }

    // 2. 特殊对象过滤
    if (target.isMaskObject || target.excludeFromExport) {
      console.log('🛑 Ignored: Mask or ExcludeFromExport');
      console.groupEnd();
      return;
    }

    // 3. 多选过滤
    if (target.type === 'activeSelection') {
      console.log('🛑 Ignored: Multi-selection');
      console.groupEnd();
      return;
    }

    // 4. 白名单路由检查
    console.log(`🧐 Checking Whitelist for [${target.customTab}]...`);
    if (target.customTab && ROUTING_ALLOWLIST.includes(target.customTab)) {
      console.log('🚀 PASS! Routing to object...');
      const routed = routeToObject(target);
      console.log('🎉 Route Result:', routed);
    } else {
      console.log(`⛔ REJECTED: customTab '${target.customTab}' is not in allowlist:`, ROUTING_ALLOWLIST);
      setSidebarDisabled(false); // 保持开启但不跳转
    }
    console.groupEnd();
  };

  // === 🕵️‍♂️ 调试核心：Handle Mouse Down ===
  const handleMouseDown = (opt) => {
    const target = opt.target;
    // 只记录有意义的点击
    if (!target) return;

    console.group('🖱️ [Click Debug] Mouse Down');
    console.log('🎯 Clicked Target:', { type: target.type, customTab: target.customTab, isRuler: target.isRuler });

    const activeObj = canvas.value?.getActiveObject();
    console.log('🌟 Current Active Object:', activeObj ? { type: activeObj.type, customTab: activeObj.customTab } : 'NULL');

    // 如果点击的对象 **已经是** 当前激活的对象
    if (activeObj === target) {
      console.log('⚡ Wakeup Triggered! (Clicking already active object)');
      handleSelection({ selected: [target] });
    } else {
      console.log('💤 Normal Click (Fabric will handle selection:created)');
    }
    console.groupEnd();
  };

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

    c.on("mouse:down", (opt) => {
      isPotentialClick = true;
      const pointer = c.getPointer(opt.e);
      dragStartPoint = { x: pointer.x, y: pointer.y };
      // [调试] 绑定点击唤醒
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
      // 这里的 handleSelection 是为了兜底，防止 Fabric 事件没触发
      // 但在 mouse:down 里我们已经处理了 wakeup，所以这里主要是为了处理“点击空白取消选中”
      const target = c.getActiveObject();
      // 如果没有点到任何东西，target 为 null，handleSelection 会处理 disable sidebar
      if (!target) {
        handleSelection(null);
      }
    });

    // 路由触发点
    c.on("selection:created", (e) => {
      if (!isPotentialClick && (e.target || (e.selected && e.selected.length > 0))) {
        console.log('📡 Event: selection:created');
        handleSelection(e);
      }
    });

    c.on("selection:updated", (e) => {
      console.log('📡 Event: selection:updated');
      handleSelection(e);
    });

    c.on("selection:cleared", () => {
      console.log('📡 Event: selection:cleared');
      setSidebarDisabled(true);
    });

    // Zoom 事件 ... (保持原样)
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

  // ... 辅助函数 (addImage, addText 等) ...
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