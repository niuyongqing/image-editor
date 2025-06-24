<template>
<div id="acquisitionEdit_index" class="acquisitionEdit_index">
  <a-modal 
    v-model:open="modalOpen" 
    title="编辑"
    :maskClosable="false" 
    :width="1200"
  >
    <div class="acquisitionEdit-modal-box">
      dgfgsdfhgsdfhg
    </div>
    <template #footer>
      <a-button 
        key="submit" 
        type="primary" 
        @click="modalOk" 
        :loading="loading"
      >确定</a-button>
      <a-button key="submit" @click="modalCloseFn">关闭</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "acquisitionEdit_index" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'addRemark'])
const props = defineProps({
  modalOpen: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
})
const modalOpen = ref(false)
const loading = ref(false)
watch(() => props.modalOpen, (val, oldVal) => {
  if (val) {
    modalOpen.value = val
    modalOpenFn()
  }
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})
function modalOpenFn() {
  
}
async function modalOk() {
  loading.value = true

  loading.value = false
  modalCloseFn()
}
function modalCloseFn() {
  modalOpen.value = false
}
</script>
<style lang="less" scoped>

</style>