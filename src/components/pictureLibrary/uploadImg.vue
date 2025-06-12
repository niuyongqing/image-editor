<template>
<div id="uploadImg" class="uploadImg">
  <a-modal 
    v-model:open="modalOpen" 
    title="图片上传"
    :width="1000"
  >
    <div class="modal-box">
      <div class="index-left">
        <div class="left-title box-title">图片空间的分类</div>
        <div class="left-tree-box">
          <typeTree></typeTree>
        </div>
      </div>
      <div class="index-right">

      </div>
    </div>
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">关闭</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import typeTree from '@/components/classificationTree/typeTree.vue';
defineOptions({ name: "uploadImg" })
const { proxy: _this } = getCurrentInstance();
const emit = defineEmits(['update:modalOpen']);
const props = defineProps({
  modalOpen: Boolean,
  platform: {
    type: String,
    default: ''
  }
})
const modalOpen = ref(false)
// 打开弹窗
watch(() => props.modalOpen, val => {
  // console.log({val});
  modalOpen.value = val
});
// 关闭弹窗
watch(() => modalOpen.value, val => {
  !val && emit('update:modalOpen', false);
});
// 关闭弹窗
function handleOk() {
  modalOpen.value = false
}
</script>
<style lang="less" scoped>
.modal-box {
  display: flex;
  padding: 10px;
  width: 100%;
  .index-left {
    width: 28%;
    margin-right: 15px;
    .left-tree-box {
      width: 80%;
      height: 100%;
      margin: 10px 0;
    }
  }
  .index-right {
    width: 80%;
    .right-btn {
      display: flex;
      // justify-content: space-between;
    }
    .right-box {
      margin-top: 10px;
      .right-box-content {

      }
      .right-box-foot {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .box-title {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #eee;
    padding: 0 10px;
  }
}
</style>