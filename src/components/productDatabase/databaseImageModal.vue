<template>
<div id="databaseImageModal_index" class="databaseImageModal_index">
  
  <a-modal 
    v-model:open="modalOpen" 
    title="引用当前数据库产品图片"
    :maskClosable="false"
    :width="1250"
    :footer="false"
    style="top: 30px;"
  >
    <div class="databaseImageModal-modal-box">
      <a-spin :spinning="imgData.loading">
        <div class="box-title box-title">
          <span>已选中{{ imgData.selectedImgList.length }}张图片</span>
        </div>
        <div class="checkbox-box">
          <a-checkbox v-model:checked="checkedAll" @change="checkedAllFn">选择全部</a-checkbox>
        </div>
        <div class="box-content">
          <a-card class="box-card" v-for="card in imgData.cardList" :key="card.code">
            <template #title>
              <span>{{ card.title }}</span>
            </template>
            <template #extra v-if="(card.data.length > 0)">
              <a-button 
                @click="selectCard(card)" 
                type="primary"
              >
                {{ card.isAll ? '取消全选' : `全选${card.title}` }}
              </a-button>
            </template>
            <a-empty :description="`没有${card.title}`" v-if="!(card.data.length > 0)"/>
            <a-row v-else>
              <a-col :span="24" style="display: flex; justify-content: flex-start; align-items: center; flex-wrap: wrap;">
                <div class="img-box"
                  v-for="item in card.data"
                  :key="item.id"
                >
                  <a-image
                    :width="148"
                    :height="148"
                    class="object-contain"
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
              </a-col>
            </a-row>
          </a-card>
        </div>
        <div class="selectedImg-content">
          <div class="selectedImg-content-item" v-for="item in imgData.selectedImgList" :key="item.id">
            <a-image
              :width="70"
              :height="70"
              class="object-contain"
              :preview="false"  
              :src="item.src"
            >
            </a-image>
            <div class="item-icon" @click="onVisibleChange(item)">×</div>
          </div>
        </div>
        <div class="box-foot">
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
import { storeDetail } from '~@/api/common/selectProduct';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { message } from 'ant-design-vue';
defineOptions({ name: "databaseImageModal_index" })
// const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'imageListConfirm']);
const props = defineProps({
  modalOpen: Boolean,
  commodityId: {
    type: String,
    default: ''
  },
})
const modalOpen = ref(false)
const checkedAll = ref(false)

const { state: imgData, reset } = useResetReactive({
  data: [],
  selectedImgList: [],
  loading: false,
  cardList: [
    {
      title: 'SKU图',
      code: 'artSkuImage',
      isAll: false,
      data: [],
    },
    {
      title: '主图',
      code: 'artMainImage',
      isAll: false,
      data: [],
    },
    {
      title: '副图',
      code: 'artAssistantImage',
      isAll: false,
      data: [],
    },
    {
      title: 'Amazon图',
      code: 'artAmazonImage',
      isAll: false,
      data: [],
    },
    {
      title: 'Shein图',
      code: 'artNewImage',
      isAll: false,
      data: [],
    }
  ]
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
    reset()
    emit('update:modalOpen', false);
    // console.log(val);
  }
});
// 弹窗打开的回调
async function modalOpenFn(commodityId) {
  let id = commodityId || props.commodityId
  // id = '931258'
  // id = '931709'
  if (!id) {
    message.warning('没有可引用的图片')
    emit('update:modalOpen', false);
    return;
  }

  modalOpen.value = true;
  checkedAll.value = false;
  imgData.loading = true;
  try {
    let res = await storeDetail({ id });
    // console.log({ res });
    const data = res.data || {};
    let {
      artAmazonImage,
      artAmazonDetailImage,
      artAmazonSkuImage,
      artSkuWhiteImage,
      artSkuSceneImage,
      artMainImage,
      artAssistantImage,
      artSkuImage,
      artNewImage
    } = data;

    artAmazonImage = [
      ...JSON.parse((artAmazonImage || '[]')),
      ...JSON.parse((artAmazonDetailImage || '[]')),
      ...JSON.parse((artAmazonSkuImage || '[]')),
      ...JSON.parse((artSkuWhiteImage || '[]')),
      ...JSON.parse((artSkuSceneImage || '[]')),
    ]
    artAmazonImage.forEach(item => {
      item.type = 'artAmazonImage'
    })
    artMainImage = imageStringToObject(artMainImage, 'artMainImage')
    artAssistantImage = imageStringToObject(artAssistantImage, 'artAssistantImage')
    artSkuImage = imageStringToObject(artSkuImage, 'artSkuImage')
    artNewImage = imageStringToObject(artNewImage, 'artNewImage')

    let imageListAll = [
      ...artAmazonImage,
      ...artMainImage,
      ...artAssistantImage,
      ...artSkuImage,
      ...artNewImage,
    ];
    let _imgData = []
    for (const item of imageListAll) {
      let { height, width } = item 
      if (!height) {
        let res = await getImageSize(item.url)
        height = res.height
        width = res.width
      }
      let obj = {
        id: uuidv4(),
        height,
        width,
        type: item.type,
        name: item.name,
        path: item.url,
        src: item.url,
        url: item.url.replace('/prod-api', ''),
        checked: false,
      }
      _imgData.push(obj)
    }
    imgData.data = _imgData
    imgData.cardList.forEach(item => {
      item.data = imgData.data.filter(i => i.type === item.code)
    })
  } catch (error) {
    console.error(error)
  }
  imgData.loading = false;
}
function imageStringToObject(arr, type) {
  let list = JSON.parse((arr || '[]'));
  list.forEach(item => item.type = type);
  return list;
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
// 全选变化
function checkedAllFn(e) {
  imgData.data.forEach(item => {
    item.checked = checkedAll.value
  })
  imgData.selectedImgList = checkedAll.value ? [...imgData.data] : []
  imgData.cardList.forEach(i => i.isAll = checkedAll.value)
}
function selectCard(val) {
  // val.isAll = !val.isAll
  let list = imgData.data.filter(i => i.type === val.code)
  list.forEach(item => {
    item.checked = val.isAll
  })
  list.forEach(i => onVisibleChange(i))
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

  let card = imgData.cardList.find(i => i.code === img.type)
  card.isAll = card.data.every(i => i.checked)
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
.databaseImageModal-modal-box {
  // display: flex;
  // justify-content: space-between;
  width: 1200px;
  .checkbox-box {
    display: flex;
    padding: 10px;
  }
  .box-content {
    width: 100%;
    height: 700px;
    padding: 10px;
    overflow-y: auto;
    // display: flex;
    // flex-wrap: wrap;
    :deep(.box-card) {
      margin-bottom: 10px;
    }
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
  .box-foot {
    margin-top: 20px;
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