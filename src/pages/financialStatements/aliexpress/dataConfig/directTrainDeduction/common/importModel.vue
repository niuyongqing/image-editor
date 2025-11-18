<!-- components/ImportModal.vue -->
<template>
  <appModal v-model:openValue="internalVisible" width="40%" title="导入新增" @cancel="handleCancel" @ok="handleOk">
    <template #appContent>
      <a-steps direction="vertical" :current="null" class="custom-steps-no-hover">
        <a-step title="导出">
          <template #description>
            <div>
              <p>点击导出模板按钮下载导出模板</p>
              <a-button type="primary" @click="handleExportTemplate"><VerticalAlignBottomOutlined/>导出模板</a-button>
            </div>
          </template>
        </a-step>
        <a-step title="导入">
          <template #description>
            <div>
              <p>点击上传按钮导入Excel文件</p>
              <a-upload :action="uploadUrl" :headers="headers" v-model:file-list="fileList" :before-upload="beforeUpload" accept=".xlsx,.xls" multiple>
                <a-button type="primary">
                  <upload-outlined />上传
                </a-button>
              </a-upload>
            </div>
          </template>
        </a-step>
      </a-steps>
    </template>
  </appModal>
</template>

<script setup>
import { ref } from 'vue'
import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useAuthorization } from "~/composables/authorization.js";

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义emit事件
const emit = defineEmits(['update:visible', 'cancel', 'importSuccess'])

const headers = { Authorization: useAuthorization().value }
const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/common/upload";

// 本地状态
const fileList = ref([])

const internalVisible = ref(props.visible)

// 监听外部 visible 的变化
watch(() => props.visible, (newVal) => {
  internalVisible.value = newVal
})

watch(internalVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 处理取消
const handleCancel = () => {
  fileList.value = []
  emit('update:visible', false)
  emit('cancel')
}

// 处理确定
const handleOk = () => {
  if (fileList.value.length === 0) {
    message.warning('请先上传文件')
    return
  }
  emit('importSuccess', fileList.value)
  handleCancel()
}

// 导出模板
const handleExportTemplate = () => {
  // 导出模板逻辑
  message.success('模板导出成功')
}

// 文件上传前处理
const beforeUpload = (file) => {

}
</script>

<style scoped>
.custom-steps-no-hover {
  :deep(.ant-steps-item) {
    cursor: default;
  }
}
</style>