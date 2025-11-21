<!-- components/ImportModal.vue -->
<template>
  <appModal v-model:openValue="internalVisible" width="25%" title="导入新增" @cancel="handleCancel" @ok="handleOk">
    <template #appContent>
      <a-steps direction="vertical" :current="current" class="custom-steps-no-hover">
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
              <a-upload :action="uploadUrl" :headers="headers" :showUploadList="false" 
                v-model:file-list="fileList" accept=".xlsx,.xls" 
                :maxCount="1" @change="handleFileChange">
                <a-button type="primary">
                  <upload-outlined />上传
                </a-button>
              </a-upload>
            </div>
            <div class="mt-2.5">
              <div class="item text-[#1f2329]" v-for="(item, index) in fileList" :key="index">
                {{ item.name }}
              </div>
            </div>
          </template>
        </a-step>
      </a-steps>
    </template>
    <template #appFooter>
      <a-button @click="handleCancel">取消</a-button>
    </template>
  </appModal>
</template>

<script setup>
import { ref } from 'vue'
import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useAuthorization } from "~/composables/authorization.js";
import { downloadTemplate } from "../js/api.js"
import download from '~@/api/common/download';

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义emit事件
const emit = defineEmits(['update:visible'])

//定义变量
const headers = { Authorization: useAuthorization().value }
const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/report-aliexpress/aliexpress/shop/configItem/import";
const current = ref(0)
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
  current.value = 0
  emit('update:visible', false)
}

// 处理确定
const handleOk = () => {
  if (fileList.value.length === 0) {
    message.warning('请先上传文件')
    return
  }
  console.log(fileList.value)
  current.value += 1
  handleCancel()
}

// 导出模板
const handleExportTemplate = async () => {
  try {
    let res = await downloadTemplate()
    download.name(res.data)
    message.success('模板下载成功')
    current.value += 1
  } catch (error) {
    console.error(error);
  }
}

// 文件上传前处理
const handleFileChange = (info) => {
  if (info.file.status === 'done') {
    const { data } = info.file.response;
    if(data.errorList.length > 0) {
      message.error(data.message)
    }else {
      message.success(data.message)
    }
  }
}
</script>

<style scoped>
.custom-steps-no-hover {
  :deep(.ant-steps-item) {
    cursor: default;
  }
}
</style>