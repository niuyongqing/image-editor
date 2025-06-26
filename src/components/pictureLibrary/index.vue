<template>
<div id="pictureLibrary_index" class="pictureLibrary_index">
  <a-modal 
    v-model:open="modalOpen" 
    title="图片空间"
    :maskClosable="false"
    :width="1250"
    :footer="false"
    @ok="modalClose"
  >
    <div class="pictureLibrary_index-modal-box">
      <div class="index-left">
        <div class="left-title box-title">图片空间的分类</div>
        <div class="left-tree-box">
          <typeTree 
            v-model:current-class="imgData.params.currentClass"
            v-model:node-path="imgData.nodePath"
            :platform="platform"
            default-class
            ref="typeTreeRef"
          ></typeTree>
        </div>
      </div>
      <div class="index-right">
        <div class="right-btn">
          <a-space>
            <a-input-search
              v-model:value="imgData.params.keyword"
              style="width: 300px;"
              placeholder="input search text"
              enter-button="搜索"
              @search="imgSearch"
            />
            <a-button type="primary" @click="imgData.uploadImgOpen = !imgData.uploadImgOpen">上传图片</a-button>
          </a-space>
        </div>
        <div class="right-box">
          <div class="right-box-title box-title">
            <span>图片>{{ imgData.nodePath }}</span>
            <span>已选中{{ imgData.selectedImgList.length }}张图片</span>
          </div>
          <div class="right-box-content">
            <div class="img-box"
              v-for="item in imgData.data"
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
                <span>{{ (item.size/1024).toFixed() }}KB</span>
              </div>
              <div class="img-box-foot">
                <a-checkbox v-model:checked="item.checked" @change="event => onVisibleChange(item, event)"></a-checkbox>
                <div class="img-name">
                  <a-tooltip>
                    <template #title>{{ item.name }}</template>
                    {{ item.name }}
                  </a-tooltip>
                </div>
                <a-popconfirm
                  title="是否删除！"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="delImg(item)"
                >
                  <DeleteOutlined style="color: red; cursor: pointer;" />
                </a-popconfirm>
              </div>
            </div>
          </div>
          <div class="right-box-pagination">
            <a-pagination 
              v-model:current="tableParams.pageNum" 
              v-model:page-size="tableParams.pageSize"
              :pageSizeOptions="[20, 40]"
              show-quick-jumper 
              :total="imgData.total" 
              :show-total="total => `共 ${total} 张`"
              @change="pageChange" 
            />
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
              <a-button type="primary" @click="confirm">确定</a-button>
              <a-button type="primary" @click="modalClose">取消</a-button>
            </a-space>
          </div>
        </div>
      </div>
      <uploadImg 
        v-model:modal-open="imgData.uploadImgOpen" 
        :platform="props.platform"
        @uploadDone="uploadDone"
      ></uploadImg>
    </div>
  </a-modal>
</div>
</template>
<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { DeleteOutlined } from '@ant-design/icons-vue';
import typeTree from '@/components/classificationTree/typeTree.vue';
import typeManage from '@/components/classificationTree/typeManage.vue';
import uploadImg from './uploadImg.vue';
import { deleteImage, imageSpaceList } from './js/api';
import { cloneDeep } from 'lodash-es';
defineOptions({ name: "pictureLibrary_index" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'imageListConfirm']);
const props = defineProps({
  modalOpen: Boolean,
  platform: {
    type: String,
    default: ''
  },
})
const modalOpen = ref(false)
const imgData = reactive({
  data: [],
  selectedImgList: [],
  total: 0,
  uploadImgOpen: false,
  nodePath: '',
  params: {
    currentClass: '',
    keyword: '',
  }
})
const tableParams = reactive({
  classId: '',
  name: '',

  pageNum: 1, // 分页参数
  pageSize: 20 // 每页数量
})
// 打开弹窗
watch(() => props.modalOpen, val => {
  // console.log({val});
  modalOpen.value = val;
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
// 监听类型变化
watch(() => imgData.params.currentClass, (val, oldValue) => {
  val && imgSearch()
})
// 弹窗打开的回调
function modalOpenFn() {
  // 更新树的数据，分类id变化会请求图片列表数据
  _this.$refs.typeTreeRef.updateTree('all')
}
// 关闭弹窗
function modalClose() {
  modalOpen.value = false
}
// 清空数据
function clearData() {
  imgData.data = []
  imgData.selectedImgList = []
  imgData.params.keyword = ''
  imgData.params.currentClass = ''
  tableParams.name = ''
  tableParams.classId = ''
  tableParams.pageNum = 1
  tableParams.pageSize = 20
}
// 上传完成
function uploadDone() {
  imgSearch()
}
// 确认
function confirm() {
  let list = cloneDeep(imgData.selectedImgList)
  emit('imageListConfirm', list)
  modalClose()
}
// 图片搜索
async function imgSearch(val) { 
  tableParams.name = imgData.params.keyword
  tableParams.classId = imgData.params.currentClass
  pageChange(1)
}
// 获取数据
async function getImageSpaceList() {
  let params = {
    platform: props.platform,
    ...tableParams,
  }
  try {
    let res = await imageSpaceList(params)
    let idList = imgData.selectedImgList.map(i => i.id)
    res.rows.forEach(item => {
      item.src = (import.meta.env.VITE_APP_BASE_API + item.path)
      item.checked = idList.includes(item.id)
    })
    imgData.data = res.rows
    imgData.total = res.total
  } catch (error) {
    console.error(error)
  }
} 
// 页码变化
function pageChange(val) {
  // console.log({val});
  tableParams.pageNum = val
  getImageSpaceList()
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
}
// 删除空间图片
async function delImg(val) {
  // console.log({ val });
  let params = {
    ids: val.id
  }
  await deleteImage(params)
  getImageSpaceList()
}

</script>
<style lang="less" scoped>
.pictureLibrary_index-modal-box {
  display: flex;
  justify-content: space-between;
  width: 1200px;
  .index-left {
    width: 280px;
    margin-right: 15px;
    .left-tree-box {
      width: 100%;
      height: calc(100% - 50px);
      margin: 10px 0;
    }
  }
  .index-right {
    width: 900px;
    .right-btn {
      display: flex;
      // justify-content: space-between;
    }
    .right-box {
      margin-top: 10px;
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
          .img-box-foot {
            width: 100%;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .img-name {
              width: calc(100% - 45px);
              text-align: left;
              overflow: hidden;
              text-overflow:ellipsis; 
              white-space: nowrap;
            }
          }
        }
      }
      .right-box-pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
        :deep(.ant-select-selector) {
          width: 80px;
        }
      }
      .selectedImg-content {
        width: 100%;
        height: 100px;
        overflow-y: auto;
        background: #eeeeee;
        margin: 10px 0;
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
    }
  }
  .box-title {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    padding: 0 10px;
  }
}
</style>