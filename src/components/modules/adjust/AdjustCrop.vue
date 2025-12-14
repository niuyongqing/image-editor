<template>
  <div class="tool-group">
    <div class="tool-item" :class="{ 'is-expanded': isExpanded }" @click="handleToggle">
      <div class="left">
        <svg width="18" height="18" viewBox="0 0 1024 1024" style="margin-right: 8px; fill: currentColor">
          <path
            d="M256 768h512a32 32 0 1 1 0 64H224a32 32 0 0 1-32-32V256a32 32 0 1 1 64 0v512z m512-512H256a32 32 0 1 1 0-64h544a32 32 0 0 1 32 32v544a32 32 0 1 1-64 0V256z" />
        </svg>
        <span>裁剪/旋转</span>
      </div>
      <div class="right-icon">
        <svg class="arrow" width="14" height="14" viewBox="0 0 1024 1024" style="fill: currentColor">
          <path
            d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" />
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="tool-content">

      <div class="ratio-grid">
        <div class="ratio-item" @click="resetCrop">
          <div class="icon-box">
            <svg width="16" height="16" viewBox="0 0 1024 1024" style="fill: currentColor">
              <path
                d="M289.408 214.656L229.056 275.008 530.752 576.704 229.056 878.4 289.408 938.752 591.104 637.056 892.8 938.752 953.152 878.4 651.456 576.704 953.152 275.008 892.8 214.656 591.104 516.352z" />
            </svg>
          </div>
          <span>初始化</span>
        </div>

        <div class="ratio-item" :class="{ active: currentRatio === 'original' }" @click="startCrop(null, true)">
          <div class="shape-rect" style="width: 14px; height: 14px; border:1px solid #666"></div>
          <span>原比例</span>
        </div>

        <div class="ratio-item" :class="{ active: currentRatio === 'free' }" @click="startCrop(null)">
          <div class="shape-rect dashed"></div>
          <span>自由比例</span>
        </div>

        <div class="ratio-item" :class="{ active: currentRatio === 1 }" @click="startCrop(1)">
          <div class="shape-rect square"></div>
          <span>1:1</span>
        </div>

        <div class="ratio-item" :class="{ active: currentRatio === 4 / 3 }" @click="startCrop(4 / 3)">
          <div class="shape-rect" style="width: 16px; height: 12px;"></div>
          <span>4:3</span>
        </div>

        <div class="ratio-item" :class="{ active: currentRatio === 16 / 9 }" @click="startCrop(16 / 9)">
          <div class="shape-rect rect-h"></div>
          <span>16:9</span>
        </div>
      </div>

      <div class="custom-size-box">
        <div class="input-row">
          <div class="input-wrapper">
            <input type="number" v-model.number="cropW" class="ie-input" @change="updateCropSize">
            <span class="input-suffix">W</span>
          </div>

          <div class="link-icon">
            <span style="color: #909399; font-size: 14px;">×</span>
          </div>

          <div class="input-wrapper">
            <input type="number" v-model.number="cropH" class="ie-input" @change="updateCropSize">
            <span class="input-suffix">H</span>
          </div>
        </div>
      </div>

      <div class="rotate-actions">
        <div class="action-btn" title="向左旋转90°" @click="rotate(-90)">
          <svg width="20" height="20" viewBox="-1 -1 26 26" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </div>

        <div class="action-btn" title="向右旋转90°" @click="rotate(90)">
          <svg width="20" height="20" viewBox="-1 -1 26 26" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </div>

        <div class="divider"></div>

        <div class="action-btn" title="水平翻转" @click="flip('X')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14" />
            <path d="M8 9l-3 3 3 3" />
            <path d="M16 9l3 3-3 3" />
          </svg>
        </div>

        <div class="action-btn" title="垂直翻转" @click="flip('Y')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <path d="M9 8l3-3 3 3" />
            <path d="M9 16l3 3 3-3" />
          </svg>
        </div>
      </div>

      <div class="confirm-row">
        <button class="ie-btn ie-primary full-btn" @click="applyCrop">应用</button>
        <button class="ie-btn full-btn" @click="cancelCrop">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch, onMounted, onUnmounted } from 'vue';

// 移除了 Element Plus 的图标引用

const props = defineProps({
  isExpanded: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['toggle']);

const canvasAPI = inject('canvasAPI');
const currentRatio = ref('free');
const cropW = ref(1000);
const cropH = ref(1000);

// === 核心改动：监听展开状态 ===
watch(() => props.isExpanded, (val) => {
  if (val) {
    // 展开面板 -> 开启自由比例裁剪
    // 稍微延迟一点，确保 content 渲染完毕
    setTimeout(() => startCrop(null), 50);
  } else {
    // 收起面板 -> 取消裁剪
    canvasAPI?.cancelCrop();
  }
});

const handleToggle = () => {
  emit('toggle');
};

const startCrop = (ratio, isOriginal = false) => {
  currentRatio.value = ratio;
  if (ratio === null && !isOriginal) currentRatio.value = 'free';
  if (isOriginal) currentRatio.value = 'original';

  if (!canvasAPI) return;

  let targetRatio = ratio;
  if (isOriginal) {
    const activeObj = canvasAPI.canvas.value?.getObjects().find(o => o.type === 'image');
    if (activeObj) {
      targetRatio = activeObj.width / activeObj.height;
    }
  }
  canvasAPI.startCrop(targetRatio);
  updateInputFromCanvas();
};

const updateCropSize = () => {
  if (canvasAPI?.setCropBoxSize) {
    canvasAPI.setCropBoxSize(cropW.value, cropH.value);
  }
};

const updateInputFromCanvas = () => {
  const cropObj = canvasAPI.canvas.value?.getObjects().find(o => o.type === 'rect');
  if (cropObj) {
    cropW.value = Math.round(cropObj.width * cropObj.scaleX);
    cropH.value = Math.round(cropObj.height * cropObj.scaleY);
  }
};

const resetCrop = () => startCrop(null);

const applyCrop = () => {
  canvasAPI?.confirmCrop();
  emit('toggle'); // 应用后自动收起
};

const cancelCrop = () => {
  canvasAPI?.cancelCrop();
  emit('toggle'); // 取消后自动收起
};

const rotate = (angle) => {
  canvasAPI?.rotateActive(angle);
  setTimeout(() => updateInputFromCanvas(), 50);
};

const flip = (axis) => {
  canvasAPI?.flipActive(axis);
};

onMounted(() => {
  canvasAPI.canvas.value?.on('object:scaling', updateInputFromCanvas);
  canvasAPI.canvas.value?.on('object:modified', updateInputFromCanvas);

  if (props.isExpanded) {
    startCrop(null);
  }
});

onUnmounted(() => {
  canvasAPI.canvas.value?.off('object:scaling', updateInputFromCanvas);
  canvasAPI.canvas.value?.off('object:modified', updateInputFromCanvas);
});
</script>

<style scoped>
/* 保持原有布局样式 */
.ratio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.ratio-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 4px;
  border: 1px solid #f2f2f2;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  background: #fff;
  transition: all 0.2s;
  height: 60px;
}

.ratio-item:hover {
  background-color: #f9f9f9;
  border-color: #dcdfe6;
}

.ratio-item.active {
  border-color: #409eff;
  color: #409eff;
  background-color: #ecf5ff;
}

/* 图标辅助样式 */
.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.shape-rect {
  border: 1px solid currentColor;
  margin-bottom: 6px;
  box-sizing: border-box;
}

.shape-rect.dashed {
  border-style: dashed;
  width: 14px;
  height: 14px;
}

.shape-rect.square {
  width: 14px;
  height: 14px;
}

.shape-rect.rect-h {
  width: 18px;
  height: 10px;
}

.custom-size-box {
  margin-bottom: 16px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 输入框包装，用于定位 suffix */
.input-wrapper {
  position: relative;
  width: 45%;
}

.ie-input {
  padding-right: 25px;
  text-align: center;
}

.input-suffix {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #999;
  pointer-events: none;
}

.link-icon {
  color: #909399;
  cursor: pointer;
}

.rotate-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: #606266;
  font-size: 18px;
  background-color: #f5f7fa;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #e6e8eb;
  color: #333;
}

.divider {
  width: 1px;
  height: 20px;
  background-color: #eee;
}

.confirm-row {
  display: flex;
  gap: 10px;
}

.full-btn {
  flex: 1;
}
</style>