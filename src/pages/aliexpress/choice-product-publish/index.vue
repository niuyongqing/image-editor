<!-- 全托管刊登页 -->
<template>
  <div class="choice-product-publish text-left">
    <BaseInfo ref="baseInfoRef" />
    <ImageInfo ref="imageInfoRef" />
    <SKUInfo ref="SKUInfoRef" />
    <ChoiceInfo ref="choiceInfoRef" />
    <Description ref="description" />
  </div>
</template>

<script setup lang='js'>
  import BaseInfo from './components/BaseInfo.vue'
  import ImageInfo from './components/ImageInfo.vue'
  import SKUInfo from './components/SKUInfo.vue'
  import ChoiceInfo from './components/ChoiceInfo.vue'
  import Description from './components/Description.vue'

  const baseInfoRef = ref()
  const imageInfoRef = ref()
  const SKUInfoRef = ref()
  const choiceInfoRef = ref()
  const description = ref()
</script>