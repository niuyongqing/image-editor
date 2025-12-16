// src/components/modules/adjust/useCanvasCrop.js
import { ref, shallowRef, toRaw } from "vue";
import { fabric } from "fabric";

// === 状态变量 ===
const cropObject = shallowRef(null);
const isManualCropping = ref(false);
const isCropping = ref(false);
const isRatioLocked = ref(false); 
const currentAspectRatio = ref(null);

// 用于实时向 UI 传递当前选区/裁剪框的宽高
const currentSelectionDims = ref({ width: 0, height: 0 });

// 内部引用
let canvasRef = null;
let saveHistoryFn = null;
let zoomToRectFn = null;

// 内部变量
let selectionRect = null;
let maskRect = null;
let selectionStartX = 0;
let selectionStartY = 0;
let aspectRatioValue = null;
let savedWheelListeners = []; 

export const registerCropModule = (canvas, saveHistory, zoomToRect) => {
  canvasRef = canvas;
  saveHistoryFn = saveHistory;
  zoomToRectFn = zoomToRect;
};

// =========================================================
// 核心工具：获取逻辑坐标 (不受 Zoom 影响的真实尺寸)
// =========================================================
const getLogicRect = (obj) => {
  if (!canvasRef?.value || !obj) return { left: 0, top: 0, width: 0, height: 0 };
  
  const canvas = canvasRef.value;
  const zoom = canvas.getZoom(); // 获取当前的相机缩放
  const vpt = canvas.viewportTransform;
  
  // 获取屏幕坐标系的包围盒
  const rawRect = obj.getBoundingRect();
  
  // 反算回逻辑坐标系 (绝对像素)
  return {
    left: (rawRect.left - vpt[4]) / zoom,
    top: (rawRect.top - vpt[5]) / zoom,
    width: rawRect.width / zoom,
    height: rawRect.height / zoom
  };
};

// 【新增】统一更新 UI 数值的辅助函数
// 确保每次 UI 拿到的都是“逻辑尺寸”，解决了显示为 0 或显示不准的问题
const updateCurrentDims = (obj) => {
  if (!obj) return;
  const rect = getLogicRect(obj);
  currentSelectionDims.value = {
    width: Math.round(rect.width),
    height: Math.round(rect.height)
  };
};

// =========================================================
// 滚轮拦截逻辑
// =========================================================
const preventZoomWheel = (opt) => {
  if (!opt || !opt.e) return;
  opt.e.preventDefault();
  opt.e.stopPropagation();
  if (opt.e.stopImmediatePropagation) opt.e.stopImmediatePropagation();
};

export const openCropPanel = () => {
  if (!canvasRef?.value) return;
  if (isCropping.value) return; 

  const canvas = canvasRef.value;
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
  canvas.fire('zoom:change', { from: 'crop-module' });
  
  if (canvas.__eventListeners && canvas.__eventListeners['mouse:wheel']) {
    savedWheelListeners = [...canvas.__eventListeners['mouse:wheel']];
    canvas.off('mouse:wheel');
  }
  canvas.on('mouse:wheel', preventZoomWheel);
  
  isCropping.value = true;
};

export const closeCropPanel = () => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  cancelCrop(); 
  canvas.off('mouse:wheel', preventZoomWheel);
  if (savedWheelListeners.length > 0) {
    savedWheelListeners.forEach(handler => {
      canvas.on('mouse:wheel', handler);
    });
    savedWheelListeners = [];
  }
  isCropping.value = false;
  canvas.fire('zoom:change'); 
};

// =========================================================
// 核心逻辑：约束
// =========================================================
export const constrainCrop = (activeObj) => {
  if (!canvasRef?.value || !activeObj) return;

  const bgImage = canvasRef.value.getObjects().find((o) => o.type === "image");
  if (!bgImage) return;

  const bgRect = getLogicRect(bgImage);
  const bgWidth = bgRect.width;
  const bgHeight = bgRect.height;
  const bgLeft = bgRect.left;
  const bgTop = bgRect.top;

  let currentScaleX = activeObj.scaleX;
  let currentScaleY = activeObj.scaleY;
  
  let cropCurrentWidth = activeObj.width * currentScaleX;
  let cropCurrentHeight = activeObj.height * currentScaleY;

  let sizeChanged = false;

  if (cropCurrentWidth > bgWidth + 0.5) {
    currentScaleX = bgWidth / activeObj.width;
    sizeChanged = true;
  }
  if (cropCurrentHeight > bgHeight + 0.5) {
    currentScaleY = bgHeight / activeObj.height;
    sizeChanged = true;
  }
  if (sizeChanged) {
    activeObj.set({ scaleX: currentScaleX, scaleY: currentScaleY });
    activeObj.setCoords(); 
  }

  const finalCropWidth = activeObj.getScaledWidth();
  const finalCropHeight = activeObj.getScaledHeight();

  const minLeft = bgLeft;
  const maxLeft = bgLeft + bgWidth - finalCropWidth;
  const minTop = bgTop;
  const maxTop = bgTop + bgHeight - finalCropHeight;

  let newLeft = Math.max(minLeft, Math.min(activeObj.left, maxLeft));
  let newTop = Math.max(minTop, Math.min(activeObj.top, maxTop));

  activeObj.set({ left: newLeft, top: newTop });
  activeObj.setCoords(); 
  
  // 【关键修复】使用统一方法更新 UI，防止显示为 0 或受 Zoom 影响
  updateCurrentDims(activeObj);

  canvasRef.value.requestRenderAll();
};

export const cancelCrop = () => {
  if (canvasRef?.value && cropObject.value) {
    const rawObj = toRaw(cropObject.value);
    canvasRef.value.remove(rawObj);
    cropObject.value = null;
    canvasRef.value.renderAll();
  }
};

// === 手动选区 ===
export const endManualSelectionMode = () => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.selection = true;
  canvas.getObjects().forEach(o => {
    if (o !== maskRect && o !== selectionRect) {
      o.selectable = true;
      o.evented = true;
    }
  });
  canvas.off('mouse:down', onSelectionDown);
  canvas.off('mouse:move', onSelectionMove);
  canvas.off('mouse:up', onSelectionUp);
  if (selectionRect) { canvas.remove(selectionRect); selectionRect = null; }
  if (maskRect) { canvas.remove(maskRect); maskRect = null; }
  isManualCropping.value = false;
  canvas.requestRenderAll();
};

const onSelectionDown = (opt) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const pointer = canvas.getPointer(opt.e); // 已经是逻辑坐标
  selectionStartX = pointer.x;
  selectionStartY = pointer.y;

  selectionRect = new fabric.Rect({
    left: selectionStartX,
    top: selectionStartY,
    width: 0,
    height: 0,
    fill: 'transparent',
    stroke: '#fff',
    strokeWidth: 2,
    strokeDashArray: [6, 6],
    selectable: false,
    evented: false
  });
  canvas.add(selectionRect);
  canvas.bringToFront(selectionRect);
};

const onSelectionMove = (opt) => {
  if (!selectionRect || !canvasRef.value) return;
  const pointer = canvasRef.value.getPointer(opt.e); // 已经是逻辑坐标
  let w = Math.abs(pointer.x - selectionStartX);
  let h = Math.abs(pointer.y - selectionStartY);
  let left = selectionStartX;
  let top = selectionStartY;
  if (pointer.x < selectionStartX) left = pointer.x;
  if (pointer.y < selectionStartY) top = pointer.y;
  
  selectionRect.set({ left, top, width: w, height: h });
  
  // 手动选区的 pointer 本身就是逻辑坐标，直接用即可
  currentSelectionDims.value = {
    width: Math.round(w),
    height: Math.round(h)
  };

  canvasRef.value.requestRenderAll();
};

const onSelectionUp = () => {
  if (!selectionRect) {
    endManualSelectionMode();
    if (cropObject.value) cancelCrop();
    return;
  }
  const box = {
    left: selectionRect.left,
    top: selectionRect.top,
    width: selectionRect.width,
    height: selectionRect.height
  };
  
  endManualSelectionMode();
  if (box.width < 10 || box.height < 10) return;
  startCrop(null, box);
  
  if (zoomToRectFn) {
      zoomToRectFn(box);
  }
};

export const startManualSelection = () => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  cancelCrop(); 
  canvas.getObjects().forEach(o => { o.selectable = false; o.evented = false; });
  maskRect = new fabric.Rect({
    left: -5000, top: -5000, width: 20000, height: 20000,
    fill: 'rgba(0, 0, 0, 0.45)', selectable: false, evented: false, excludeFromExport: true
  });
  canvas.add(maskRect);
  canvas.defaultCursor = 'crosshair'; 
  canvas.hoverCursor = 'crosshair';   
  canvas.selection = false;           
  isManualCropping.value = true;
  canvas.on('mouse:down', onSelectionDown);
  canvas.on('mouse:move', onSelectionMove);
  canvas.on('mouse:up', onSelectionUp);
  canvas.requestRenderAll();
};

// =========================================================
// 设置比例
// =========================================================
export const setCropRatio = (ratio) => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  
  if (ratio === null) {
    isRatioLocked.value = false;
    currentAspectRatio.value = null;
    if (cropObject.value) {
      cropObject.value.set({ lockUniScaling: false });
      canvas.requestRenderAll();
    }
    return;
  }

  isRatioLocked.value = true;
  currentAspectRatio.value = ratio;

  let baseW, baseH, left, top;
  const activeObj = canvas.getObjects().find((obj) => obj.type === "image");
  if (!activeObj) return;

  const rect = getLogicRect(activeObj);
  baseW = rect.width;
  baseH = rect.height;
  left = rect.left;
  top = rect.top;

  const currentRatio = baseW / baseH;
  let newW, newH;

  if (currentRatio > ratio) {
    newH = baseH;
    newW = newH * ratio;
    left += (baseW - newW) / 2;
  } else {
    newW = baseW;
    newH = newW / ratio;
    top += (baseH - newH) / 2;
  }

  if (cropObject.value) {
    cropObject.value.set({
      width: newW, height: newH, left: left, top: top,
      scaleX: 1, scaleY: 1, lockUniScaling: true 
    });
    cropObject.value.setCoords();
    constrainCrop(cropObject.value); 
    canvas.requestRenderAll();
  } else {
    startCrop(ratio, { left, top, width: newW, height: newH });
  }
};

// =========================================================
// startCrop (修复初始化尺寸为0的问题)
// =========================================================
export const startCrop = (aspectRatio = null, customBox = null) => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  if (isManualCropping.value) endManualSelectionMode();

  aspectRatioValue = aspectRatio || null;
  let activeObj = canvas.getObjects().find((obj) => obj.type === "image");
  if (!activeObj) return;

  cancelCrop();

  const rect = getLogicRect(activeObj);
  let width, height, left, top;

  if (customBox) {
    width = customBox.width;
    height = customBox.height;
    left = customBox.left;
    top = customBox.top;
  } else {
    const imgWidth = rect.width;
    const imgHeight = rect.height;
    width = imgWidth * 1;
    height = imgHeight * 1;
    if (aspectRatio) {
      height = width / aspectRatio;
      if (height > imgHeight) {
        height = imgHeight;
        width = height * aspectRatio;
      }
      isRatioLocked.value = true;
      currentAspectRatio.value = aspectRatio;
    }else{
      isRatioLocked.value = false;
      currentAspectRatio.value = null;
    }
    left = rect.left + (imgWidth - width) / 2;
    top = rect.top + (imgHeight - height) / 2;
  }

  const cropZone = new fabric.Rect({
    left: left, top: top, width: width, height: height,
    fill: "transparent", stroke: "#409eff", strokeWidth: 2,
    cornerColor: "white", cornerStrokeColor: "#409eff", cornerSize: 12,
    transparentCorners: false, lockRotation: true, hasRotatingPoint: false,
    lockUniScaling: !!aspectRatio 
  });
  if (aspectRatio) {
    cropZone.set("height", width / aspectRatio);
  }

  canvas.add(cropZone);
  canvas.setActiveObject(cropZone);
  cropObject.value = cropZone;
  canvas.renderAll();
  
  // 【关键修复】创建完选框后，立即计算其逻辑尺寸并同步给 UI
  // 之前如果使用 getScaledWidth() 可能会因为还没渲染或 Scale 未生效导致为 0
  updateCurrentDims(cropZone);

  constrainCrop(cropZone);
};

export const confirmCrop = () => {
  if (!canvasRef?.value || !cropObject.value) return;
  const canvas = canvasRef.value;
  const cropRect = cropObject.value;
  const bgImage = canvas.getObjects().find((o) => o.type === "image");
  
  if (!bgImage) return cancelCrop();

  const prevVpt = [...canvas.viewportTransform];
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  cropRect.visible = false;
  const currentImageScale = bgImage.scaleX || 1;
  const multiplier = 1 / currentImageScale; 

  const croppedDataUrl = canvas.toDataURL({
    left: cropRect.left,
    top: cropRect.top,
    width: cropRect.getScaledWidth(),
    height: cropRect.getScaledHeight(),
    format: "png",
    multiplier: multiplier, 
  });

  canvas.setViewportTransform(prevVpt);

  bgImage.setSrc(croppedDataUrl, () => {
    bgImage.set({
      originX: "center", originY: "center",
      left: canvas.width / 2, top: canvas.height / 2,
      scaleX: 1 / multiplier, scaleY: 1 / multiplier,
      angle: 0, flipX: false, flipY: false,
    });
    
    bgImage.setCoords();
    cancelCrop();
    canvas.centerObject(bgImage);

    // 相机适配
    const imgWidth = bgImage.width * bgImage.scaleX;
    const imgHeight = bgImage.height * bgImage.scaleY;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const paddingFactor = 0.9;
    const zoomToFit = Math.min(
        (canvasWidth * paddingFactor) / imgWidth,
        (canvasHeight * paddingFactor) / imgHeight
    );
    
    canvas.setZoom(zoomToFit);
    const vpt = canvas.viewportTransform;
    vpt[4] = (canvasWidth / 2) * (1 - zoomToFit);
    vpt[5] = (canvasHeight / 2) * (1 - zoomToFit);
    canvas.setViewportTransform(vpt);

    canvas.fire('zoom:change', { from: 'crop-confirm' });
    canvas.requestRenderAll();
    if (saveHistoryFn) saveHistoryFn();
  });
};

export const setCropBoxSize = (width, height) => {
  if (!cropObject.value || !canvasRef?.value) return;
  cropObject.value.set({ width, height });
  cropObject.value.setCoords();
  canvasRef.value.renderAll();
  constrainCrop(cropObject.value);
};

export const rotateActive = (angle) => {
  if (cropObject.value && canvasRef?.value) {
    const canvas = canvasRef.value;
    const bgImage = canvas.getObjects().find((o) => o.type === "image");
    if (bgImage) {
      bgImage.rotate((bgImage.angle || 0) + angle);
      canvas.centerObject(bgImage);
      bgImage.setCoords();
      canvas.renderAll();
      startCrop(aspectRatioValue);
    }
    return true;
  }
  return false;
};

export const flipActive = (axis) => {
  if (cropObject.value && canvasRef?.value) {
    const canvas = canvasRef.value;
    const bgImage = canvas.getObjects().find((o) => o.type === "image");
    if (bgImage) {
      if (axis === "X") bgImage.set("flipX", !bgImage.flipX);
      if (axis === "Y") bgImage.set("flipY", !bgImage.flipY);
      canvas.requestRenderAll();
    }
    return true;
  }
  return false;
};

export { 
  cropObject, 
  isManualCropping,
  isRatioLocked,
  currentAspectRatio,
  isCropping,
  currentSelectionDims 
};