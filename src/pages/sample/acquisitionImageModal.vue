<template>
<div id="acquisitionImageModal" class="acquisitionImageModal">
  <a-modal 
    v-model:open="modalOpen" 
    title="采集图片"
    :maskClosable="false"
    :width="1250"
    :footer="false"
    @ok="modalClose"
  >
    <div class="pictureLibrary_index-modal-box">
      <a-spin :spinning="imgData.loading">
        <div class="right-box-title box-title">
          <span>已选中{{ imgData.selectedImgList.length }}张图片</span>
        </div>
        <div class="checkbox-box">
          <a-checkbox v-model:checked="checkedAll" @change="checkedAllFn">选择全部</a-checkbox>
        </div>
        <div class="right-box-content">
          <div class="img-box"
            v-for="item in imgData.data"
            :key="item.id"
          >
            <a-image
              :width="148"
              :height="148"
              :preview="{
                visible: false,
                onVisibleChange: (visible, prevVisible) => onVisibleChange(item),
              }"  
              :src="item.src"
            >
              <template #previewMask>点击{{ item.checked ? '取消':'选中' }}</template>
            </a-image>
            <div class="img-size">
              <span >{{`${item.width} × ${item.height}` }}</span>
            </div>
            <div class="img-box-foot">
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
        <div class="selectedImg-content">
          <div class="selectedImg-content-item" v-for="item in imgData.selectedImgList" :key="item.id">
            <a-image
              :width="70"
              :height="70"
              :preview="false"  
              :src="item.src"
            >
            </a-image>
            <div class="item-icon" @click="onVisibleChange(item)">×</div>
            <!-- <div class="item-icon" @click="delSelectImg(item)">×</div> -->
          </div>
        </div>
        <div class="right-box-foot">
          <a-space>
            <a-button @click="modalClose">取消</a-button>
            <a-button type="primary" @click="confirm">确定</a-button>
          </a-space>
        </div>
      </a-spin>
    </div>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import asyncIcon from '~@/layouts/components/menu/async-icon.vue';
import { productDetail } from './acquisitionEdit/js/api';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { message } from 'ant-design-vue';
defineOptions({ name: "acquisitionImageModal" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'imageListConfirm']);
const props = defineProps({
  modalOpen: Boolean,
  collectProductId: {
    type: String,
    default: ''
  },
})
const modalOpen = ref(false)
const checkedAll = ref(false)
const imgData = reactive({
  data: [],
  selectedImgList: [],
  loading: false
})
// 打开弹窗
watch(() => props.modalOpen, val => {
  // console.log({val});
  nextTick(() => {
    val && modalOpenFn()
  })
});
// 关闭弹窗
watch(() => modalOpen.value, val => {
  if (!val) {
    clearData()
    emit('update:modalOpen', false);
    // console.log(val);
  }
});
// 弹窗打开的回调
async function modalOpenFn(collectProductId) {
  let id = collectProductId || props.collectProductId
  if (!id) {
    message.warning('没有可引用的采集图片')
    
    return
  }

  modalOpen.value = true;
  imgData.loading = true;
  try {
    let res = await productDetail({ id });
    // console.log({ res });
    let { detailImageList, imageList } = res.data;
    let imageListAll = [...imageList, ...detailImageList];
    let data = []
    for (const item of imageListAll) {
      let res = await getImageSize(item)
      let { height, width } = res
      let obj = {
        id: uuidv4(),
        height,
        width,
        path: item,
        src: item,
        url: item,
        checked: false,
      }
      obj.name = obj.id
      data.push(obj)
    }
    imgData.data = data
  } catch (error) {
    console.error(error)
  }
  imgData.loading = false;
}
function getImageSize(src) {
  return new Promise((resolve, reject) => {
    let obj = {}
    let img = new Image()
    img.onload = (e) => {
      obj.width = img.naturalWidth;
      obj.height = img.naturalHeight;
      resolve(obj)
    }
    img.src = src
  })
}
// 关闭弹窗
function modalClose() {
  modalOpen.value = false
}
// 清空数据
function clearData() {
  imgData.data = []
  imgData.selectedImgList = []
  checkedAll.value = false
}
// 全选变化
function checkedAllFn(e) {
  imgData.data.forEach(item => {
    item.checked = checkedAll.value
  })
  imgData.selectedImgList = checkedAll.value ? [...imgData.data] : []
}
// 关于图片选中变化
function onVisibleChange(img, event) {
  if (!event) {
    img.checked = !img.checked;
  }
  if (img.checked) {
    imgData.selectedImgList.push(img)
  } else {
    imgData.selectedImgList = imgData.selectedImgList.filter(i => i.id !== img.id)
  }
  checkedAll.value = imgData.data.every(i => i.checked)
}
// 确认
function confirm() {
  let list = _.cloneDeep(imgData.selectedImgList)
  if (list.length < 1) {
    return message.error('请选择图片！')
  }
  emit('imageListConfirm', list)
  modalClose()
}
defineExpose({
  modalOpenFn
})
</script>
<style lang="less" scoped>
.pictureLibrary_index-modal-box {
  // display: flex;
  // justify-content: space-between;
  width: 1200px;
  .checkbox-box {
    display: flex;
    padding: 10px;
  }
  .right-box-content {
    width: 100%;
    height: 500px;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .img-box {
      width: 150px;
      height: 180px;
      margin: 0 10px 10px 0;
      position: relative;
      border: #000 1px solid;
      .img-size {
        width: 148px;
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
      .img-box-foot {
        width: 148px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 5px;
        padding: 0 5px;
        .img-name {
          width: calc(100% - 25px);
          text-align: left;
          overflow: hidden;
          text-overflow:ellipsis; 
          white-space: nowrap;
        }
      }
    }
  }
  .selectedImg-content {
    width: 100%;
    height: 100px;
    overflow-y: auto;
    background: #eeeeee;
    margin: 30px 0 10px;
    display: flex;
    flex-wrap: wrap;
    .selectedImg-content-item {
      width: 70px;
      height: 70px;
      margin: 10px;
      position: relative;
      .item-icon {
        width: 20px;
        height: 20px;
        background: #000;
        color: #fff;
        font-size: 700;
        font-size: 24px;
        display: flex;
        justify-items: center;
        align-items: center;
        position: absolute;
        top: -8px;
        right: -8px;
        cursor: pointer;
        border-radius: 50%;
        padding: 0 0 3px 2px;
      }
    }
  }
  .right-box-foot {
    display: flex;
    justify-content: flex-end;
  }
  .box-title {
    width: calc(100%- 20px);
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    padding: 0 10px;
    margin: 0 10px 10px;
  }
}
</style>