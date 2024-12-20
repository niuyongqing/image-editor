<template>
  <a-card
    header="图片信息"
    shadow="hover"
    class="image-info mb-16"
  >
    <div
      slot="header"
      class="clearfix"
    >
      <span>图片信息<span style="color: #9fa0a2">（编辑图片时请先选择店铺）</span></span>
      <span style="float: right; padding: 3px 0; color: #99999a">
        媒体空间容量
        <span v-if="sellerId"> ({{ usedSize }} / {{ capacitySize }} GB) </span>
        <span
          v-else
          style="color: #0b56fa"
          >（选择店铺后显示）</span
        >
      </span>
      <span style="float: right; padding: 3px 0; color: #99999a; margin-right: 10px">
        <a-select
          v-model="watermarkId"
          placeholder="请选择水印"
          clearable
          :disabled="!checkedImgList.length"
          :loading="imgEditLoading"
          @change="selectWaterMark"
        >
          <a-option
            v-for="item in watermarkOptions"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
            <div>
              <span>{{ item.title }} </span>
              <a-image
                v-if="item.type === 1"
                fit="contain"
                :src="item.content"
                style="width: 20px; height: 20px; position: relative; top: 4px"
              ></a-image>
              <span v-else>({{ item.content }})</span>
            </div>
          </a-option>
        </a-select>
      </span>
      <span style="float: right; padding: 3px 0; color: #99999a; margin-right: 10px">
        <a-input-number
          v-model="cropWidth"
          placeholder="宽"
          controls-position="right"
          :disabled="!checkedImgList.length"
          :controls="false"
        ></a-input-number>
        X
        <a-input-number
          v-model="cropHeight"
          placeholder="高"
          controls-position="right"
          :disabled="!checkedImgList.length"
          :controls="false"
        ></a-input-number>
        <a-button
          :disabled="!checkedImgList.length"
          :loading="imgEditLoading"
          @click="handleCrop"
          >修改尺寸</a-button
        >
      </span>
    </div>
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="180px"
    >
      <a-form-item
        label="产品图片："
        prop="productImages"
      >
        <div>
          <div style="color: #9fa0a2">
            点击图片拖动，即可调整图片顺序！「图片最多选用
            <span style="color: #ff0a37; font-weight: bolder; font-size: 20px">6</span>
            张，已经选用了
            <span style="color: #07793a; font-weight: bold; font-size: 18px">{{ form.productImages.length }}</span>
            张」
          </div>
          <div>
            <a-tag
              type="success"
              effect="dark"
              >！说明</a-tag
            >
            <span style="color: #9fa0a2; margin-left: 10px">图片格式只能为jpg、jpeg、png，图片比例支持1:1（像素≥800*800）或3:4（像素≥750*1000），单个图片大小不超过5M。</span>
          </div>
        </div>
        <DropdownOfImage
          :limit="6"
          :account="sellerId"
          :img-group-list="imgGroupList"
          :parent-img-list="form.productImages"
          @submit="imgData => fillImgData(imgData, 'productImages')"
        >
          <a-button
            type="text"
            size="medium"
            >选择图片<i class="el-icon-arrow-down el-icon--right"></i
          ></a-button>
        </DropdownOfImage>
        <div class="product-image">
          <Draggable
            v-if="form.productImages.length"
            v-model="form.productImages"
            group="productImages"
            animation="200"
            class="image-list"
          >
            <div
              v-for="item in form.productImages"
              :key="item.url"
              class="image-list-item"
            >
              <a-image
                fit="contain"
                :ref="`image_${item.url}`"
                :src="item.url"
                :preview-src-list="form.productImages.map(item => item.url)"
                @load="getImageSize(item)"
              ></a-image>
              <div class="image-info">
                <span>{{ item.width }} x {{ item.height }}</span>
                <div>
                  <a-checkbox
                    v-model="item.checked"
                    style="margin-right: 8px"
                  ></a-checkbox>
                  <a-button
                    type="text"
                    size="medium"
                    icon="el-icon-delete"
                    @click="removeChosenImage(item.url, 'productImages')"
                  ></a-button>
                </div>
              </div>
            </div>
          </Draggable>
          <div
            v-else
            class="image-empty"
          >
            <a-empty description="暂无图片">
              <i
                class="el-icon-picture-outline empty-icon"
                slot="image"
              ></i>
            </a-empty>
          </div>
        </div>
      </a-form-item>
      <a-form-item
        label="营销图片："
        prop="marketImages"
      >
        <div>
          <a-tag
            type="success"
            effect="dark"
            >！说明</a-tag
          >
          <span style="color: #9fa0a2"> 1、图片格式只能为jpg、jpeg、png，图片比例支持1:1（像素≥800*800）或3:4（像素≥750*1000），单个图片大小不超过5M。 </span>
          <br />
          <span style="margin-left: 53px; color: #9fa0a2">2、6合1发布不支持设置营销图</span>
        </div>
        <div style="display: flex; align-items: flex-end">
          <div style="margin-right: 16px">
            <div
              v-if="form.marketImage1.length"
              class="image-list"
            >
              <div
                v-for="item in form.marketImage1"
                :key="item.url"
                class="image-list-item"
              >
                <a-image
                  fit="contain"
                  :ref="`image_${item.url}`"
                  :src="item.url"
                  :preview-src-list="form.marketImage1.map(item => item.url)"
                  @load="getImageSize(item)"
                ></a-image>
                <div class="image-info">
                  <span>{{ item.width }} x {{ item.height }}</span>
                  <a-button
                    type="text"
                    size="medium"
                    icon="el-icon-delete"
                    @click="removeChosenImage(item.url, 'marketImage1')"
                  ></a-button>
                </div>
              </div>
            </div>
            <DropdownOfImage
              v-else
              :account="sellerId"
              :img-group-list="imgGroupList"
              :parent-img-list="form.marketImage1"
              @submit="imgData => fillImgData(imgData, 'marketImage1')"
            >
              <div class="image-empty">
                <a-empty description="1:1 白底图">
                  <i
                    class="el-icon-picture-outline empty-icon"
                    slot="image"
                  ></i>
                </a-empty>
              </div>
            </DropdownOfImage>
          </div>
          <!-- 3:4 场景图 -->
          <div>
            <div
              v-if="form.marketImage2.length"
              class="image-list"
            >
              <div
                v-for="item in form.marketImage2"
                :key="item.url"
                class="image-list-item"
                style="height: 238px"
              >
                <a-image
                  fit="contain"
                  :ref="`image_${item.url}`"
                  :src="item.url"
                  :preview-src-list="form.marketImage2.map(item => item.url)"
                  @load="getImageSize(item)"
                ></a-image>
                <div class="image-info">
                  <span>{{ item.width }} x {{ item.height }}</span>
                  <a-button
                    type="text"
                    size="medium"
                    icon="el-icon-delete"
                    @click="removeChosenImage(item.url, 'marketImage2')"
                  ></a-button>
                </div>
              </div>
            </div>
            <DropdownOfImage
              v-else
              :account="sellerId"
              :img-group-list="imgGroupList"
              :parent-img-list="form.marketImage2"
              @submit="imgData => fillImgData(imgData, 'marketImage2')"
            >
              <div
                class="image-empty"
                style="height: 238px"
              >
                <a-empty
                  description="3:4 场景图"
                  style="padding-top: 66px"
                >
                  <i
                    class="el-icon-picture-outline empty-icon"
                    slot="image"
                  ></i>
                </a-empty>
              </div>
            </DropdownOfImage>
          </div>
          <a-button
            type="text"
            style="margin-left: 8px"
            :loading="generateMarketImageLoading"
            @click="generateMarketImage"
            >一键生成</a-button
          >
        </div>
      </a-form-item>
      <a-form-item
        label="产品视频："
        v-loading="uploadVideoLoading"
        element-loading-text="视频上传中，请稍等！"
      >
        <div>
          <a-tag
            type="success"
            effect="dark"
            >！说明</a-tag
          >
          <span style="color: #9fa0a2"> 最小尺寸：480x480像素。最大视频长度：60秒。最大文件大小：100M。支持的格式：mp4。新视频可能需要长达36小时才能获得批准 </span>
          <br />
          <span style="color: #9fa0a2"> 封面图尺寸：330px X 330px ~ 2000px X 2000px</span>
        </div>
        <!-- 视频 -->
        <div>
          <div
            v-if="form.video.mediaId"
            class="image-list"
          >
            <div class="image-list-item">
              <a-image
                fit="contain"
                :src="form.video.posterUrl"
              ></a-image>
              <div class="image-info">
                <span></span>
                <a-button
                  type="text"
                  size="medium"
                  icon="el-icon-delete"
                  @click="removeVideo"
                ></a-button>
              </div>
            </div>
          </div>
          <DropdownOfVideo
            v-else
            :seller-id="sellerId"
            @submit="fillVideoData"
          >
            <div class="image-empty">
              <a-empty description="视频">
                <i
                  class="el-icon-picture-outline empty-icon"
                  slot="image"
                ></i>
              </a-empty>
            </div>
          </DropdownOfVideo>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import DropdownOfImage from '@/components/OnlinePublish/AliExpressAssembly/DropdownOfImage'
  import DropdownOfVideo from '@/components/OnlinePublish/AliExpressAssembly/DropdownOfVideo'
  import Draggable from 'vuedraggable'
  import { videoQuota, listGroup, uploadImgFromNet } from '@/api/platformApi/aliexpress/media'
  import { cropImg, watermark, watermarkList } from '@/api/PlatformTemplate/watermarkTemplateApi'
  import { mapState } from 'vuex'

  export default {
    name: 'ImageInfo',
    // components: { DropdownOfImage, DropdownOfVideo, Draggable },
    data() {
      // 主图校验
      const validMainImages = (rule, images, callback) => {
        if (!images.length) {
          callback(new Error('请上传产品图片'))
        } else if (images.length > 6) {
          callback(new Error('最多上传 6 张图片'))
        } else {
          callback()
        }
      }
      // 营销图校验
      const validMarketImages = (rule, images, callback) => {
        if (!this.form.marketImage1.length || !this.form.marketImage2.length) {
          callback(new Error('请上传营销图片'))
        } else {
          callback()
        }
      }
      return {
        mediaBankInfo: {},
        watermarkOptions: [],
        watermarkId: '',
        form: {
          productImages: [],
          marketImage1: [], // 1:1 白底图
          marketImage2: [], // 3:4 场景图
          video: {}
        },
        rules: {
          productImages: { validator: validMainImages, required: true, trigger: 'change' },
          marketImages: { validator: validMarketImages, required: true, trigger: 'change' }
        },
        imgGroupList: [],
        cropWidth: 800,
        cropHeight: 800,
        imgEditLoading: false, // 编辑图片 loading; [修改尺寸, 添加水印]
        generateMarketImageLoading: false,
        uploadVideoLoading: false
      }
    },
    computed: {
      ...mapState('aliexpress', ['sellerId', 'productDetail']),
      usedSize() {
        return this.mediaBankInfo.useage ? (parseFloat(this.mediaBankInfo.useage) / 1024 / 1024 / 1024).toFixed(2) : '--'
      },
      capacitySize() {
        return this.mediaBankInfo.capicity ? (parseFloat(this.mediaBankInfo.capicity) / 1024 / 1024 / 1024).toFixed(2) : '--'
      },
      // 已选的产品图片
      checkedImgList() {
        return this.form.productImages.filter(item => item.checked)
      }
    },
    watch: {
      sellerId: {
        handler: function (sellerId) {
          if (!sellerId) return

          this.getMediaBankInfo()
          this.getImgGroup()
        },
        immediate: true
      },
      productDetail: function (detail) {
        if (Object.keys(detail).length === 0) return

        // 产品主图
        this.form.productImages = detail.multimedia.mainImageList.map(url => {
          return {
            url,
            width: 0,
            height: 0
          }
        })
        // 营销图 1:1
        const marketImage1 = detail.multimedia.marketImageList && detail.multimedia.marketImageList.find(item => item.imageType === 2)
        if (marketImage1) {
          this.form.marketImage1.push({
            url: marketImage1.url,
            width: 0,
            height: 0
          })
        }
        // 营销图 3:4
        const marketImage2 = detail.multimedia.marketImageList && detail.multimedia.marketImageList.find(item => item.imageType === 1)
        if (marketImage2) {
          this.form.marketImage2.push({
            url: marketImage2.url,
            width: 0,
            height: 0
          })
        }
        // 视频媒体
        if (detail.multimedia.videoList && detail.multimedia.videoList.length) {
          this.form.video = {
            mediaId: detail.multimedia.videoList[0]?.mediaId,
            mediaType: detail.multimedia.videoList[0]?.mediaType,
            posterUrl: detail.multimedia.videoList[0]?.posterUrl
          }
        }
      }
    },
    mounted() {
      this.getWatermark()
    },
    methods: {
      getMediaBankInfo() {
        this.mediaBankInfo = {}
        videoQuota({ sellerId: this.sellerId }).then(res => {
          if (res && res.code === 200) {
            this.mediaBankInfo = res.data.result || {}
          }
        })
      },
      getImgGroup() {
        listGroup({ sellerId: this.sellerId }).then(res => {
          if (res && res.code === 200) {
            this.imgGroupList = res.data.result.photoBankImageGroupList || []
          }
        })
      },
      // 获取图片尺寸信息
      getImageSize(item) {
        item.width = this.$refs[`image_${item.url}`][0].imageWidth
        item.height = this.$refs[`image_${item.url}`][0].imageHeight
      },
      getWatermark() {
        watermarkList().then(res => {
          this.watermarkOptions = res.data || []
        })
      },
      selectWaterMark() {
        if (this.checkedImgList.length === 0) {
          this.$alert('选择水印！', '错误提示', {
            confirmButtonText: '确定',
            message: '打水印前请选择需要打水印的文件！',
            type: 'error'
          })

          return
        }

        this.imgEditLoading = true
        // 存在本地服务的图片
        const imgLocalList = this.checkedImgList.filter(img => img.url.includes('/prod-api'))
        // 远端图片; 拿 url 先上传本地服务后再处理
        const imgRemoteList = this.checkedImgList.filter(img => !img.url.includes('/prod-api'))
        const promiseList = []
        if (imgLocalList.length) {
          const p1 = new Promise(resolve => {
            const imagePathList = imgLocalList.map(img => img.url.replace('/prod-api', ''))
            watermark({
              id: this.watermarkId,
              imagePathList
            })
              .then(res => {
                const list = res.data || []
                list.forEach(item => {
                  const i = this.form.productImages.findIndex(el => el.fileName === item.originalFilename)
                  if (i > -1) {
                    this.form.productImages[i].url = item.url
                    this.form.productImages[i].fileName = item.fileName.replace('/prod-api', '')
                  }
                })
              })
              .finally(() => {
                resolve()
              })
          })
          promiseList.push(p1)
        }
        // 如有远端图片
        if (imgRemoteList.length) {
          const p2 = new Promise(resolve => {
            const imgUrls = imgRemoteList.map(img => img.url).join(',')
            uploadImgFromNet({ imgUrls }).then(res => {
              const imagePathList = res.data.map(item => ({
                fileName: item.fileName, // 与图片 url 原名并不完全相等, 包含该字符串
                originalFilename: item.originalFilename,
                url: item.url
              }))
              watermark({
                id: this.watermarkId,
                imagePathList: imagePathList.map(item => item.url.replaceAll('#', '%23'))
              })
                .then(res => {
                  const list = res.data || []
                  list.forEach(item => {
                    // 遍历两层, 找到对应的原图片
                    const i1 = imagePathList.findIndex(el => el.fileName === item.originalFilename)
                    if (i1 > -1) {
                      const i2 = this.form.productImages.findIndex(el => {
                        const arr = el.url.split('/')
                        const elName = arr[arr.length - 1].split('.')[0]
                        return imagePathList[i1].originalFilename.includes(elName)
                      })
                      if (i2 > -1) {
                        this.form.productImages[i2].url = item.url
                        this.form.productImages[i2].fileName = item.fileName.replace('/prod-api', '')
                      }
                    }
                  })
                })
                .finally(() => {
                  resolve()
                })
            })
          })
          promiseList.push(p2)
        }

        Promise.all(promiseList).then(_ => {
          this.form.productImages.forEach(item => {
            this.$set(item, 'checked', false)
          })
          this.watermarkId = ''
          this.imgEditLoading = false
        })
      },
      handleCrop() {
        if (this.checkedImgList.length === 0) {
          this.$alert('修改尺寸图片！', '错误提示', {
            confirmButtonText: '确定',
            message: '请选择需要修改尺寸的图片！',
            type: 'error'
          })

          return
        }

        this.imgEditLoading = true
        // 存在本地服务的图片
        const imgLocalList = this.checkedImgList.filter(img => img.url.includes('/prod-api'))
        // 远端图片; 拿 url 先上传本地服务后再处理
        const imgRemoteList = this.checkedImgList.filter(img => !img.url.includes('/prod-api'))
        const promiseList = []
        if (imgLocalList.length) {
          const p1 = new Promise(resolve => {
            const imagePathList = imgLocalList.map(img => img.url.replace('/prod-api', ''))
            cropImg({
              newWidth: this.cropWidth,
              newHeight: this.cropHeight,
              imagePathList,
              isRatio: false
            })
              .then(res => {
                const list = res.data || []
                list.forEach(item => {
                  const i = this.form.productImages.findIndex(el => el.fileName === item.originalFilename)
                  if (i > -1) {
                    this.form.productImages[i].url = item.url
                    this.form.productImages[i].fileName = item.fileName.replace('/prod-api', '')
                  }
                })
              })
              .finally(() => {
                resolve()
              })
          })
          promiseList.push(p1)
        }
        // 如有远端图片
        if (imgRemoteList.length) {
          const p2 = new Promise(resolve => {
            const imgUrls = imgRemoteList.map(img => img.url).join(',')
            uploadImgFromNet({ imgUrls }).then(res => {
              const imagePathList = res.data.map(item => ({
                fileName: item.fileName, // 与图片 url 原名并不完全相等, 包含该字符串
                originalFilename: item.originalFilename,
                url: item.url
              }))
              cropImg({
                newWidth: this.cropWidth,
                newHeight: this.cropHeight,
                imagePathList: imagePathList.map(item => item.url.replaceAll('#', '%23')),
                isRatio: false
              })
                .then(res => {
                  const list = res.data || []
                  list.forEach(item => {
                    // 遍历两层, 找到对应的原图片
                    const i1 = imagePathList.findIndex(el => el.fileName === item.originalFilename)
                    if (i1 > -1) {
                      const i2 = this.form.productImages.findIndex(el => {
                        const arr = el.url.split('/')
                        const elName = arr[arr.length - 1].split('.')[0]
                        return imagePathList[i1].originalFilename.includes(elName)
                      })
                      if (i2 > -1) {
                        this.form.productImages[i2].url = item.url
                        this.form.productImages[i2].fileName = item.fileName.replace('/prod-api', '')
                      }
                    }
                  })
                })
                .finally(() => {
                  resolve()
                })
            })
          })
          promiseList.push(p2)
        }

        Promise.all(promiseList).then(_ => {
          this.form.productImages.forEach(item => {
            this.$set(item, 'checked', false)
          })
          this.cropWidth = 800
          this.cropHeight = 800
          this.imgEditLoading = false
        })
      },
      // 根据主题一键生成营销图片
      async generateMarketImage() {
        if (this.form.marketImage1.length !== 0 && this.form.marketImage2.length !== 0) {
          this.$message.warning('已有营销图, 无需生成')
          return
        }
        if (this.form.productImages.length === 0) {
          this.$message.warning('产品图片为空')
          return
        }

        if (this.form.marketImage1.length === 0) {
          this.form.marketImage1 = [this.form.productImages[0]]
        }
        if (this.form.marketImage2.length === 0) {
          // 按 3:4 比例计算处理后的图片尺寸
          let newWidth, newHeight
          const { width, height } = this.form.productImages[0]
          // 算宽高哪个更接近750 x 1000, 以更接近的那个端为准
          if (width / 750 < height / 1000) {
            // 以 width 为准
            if (width > 750) {
              newWidth = width
              newHeight = Math.ceil(width * (4 / 3))
            } else {
              newWidth = 750
              newHeight = 1000
            }
          } else {
            // 以 height 为准
            if (height > 1000) {
              newHeight = height
              newWidth = Math.ceil(height * (3 / 4))
            } else {
              newHeight = 1000
              newWidth = 750
            }
          }

          const imagePathList = []
          // 不带 /prod-api 的图片先上传再修改尺寸
          if (this.form.productImages[0].url.includes('/prod-api')) {
            imagePathList.push(this.form.productImages[0].url.replace('/prod-api', ''))
          } else {
            await uploadImgFromNet({ imgUrls: this.form.productImages[0].url }).then(res => {
              res.data.forEach(item => {
                imagePathList.push(item.url.replaceAll('#', '%23'))
              })
            })
          }
          cropImg({
            newWidth,
            newHeight,
            imagePathList,
            isRatio: false // 不按比例裁剪
          })
            .then(res => {
              const list = res.data || []
              this.form.marketImage2.push({
                url: list[0].url,
                fileName: list[0].fileName.replace('/prod-api', ''),
                width: 0,
                height: 0
              })
            })
            .finally(() => {
              this.generateMarketImageLoading = false
            })
        }
      },
      // 填充图片数据
      fillImgData(imgData, keyCode) {
        this.form[keyCode].push(...imgData)
      },
      // 填充视频数据
      fillVideoData(videoData) {
        this.form.video = videoData
      },
      removeChosenImage(url, keyCode) {
        this.form[keyCode] = this.form[keyCode].filter(item => item.url !== url)
      },
      removeVideo() {
        this.form.video = {}
      },
      // 向上级提交数据
      emitData({ isDraft = false }) {
        if (isDraft) {
          this.$refs.form.clearValidate()
        } else {
          let valid = true
          this.$refs.form.validate(val => (valid = val))
          if (!valid) return
        }

        // 产品图片; 主图; 多个url用分号[;]分隔
        const mainImageList = this.form.productImages.map(image => image.url.replace('/prod-api', ''))
        // 营销图片; imageType: 1-长图(3:4); 2-方图(1:1)
        const marketImageList = []
        this.form.marketImage1.length &&
          marketImageList.push({
            url: this.form.marketImage1[0].url.replace('/prod-api', ''),
            imageType: 2
          })
        this.form.marketImage2.length &&
          marketImageList.push({
            url: this.form.marketImage2[0].url.replace('/prod-api', ''),
            imageType: 1
          })
        // 产品视频; 只允许一个
        const videoList = []
        this.form.video.mediaId &&
          videoList.push({
            mediaId: this.form.video.mediaId,
            mediaType: this.form.video.mediaType,
            posterUrl: this.form.video.posterUrl
          })

        const multimedia = {
          mainImageList,
          marketImageList,
          videoList
        }

        return { multimedia }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .image-info {
    .image-list {
      display: flex;
      &-item {
        width: 178px;
        height: 178px;
        border-radius: 4px;
        margin-right: 16px;
        position: relative;
        overflow: hidden;
      }
      .image-info {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(5, 5, 5, 0.3);
        padding: 0 4px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        ::v-deep .el-icon-delete {
          color: #f56c6c;
        }
      }
    }
    .image-empty {
      width: 178px;
      height: 178px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      .empty-icon {
        color: #909399;
        font-size: 50px;
      }
    }

    .el-image {
      height: 100%;
      width: 100%;
    }
  }
</style>
