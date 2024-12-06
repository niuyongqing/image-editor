<template>
  <process-pictures :img-url="imgUrl"></process-pictures>
</template>
<script setup lang="js">
import {ref} from 'vue'
import ProcessPictures from "~/components/process-pictures/index.vue";
const imgUrl = ref("https://www.xzerp.com/prod-api/profile/upload/20221020173524180_-E4-BE-9B+_1_.jpg")
</script>



<style scoped lang="less">

</style>