// [File: src/components/modules/adjust/useCanvasWhite.js]

import { ref, unref, shallowRef, toRaw } from "vue";
import { fabric } from "fabric";

let canvasRef = null;
let saveHistoryFn = null;
let zoomToRectFn = null;
// === 预览相关状态 ===
const previewBgRect = shallowRef(null);
let originalSelectable = true;
let originalEvented = true;
let originalTransform = null;


export const registerWhiteModule = (canvas, saveHistory, zoomToRect) => {
  canvasRef = canvas;
  saveHistoryFn = saveHistory;
  zoomToRectFn = zoomToRect;
};


// 新增：手动触发视角对齐的方法
export const zoomToPreview = () => {
  const canvas = unref(canvasRef);
  // 如果 zoomToRectFn 为 null，这里就会直接 return，导致没反应
  if (!canvas || !previewBgRect.value || !zoomToRectFn || !originalTransform) return;

  const rect = previewBgRect.value;

  // 计算补白框在画布上的逻辑矩形范围
  const logicRect = {
    left: rect.left - (rect.width * rect.scaleX) / 2,
    top: rect.top - (rect.height * rect.scaleY) / 2,
    width: rect.width * rect.scaleX,
    height: rect.height * rect.scaleY
  };

  // 调用相机缩放方法
  zoomToRectFn(logicRect);
};





export const getCurrentSize = () => {
  const canvas = unref(canvasRef);
  if (!canvas) return { width: 0, height: 0 };
  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (bgImage) {
    return {
      width: Math.round(bgImage.getScaledWidth()),
      height: Math.round(bgImage.getScaledHeight())
    };
  }
  return { width: canvas.width, height: canvas.height };
};

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

export const startPreview = (targetW, targetH, bgColor = '#ffffff') => {
  const canvas = unref(canvasRef);
  if (!canvas || !targetW || !targetH) return;

  const bgImage = canvas.getObjects().find(o => o.type === 'image');
  if (!bgImage) return;

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

  if (previewBgRect.value) {
    canvas.remove(toRaw(previewBgRect.value));
    previewBgRect.value = null;
  }

  const imgW = originalTransform.width * originalTransform.scaleX;
  const imgH = originalTransform.height * originalTransform.scaleY;
  const scaleX = targetW / imgW;
  const scaleY = targetH / imgH;
  const fitScale = Math.min(scaleX, scaleY);

  // const canvasW = canvas.width;
  // const canvasH = canvas.height;
  // const center = canvas.getCenter();
  // const VIEW_FACTOR = 0.85;

  // const viewScale = Math.min(
  //   (canvasW * VIEW_FACTOR) / targetW,
  //   (canvasH * VIEW_FACTOR) / targetH
  // );
  const viewScale = 1;
  const center = canvas.getCenter();
  const rect = new fabric.Rect({
    width: targetW,
    height: targetH,
    left: center.left,
    top: center.top,
    originX: 'center',
    originY: 'center',
    fill: bgColor === 'transparent' ? 'transparent' : bgColor,
    stroke: '#409eff',
    strokeWidth: 2 / viewScale,
    selectable: false,
    evented: false,
    excludeFromExport: true,
    scaleX: viewScale,
    scaleY: viewScale
  });

  previewBgRect.value = rect;
  canvas.add(rect);
  canvas.sendToBack(rect);

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
    canvas.discardActiveObject();
    originalTransform = null;
    canvas.requestRenderAll();
  }
};


// 母带重制 (Source Remastering) 原清晰度
export const applyWhitePadding = (width, height, bgColor) => {
  return new Promise((resolve, reject) => {
    const canvas = unref(canvasRef);
    if (!canvas || !previewBgRect.value) {
      resolve();
      return;
    }

    const targetW = Math.round(width);
    const targetH = Math.round(height);
    if (targetW <= 0 || targetH <= 0) {
      resolve();
      return;
    }

    const bgImage = canvas.getObjects().find(o => o.type === 'image');
    if (!bgImage) {
      resolve();
      return;
    }

    // 1. 获取原图的原始 Source URL (最清晰的数据源)
    const originalSrc = bgImage.getSrc();

    // 2. 捕获当前画布上的视觉状态 (用于最后恢复视图)
    const rect = previewBgRect.value;
    const targetVisualZoom = rect.scaleX;

    // 3. 在内存中创建一个新的 Fabric Image 对象，加载原始高清图
    fabric.Image.fromURL(originalSrc, (highResImg) => {

      // === 核心差异：基于原始分辨率计算 ===
      // highResImg.width / height 是图片最原始的像素尺寸 (比如 4000x3000)
      const originalW = highResImg.width;
      const originalH = highResImg.height;

      // 计算适应比例：让原图完整塞进目标尺寸 (Fit)
      // 例如：目标 1000x222，原图 4000x3000
      // scale = min(1000/4000, 222/3000)
      const fitScale = Math.min(targetW / originalW, targetH / originalH);

      // 4. 创建高清离屏画布
      // 这里的策略是：如果目标尺寸很小(如1000px)，我们强制放大导出尺寸，保证Retina屏清晰度
      // 至少保证长边有 2500px 以上，或者按目标尺寸的 2-3 倍输出
      const outputMultiplier = Math.max(1, 3000 / Math.max(targetW, targetH)); // 动态计算倍率

      const outputW = Math.round(targetW * outputMultiplier);
      const outputH = Math.round(targetH * outputMultiplier);

      const tempCanvas = new fabric.StaticCanvas(null, {
        width: outputW,
        height: outputH,
        backgroundColor: bgColor,
      });

      // 5. 设置高清图在离屏画布中的位置
      highResImg.set({
        originX: 'center',
        originY: 'center',
        left: outputW / 2,
        top: outputH / 2,
        // 关键：缩放 = 适应比例 * 输出倍率
        scaleX: fitScale * outputMultiplier,
        scaleY: fitScale * outputMultiplier,
        // 继承原图的角度和翻转（如果有）
        angle: bgImage.angle,
        flipX: bgImage.flipX,
        flipY: bgImage.flipY
      });

      tempCanvas.add(highResImg);
      tempCanvas.renderAll();

      // 6. 导出最终图片 (这是真正的高清图)
      const dataURL = tempCanvas.toDataURL({
        format: 'png',
        quality: 1
      });

      tempCanvas.dispose();

      // 7. 应用回主画布
      bgImage.setSrc(dataURL, () => {
        // 1. 清理预览资源
        if (previewBgRect.value) {
          canvas.remove(toRaw(previewBgRect.value));
          previewBgRect.value = null;
        }
        originalTransform = null;

        // 2. 恢复交互状态
        bgImage.selectable = originalSelectable;
        bgImage.evented = originalEvented;

        // === 3. 核心：清晰度调整 (Source Remastering) ===
        // 注意：这段逻辑不能删。高清重制导出了物理像素极高的新图 (outputMultiplier)，
        // 我们需要把它缩放到逻辑尺寸，否则图片会显得异常巨大或模糊。
        const displayScale = 1 / outputMultiplier;

        bgImage.set({
          scaleX: displayScale,
          scaleY: displayScale,
          angle: 0,
          flipX: false,
          flipY: false,
          originX: 'center',
          originY: 'center',
          left: 0,
          top: 0
        });

        // === 4. 视图处理 ===
        // 根据你的要求，这里注释掉了会引起视角跳动的重置代码
        // canvas.setViewportTransform([1, 0, 0, 1, 0, 0]); // ❌ 不进行视角复位

        // 也不使用 zoomToPoint 跳转到预设视距
        // canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), targetVisualZoom); // ❌ 不改变当前缩放比例

        // 5. 仅在当前视角下将图片居中
        canvas.centerObject(bgImage);
        bgImage.setCoords();

        // 6. 刷新画布并保存历史
        canvas.requestRenderAll();
        if (saveHistoryFn) saveHistoryFn();

        resolve();
      });
    }, { crossOrigin: 'anonymous' }); // 确保跨域图片能加载
  });
};