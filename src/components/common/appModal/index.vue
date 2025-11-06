<template>
  <a-modal
    v-model:open="internalOpen"
    :title="title"
    :width="width"
    :maskClosable="false"
    :keyboard="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- 默认插槽，用于放置弹窗的主要内容 -->
     <div class="appModalContent" :style="{ height: contentHeight }">
       <slot name="appContent"></slot>
     </div>

    <template #footer>
      <a-space>
        <slot name="appFooter"></slot>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup>
import { min } from 'lodash'
import { ref, watch } from 'vue'

// 定义组件的props
const props = defineProps({
  // 控制弹窗显示 (v-model支持)
  modelValue: {
    type: Boolean,
    default: false
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 宽度
  width: {
    type: [String, Number],
    default: '70%'
  },
  // 自定义footer插槽是否显示
  contentHeight: {
    type: [String, Number],
    default: '200px'
  },
})

// 定义emit事件
const emit = defineEmits(['update:modelValue', 'ok', 'cancel', 'open', 'close'])

// 内部状态管理
const internalOpen = ref(props.modelValue)

// 监听外部modelValue变化
watch(() => props.modelValue, (newVal) => {
  internalOpen.value = newVal
  if (newVal) {
    emit('open')
  } else {
    emit('close')
  }
})

// 监听内部open变化，同步到外部
watch(internalOpen, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 确定按钮事件
const handleOk = (e) => {
  emit('ok', e)
  // 需要手动关闭弹窗，因为Ant Design Modal不会自动关闭
  internalOpen.value = false
}

// 取消按钮事件
const handleCancel = (e) => {
  emit('cancel', e)
  // 需要手动关闭弹窗
  internalOpen.value = false
}

// 暴露方法给父组件
const openModal = () => {
  internalOpen.value = true
  emit('open')
}

const closeModal = () => {
  internalOpen.value = false
  emit('close')
}

// 定义暴露的方法
defineExpose({
  openModal,
  closeModal,
  handleOk,
  handleCancel
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>