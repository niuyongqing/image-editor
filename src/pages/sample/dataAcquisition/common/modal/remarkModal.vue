<template>
  <div id="remarkModal" class="remarkModal">
    <a-modal v-model:open="modalOpen" :title="props.modalData.selectedRow.length > 1 ? '批量备注':'备注'"
      :maskClosable="false" :width="600">
      <div class="remarkModal-modal-box">
        <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
          <a-form-item label="内容:">
            <a-contentarea v-model:value="formData.content" :rows="4" allow-clear />
          </a-form-item>
          <a-form-item label="颜色:">
            <div>
              <div class="color-list">
                <div 
                  class="color-item" 
                  v-for="(item, index) in colorList" 
                  :key="index"
                  :class="item === formData.color ? 'color-active' : ''" 
                  :style="{ background: item }"
                  @click="remarkColorSelect(item)"
                ></div>
              </div>
            </div>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button key="submit" type="primary" @click="modalOk">确定</a-button>
        <a-button key="submit" @click="modalCloseFn">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "remarkModal" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:modalOpen', 'addRemark'])
const props = defineProps({
  modalOpen: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
})
const colorList = [
  '#009926', 
  '#F00', 
  '#0005FD', 
  '#FF5800', 
  '#8E0075', 
  '#FF6666', 
  '#FFCAC5', 
  '#00D0FF'
]
const modalOpen = ref(false)
const formData = reactive({
  content: '',
  color: ''
})
watch(() => props.modalOpen, (val, oldVal) => {
  val && (modalOpen.value = val)
})
watch(() => modalOpen.value, (val, oldVal) => {
  !val && emit('update:modalOpen', false)
})
function modalOk() {
  emit('addRemark', {...formData})
}
function modalCloseFn() {
  modalOpen.value = false
}
function remarkColorSelect(color) {
  formData.color = color
}
</script>
<style lang="less" scoped>
.color-item {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  margin-right: 10px;
  cursor: pointer;
  border: 3px solid #ccc;
}

.color-list {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.color-active {
  border: 2px solid #000;
}
</style>