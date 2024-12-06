<template>
  <process-pictures :img-url="imgUrl"></process-pictures>
</template>
<script setup lang="js">
import {ref} from 'vue'
import ProcessPictures from "~/components/process-pictures/index.vue";
const imgUrl = ref("https://www.xzerp.com/prod-api/profile/upload/2024/12/05/%E4%B8%BB%E5%9B%BE1_20241205181347A352.jpg")
</script>



<style scoped lang="less">

</style>