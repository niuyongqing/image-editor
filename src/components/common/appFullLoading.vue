<template>
<div id="appFullLoading" class="appFullLoading">
  <a-modal 
    :footer="false" 
    :open="loading"
    @update:open="val => emit('update:loading', val)"
    :maskClosable="false"
    :keyboard="false"
    :closable="false"
    centered
  > 
    <div class="loading-box">
      <a-spin :tip="loadingTip" />
    </div>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "appFullLoading" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:loading'])
const props = defineProps({
  loading: Boolean,
  loadingTip: {
    type: String,
    default: 'Loading...'
  },
})
const { loading } = toRefs(props);
</script>
<style lang="less" scoped>
.loading-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>