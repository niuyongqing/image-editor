<template>
  <div class="tool-group">
    <div class="tool-item" :class="{ 'is-expanded': isExpanded }" @click="handleToggle">
      <div class="left">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <path d="M15 3h6v6" />
          <path d="M9 21H3v-6" />
          <path d="M21 3l-7 7" />
          <path d="M3 21l7-7" />
        </svg>
        <span>调整尺寸</span>
      </div>
      <div class="right-icon">
        <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="tool-content">
      


      <div class="preset-list">
        <div 
          v-for="(preset, index) in presets" 
          :key="index" 
          class="preset-item"
          :class="{ active: activePresetIndex === index }" 
          @click="selectPreset(preset, index)"
        >
          {{ preset.label }} ({{ preset.w }} × {{ preset.h }})
        </div>
      </div>
      <div class="resize-input-box">
        <div class="input-header">
          <span>自定义</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>

        <div class="input-controls">
           <div class="input-wrapper">
             <input type="number" v-model.number="width" class="ie-input" @input="onWidthChange">
             <span class="suffix">W</span>
           </div>

           <div class="link-icon" @click="toggleLock">
              <svg v-if="locked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#409eff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6">
                 <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                 <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                 <line x1="4" y1="4" x2="20" y2="20" stroke="#909399"></line>
              </svg>
           </div>

           <div class="input-wrapper">
             <input type="number" v-model.number="height" class="ie-input" @input="onHeightChange">
             <span class="suffix">H</span>
           </div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="ie-btn ie-primary full" @click="handleApply">应用</button>
        <button class="ie-btn full" @click="handleCancel">取消</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { registerResizeModule, getCurrentSize, applyResize, startPreview, updatePreview, stopPreview } from './useCanvasResize';

const props = defineProps({
  isExpanded: { type: Boolean, default: false }
});

const emit = defineEmits(['toggle']);
const canvasAPI = inject('canvasAPI');

// 状态
const width = ref(0);
const height = ref(0);
const locked = ref(true);     
const aspectRatio = ref(1);   
const activePresetIndex = ref(-1); // 新增：记录当前选中的预设索引

const presets = [
  { label: '方形主图', w: 800, h: 800 },
  { label: 'Temu服装图', w: 1340, h: 1785 },
  { label: '方形主图', w: 1000, h: 1000 },
  { label: '竖版主图', w: 750, h: 1000 },
  { label: '方形主图', w: 500, h: 500 },
  { label: '竖版主图', w: 1000, h: 1200 },
  { label: 'Youtube视频封面', w: 1280, h: 720 },
  { label: 'Pinterest帖子', w: 750, h: 1120 },
  { label: 'Facebook封面', w: 851, h: 315 },
];

const initSize = () => {
  if (canvasAPI && canvasAPI.canvas) {
    registerResizeModule(canvasAPI.canvas, canvasAPI.saveHistory);
    const size = getCurrentSize();
    width.value = size.width;
    height.value = size.height;
    if (size.height > 0) {
      aspectRatio.value = size.width / size.height;
    }
    activePresetIndex.value = -1; // 初始化时不选中任何预设
    nextTick(() => {
        startPreview(width.value, height.value);
    });
  }
};

watch(() => props.isExpanded, (val) => {
  if (val) {
    initSize();
  } else {
    stopPreview();
  }
});

watch([width, height], ([newW, newH]) => {
  if (props.isExpanded && newW > 0 && newH > 0) {
    updatePreview(newW, newH);
  }
});

const toggleLock = () => {
  locked.value = !locked.value;
  // 如果用户手动解锁，取消预设的高亮，表示进入了完全自由模式
  if (!locked.value) {
    activePresetIndex.value = -1;
  } else if (height.value > 0) {
    // 如果重新上锁，锁定当前输入框的比例
    aspectRatio.value = width.value / height.value;
  }
};

const onWidthChange = () => {
  if (locked.value && width.value) {
    height.value = Math.round(width.value / aspectRatio.value);
  }
};

const onHeightChange = () => {
  if (locked.value && height.value) {
    width.value = Math.round(height.value * aspectRatio.value);
  }
};

const selectPreset = (preset, index) => {
  width.value = preset.w;
  height.value = preset.h;
  
  // 1. 设置高亮
  activePresetIndex.value = index; 
  
  // 2. 强制锁定比例
  locked.value = true;
  
  // 3. 更新计算比例为当前预设的比例
  // 这样当用户之后修改 width 时，height 会按照这个预设的比例自动计算
  if (preset.h > 0) {
    aspectRatio.value = preset.w / preset.h;
  }
};

const handleApply = () => {
  applyResize(width.value, height.value);
  emit('toggle');
};

const handleCancel = () => {
  stopPreview(); 
  emit('toggle');
}

const handleToggle = () => {
  emit('toggle');
};

onMounted(() => {
  if (props.isExpanded) {
      initSize();
  }
});

onUnmounted(() => {
  stopPreview();
});
</script>

<style scoped>
/* 保持原有样式 */
.tool-item:hover .arrow {
  transform: translateX(2px);
  transition: transform 0.2s;
}

.resize-input-box {
  background-color: #f8f9fa;
  border: none;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 12px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #333;
  margin-bottom: 8px;
}

.input-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-wrapper {
  position: relative;
  width: 38%;
}

.ie-input {
  text-align: center;
  padding-right: 20px;
  font-weight: 500;
  color: #333;
}

.suffix {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
  font-size: 12px;
  pointer-events: none;
}

.link-icon {
  width: 24px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.preset-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.preset-item {
  background-color: #f5f7fa;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  border: 1px solid transparent; /* 预留边框位置防止抖动 */
}

.preset-item:hover {
  background-color: #e6f7ff;
  color: #409eff;
}

/* 新增：选中状态的样式 */
.preset-item.active {
  background-color: #ecf5ff; /* 浅蓝色背景 */
  color: #409eff; /* 蓝色文字 */
  border-color: #409eff; /* 蓝色边框 */
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.full {
  flex: 1;
}

.ie-btn.ie-primary {
  background-color: #009688;
  border-color: #009688;
}

.ie-btn.ie-primary:hover {
  background-color: #00796b;
  border-color: #00796b;
}
</style>