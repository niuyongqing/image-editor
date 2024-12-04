<template>
  <process-pictures :img-url="imgUrl"></process-pictures>
</template>
<script setup lang="js">
import {ref} from 'vue'
import ProcessPictures from "~/components/process-pictures/index.vue";
const imgUrl = ref("https://my-live-01.slatic.net/p/c2e787b98b880ae5da3013e0e717c0b2.jpg")
</script>



<style scoped lang="less">

</style>