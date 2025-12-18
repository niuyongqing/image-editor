// src/components/modules/adjust/useCanvasColor.js
import { unref } from "vue";
import { fabric } from "fabric";

let canvasRef = null;
let saveHistoryFn = null;
let originalFilters = []; // 用于取消时恢复

export const registerColorModule = (canvas, saveHistory) => {
    canvasRef = canvas;
    saveHistoryFn = saveHistory;
};

/**
 * 核心：应用组合滤镜
 * @param {Object} params - 包含亮度、对比度等数值的对象
 */
export const applyColorAdjust = (params) => {
    const canvas = unref(canvasRef);
    if (!canvas) return;

    const bgImage = canvas.getObjects().find(o => o.type === 'image');
    if (!bgImage) return;

    // 记录初始状态用于恢复
    if (originalFilters.length === 0 && bgImage.filters.length > 0) {
        originalFilters = [...bgImage.filters];
    }

    const filters = [];

    // 1. 模糊 (-100 ~ 0) / 锐化 (0 ~ 100)
    if (params.blurSharpen < 0) {
        filters.push(new fabric.Image.filters.Blur({ blur: Math.abs(params.blurSharpen) / 100 }));
    } else if (params.blurSharpen > 0) {
        filters.push(new fabric.Image.filters.Convolute({
            matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0] // 锐化矩阵
        }));
    }

    // 2. 饱和度 (-100 ~ 100 -> -1 ~ 1)
    if (params.saturation !== 0) {
        filters.push(new fabric.Image.filters.Saturation({ saturation: params.saturation / 100 }));
    }

    // 3. 亮度 (-100 ~ 100 -> -1 ~ 1)
    if (params.brightness !== 0) {
        filters.push(new fabric.Image.filters.Brightness({ brightness: params.brightness / 100 }));
    }

    // 4. 对比度 (-100 ~ 100 -> -1 ~ 1)
    if (params.contrast !== 0) {
        filters.push(new fabric.Image.filters.Contrast({ contrast: params.contrast / 100 }));
    }

    // 5. 色温 (通过 ColorMatrix 模拟)
    if (params.temperature !== 0) {
        const temp = params.temperature / 100;
        filters.push(new fabric.Image.filters.ColorMatrix({
            matrix: [
                1 + temp, 0, 0, 0, 0, // R
                0, 1, 0, 0, 0,        // G
                0, 0, 1 - temp, 0, 0, // B
                0, 0, 0, 1, 0         // A
            ]
        }));
    }

    // 6. 色调 (-100 ~ 100 -> -1 ~ 1)
    if (params.hue !== 0) {
        filters.push(new fabric.Image.filters.HueRotation({ rotation: params.hue / 100 }));
    }

    bgImage.filters = filters;
    bgImage.applyFilters();
    canvas.requestRenderAll();
};

export const cancelColorAdjust = () => {
    const canvas = unref(canvasRef);
    const bgImage = canvas?.getObjects().find(o => o.type === 'image');
    if (bgImage) {
        bgImage.filters = [...originalFilters];
        bgImage.applyFilters();
        canvas.requestRenderAll();
    }
    originalFilters = [];
};

export const commitColorAdjust = () => {
    if (saveHistoryFn) saveHistoryFn();
    originalFilters = [];
};