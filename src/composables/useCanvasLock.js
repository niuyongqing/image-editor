import { unref } from 'vue';
import { useEditorState } from '@/composables/useEditorState'; // ✨ 引入状态机

/**
 * 配置驱动物理锁：LOCK_CONFIG 为唯一真相来源
 * 约定：每项为 [lockedValue, interactiveValue]
 */
const LOCK_CONFIG = {
  selectable: [false, true],
  evented: [false, true],
  hasControls: [false, true],
  hasBorders: [false, true],
  lockMovementX: [true, false],
  lockMovementY: [true, false],
  lockRotation: [true, false],
  lockScalingX: [true, false],
  lockScalingY: [true, false],
};

/**
 * setBackgroundLock options (策略由 Workspace.vue 配置驱动传入)
 * @typedef {Object} BackgroundLockOptions
 * @property {boolean} [dragMode=false] - 全局手形/拖拽模式
 * @property {boolean} [isRulerMode=false] - 标尺模式（影响默认光标与标尺 hoverCursor）
 * @property {boolean} [isResizeMode=false] - Resize 模式
 * @property {boolean} [isCropMode=false] - Crop 模式
 * @property {boolean} [allowMainImageDrag=false] - 是否允许主图可拖动
 * @property {boolean} [allowRulerDrag=false] - 是否允许标尺可拖动
 * @property {boolean} [allowNormalObjectDrag=false] - 是否允许普通对象可拖动
 * @property {boolean} [cropMainImageAnchored=false] - Crop 下主图锚定锁（selectable=false, evented=true）
 */

export function useCanvasLock() {
  // ✨ 获取全局状态（目前仅用于兜底 cursor/selection 行为；策略以 options 为准）
  const { state } = useEditorState();

  // 对象原始交互态备份（原子备份：只备份一次，保证“最原始状态”）
  const objectStates = new WeakMap();

  const forceEnableObject = (obj, isRulerMode) => {
    Object.keys(LOCK_CONFIG).forEach((prop) => {
      const [, interactiveValue] = LOCK_CONFIG[prop];
      obj.set(prop, interactiveValue);
    });
    obj.set('hoverCursor', isRulerMode ? 'move' : 'default');
  };

  const lockAndStoreObject = (obj) => {
    const backup = {};

    Object.keys(LOCK_CONFIG).forEach((prop) => {
      if (!objectStates.has(obj)) {
        backup[prop] = obj[prop];
      }
      const [lockedValue] = LOCK_CONFIG[prop];
      obj.set(prop, lockedValue);
    });

    if (Object.keys(backup).length > 0) {
      objectStates.set(obj, backup);
    }

    obj.set('hoverCursor', 'default');
  };

  const restoreObjectFromBackup = (obj) => {
    const backup = objectStates.get(obj);
    if (!backup) return;

    Object.keys(LOCK_CONFIG).forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(backup, prop)) {
        obj.set(prop, backup[prop]);
      }
    });

    // hoverCursor：让路由/模式在下一次 setBackgroundLock(shouldLock=true) 时重设
    obj.set('hoverCursor', obj.hoverCursor || 'default');
  };

  /**
   * 修改位置：useCanvasLock.js -> setBackgroundLock 函数
   * 变更点：
   * 1) 将“按 activeTab 写死的分支”外移到 Workspace.vue 的策略表（配置驱动）
   * 2) 保留 Crop 主图锚定锁能力（由 options.cropMainImageAnchored 控制）
   */
  const setBackgroundLock = (canvasInstance, shouldLock, options = {}) => {
    const canvas = unref(canvasInstance);
    if (!canvas) return;

    // === 策略输入（以 options 为准；提供默认值） ===
    const {
      dragMode = false,
      isRulerMode = false,
      isResizeMode = false,
      isCropMode = false,
      allowMainImageDrag = false,
      allowRulerDrag = false,
      allowNormalObjectDrag = false,
      cropMainImageAnchored = false,
    } = options;

    const objects = canvas.getObjects();

    // === 共同的 Canvas 级状态 ===
    if (shouldLock) {
      canvas.discardActiveObject();
      canvas.requestRenderAll();

      canvas.selection = false;
      canvas.defaultCursor = dragMode ? 'grab' : (isRulerMode ? 'crosshair' : 'default');

      objects.forEach((obj) => {
        const isMain = obj.isMainImage || obj.id === 'main-image' || (obj.type === 'image' && objects.indexOf(obj) === 0);

        // --- 主图 ---
        if (isMain) {
          // Crop 模式下的“锚定锁定”（防抖动）：selectable=false 但 evented=true 允许事件透传
          if (isCropMode && cropMainImageAnchored) {
            obj.set({
              selectable: false,
              evented: true,
              lockMovementX: true,
              lockMovementY: true,
              hoverCursor: 'default',
            });
            return;
          }

          // 非 crop anchored：根据 allowMainImageDrag 决定能否拖
          obj.set({
            selectable: !!allowMainImageDrag,
            evented: !!allowMainImageDrag,
            lockMovementX: !allowMainImageDrag,
            lockMovementY: !allowMainImageDrag,
            hoverCursor: allowMainImageDrag ? (dragMode ? 'grab' : 'move') : 'default',
          });
          return;
        }

        // --- 非主图对象 ---
        // Resize/Crop 等模块可能需要强制禁用所有非主图对象：由 Workspace 策略通过 allowNormalObjectDrag/allowRulerDrag 体现。
        const isRuler = !!obj.isRuler;

        // 标尺
        if (isRuler) {
          if (allowRulerDrag) {
            forceEnableObject(obj, true);
          } else {
            lockAndStoreObject(obj);
          }
          return;
        }

        // 普通对象
        if (allowNormalObjectDrag) {
          forceEnableObject(obj, false);
          return;
        }

        lockAndStoreObject(obj);
      });

      // 自动取消主图选中（除非策略允许主图交互）
      if (!allowMainImageDrag && canvas.getActiveObject()?.isMainImage) {
        canvas.discardActiveObject();
      }
    } else {
      // 解锁阶段：恢复对象原始交互态
      // 注意：这里不强制打开 selection；由外层(Workspace)根据模式决定是否调用 shouldLock=false
      canvas.selection = !dragMode && !isResizeMode && !isCropMode;

      objects.forEach((obj) => {
        restoreObjectFromBackup(obj);
      });

      // 退出标尺模式时，hoverCursor 统一回落
      if (!isRulerMode) {
        objects.forEach((obj) => {
          if (obj.isRuler) obj.set('hoverCursor', 'default');
        });
      }
    }

    canvas.requestRenderAll();
  };

  return { setBackgroundLock };
}
