<template>
  <process-pictures :img-url="imgUrl" @save="save"></process-pictures>
</template>
<script setup lang="js">
import {ref} from 'vue'
import ProcessPictures from "~/components/process-pictures/index.vue";
const imgUrl = ref("https://ae-pic-a1.aliexpress-media.com/kf/S71dd82e5b3bd43768b3ac6cbb31d32f76.jpg")
function save(url) {
  console.log(url)
}
</script>



<style scoped lang="less">

</style>