<!-- 来源产品详情 -->
<template>
  <div class="bg-#fff p-6 pb-2 text-left">
    <BaseInfo ref="baseInfoRef" />

    <SKUInfo ref="SKUInfoRef" />

    <ImageInfo ref="ImageInfoRef" />

    <!-- 底部按钮 -->
    <div class="text-right mt-4">
      <a-button @click="close">关闭</a-button>
    </div>

    <!-- 回到顶部 -->
    <a-back-top :target="targetFn" />
  </div>
</template>

<script setup>
  import BaseInfo from '@/pages/product-review/CommonDetail/components/BaseInfo.vue'
  import SKUInfo from '@/pages/product-review/CommonDetail/components/SKUInfo.vue'
  import ImageInfo from '@/pages/product-review/CommonDetail/components/ImageInfo.vue'

  import { getDetailApi } from '@/pages/product-review/CommonDetail/api'
  import { message } from 'ant-design-vue'

  const store = useProductReviewStore()
  const route = useRoute()

  /** 详情 */
  let detail = {}
  getDetail()
  function getDetail() {
    const id = route.query.intelligentProductId
    if (!id) {
      message.error('缺少详情id')
      return
    }

    getDetailApi(id).then(res => {
      detail = res.data || {}
      store.$patch(state => {
        state.detail = detail
      })
    })
  }

  function close() {
    window.close()
  }

  /** 返回需要监听其滚动事件的元素 */
  function targetFn() {
    return document.querySelector('.ant-layout-content')
  }
</script>
