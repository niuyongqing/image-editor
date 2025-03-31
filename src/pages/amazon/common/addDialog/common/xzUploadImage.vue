<template>
<div id="xzUploadImage">
  <a-upload
    v-model:file-list="fileData.list"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :action="props.options.url"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <PlusOutlined />
  </a-upload>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue';
defineOptions({ name: "xzUploadImage" })
const { proxy: _this } = getCurrentInstance()
const props = defineProps({
  fileList: {
    type: Array,
    default: () => []
  },
  
  options: {
    type: Object,
    default: () => {
      return {
        url: '',
        max: 8,
        type: '',
      }
    }
  }
})
const fileData = reactive({
  list: [],
})
function customRequest() {

}
function beforeUpload() {

}
function handleChange() {

}
</script>
<style lang="less" scoped>
#xzUploadImage {
  ::v-deep(.ant-upload-wrapper) {
    width: 200px;
    height: 200px;
    margin: 0;
    margin: 0 15px 15px 0;
    .ant-upload {
      width: 200px;
      height: 200px;
      margin: 0;
    }
  }
  ::v-deep(.ant-form-item-row .ant-form-item-label) {
    width: 200px;
    height: auto;
    word-break: break-all;
    word-wrap: break-word;
    text-align: right;
    line-height: unset;
    padding-bottom: 0;
  }
}
</style>