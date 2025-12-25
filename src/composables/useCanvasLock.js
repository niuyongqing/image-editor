import { unref } from 'vue';
import { useEditorState } from '@/composables/useEditorState'; // ✨ 引入状态机

const LOCK_CONFIG = {
  'selectable': [false, true],
  'evented': [false, true],
  'hasControls': [false, true],
  'hasBorders': [false, true],
  'lockMovementX': [true, false],
  'lockMovementY': [true, false],
  'lockRotation': [true, false],
  'lockScalingX': [true, false],
  'lockScalingY': [true, false],
};

export function useCanvasLock() {
  const { state } = useEditorState(); // ✨ 获取全局状态
  const objectStates = new WeakMap();

  const forceEnableObject = (obj, isRulerMode) => {
    Object.keys(LOCK_CONFIG).forEach(prop => {
      const [_, interactiveValue] = LOCK_CONFIG[prop];
      obj.set(prop, interactiveValue);
    });
    obj.set('hoverCursor', isRulerMode ? 'move' : 'default');
  };

  const lockAndStoreObject = (obj) => {
    const backup = {};
    Object.keys(LOCK_CONFIG).forEach(prop => {
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

 /**
 * 修改位置：useCanvasLock.js -> setBackgroundLock 函数
 * 变更点：注入 isCropMode 逻辑，实施“锚定锁定”以消除点击抖动
 */
const setBackgroundLock = (canvasInstance, shouldLock, options = {}) => {
    const canvas = unref(canvasInstance);
    if (!canvas) return;

    // 1. 获取全局真相 [SSOT]
    const activeTab = state.activeTab;
    const dragMode = state.isGlobalDragMode;
    const isResizeMode = activeTab === 'resize'; 
    const isRulerMode = activeTab === 'ruler';
    const isCropMode = activeTab === 'crop'; // ✨ 新增：剪裁模式识别 [宪法 0.0]

    const objects = canvas.getObjects();
    
    if (shouldLock) {
      canvas.discardActiveObject(); 
        canvas.requestRenderAll();
      canvas.selection = false; 
      canvas.defaultCursor = dragMode ? 'grab' : (isRulerMode ? 'crosshair' : 'default');

      objects.forEach(obj => {
        const isMain = obj.isMainImage || obj.id === 'main-image' || (obj.type === 'image' && objects.indexOf(obj) === 0);
        
        if (isMain) {
          // ✨✨✨ 核心修复：剪裁模式下的物理锚定 ✨✨✨
          if (isCropMode) {
           obj.set({
    selectable: false, // ✨ 关键：禁用原生选择，消除点击瞬间的抖动
    evented: true,     // ✨ 允许事件透传给 Canvas 监听器
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default'
  });
          } else {
            // 尺寸模式或拖拽模式的逻辑保持不变
            obj.set({
              selectable: dragMode || isResizeMode,
              evented: dragMode || isResizeMode,
              lockMovementX: !dragMode, // 只有拖拽模式允许移动
              lockMovementY: !dragMode,
              hoverCursor: dragMode ? 'grab' : 'default'
            });
          }
          return;
        }

        // 屏蔽非主图对象（尺寸模式或剪裁模式下均生效）
        if (isResizeMode || isCropMode) {
          obj.set({ selectable: false, evented: false });
          return;
        }

        // 标尺豁免逻辑...
        const shouldExempt = !dragMode && isRulerMode && obj.isRuler;
        if (shouldExempt) {
          forceEnableObject(obj, true);
          return;
        }
        lockAndStoreObject(obj);
      });

      // 自动取消主图选中（除非是需要主图选中的模式）
      if (!dragMode && !isResizeMode && !isCropMode && canvas.getActiveObject()?.isMainImage) {
        canvas.discardActiveObject();
      }
    } else {
      // 解锁阶段... (保持与 state 同步)
      canvas.selection = !dragMode && !isResizeMode && !isCropMode;
      // ... 恢复逻辑
    }
    canvas.requestRenderAll();
};

  return { setBackgroundLock };
}