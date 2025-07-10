<template>
  <a-modal title="批量设置变种属性" :open="setValueVis" wrapClassName="batchSetColorModal" :maskClosable="false"
    @cancel="handleCancel" :width="'40%'" :keyboard="false">
    <div class="my20px">
      <a-input v-model:value="searchValue" class="w-300px" @input="filtered" placeholder="搜索" />
    </div>
    <a-checkbox-group v-model:value="selectedValues" class="colorGroup" :options="filteredOptions" />

    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleConfirm">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup name=''>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

const props = defineProps({
  setValueVis: Boolean,
  setColorOption: Array,
})


const emit = defineEmits(['closeColorModal', 'confirm'])  // 明确定义事件

const searchValue = ref('')
const selectedValues = ref([])

// 使用计算属性实现过滤
const filteredOptions = computed(() => {
  return props.setColorOption.filter(option =>
    option.label.toLowerCase().includes(searchValue.value.toLowerCase())
  )
})

const filtered = () => {
  filteredOptions.value = filteredOptions.value.map(item => item.value)
}

// 确认选择时触发事件
const handleConfirm = () => {
  emit('confirm', selectedValues.value)
  handleCancel();
}

const handleCancel = () => {
  emit('closeColorModal');
  selectedValues.value = []
}
</script>
<style lang="less" scoped>
.batchSetColorModal {
  .ant-modal-content .ant-modal-body {
    .colorGroup {
      max-height: 500px;
      overflow-y: auto;
      display: flex;
      align-items: center;

      :deep(.ant-checkbox-wrapper) {
        display: flex;
        align-items: center;
        height: 20px;
        margin-bottom: 10px;

        span:nth-of-type(2) {
          white-space: nowrap;
          /* 确保文本在一行内显示 */
          overflow: hidden;
          /* 隐藏溢出的内容 */
          text-overflow: ellipsis;
          /* 使用省略号表示文本溢出 */
          width: 200px;
          /* 设置容器宽度 */
        }
      }
    }
  }
}
</style>