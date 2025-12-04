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
        <async-icon icon="CloudUploadOutlined" />
        {{ title }}
      </a-button>
    </slot>
  </a-upload>
  <app-full-loading :loading="loading" :loading-tip="loadingTip"></app-full-loading>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import request from '@/utils/request'
import asyncIcon from '~@/layouts/components/menu/async-icon.vue'
import appFullLoading from '@/components/common/appFullLoading.vue'
defineOptions({ name: "appUpload_index" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['uploadEnd', 'update:fileList'])
const props = defineProps({
  title: {
    type: String,
    default: '上传'
  },
  loadingTip: {
    type: String,
    default: 'Loading...'
  },
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
// 上传校验
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
  emit('uploadEnd', { res, options });
  loading.value = false;
}
</script>
<style lang="less" scoped></style>