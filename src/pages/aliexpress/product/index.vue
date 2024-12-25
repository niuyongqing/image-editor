<template>
  <a-textarea v-model:value="value" ref="textareaRef" placeholder="Basic usage" :rows="4" />
</template>
<script setup>
import { ref } from 'vue';
  const value = ref('');
  const textareaRef = ref();
  setTimeout(() => {
    textareaRef.value.focus();
  }, 1000);
  nextTick(() => {
    console.log(textareaRef.value);
  });
  // console.log(textareaRef.value);
</script>