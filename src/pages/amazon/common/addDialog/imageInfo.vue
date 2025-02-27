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
          :disabled="isDisabled"
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
        <a-input-number :disabled="isDisabled" v-model:value="imageData.cropWidth" placeholder="宽"></a-input-number>
        X
        <a-input-number :disabled="isDisabled" v-model:value="imageData.cropHeight" placeholder="高"></a-input-number>
        <a-button :disabled="isDisabled" @click="crop">裁剪</a-button>
      </span>
    </div>
    <div class="content-item">
      <div class="content-title">主图</div>
      <div class="content">
        <mainImageVue v-model:mainImageInfo="mainImage"></mainImageVue>
      </div>
    </div>
    <div class="content-item">
      <div class="content-title">副图</div>
      <div class="content">
        <supplementaryImage 
          :max-number="5"
          v-model:image-list="imageData.supplementaryImage"
        ></supplementaryImage>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import mainImageVue from './common/mainImage.vue';
import supplementaryImage from './common/supplementaryImage.vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { uploadImage, watermark, cropImg, watermarkList } from '../../js/api/addDialog.js';
defineOptions({
  name: "amazonImageInfo"
})
const { proxy: _this } = getCurrentInstance();// 当前的vue实例
const props = defineProps({
  imageInfo: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['update:imageInfo'])
const imageData = reactive({
  fileList: [],

  supplementaryImage: [],       // 副图列表
  watermarList: [],             // 水印列表
  cropWidth: 800,
  cropHeight: 800,
  watermarkValue: undefined,
})
const mainImage = reactive({
  name: '',
  path: '',
  uid: '',
  checked: false,
  width: 0,
  height: 0,
})
// 是否可以全选
const isAll = computed(() => {
  return !mainImage.checked || imageData.supplementaryImage.some(i => !i.checked)
})
// 是否禁用
const isDisabled = computed(() => {
  return !mainImage.checked && imageData.supplementaryImage.every(i => !i.checked)
})
watch([() => mainImage, () => imageData.supplementaryImage], ([main, supplementary]) => {
  // console.log({ main, supplementary });
  let obj = {
    mainImage: main,
    supplementaryImage: supplementary,
  }
  emit('update:imageInfo', obj)
}, {
  deep: true,
})

onBeforeMount(async () => {
  try {
    let res = await watermarkList()
    imageData.watermarList = res.data
  } catch (error) {}
})
// 图片全选
function checkAll() {
  if (isAll.value) {
    mainImage.path && (mainImage.checked = true)
    imageData.supplementaryImage.forEach(item => item.checked = true)
  } else {
    mainImage.checked = false
    imageData.supplementaryImage.forEach(item => item.checked = false)
  }
  // _this.$forceUpdate()
}
// 选择水印
function selectWaterMark(val) {
  if (val === undefined) return;
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