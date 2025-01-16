<template>
  <!-- 下拉选择图片上传方式的组件 -->
  <div class="dropdown-of-image">
    <a-dropdown>
      <slot></slot>
      <template #overlay>
        <a-menu @click="handleCommand">
          <a-menu-item key="imgLocal">本地图片</a-menu-item>
          <a-menu-item key="imgFromNet">网络图片</a-menu-item>
          <a-menu-item key="imgBank">图片银行（速卖通）</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <!-- [本地图片, 图片银行]弹窗 -->
    <a-modal
      title="添加图片"
      v-model:open="imgLocalAndBankDialogVisible"
      width="36%"
      :after-close="imgLocalAndBankDialogClose"
      @ok="imgLocalAndBankDialogConfirm"
    >
      <div
        class="img-checked"
        v-if="imgCheckedList.length"
      >
        <div
          class="img"
          v-for="img in imgCheckedList"
          :key="img.url"
        >
          <a-image
            class="img"
            :src="img.url"
          />
          <CloseCircleOutlined
            class="undo-checked"
            @click="undoChecked(img)"
          />
        </div>
      </div>
      <!-- 包一层 a-form-item-rest 是阻止 form 的收集, 避免控制台弹出报错 -->
      <a-form-item-rest>
        <a-tabs
          v-model:activeKey="activeTab"
          @change="tabChange"
        >
          <a-tab-pane
            tab="上传图片"
            key="1"
          >
            <div>
              <a-upload-dragger
                :multiple="limit > 1"
                :action="uploadImageUrl"
                :show-upload-list="false"
                :max-count="limit"
                accept=".jpg,.jpeg,.png"
                :headers="headers"
                :before-upload="beforeUpload"
                @change="handleUploadChange"
              >
                <CloudUploadOutlined />
                <div class="a-upload-text">将文件拖到此处，或 <em>点击上传</em></div>
                <div class="a-upload-hint">只能上传 .jpg,.jpeg,.png, 大小必须小于 5.0MB</div>
                <div class="a-upload-hint">支持图片批量上传, 最多支持 6 张图片</div>
              </a-upload-dragger>
            </div>
          </a-tab-pane>
          <a-tab-pane
            tab="选择图片"
            key="2"
          >
            <div class="img-bank">
              <div class="group">
                <div
                  :class="['group-item', item.groupId === curGroup && 'cur-group']"
                  v-for="item in displayImgGroupList"
                  :key="item.groupId"
                  @click="handleGroupChange(item)"
                >
                  {{ item.groupName }}
                </div>
              </div>
              <div
                class="img-list"
                v-loading="loading"
              >
                <div class="img-wrap">
                  <div
                    class="img"
                    v-for="(img, i) in imgList"
                    :key="i"
                  >
                    <a-image
                      class="img"
                      :src="img.url"
                    />
                    <div class="info">
                      <div>{{ img.width }} x {{ img.height }}</div>
                      <div>{{ (img.fileSize / 1024).toFixed(2) }} KB</div>
                    </div>
                    <CheckCircleOutlined
                      v-if="img.isCheck"
                      class="is-checked"
                    />
                    <div
                      class="img-modal"
                      @click="handleCheck(img)"
                    >
                      <span class="check-text">{{ img.isCheck ? '点击取消' : '点击选中' }}</span>
                    </div>
                  </div>
                </div>
                <a-pagination
                  v-model:current="pagination.currentPage"
                  v-model:pageSize="pagination.pageSize"
                  :page-size-options="[24, 60, 120]"
                  show-size-changer
                  show-quick-jumper
                  :total="total"
                  :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
                  @change="paginationChange"
                />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-form-item-rest>
    </a-modal>
    <!-- 网络图片弹窗 -->
    <a-modal
      title="网络图片"
      v-model:open="imgFromNetDialogVisible"
      width="30%"
      :after-close="imgFromNetDialogClose"
      :confirm-loading="loadingOfImgUrlFromNet"
      @ok="imgFromNetDialogConfirm"
    >
      <a-form-item-rest>
        <a-textarea
          v-model:value="imgUrlFromNet"
          :auto-size="{ minRows: 6, maxRows: 8 }"
          ref="imgUrlFromNetRef"
          placeholder="请填写图片URL地址, 多个地址用回车换行"
          allow-clear
        >
        </a-textarea>
      </a-form-item-rest>
    </a-modal>
  </div>
</template>

<script>
  import { useAuthorization } from '~/composables/authorization'
  import { uploadImgFromNetApi, getImagePaginationApi, syncImagePaginationApi } from '@/pages/aliexpress/apis/media'
  import { CloudUploadOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'

  export default {
    name: 'DropdownOfImage',
    components: { CloudUploadOutlined, CloseCircleOutlined, CheckCircleOutlined },
    props: {
      account: {
        type: String,
        default: ''
      },
      limit: {
        type: Number,
        default: 1
      },
      imgGroupList: {
        type: Array,
        default: () => []
      },
      parentImgList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        headers: { Authorization: useAuthorization().value },
        uploadImageUrl: import.meta.env.VITE_APP_BASE_API + '/platform-aliexpress/platform/aliexpress/file/upload/main-image',
        imgSpaceDialogVisible: false,
        imgList: [], // 图片列表(全量)
        imgCheckedList: [], // 弹窗中选中的图片
        imgLocalAndBankDialogVisible: false,
        activeTab: '1',
        shadowTab: '1',
        fileName: '',
        groupId: '', // 上传图片用的
        curGroup: '', // 筛选图片列表用的
        pagination: {
          currentPage: 1,
          pageSize: 24
        },
        total: 0,
        loading: false,
        syncLoading: false,
        imgUrlFromNet: '', // 输入的网络图片地址
        imgFromNetDialogVisible: false,
        loadingOfImgUrlFromNet: false
      }
    },
    computed: {
      // 上传图片附加参数
      extraData() {
        return {
          groupId: this.groupId,
          fileName: this.fileName,
          sellerId: this.account
        }
      },

      // 展现的图片分组
      displayImgGroupList() {
        return [{ groupId: '', groupName: '全部图片' }, { groupId: 'unGroup', groupName: '未分组图片' }, ...this.imgGroupList]
      }
    },
    mounted() {},
    methods: {
      // 选择下拉指令
      handleCommand({ key }) {
        if (!this.account) {
          message.warning('请先选择店铺')
          return
        }
        if (this.parentImgList.length >= this.limit) {
          message.warning(`图片最多选用 ${this.limit} 张`)
          return
        }

        if (key === 'imgLocal') {
          this.imgLocalAndBankDialogVisible = true
        } else if (key === 'imgSpace') {
          this.imgSpaceDialogVisible = true
        } else if (key === 'imgFromNet') {
          this.imgFromNetDialogVisible = true
          this.$nextTick(() => {
            this.$refs.imgUrlFromNetRef.focus()
          })
        } else if (key === 'imgBank') {
          this.activeTab = '2'
          this.shadowTab = '2'
          this.getImgBankList()
          this.imgLocalAndBankDialogVisible = true
        }
      },
      syncImageBank() {
        this.syncLoading = true
        syncImagePaginationApi({ sellerId: this.account })
          .then(res => {
            if (res && res.code === 200) {
              this.getImgBankList()
            }
          })
          .finally(() => {
            this.syncLoading = false
          })
      },
      tabChange() {
        if (this.activeTab === this.shadowTab) return

        this.shadowTab = this.activeTab

        if (this.activeTab === '2') {
          this.pagination = {
            currentPage: 1,
            pageSize: 24
          }
          this.getImgBankList()
        }
      },
      handleGroupChange(item) {
        if (item.groupId === this.curGroup) return

        this.curGroup = item.groupId
        this.getImgBankList()
      },
      getImgBankList() {
        this.loading = true
        const params = {
          sellerId: this.account,
          groupId: this.curGroup,
          ...this.pagination
        }
        getImagePaginationApi(params)
          .then(res => {
            if (res.data.result) {
              this.total = res.data.result.total
              const list = res.data.result.images || []
              list.forEach(item => {
                item.isCheck = false
              })
              this.imgList = list
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
      paginationChange() {
        this.getImgBankList()
      },
      imgLocalAndBankDialogClose() {
        this.imgLocalAndBankDialogVisible = false
        // 重置数据
        this.fileName = ''
        this.groupId = ''
        this.activeTab = '1'
        this.shadowTab = '1'
        this.curGroup = ''
        this.imgList = []
        this.imgCheckedList = []
        this.pagination = {
          currentPage: 1,
          pageSize: 24
        }
        this.total = 0
      },
      imgLocalAndBankDialogConfirm() {
        if (this.imgCheckedList.length + this.parentImgList.length > this.limit) {
          message.warning(`图片最多选用 ${this.limit} 张`)
          return
        }

        this.$emit('submit', this.imgCheckedList)
        this.imgLocalAndBankDialogClose()
      },
      // 图片上传处理
      beforeUpload(file) {
        if (file.size / 1024 / 1024 > 5) {
          message.warning('文件过大, 上传失败')
          return false
        }
        // this.fileName = file.originalFilename
        // return new Promise(resolve => {
        //   resolve()
        // })
      },
      handleUploadChange({ file }) {
        if (file.status === 'done') {
          const res = file.response
          if (res.code === 200) {
            const imgInfo = {
              fileName: res.fileName,
              originalFilename: res.originalFilename,
              url: '/prod-api' + res.url.replaceAll('#', '%23')
            }
            this.getImgSize(imgInfo)
            this.imgCheckedList.push(imgInfo)
          } else {
            message.warning(res.msg)
          }
        }
      },
      // 获取图片的原始宽高
      getImgSize(img) {
        const image = new Image()
        image.src = img.url
        image.onload = () => {
          img.width = image.width
          img.height = image.height
        }
      },
      handleCheck(img) {
        img.isCheck = !img.isCheck

        if (img.isCheck) {
          this.imgCheckedList.push(img)
        } else {
          this.imgCheckedList = this.imgCheckedList.filter(item => item.url !== img.url)
        }
      },
      undoChecked(img) {
        this.imgCheckedList = this.imgCheckedList.filter(item => item.url !== img.url)
        const i = this.imgList.findIndex(item => item.url === img.url)
        i > -1 && (this.imgList[i].isCheck = false)
      },
      imgSpaceDialogClose() {
        this.imgSpaceDialogVisible = false
        this.imgCheckedList = []
      },
      imgSpaceDialogConfirm() {
        this.$emit('submit', this.imgCheckedList)
        this.imgSpaceDialogClose()
      },
      imgFromNetDialogClose() {
        this.imgUrlFromNet = ''
        this.imgFromNetDialogVisible = false
      },
      imgFromNetDialogConfirm() {
        if (this.imgUrlFromNet) {
          const rawImgList = this.imgUrlFromNet.trim().split('\n')
          if (rawImgList.length + this.parentImgList.length > this.limit) {
            message.warning(`图片最多选用 ${this.limit} 张`)
            return
          }

          this.loadingOfImgUrlFromNet = true
          uploadImgFromNetApi({ imgUrls: rawImgList.join(',') })
            .then(res => {
              if (res && res.code === 200) {
                const imgData = res.data.map(item => {
                  return {
                    fileName: item.fileName,
                    originalFilename: item.originalFilename,
                    url: '/prod-api' + item.url.replaceAll('#', '%23')
                  }
                })

                const promiseList = imgData.map(item => {
                  return new Promise(resolve => {
                    const image = new Image()
                    image.src = item.url
                    image.onload = () => {
                      item.width = image.width
                      item.height = image.height
                      resolve()
                    }
                  })
                })

                Promise.all(promiseList).then(() => {
                  this.$emit('submit', imgData)
                })
              }
            })
            .finally(() => {
              this.loadingOfImgUrlFromNet = false
              this.imgFromNetDialogClose()
            })
        } else {
          message.warning('请填写图片URL地址')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  :deep(.ant-upload-drag) {
    height: 524px;
  }

  :deep(.ant-upload .ant-upload-btn) {
    padding-top: 188px;
  }

  .btn-sync {
    position: absolute;
    right: 20px;
    z-index: 1;
  }

  .img-checked {
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    flex-wrap: wrap;
    // overflow-x: auto;
    .img {
      width: 50px;
      height: 50px;
      margin-right: 12px;
      margin-bottom: 12px;
      position: relative;
      .undo-checked {
        position: absolute;
        top: -7px;
        right: -7px;
        cursor: pointer;
        color: rgba(255, 0, 0, 0.7);
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
  .img-bank {
    display: flex;
    .group {
      flex: none;
      padding: 8px 0;
      width: 150px;
      overflow: auto;
      &-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 4px 0;
        cursor: pointer;
        &:hover {
          background-color: #f0f1f5;
        }
      }
      .cur-group {
        background-color: #f0f1f5;
      }
    }
    .img-list {
      flex: 1;
      padding: 8px;
      .img-wrap {
        display: flex;
        flex-wrap: wrap;
        height: 484px;
        overflow: auto;
        .img {
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
            // height: 24px;
            // display: flex;
            // justify-content: space-between;
            width: 100%;
            font-size: 12px;
            color: #fff;
          }
          .is-checked {
            position: absolute;
            top: 0;
            right: 0;
            color: rgba(0, 255, 0, 0.7);
            font-size: 20px;
            font-weight: bold;
          }
          .img-modal {
            opacity: 0;
            width: 100%;
            height: 100%;
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

    :deep(.ant-pagination-options) {
      width: 200px;
      .ant-select.ant-select-in-form-item {
        width: 45%;
      }
    }
  }
</style>
