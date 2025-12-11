<!-- (图片)颜色样本 组件 -->
<template>
  <div class="text-left">
    <a-dropdown placement="rightTop">
      <slot>
        <div class="w-15 h-15">
          <div
            v-if="image"
            class="relative"
          >
            <a-spin :spinning="loading">
              <template #indicator>
                <LoadingOutlined />
              </template>

              <a-image
                :width="60"
                :height="60"
                class="object-contain"
                :src="processImageSource(image)"
              />

              <a-button
                type="link"
                title="删除"
                danger
                class="absolute -top-2.5 -right-4"
              >
                <CloseCircleOutlined
                  class="text-base"
                  @click="del"
                />
              </a-button>
            </a-spin>
          </div>

          <div
            v-else
            class="h-full text-center border border-dashed border-gray-300"
          >
            <PlusOutlined class="text-base mt-2" />
            <div class="text-xs">添加图片</div>
          </div>
        </div>
      </slot>

      <template #overlay>
        <a-menu
          v-if="!image"
          @click="handleCommand"
        >
          <a-menu-item key="1">
            <a-upload
              :headers="headers"
              :action="uploadImageUrl"
              :show-upload-list="false"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              @change="handleUploadChange"
            >
              本地图片
            </a-upload>
          </a-menu-item>
          <a-menu-item key="2">空间图片</a-menu-item>
          <a-menu-item key="3">网络图片</a-menu-item>
          <a-menu-item key="4">引用资料库图片</a-menu-item>
        </a-menu>

        <!-- 有图片后显示下面的 -->
        <a-menu
          v-else
          @click="handleCommand"
        >
          <a-menu-item disabled>更换图片</a-menu-item>
          <a-menu-item key="1">
            <a-upload
              :headers="headers"
              :action="uploadImageUrl"
              :show-upload-list="false"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              @change="handleUploadChange"
            >
              本地图片
            </a-upload>
          </a-menu-item>
          <a-menu-item key="2">空间图片</a-menu-item>
          <a-menu-item key="3">网络图片</a-menu-item>
          <a-menu-item key="4">引用资料库图片</a-menu-item>
          <a-menu-divider />
          <a-menu-item disabled>图片应用到</a-menu-item>
          <a-menu-item
            v-for="menuItem in applyMenuList"
            :key="menuItem.key"
          >{{ menuItem.label }}</a-menu-item>
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

    <!-- 批量修改图片尺寸弹窗 -->
    <BacthSkuEditImg ref="batch_edit_img_size" />

    <!-- 资料库图片弹窗 -->
    <databaseImageModal
      ref="databaseImageModalRef"
      @imageListConfirm="pushImage"
    />
  </div>
</template>

<script setup>
  import { PlusOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import { processImageSource } from '@/pages/ozon/config/commJs/index'
  import { useAuthorization } from '@/composables/authorization'
  import PictureLibrary from '@/components/pictureLibrary/index.vue'
  import NetImageModal from '@/components/skuDragUpload/netImageModal.vue'
  import BacthSkuEditImg from '@/components/skuDragUpload/bacthSkuEditImg.vue'
  import databaseImageModal from '@/components/productDatabase/databaseImageModal.vue'

  const props = defineProps({
    image: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits(['update:image', 'applyTo'])

  const databaseId = inject('databaseId', '') // 资料库 id

  const store = useProductReviewStore()
  const joinedAspectNameList = computed(() => store.joinedAspectNameList)
  /** 图片应用到 按钮 */
  const PERMANENT_LIST = [{ label: '所有变种', key: 'applyAll' }]
  const applyMenuList = computed(() => {
    const variantAttrList = joinedAspectNameList.value.map(name => ({ label: `同 ${name} 的变种`, key: name }))

    return [...PERMANENT_LIST, ...variantAttrList]
  })

  const headers = { Authorization: useAuthorization().value }
  const uploadImageUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/img'
  const databaseImageModalRef = ref(null) // 资料库图片弹窗 REF

  /** 本地图片 */
  // 图片上传预处理
  function beforeUpload(file) {
    if (file.size / 1024 / 1024 > 5) {
      message.warning('文件过大, 上传失败')
      return false
    }
  }

  // 上传
  function handleUploadChange({ file }) {
    if (file.status === 'done') {
      const res = file.response
      if (res.code === 200) {
        emit('update:image', res.url)
      } else {
        message.warning(res.msg)
      }
    }
  }

  /** 添加图片 */
  function handleCommand({ key }) {
    switch (key) {
      case '1':
        // 本地图片
        break
      case '2':
        // 空间图片
        pictureLibraryOpen.value = true
        break
      case '3':
        // 网络图片
        netImageModalRef.value.open()
        break
      case '4':
        // 引用资料库图片
        databaseImageModalRef.value.modalOpenFn(databaseId.value)
        break
      default:
        // 图片应用到
        emit('applyTo', { key })
        break
    }
  }

  /** 空间图片 */
  const pictureLibraryOpen = ref(false)
  function pictureLibraryConfirm(list) {
    emit('update:image', list[0].src)
  }

  /** 网络图片 */
  const netImageModalRef = useTemplateRef('net_image_modal')
  function handleNetImageSubmit(list) {
    emit('update:image', list[0].url)
  }

  /** 引用资料库图片 */
  function pushImage(list) {
    emit('update:image', list[0].url)
  }

  /** 删除图片 */
  function del() {
    emit('update:image', '')
  }
</script>
