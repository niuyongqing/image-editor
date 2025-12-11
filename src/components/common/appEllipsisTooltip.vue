<template>
  <!-- 智能提示，自动根据元素宽度控制是否提示 -->
  <a-tooltip
    v-bind="$attrs"
    :trigger="isOverflow ? 'hover' : 'none'"
    :title="title || defaultTitle"
    :overlayStyle="{ ...overlayStyle }"
  >
    <!-- Tooltip 自定义标题插槽 -->
    <template #title v-if="$slots.title">
      <slot name="title" />
    </template>
    <div
      ref="contentRef"
      class="ellipsis-content"
      :class="{
        'single-line': lines === 1,
        'multi-line': lines > 1
      }"
      :style="{ '-webkit-line-clamp': lines }"
    >
      <!-- 默认插槽：需要溢出提示的内容 -->
      <slot>{{ title }}</slot>
    </div>
  </a-tooltip>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
defineOptions({ name: "appEllipsisTooltip" });
const { proxy: _this } = getCurrentInstance();
// 定义 Props（透传 a-tooltip 所有属性，扩展自定义属性）
const props = defineProps({
  // 溢出显示行数（1=单行，>1=多行）
  lines: {
    type: Number,
    default: 1
  },
  // Tooltip 标题（优先级低于 title 插槽）
  title: {
    type: String,
    default: ''
  },
  // Tooltip 浮层样式（透传）
  overlayStyle: {
    type: Object,
    default: () => ({})
  }
});

// 响应式状态：是否溢出
const isOverflow = ref(false);
// 默认标题（取插槽内容文本，避免重复写标题）
const defaultTitle = ref('');

// 更新溢出状态
function updateOverflow() {
  const el = _this.$refs.contentRef;
  if (!el) return;
  // 单行溢出判断：滚动宽度 > 可视宽度
  // 多行溢出判断：滚动高度 > 可视高度
  const overflow = props.lines === 1 ? el.scrollWidth > el.clientWidth : el.scrollHeight > el.clientHeight;
  isOverflow.value = overflow;
  // 自动提取内容文本作为默认标题（避免手动传title）
  if (overflow) {
    defaultTitle.value = el.innerText || el.textContent;
  }
};

// 组件挂载/更新后判断溢出
onMounted(() => nextTick(updateOverflow));
onUpdated(() => nextTick(updateOverflow));

// 监听内容变化（可选：若内容是动态数据，强制更新判断）
watch(() => props.title || defaultTitle.value, () => nextTick(updateOverflow));

</script>
<style lang="less" scoped>
.ellipsis-content {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis; /* 单行省略号 */
}

.single-line {
  white-space: nowrap;
}

.multi-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>