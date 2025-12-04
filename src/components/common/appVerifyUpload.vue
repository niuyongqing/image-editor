<template>
<!-- 上传组件 -->
<div id="appVerifyUpload_index" class="appVerifyUpload_index">
  <a-upload
    v-model:file-list="fileList"
    class="appVerifyUpload-uploader"
    :show-upload-list="false"
    :action="''"
    multiple
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
  <app-modal 
    :open-value="openValue" 
    :width="'800px'"
    @ok="uploadFile"
    @cancel="openValue = false"
    @close="fileList = []"
    :closable="false"
  >
    <template #appContent>
      <div class="file-box">
        <div v-for="item in fileList" :key="item.uid" class="file-info">
          <a-alert
            :message="`已选择文件: ${item.name}`"
            type="info"
            show-icon
            class="file-info-alert"
          />
          <async-icon 
            size="16px"  
            icon="DeleteOutlined"
            class="file-info-icon"
            @click="removeFile(item)"
          ></async-icon>
        </div>
      </div>
    </template>
  </app-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import request from '@/utils/request'
import asyncIcon from '~@/layouts/components/menu/async-icon.vue'
import appFullLoading from '@/components/common/appFullLoading.vue'
import appModal from '@/components/common/appModal.vue'
import { message } from 'ant-design-vue';
defineOptions({ name: "appVerifyUpload_index" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits([
  'uploadEnd',        // 上传完成事件  success: 是否上传成功 res：响应结果 file：上传的文件数据
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
})
// const { fileList } = toRefs(props);
const fileList = ref([]);
const loading = ref(false);
const openValue = ref(false);
// 上传校验
function beforeUpload(file, fileList) {
  openValue.value = true;
  file._isVerify = false;
  if (props.beforeUpload && props.beforeUpload(file, fileList) || !props.beforeUpload) {
    file._isVerify = true;
  }
  return false;
};
// 删除文件
function removeFile(file) {
  fileList.value = fileList.value.filter(i => i.uid !== file.uid)
  if (fileList.value.length === 0) {
    openValue.value = false;
  }
}
// 开始上传
async function uploadFile() {
  let list = [];
  loading.value = true;
  fileList.value.forEach(item => {
    if (item._isVerify) {
      list.push(customRequest(item.originFileObj))
    } else {
      message.error(`${item.name}不符合上传条件！`)
    }
  })
  // 开始上传
  let res = await Promise.all(list)
  emit('uploadEnd', res);     // success: 是否上传成功 res：响应结果 file：上传的文件数据
  loading.value = false;
  openValue.value = false;
  // console.log({res});
}
// 自定义上传
async function customRequest(file) {
  let { url, params, name, method } = props;
  const data = new FormData();
  data.append(name, file);
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
    message.error(`${file.name} 上传失败！`)
    console.error(error);
  } 
  return { res, file, success } // success: 是否上传成功 res：响应结果 file：上传的文件数据
}
</script>
<style lang="less" scoped>
.file-box {
  width: 100%;
  padding: 16px;
  .file-info {
    position: relative;
    display: flex;
    .file-info-alert {
      margin-top: 12px;
      width: 100%;
    }
    .file-info-icon {
      // float: left;
      color: #ff4d4f;
      margin-left: -32px;
      margin-top: 8px;
      z-index: 1;
      cursor: pointer;
    }
  }
}
</style>