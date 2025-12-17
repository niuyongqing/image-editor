// src/components/modules/adjust/useCanvasResize.js

import { ref, unref, shallowRef, toRaw } from "vue";
import { fabric } from "fabric";
import { ZOOM_PADDING } from "@/composables/useEditorState";

let canvasRef = null;
let saveHistoryFn = null;

// === 预览相关状态 ===
const previewRect = shallowRef(null);
let isDraggingImage = false;
let dragLastX = 0;
let dragLastY = 0;

// 记录交互状态
let originalSelectable = true;
let originalEvented = true;

export const registerResizeModule = (canvas, saveHistory) => {
  canvasRef = canvas;
  saveHistoryFn = saveHistory;
};

export const getCurrentSize = () => {
  if (!canvasRef?.value) return { width: 0, height: 0 };
  const canvas = canvasRef.value;
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
// 约束逻辑
// =========================================================
const constrainImageToRect = (bgImage, targetRect) => {
  if (!bgImage || !targetRect) return;

  const bgRect = getLogicRect(bgImage);
  let deltaX = 0;
  let deltaY = 0;

  // 1. 左边界
  if (bgRect.left > targetRect.left) {
    deltaX = targetRect.left - bgRect.left;
  }
  // 2. 上边界
  if (bgRect.top > targetRect.top) {
    deltaY = targetRect.top - bgRect.top;
  }
  // 3. 右边界
  const bgRight = bgRect.left + bgRect.width;
  const targetRight = targetRect.left + targetRect.width;
  if (bgRight < targetRight) {
    deltaX = targetRight - bgRight; 
  }
  // 4. 下边界
  const bgBottom = bgRect.top + bgRect.height;
  const targetBottom = targetRect.top + targetRect.height;
  if (bgBottom < targetBottom) {
    deltaY = targetBottom - bgBottom;
  }

  if (deltaX !== 0 || deltaY !== 0) {
    bgImage.left += deltaX;
    bgImage.top += deltaY;
    bgImage.setCoords();
  }
};

// =========================================================
// 拖拽逻辑
// =========================================================
const onPreviewMouseDown = (opt) => {
  if (!canvasRef?.value || !previewRect.value) return;
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
// 预览控制
// =========================================================
export const startPreview = (targetW, targetH) => {
  const canvas = unref(canvasRef);
  if (!canvas || !targetW || !targetH) return;

  stopPreview();

  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

  originalSelectable = bgImage.selectable;
  originalEvented = bgImage.evented;
  bgImage.selectable = false;
  
  const imgW = bgImage.width * bgImage.scaleX;
  const imgH = bgImage.height * bgImage.scaleY;
  const center = canvas.getCenter();
  
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
    left: center.left,
    top: center.top,
    originX: 'center',
    originY: 'center',
    fill: 'transparent',
    stroke: '#409eff',
    strokeWidth: 2,
    strokeDashArray: [6, 6],
    selectable: false,
    evented: false,
    excludeFromExport: true,
  });

  previewRect.value = rect;
  canvas.add(rect);
  canvas.bringToFront(rect);
  canvas.requestRenderAll();

  canvas.on('mouse:down', onPreviewMouseDown);
  canvas.on('mouse:move', onPreviewMouseMove);
  canvas.on('mouse:up', onPreviewMouseUp);
};

export const updatePreview = (targetW, targetH) => {
  startPreview(targetW, targetH);
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
      bgImage.selectable = originalSelectable;
      bgImage.evented = originalEvented;
    }
    canvas.requestRenderAll();
  }
};

// =========================================================
// 应用尺寸调整 (修复后：生成新图 + 居中适配屏幕)
// =========================================================
export const applyResize = (width, height) => {
  const canvas = unref(canvasRef);
  if (!canvas || !previewRect.value) return; 

  width = Math.round(width);
  height = Math.round(height);
  if (width <= 0 || height <= 0) return;

  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

  // 1. 截图准备
  const rect = previewRect.value;
  rect.visible = false;
  
  // 临时重置视口以保证截图坐标准确
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const cropLeft = rect.left - (rect.width * rect.scaleX) / 2;
  const cropTop = rect.top - (rect.height * rect.scaleY) / 2;
  const cropWidth = rect.width * rect.scaleX;
  const cropHeight = rect.height * rect.scaleY;
  const multiplier = width / cropWidth;

  // 2. 生成新图
  const dataURL = canvas.toDataURL({
    left: cropLeft,
    top: cropTop,
    width: cropWidth,
    height: cropHeight,
    format: 'png',
    multiplier: multiplier
  });

  // 3. 调整画布物理尺寸
  canvas.setWidth(width);
  canvas.setHeight(height);

  // 4. 加载新图
  bgImage.setSrc(dataURL, () => {
    // 图片加载完成
    
    // 重置图片属性：无缩放，重置位置
    bgImage.set({
      scaleX: 1, scaleY: 1,
      angle: 0, flipX: false, flipY: false,
      left: 0, top: 0,
      originX: 'center', originY: 'center',
      cropX: 0, cropY: 0
    });
    
    // 【关键】强制将图片居中于新画布
    canvas.centerObject(bgImage);
    bgImage.setCoords();

    stopPreview();

    // 5. 【关键】计算视口：让画布在容器中居中并缩放适配 (Zoom to Fit)
    const paddingFactor = ZOOM_PADDING;
    // 获取容器尺寸（父元素尺寸）
    const containerWidth = canvas.wrapperEl.parentNode.clientWidth || width;
    const containerHeight = canvas.wrapperEl.parentNode.clientHeight || height;
    
    // 计算适配比例
    const zoomToFit = Math.min(
      (containerWidth * paddingFactor) / width,
      (containerHeight * paddingFactor) / height
    );
    
    // 计算平移量 Pan，使画布中心 (width/2, height/2) 对齐到容器中心
    // 公式: Pan = ContainerCenter - CanvasCenter * Zoom
    const vpt = canvas.viewportTransform;
    vpt[0] = zoomToFit;
    vpt[3] = zoomToFit;
    vpt[4] = (containerWidth - width * zoomToFit) / 2;
    vpt[5] = (containerHeight - height * zoomToFit) / 2;
    
    canvas.setViewportTransform(vpt);
    canvas.setZoom(zoomToFit);

    // 6. 渲染与保存
    canvas.requestRenderAll();
    // 触发 zoom 更新事件，更新 UI 百分比
    canvas.fire('zoom:change', { from: 'resize-apply' });
    
    if (saveHistoryFn) saveHistoryFn();
  });
};