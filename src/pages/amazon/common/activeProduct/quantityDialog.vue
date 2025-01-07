<template>
<div id="quantityDialog" class="quantityDialog">
  <a-modal v-model:open="props.open" :title="'批量修改库存'" @ok="handleOk">
    <a-form
      layout="horizontal"
      :model="batchData.form"
      style="max-width: 600px"
      ref="batchForm"
    >
      <a-form-item 
        label=""
        name="num"
        :rules="[{ required: true, message: '请填写数字！' }]"
      >
        <a-input-number id="inputNumber" v-model:value="batchData.form.num" />
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
import { quantityEdit } from '../../js/api/activeProduct';
defineOptions({
  name: "quantityDialog"
});
const { proxy: _this } = getCurrentInstance()
const emit = defineEmits(['update:open'])
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
    num: ''
  }
});

// 弹窗保存
async function handleOk() {
  _this.$refs.batchForm
  console.log(_this.$refs.batchForm);
  try {
    let res = await _this.$refs.batchForm.validateFields()
    console.log({ res });
    updateQuantity()
  } catch (error) {
    console.log(error);
    
  }
  return;
  batchData.loading = true
  setTimeout(() => {
    batchData.loading = false
  }, 2000);
}
// 更新库存
async function updateQuantity() {
  let editQuantityItems = props.rows.map(item => {
    let obj = {
      "asin": item.asin,
      "shopId": item.shopId,
      "marketId": item.marketId,
      "skuName": item.skuName,
      "quantity": item.quantity,
      "patches": [
          {
              "op": "replace",
              "path": "/attributes/fulfillment_availability",
              "value": [
                  {
                      "fulfillment_channel_code": "DEFAULT",
                      "quantity": batchData.form.num
                  }
              ]
          }
      ]
    }
    return obj
  })
  batchData.loading = true
  try {
    await quantityEdit({ editQuantityItems })
    handleCancel()
  } catch (error) {
    batchData.loading = false
  }
}
// 关闭弹窗
function handleCancel() {
  emit('update:open', false)
  batchData.loading = false
}
</script>
<style lang="less" scoped>

</style>