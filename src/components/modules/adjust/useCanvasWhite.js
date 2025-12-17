// src/components/modules/adjust/useCanvasWhite.js

import { ref, unref, shallowRef, toRaw } from "vue";
import { fabric } from "fabric";

let canvasRef = null;
let saveHistoryFn = null;

// === 预览相关状态 ===
// previewBgRect 充当我们的“新画布背景”，所有内容基于它来定位
const previewBgRect = shallowRef(null);
let originalSelectable = true;
let originalEvented = true;
// 保存原始图片的状态，以便取消时恢复
let originalTransform = null;

export const registerWhiteModule = (canvas, saveHistory) => {
  canvasRef = canvas;
  saveHistoryFn = saveHistory;
};

export const getCurrentSize = () => {
  const canvas = unref(canvasRef);
  if (!canvas) return { width: 0, height: 0 };

  // 1. 获取主图的“视觉尺寸”作为初始尺寸
  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (bgImage) {
    // getScaledWidth() 返回的是 width * scaleX，即图片在屏幕上占用的实际像素量
    return {
      width: Math.round(bgImage.getScaledWidth()),
      height: Math.round(bgImage.getScaledHeight())
    };
  }

  // 兜底：如果没有图片，才返回画布尺寸
  return { width: canvas.width, height: canvas.height };
};

// 恢复图片的原始状态
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

// =========================================================
// 预览核心逻辑：补白模式 (Fit / Contain)
// =========================================================
export const startPreview = (targetW, targetH, bgColor = '#ffffff') => {
  const canvas = unref(canvasRef);
  if (!canvas || !targetW || !targetH) return;

  // 1. 获取当前画布上的主图
  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

  // 2. 首次进入，保存原始状态 (Single Source of Truth)
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
      originY: bgImage.originY
    };
  }

  // 3. 清理旧的预览背景框
  if (previewBgRect.value) {
    canvas.remove(toRaw(previewBgRect.value));
    previewBgRect.value = null;
  }

  // 4. 计算缩放和位置
  // 原始图片尺寸
  const imgW = originalTransform.width * originalTransform.scaleX;
  const imgH = originalTransform.height * originalTransform.scaleY;

  // 计算 "Fit" 比例
  const scaleX = targetW / imgW;
  const scaleY = targetH / imgH;
  // Contain 模式取较小值
  const fitScale = Math.min(scaleX, scaleY);

  // 5. 视图自适应：修改为始终占据画布 85%
  const canvasW = canvas.width;
  const canvasH = canvas.height;
  const center = canvas.getCenter();

  const VIEW_FACTOR = 0.85; // 占比系数

  // 计算目标 viewScale：让 targetW/targetH 缩放后等于 canvas 的 85%
  // 使用 Math.min 确保无论是宽还是高超标，都限制在 85% 范围内
  const viewScale = Math.min(
    (canvasW * VIEW_FACTOR) / targetW,
    (canvasH * VIEW_FACTOR) / targetH
  );

  // 创建背景框
  const rect = new fabric.Rect({
    width: targetW,
    height: targetH,
    left: center.left,
    top: center.top,
    originX: 'center',
    originY: 'center',
    fill: bgColor === 'transparent' ? 'transparent' : bgColor,
    stroke: '#409eff', // 红色边框
    strokeWidth: 2 / viewScale, // 保持边框视觉宽度一致
    selectable: false,
    evented: false,
    excludeFromExport: true,
    scaleX: viewScale,
    scaleY: viewScale
  });

  previewBgRect.value = rect;
  canvas.add(rect);
  canvas.sendToBack(rect);

  // 6. 调整图片位置和大小
  const finalScaleX = originalTransform.scaleX * fitScale * viewScale;
  const finalScaleY = originalTransform.scaleY * fitScale * viewScale;

  bgImage.set({
    scaleX: finalScaleX,
    scaleY: finalScaleY,
    left: center.left,
    top: center.top,
    originX: 'center',
    originY: 'center',
    selectable: false,
    evented: false
  });
  bgImage.setCoords();

  canvas.requestRenderAll();
};

export const updatePreview = (targetW, targetH, bgColor) => {
  startPreview(targetW, targetH, bgColor);
};

export const stopPreview = () => {
  const canvas = unref(canvasRef);
  if (canvas) {
    if (previewBgRect.value) {
      canvas.remove(toRaw(previewBgRect.value));
      previewBgRect.value = null;
    }

    const bgImage = canvas.getObjects().find(o => o.type === 'image');
    if (bgImage) {
      restoreImageState(bgImage);
      bgImage.selectable = originalSelectable;
      bgImage.evented = originalEvented;
    }

    originalTransform = null;
    canvas.requestRenderAll();
  }
};

// =========================================================
// 应用补白
// =========================================================


// [File: useCanvasWhite.js]

// [File: useCanvasWhite.js] -> 替换 applyWhitePadding

// [File: useCanvasWhite.js] -> 替换 applyWhitePadding

export const applyWhitePadding = (width, height, bgColor) => {
  const canvas = unref(canvasRef);
  if (!canvas || !previewBgRect.value) return;

  const targetW = Math.round(width);
  const targetH = Math.round(height);
  if (targetW <= 0 || targetH <= 0) return;

  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

  // 1. 捕获当前视觉状态 (用于保持静止)
  const rect = previewBgRect.value;
  // 获取当前红框在屏幕上的视觉大小，用于最后还原视图
  const targetVisualZoom = rect.scaleX;

  // =========================================================
  // 解决模糊的核心：计算高清倍率 (Multiplier)
  // =========================================================
  // 如果目标尺寸很小（比如 < 2000px），我们强制生成 2-3 倍的高清图
  // 这样在屏幕上放大看时才不会糊
  const maxDimension = Math.max(targetW, targetH);
  let pixelMultiplier = 1;

  if (maxDimension < 1000) {
    pixelMultiplier = 3; // 极小图用 3 倍采样
  } else if (maxDimension < 2500) {
    pixelMultiplier = 2; // 中等图用 2 倍采样
  }
  // 大图保持 1 倍即可

  // 2. 创建临时画布 (尺寸为 逻辑尺寸 * 倍率)
  // 这样生成的图片物理像素非常多
  const tempCanvas = new fabric.StaticCanvas(null, {
    width: targetW * pixelMultiplier,
    height: targetH * pixelMultiplier,
    backgroundColor: bgColor
  });

  bgImage.clone((clonedImg) => {
    // A. 计算原始图片在目标框里的适应比例
    const imgRealW = bgImage.width * bgImage.scaleX;
    const imgRealH = bgImage.height * bgImage.scaleY;
    const fitScale = Math.min(targetW / imgRealW, targetH / imgRealH);

    // B. 在临时画布中摆放图片
    // 注意：所有参数都要乘以 pixelMultiplier
    clonedImg.set({
      originX: 'center',
      originY: 'center',
      left: (targetW * pixelMultiplier) / 2,
      top: (targetH * pixelMultiplier) / 2,
      // 缩放 = 原缩放 * 适应比例 * 高清倍率
      scaleX: bgImage.scaleX * fitScale * pixelMultiplier,
      scaleY: bgImage.scaleY * fitScale * pixelMultiplier,
      angle: bgImage.angle
    });

    tempCanvas.add(clonedImg);
    tempCanvas.renderAll();

    // C. 导出高清原图
    const dataURL = tempCanvas.toDataURL({
      format: 'png',
      multiplier: 1, // 这里已经是大尺寸了，所以乘1即可
      quality: 1
    });

    tempCanvas.dispose();

    // 3. 将高清图应用回主画布
    bgImage.setSrc(dataURL, () => {

      // === 关键修复：消除闪烁 ===
      // 必须在 stopPreview 之前手动切断“后路”
      // 这样 stopPreview 就不会执行 restoreImageState，避免了跳回到原图的瞬间
      originalTransform = null;
      stopPreview();

      // === 关键修复：逻辑尺寸还原 ===
      // 我们生成的是 3倍大图，现在要缩小 3倍 显示
      // 这样：
      // 1. bgImage.width 是 3倍大 (物理像素多，清晰！)
      // 2. bgImage.getScaledWidth() 依然是 targetW (逻辑尺寸对，不影响功能！)

      const finalScale = 1 / pixelMultiplier;

      // 重置图片属性
      bgImage.set({
        scaleX: finalScale,
        scaleY: finalScale,
        angle: 0,
        flipX: false,
        flipY: false,
        originX: 'center',
        originY: 'center',
        left: 0,
        top: 0
      });

      // === 视觉静止还原 ===

      // 1. 视口归零
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      // 2. 物理居中
      canvas.centerObject(bgImage);
      bgImage.setCoords();

      // 3. 应用之前的视觉缩放 (实现绝对静止)
      const centerPoint = new fabric.Point(canvas.width / 2, canvas.height / 2);
      canvas.zoomToPoint(centerPoint, targetVisualZoom);

      canvas.requestRenderAll();

      if (saveHistoryFn) saveHistoryFn();
    });
  });
};