// src/components/modules/adjust/useCanvasColorOverlay.js
import { unref } from "vue";
import { fabric } from "fabric";

let canvasRef = null;
let saveHistoryFn = null;

export const registerColorOverlayModule = (canvas, saveHistory) => {
    canvasRef = canvas;
    saveHistoryFn = saveHistory;
};

/**
 * 应用颜色叠加滤镜
 * @param {string|null} color - 叠加颜色 (hex)，若为 null 则移除滤镜
 * @param {number} opacity - 叠加强度 (0-100)
 */
export const applyColorOverlay = (color, opacity = 30) => {
    const canvas = unref(canvasRef);
    if (!canvas) return;

    const bgImage = canvas.getObjects().find(o => o.type === 'image');
    if (!bgImage) return;

    // 查找是否已存在 BlendColor 滤镜
    const existingIndex = bgImage.filters.findIndex(f => f instanceof fabric.Image.filters.BlendColor);

    if (!color) {
        // 如果没有颜色，移除该滤镜
        if (existingIndex > -1) {
            bgImage.filters.splice(existingIndex, 1);
        }
    } else {
        const filter = new fabric.Image.filters.BlendColor({
            color: color,
            mode: 'tint', // 使用 tint 模式实现类似小秘的颜色覆盖效果
            alpha: opacity / 100
        });

        if (existingIndex > -1) {
            bgImage.filters[existingIndex] = filter;
        } else {
            bgImage.filters.push(filter);
        }
    }

    bgImage.applyFilters();
    canvas.requestRenderAll();
};

export const commitColorOverlay = () => {
    if (saveHistoryFn) saveHistoryFn();
};