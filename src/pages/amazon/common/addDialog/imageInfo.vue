<template>
<div id="amazonImageInfo">
  <div class="title">
    <span>产品图片</span>
  </div>
  <div class="content-box">
    <div class="box-btn">
      <a-button 
        style="margin-right: 15px;"
        :disabled="!mainImage.path && imageData.supplementaryImage.length < 1" 
        @click="checkAll()" 
        type="primary"
      >{{isAll ? '全选':'取消全选'}}</a-button>
      <span style="float: right; padding: 3px 0;color: #99999a;margin-right: 10px">
        <a-select 
          style="width: 200px;"
          v-model:value="imageData.watermarkValue" 
          :placeholder="'请选择水印'" 
          allowClear
          @change="selectWaterMark" 
        >
          <a-select-option v-for="item in imageData.watermarList" :key="item.title" :value="item.id">
            <div>
              <span>{{item.title}} </span>
              <a-image v-if="item.type === 1" :src="item.content" style="width: 20px;height: 20px;margin-top: -10px"></a-image>
              <span v-else>{{item.content}}</span>
            </div>
          </a-select-option>
        </a-select>
      </span>
      <span style="float: right; padding: 3px 0;color: #99999a;margin-right: 10px">
        <a-input-number v-model:value="imageData.cropWidth" placeholder="宽"></a-input-number>
        X
        <a-input-number v-model:value="imageData.cropHeight" placeholder="高"></a-input-number>
        <a-button @click="crop">裁剪</a-button>
      </span>
    </div>
    <div class="content-item">
      <div class="content-title">主图</div>
      <div class="content">
        <div class="img-item" v-if="mainImage.path">
          <a-image
            :width="200"
            :src="mainImage.path"
            @load="imageLoad"
          />
          <div class="img-item-size">{{ `${mainImage.width}*${mainImage.height}` }}</div>
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
          v-model:file-list="imageData.fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          :action="imageData.url"
          :headers="imageData.headers"
          :customRequest="customRequest"
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
        <dragFileUpload 
          :max-number="5"
          v-model:image-list="imageData.supplementaryImage"
        ></dragFileUpload>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import dragFileUpload from '../dragFileUpload.vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { uploadImage } from '../../js/api/addDialog.js';
import { watermark, cropImg, watermarkList } from '../../js/api/addDialog.js';
defineOptions({
  name: "amazonImageInfo"
})
const { proxy: _this } = getCurrentInstance()// 当前的vue实例
const imageData = reactive({
  url: import.meta.env.VITE_APP_BASE_API + '/platform-amazon/platform/amazon/file/upload/image',
  headers: { Authorization: `Bearer ${useAuthorization().value}` },
  fileList: [],

  supplementaryImage: [],       // 副图列表
  watermarList: [],             // 水印列表
  cropWidth: 800,
  cropHeight: 800,
  watermarkValue: undefined,
})
const mainImage = reactive({
  name: 'sdfsdsdfhgfsf',
  path: '',
  checked: false,
  width: 0,
  height: 0,
})
// 是否可以全选
const isAll = computed(() => {
  return !mainImage.checked || imageData.supplementaryImage.some(i => !i.checked)
})

onBeforeMount(async () => {
  try {
    let res = await watermarkList()
    imageData.watermarList = res.data
  } catch (error) {
    
  }
})
// 删除图片
function delImage(image) {
  mainImage.path = '',
  mainImage.checked = false
};
// 图片全选
function checkAll() {
  if (isAll.value) {
    mainImage.checked = true
    imageData.supplementaryImage.forEach(item => item.checked = true)
  } else {
    mainImage.checked = false
    imageData.supplementaryImage.forEach(item => item.checked = false)
  }
  // _this.$forceUpdate()
}
// 选择水印
function selectWaterMark(val) {
  let arr = []
  let main = []
  let supplementary = imageData.supplementaryImage.filter(i => i.checked)
  if (mainImage.checked) {
    main.push(mainImage)
  }
  arr.push(main, supplementary)
  arr.forEach(async item => {
    if (item.length < 1) return;
    let imagePathList = item.map(i => i.path)
    try {
      let data = {
        id: val,
        imagePathList
      }
      let res = await watermark(data)
      res.data.forEach(v => {
        let obj = item.find(i => i.path === v.originalFilename)
        obj.path = v.url
        obj.name = v.newFileName
        obj.checked = false
        imageLoad(obj)
      })
    } catch (error) {}
  })
}
// 裁剪
async function crop() {
  let arr = []
  let main = []
  let supplementary = imageData.supplementaryImage.filter(i => i.checked)
  if (mainImage.checked) {
    main.push(mainImage)
  }
  arr.push(main, supplementary)
  arr.forEach(async item => {
    if (item.length < 1) return;
    let imagePathList = item.map(i => i.path)
    try {
      let data = {
        newHeight: imageData.cropHeight,
        newWidth: imageData.cropWidth,
        imagePathList
      }
      let res = await cropImg(data)
      res.data.forEach(v => {
        let obj = item.find(i => i.path === v.originalFilename)
        obj.path = v.url
        obj.name = v.newFileName
        obj.checked = false
        imageLoad(obj)
      })
    } catch (error) {}
  })
}
function handleChange(info) {
  
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
  // return;
  let headers = {
    'Content-Type': 'multipart/form-data',
    'Authorization': 'Bearer ' + useAuthorization().value
  }
  try {
    let res = await usePost('/platform-amazon/platform/amazon/file/upload/image', formData, { headers })
    // console.log({ res });
    mainImage.path = res.url
    mainImage.name = res.newFileName
    imageLoad(mainImage)
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
  };
  img.src = obj.path;
}
</script>
<style lang="less" scoped>
#amazonImageInfo {
  .box-btn {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
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
  }
}
</style>