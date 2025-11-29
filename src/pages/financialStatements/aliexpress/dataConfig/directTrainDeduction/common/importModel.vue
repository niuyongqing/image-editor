<!-- components/ImportModal.vue -->
<template>
  <appModal v-model:openValue="internalVisible" width="40%" title="导入新增">
    <template #appContent>
      <a-steps direction="vertical" :current="current" class="custom-steps-no-hover">
        <a-step title="导出">
          <template #description>
            <div>
              <p>点击导出模板按钮下载导出模板</p>
              <a-button type="primary" @click="handleExportTemplate" :loading="exportTemplateLoading">
                <VerticalAlignBottomOutlined/>
                导出模板
              </a-button>
            </div>
          </template>
        </a-step>
        <a-step title="导入">
          <template #description>
            <div>
              <p>点击上传按钮选择Excel文件</p>
              <a-upload
                  :headers="headers"
                  :file-list="fileList"
                  :before-upload="beforeUpload"
                  accept=".xlsx,.xls"
                  @change="handleUploadChange"
                  @remove="handleRemoveFile"
                  :show-upload-list="true"
                  :multiple="false"
              >
                <a-button type="primary">
                  <upload-outlined/>
                  选择文件
                </a-button>
              </a-upload>

              <!-- 显示选中的文件信息 -->
              <div v-if="fileList.length > 0" class="file-info">
                <a-alert
                    :message="`已选择文件: ${fileList[0].name}`"
                    type="info"
                    show-icon
                    style="margin-top: 12px"
                />
              </div>
            </div>
          </template>
        </a-step>
      </a-steps>
    </template>
    <template #appFooter>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">确定</a-button>
      </a-space>
    </template>
  </appModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { exportTemplate } from "~/pages/financialStatements/aliexpress/dataConfig/directTrainDeduction/js/api.js";
import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import axios from "axios";
import download from "~/api/common/download.js";

// 定义props
const props = defineProps ( {
  visible: {
    type: Boolean,
    default: false
  }
} )

// 定义emit事件
const emit = defineEmits ( [ 'update:visible','update:listData'] )

// 定义变量
const headers = { Authorization: useAuthorization().value }
const exportTemplateLoading = ref(false);
const loading = ref(false);
const current = ref ( 0 )
const fileList = ref ( [] )
const internalVisible = ref ( props.visible )
const selectedFile = ref ( null )

// 监听外部 visible 的变化
watch ( () => props.visible, ( newVal ) => {
  internalVisible.value = newVal
} )

watch ( internalVisible, ( newVal ) => {
  emit ( 'update:visible', newVal )
} )

// 处理取消
const handleCancel = () => {
  loading.value = false
  fileList.value = []
  selectedFile.value = null
  current.value = 0
  emit ( 'update:visible', false )
  emit( 'update:listData' )
}

// 文件上传前处理
const beforeUpload = ( file ) => {
  // 保存原始文件对象
  selectedFile.value = file;

  // 更新文件列表显示
  fileList.value = [ {
    uid: file.uid,
    name: file.name,
    status: 'done',
    originFileObj: file
  } ];

  return false;
}

// 文件删除处理
const handleRemoveFile = ( file ) => {
  fileList.value = fileList.value.filter ( item => item.uid !== file.uid )
  selectedFile.value = null
  message.success ( '文件已移除' )
}

// 上传变化处理
const handleUploadChange = ( info ) => {
  if ( info.file.status === 'removed' ) {
    handleRemoveFile ( info.file )
  }
}

// 实际执行上传的函数
const executeUpload = async ( file ) => {
  try {
    const formData = new FormData ();
    formData.append ( 'file', file );
    return await axios.post ( '/prod-api/report-aliexpress/aliexpress/DirectExpressFee/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': useAuthorization ().value
      }
    } );
  } catch ( error ) {
    console.error ( '上传失败:', error );
    throw error;
  }
}

// 处理确定 - 点击确认时才上传
const handleOk = async () => {
  if ( !selectedFile.value ) {
    message.warning ( '请先选择文件' );
    return;
  }
  try {
    loading.value = true
    const result = await executeUpload ( selectedFile.value );
    if ( result.data.code === 200 ) {
      message.success(result.data.msg)
      handleCancel ();
    }
    else {
      message.error(result.data.msg)
    }
  } catch ( error ) {
    loading.value = false
    console.error ( '导入过程出错:', error );
  } finally {
    loading.value = false
  }
}

// 导出模板
const handleExportTemplate = () => {
  exportTemplateLoading.value = true
  exportTemplate().then(res =>{
    download.name(res.data);
    message.success ( '模板导出成功' )
    current.value = 1
  }).finally(() =>{
    exportTemplateLoading.value = false
  })
}
</script>

<style scoped>
.custom-steps-no-hover {
  :deep(.ant-steps-item) {
    cursor: default;
  }
}

.file-info {
  margin-top: 12px;
}

/* 确保删除按钮可点击 */
:deep(.ant-upload-list-item-actions) {
  opacity: 1 !important;
  pointer-events: all !important;
}

:deep(.ant-upload-list-item-card-actions) {
  opacity: 1 !important;
  pointer-events: all !important;
}
</style>