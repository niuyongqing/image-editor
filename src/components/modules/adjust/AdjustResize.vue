<template>
  <div class="tool-group">
    <div
      class="tool-item"
      :class="{ 'is-expanded': isExpanded }"
      @click="handleToggle"
    >
      <div class="left">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="margin-right: 8px"
        >
          <path d="M15 3h6v6" />
          <path d="M9 21H3v-6" />
          <path d="M21 3l-7 7" />
          <path d="M3 21l7-7" />
        </svg>
        <span>调整尺寸</span>
      </div>
      <div class="right-icon">
        <svg
          class="arrow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="tool-content">
      <div class="preset-grid">
        <div
          class="preset-item custom-item"
          :class="{ active: isCustomMode }"
          @click="selectCustomMode"
        >
          <span>自定义</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>

        <div
          v-for="(preset, index) in presets"
          :key="index"
          class="preset-item"
          :class="{ active: activePresetIndex === index }"
          @click="selectPreset(preset, index)"
        >
          <span class="preset-name">{{ preset.label }}</span>
          <span class="preset-dim">{{ preset.w }}×{{ preset.h }}</span>
        </div>
      </div>

      <div class="resize-input-box">
        <div class="input-controls">
          <div class="input-wrapper">
            <input
              type="number"
              v-model.number="width"
              class="ie-input"
              @input="onInputChanged"
            />
            <span class="suffix">W</span>
          </div>

          <div
            class="link-icon-btn"
            @click="toggleAdaptive"
            :title="isAdaptive ? '锁定比例' : '自由比例'"
          >
            <svg
              v-if="isAdaptive"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--ie-primary-color)"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              ></path>
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              ></path>
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#999"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="opacity: 0.6"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              ></path>
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              ></path>
              <line x1="4" y1="4" x2="20" y2="20" stroke="#999"></line>
            </svg>
          </div>

          <div class="input-wrapper">
            <input
              type="number"
              v-model.number="height"
              class="ie-input"
              @input="onInputChanged"
            />
            <span class="suffix">H</span>
          </div>
        </div>

        <div class="switch-row">
          <div
            class="ie-switch"
            :class="{ 'is-checked': isAdaptive }"
            @click="toggleAdaptive"
          >
            <span class="ie-switch-core"></span>
          </div>
          <span class="switch-label">锁定长宽比 (保真模式)</span>
        </div>
      </div>

      <div class="action-buttons">
        <button class="ie-btn ie-primary full" @click="handleApply">
          应用修改
        </button>
        <button class="ie-btn full" @click="handleCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  inject,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  computed,
  unref,
} from "vue";
import {
  registerResizeModule,
  getCurrentSize,
  applyResize,
  startPreview,
  updatePreview,
  stopPreview,
} from "./useCanvasResize";
// ✨ 1. 引入物理锁
import { useCanvasLock } from "@/composables/useCanvasLock";

const props = defineProps({
  isExpanded: { type: Boolean, default: false },
});

const emit = defineEmits(["toggle"]);
const canvasAPI = inject("canvasAPI");

// ✨ 2. 获取锁方法
const { setBackgroundLock } = useCanvasLock();

// === 状态定义 ===
const width = ref(0);
const height = ref(0);
const isAdaptive = ref(true);
const originalRatio = ref(1);
const activePresetIndex = ref(-1);
const isInternalUpdate = ref(false); // 防止循环更新

// 预设数据 (保留原样)
const presets = [
  { label: "方形主图", w: 800, h: 800 },
  { label: "Temu服装图", w: 1340, h: 1785 },
  { label: "方形主图", w: 1000, h: 1000 },
  { label: "竖图主图", w: 750, h: 1000 },
  { label: "方形主图", w: 500, h: 500 },
  { label: "竖图主图", w: 1000, h: 1200 },
  { label: "Youtube视频封面", w: 1280, h: 720 },
  { label: "Pinterest帖子", w: 750, h: 1120 },
  { label: "Facebook封面", w: 851, h: 315 },
];

const isCustomMode = computed(() => activePresetIndex.value === -1);

// === 核心逻辑：获取当前应遵循的比例 ===
const currentTargetRatio = computed(() => {
  if (activePresetIndex.value >= 0) {
    const p = presets[activePresetIndex.value];
    return p.h !== 0 ? p.w / p.h : 1;
  } else {
    return originalRatio.value;
  }
});

// === 初始化 ===
const initSize = () => {
  if (canvasAPI && canvasAPI.canvas) {
    registerResizeModule(canvasAPI.canvas, canvasAPI.saveHistory);
    const canvas = unref(canvasAPI.canvas);
    
    if (canvas) {
      // 确保主图被标记，以便被锁逻辑豁免
      const mainImg = canvas.getObjects().find((o) => o.isMainImage || o.type === 'image');
      if (mainImg) {
        if (!mainImg.isMainImage) mainImg.isMainImage = true; // 动态补全标识
        canvas.setActiveObject(mainImg);
      }
      canvas.requestRenderAll();
    }

    const size = getCurrentSize();

    if (size.height > 0) {
      originalRatio.value = size.width / size.height;
    }

    width.value = size.width;
    height.value = size.height;
    activePresetIndex.value = -1; // 默认选中自定义
    isAdaptive.value = true; // 默认开启保真

    // 立即启动预览 (显示蓝色虚线框)
    nextTick(() => {
      startPreview(width.value, height.value, !isAdaptive.value);
      if (canvas) setBackgroundLock(canvas, true);
    });
  }
};

// === 清理逻辑 (封装) ===
const cleanup = () => {
  stopPreview();

  // ✨✨✨ 4. 注入解锁逻辑：恢复交互 ✨✨✨
  const canvas = unref(canvasAPI.canvas);
  if (canvas) {
    setBackgroundLock(canvas, false);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }
};

// === 交互逻辑 (保留原样) ===

const selectCustomMode = () => {
  activePresetIndex.value = -1;
  resetToOriginal();
};

const selectPreset = (preset, index) => {
  activePresetIndex.value = index;
  isInternalUpdate.value = true;
  width.value = preset.w;
  height.value = preset.h;
  isAdaptive.value = true;
  nextTick(() => {
    isInternalUpdate.value = false;
    updatePreviewBox();
  });
};

const toggleAdaptive = () => {
  isAdaptive.value = !isAdaptive.value;
  if (isAdaptive.value && width.value > 0) {
    isInternalUpdate.value = true;
    height.value = Math.round(width.value / currentTargetRatio.value);
    nextTick(() => {
      isInternalUpdate.value = false;
      updatePreviewBox();
    });
  } else {
    updatePreviewBox();
  }
};

const resetToOriginal = () => {
  const size = getCurrentSize();
  width.value = size.width;
  height.value = size.height;
  updatePreviewBox();
};

// === 监听输入 ===

watch(width, (newW) => {
  if (isInternalUpdate.value) return;
  if (isAdaptive.value && newW > 0) {
    isInternalUpdate.value = true;
    height.value = Math.round(newW / currentTargetRatio.value);
    nextTick(() => {
      isInternalUpdate.value = false;
    });
  }
});

watch(height, (newH) => {
  if (isInternalUpdate.value) return;
  if (isAdaptive.value && newH > 0) {
    isInternalUpdate.value = true;
    width.value = Math.round(newH * currentTargetRatio.value);
    nextTick(() => {
      isInternalUpdate.value = false;
    });
  }
});

const onInputChanged = () => {
  updatePreviewBox();
};

const updatePreviewBox = () => {
  if (width.value > 0 && height.value > 0) {
    updatePreview(width.value, height.value, !isAdaptive.value);
  } else {
    stopPreview();
  }
};

// 监听展开状态
watch(
  () => props.isExpanded,
  (val) => {
    if (val) initSize();
    else cleanup(); // 使用 cleanup 替代原来的 stopPreview
  }
);

// === 应用与取消 ===
const handleApply = () => {
  applyResize(width.value, height.value, !isAdaptive.value);
  emit("toggle"); // 关闭会自动触发 watch -> cleanup -> 解锁
};

const handleCancel = () => {
  cleanup(); // 显式调用清理
  emit("toggle");
};

const handleToggle = () => {
  emit("toggle");
};

onMounted(() => {
  if (props.isExpanded) initSize();
});

onUnmounted(() => cleanup());
</script>

<style scoped>
/* Grid 布局实现矩阵效果 */
.preset-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* 两列 */
  gap: 8px;
  margin-bottom: 16px;
  max-height: 280px;
  overflow-y: auto;
}

.preset-item {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 6px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  /* 垂直排列文字 */
  align-items: center;
  justify-content: space-between;
  text-align: center;
  transition: all 0.2s;
}

.preset-item:hover {
  background-color: #e6f7ff;
  border-color: #c0c4cc;
}

.preset-item.active {
  background-color: #ecf5ff;
  color: var(--ie-primary-color);
  border-color: var(--ie-primary-color);
  font-weight: 500;
}

/* 自定义项特殊样式 */
.custom-item {
  flex-direction: row;
  /* 横向 */
  grid-column: span 2;
  /* 占满一行 */
  background-color: #fff;
  border: 1px dashed #dcdfe6;
}

.custom-item.active {
  border-style: solid;
}

.preset-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.preset-dim {
  font-size: 11px;
  color: #909399;
}

/* 输入框区域样式优化 */
.resize-input-box {
  background-color: #fff;
  padding: 4px 0;
}

.input-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  width: 40%;
}

.ie-input {
  text-align: center;
  padding-right: 20px;
  font-weight: bold;
  color: #333;
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 32px;
  font-size: 13px;
}

.ie-input:focus {
  border-color: var(--ie-primary-color);
  outline: none;
}

.suffix {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
  font-size: 11px;
  pointer-events: none;
}

.link-icon-btn {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.link-icon-btn:hover {
  background-color: #f0f0f0;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.switch-label {
 
  color: #606266;
  margin-left: 8px;
  cursor: pointer;
}

.ie-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 32px;
  height: 16px;
  border-radius: 10px;
  background-color: #dcdfe6;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ie-switch.is-checked {
  background-color: var(--ie-primary-color);
}

.ie-switch-core {
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 100%;
  width: 12px;
  height: 12px;
  background-color: #fff;
  transition: all 0.3s;
}

.ie-switch.is-checked .ie-switch-core {
  left: 100%;
  margin-left: -14px;
}

.reset-row {
  text-align: center;
  margin-bottom: 10px;
}

.reset-link {
 
  color: #909399;
  cursor: pointer;
  text-decoration: underline;
}

.reset-link:hover {
  color: var(--ie-primary-color);
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.full {
  flex: 1;
}

.tool-item:hover .arrow {
  transform: translateX(2px);
  transition: transform 0.2s;
}

.tool-content {
  padding: 16px;
  border: 1px solid #eee;
  border-top: none;
}
</style>
