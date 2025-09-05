<template>
  <!-- 下拉选择图片上传方式的组件 -->
  <div class="dropdown-of-image">
    <a-dropdown>
      <slot></slot>
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
          <a-menu-item key="imgQuote">引用采集图片</a-menu-item>
          <a-menu-item key="imgDataBase">引用资料库图片</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

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

    <!-- 引用采集图片 -->
    <AcquisitionImageModal
      v-model:modal-open="acquisitionModalOpen"
      :collect-product-id="collectProductId"
      @image-list-confirm="acquisitionModalConfirm"
    />

    <!-- 资料库图片弹窗 -->
    <DatabaseImageModal
      ref="databaseImageModalRef"
      @imageListConfirm="acquisitionModalConfirm"
    />
  </div>
</template>

<script setup>
  import { useAuthorization } from '~/composables/authorization'
  import { batchUploadFromUrlApi } from '@/api/common/upload'
  import { v4 as uuidv4 } from 'uuid'
  import PictureLibrary from '@/components/pictureLibrary/index.vue'
  import NetImageModal from '@/components/skuDragUpload/netImageModal.vue'
  import AcquisitionImageModal from '@/pages/sample/acquisitionImageModal.vue'
  import DatabaseImageModal from '~@/components/productDatabase/databaseImageModal.vue'
  import { Empty, message } from 'ant-design-vue'
  import { processImageSource } from '~/pages/ozon/config/commJs/index'

  defineOptions({ name: 'DropdownOfImage' })
  const collectProductId = inject('collectProductId', '')
  const databaseId = inject('databaseId', '') // 资料库 id

  // const props = defineProps({})
  const emits = defineEmits(['emitImages'])

  const headers = { Authorization: useAuthorization().value }
  const uploadImageUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/img'
  const databaseImageModalRef = ref(null) // 资料库图片弹窗 REF

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
  async function handleUploadChange({ file }) {
    if (file.status === 'done') {
      const res = file.response
      if (res.code === 200) {
        const imgInfo = {
          id: uuidv4(),
          url: import.meta.env.VITE_APP_BASE_API + res.url
        }
        await getImgSize(imgInfo)
        emits('emitImages', [imgInfo])
      } else {
        message.warning(res.msg)
      }
    }
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
    emits('emitImages', imageList)
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
      emits('emitImages', [item])
    })
  }

  /** 引用采集图片 */
  const acquisitionModalOpen = ref(false)

  function acquisitionModalConfirm(list) {
    list.forEach(img => {
      img.url = processImageSource(img.url)
    })
    emits('emitImages', list)
  }
</script>
