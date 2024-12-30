<template>
<div id="activeProduct">
  <a-button @click="toAdd" type="primary">新增 Button</a-button>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
defineOptions({
  name: "activeProduct"
})
const router = useRouter()
const toAdd = () => {
  // router.push('/amazon/activeProduct/add')
  window.open('/platform/amazon/activeProduct/add')
}
</script>
<style lang="less" scoped>

</style>