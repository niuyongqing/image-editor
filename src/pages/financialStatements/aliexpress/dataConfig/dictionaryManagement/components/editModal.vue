<template>
<div id="dictionaryManagement_editModal" class="dictionaryManagement_editModal">
  <appModal 
    v-model:open-value="openValue" 
    width="600px"
    @open="modalOpenFn"
    :title="title"
  >
    <template #appContent>
      <a-form 
        v-model:model="formData" 
        :label-col="{ span: 4 }"
        ref="formRef"
      >
        <a-form-item label="字典类型" name="dictType">
          {{ props.dictItem.dictName }}
        </a-form-item>
        <a-form-item
          label="字典名称"
          name="itemName"
          :rules="[{ required: true, message: '请填写字典名称!' }]"
        >
          <a-input v-model:value="formData.itemName" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formData.remark" :rows="3"/>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-switch 
            v-model:checked="formData.status" 
            checked-children="启用" 
            un-checked-children="停用" 
            :checkedValue="'enabled'"
            :unCheckedValue="'disabled'"
          />
        </a-form-item>
      </a-form>
    </template>
    <template #appFooter>
      <a-button @click="handleCustomCancel">取消</a-button>
      <a-button type="primary" @click="handleCustomOk" :loading="btnLoading">确定</a-button>
    </template>
  </appModal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import appModal from '~@/components/common/appModal.vue'
import { itemSave } from '../js/api';
defineOptions({ name: "dictionaryManagement_editModal" })
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:open', 'save'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  rowInfo: {
    type: Object,
    default: () => ({})
  },
  dictItem: {
    type: Object,
    default: () => ({})
  }
})
const openValue = ref(false);
const btnLoading = ref(false)
const formData = reactive({
  itemId: null,
  itemName: '',
  itemValue: '',
  // 'itemSort': 1,
  dictType: '',
  status: 'enabled',
  remark: ''
});
const resetData = {
  itemId: null,
  itemName: '',
  itemValue: '',
  // 'itemSort': 1,
  dictType: '',
  status: 'enabled',
  remark: ''
}
// const { open, rowInfo } = toRefs(props)
const title = computed(() => {
  return props.rowInfo.itemId ? '编辑' : '新增';
});
watch(() => props.open, (val, oldVal) => {
  openValue.value = val;
});
watch(() => openValue.value, (val, oldVal) => {
  emit('update:open', val);
  !val && (Object.assign(formData, resetData))
});
function modalOpenFn() {
  if (props.rowInfo.itemId) {
    Object.keys(formData).forEach(key => {
      formData[key] = props.rowInfo[key];
    });
  } 
}
function handleCustomCancel() {
  _this.$refs.formRef.resetFields()
  openValue.value = false
}
async function handleCustomOk() {
  try {
    btnLoading.value = true;
    let params = {
      ...formData,
      dictType: props.dictItem.dictType
    }
    await itemSave(params)
    emit('save')
    handleCustomCancel()
  } catch (error) {
    console.error(error);
  }
  btnLoading.value = false;
}
</script>
<style lang="less" scoped>

</style>