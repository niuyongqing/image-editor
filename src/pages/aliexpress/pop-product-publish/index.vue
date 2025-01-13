<template>
  <div>
    <a-input-number id="inputNumber" v-model:value="value" :min="1" :max="10" />
    当前值：{{ value }}
    <a-button @click="value += 100">设置为 {{ value }}</a-button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
  const value = ref('3.123');

</script>