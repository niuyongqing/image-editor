<template>
  <process-pictures :img-url="imgUrl" @save="save"></process-pictures>
</template>
<script setup lang="js">
import {ref} from 'vue'
import ProcessPictures from "~/components/process-pictures/index.vue";
const imgUrl = ref("https://www.xzerp.com/prod-api/profile/upload/2024/11/27/A6908A0%20%E9%9A%8F%E6%9C%BA%20%E4%B8%80%E4%B8%AA%E4%B8%80%E5%8D%96-PT_20241127160307A092.jpg")
function save(url) {
  console.log(url)
}
</script>



<style scoped lang="less">

</style>