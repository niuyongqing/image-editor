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
              <a-button type="primary" @click.prevent :loading="uploading.image">
                {{ uploading.image ? '上传中...' : '图片上传' }}
                <AsyncIcon icon="DownOutlined" class="ml-2.5" />
              </a-button>
              <template #overlay>
                <a-menu @click="dropdownClick">
                  <a-menu-item key="local">
                    <a-upload 
                      :file-list="uploadInfo.imageFileList" 
                      :before-upload="imageBeforeUpload" 
                      :showUploadList="false"
                      accept=".jpg, .jpeg, .png, .webp, .avif"
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
          </div>
          <div class="image-content">
            <div class="img-box"
              v-for="item in formData.image_list"
              :key="item.id"
            >
              <a-image
                :width="150"
                :height="150"
                :src="item.src"
                :preview="false"
              />
              <div class="img-size">
                <span>{{ `${item.width} × ${item.height}` }}</span>
                <span>{{ (item.size/1024).toFixed() }}KB</span>
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
            <div class="img-box" v-if="formData.image_list.length < 1">
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
            <a-button type="primary" @click.prevent :loading="uploading.video">
                {{ uploading.video ? '上传中...' : '视频上传' }}
                <AsyncIcon icon="DownOutlined" class="ml-2.5" />
            </a-button>
            <template #overlay>
              <a-menu @click="dropdownClick">
                <a-menu-item key="local">
                  <a-upload 
                    :file-list="uploadInfo.videoFileList" 
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
          <div class="video-content">
            <div class="content-image">
              <img src="../img/productVideoIcon.png" alt="">
            </div>
            <div class="video-name" v-if="playVideoUrl">
              {{ formData.video_list[0]?.originalFilename }}
            </div>
            <div class="content-foot" v-if="playVideoUrl">
              <a-button 
                type="text" 
                style="color: #4096ff;"
                @click="uploadInfo.playOpen = !uploadInfo.playOpen"
              >播放</a-button>
              <a-popconfirm
                title="是否删除视频？"
                ok-text="是"
                cancel-text="否"
                @confirm="videoDeleteFn"
              >
                <a-button type="text" danger>删除</a-button>
              </a-popconfirm>
            </div>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
  <!-- 播放弹窗 -->
  <a-modal 
    v-model:open="uploadInfo.playOpen" 
    title="播放"
    width="400px"
  >
    <div class="modal-box">
      <video 
        :src="playVideoUrl"
        type="video/mp4"
        controls
      />
    </div>
    <template #footer>
      <a-button type="primary" @click="uploadInfo.playOpen = !uploadInfo.playOpen">关闭</a-button>
    </template>
  </a-modal>
  <!-- 图片网络上传 -->
  <a-modal 
    v-model:open="uploadInfo.imageUrlUpload" 
    title="从网络地址(URL)选择图片"
    width="500px"
  >
    <div class="modal-box">
      <a-textarea v-model:value="uploadInfo.imageUrl" placeholder="请填写图片URL地址，多个地址用回车换行" :rows="4" />
    </div>
    <template #footer>
      <a-button @click="modalClose">关闭</a-button>
      <a-button type="primary" @click="imageUrlUploadFn" :loading="uploading.image">确定</a-button>
    </template>
  </a-modal>
  <!-- 视频网络上传 -->
  <a-modal 
    v-model:open="uploadInfo.videoUrlUpload" 
    title="视频地址"
    width="500px"
  >
    <div class="modal-box">
      <a-textarea v-model:value="uploadInfo.videoUrl" placeholder="仅支持mp4文件格式后缀，其他格式视频会上传失败！" :rows="4" />
    </div>
    <template #footer>
      <a-button @click="modalClose">关闭</a-button>
      <a-button type="primary" @click="videoUrlUploadFn" :loading="uploading.video">确定</a-button>
    </template>
  </a-modal>
  <!-- 图片空间 -->
  <pictureLibrary 
    :platform="props.productData?.platform"
    v-model:modal-open="uploadInfo.pictureLibraryOpen"
    @imageListConfirm="imageListConfirm"
  ></pictureLibrary>
</div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import kong from '@/assets/images/kong.png'
import download from '~@/api/common/download';
import { imageUpload, imageUrlUpload, videoDelete, videoUpload, videoUrlUpload } from '../js/api';
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'
import pictureLibrary from '@/components/pictureLibrary/index.vue'
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
const uploadInfo = reactive({
  videoFileList: [],
  imageFileList: [],
  playOpen: false,

  videoUrl: '',
  videoUrlUpload: false,
  
  imageUrl: '',
  imageUrlUpload: false,
  pictureLibraryOpen: false,
})
const uploading = reactive({
  image: false,
  video: false
})

watch(() => props.productData?.id, (val) => {
  // console.log(111);
  openFn()
})
watch(() => formData, (val) => {
  // console.log({ val });
  let obj = {...val}
  emit('update:imageInfoData', obj)
}, {
  deep: true
})
// 页面赋值
function openFn() {
  
}
// 视频播放链接
const playVideoUrl = computed(() => {
  return formData.video_list[0]?.url
})
function dropdownClick({ key }) {
  // console.log({key});
  // download
  switch (key) {
    case 'imageUrl':
      uploadInfo.imageUrlUpload = !uploadInfo.imageUrlUpload
      break;
    case 'videoUrl':
      uploadInfo.videoUrlUpload = !uploadInfo.videoUrlUpload
      break;
    case 'pictureLibrary':
      uploadInfo.pictureLibraryOpen = !uploadInfo.pictureLibraryOpen
      break;
    default:
      break;
  }
}

// 图片网络上传
async function imageUrlUploadFn() {
  uploading.image = true;
  let urlList = uploadInfo.imageUrl.split('\n')
  // console.log(uploadInfo.imageUrl, urlList);
  for (let index = 0; index < urlList.length; index++) {
    try {
      const url = urlList[index];
      let res = await imageUrlUpload({ url })
      res.data.id = createRandom()
      res.data.src = import.meta.env.VITE_APP_BASE_API + res.data.url
      formData.image_list = [...(formData.image_list || []), (res.data)]
    } catch (error) {
      message.error(`链接${url}上传失败！`)
      console.error(error)
    }
  }
  uploading.image = false
  modalClose()
}
// 弹窗关闭
function modalClose() {
  uploadInfo.imageUrlUpload = false;
  uploadInfo.videoUrlUpload = false;
  uploadInfo.pictureLibraryOpen = false;
  uploadInfo.imageUrl = '';
  uploadInfo.videoUrl = '';
}
// 图片空间上传
function imageListConfirm(val) {
  // console.log({val}, 'imageListConfirm');
  let list = val.map(item => {
    const {name, id, width, height, path: url, src, size} = item
    return { name, id, width, height, url, src, size };
  })
  formData.image_list = [...(formData.image_list || []), ...list]
}
// 图片本地上传
function imageBeforeUpload(file) {
  uploadInfo.videoFileList = [file];
  let suffix = file.name.split('.')[file.name.split('.').length - 1].toLowerCase()
  console.log({suffix});
  let suffixList = ['jpg', 'jpeg', 'png', 'webp', 'avif']
  if (!suffixList.includes(suffix)) {
    message.warning(`仅支持上传${suffixList.join()}格式图片！`);
  } else {
    imageHandleUpload(file)
  }
  return false;
}
async function imageHandleUpload(file) {
  uploading.image = true;
  let params = new FormData();
  params.append('file', file);
  let res = await imageUpload(params)
  // console.log({ res });
  res.data.id = createRandom()
  res.data.src = import.meta.env.VITE_APP_BASE_API + res.data.url
  formData.image_list = [...(formData.image_list || []), (res.data)]
  uploading.image = false;
}
function delImg(val) {
  formData.image_list = formData.image_list.filter(i => i.id !== val.id)
}

// 视频本地上传
function videoBeforeUpload(file) {
  uploadInfo.videoFileList = [file];
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
  uploading.video = true;
  let params = new FormData();
  params.append('file', file);
  let res = await videoUpload(params)
  // console.log({res});
  res.data.url = import.meta.env.VITE_APP_BASE_API + res.data.fileName
  formData.video_list = [res.data]
  uploading.video = false;
}
// 视频网络上传
async function videoUrlUploadFn() {
  uploading.video = true;
  try {
    let params = new FormData()
    params.append('url', uploadInfo.videoUrl)
    let res = await videoUrlUpload(params)
    res.data.url = import.meta.env.VITE_APP_BASE_API + res.data.fileName
    formData.video_list = [res.data]
    uploadInfo.videoUrlUpload = !uploadInfo.videoUrlUpload
  } catch (error) {
    console.error(error)
  }
  uploading.video = false;
}
// 视频删除
async function videoDeleteFn() {
  try {
    let filePath = formData.video_list[0].fileName
    let params = new FormData()
    params.append('filePath', filePath)
    await videoDelete(params);
    formData.video_list = []
    message.success('视频删除成功！')
  } catch (error) {
    console.error(error)
  }
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
    }
    .image-content {
      width: 100%;
      max-height: 500px;
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
    width: 300px;
    height: 300px;
  }
}
</style>