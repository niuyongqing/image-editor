<template>
  <!-- 通用弹窗组件 -->
  <a-modal 
    v-model:open="internalOpen" 
    :title="title" 
    :width="width" 
    :maskClosable="false" 
    :keyboard="false"
    v-bind="$attrs"
  >
    <!-- 默认插槽，用于放置弹窗的主要内容 -->
    <div class="appModalContent" :style="{ 'maxHeight': contentHeight }">
      <slot name="appContent"></slot>
    </div>

    <template #footer>
      <a-space>
        <slot name="appFooter">
          <a-button @click="handleCustomCancel">取消</a-button>
          <a-button type="primary" @click="handleCustomOk">确定</a-button>
        </slot>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  openValue: {          // 控制弹窗展示   v-model:openValue
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: '',
  },
  // 宽度
  width: {
    type: [String],
    default: '70%',
  },
  contentHeight: {          // 弹窗高度
    type: [String],
    default: '600px',
  },
});

// 定义emit事件
const emit = defineEmits([
  'update:openValue', 
  'open',     // 弹窗打开事件
  'close',    // 弹窗关闭事件
  'cancel',   // 默认取消按钮点击事件
  'ok'        // 默认确定按钮点击事件
]);
const internalOpen = ref(props.openValue);
watch(() => props.openValue, newVal => {
  internalOpen.value = newVal;
});

// 监听内部open变化，同步到外部
watch(() => internalOpen.value, (newVal, oldVal) => {
  emit('update:openValue', newVal);
  if (newVal) {
    emit('open');
  }
  if (!newVal) {
    emit('close');
  }
});
// 暴露方法给父组件
const openModal = () => {
  internalOpen.value = true;
};

const closeModal = () => {
  internalOpen.value = false;
};
const handleCustomCancel = () => {
  emit('cancel');
};
const handleCustomOk = () => {
  emit('ok');
};
// 定义暴露的方法
defineExpose({
  openModal,
  closeModal,
});
</script>

<style scoped lang="less">
.appModalContent {
  overflow-y: auto;
}
</style>
