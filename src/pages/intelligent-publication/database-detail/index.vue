<!-- 智能化刊登资料库详情页 -->
<template>
  <div class="bg-#fff p-6 text-left">
    <BaseInfo ref="baseInfoRef" />

    <SKUInfo ref="SKUInfoRef" />

    <ImageInfo ref="ImageInfoRef" />

    <!-- 底部按钮 -->
    <a-space class="float-right mt-10">
      <a-button @click="close">关闭</a-button>

      <a-popconfirm
        title="确定退回编辑吗?"
        @confirm="returnEdit"
      >
        <a-button type="primary">退回编辑</a-button>
      </a-popconfirm>
      <a-button
        type="primary"
        @click="publicationModalOpen = true"
        >刊登</a-button
      >
    </a-space>

    <!-- 刊登弹窗 -->
    <PublicationModal
      v-model:open="publicationModalOpen"
      :id="''"
      @refresh="refresh"
    />

    <!-- 回到顶部 -->
    <a-back-top :target="targetFn" />
  </div>
</template>

<script setup>
  import BaseInfo from '@/pages/product-review/CommonDetail/BaseInfo.vue'
  import SKUInfo from '@/pages/product-review/CommonDetail/SKUInfo.vue'
  import ImageInfo from '@/pages/product-review/CommonDetail/ImageInfo.vue'
  import PublicationModal from '../database/PublicationModal.vue'

  import { getDetailApi } from '@/pages/product-review/CommonDetail/api'
  import { message } from 'ant-design-vue'

  const store = useProductReviewStore()
  const route = useRoute()

  provide('databaseId', route.query.commodityId)

  const baseInfoRef = ref()
  const SKUInfoRef = ref()
  const imageInfoRef = ref()

  /** 详情 */
  let detail = {}
  getDetail()
  function getDetail() {
    const id = route.query.id
    if (!id) {
      message.error('缺少详情id')
      return
    }

    getDetailApi(id).then(res => {
      detail = res.data || {}
      store.$patch(state => {
        state.productDetail = detail
        state.dataType = 'edit'
      })
    })
  }

  function close() {
    window.close()
  }

  /** 退回编辑 */
  function returnEdit() {
    /* return new Promise(resolve => {
      const params = {}
      xxxApi(params).then(_ => {
        message.success('退回编辑成功')
      }).finally(() => {
        resolve()
      })
    }) */
  }

  /** 刊登 */
  const publicationModalOpen = ref(false)

  // 属性列表并关闭当前窗口
  function refresh() {
    setTimeout(() => {
      window.close()
    }, 1000)
    refreshList()
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
