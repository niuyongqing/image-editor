// src/components/modules/adjust/useCanvasResize.js

import { ref, unref, shallowRef, toRaw } from "vue";
import { fabric } from "fabric";

let canvasRef = null;
let saveHistoryFn = null;

// === 预览相关状态 ===
const previewRect = shallowRef(null);
let isDraggingImage = false;
let dragLastX = 0;
let dragLastY = 0;

// 记录交互状态 & 原始变换状态 (用于取消或切换模式时恢复)
let originalSelectable = true;
let originalEvented = true;
let originalTransform = null; // 新增：用于保存图片原始的缩放和位置

export const registerResizeModule = (canvas, saveHistory) => {
  canvasRef = canvas;
  saveHistoryFn = saveHistory;
};

export const getCurrentSize = () => {
  const canvas = unref(canvasRef);
  if (!canvas) return { width: 0, height: 0 };

  // 查找画布上的背景图片
  const bgImage = canvas.getObjects().find(o => o.type === 'image');

  if (bgImage) {
    // ✅ 返回图片当前的缩放宽高（即它在画布上看起来的大小）
    return {
      width: Math.round(bgImage.getScaledWidth()),
      height: Math.round(bgImage.getScaledHeight())
    };
  }

  // 兜底返回容器大小
  return { width: canvas.width, height: canvas.height };
};

// =========================================================
// 核心工具
// =========================================================
const getLogicRect = (obj) => {
  if (!canvasRef?.value || !obj) return { left: 0, top: 0, width: 0, height: 0 };
  const canvas = canvasRef.value;
  const zoom = canvas.getZoom();
  const vpt = canvas.viewportTransform;
  const rawRect = obj.getBoundingRect();
  return {
    left: (rawRect.left - vpt[4]) / zoom,
    top: (rawRect.top - vpt[5]) / zoom,
    width: rawRect.width / zoom,
    height: rawRect.height / zoom
  };
};

// =========================================================
// 约束逻辑 (仅在裁剪模式下使用)
// =========================================================
const constrainImageToRect = (bgImage, targetRect) => {
  if (!bgImage || !targetRect) return;

  const bgRect = getLogicRect(bgImage);
  let deltaX = 0;
  let deltaY = 0;

  // 简单碰撞检测
  if (bgRect.left > targetRect.left) deltaX = targetRect.left - bgRect.left;
  if (bgRect.top > targetRect.top) deltaY = targetRect.top - bgRect.top;

  const bgRight = bgRect.left + bgRect.width;
  const targetRight = targetRect.left + targetRect.width;
  if (bgRight < targetRight) deltaX = targetRight - bgRight;

  const bgBottom = bgRect.top + bgRect.height;
  const targetBottom = targetRect.top + targetRect.height;
  if (bgBottom < targetBottom) deltaY = targetBottom - bgBottom;

  if (deltaX !== 0 || deltaY !== 0) {
    bgImage.left += deltaX;
    bgImage.top += deltaY;
    bgImage.setCoords();
  }
};

// =========================================================
// 拖拽逻辑 (仅在裁剪模式下生效)
// =========================================================
const onPreviewMouseDown = (opt) => {
  if (!canvasRef?.value || !previewRect.value) return;
  // 如果是拉伸模式，禁止拖拽图片
  if (previewRect.value.data?.isStretch) return;

  const canvas = canvasRef.value;
  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

  isDraggingImage = true;
  const pointer = canvas.getPointer(opt.e);
  dragLastX = pointer.x;
  dragLastY = pointer.y;
  canvas.defaultCursor = 'move';
};

const onPreviewMouseMove = (opt) => {
  if (!isDraggingImage || !canvasRef?.value) return;
  const canvas = canvasRef.value;
  const pointer = canvas.getPointer(opt.e);
  const deltaX = pointer.x - dragLastX;
  const deltaY = pointer.y - dragLastY;

  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (bgImage) {
    bgImage.left += deltaX;
    bgImage.top += deltaY;
    bgImage.setCoords();
  }

  dragLastX = pointer.x;
  dragLastY = pointer.y;
  canvas.requestRenderAll();
};

const onPreviewMouseUp = () => {
  if (isDraggingImage) {
    if (canvasRef?.value && previewRect.value) {
      const bgImage = canvasRef.value.getObjects().find(o => o.type === 'image');
      if (bgImage) {
        const rectLogic = getLogicRect(previewRect.value);
        constrainImageToRect(bgImage, rectLogic);
        canvasRef.value.requestRenderAll();
      }
    }
    isDraggingImage = false;
    if (canvasRef?.value) canvasRef.value.defaultCursor = 'default';
  }
};

// =========================================================
// 预览控制 (核心修改部分)
// =========================================================

// 恢复图片的原始状态（用于切换模式或取消时）
const restoreImageState = (bgImage) => {
  if (originalTransform && bgImage) {
    bgImage.set({
      scaleX: originalTransform.scaleX,
      scaleY: originalTransform.scaleY,
      left: originalTransform.left,
      top: originalTransform.top,
      width: originalTransform.width,
      height: originalTransform.height,
      angle: originalTransform.angle,
      originX: originalTransform.originX,
      originY: originalTransform.originY
    });
    bgImage.setCoords();
  }
};

export const startPreview = (targetW, targetH, isStretch = false) => {
  const canvas = unref(canvasRef);
  if (!canvas || !targetW || !targetH) return;

  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

  // 获取图片当前的物理中心点 (处理图片不在中心的情况)
  const currentImgCenter = bgImage.getCenterPoint();

  if (!originalTransform) {
    originalSelectable = bgImage.selectable;
    originalEvented = bgImage.evented;
    originalTransform = {
      scaleX: bgImage.scaleX,
      scaleY: bgImage.scaleY,
      left: bgImage.left,
      top: bgImage.top,
      width: bgImage.width,
      height: bgImage.height,
      angle: bgImage.angle,
      originX: bgImage.originX,
      originY: bgImage.originY,
      // ✅ 记录初始中心点
      centerX: currentImgCenter.x,
      centerY: currentImgCenter.y
    };
  }

  if (previewRect.value) {
    canvas.remove(toRaw(previewRect.value));
    previewRect.value = null;
  }

  // 使用记录的中心点，确保蓝框始终对齐图片
  const targetCenter = { x: originalTransform.centerX, y: originalTransform.centerY };

  if (!isStretch) {
    restoreImageState(bgImage);
  } else {
    bgImage.selectable = false;
    bgImage.evented = false;
  }

  const imgW = originalTransform.width * originalTransform.scaleX;
  const imgH = originalTransform.height * originalTransform.scaleY;
  const targetRatio = targetW / targetH;
  const imgRatio = imgW / imgH;

  let previewW, previewH;
  if (targetRatio > imgRatio) {
    previewW = imgW;
    previewH = imgW / targetRatio;
  } else {
    previewH = imgH;
    previewW = imgH * targetRatio;
  }

  const rect = new fabric.Rect({
    width: previewW,
    height: previewH,
    left: targetCenter.x, // ✅ 修正：使用图片中心而非画布中心
    top: targetCenter.y,  // ✅ 修正：使用图片中心而非画布中心
    originX: 'center',
    originY: 'center',
    fill: 'transparent',
    stroke: '#409eff',
    strokeWidth: 2,
    strokeDashArray: [6, 6],
    selectable: false,
    evented: false,
    excludeFromExport: true,
    data: { isStretch }
  });

  previewRect.value = rect;
  canvas.add(rect);
  canvas.bringToFront(rect);

  if (isStretch) {
    bgImage.set({
      scaleX: previewW / originalTransform.width,
      scaleY: previewH / originalTransform.height,
      left: targetCenter.x,
      top: targetCenter.y,
      originX: 'center',
      originY: 'center'
    });
    bgImage.setCoords();
  }

  canvas.requestRenderAll();
};

export const updatePreview = (targetW, targetH, isStretch = false) => {
  startPreview(targetW, targetH, isStretch);
};

export const stopPreview = () => {
  const canvas = unref(canvasRef);
  if (canvas) {
    canvas.off('mouse:down', onPreviewMouseDown);
    canvas.off('mouse:move', onPreviewMouseMove);
    canvas.off('mouse:up', onPreviewMouseUp);

    if (previewRect.value) {
      canvas.remove(toRaw(previewRect.value));
      previewRect.value = null;
    }

    const bgImage = canvas.getObjects().find(o => o.type === 'image');
    if (bgImage) {
      // 退出预览时，彻底恢复到最初的样子
      restoreImageState(bgImage);
      bgImage.selectable = originalSelectable;
      bgImage.evented = originalEvented;
    }
    canvas.discardActiveObject();
    originalTransform = null; // 清空记录
    canvas.requestRenderAll();
  }
};

// =========================================================
// 应用尺寸调整
// =========================================================
export const applyResize = (width, height, isStretch = false) => {
  const canvas = unref(canvasRef);
  if (!canvas || !previewRect.value) return;

  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

  // ✅ 修复崩溃：在异步开始前，先存好蓝框的当前位置和尺寸
  // 防止由于面板关闭导致 previewRect 被置空
  const finalPos = {
    left: previewRect.value.left,
    top: previewRect.value.top,
    scaledWidth: previewRect.value.width * previewRect.value.scaleX,
    scaledHeight: previewRect.value.height * previewRect.value.scaleY
  };

  const multiplier = width / finalPos.scaledWidth;
  const originalVpt = [...canvas.viewportTransform];
  const oldZoom = originalVpt[0];
  const oldPanX = originalVpt[4];
  const oldPanY = originalVpt[5];

  // 截图准备
  previewRect.value.visible = false;
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const cropLeft = finalPos.left - finalPos.scaledWidth / 2;
  const cropTop = finalPos.top - finalPos.scaledHeight / 2;

  const dataURL = canvas.toDataURL({
    left: cropLeft,
    top: cropTop,
    width: finalPos.scaledWidth,
    height: finalPos.scaledHeight,
    format: 'png',
    multiplier: multiplier
  });

  canvas.setViewportTransform(originalVpt);

  // 核心：设置 originalTransform 为 null 阻止 stopPreview 回滚
  originalTransform = null;

  bgImage.setSrc(dataURL, () => {
    // ✅ 修复居中问题：使用刚才存好的 finalPos，让新图呆在蓝框原本的位置
    bgImage.set({
      scaleX: 1, 
      scaleY: 1,
      angle: 0, 
      flipX: false, 
      flipY: false,
      left: finalPos.left, 
      top: finalPos.top,
      originX: 'center', 
      originY: 'center',
      cropX: 0, 
      cropY: 0
    });

    bgImage.setCoords();
    
    // 清理预览
    stopPreview(); 

    // === 视觉补偿 (改进：以图片位置为中心进行缩放，防止画面漂移) ===
    const newZoom = oldZoom / multiplier;
    
    // 计算图片中心在屏幕上的绝对位置
    const screenX = finalPos.left * oldZoom + oldPanX;
    const screenY = finalPos.top * oldZoom + oldPanY;

    // 反推在 newZoom 下，为了让图片中心依然在 screenX/Y 位置，需要的 Pan 值
    const newPanX = screenX - finalPos.left * newZoom;
    const newPanY = screenY - finalPos.top * newZoom;

    canvas.setViewportTransform([newZoom, 0, 0, newZoom, newPanX, newPanY]);
    canvas.requestRenderAll();
    canvas.fire('zoom:change', { from: 'resize-apply' });

    if (saveHistoryFn) saveHistoryFn();
  }, { crossOrigin: 'anonymous' });
};