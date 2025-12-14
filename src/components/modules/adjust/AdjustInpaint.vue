<template>
  <div class="tool-group">
    <div class="tool-item" :class="{ 'is-expanded': isExpanded }" @click="handleToggle">
      <div class="left">
        <svg width="18" height="18" viewBox="0 0 1024 1024" style="margin-right: 8px; fill: currentColor">
          <path
            d="M128.896 736H32a32 32 0 0 1 0-64h96.896a32 32 0 0 1 0 64zM480 864h-64a32 32 0 0 1 0-64h64a32 32 0 0 1 0 64zM320 544h-64a32 32 0 0 1 0-64h64a32 32 0 0 1 0 64zM160 352h-64a32 32 0 0 1 0-64h64a32 32 0 0 1 0 64z m558.144 266.112L453.696 353.664a32 32 0 0 0-45.248 0l-226.304 226.24a32 32 0 0 0 0 45.248l264.448 264.512a32 32 0 0 0 45.248 0l226.304-226.304a32 32 0 0 0 0-45.248zM921.152 250.56l-90.56-90.496a32 32 0 0 0-45.248 0l-90.496 90.496a32 32 0 0 0 0 45.248l90.496 90.56a32 32 0 0 0 45.248 0l90.56-90.56a32 32 0 0 0 0-45.248z" />
        </svg>
        <span>消除笔</span>
      </div>
      <div class="right-icon">
        <svg class="arrow" width="14" height="14" viewBox="0 0 1024 1024" style="fill: currentColor">
          <path
            d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" />
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