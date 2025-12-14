<template>
  <div class="tool-group">
    <div class="tool-item" :class="{ 'is-expanded': isExpanded }" @click="handleToggle">
      <div class="left">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
          <path d="M18 12l-6-6c-1-1-2-1-3 0l-6 6c-1 1-1 2 0 3l6 6c1 1 2 1 3 0l6-6c1-1 1-2 0-3z" />
          <path d="M9 15l6-6" />
        </svg>
        <span>消除笔</span>
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
        消除笔功能区域...
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