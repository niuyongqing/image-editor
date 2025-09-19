<!-- 资料待编辑-详情页 -->
<template>
  <div class="text-left flex">
    <!-- LEFT -->
    <div
      class="flex-1 h-[calc(100vh-60px)] overflow-auto"
      style="scrollbar-width: thin"
    >
      <!-- <PreliminaryReviewDetail /> -->
    </div>
    <!-- RIGHT -->
    <div
      class="flex-1 h-[calc(100vh-60px)] overflow-auto"
      style="scrollbar-width: thin"
    >
      <CommonDetail />

      <!-- 底部按钮 -->
      <a-space class="float-right mt-5">
        <a-button>关闭</a-button>
        <a-button
          type="primary"
          @click="save"
          >保存</a-button
        >
        <a-button type="primary">申请拍照</a-button>
        <a-button type="primary">提交终审</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
  // import PreliminaryReviewDetail from '../preliminary-review-detail/index.vue'
  import CommonDetail from '@/pages/product-review/CommonDetail/index.vue'

  /** 底部按钮 */
  function save() {
    formRef.value
      .validate()
      .then(() => {
        console.log('cheng le')
      })
      .catch(err => {
        console.log('err', err)
      })
  }
</script>
