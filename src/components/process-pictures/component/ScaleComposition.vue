<template>
<div>
  <a-button @click="ee"></a-button>
</div>
</template>
<script lang="ts" setup>
import EventBus from "~/utils/event-bus";

function ee(){
  EventBus.emit("update",'aaaaa')
}

</script>



<style scoped lang="less">

</style>