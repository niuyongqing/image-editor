<!-- OZON 图片信息模块 -->
<template>
  <a-card
    title="图片信息"
    class="mt-5 mx-50"
  >
    <a-tag
      color="blue"
      class="h-fit"
      >说明</a-tag
    >
    <span>第一张图片默认为主图，点击图片拖动，即可调整图片顺序！</span>
    <div class="text-#999">
      单张不超过2M，只支持.jpg,.png,.jpeg格式；普通分类图片尺寸为200*200-4320*7680，服装、鞋靴和饰品类目-最低分辨率为900*1200，建议纵横比为3:4；服装、鞋靴和配饰类目，背景应为灰色(#f2f3f5)
    </div>

    <!-- 右上总览的操作按钮 -->
    <div class="text-right mb-6">
      <a-dropdown>
        <a-button
          type="link"
          :loading="addWaterMarkLoading"
          >批量加水印 <DownOutlined
        /></a-button>
        <template #overlay>
          <a-menu @click="addWaterMark">
            <a-menu-item
              v-for="waterMark in waterMarkOptions"
              :key="waterMark.id"
            >
              <div>
                <span>{{ waterMark.title }} </span>
                <a-image
                  v-if="waterMark.type === 1"
                  :src="waterMark.content"
                  :width="20"
                  :height="20"
                  class="ml-1"
                />
                <span
                  v-else
                  class="ml-1"
                  >({{ waterMark.content }})</span
                >
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <span class="mx-2">|</span>
      <a-dropdown>
        <a-button type="link">编辑图片 <DownOutlined /></a-button>
        <template #overlay>
          <a-menu @click="imgModifyMenuClick">
            <a-menu-item key="modifySize">批量改图片尺寸</a-menu-item>
            <a-menu-item key="translate">图片翻译</a-menu-item>
            <!-- <a-menu-item key="whiteBg">图片白底</a-menu-item> -->
          </a-menu>
        </template>
      </a-dropdown>
      <span class="mx-2">|</span>
      <a-button
        type="link"
        :loading="downloadLoading"
        @click="exportAllImage"
        >导出全部图片</a-button
      >
    </div>

    <div
      v-for="(SKU, i) in dataSource"
      :key="i"
    >
      <div class="flex justify-between my-4">
        <div>
          <a-dropdown>
            <a-button>选择图片 <DownOutlined /></a-button>
            <template #overlay>
              <a-menu @click="imgAddMenuClick($event, SKU)">
                <a-menu-item key="imgLocal">
                  <a-upload
                    :headers="headers"
                    :action="uploadImageUrl"
                    :show-upload-list="false"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    :before-upload="beforeUpload"
                    @change="handleUploadChange($event, SKU)"
                  >
                    本地图片
                  </a-upload>
                </a-menu-item>
                <a-menu-item key="imgBank">空间图片</a-menu-item>
                <a-menu-item key="imgFromNet">网络图片</a-menu-item>
                <a-menu-item key="imgQuote">引用采集图片</a-menu-item>
                <a-menu-item key="imgDataBase">引用资料库图片</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <div class="inline-block align-top ml-4">
            <div
              v-for="(key, i) in attrKeyList"
              :key="i"
            >
              {{ `${key}: ${SKU[key]}` }}
            </div>
          </div>
        </div>

        <div class="text-right">
          <span>【{{ SKU.imageUrl.length }}/{{ maxCount }}】图片 </span>
          <a-dropdown>
            <a-button
              type="link"
              :loading="addWaterMarkLoading"
              >批量加水印 <DownOutlined
            /></a-button>
            <template #overlay>
              <a-menu @click="addWaterMark($event, SKU)">
                <a-menu-item
                  v-for="waterMark in waterMarkOptions"
                  :key="waterMark.id"
                >
                  <div>
                    <span>{{ waterMark.title }} </span>
                    <a-image
                      v-if="waterMark.type === 1"
                      :src="waterMark.content"
                      :width="20"
                      :height="20"
                      class="ml-1"
                    />
                    <span
                      v-else
                      class="ml-1"
                      >({{ waterMark.content }})</span
                    >
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <span class="mx-2">|</span>
          <a-dropdown>
            <a-button type="link">编辑图片 <DownOutlined /></a-button>
            <template #overlay>
              <a-menu @click="imgModifyMenuClick($event, SKU)">
                <a-menu-item key="modifySize">批量改图片尺寸</a-menu-item>
                <a-menu-item key="translate">图片翻译</a-menu-item>
                <!-- <a-menu-item key="whiteBg">图片白底</a-menu-item> -->
              </a-menu>
            </template>
          </a-dropdown>
          <span class="mx-2">|</span>
          <a-dropdown>
            <a-button type="link">图片应用到 <DownOutlined /></a-button>
            <template #overlay>
              <a-menu @click="confirmMenuClick($event, SKU)">
                <a-menu-item
                  v-for="menuItem in confirmMenuList"
                  :key="menuItem.key"
                  >{{ menuItem.label }}</a-menu-item
                >
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

      <div class="min-h-40">
        <Draggable
          v-if="SKU.imageUrl.length"
          v-model="SKU.imageUrl"
          item-key="id"
          animation="200"
          class="flex flex-wrap"
        >
          <template #item="{ element: image }">
            <div class="mr-4 mb-4 relative h-fit border border-solid border-gray-200">
              <a-image
                :width="118"
                :height="118"
                class="object-contain"
                :src="processImageSource(image.url)"
              />
              <!-- size -->
              <div
                v-if="image.width"
                class="w-full text-white bg-gray/40 absolute bottom-6 left-0"
              >
                {{ image.width }} x {{ image.height }}
              </div>
              <!-- 图底操作面板 -->
              <div class="flex justify-between">
                <a-dropdown>
                  <a-button type="link"><BulbOutlined class="text-base" /><CaretDownOutlined /></a-button>
                  <template #overlay>
                    <a-menu @click="imgModifySingleMenuClick($event, image)">
                      <!-- <a-menu-item key="ps">小秘美图</a-menu-item> -->
                      <a-menu-item key="translate">图片翻译</a-menu-item>
                      <!-- <a-menu-item key="whiteBg">图片白底</a-menu-item> -->
                    </a-menu>
                  </template>
                </a-dropdown>

                <a-button
                  type="link"
                  title="删除"
                  ><DeleteOutlined
                    class="text-base"
                    @click="delImg(SKU, image.id)"
                /></a-button>
              </div>
            </div>
          </template>
        </Draggable>

        <a-empty
          v-else
          :image="simpleImage"
          class="w-20"
        />
      </div>
    </div>
  </a-card>

  <!-- 空间图片 -->
  <PictureLibrary
    v-model:modal-open="pictureLibraryOpen"
    platform="ozon"
    @imageListConfirm="pictureLibraryConfirm"
  />

  <!-- 网络图片弹窗 -->
  <NetImageModal
    ref="net_image_modal"
    @submit="handleNetImageSubmit"
  />

  <!-- 批量修改图片尺寸弹窗 -->
  <BacthSkuEditImg ref="batch_edit_img_size" />

  <!-- 图片翻译弹窗 -->
  <ImageTranslation
    ref="img_trans"
    @emitImages="handleEmitImages"
  />

  <!-- 引用采集图片 -->
  <AcquisitionImageModal
    v-model:modal-open="acquisitionModalOpen"
    :collect-product-id="collectProductId"
    @image-list-confirm="acquisitionModalConfirm"
  />

  <!-- 资料库图片弹窗 -->
  <databaseImageModal
    ref="databaseImageModalRef"
    @imageListConfirm="acquisitionModalConfirm"
  />

</template>

<script setup>
  import { DownOutlined, BulbOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import Draggable from 'vuedraggable'
  import { useAuthorization } from '~/composables/authorization'
  import { downloadAllImage } from '@/pages/sample/acquisitionEdit/js/api.js'
  import { batchUploadFromUrlApi } from '@/api/common/upload'
  import { watermarkApi } from '~/api/common/water-mark'
  import download from '~@/api/common/download'
  import { cloneDeep } from 'lodash'
  import { v4 as uuidv4 } from 'uuid'
  import PictureLibrary from '@/components/pictureLibrary/index.vue'
  import NetImageModal from '@/components/skuDragUpload/netImageModal.vue'
  import BacthSkuEditImg from '@/components/skuDragUpload/bacthSkuEditImg.vue'
  import ImageTranslation from '@/components/skuDragUpload/imageTranslation.vue'
  import AcquisitionImageModal from '@/pages/sample/acquisitionImageModal.vue'
  import databaseImageModal from '~@/components/productDatabase/databaseImageModal.vue'
  import { Empty, message } from 'ant-design-vue'
  import { processImageSource } from '~/pages/ozon/config/commJs/index'

  defineOptions({ name: 'ImageInfo' })
  const collectProductId = inject('collectProductId', '')

  const props = defineProps({
    dataSource: {
      type: Array,
      default: () => []
    },
    waterMarkOptions: {
      type: Array,
      default: () => []
    },
    attrList: {
      type: Array,
      default: () => []
    },
    maxCount: {
      type: Number,
      default: 30
    }
  })

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE // 空 占位图
  const headers = { Authorization: useAuthorization().value }
  const uploadImageUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/img'
const databaseImageModalRef = ref(null)

  watch(
    () => props.dataSource,
    () => {
      props.dataSource.forEach(item => {
        item.imageUrl.forEach(image => {
          getImgSize(image)
        })
      })
    }
  )

  // 全量图片信息
  const allImageInfo = computed(() => {
    const list = []
    props.dataSource.forEach(item => {
      item.imageUrl.forEach(image => {
        list.push(image)
      })
    })

    return list
  })

  // 变种属性名称列表
  const attrKeyList = computed(() => {
    return props.attrList.flat()
  })

  /** 批量加水印 */
  const addWaterMarkLoading = ref(false)
  function addWaterMark({ key }, SKU) {
    const imageInfoList = []
    if (SKU) {
      // 单 SKU 里
      imageInfoList.push(...SKU.imageUrl)
    } else {
      // 全量
      imageInfoList.push(...allImageInfo.value)
    }
    if (imageInfoList.length === 0) {
      message.warning('图片为空')

      return
    }

    addWaterMarkLoading.value = true
    // 存在本地服务的图片
    const imgLocalList = imageInfoList.filter(img => img.url.includes('/prod-api'))
    // 远端图片; 拿 url 先上传本地服务后再处理
    const imgRemoteList = imageInfoList.filter(img => !img.url.includes('/prod-api'))
    const promiseList = []
    if (imgLocalList.length) {
      const p1 = new Promise(resolve => {
        const imagePathList = imgLocalList.map(img => img.url.replace('/prod-api', ''))
        watermarkApi({
          id: key,
          imagePathList
        })
          .then(res => {
            const list = res.data || []
            for (const item of list) {
              loop: for (const SKU of props.dataSource) {
                for (const image of SKU.imageUrl) {
                  if (image.url === '/prod-api' + item.originalFilename) {
                    image.url = item.url
                    break loop
                  }
                }
              }
            }
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
        const imageList = imgRemoteList.map(img => img.url)
        batchUploadFromUrlApi({ imageList }).then(res => {
          const imagePathList = res.data.map(item => ({
            originalName: item.originalName,
            url: item.url
          }))
          watermarkApi({
            id: key,
            imagePathList: imagePathList.map(item => item.url)
          })
            .then(res => {
              const list = res.data || []
              // 遍历查找两层, 找到对应的原图片
              for (const img of imgRemoteList) {
                const originalName = img.url.split('/').at(-1)
                const target = imagePathList.find(item => item.originalName === originalName)
                if (target) {
                  const target2 = list.find(item => item.originalFilename === target.url)
                  if (target2) {
                    img.url = target2.url // 接口返回数据自带 '/prod-api'
                  }
                }
              }
            })
            .finally(() => {
              resolve()
            })
        })
      })
      promiseList.push(p2)
    }

    Promise.all(promiseList).then(_ => {
      addWaterMarkLoading.value = false
    })
  }

  /** 导出全部图片 */
  const downloadLoading = ref(false)
  function exportAllImage() {
    const imageList = allImageInfo.value.map(item => item.url.replace(import.meta.env.VITE_APP_BASE_API, ''))
    downloadLoading.value = true
    downloadAllImage({ imageList })
      .then(res => {
        download.name(res.data)
      })
      .finally(() => {
        downloadLoading.value = false
      })
  }

  /** 图片应用到 按钮 */
  const PERMANENT_LIST = [{ label: '所有变种', key: 'applyAll' }]
  const confirmMenuList = computed(() => {
    const variantAttrList = props.attrList.map(list => list.join('-')).map(name => ({ label: `同 ${name} 的变种`, key: name }))

    return [...PERMANENT_LIST, ...variantAttrList]
  })

  function confirmMenuClick({ key }, SKU) {
    // 图片不允许为空
    if (SKU.imageUrl.length === 0) {
      message.warning('变种图片不能为空')

      return
    }

    if (key === 'applyAll') {
      props.dataSource.forEach(item => {
        item.imageUrl = cloneDeep(SKU.imageUrl)
      })
    } else {
      const keyList = key.split('-')
      props.dataSource.forEach(item => {
        if (keyList.every(key => item[key] === SKU[key])) {
          item.imageUrl = cloneDeep(SKU.imageUrl)
        }
      })
    }
  }

  // 获取图片尺寸
  function getImgSize(item) {
    return new Promise(resolve => {
      const image = new Image()
      image.src = item.url
      image.onload = () => {
        item.width = image.width
        item.height = image.height
        resolve()
      }
    })
  }

  // 当前操作的 SKU
  const curSKU = ref({})
  /** 添加图片 */
  function imgAddMenuClick({ key }, SKU) {
    curSKU.value = SKU
    switch (key) {
      case 'imgBank':
        pictureLibraryOpen.value = true
        break
      case 'imgFromNet':
        netImageModalRef.value.open()
        break
      case 'imgQuote':
        acquisitionModalOpen.value = true
        break
      case 'imgDataBase':
        databaseImageModalRef.value.modalOpenFn(collectProductId.value)
        break
      default:
        break
    }
  }

  // 图片上传预处理
  function beforeUpload(file) {
    if (file.size / 1024 / 1024 > 5) {
      message.warning('文件过大, 上传失败')
      return false
    }
  }

  // 上传
  async function handleUploadChange({ file }, SKU) {
    if (file.status === 'done') {
      const res = file.response
      if (res.code === 200) {
        const imgInfo = {
          id: uuidv4(),
          url: import.meta.env.VITE_APP_BASE_API + res.url
        }
        await getImgSize(imgInfo)
        SKU.imageUrl.push(imgInfo)
      } else {
        message.warning(res.msg)
      }
    }
  }

  /** 引用采集图片 */
  const acquisitionModalOpen = ref(false)

  function acquisitionModalConfirm(list) {
    curSKU.value.imageUrl.push(...list)
  }

  /** 批量修改尺寸 */
  const bacthEditImgSizeRef = useTemplateRef('batch_edit_img_size')

  /** 编辑图片 */
  function imgModifyMenuClick({ key }, SKU) {
    const imageObjList = []
    if (SKU) {
      curSKU.value = SKU
      imageObjList.push(...SKU.imageUrl)
    } else {
      imageObjList.push(...allImageInfo.value)
    }
    switch (key) {
      case 'modifySize':
        bacthEditImgSizeRef.value.showModal(imageObjList)
        break
      case 'translate':
        translateImageList.value = imageObjList
        imgTransRef.value.showModal(imageObjList)
        break

      default:
        break
    }
  }

  // 编辑单张图片
  function imgModifySingleMenuClick({ key }, item) {
    switch (key) {
      case 'translate':
        translateImageList.value = [item]
        imgTransRef.value.showModal([item])
        break

      default:
        break
    }
  }

  // 删除单张按钮
  function delImg(SKU, id) {
    SKU.imageUrl = SKU.imageUrl.filter(image => image.id !== id)
  }

  /** 空间图片 */
  const pictureLibraryOpen = ref(false)
  function pictureLibraryConfirm(list) {
    const imageList = list.map(item => ({
      id: item.id,
      url: item.src,
      width: item.width,
      height: item.height
    }))
    curSKU.value.imageUrl.push(...imageList)
  }

  /** 网络图片 */
  const netImageModalRef = useTemplateRef('net_image_modal')
  function handleNetImageSubmit(list) {
    const imageList = list.map(item => ({
      id: uuidv4(),
      url: import.meta.env.VITE_APP_BASE_API + item.url
    }))
    imageList.forEach(async item => {
      await getImgSize(item)
      curSKU.value.imageUrl.push(item)
    })
  }

  /** 图片翻译 */
  const translateImageList = ref([]) // 翻译的图片列表
  const imgTransRef = useTemplateRef('img_trans')
  // 图片翻译回调
  function handleEmitImages(list) {
    list.forEach(item => {
      translateImageList.value.forEach(image => {
        if (image.url === item.oldUrl) {
          image.url = processImageSource(item.newUrl)
        }
      })
    })
  }
</script>
