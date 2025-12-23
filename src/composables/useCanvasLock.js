import { unref } from 'vue';

/**
 * 通用画布锁定钩子 (修正版)
 * 针对：主图作为普通对象位于图层最底层 (Index 0) 的情况
 */
export function useCanvasLock() {

    /**
     * 切换主图的锁定状态
     * @param {Object} canvasInstance - Fabric canvas 实例
     * @param {Boolean} shouldLock - true: 锁定; false: 解锁
     */
    const setBackgroundLock = (canvasInstance, shouldLock) => {
        const canvas = unref(canvasInstance);
        if (!canvas) return;

        // [修正点] 获取对象列表中的第一个元素 (最底层)
        const objects = canvas.getObjects();
        const bgObject = objects[0];

        // 安全检查：确保底层存在对象，且通常应该是图片
        if (bgObject && (bgObject.type === 'image' || bgObject.id === 'workspace_bg')) {
            // 锁定核心属性
            bgObject.set({
                selectable: !shouldLock, // 锁定时不可选中
                evented: !shouldLock,    // 锁定时不可响应鼠标 (允许穿透)
                hoverCursor: shouldLock ? 'default' : null // 鼠标样式
            });

            // 强制取消当前可能存在的选中状态
            if (shouldLock && canvas.getActiveObject() === bgObject) {
                canvas.discardActiveObject();
            }

            canvas.requestRenderAll();
        } else {
            // 仅在开发环境提示，避免干扰
            console.warn('[useCanvasLock] 未在图层底部(Index 0)找到主图对象，锁定未生效。');
        }
    };

    return {
        setBackgroundLock
    };
}