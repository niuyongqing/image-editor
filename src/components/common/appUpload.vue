<template>
<div id="appUpload_index" class="appUpload_index">
  <a-upload
    :file-list="fileList"
    @update:file-list="val => emit('update:fileList', val)"
    class="appUpload-uploader"
    :show-upload-list="showUploadList"
    :action="''"
    :customRequest="customRequest"
    :before-upload="beforeUpload"
    v-bind="$attrs"
  >
    <slot>
      <a-button>
        <async-icon icon="upload-outlined" />
        上传
      </a-button>
    </slot>
  </a-upload>
  <a-modal 
    :footer="false" 
    v-model:open="loading"
    :maskClosable="false"
    :keyboard="false"
    :closable="false"
    centered
  > 
    <div class="loading-box">
      <a-spin tip="Loading..." />
    </div>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import request from '@/utils/request'
import asyncIcon from '~@/layouts/components/menu/async-icon.vue'
defineOptions({ name: "appUpload_index" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['uploadEnd', 'update:fileList'])
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  params: {
    type: Object,
    default: () => ({})
  },
  method: {
    type: String,
    default: 'post'
  },
  name: {
    type: String,
    default: 'file',
  },
  beforeUpload: Function,
  fileList: {
    type: Array,
    default: () => []
  },
  showUploadList: Boolean,
})
const { fileList } = toRefs(props);
const loading = ref(false);

function beforeUpload(file, fileList) {
  return (props.beforeUpload && props.beforeUpload(file, fileList)) || true;
};
// 自定义上传
async function customRequest(options) {
  loading.value = true;
  let { url, params, name, method } = props;
  const data = new FormData();
  data.append(name, options.file);
  for (const key in params) {
    if (params.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];
      data.append(key, element);
    }
  }
  let res = null
  try {
    res = await request({ url, method, data, headers: { 'Content-Type': 'multipart/form-data' } });
  } catch (error) {
    res = error
    console.error(error);
  }
  emit('uploadEnd', res)
  loading.value = false;
}
</script>
<style lang="less" scoped>
.loading-box {
  // width: 400px;
  // height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>