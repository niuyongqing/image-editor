<template>
  <div class="tool-group">
    <div class="tool-item" :class="{ 'is-expanded': isExpanded }" @click="handleToggle">
      <div class="left">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <path d="m19 2 2 2-2 2-2-2Z" />
          <path d="m13 2 2 2-2 2-2-2Z" />
          <path d="m6 6 2 2-2 2-2-2Z" />
          <path d="m3 21 9-9" />
          <path
            d="M12.22 7.28a3 3 0 0 0-4.24 0L3.5 11.76a3 3 0 0 0 0 4.24l4.48 4.48a3 3 0 0 0 4.24 0l4.48-4.48a3 3 0 0 0 0-4.24Z" />
        </svg>
        <span>滤镜</span>
      </div>
      <div class="right-icon">
        <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="tool-content">
      <div style="padding: 10px; color: #666; font-size: 14px;">
        滤镜功能区域...
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  isExpanded: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle']);

const handleToggle = () => {
  emit('toggle');
};
</script>

<style scoped>
/* 简单的 hover 动画 */
.tool-item:hover .arrow {
  transform: translateX(2px);
  transition: transform 0.2s;
}
</style>