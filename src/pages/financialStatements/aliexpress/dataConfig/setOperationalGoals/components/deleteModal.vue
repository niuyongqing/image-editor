<template>
<div id="deleteModal">
  <appModal 
    v-model:open-value="openValue" 
    width="500px"
    :title="'删除'"
  >
    <template #appContent>
      <div class="flex flex-col items-center">
        <p class="text-[#ff4d4f] text-5">确定要删除选中的数据吗？</p>
        <p class="flex items-center"><InfoCircleOutlined class="text-[#ff4d4f] text-5 mr-5" />数据删除后无法恢复，请谨慎操作！</p>
      </div>
    </template>
    <template #appFooter>
      <a-button @click="handleCustomCancel">取消</a-button>
      <a-button type="primary" @click="handleCustomOk">确定</a-button>
    </template>
  </appModal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'

defineOptions({ name: "setOperationalGoals_deleteModal" })

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义emit事件
const emit = defineEmits(['update:visible', 'deleteCancel', 'deleteOk'])

//定义变量
const openValue = ref(props.visible)

// 监听外部 visible 的变化
watch(() => props.visible, (newVal) => {
  openValue.value = newVal
})

// 定义方法
const handleCustomCancel = () => {
  emit('update:visible', false)
  emit('deleteCancel')
}

const handleCustomOk = () => {
  emit('update:visible', false)
  emit('deleteOk')
}
</script>
<style lang="less" scoped>

</style>