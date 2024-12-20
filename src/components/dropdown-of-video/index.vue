<template>
  <!-- 下拉选择视频上传方式的组件 -->
  <div class="dropdown-of-video">
    <a-dropdown :loading="uploadVideoLoading">
      <slot></slot>
      <template #overlay>
        <a-menu>
          <a-upload
            accept=".mp4,.wmv,.avi,.mpg,.flv,.mov,.3gp"
            :action="uploadVideoUrl"
            :headers="headers"
            :data="{ sellerId }"
            :max-count="1"
            :show-upload-list="false"
            :disabled="!sellerId"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
          >
            <a-menu-item
              key="local"
              class="w-[132px] text-left"
              >本地上传</a-menu-item
            >
          </a-upload>
          <a-menu-item key="videoBank">选择速卖通视频</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <!-- 视频银行弹窗 -->
    <a-modal
      title="选择视频"
      v-model:open="videoBankDialogVisible"
      :after-close="videoBankDialogClose"
      @ok="videoBankDialogConfirm"
    >
      <a-button
        v-if="false"
        type="primary"
        class="btn-sync"
        @click="syncVideoBank"
        >同步速卖通视频</a-button
      >
      <div class="video-bank">
        <div
          class="video-list"
          v-loading="loading"
        >
          <div class="video-wrap">
            <div
              class="video"
              v-for="(video, i) in videoList"
              :key="i"
            >
              <a-image
                class="video"
                :src="video.coverUrl"
              ></a-image>
              <div class="info">
                <span>{{ durationFormat(video.duration) }}</span>
                <i
                  class="a-icon-video-play btn-video-play"
                  @click="videoPlay(video)"
                ></i>
              </div>
              <i
                v-if="video.isCheck"
                class="a-icon-circle-check is-checked"
              ></i>
              <div
                class="video-modal"
                @click="handleCheck(video)"
              >
                <span class="check-text">{{ video.isCheck ? '点击取消' : '点击选中' }}</span>
              </div>
            </div>
          </div>
          <a-pagination
            v-model:current="pagination.currentPage"
            :page-size-options="[24, 60, 120]"
            :page-size="pagination.pageSize"
            show-quick-jumper
            :total="total"
            @change="paginationChange"
          >
          </a-pagination>
        </div>
      </div>
    </a-modal>
    <!-- 视频预览弹窗 -->
    <a-modal
      title="视频预览"
      v-model:open="previewVideoDialogVisible"
      centered
      destroy-on-close
    >
      <video
        :src="previewVideoUrl"
        autoplay
        controls
        width="100%"
        height="600px"
      ></video>
    </a-modal>
  </div>
</template>

<script>
  import { useAuthorization } from '~/composables/authorization'
  import { getVideoListApi } from '@/api/platformApi/aliexpress/media'
  import { after } from 'lodash'

  export default {
    name: 'DropdownOfVideo',
    props: {
      sellerId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        headers: { Authorization: useAuthorization().value },
        uploadVideoUrl: import.meta.env.VITE_APP_BASE_API + '/platform-aliexpress/platform/aliexpress/file/video/upload',
        videoBankDialogVisible: false,
        uploadVideoLoading: false,
        videoList: [],
        videoChecked: {},
        pagination: {
          currentPage: 1,
          pageSize: 24
        },
        total: 0,
        loading: false,
        previewVideoUrl: '',
        previewVideoDialogVisible: false
      }
    },
    watch: {
      videoBankDialogVisible(val) {
        if (!val) return

        this.getVideoBankList()
      }
    },
    methods: {
      // 选择下拉指令
      handleCommand(command) {
        if (!this.sellerId) {
          this.$message.warning('请先选择店铺')
          return
        }

        if (command === 'videoBank') {
          this.videoBankDialogVisible = true
        }
      },
      beforeUpload(file) {
        if (!this.sellerId) {
          this.$message.warning('请先选择店铺')
          return false
        }
        if (file.size / 1024 / 1024 > 500) {
          this.$alert('文件过大, 视频上传失败！', '错误提示', {
            type: 'error'
          })
          return false
        }

        this.uploadVideoLoading = true
      },
      onSuccess(res) {
        this.uploadVideoLoading = false
        if (res.code === 200) {
          const videoData = {
            ...res.data,
            mediaId: res.data.storeName,
            mediaType: res.data.fileFormat,
            posterUrl: res.data.coverUrl
          }
          this.$emit('submit', videoData)
        } else {
          this.$alert(res.msg, '上传失败', {
            type: 'warning'
          })
        }
      },
      getVideoBankList() {
        this.loading = true
        const params = {
          shellId: this.sellerId,
          ...this.pagination
        }
        getVideoListApi(params)
          .then(res => {
            this.total = res.data.result.totalCount
            const list = res.data.result.videoList || []
            list.forEach(item => {
              item.isCheck = false
            })
            this.videoList = list
          })
          .finally(() => {
            this.loading = false
          })
      },
      paginationChange() {
        this.getVideoBankList()
      },
      handleCheck(video) {
        // 选择另一个, 把其他的置为未选择
        if (!video.isCheck) {
          this.videoList.filter(item => item.id !== video.id).forEach(item => (item.isCheck = false))
        }
        video.isCheck = !video.isCheck

        if (video.isCheck) {
          this.videoChecked = video
        } else {
          this.videoChecked = {}
        }
      },
      videoBankDialogClose() {
        this.videoChecked = {}
        this.pagination = {
          currentPage: 1,
          pageSize: 24
        }
        this.total = 0
        this.videoBankDialogVisible = false
      },
      videoBankDialogConfirm() {
        const videoData = {
          ...this.videoChecked,
          mediaId: this.videoChecked.storeName,
          mediaType: this.videoChecked.fileFormat,
          posterUrl: this.videoChecked.coverUrl
        }
        this.$emit('submit', videoData)
        this.videoBankDialogClose()
      },
      // 视频时长格式化
      durationFormat(duration) {
        // const hour = String(Math.floor(duration / (60 * 60))).padStart(2, '0')
        const minute = String(Math.floor((duration % (60 * 60)) / 60)).padStart(2, '0')
        const second = String(duration % 60).padStart(2, '0')

        return `${minute}:${second}`
      },
      // 打开弹窗播放视频
      videoPlay(video) {
        this.previewVideoUrl = video.url
        this.previewVideoDialogVisible = true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dropdown-of-video {
    .btn-sync {
      position: absolute;
      right: 20px;
      z-index: 1;
    }

    .video-bank {
      .video-list {
        flex: 1;
        padding: 8px;
        .video-wrap {
          display: flex;
          flex-wrap: wrap;
          height: 472px;
          overflow: auto;
          .video {
            width: 100px;
            height: 100px;
            margin: 0 12px 12px 0;
            position: relative;
            user-select: none;
            .info {
              position: absolute;
              bottom: 0;
              left: 0;
              background-color: rgba(5, 5, 5, 0.3);
              width: 100%;
              padding: 0 4px;
              width: 100%;
              font-size: 12px;
              color: #fff;
              z-index: 1;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .btn-video-play {
                cursor: pointer;
                font-size: 20px;
              }
            }
            .is-checked {
              position: absolute;
              top: 0;
              right: 0;
              color: rgba(0, 255, 0, 0.7);
              font-size: 20px;
              font-weight: bold;
            }
            .video-modal {
              opacity: 0;
              width: 100%;
              height: 72px;
              position: absolute;
              top: 0;
              left: 0;
              text-align: center;
              line-height: 100px;
              color: #fff;
              background-color: rgba(5, 5, 5, 0.2);
              cursor: pointer;
              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
</style>
