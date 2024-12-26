<!-- 全托管刊登页 -->
<template>
  <div class="choice-product-publish text-left">
    <BaseInfo ref="baseInfoRef" />
    <ImageInfo ref="imageInfoRef" />
    <SKUInfo ref="SKUInfoRef" />
    <ChoiceInfo ref="choiceInfoRef" />
  </div>
</template>

<script setup lang='js'>
  import BaseInfo from './components/BaseInfo.vue'
  import ImageInfo from './components/ImageInfo.vue'
  import SKUInfo from './components/SKUInfo.vue'
  import ChoiceInfo from './components/ChoiceInfo.vue'

  const baseInfoRef = ref()
  const imageInfoRef = ref()
  const SKUInfoRef = ref()
  const choiceInfoRef = ref()
</script>