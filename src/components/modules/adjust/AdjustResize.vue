<template>
  <div class="tool-group">
    <div class="tool-item" :class="{ 'is-expanded': isExpanded }" @click="handleToggle">
      <div class="left">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <path d="M15 3h6v6" />
          <path d="M9 21H3v-6" />
          <path d="M21 3l-7 7" />
          <path d="M3 21l7-7" />
        </svg>
        <span>调整尺寸</span>
      </div>
      <div class="right-icon">
        <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="tool-content">
      
      <div class="preset-list">
        <div 
          class="preset-item custom-item"
          :class="{ active: isCustomMode }" 
          @click="selectCustomMode"
        >
          <span>自定义</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>

        <div 
          v-for="(preset, index) in presets" 
          :key="index" 
          class="preset-item"
          :class="{ active: activePresetIndex === index }" 
          @click="selectPreset(preset, index)"
        >
          {{ preset.label }} <span class="dim">({{ preset.w }}×{{ preset.h }})</span>
        </div>
      </div>

      <div class="resize-input-box">
        
        <div class="input-controls">
           <div class="input-wrapper">
             <input 
               type="number" 
               v-model.number="width" 
               class="ie-input" 
               @input="onWidthInput"
             >
             <span class="suffix">W</span>
           </div>

           <div class="link-icon-static">
              <svg v-if="isAdaptive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                 <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                 <line x1="4" y1="4" x2="20" y2="20" stroke="#ccc"></line>
              </svg>
           </div>

           <div class="input-wrapper">
             <input 
               type="number" 
               v-model.number="height" 
               class="ie-input" 
               @input="onHeightInput"
             >
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
          <span class="switch-label">图片宽高自适应调整</span>
          
          <div class="help-icon" title="开启：保持比例适应/裁切；关闭：强制拉伸变形">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
        </div>

        <div v-if="isCustomMode" class="reset-row">
           <span class="reset-link" @click="resetToOriginal">恢复原图尺寸</span>
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
import { ref, inject, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { registerResizeModule, getCurrentSize, applyResize, startPreview, updatePreview, stopPreview } from './useCanvasResize';

const props = defineProps({
  isExpanded: { type: Boolean, default: false }
});

const emit = defineEmits(['toggle']);
const canvasAPI = inject('canvasAPI');

// === 状态定义 ===
const width = ref(0);
const height = ref(0);
const isAdaptive = ref(true); 
const originalRatio = ref(1); // 保持原变量名
const activePresetIndex = ref(-1); 

// 计算属性：判断当前是否是自定义模式
const isCustomMode = computed(() => activePresetIndex.value === -1);

const presets = [
  { label: '方形主图', w: 800, h: 800 },
  { label: 'Temu服装图', w: 1340, h: 1785 },
  { label: '方形主图', w: 1000, h: 1000 },
  { label: '竖版主图', w: 750, h: 1000 },
  { label: 'Facebook封面', w: 851, h: 315 },
];

// === 核心逻辑 1: 获取当前应当遵循的比例 ===
const currentTargetRatio = computed(() => {
  if (activePresetIndex.value >= 0) {
    const p = presets[activePresetIndex.value];
    return p.h !== 0 ? (p.w / p.h) : 1; 
  } else {
    return originalRatio.value;
  }
});

// === 初始化 ===
const initSize = () => {
  if (canvasAPI && canvasAPI.canvas) {
    registerResizeModule(canvasAPI.canvas, canvasAPI.saveHistory);
    const size = getCurrentSize();
    
    if (size.height > 0) {
      originalRatio.value = size.width / size.height;
    }

    width.value = size.width;
    height.value = size.height;
    activePresetIndex.value = -1; // 默认选中自定义
    isAdaptive.value = true;      // 默认开启自适应

    nextTick(() => {
      startPreview(width.value, height.value);
    });
  }
};

// === 2. 上层逻辑：选项点击 (Top-Down) ===

const selectCustomMode = () => {
  activePresetIndex.value = -1;
  resetToOriginal(); 
};

const selectPreset = (preset, index) => {
  activePresetIndex.value = index;
  // 选中预设时，直接应用预设的尺寸，不强制改变 switch 状态
  width.value = preset.w;
  height.value = preset.h;
};

// === 3. 下层逻辑：输入框控制 (Bottom-Up) ===

const isInternalUpdate = ref(false);

const onWidthInput = () => {
  // 仅接收输入，不改变 activePresetIndex (满足你的需求：不反向改变选中状态)
};

const onHeightInput = () => {
  // 同上
};

// 监听宽度变化
watch(width, (newW) => {
  if (isInternalUpdate.value) return; 

  // 只有在【保真模式开启】且数值有效时，才自动计算高度
  // 核心：使用 currentTargetRatio (上面选中的比例)
  if (isAdaptive.value && newW > 0) {
    isInternalUpdate.value = true; 
    height.value = Math.round(newW / currentTargetRatio.value);
    nextTick(() => { isInternalUpdate.value = false; });
  }
});

// 监听高度变化
watch(height, (newH) => {
  if (isInternalUpdate.value) return;

  if (isAdaptive.value && newH > 0) {
    isInternalUpdate.value = true;
    width.value = Math.round(newH * currentTargetRatio.value);
    nextTick(() => { isInternalUpdate.value = false; });
  }
});

// === 辅助功能 ===
const resetToOriginal = () => {
  const size = getCurrentSize();
  width.value = size.width;
  height.value = size.height;
};

const toggleAdaptive = () => {
  isAdaptive.value = !isAdaptive.value;
  
  // 打开开关时，立即同步一次比例
  if (isAdaptive.value && width.value > 0) {
    isInternalUpdate.value = true;
    height.value = Math.round(width.value / currentTargetRatio.value);
    nextTick(() => { isInternalUpdate.value = false; });
  }
};

// === 预览与应用 ===
watch([width, height, isAdaptive], () => {
  if (!props.isExpanded) return;

  // 修复：只要有宽高，就一直显示蓝色选框，防止“关闭保真模式”时选框消失
  if (width.value > 0 && height.value > 0) {
    updatePreview(width.value, height.value);
  } else {
    stopPreview();
  }
});

watch(() => props.isExpanded, (val) => {
  if (val) initSize();
  else stopPreview();
});

// === 这里的逻辑完全保留你原来的写法 ===
const handleApply = () => {
  // 应用逻辑：
  const isStretch = !isAdaptive.value;
  applyResize(width.value, height.value, isStretch);
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
  if (props.isExpanded) initSize();
});

onUnmounted(() => stopPreview());
</script>

<style scoped>
/* 保持所有样式不变 */
.tool-item:hover .arrow { transform: translateX(2px); transition: transform 0.2s; }
.resize-input-box { background-color: #fff; border-radius: 6px; padding: 10px 0; margin-bottom: 12px; }
.preset-list { display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; margin-bottom: 16px; padding-right: 4px; }
.preset-item { background-color: #f5f7fa; padding: 10px 12px; border-radius: 6px; font-size: 13px; color: #606266; cursor: pointer; border: 1px solid transparent; display: flex; justify-content: space-between; align-items: center; }
.preset-item:hover { background-color: #e6f7ff; border-color: #c0c4cc; }
.preset-item.active { background-color: #ecf5ff; color: #409eff; border-color: #409eff; font-weight: 500; }
.dim { color: #909399; font-size: 12px; margin-left: 4px; }
.custom-item { border: 1px solid #dcdfe6; background-color: #fff; margin-bottom: 4px; }
.custom-item.active { border-color: #009688; color: #333; }
.input-controls { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.input-wrapper { position: relative; width: 42%; }
.ie-input { text-align: center; padding-right: 20px; font-weight: 500; color: #333; width: 100%; border: 1px solid #dcdfe6; border-radius: 4px; height: 36px; font-size: 14px; }
.ie-input:focus { border-color: #409eff; outline: none; }
.suffix { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: #c0c4cc; font-size: 12px; pointer-events: none; }
.link-icon-static { display: flex; align-items: center; opacity: 0.8; }
.switch-row { display: flex; align-items: center; margin-top: 10px; margin-bottom: 5px; }
.switch-label { font-size: 13px; color: #333; margin-left: 8px; margin-right: 4px; user-select: none; }
.help-icon { cursor: help; display: flex; align-items: center; }
.ie-switch { position: relative; display: inline-flex; align-items: center; width: 40px; height: 20px; border-radius: 10px; background-color: #dcdfe6; cursor: pointer; transition: background-color 0.3s; }
.ie-switch.is-checked { background-color: #009688; }
.ie-switch-core { position: absolute; top: 2px; left: 2px; border-radius: 100%; width: 16px; height: 16px; background-color: #fff; transition: all 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
.ie-switch.is-checked .ie-switch-core { left: 100%; margin-left: -18px; }
.reset-row { text-align: right; margin-top: 4px; }
.reset-link { font-size: 12px; color: #909399; cursor: pointer; text-decoration: underline; }
.reset-link:hover { color: #009688; }
.action-buttons { display: flex; gap: 10px; margin-top: 15px; }
.full { flex: 1; }
.ie-btn.ie-primary { background-color: #009688; border-color: #009688; color: white; }
.ie-btn.ie-primary:hover { background-color: #00796b; border-color: #00796b; }
</style>