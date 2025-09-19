<!-- 公共的详情页, 基于 Ozon 产品详情页 -->
<template>
  <div class="bg-#fff p-6">
    <BaseInfo />

    <SKUInfo />

    <ImageInfo />
  </div>
</template>

<script setup>
  import BaseInfo from './BaseInfo.vue'
  import SKUInfo from './SKUInfo.vue'
  import ImageInfo from './ImageInfo.vue'
</script>