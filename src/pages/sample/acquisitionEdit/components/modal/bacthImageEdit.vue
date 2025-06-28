<template>
<div id="bacthImageEdit" class="bacthImageEdit">
  <a-modal 
    v-model:open="modalOpen" 
    :title="'批量修改图片尺寸'"
    :maskClosable="false" 
    :width="1200"
  >
    <div class="bacthImageEdit-modal-box">
      <div class="sizeForm-box">
        <a-form :model="formData" layout="inline" ref="sizeFormRef">
          <a-form-item
            label="宽度"
            name="width"
            :rules="[{ required: true, message: '请输入图片宽度!' }]"
          >
            <a-input-number v-model:value="formData.width" :min="1" />
          </a-form-item>
          <a-form-item
            label="高度"
            name="height"
            :rules="[{ required: true, message: '请输入图片高度!' }]"
          >
            <a-input-number v-model:value="formData.height" :min="1" />
          </a-form-item>
        </a-form>
        <a-checkbox v-model:checked="formData.saveStatus">记住本次设置</a-checkbox>
      </div>
      <div class="checkbox-box">
        <a-checkbox v-model:checked="checkedAll" @change="checkedAllFn">选择全部</a-checkbox>
      </div>
      <div class="image-box">
        <div class="image-item"
          v-for="item in formData.imgData"
          :key="item.id"
        >
          <a-image
            :width="150"
            :height="150"
            :preview="{
              visible: false,
              onVisibleChange: (visible, prevVisible) => onVisibleChange(item),
            }"  
            :src="item.src"
          >
            <template #previewMask>点击{{ item.checked ? '取消':'选中' }}</template>
          </a-image>
          <div class="img-size">
            <span>{{ `${item.width} × ${item.height}` }}</span>
            <!-- <span>{{ (item.size/1024).toFixed() }}KB</span> -->
          </div>
          <div class="image-item-foot">
            <a-checkbox v-model:checked="item.checked" @change="event => onVisibleChange(item, event)"></a-checkbox>
            <div class="img-name">
              <a-tooltip>
                <template #title>{{ item.name }}</template>
                {{ item.name }}
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button 
        key="submit" 
        type="primary" 
        @click="modalOk" 
        :loading="loading"
      >确定</a-button>
      <a-button key="submit" @click="modalCloseFn">关闭</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect, watch } from 'vue'
import { imageUrlUpload } from '../../js/api';
import { scaleApi, watermarkApi } from '~@/api/common/water-mark';
defineOptions({ name: "bacthImageEdit" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'bacthImageEditSize'])
const props = defineProps({
  modalOpen: Boolean,
  iamgeList: {
    type: Array,
    default: () => [],
  }
})
const modalOpen = ref(false)
const loading = ref(false)
const formData = reactive({
  width: undefined,
  height: undefined,

  saveStatus: false,

  imgData: [],
  selectedImgList: []
})
watch(() => props.modalOpen, (val, oldVal) => {
  if (val) {
    modalOpen.value = val
    modalOpenFn()
  }
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})
function modalOpenFn() {
  formData.imgData = props.iamgeList.map(item => {
    let obj = {
      ...item,
      checked: false
    }
    return obj;
  })
  // 回显上次设置
  let bacthImageSizeStatus = localStorage.getItem('bacthImageSizeStatus')
  if (!!bacthImageSizeStatus) {
    let { height, width } = JSON.parse(bacthImageSizeStatus);
    formData.width = width
    formData.height = height
    formData.saveStatus = !!bacthImageSizeStatus
  }
  checkedAll.value = true
  checkedAllFn()
}
const checkedAll = ref(true)
// 全选变化
function checkedAllFn(e) {
  formData.imgData.forEach(item => {
    item.checked = checkedAll.value
  })
  formData.selectedImgList = checkedAll.value ? [...formData.imgData] : []
}
// 关于图片选中变化
function onVisibleChange(img, event) {
  if (!event) {
    img.checked = !img.checked;
  }
  if (img.checked) {
    formData.selectedImgList.push(img)
  } else {
    formData.selectedImgList = formData.selectedImgList.filter(i => i.id !== img.id)
  }
  checkedAll.value = formData.imgData.every(i => i.checked)
}

async function modalOk() {
  try {
    await _this.$refs.sizeFormRef.validateFields()
    loading.value = true
    // 筛选出网图
    let urlImageList = formData.selectedImgList.filter(item => item.src.includes('http'))
    // 网图先走一遍上传再去改尺寸
    for (let index = 0; index < urlImageList.length; index++) {
      const item = urlImageList[index];
      try {
        const url = item.url;
        let res = await imageUrlUpload({ url })
        formData.selectedImgList.forEach(i => {
          if (i.url === url) {
            i.url = res.data.url
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    let imagePathList = formData.selectedImgList.map(i => i.url)
    let params = {
      newWidth: formData.width,
      newHeight: formData.height,
      imagePathList,
      isRatio: false
    }
    let newImage = await scaleApi(params)
    formData.selectedImgList.forEach(item => {
      let val = (newImage?.data || []).find(i => i.originalFilename === item.url)
      if (val) {
        item.url = val.url.replace('/prod-api', ''),
        item.src = val.url
      }
    })
    loading.value = false
    emit('bacthImageEditSize', formData.selectedImgList)
    modalCloseFn()
  } catch (error) {
    console.error(error)
  }
}
function modalCloseFn() {
  let { height, width, saveStatus } = formData
  if (height && width && saveStatus) {
    // 保持本次宽高设置
    let bacthImageSizeStatus = { width, height }
    localStorage.setItem('bacthImageSizeStatus', JSON.stringify(bacthImageSizeStatus))
  } else if (!saveStatus) {
    localStorage.removeItem('bacthImageSizeStatus')
  } 
  formData.imgData = []
  formData.selectedImgList = []
  formData.height = undefined
  formData.width = undefined
  formData.saveStatus = false
  modalOpen.value = false
}
</script>
<style lang="less" scoped>
.bacthImageEdit-modal-box {
  .sizeForm-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .checkbox-box {
    display: flex;
    padding: 10px;
  }
  .image-box {
    width: 100%;
    max-height: 500px;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .image-item {
      width: 150px;
      height: 180px;
      margin: 0 10px 10px 0;
      position: relative;
      .img-size {
        width: 100%;
        height: 20px;
        position: absolute;
        top: 130px;
        background-color: rgba(0, 0, 0, .2);
        opacity: 0.8;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 6px;
      }
      .image-item-foot {
        width: 100%;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .img-name {
          width: calc(100% - 20px);
          text-align: left;
          overflow: hidden;
          text-overflow:ellipsis; 
          white-space: nowrap;
        }
      }
    }
  }
}
</style>