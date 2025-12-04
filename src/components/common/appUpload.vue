<template>
<!-- 上传组件 -->
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
const emit = defineEmits([
  'uploadEnd',        // 上传完成事件
  'update:fileList'
]);
const props = defineProps({
  title: {                  // 按钮字段
    type: String,
    default: '上传'
  },
  loadingTip: {             // loading字段
    type: String,
    default: 'Loading...'
  },
  url: {                    // 上传接口url
    type: String,
    default: '',
  },
  params: {                 // 上传的携带的额外参数
    type: Object,
    default: () => ({})
  },
  method: {                 // 上传接口的类型，默认post
    type: String,
    default: 'post'
  },
  name: {                   // 文件流参数字段，同a-upload原生
    type: String,
    default: 'file',
  },
  beforeUpload: Function,   // 上传前校验函数
  fileList: {               // 上传文件列表，v-model:fileList
    type: Array,
    default: () => []
  },
  showUploadList: Boolean,  // 是否显示上传文件列表，默认不展示，想要显示的时候必传fileList
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
  let res = null;
  let success = false;
  try {
    res = await request({ url, method, data, headers: { 'Content-Type': 'multipart/form-data' } });
    success = true;
  } catch (error) {
    res = error
    console.error(error);
  }
  emit('uploadEnd', { res, options, success });   // success: 是否上传成功 res：响应结果 options：上传组件返回的数据
  loading.value = false;
}
</script>
<style lang="less" scoped></style>