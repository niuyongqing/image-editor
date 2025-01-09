<template>
<div id="nameDialog" class="nameDialog">
  <a-modal 
    v-model:open="props.open" 
    :title="'批量修改标题'" 
    @ok="handleOk"
    :closable="false"
  >
    <a-form
      layout="horizontal"
      :model="batchData.form"
      style="max-width: 600px"
      ref="batchForm"
    >
      <a-form-item 
        label=""
        name="name"
        :rules="[{ required: true, message: '请输入标题！' }]"
      >
        <a-textarea  
          v-model:value="batchData.form.name" 
          placeholder="请输入" 
          :rows="2"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="batchData.loading" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { nameEdit } from '../../js/api/activeProduct';
defineOptions({
  name: "nameDialog"
});
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:open', 'editDone'])
const props = defineProps({
  open: Boolean,
  rows: {
    type: Array,
    default: () => []
  }
})
// 批量修改的数据
const batchData = reactive({
  loading: false,
  form: {
    name: '',
  }
});
// watch(() => props.open, (newVal) => {
//   console.log({newVal});
//   if (newVal) {
//     batchData.form.num = item.name || ''
//   }
// })

// 弹窗保存
async function handleOk() {
  // console.log(_this.$refs.batchForm);
  try {
    let res = await _this.$refs.batchForm.validateFields()
    updateName()
  } catch (error) {
    console.log(error);
  };
}
// 更新库存
async function updateName() {
  let editListItemNameItems = props.rows.map(item => {
    let obj = {
      "asin": item.asin,
      "shopId": item.shopId,
      "marketId": item.marketId,
      "skuName": item.skuName,
      "patches": [
        {
          "op": "replace",
          "path": "/attributes/item_name",
          "value": [
            {
              "marketplace_id": "ATVPDKIKX0DER",
              "value": batchData.form.name,
              "language_tag": "en_US"
            }
          ]
        }
      ]
    };
    return obj;
  })
  batchData.loading = true
  try {
    await nameEdit({ editListItemNameItems })
    emit('editDone')
    handleCancel()
  } catch (error) {
    batchData.loading = false
  }
}
// 关闭弹窗
function handleCancel() {
  _this.$refs.batchForm.resetFields()
  emit('update:open', false)
  batchData.loading = false
}
</script>
<style lang="less" scoped>

</style>