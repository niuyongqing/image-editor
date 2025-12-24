/**
 * @param {Boolean} shouldLock 
 * ⚠️ 注意：此方法依赖对象的 isMainImage 标识。
 * 开启前请确保主图已执行: obj.isMainImage = true; 否则主图将无法操作。
 */
import { unref } from 'vue';

export function useCanvasLock() {
  const objectStates = new WeakMap();

  const setBackgroundLock = (canvasInstance, shouldLock) => {
    const canvas = unref(canvasInstance);
    if (!canvas) return;

    const objects = canvas.getObjects();
    
    if (shouldLock) {
      // === 🔒 上锁阶段 ===
      canvas.selection = false; 
      canvas.defaultCursor = 'default';

      objects.forEach(obj => {
        // ✨ 增强识别：通过多个维度确认是否为主图，避免误锁
        const isMain = obj.isMainImage || obj.id === 'main-image' || (obj.type === 'image' && objects.indexOf(obj) === 0);
        if (isMain) return;

        // 备份并锁定
        if (!objectStates.has(obj)) {
          objectStates.set(obj, {
            selectable: obj.selectable,
            evented: obj.evented,
            hoverCursor: obj.hoverCursor,
            hasControls: obj.hasControls,
            hasBorders: obj.hasBorders
          });
        }

        obj.set({
          selectable: false,     // 对应您之前的手动代码：解决蓝框
          evented: false,        // 对应您之前的手动代码：解决菜单
          hoverCursor: 'default',
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true
        });
      });

      canvas.discardActiveObject();

    } else {
      // === 🔓 解锁阶段 ===
      canvas.selection = true;
      objects.forEach(obj => {
        const isMain = obj.isMainImage || obj.id === 'main-image';
        if (isMain) return;

        const originalState = objectStates.get(obj);
        if (originalState) {
          obj.set(originalState);
          objectStates.delete(obj);
        } else {
          obj.set({
            selectable: true,
            evented: true,
            hoverCursor: null,
            hasControls: true,
            hasBorders: true,
            lockMovementX: false,
            lockMovementY: false
          });
        }
      });
    }

    canvas.requestRenderAll();
  };

  return { setBackgroundLock };
}