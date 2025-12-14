<template>
  <div class="workspace-container">
    <div class="canvas-center" ref="canvasContainer">
      <canvas id="c"></canvas>
    </div>

    <div class="zoom-controls">
      <button class="ie-btn ie-btn-circle" title="缩小">
        <svg viewBox="0 0 1024 1024" width="16" height="16">
          <path d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 1 0 0 64z" fill="currentColor" />
        </svg>
      </button>

      <span class="zoom-text">100%</span>

      <button class="ie-btn ie-btn-circle" title="放大">
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
import { onMounted, inject, ref } from 'vue';

const DEFAULT_IMG_URL = 'src/assets/image/01.jpg';

const canvasAPI = inject('canvasAPI');
const canvasContainer = ref(null);

onMounted(() => {
  // 等 DOM 渲染好 <canvas id="c"> 后，通知父组件初始化 Fabric
  if (canvasAPI && canvasAPI.init) {
    const width = canvasContainer.value.clientWidth || 1900;
    const height = canvasContainer.value.clientHeight || 1000;
    // 传递容器元素给 canvasAPI.init
    canvasAPI.init('c', width, height);
    setTimeout(() => {
      // 注意：如果打包后没有 public/src 目录，这个默认图片可能需要调整加载方式
      // 建议改为传入 base64 或外部 URL，或者在组件外部控制初始图片
      canvasAPI.initImage(DEFAULT_IMG_URL);
    }, 100);
  } else {
    console.error('CanvasAPI not found. Make sure EditorLayout provides it.');
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
  /* 防止画布溢出 */
}

.canvas-center {
  /* 给画布一个阴影，让它看起来像一张纸 */
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  /* 这里的宽高可能需要根据 fabric 实际大小自适应，或者作为容器限制 */
  width: 90%;
  height: 90%;
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
  /* 数字等宽，防止抖动 */
}
</style>