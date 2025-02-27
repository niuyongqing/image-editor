<template>
<div id="mainImage" class="mainImage">
  <div class="img-item" v-if="mainImage.path">
    <a-image
      :width="200"
      :src="mainImage.path"
    />
    <div class="img-item-size">{{ `${mainImage.width}*${mainImage.height}` }}</div>
    <div class="image-item-foot">
      <a-checkbox v-model:checked="mainImage.checked"></a-checkbox>
      <a-tooltip>
        <template #title>{{ mainImage.name }}</template>
        <div class="image-name">{{ mainImage.name }}</div>
      </a-tooltip>
      <DeleteOutlined style="color: red;" @click="delImage(item)"/>
    </div>
  </div>
  <a-upload
    v-else
    v-model:file-list="fileList"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :action="''"
    :customRequest="customRequest"
    :before-upload="beforeUpload"
  >
    <PlusOutlined />
  </a-upload>
</div>
</template>

<script setup>
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { uploadImage } from '~@/pages/amazon/js/api/addDialog';
defineOptions({ name: "mainImage" })
const { proxy: _this } = getCurrentInstance();
const props = defineProps({
  mainImageInfo: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['update:mainImageInfo'])
const fileList = ref([])
const mainImage = reactive({
  name: '',
  path: '',
  uid: '',
  checked: false,
  width: 0,
  height: 0,
})
watch(() => props.mainImageInfo, (val) => {
  Object.keys(mainImage).forEach(key => {
    mainImage[key] = val[key] || mainImage[key]
  })
}, {
  deep: true,
})
// 删除图片
function delImage(image) {
  mainImage.path = '';
  mainImage.checked = false;
  mainImage.uid = ''
  mainImage.name = ''
  mainImage.width = 0
  mainImage.height = 0
  emit('update:mainImageInfo', mainImage)
};
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    console.log('You can only upload JPG file!');
    return false
  }
  return true
};
// 自定义上传
async function customRequest({ file }) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    let res = await uploadImage(formData)
    // console.log({ res });
    mainImage.path = res.url
    mainImage.uid = file.uid
    mainImage.name = res.newFileName
    mainImage.checked = false;
    imageLoad(mainImage)
    emit('update:mainImageInfo', mainImage)
  } catch (error) {
    console.log({error});
  }
}
// 图片加载完成
function imageLoad(obj) {
  // console.log({obj});
  const img = new Image();  // 创建一个新的 Image 对象
  img.onload = () => {
    // 获取图片的宽高
    obj.width = img.naturalWidth;
    obj.height = img.naturalHeight;
    // emit('update:mainImageInfo', {...obj})
  };
  img.src = obj.path;
}
</script>
<style lang="less" scoped>
.mainImage {
  .img-item {
    width: 200px;
    height: 240px;
    margin: 0 15px 15px 0;
    position: relative;
    .img-item-size {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 40px;
      background: #000000;
      opacity: 0.2;
      color: #fff;
      font-size: 18px;
      text-align: center;
    }
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
</style>