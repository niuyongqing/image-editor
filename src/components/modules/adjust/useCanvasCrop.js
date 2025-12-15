// src/components/modules/adjust/useCanvasCrop.js
import { ref, shallowRef, toRaw } from "vue";
import { fabric } from "fabric";

// === 【关键】状态提升到模块作用域（单例模式） ===
// 这样在任何组件 import 这些变量时，拿到的都是同一份引用
const cropObject = shallowRef(null);
const isManualCropping = ref(false);

// 内部持有 canvas 和 saveHistory 的引用
// 它们将在 registerCropModule 中被赋值
let canvasRef = null;
let saveHistoryFn = null;

// 内部变量
let selectionRect = null;
let maskRect = null;
let selectionStartX = 0;
let selectionStartY = 0;
let aspectRatioValue = null;

/**
 * 注册模块：由 useCanvas 在初始化时调用，注入 canvas 实例
 */
export const registerCropModule = (canvas, saveHistory) => {
  canvasRef = canvas;
  saveHistoryFn = saveHistory;
};

// === 核心功能：约束逻辑 ===
export const constrainCrop = (activeObj) => {
  // 注意：这里使用 canvasRef.value
  if (!canvasRef?.value || !activeObj) return;

  const cropRaw = toRaw(cropObject.value);
  if (!cropRaw || (activeObj !== cropRaw && toRaw(activeObj) !== cropRaw)) return;

  const bgImage = canvasRef.value.getObjects().find((o) => o.type === "image");
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

  // 限制移动
  if (left < bgLeft) activeObj.set("left", bgLeft);
  if (top < bgTop) activeObj.set("top", bgTop);
  if (left + width > bgLeft + bgWidth)
    activeObj.set("left", bgLeft + bgWidth - width);
  if (top + height > bgTop + bgHeight)
    activeObj.set("top", bgTop + bgHeight - height);

  // 限制缩放
  const currentWidth = activeObj.getScaledWidth();
  const currentHeight = activeObj.getScaledHeight();
  if (currentWidth > bgWidth) activeObj.scaleToWidth(bgWidth);
  if (currentHeight > bgHeight) activeObj.scaleToHeight(bgHeight);

  // 二次检查
  if (activeObj.left < bgLeft) activeObj.set("left", bgLeft);
  if (activeObj.top < bgTop) activeObj.set("top", bgTop);
};

// === 核心功能：取消裁剪 ===
export const cancelCrop = () => {
  if (canvasRef?.value && cropObject.value) {
    const rawObj = toRaw(cropObject.value);
    canvasRef.value.remove(rawObj);
    cropObject.value = null;
    canvasRef.value.renderAll();
  }
};

// === 手动选区逻辑 ===
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

  if (selectionRect) {
    canvas.remove(selectionRect);
    selectionRect = null;
  }
  if (maskRect) {
    canvas.remove(maskRect);
    maskRect = null;
  }
  
  isManualCropping.value = false;
  canvas.requestRenderAll();
};

const onSelectionDown = (opt) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const pointer = canvas.getPointer(opt.e);
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
  const pointer = canvasRef.value.getPointer(opt.e);
  let w = Math.abs(pointer.x - selectionStartX);
  let h = Math.abs(pointer.y - selectionStartY);
  let left = selectionStartX;
  let top = selectionStartY;
  if (pointer.x < selectionStartX) left = pointer.x;
  if (pointer.y < selectionStartY) top = pointer.y;
  selectionRect.set({ left, top, width: w, height: h });
  canvasRef.value.requestRenderAll();
};

const onSelectionUp = () => {
  if (!selectionRect) {
    endManualSelectionMode();
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
};

export const startManualSelection = () => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  cancelCrop(); 
  
  canvas.getObjects().forEach(o => {
    o.selectable = false;
    o.evented = false; 
  });

  maskRect = new fabric.Rect({
    left: -5000, 
    top: -5000,
    width: 20000, 
    height: 20000,
    fill: 'rgba(0, 0, 0, 0.45)', 
    selectable: false,
    evented: false, 
    excludeFromExport: true
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

// === 核心功能：开始裁剪 ===
export const startCrop = (aspectRatio = null, customBox = null) => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  
  if (isManualCropping.value) endManualSelectionMode();

  aspectRatioValue = aspectRatio || null;
  let activeObj = canvas.getObjects().find((obj) => obj.type === "image");
  if (!activeObj) return;

  cancelCrop();

  const rect = activeObj.getBoundingRect();
  let width, height, left, top;

  if (customBox) {
    width = customBox.width;
    height = customBox.height;
    left = customBox.left;
    top = customBox.top;
  } else {
    const imgWidth = rect.width;
    const imgHeight = rect.height;
    width = imgWidth * 0.8;
    height = imgHeight * 0.8;

    if (aspectRatio) {
      height = width / aspectRatio;
      if (height > imgHeight) {
        height = imgHeight;
        width = height * aspectRatio;
      }
    }
    left = rect.left + (imgWidth - width) / 2;
    top = rect.top + (imgHeight - height) / 2;
  }

  const cropZone = new fabric.Rect({
    left: left,
    top: top,
    width: width,
    height: height,
    fill: "transparent",
    stroke: "#409eff",
    strokeWidth: 2,
    cornerColor: "white",
    cornerStrokeColor: "#409eff",
    cornerSize: 12,
    transparentCorners: false,
    lockRotation: true,
    hasRotatingPoint: false,
    lockUniScaling: !!aspectRatio 
  });

  if (aspectRatio) {
    cropZone.set("height", width / aspectRatio);
  }

  canvas.add(cropZone);
  canvas.setActiveObject(cropZone);
  cropObject.value = cropZone;
  canvas.renderAll();
  
  constrainCrop(cropZone);
};

// === 核心功能：确认裁剪 ===
export const confirmCrop = () => {
  if (!canvasRef?.value || !cropObject.value) return;
  const canvas = canvasRef.value;
  const cropRect = cropObject.value;
  const bgImage = canvas.getObjects().find((o) => o.type === "image");
  if (!bgImage) return cancelCrop();

  cropRect.visible = false;
  
  const croppedDataUrl = canvas.toDataURL({
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
    canvas.renderAll();
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

// === 旋转和翻转 ===
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

// 导出状态，供外部监听
export { cropObject, isManualCropping };