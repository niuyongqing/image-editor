<!-- OZON 图片信息模块 -->
<template>
  <a-card
    title="图片信息"
    class="mt-5"
    :loading="loading"
  >
    <!-- <a-tag
      color="blue"
      class="h-fit"
      >说明</a-tag
    >
    <span>第一张图片默认为主图，点击图片拖动，即可调整图片顺序！</span>
    <div class="text-#999">
      单张不超过2M，只支持.jpg,.png,.jpeg格式；普通分类图片尺寸为200*200-4320*7680，服装、鞋靴和饰品类目-最低分辨率为900*1200，建议纵横比为3:4；服装、鞋靴和配饰类目，背景应为灰色(#f2f3f5)
    </div> -->

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
      <!-- <span class="mx-2">|</span>
      <a-button
        type="link"
        :loading="downloadLoading"
        @click="exportAllImage"
        >导出全部图片</a-button
      > -->
    </div>

    <a-card
      v-for="(SKU, i) in dataSource"
      :key="i"
    >
      <div class="inline-block align-top ml-4">
        <div
          v-for="(key, i) in attrKeyList"
          :key="i"
        >
          {{ `${key}: ${SKU[key] ? SKU[key] : '--'}` }}
        </div>
      </div>

      <div>
        <a-card>
          <div class="flex justify-between my-4">
            <div>
              <span class="mr-4">主图</span>
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
                    <!-- <a-menu-item key="imgQuote">引用采集图片</a-menu-item> -->
                    <a-menu-item key="imgDataBase">引用资料库图片</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
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
          <!-- 图片列表 -->
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
                          <a-menu-item key="ps">在线p图</a-menu-item>
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
        </a-card>
      </div>

      <a-divider />

      <div>
        <a-card>
          <div class="flex justify-between my-4">
            <div>
              <span class="mr-4">副图</span>
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
                    <!-- <a-menu-item key="imgQuote">引用采集图片</a-menu-item> -->
                    <a-menu-item key="imgDataBase">引用资料库图片</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
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
          <!-- 图片列表 -->
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
                          <a-menu-item key="ps">在线p图</a-menu-item>
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
        </a-card>
      </div>
    </a-card>
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
  <!-- <AcquisitionImageModal
    v-model:modal-open="acquisitionModalOpen"
    :collect-product-id="collectProductId"
    @image-list-confirm="pushImage"
  /> -->

  <!-- 资料库图片弹窗 -->
  <databaseImageModal
    ref="databaseImageModalRef"
    @imageListConfirm="pushImage"
  />
</template>

<script setup>
  import { DownOutlined, BulbOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import Draggable from 'vuedraggable'
  import { useAuthorization } from '@/composables/authorization'
  import { downloadAllImage, MtImageEBaseUrl } from '@/pages/sample/acquisitionEdit/js/api.js'
  import { batchUploadFromUrlApi } from '@/api/common/upload'
  import { watermarkApi } from '@/api/common/water-mark'
  import download from '@/api/common/download'
  import { cloneDeep } from 'lodash'
  import { v4 as uuidv4 } from 'uuid'
  import { encryptString } from '@/utils/tools.js'
  import PictureLibrary from '@/components/pictureLibrary/index.vue'
  import NetImageModal from '@/components/skuDragUpload/netImageModal.vue'
  import BacthSkuEditImg from '@/components/skuDragUpload/bacthSkuEditImg.vue'
  import ImageTranslation from '@/components/skuDragUpload/imageTranslation.vue'
  // import AcquisitionImageModal from '@/pages/sample/acquisitionImageModal.vue'
  import databaseImageModal from '@/components/productDatabase/databaseImageModal.vue'
  import { Empty, message } from 'ant-design-vue'
  import { processImageSource } from '@/pages/ozon/config/commJs/index'

  defineOptions({ name: 'ImageInfo' })
  const collectProductId = inject('collectProductId', '')
  const databaseId = inject('databaseId', '') // 资料库 id

  const store = useProductReviewStore()
  const loading = computed(() => store.loading)
  const waterMarkOptions = computed(() => store.waterMarkOptions)
  const dataSource = computed(() => store.SKUTableData)
  const attrList = computed(() => store.attrList)

  const props = defineProps({
    maxCount: {
      type: Number,
      default: 30
    }
  })

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE // 空 占位图
  const headers = { Authorization: useAuthorization().value }
  const uploadImageUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/img'
  const databaseImageModalRef = ref(null) // 资料库图片弹窗 REF

  watch(
    () => dataSource.value,
    data => {
      data.forEach(item => {
        item.imageUrl.forEach(image => {
          getImgSize(image)
        })
      })
    }
  )

  const router = useRouter()
  // 全量图片信息
  const allImageInfo = computed(() => {
    const list = []
    dataSource.value.forEach(item => {
      item.imageUrl.forEach(image => {
        list.push(image)
      })
    })

    return list
  })

  // 变种属性名称列表
  const attrKeyList = computed(() => {
    return attrList.value.flat()
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
              loop: for (const SKU of dataSource.value) {
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
    const variantAttrList = attrList.value.map(list => list.join('-')).map(name => ({ label: `同 ${name} 的变种`, key: name }))

    return [...PERMANENT_LIST, ...variantAttrList]
  })

  function confirmMenuClick({ key }, SKU) {
    // 图片不允许为空
    if (SKU.imageUrl.length === 0) {
      message.warning('变种图片不能为空')
      return
    }

    if (key === 'applyAll') {
      dataSource.value.forEach(item => {
        item.imageUrl = cloneDeep(SKU.imageUrl)
      })
    } else {
      const keyList = key.split('-')
      dataSource.value.forEach(item => {
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
        databaseImageModalRef.value.modalOpenFn(databaseId.value)
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

  // 添加进图片, 引用采集和资料库共用
  function pushImage(list) {
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

  const mtImageEBaseUrl = ref('')
  // 美图设计室回传图片数据
  const channel = new BroadcastChannel('mtImageEditor')
  channel.onmessage = event => {
    // console.log('接收到美图设计室回传图片数据:', event.data);

    // 数据有效性检查
    if (!event.data || !event.data.base64) {
      console.error('美图设计室回传数据不完整或无效')
      message.error('图片数据处理失败，请重试')
      return
    }

    MtImageEBaseUrl({ imageData: event.data.base64 })
      .then(res => {
        // console.log('上传处理结果:', res);

        if (res.code === 200 && res.msg) {
          mtImageEBaseUrl.value = res.msg

          // 确保recordId为字符串类型
          let recordId = event.data.recordId
          if (recordId !== undefined && recordId !== null) {
            recordId = String(recordId)
          }

          // 更新对应ID的图片数据，同时保存编辑记录ID用于二次编辑
          if (event.data.imageId) {
            updateImageById(event.data.imageId, mtImageEBaseUrl, recordId)
          }
        } else {
          console.error('图片上传处理失败:', res)
          message.error(res.msg || '图片处理失败，请重试')
        }
      })
      .catch(error => {
        console.error('美图设计室图片处理异常:', error)
        message.error('图片处理过程中发生错误')
      })
  }

  // 根据图片ID更新组件内的图片数据
  function updateImageById(imageId, newImageUrl, recordId) {
    // 遍历所有SKU的图片列表
    for (const SKU of dataSource.value) {
      const targetImage = SKU.imageUrl.find(img => img.id === imageId)
      if (targetImage) {
        // 更新目标图片URL - 确保使用ref.value获取实际URL值
        targetImage.url = newImageUrl.value

        // 确保imageList字段存在
        if (!SKU.imageList) {
          SKU.imageList = []
        }

        // 保存编辑记录ID，用于二次编辑
        if (recordId) {
          // 根据recordId找出当前的图片对象，如果找到就替换当前图片对象中的url，如果没找到就直接将追加一个新对象
          const index = SKU.imageList.findIndex(item => item.recordId === recordId)
          if (index !== -1) {
            SKU.imageList[index].image = targetImage.url
          } else {
            SKU.imageList.push({
              recordId: recordId,
              image: targetImage.url
            })
          }
        }

        // 将props.dataSource数据存储到本地缓存中
        // localStorage.setItem(props.imageKey, JSON.stringify(props.dataSource))

        // 重新获取图片尺寸
        getImgSize(targetImage)
        message.success('图片修改成功！')
        break
      }
    }
  }

  // 组件卸载时关闭 BroadcastChannel 避免内存泄漏
  onUnmounted(() => {
    channel.close()
  })

  // 编辑单张图片
  function imgModifySingleMenuClick({ key }, item) {
    switch (key) {
      case 'translate':
        translateImageList.value = [item]
        imgTransRef.value.showModal([item])
        break
      case 'ps':
        // 调用findRecordIdByUrl函数
        const foundRecordId = findRecordIdByUrl(item.url)
        const urlData = router.resolve({
          path: '/platform/ozon/editPsImage',
          query: { imageUrl: item.url, imageId: item.id, recordId: foundRecordId }
        })
        // 对整个URL进行加密
        try {
          const encryptedUrl = encryptString(urlData.href)
          window.open(`/platform/ozon/editPsImage?encryptedData=${encodeURIComponent(encryptedUrl)}`, '_blank')
        } catch (error) {
          console.error('URL加密失败:', error)
          // 加密失败时使用原始URL作为备用方案
          window.open(urlData.href, '_blank')
        }
        break
      default:
        break
    }
  }

  // 根据url找到对应的recordId，先将url和imageList中的image都去掉'/prod-api'前缀后再进行对比
  function findRecordIdByUrl(url) {
    if (!url || !dataSource.value) return ''

    // 标准化URL：移除'/prod-api'前缀
    const urlWithoutProdApi = url.startsWith('/prod-api') ? url.replace('/prod-api', '') : url

    // 提取URL匹配逻辑为辅助函数，提高代码复用性
    const isUrlMatch = imageUrl => {
      const imageUrlWithoutProdApi = imageUrl?.startsWith('/prod-api') ? imageUrl.replace('/prod-api', '') : imageUrl
      return imageUrlWithoutProdApi === urlWithoutProdApi
    }

    // 使用扁平化查找方式，直接找到匹配的图片项
    for (const SKU of dataSource.value) {
      if (SKU?.imageList && SKU.imageList.length > 0) {
        const matchedImage = SKU.imageList.find(img => isUrlMatch(img.image))
        if (matchedImage?.recordId) {
          return matchedImage.recordId
        }
      }
    }

    return ''
  }

  // 删除单张按钮
  function delImg(SKU, id) {
    // 先保存要删除的图片URL
    const targetImage = SKU.imageUrl.find(image => image.id === id)
    const currentUrl = targetImage?.url

    // 根据保存的URL删除imageList中对应项
    if (currentUrl && SKU.imageList) {
      // 找出当前url在imageList中的索引
      const index = SKU.imageList.findIndex(item => item.image === currentUrl)
      if (index !== -1) {
        // 删除当前索引项
        SKU.imageList.splice(index, 1)
      }
    }

    // 过滤掉要删除的图片
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
