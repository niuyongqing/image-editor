<template>
<div id="acquisitionEdit_imageInfo" class="acquisitionEdit_imageInfo">
  <a-card style="text-align: left;">
    <template #title>
      图片信息
    </template>
    <a-form :model="formData" ref="ERPformRef" :label-col="{ span: 3 }">
      <a-form-item label="产品图片" name="erpProductId">
        
      </a-form-item>
      <a-form-item label="产品视频" name="sourceUrl">
        <div class="video-box">
          <a-dropdown :trigger="['click']">
            <a-button type="primary" @click.prevent>
              视频上传
              <AsyncIcon icon="DownOutlined" class="ml-2.5" />
            </a-button>
            <template #overlay>
              <a-menu @click="dropdownClick">
                <a-menu-item key="local">
                  <a-upload 
                    :file-list="uploadInfo.fileList" 
                    :before-upload="videoBeforeUpload" 
                    :showUploadList="false"
                    :maxCount="1"
                    accept=".mp4"
                  >
                    <span>本地上传</span>
                  </a-upload>
                </a-menu-item>
                <a-menu-item key="url">网络上传</a-menu-item>
                <a-menu-item key="imageUrl">图片网络上传</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <div class="video-content">
            <div class="content-image">
              <img src="../img/productVideoIcon.png" alt="">
            </div>
            <div class="video-name" v-if="videoUrl">
              {{ formData.video_list[0]?.originalFilename }}
            </div>
            <div class="content-foot" v-if="videoUrl">
              <a-button 
                type="text" 
                style="color: #4096ff;"
                @click="uploadInfo.playOpen = !uploadInfo.playOpen"
              >播放</a-button>
              <a-button type="text" danger>删除</a-button>
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
        :src="videoUrl"
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
      <a-button @click="uploadInfo.imageUrlUpload = !uploadInfo.imageUrlUpload">关闭</a-button>
      <a-button type="primary" @click="imageUrlUploadFn">确定</a-button>
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
      <a-button @click="uploadInfo.videoUrlUpload = !uploadInfo.videoUrlUpload">关闭</a-button>
      <a-button type="primary" @click="videoUrlUploadFn">确定</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import download from '~@/api/common/download';
import AsyncIcon from '~@/layouts/components/menu/async-icon.vue'
import { videoUpload } from '../js/api';
defineOptions({ name: "acquisitionEdit_imageInfo" })
const { proxy: _this } = getCurrentInstance()
const formData = reactive({
  video_list: [],
})
const uploadInfo = reactive({
  fileList: [],
  playOpen: false,

  videoUrl: '',
  videoUrlUpload: false,
  
  imageUrl: '',
  imageUrlUpload: false,
})
const uploading = ref(false)
const videoUrl = computed(() => {
  return formData.video_list[0]?.url
})
function dropdownClick({ key }) {
  // console.log({key});
  // download
  if (key === 'url') {
    uploadInfo.videoUrlUpload = !uploadInfo.videoUrlUpload
  } else if (key === 'imageUrl') {
    uploadInfo.imageUrlUpload = !uploadInfo.imageUrlUpload
  }
}
function videoBeforeUpload(file) {
  uploadInfo.fileList = [file];
  let suffix = file.name.split('.')[file.name.split('.').length - 1].toUpperCase()
  // console.log({suffix});
  if (suffix !== 'MP4') {
    message.info('仅支持上传MP4格式视频！')
  } else {
    videoHandleUpload(file)
  }
  return false;
}
// 本地上传
async function videoHandleUpload(file) {
  uploading.value = true;
  let params = new FormData();
  params.append('file', file);
  let res = await videoUpload(params)
  // console.log({res});
  res.data.url = import.meta.env.VITE_APP_BASE_API + res.data.fileName
  formData.video_list = [res.data]
  uploading.value = false;
}
// 图片网络上传
async function imageUrlUploadFn() {
  let urlList = uploadInfo.imageUrl.split('\n')
  console.log(uploadInfo.imageUrl, urlList);
}
// 视频网络上传
async function videoUrlUploadFn() {
  
}
</script>
<style lang="less" scoped>
.acquisitionEdit_imageInfo {
  .video-box {
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