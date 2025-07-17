<!-- 变种图片弹窗 -->
<template>
  <div>
    <a-modal
      :open="open"
      title="图片信息"
      width="45%"
      @cancel="cancel"
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

      <div class="flex justify-between my-4">
        <a-dropdown>
          <a-button>选择图片 <DownOutlined /></a-button>
          <template #overlay>
            <a-menu @click="imgAddMenuClick">
              <a-menu-item key="imgLocal">
                <a-upload
                  :headers="headers"
                  :action="uploadImageUrl"
                  :show-upload-list="false"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  :before-upload="beforeUpload"
                  @change="handleUploadChange"
                >
                  本地图片
                </a-upload>
              </a-menu-item>
              <a-menu-item key="imgBank">空间图片</a-menu-item>
              <a-menu-item key="imgFromNet">网络图片</a-menu-item>
              <!-- <a-menu-item key="imgQuote">引用采集图片</a-menu-item> -->
            </a-menu>
          </template>
        </a-dropdown>

        <a-dropdown>
          <a-button type="link"><FormOutlined /> 编辑图片 <DownOutlined /></a-button>
          <template #overlay>
            <a-menu @click="imgModifyMenuClick">
              <a-menu-item key="modifySize">批量改图片尺寸</a-menu-item>
              <a-menu-item key="translate">图片翻译</a-menu-item>
              <!-- <a-menu-item key="whiteBg">图片白底</a-menu-item> -->
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <div class="min-h-40">
        <Draggable
          v-model="variantImages"
          item-key="id"
          group="variantImages"
          animation="200"
          class="flex flex-wrap"
        >
          <template #item="{ element: item }">
            <div class="mr-4 mb-4 relative h-fit border border-solid border-gray-200">
              <a-image
                :width="118"
                :height="118"
                :src="item.url"
              />
              <!-- size -->
              <div
                v-if="item.width"
                class="w-full text-white bg-gray/40 absolute bottom-6 left-0"
              >
                {{ item.width }} x {{ item.height }}
              </div>
              <!-- 图底操作面板 -->
              <div class="flex justify-between">
                <a-dropdown>
                  <a-button type="link"><BulbOutlined class="text-base" /><CaretDownOutlined /></a-button>
                  <template #overlay>
                    <a-menu @click="imgModifySingleMenuClick">
                      <a-menu-item key="ps">小秘美图</a-menu-item>
                      <a-menu-item key="translate">图片翻译</a-menu-item>
                      <a-menu-item key="whiteBg">图片白底</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>

                <a-button
                  type="link"
                  title="删除"
                  ><DeleteOutlined
                    class="text-base"
                    @click="delImg(item.id)"
                /></a-button>
              </div>
            </div>
          </template>
        </Draggable>
      </div>

      <template #footer>
        <a-button
          class="mr-2"
          @click="cancel"
          >取消</a-button
        >
        <a-dropdown>
          <a-button type="primary">确定 <DownOutlined /></a-button>
          <template #overlay>
            <a-menu @click="confirmMenuClick">
              <a-menu-item
                v-for="item in confirmMenuList"
                :key="item.key"
                >{{ item.label }}</a-menu-item
              >
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-modal>

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
      @singleSubmit="handleSingleSubmit"
      @multiSubmit="handleMultiSubmit"
    />
  </div>
</template>

<script setup>
  import { FormOutlined, DownOutlined, BulbOutlined, CaretDownOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import Draggable from 'vuedraggable'
  import { useAuthorization } from '~/composables/authorization'
  import { cloneDeep } from 'lodash'
  import { v4 as uuidv4 } from 'uuid'
  import PictureLibrary from '@/components/pictureLibrary/index.vue'
  import NetImageModal from '@/components/skuDragUpload/netImageModal.vue'
  import BacthSkuEditImg from '@/components/skuDragUpload/bacthSkuEditImg.vue'
  import ImageTranslation from '@/components/skuDragUpload/imageTranslation.vue'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    rawVariantImages: {
      type: Array,
      default: () => []
    },
    cookedAttrNameList: {
      type: Array,
      default: () => []
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  const headers = { Authorization: useAuthorization().value }
  const uploadImageUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/img'
  const variantImages = ref([])

  watch(
    () => props.open,
    open => {
      if (!open || !props.rawVariantImages.length) return

      variantImages.value = cloneDeep(props.rawVariantImages).map(url => ({ id: uuidv4(), url }))
      variantImages.value.forEach(item => {
        getImgSize(item)
      })
    }
  )

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

  /** 添加图片 */
  function imgAddMenuClick({ key }) {
    console.log(key)
    switch (key) {
      case 'imgBank':
        pictureLibraryOpen.value = true
        break
      case 'imgFromNet':
        netImageModalRef.value.open()
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
  async function handleUploadChange({ file }) {
    if (file.status === 'done') {
      const res = file.response
      if (res.code === 200) {
        const imgInfo = {
          id: uuidv4(),
          url: res.url
        }
        await getImgSize(imgInfo)
        variantImages.value.push(imgInfo)
      } else {
        message.warning(res.msg)
      }
    }
  }

  /** 编辑图片 */
  function imgModifyMenuClick({ key }) {
    switch (key) {
      case 'modifySize':
        bacthEditImgSizeRef.value.showModal(variantImages.value)
        break
      case 'translate':
        imgTransRef.value.showModal(variantImages.value)
        break

      default:
        break
    }
  }

  // 编辑单张图片
  function imgModifySingleMenuClick({ key }) {
    console.log(key)
  }

  // 删除单张按钮
  function delImg(id) {
    variantImages.value = variantImages.value.filter(item => item.id !== id)
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
    variantImages.value.push(...imageList)
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
      variantImages.value.push(item)
    })
  }

  /** 批量修改尺寸 */
  const bacthEditImgSizeRef = useTemplateRef('batch_edit_img_size')

  /** 图片翻译 */
  const imgTransRef = useTemplateRef('img_trans')
  // 单张图片翻译
  function handleSingleSubmit(checkedImg) {
    variantImages.value.forEach(item => {
      if (item.url === checkedImg.oldUrl) {
        item.url = checkedImg.newUrl
      }
    })
  }

  // 多张图片翻译
  function handleMultiSubmit(checkedImgs) {
    variantImages.value.forEach(item => {
      checkedImgs.forEach(item => {
        if (item.url === item.oldUrl) {
          item.url = item.newUrl
        }
      })
    })
  }

  /** 弹窗底部按钮 */
  const PERMANENT_LIST = [
    { label: '应用到全部', key: 'applyAll' },
    { label: '应用到当前变种', key: 'applySelf' }
  ]
  const confirmMenuList = computed(() => {
    const cookedAttrNameList = props.cookedAttrNameList.map(name => ({ label: `应用到相同 ${name} 的变种`, key: name }))

    return [...PERMANENT_LIST, ...cookedAttrNameList]
  })

  function cancel() {
    emits('update:open', false)
  }

  function confirmMenuClick({ key }) {
    // 图片不允许为空
    const params = {
      confirmKey: key,
      variantImages: variantImages.value
    }

    emits('ok', params)
    cancel()
  }
</script>
