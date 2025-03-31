<template>
<div id="describeModal">
  <a-modal 
    v-model:open="props.open" 
    :title="'修改物品描述'" 
    @ok="handleOk"
    :closable="false"
    style="width: 600px;"
  >
    <a-form :model="formState">
      <a-form-item
        label="物品描述"
        :name="'conditionType'"
      >
        <a-input v-model:value="formState.value" placeholder="请输入描述" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="save">确定</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "describeModal" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:open', 'editDone', 'generate']);
const props = defineProps({
  open: Boolean,
  modalData: {
    type: Object,
    default: () => {}
  }
})
const formState = reactive({
  value: '',
  // conditionTypeList: [],
  tableData: []
})
watch(() => props.open, (val) => {
  if (val) {
    // formState.conditionTypeList = props.modalData.typeList
    formState.tableData = JSON.parse(JSON.stringify(props.modalData.variantInfo))
  }
})
function handleCancel() {
  emit('update:open', false)
}
function handleOk() {
  emit('editDone')
}
function save(params) {
  let prop = props.modalData.prop
  formState.tableData.forEach(item => {
    item[prop] = formState.value
  })
  // return
  emit('generate', formState.tableData)
  handleCancel()
}
</script>
<style lang="less" scoped>

</style>