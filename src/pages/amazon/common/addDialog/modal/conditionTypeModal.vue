<template>
<div id="conditionTypeModal">
  <a-modal 
    v-model:open="props.open" 
    :title="'修改物品状况'" 
    @ok="handleOk"
    :closable="false"
    style="width: 600px;"
  >
    <a-form :model="formState">
      <a-form-item
        label="物品状况"
        :name="'conditionType'"
      >
        <a-select
          v-model:value="formState.type"
          showSearch
        >
          <a-select-option 
            :value="item.value"
            :key="item.label"
            v-for="item in props.modalData.typeList"
          >{{ item.label }}</a-select-option>
        </a-select>
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
defineOptions({ name: "conditionTypeModal" })
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
  type: '',
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
    item[prop] = formState.type
  })
  // return
  emit('generate', formState.tableData)
  handleCancel()
}
</script>
<style lang="less" scoped>

</style>