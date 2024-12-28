<script lang="js">
import {ref} from 'vue'
import EventBus from "~/utils/event-bus";
const canvas = ref(null);

EventBus.on("canvas",(c)=>{
  canvas.value = c;
});


</script>

<template>

</template>

<style scoped lang="less">

</style>