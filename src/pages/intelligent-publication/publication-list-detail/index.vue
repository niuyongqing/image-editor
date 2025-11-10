<!-- 刊登序列详情 公共的详情页 -->
<template>
  <div class="bg-#fff p-6 text-left">
    <BaseInfo ref="baseInfoRef" />

    <SKUInfo ref="SKUInfoRef" />

    <ImageInfo
      ref="ImageInfoRef"
      :main-images-count-min="1"
    />

    <!-- 底部按钮 -->
    <a-space class="float-right mt-10">
      <a-button @click="close">关闭</a-button>

      <a-button
        v-if="showSaveBtn"
        type="primary"
        :loading="saveLoading"
        @click="save()"
        >保存</a-button
      >
      <a-button
        v-if="showSaveBtn"
        type="primary"
        :loading="saveLoading"
        @click="saveThenPublish"
        >保存并刊登</a-button
      >
    </a-space>

    <!-- 回到顶部 -->
    <a-back-top :target="targetFn" />
  </div>
</template>

<script setup>
  import BaseInfo from './components/BaseInfo.vue'
  import SKUInfo from './components/SKUInfo.vue'
  import ImageInfo from '@/pages/product-review/CommonDetail/components/ImageInfo.vue'

  import { detailApi, updateProductDetailApi, submitToPublishApi } from '../js/publication-list-api'
  import { message } from 'ant-design-vue'
  import { checkPermi, checkRole } from '~/utils/permission/component/permission.js'

  const store = useProductReviewStore()
  const route = useRoute()
  const commodityId = ref('')
  provide('databaseId', commodityId)

  // 权限校验
  // 是否为资料待编辑详情
  // const hasPermi = computed(() => checkPermi(['platform:ozon:intelligent:first:audit']) || checkRole('admin'))

  const baseInfoRef = ref()
  const SKUInfoRef = ref()
  const imageInfoRef = ref()

  /** 详情 */
  const showSaveBtn = ref(false)
  let detail = {}
  getDetail()
  function getDetail() {
    const id = route.query.waitPublishProductId
    if (!id) {
      message.error('缺少详情id')
      return
    }

    detailApi(id).then(res => {
      detail = res.data || {}
      showSaveBtn.value = [10, 40].includes(detail.publishStatus)
      commodityId.value = detail.commodityId
      store.$patch(state => {
        state.detail = detail
      })
    })
  }

  function close() {
    window.close()
  }

  /** 保存 */
  const saveLoading = ref(false)
  async function save(skipClose = false) {
    return new Promise(async (resolve, reject) => {
      // 获取数据
      const baseInfo = await baseInfoRef.value.emitData()
      const skuList = SKUInfoRef.value.emitData()
      if (!baseInfo || !skuList) {
        reject('校验不通过')
        return
      }

      const params = {
        productId: route.query.waitPublishProductId,
        ...baseInfo,
        mainImage: skuList[0].mainImages[0],
        subImage: skuList[0].subImages[0],
        skuList
      }

      saveLoading.value = true
      updateProductDetailApi(params)
        .then(res => {
          message.success('保存成功')

          refreshList()

          !skipClose &&
            setTimeout(() => {
              window.close()
            }, 1000)

          resolve()
        })
        .catch(err => {
          reject(err)
        })
        .finally(() => {
          saveLoading.value = false
        })
    })
  }

  /** 保存并刊登 */
  function saveThenPublish() {
    saveLoading.value = true
    save(true).then(() => {
      submitToPublishApi(route.query.waitPublishProductId)
        .then(res => {
          message.success('保存并刊登成功')

          refreshList()

          setTimeout(() => {
            window.close()
          }, 1000)
        })
        .finally(() => {
          saveLoading.value = false
        })
    })
  }

  /** 窗口通信, 刷新列表页 */
  const targetWindow = window.opener
  function refreshList() {
    if (targetWindow) {
      targetWindow.postMessage('refresh', targetWindow.location.origin)
    }
  }

  /** 返回需要监听其滚动事件的元素 */
  function targetFn() {
    return document.querySelector('.ant-layout-content')
  }
</script>
