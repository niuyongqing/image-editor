<template>
<div id="logModal">
  <appModal 
    v-model:open-value="openValue" 
    width="700px"
    :title="'日志'"
    :footer="null"
  >
    <template #appContent>
      <a-timeline class="mt-5">
        <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
        <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
        <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
        <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
      </a-timeline>
    </template>
  </appModal>
</div>
</template>

<script setup>
import { message } from 'ant-design-vue'

const appModal = defineAsyncComponent(() => import('@/components/common/appModal.vue'));
// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
// 定义emit事件
const emit = defineEmits(['update:visible'])

const openValue = ref(props.visible)

// 监听外部 visible 的变化
watch(() => props.visible, (newVal) => {
  openValue.value = newVal
})

watch(openValue, (newVal) => {
  emit('update:visible', newVal)
})
</script>
<style lang="less" scoped>

</style>