<template>
  <div class="tool-group">
    <div class="tool-item" @click="handleRembg">
      <div class="left">
        <svg width="18" height="18" viewBox="0 0 1024 1024" style="margin-right: 8px; fill: currentColor">
          <path
            d="M579.52 752.64a96 96 0 1 1-135.84-135.808 96 96 0 0 1 135.84 135.808z m67.872-67.904a192 192 0 1 0-305.696 158.048l-239.04-239.04a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 0l239.04 239.04A192.064 192.064 0 0 0 647.392 684.736zM325.28 475.04a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 0l239.04 239.04a192.064 192.064 0 0 0-152.096 305.664l-177.44-177.408z m563.488 277.6a192.064 192.064 0 0 0-305.664-152.096l-21.44-21.44 384-384a96 96 0 0 1 135.776 135.776l-192.672 192.672zM330.4 200.48l384 384-21.44 21.44A192.064 192.064 0 0 0 540.864 300.256l-192.672-192.672a96 96 0 0 1 135.776-135.808l-153.568 228.704z" />
        </svg>
        <span>一键抠图</span>
      </div>

      <div class="right-icon">
        <svg v-if="loading" class="loading-icon" width="16" height="16" viewBox="0 0 1024 1024"
          style="fill: currentColor">
          <path
            d="M512 1024c-282.752 0-512-229.248-512-512s229.248-512 512-512v128c-211.968 0-384 172.032-384 384s172.032 384 384 384v128z" />
        </svg>
        <svg v-else class="arrow" width="14" height="14" viewBox="0 0 1024 1024" style="fill: currentColor">
          <path
            d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { aiApi } from '@/api/ai';
import { Toast } from '@/utils/toast';

const canvasAPI = inject('canvasAPI');
const loading = ref(false);

const handleRembg = async () => {
  const activeObj = canvasAPI?.canvas.value?.getActiveObject();
  if (!activeObj || activeObj.type !== 'image') return Toast.warning('请先选中图片');

  loading.value = true;
  try {
    const src = activeObj.getSrc();
    const blob = await (await fetch(src)).blob();
    const newUrl = await aiApi.removeBackground(new File([blob], "img.png"));
    canvasAPI.replaceActiveImage(newUrl);
    Toast.success('抠图完成');
  } catch (e) {
    console.error(e);
    Toast.error('抠图失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Loading 旋转动画 */
.loading-icon {
  animation: rotating 1s linear infinite;
  color: #409eff;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 简单的 hover 动画 */
.tool-item:hover .arrow {
  transform: translateX(2px);
  transition: transform 0.2s;
}
</style>