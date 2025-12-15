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

  // === 1. 第一步：先限制缩放范围 (优先级最高) ===
  // 必须先确保宽度/高度合法，后续的位置计算才能准确。
  // 如果宽度超出了，先缩放回来，并更新 currentWidth 变量供下一步使用
  let currentWidth = activeObj.getScaledWidth();
  let currentHeight = activeObj.getScaledHeight();

  if (currentWidth > bgWidth) {
    activeObj.scaleToWidth(bgWidth);
    currentWidth = bgWidth; 
  }
  if (currentHeight > bgHeight) {
    activeObj.scaleToHeight(bgHeight);
    currentHeight = bgHeight;
  }

  // === 2. 第二步：再限制移动范围 ===
  // 此时 currentWidth 已经是修正后的大小了，基于它计算位置才不会跑偏
  let top = activeObj.top;
  let left = activeObj.left;

  // 左边界检查
  if (left < bgLeft) {
    activeObj.set("left", bgLeft);
    left = bgLeft; // 更新局部变量，供后续检查使用
  }
  // 上边界检查
  if (top < bgTop) {
    activeObj.set("top", bgTop);
    top = bgTop;
  }
  // 右边界检查 (left + width 不能超过 bgRight)
  if (left + currentWidth > bgLeft + bgWidth) {
    activeObj.set("left", bgLeft + bgWidth - currentWidth);
  }
  // 下边界检查 (top + height 不能超过 bgBottom)
  if (top + currentHeight > bgTop + bgHeight) {
    activeObj.set("top", bgTop + bgHeight - currentHeight);
  }

  // === 3. 第三步：解锁移动属性 ===
  // 显式设为 false，确保不会因为之前的状态导致无法拖动
  // 使用 2px 容差判断是否铺满，仅用于视觉提示
  const isFullWidth = Math.abs(currentWidth - bgWidth) < 2;
  const isFullHeight = Math.abs(currentHeight - bgHeight) < 2;

  activeObj.set({
    lockMovementX: false, 
    lockMovementY: false, 
    // 视觉优化：如果完全铺满，鼠标悬停在中间显示默认箭头，暗示不能"平移"（但依然可以通过控制点"缩放"）
    hoverCursor: (isFullWidth && isFullHeight) ? 'default' : 'move'
  });
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
// 【新增】标记比例是否锁定
const isRatioLocked = ref(false); 
// 【新增】记录当前的宽高比数值 (例如 1.5 或 0.5625)
const currentAspectRatio = ref(null);
/**
 * 应用特定的裁剪比例
 * @param {number|null} ratio - 宽高比 (width / height)，传入 null 表示自由比例
 */
export const setCropRatio = (ratio) => {
  if (!canvasRef?.value) return;
  const canvas = canvasRef.value;
  
  // 1. 设置状态
  if (ratio === null) {
    isRatioLocked.value = false;
    currentAspectRatio.value = null;
    
    // 如果已经有裁剪框，解锁它的缩放限制
    if (cropObject.value) {
      cropObject.value.set({ lockUniScaling: false });
      canvas.requestRenderAll();
    }
    return;
  }

  // 2. 锁定比例状态
  isRatioLocked.value = true;
  currentAspectRatio.value = ratio;

  // 3. 获取计算基准 (【关键修改】：强制始终基于原图计算)
  let baseW, baseH, left, top;
  const activeObj = canvas.getObjects().find((obj) => obj.type === "image");
  if (!activeObj) return;

  // 无论当前是否有 cropObject，都从 activeObj (背景图) 获取基准信息
  // 这样保证了“每次都按照最初读取到的图片真实尺寸为标准”
  const rect = activeObj.getBoundingRect();
  baseW = rect.width;
  baseH = rect.height;
  left = rect.left;
  top = rect.top;

  // 4. 【核心算法】计算最大内含尺寸 (Fit Inside)
  // 比较当前矩形的比例与目标比例
  const currentRatio = baseW / baseH;
  let newW, newH;

  if (currentRatio > ratio) {
    // 图片比目标更“宽”，以高度为基准 (高度撑满，宽度缩小)
    newH = baseH;
    newW = newH * ratio;
    // 居中调整 left
    left += (baseW - newW) / 2;
  } else {
    // 图片比目标更“瘦”，以宽度为基准 (宽度撑满，高度缩小)
    newW = baseW;
    newH = newW / ratio;
    // 居中调整 top
    top += (baseH - newH) / 2;
  }

  // 5. 应用或创建裁剪框
  if (cropObject.value) {
    cropObject.value.set({
      width: newW,
      height: newH,
      left: left,
      top: top,
      scaleX: 1, // 重置缩放，直接改宽高
      scaleY: 1,
      lockUniScaling: true // 锁定等比缩放
    });
    cropObject.value.setCoords();
    // 立即进行边界约束检查
    constrainCrop(cropObject.value); 
    canvas.requestRenderAll();
  } else {
    // 如果还没开始裁剪，直接启动
    startCrop(ratio, { left, top, width: newW, height: newH });
  }
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
export { 
  cropObject, 
  isManualCropping,
  isRatioLocked,
  currentAspectRatio,
};