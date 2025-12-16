// src/components/modules/adjust/useCanvasResize.js

import { ref, unref } from "vue";
import { ZOOM_PADDING } from "@/composables/useEditorState";

let canvasRef = null;
let saveHistoryFn = null;

export const registerResizeModule = (canvas, saveHistory) => {
  canvasRef = canvas;
  saveHistoryFn = saveHistory;
};

export const getCurrentSize = () => {
  if (!canvasRef?.value) return { width: 0, height: 0 };
  const canvas = canvasRef.value;
  return { width: canvas.width, height: canvas.height };
};

export const applyResize = (width, height, adaptive = true) => {
  const canvas = unref(canvasRef);
  if (!canvas) return;

  width = Math.round(width);
  height = Math.round(height);
  if (width <= 0 || height <= 0) return;

  const oldWidth = canvas.width;
  const oldHeight = canvas.height;

  // 1. 调整画布物理尺寸
  canvas.setWidth(width);
  canvas.setHeight(height);

  // 2. 自适应逻辑 (修改为等比填充 Cover)
  if (adaptive) {
    // 假设我们主要调整的是背景图，或者整体缩放
    // 为了“填满”目标尺寸且“不变形”，我们需要取宽缩放比和高缩放比中较大的那个
    // Scale = Max(TargetW / OldW, TargetH / OldH)
    const scaleX = width / oldWidth;
    const scaleY = height / oldHeight;
    const scale = Math.max(scaleX, scaleY); // 关键：取最大值实现 Cover，取最小值实现 Contain

    const objects = canvas.getObjects();
    const newCenter = { x: width / 2, y: height / 2 };

    objects.forEach(obj => {
      if (obj.excludeFromExport) return;

      // 保持原有比例，统一放大
      const objScaleX = obj.scaleX || 1;
      const objScaleY = obj.scaleY || 1;
      
      // 更新缩放
      obj.set({
        scaleX: objScaleX * scale,
        scaleY: objScaleY * scale,
      });

      // 简单的居中策略：将所有对象移动到新画布中心
      // (更复杂的做法是保持相对位置，但通常调整尺寸都是针对单图处理)
      if (obj.type === 'image') {
         canvas.centerObject(obj);
      } else {
         // 对于其他元素（文字等），根据中心点重新计算偏移
         // 这里简单处理：让它们跟随图片居中，或者保持相对位置
         // 鉴于目前主要是单图编辑，强制居中是符合预期的
         canvas.centerObject(obj);
      }
      
      obj.setCoords();
    });
  } else {
    // 不自适应，仅居中
    const objects = canvas.getObjects();
    objects.forEach(obj => {
        if(obj.type === 'image') canvas.centerObject(obj);
    });
  }

  // 3. 调整视口 (Zoom Fit)
  const paddingFactor = ZOOM_PADDING;
  const containerWidth = canvas.wrapperEl.parentNode.clientWidth || width;
  const containerHeight = canvas.wrapperEl.parentNode.clientHeight || height;
  
  const zoomToFit = Math.min(
    (containerWidth * paddingFactor) / width,
    (containerHeight * paddingFactor) / height
  );
  
  const vpt = canvas.viewportTransform;
  vpt[0] = zoomToFit;
  vpt[3] = zoomToFit;
  vpt[4] = (containerWidth - width * zoomToFit) / 2;
  vpt[5] = (containerHeight - height * zoomToFit) / 2;
  
  canvas.setZoom(zoomToFit);
  canvas.requestRenderAll();

  if (saveHistoryFn) saveHistoryFn();
};