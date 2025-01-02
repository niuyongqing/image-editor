<template>
<div id="amazonImageInfo">
  <div class="title">
    <span>产品图片</span>
  </div>
  <div class="content-box">
    <div class="content-item">
      <div class="content-title">主图</div>
      <div class="content">
        <div class="img-item" v-if="mainImage.path">
          <a-image
            :width="200"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
          <div class="image-item-foot">
            <a-checkbox v-model:checked="mainImage.checked"></a-checkbox>
            <a-tooltip>
              <template #title>{{ mainImage.name }}</template>
              <div class="image-name">{{ mainImage.name }}</div>
            </a-tooltip>
            <DeleteOutlined @click="delImage(item)"/>
          </div>
        </div>
        <a-upload
          v-else
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :customRequest="customRequest"
          :action="'http://10.93.90.146:88/prod-api/platform-tiktok/platform/tiktok/global/file/upload/img'"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <PlusOutlined />
        </a-upload>
      </div>
    </div>
    <div class="content-item">
      <div class="content-title">副图</div>
      <div class="content">
        <dragFileUpload></dragFileUpload>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import dragFileUpload from '../dragFileUpload.vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({
  name: "amazonImageInfo"
})
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});
const mainImage = ref({
  name: 'sdfsdsdfhgfsf',
  path: 'asfrgsdfsfsdfssdgdf',
  checked: false,
})
function delImage(image) {
  mainImage.value.path = ''
};
const fileList = ref([]);
const loading = ref(false);
const imageUrl = ref('');
function handleChange(info) {
  console.log({info});
  
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, base64Url => {
      imageUrl.value = base64Url;
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    console.log('upload error');
  }
};
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    console.log('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    console.log('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
function customRequest(file) {
  console.log(file);
  let data = new FormData()
  data.append('openId', 'ekMlTQAAAAAB7XAM6zof9JRc66GwSVqUEP2Y23bBOIYal0FUXl8xkg')
  data.append('file', file.file)
  usePost('platform-tiktok/platform/tiktok/global/file/upload/img',data).then(res => {
    console.log(res);
    
  }).finally(() => {
    console.log(111);
    mainImage.value = {
      name: 'sdfsdfsf',
      path: 'asfrgsdfsfsdfsdf' + Math.floor(Math.random()*10000),
      checked: false,
    }
  })
}
</script>
<style lang="less" scoped>
#amazonImageInfo {
  .content-item {
    margin-bottom: 22px;
    .content-title {
      width: 100%;
      font-size: 15px;
      font-weight: bold;
      text-align: left;
      margin-bottom: 0.5em;
    }
    .content {
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 0 3px 1px rgba(0, 0, 0, 0.1);
      padding: 10px 15px 5px;
      display: flex;
      .img-item {
        width: 200px;
        height: 240px;
        margin: 0 15px 15px 0;
        .image-item-foot {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: space-between;
          padding: 0 10px;
          align-items: center;
          border: 1px solid #dcdfe6;
          .image-name {
            padding: 0 10px;
            width: calc(100% - 50px);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
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
  }
}
</style>