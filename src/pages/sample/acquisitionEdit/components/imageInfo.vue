<template>
<div id="acquisitionEdit_imageInfo" class="acquisitionEdit_imageInfo">
  <a-card style="text-align: left;">
    <template #title>
      图片信息
    </template>
    <a-form :model="formData" ref="ERPformRef" :label-col="{ span: 3 }">
      <a-form-item 
        label="产品图片" 
        name="image_list"
        :rules="[{ required: true, trigger: 'change'}]"
      >
        <div class="box">
          <div class="box-btn">
            <a-dropdown :trigger="['click']">
              <a-button type="primary" @click.prevent :loading="loading.image">
                {{ loading.image ? '上传中...' : '图片上传' }}
                <AsyncIcon icon="DownOutlined" class="ml-2.5" />
              </a-button>
              <template #overlay>
                <a-menu @click="dropdownClick">
                  <a-menu-item key="local">
                    <a-upload 
                      :file-list="uploadModalInfo.imageFileList" 
                      :before-upload="imageBeforeUpload" 
                      :showUploadList="false"
                      accept=".jpg, .jpeg, .png, .webp"
                      multiple
                    >
                      <span>本地上传</span>
                    </a-upload>
                  </a-menu-item>
                  <a-menu-item key="pictureLibrary">图片空间</a-menu-item>
                  <a-menu-item key="imageUrl">网络上传</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <a-space v-if="true">
              <a-dropdown :trigger="['click']" :disabled="loading.watermark || formData.image_list.length < 1">
                <a-button @click.prevent :loading="loading.watermark">
                  {{ loading.watermark ? '正在添加水印...':'添加水印' }}
                  <AsyncIcon icon="DownOutlined" class="ml-2.5" />
                </a-button>
                <template #overlay>
                  <a-menu @click="watermarkClick">
                    <a-menu-item 
                      v-for="item in watermarkList"
                      :key="item.id"
                    >
                      <div class="watermark-item">
                        <a-image
                          :width="20"
                          :height="20"
                          :src="item.content"
                          v-if="item.type === 1"
                        />
                        {{ item.title }}
                      </div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <a-dropdown :trigger="['click']" :disabled="formData.image_list.length < 1">
                <a-button type="primary" @click.prevent :loading="loading.watermark">
                  {{ '编辑图片' }}
                  <AsyncIcon icon="DownOutlined" class="ml-2.5" />
                </a-button>
                <template #overlay>
                  <a-menu @click="dropdownClick">
                    <a-menu-item key="bacthEditSize">批量改图片尺寸</a-menu-item>
                    <a-menu-item key="clear">清空图片</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <a-button 
                type="primary" 
                @click="downloadAllImageFn" 
                :loading="loading.download"
                :disabled="formData.image_list.length < 1"
              >
                <AsyncIcon icon="DownloadOutlined" />
                {{ loading.download ? '正在导出...':'导出全部图片' }}
              </a-button>
            </a-space>
          </div>
          <div class="box-tagTips">
            <a-tag color="green">说明</a-tag>
            点击图片拖动，即可调整图片顺序！
          </div>
          <draggable
            v-model="formData.image_list"
            @end="handleDragEnd" 
            tag="div" 
            class="image-content"
            item-key="id"
            v-if="formData.image_list.length > 0"
          >
            <template #item="{ element: item }">
              <div class="img-box">
                <a-image
                  :width="150"
                  :height="150"
                  :src="item.src"
                />
                <div class="img-size">
                  <span>{{ `${item.width} × ${item.height}` }}</span>
                  <!-- <span>{{ (item.size/1024).toFixed() }}KB</span> -->
                </div>
                <div class="img-box-foot">
                  <div class="img-name">
                    <a-tooltip>
                      <template #title>{{ item.name }}</template>
                      {{ item.name }}
                    </a-tooltip>
                  </div>
                  <a-tooltip>
                    <template #title>删除</template>
                    <AsyncIcon @click="delImg(item)" icon="DeleteOutlined" style="color: red; cursor: pointer;"/>
                  </a-tooltip>
                </div>
              </div>
            </template>
          </draggable>
          <div class="image-content" v-else>
            <!-- 没有图片占位 -->
            <div class="img-box">
              <a-image
                :width="150"
                :height="150"
                :src="kong"
                :preview="false"
              />
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="产品视频" name="video_list">
        <div class="box">
          <a-dropdown :trigger="['click']">
            <a-button type="primary" @click.prevent :loading="loading.video">
                {{ loading.video ? '上传中...' : playVideoUrl ? '重新上传':'上传视频' }}
                <AsyncIcon icon="DownOutlined" class="ml-2.5" />
            </a-button>
            <template #overlay>
              <a-menu @click="dropdownClick">
                <a-menu-item key="local">
                  <a-upload 
                    :file-list="uploadModalInfo.videoFileList" 
                    :before-upload="videoBeforeUpload" 
                    :showUploadList="false"
                    :maxCount="1"
                    accept=".mp4"
                  >
                    <span>本地上传</span>
                  </a-upload>
                </a-menu-item>
                <a-menu-item key="videoUrl">网络上传</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <div class="video-content" v-if="playVideoUrl">
            <div class="content-image">
              <img src="../img/productVideoIcon.png" alt="">
            </div>
            <div class="content-foot">
              <a-button 
                type="text" 
                style="color: #4096ff;"
                @click="uploadModalInfo.playOpen = !uploadModalInfo.playOpen"
              >播放</a-button>
              <a-button type="text" danger @click="videoDeleteFn(formData.video_list[0].fileName)">删除</a-button>  
            </div>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-card>

  <!-- 播放弹窗 -->
  <a-modal 
    v-model:open="uploadModalInfo.playOpen" 
    title="播放"
    width="500px"
  >
    <div class="modal-box">
      <video 
        :src="playVideoUrl"
        type="video/mp4"
        controls
        autoplay
        id="acquisitionEdit-video"
        ref="acquisitionEdit_video"
      />
    </div>
    <template #footer>
      <a-button type="primary" @click="modalClose">关闭</a-button>
    </template>
  </a-modal>
  <!-- 图片网络上传 -->
  <a-modal 
    v-model:open="uploadModalInfo.imageUrlUpload" 
    title="从网络地址(URL)选择图片"
    width="500px"
  >
    <div class="modal-box">
      <a-textarea v-model:value="uploadModalInfo.imageUrl" placeholder="请填写图片URL地址，多个地址用回车换行" :rows="4" />
    </div>
    <template #footer>
      <a-button @click="modalClose">关闭</a-button>
      <a-button type="primary" @click="imageUrlConfirm" :loading="loading.image">确定</a-button>
    </template>
  </a-modal>
  <!-- 视频网络上传 -->
  <a-modal 
    v-model:open="uploadModalInfo.videoUrlUpload" 
    title="视频地址"
    width="500px"
  >
    <div class="modal-box">
      <a-textarea v-model:value="uploadModalInfo.videoUrl" placeholder="仅支持mp4文件格式后缀，其他格式视频会上传失败！" :rows="4" />
    </div>
    <template #footer>
      <a-button @click="modalClose">关闭</a-button>
      <a-button type="primary" @click="videoUrlUploadFn" :loading="loading.video">确定</a-button>
    </template>
  </a-modal>
  <!-- 图片空间 -->
  <pictureLibrary 
    :platform="props.productData?.classPlatform"
    v-model:modal-open="uploadModalInfo.pictureLibraryOpen"
    @imageListConfirm="imageListConfirm"
  ></pictureLibrary>
  <!-- 批量修改图片尺寸 -->
  <bacthImageEdit 
    v-model:modal-open="uploadModalInfo.bacthImageSize"
    :iamge-list="formData.image_list"
    @bacthImageEditSize="bacthImageEditSize"
  ></bacthImageEdit>
</div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import kong from '@/assets/images/kong.png'
import download from '~@/api/common/download';
import draggable from 'vuedraggable';
import { downloadAllImage, imageUpload, imageUrlUpload, videoDelete, videoUpload, videoUrlUpload } from '../js/api';
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'
import pictureLibrary from '@/components/pictureLibrary/index.vue'
import bacthImageEdit from './modal/bacthImageEdit.vue';
import { scaleApi, watermarkApi, watermarkListApi } from '~@/api/common/water-mark';
defineOptions({ name: "acquisitionEdit_imageInfo" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:imageInfoData'])
const props = defineProps({
  imageInfoData: {
    type: Object,
    default: () => {}
  },
  productData: {
    type: Object,
    default: () => {}
  }
})
const formData = reactive({
  image_list: [],
  video_list: [],
})
const uploadModalInfo = reactive({
  videoFileList: [],
  imageFileList: [],
  playOpen: false,

  videoUrl: '',
  videoUrlUpload: false,
  
  imageUrl: '',
  imageUrlUpload: false,

  pictureLibraryOpen: false,

  bacthImageSize: false,
})
const loading = reactive({
  image: false,
  video: false,
  watermark: false,
  download: false,
})

watch(() => props.productData?.id, (val) => {
  // console.log(111);
  openFn()
  getWatermarkList()
})
watch(() => formData, (val) => {
  // console.log({ val });
  let obj = { ...val }
  if (val.image_list.length > 0) {
    _this.$refs.ERPformRef?.clearValidate()
  }
  emit('update:imageInfoData', obj)
}, {
  deep: true
})
// 页面赋值
function openFn() {
  // 生成图片列表和视频列表
  const { localVideoList, videoList, imageList } = props.productData;
  formData.image_list = imageList.map(item => {
    let src = item
    if (!item.includes('http')) {
      src = import.meta.env.VITE_APP_BASE_API + item
    }
    let obj = {
      name: '',
      url: item,
      id: createRandom(),
      width: '',
      height: '',
      src
    }
    return obj
  })
  formData.image_list.forEach(item => getImageSize(item))
  let video_list = (localVideoList?.length ? localVideoList : videoList) || [];
  formData.video_list = video_list.map(item => {
    let url = item
    if (!item.includes('http')) {
      url = import.meta.env.VITE_APP_BASE_API + item
    }
    let obj = {
      fileName: item,
      newFileName: item,
      originalFilename: '',
      url
    }
    return obj;
  })
}

const watermarkList = ref([])
async function getWatermarkList() {
  try {
    let res = await watermarkListApi()
    // console.log({ res });
    watermarkList.value = res.data
  } catch (error) {
    console.error(error)
  }
  // watermarkApi
  // scaleApi
}
// 添加水印
async function watermarkClick({ key }) {
  // console.log({key});
  loading.watermark = true
  try {
    // 筛选出网图
    let urlImageList = formData.image_list.filter(item => item.src.includes('http'))
    // 网图先走一遍上传再去打水印
    for (let index = 0; index < urlImageList.length; index++) {
      const item = urlImageList[index];
      try {
        const url = item.url;
        let res = await imageUrlUpload({ url })
        formData.image_list.forEach(i => {
          if (i.url === url) {
            i.url = res.data.url
          }
        })
      } catch (error) {
        console.error(error)
      }
    }
    let imagePathList = formData.image_list.map(i => i.url)
    let params = {
      id: key,
      imagePathList
    }
    let newImage = await watermarkApi(params)
    // 更新打了水印的图片src
    formData.image_list.forEach(item => {
      let val = (newImage?.data || []).find(i => i.originalFilename === item.url)
      // console.log({val});
      if (val) {
        item.url = val.url.replace('/prod-api', ''),
        item.src = val.url
      }
    })
  } catch (error) {
    console.error(error)
  }
  loading.watermark = false;
}
// 导出全部图片
async function downloadAllImageFn() {
  loading.download = true;
  try {
    let imageList = formData.image_list.map(i => i.url)
    let res = await downloadAllImage({ imageList })
    // console.log(res);
    download.name(res.data)
  } catch (error) {
    console.error(error)
  }
  loading.download = false
}

// 视频播放链接
const playVideoUrl = computed(() => {
  return formData.video_list[0]?.url
})
function dropdownClick({ key }) {
  // console.log({key});
  // download
  switch (key) {
    case 'imageUrl':      // 上传网络图片
      uploadModalInfo.imageUrlUpload = !uploadModalInfo.imageUrlUpload
      break;  
    case 'videoUrl':      // 上传网络视频
      uploadModalInfo.videoUrlUpload = !uploadModalInfo.videoUrlUpload
      break;
    case 'pictureLibrary':    // 图片空间上传
      uploadModalInfo.pictureLibraryOpen = !uploadModalInfo.pictureLibraryOpen
      break;
    case 'bacthEditSize':    // 图片批量尺寸
      uploadModalInfo.bacthImageSize = !uploadModalInfo.bacthImageSize
      break;
    case 'clear':    // 清空图片
      formData.image_list = []
      break;
    default:
      break;
  }
}
// 批量修改图片尺寸
function bacthImageEditSize(newImage) {
  formData.image_list.forEach(item => {
    let val = (newImage || []).find(i => i.id === item.id)
    if (val) {
      item.url = val.url,
      item.src = val.src
      getImageSize(item)
    }
  })
}
// 拖拽结束
const handleDragEnd = (event) => {
  // console.log('拖拽结束', event);
};
// 网络上传图片弹窗确认
async function imageUrlConfirm() {
  loading.image = true;
  let urlList = uploadModalInfo.imageUrl.split('\n')
  let res = await imageUrlUploadFn(urlList)
  // console.log({res}, 22);
  formData.image_list = [...res]
  loading.image = false
  modalClose()
}
// 图片网络上传
async function imageUrlUploadFn(urlList) {
  // console.log('/* uploadModalInfo.imageUrl */', urlList);
  let imageList = []
  for (let index = 0; index < urlList.length; index++) {
    try {
      const url = urlList[index];
      let res = await imageUrlUpload({ url })
      res.data.id = createRandom()
      res.data.src = import.meta.env.VITE_APP_BASE_API + res.data.url
      imageList.push(res.data)
    } catch (error) {
      console.error(error)
    }
  }
  return imageList;
}
// 弹窗关闭
function modalClose() {
  uploadModalInfo.playOpen = false;
  uploadModalInfo.imageUrlUpload = false;
  uploadModalInfo.videoUrlUpload = false;
  uploadModalInfo.pictureLibraryOpen = false;
  uploadModalInfo.imageUrl = '';
  uploadModalInfo.videoUrl = '';
  _this.$refs.acquisitionEdit_video?.pause()
}
// 图片空间上传
function imageListConfirm(val) {
  // console.log({val}, 'imageListConfirm');
  let list = val.map(item => {
    const {name, width, height, path: url, src, size} = item
    return {
      name,
      id: createRandom(),
      width,
      height,
      url,
      src,
      size
    };
  })
  formData.image_list = [...(formData.image_list || []), ...list]
}
// 图片本地上传
function imageBeforeUpload(file) {
  uploadModalInfo.videoFileList = [file];
  let suffix = file.name.split('.')[file.name.split('.').length - 1].toLowerCase()
  // console.log({suffix});
  let suffixList = ['jpg', 'jpeg', 'png', 'webp']
  if (!suffixList.includes(suffix)) {
    message.warning(`仅支持上传${suffixList.join()}格式图片！`);
  } else {
    imageHandleUpload(file)
  }
  return false;
}
async function imageHandleUpload(file) {
  loading.image = true;
  let params = new FormData();
  params.append('file', file);
  let res = await imageUpload(params)
  // console.log({ res });
  res.data.id = createRandom()
  res.data.src = import.meta.env.VITE_APP_BASE_API + res.data.url
  formData.image_list = [...(formData.image_list || []), (res.data)]
  loading.image = false;
}
function delImg(val) {
  formData.image_list = formData.image_list.filter(i => i.id !== val.id)
}

// 视频本地上传
function videoBeforeUpload(file) {
  uploadModalInfo.videoFileList = [file];
  let suffix = file.name.split('.')[file.name.split('.').length - 1].toUpperCase()
  // console.log({suffix});
  if (suffix !== 'MP4') {
    message.warning('仅支持上传MP4格式视频！')
  } else {
    videoHandleUpload(file)
  }
  return false;
}
async function videoHandleUpload(file) {
  loading.video = true;
  try {
    let oldFileName = formData.video_list[0]?.fileName
    let params = new FormData();
    params.append('file', file);
    let res = await videoUpload(params)
    // console.log({res});
    res.data.url = import.meta.env.VITE_APP_BASE_API + res.data.fileName
    formData.video_list = [res.data]
    if (oldFileName) {
      await videoDeleteFn(oldFileName)
    }
  } catch (error) {
    console.error(error);
  }
  loading.video = false;
}
// 视频网络上传
async function videoUrlUploadFn() {
  loading.video = true;
  try {
    let oldFileName = formData.video_list[0]?.fileName
    let params = new FormData()
    params.append('url', uploadModalInfo.videoUrl)
    let res = await videoUrlUpload(params)
    res.data.url = import.meta.env.VITE_APP_BASE_API + res.data.fileName
    formData.video_list = [res.data]
    if (oldFileName) {
      await videoDeleteFn(oldFileName)
    }
  } catch (error) {
    console.error(error)
  }
  loading.video = false;
  modalClose()
}
// 视频删除
async function videoDeleteFn(filePath) {
  try {
    if (!filePath.includes('http')) {
      let params = new FormData()
      params.append('filePath', filePath)
      await videoDelete(params);
    }
    formData.video_list = []
    // message.success('视频删除成功！')
  } catch (error) {
    console.error(error)
  }
}
// 获取图片宽高
function getImageSize(item) {
  let img = new Image()
  img.onload = (e) => {
    item.width = img.naturalWidth
    item.height = img.naturalHeight
    // formData.image_list = [...formData.image_list]
  }
  img.src = item.src
}
// 生成一个随机数
function createRandom() {
  return Math.floor(Math.random() * 100000000) + ''
}
</script>
<style lang="less" scoped>
.acquisitionEdit_imageInfo {
  .box {
    .box-btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding-right: 40px;
    }
    .box-tagTips {
      margin-top: 10px;
      display: flex;
      align-items: center;
    }
    .image-content {
      width: 100%;
      max-height: 700px;
      margin: 10px 0;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      .img-box {
        width: 154px;
        // height: 180px;
        margin: 0 10px 10px 0;
        border: 1px solid #ccc;
        padding: 1px;
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
          padding: 0 6px;
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
    .video-content {
      // width: 100px;
      // height: 100px;
      // display: flex;
      // justify-content: center;
      // align-items: center;
      .content-image {
        width: 100px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 0.5px rgb(205, 202, 202) solid;
        margin: 10px 0 6px;
      }
      .video-name {
        margin-bottom: 6px;
      }
    }
  }
}
.modal-box {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  video {
    width: 400px;
    height: 400px;
  }
}
</style>