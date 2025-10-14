<!-- 资料待编辑-详情页 -->
<template>
  <div class="text-left flex">
    <!-- LEFT -->
    <div
      class="flex-1 h-[calc(100vh-60px)] overflow-auto"
      style="scrollbar-width: thin"
    >
      <PreliminaryReviewDetail />
    </div>
    <!-- RIGHT -->
    <div
      class="flex-1 h-[calc(100vh-60px)] overflow-auto"
      style="scrollbar-width: thin"
    >
      <CommonDetail ref="commonDetailRef" />
    </div>
  </div>
</template>

<script setup>
  import PreliminaryReviewDetail from '../preliminary-review-detail/index.vue'
  import CommonDetail from '@/pages/product-review/CommonDetail/index.vue'
</script>
