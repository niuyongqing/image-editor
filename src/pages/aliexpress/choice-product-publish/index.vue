<!-- 全托管刊登页 -->
<template>
  <div class="choice-product-publish text-left">
    <BaseInfo ref="baseInfoRef" />
    <ImageInfo ref="imageInfoRef" />
  </div>
</template>

<script setup lang='js'>
  import BaseInfo from './components/BaseInfo.vue'
  import ImageInfo from './components/ImageInfo.vue'

  const baseInfoRef = ref()
  const imageInfoRef = ref()
</script>