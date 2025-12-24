<template>
  <div class="workspace-container">
    <div class="canvas-center" ref="canvasContainer" @contextmenu.prevent="handleRightClick">
      <canvas id="c"></canvas>
    </div>

    <FloatingObjectMenu />

    <CanvasContextMenu :visible="showContextMenu" :position="contextMenuPos" @close="closeContextMenu"
      @paste="handleMenuPaste" />

    <ShortcutsPanel :visible="showShortcuts" @close="showShortcuts = false" />

    <div class="zoom-controls">
      <button 
        class="ie-btn ie-btn-circle control-btn" 
        :class="{ 'is-active': state.isGlobalDragMode }"
        @click="toggleDragMode"
        :title="state.isGlobalDragMode ? '退出拖拽模式' : '进入拖拽模式 (空格键)'"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
           <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" />
           <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
           <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      </button>

      <button class="ie-btn ie-btn-circle" title="快捷键列表" @click="showShortcuts = true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
          <path d="M6 8h.01"></path>
          <path d="M10 8h.01"></path>
          <path d="M14 8h.01"></path>
          <path d="M18 8h.01"></path>
          <path d="M6 12h.01"></path>
          <path d="M18 12h.01"></path>
          <path d="M7 16h10"></path>
          <path d="M12 12v-1"></path>
        </svg>
      </button>

      <div class="divider"></div>

      <button class="ie-btn ie-btn-circle" title="缩小" @click="handleZoomOut">
        <svg viewBox="0 0 1024 1024" width="16" height="16">
          <path d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 1 0 0 64z" fill="currentColor" />
        </svg>
      </button>

      <span class="zoom-text" @click="handleReset" title="点击重置为100%">
        {{ zoomPercentage }}%
      </span>

      <button class="ie-btn ie-btn-circle" title="放大" @click="handleZoomIn">
        <svg viewBox="0 0 1024 1024" width="16" height="16">
          <path
            d="M480 480H160a32 32 0 0 0 0 64h320v320a32 32 0 0 0 64 0V544h320a32 32 0 0 0 0-64H544V160a32 32 0 0 0-64 0v320z"
            fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, inject, ref, watch, computed, onUnmounted, unref } from 'vue';
import FloatingObjectMenu from "./common/FloatingObjectMenu.vue";
import CanvasContextMenu from "./common/CanvasContextMenu.vue";
import { useObjectActions } from "@/composables/useObjectActions";
import { useKeyboardShortcuts } from "@/composables/useKeyboardShortcuts";
import ShortcutsPanel from "@/components/common/ShortcutsPanel.vue";
import { useEditorState } from '@/composables/useEditorState';
import { useCanvasLock } from '@/composables/useCanvasLock';

const { state, setGlobalDragMode } = useEditorState();
const { setBackgroundLock } = useCanvasLock();

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
});

const canvasAPI = inject('canvasAPI');
const canvasContainer = ref(null);
const pastePosition = ref(null);
const showShortcuts = ref(false);

// 计算属性
const zoomPercentage = computed(() => {
  return canvasAPI?.zoom?.value ? Math.round(canvasAPI.zoom.value * 100) : 100;
});

// 操作处理
const handleZoomIn = () => canvasAPI?.zoomIn && canvasAPI.zoomIn();
const handleZoomOut = () => canvasAPI?.zoomOut && canvasAPI.zoomOut();
const handleReset = () => canvasAPI?.zoomReset && canvasAPI.zoomReset();

const updateZoomState = () => {
  const fabricCanvas = canvasAPI?.canvas?.value;
  if (fabricCanvas && canvasAPI.zoom) {
    canvasAPI.zoom.value = fabricCanvas.getZoom();
  }
};

/**
 * ✨ 同步物理锁状态
 * 增加 isRulerMode 标记传递
 */
const syncLockState = () => {
  const canvas = unref(canvasAPI.canvas);
  if (!canvas) return;

  const isRulerModule = state.activeTab === 'ruler';
  
  setBackgroundLock(canvas, true, { 
      excludeRulers: isRulerModule, 
      dragMode: state.isGlobalDragMode,
      isRulerMode: isRulerModule // ✨ 明确告知物理锁当前是否在标尺模式
  });
};

const toggleDragMode = () => {
    const newMode = !state.isGlobalDragMode;
    setGlobalDragMode(newMode);
    syncLockState();
};

// === 右键菜单逻辑 ===
const actions = useObjectActions();
useKeyboardShortcuts(actions);
const showContextMenu = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });

const closeContextMenu = () => {
  showContextMenu.value = false;
};

const onGlobalClick = () => {
  if (showContextMenu.value) closeContextMenu();
};

const handleRightClick = (e) => {
  if (e.target.closest('.floating-wrapper')) return;

  contextMenuPos.value = { x: e.clientX, y: e.clientY };

  const canvas = unref(canvasAPI.canvas);
  if (canvas) {
    const pointer = canvas.getPointer(e);
    pastePosition.value = pointer;
  }

  showContextMenu.value = true;
};

const handleMenuPaste = () => {
  actions.pasteActive(pastePosition.value);
};

onMounted(() => {
  window.addEventListener('click', onGlobalClick);
  if (canvasAPI && canvasAPI.init) {
    const width = canvasContainer.value.clientWidth || 1900;
    const height = canvasContainer.value.clientHeight || 1000;
    canvasAPI.init('c', width, height);

    const fabricCanvas = canvasAPI.canvas.value;
    if (fabricCanvas) {
      fabricCanvas.on('zoom:change', updateZoomState);
      fabricCanvas.on('mouse:wheel', updateZoomState);
      fabricCanvas.on('image:updated', syncLockState);
      window.canvas = fabricCanvas; // ✨ 临时暴露给全局，方便调试
    }
  }

  syncLockState();
});

watch(() => state.activeTab, () => {
  syncLockState();
});


onUnmounted(() => {
  const fabricCanvas = canvasAPI?.canvas?.value;
  if (fabricCanvas) {
    fabricCanvas.off('zoom:change', updateZoomState);
    fabricCanvas.off('mouse:wheel', updateZoomState);
    fabricCanvas.off('image:updated', syncLockState);
  }
  window.removeEventListener('click', onGlobalClick);
  
  const canvas = unref(canvasAPI.canvas);
  if (canvas) {
    setBackgroundLock(canvas, true, { dragMode: false });
  }
});
</script>

<style scoped>
.workspace-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #f0f2f5;
  overflow: hidden;
}

.canvas-center {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 8px 12px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.zoom-text {
  font-size: 13px;
  color: #606266;
  min-width: 45px;
  text-align: center;
  user-select: none;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: color 0.2s;
}

.zoom-text:hover {
  color: var(--ie-primary-color);
}

.ie-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.ie-btn:hover {
  color: var(--ie-primary-color);
  background-color: #ecf5ff;
}

.ie-btn-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.control-btn.is-active {
  background: var(--ie-primary-color);
  color: white;
  border-color: var(--ie-primary-color);
}

.zoom-controls .divider {
  width: 1px;
  height: 16px;
  background: #ebeef5;
  margin: 0 4px;
}
</style>