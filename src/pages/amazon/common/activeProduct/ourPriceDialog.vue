<template>
<div id="ourPriceDialog" class="ourPriceDialog">
  <a-modal 
    v-model:open="props.open" 
    :title="'批量修改价格'" 
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
        name="num"
        :rules="[{ required: true, message: '请填写数字！' }]"
      >
        <a-input-number 
          style="width: 200px"
          :step="0.01" 
          :min="0"
          v-model:value="batchData.form.num" 
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
import { ourPriceEdit } from '../../js/api/activeProduct';
defineOptions({ name: "ourPriceDialog" });
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
    num: '',
  }
});
// watch(() => props.open, (newVal) => {
//   console.log({newVal});
//   if (newVal) {
//     batchData.form.num = item.ourPrice || ''
//   }
// })

// 弹窗保存
async function handleOk() {
  // console.log(_this.$refs.batchForm);
  try {
    let res = await _this.$refs.batchForm.validateFields()
    updateOurPrice()
  } catch (error) {
    console.log(error);
  };
}
// 更新库存
async function updateOurPrice() {
  let editOurPriceItems = props.rows.map(item => {
    let obj = {
      "asin": item.asin,
      "shopId": item.shopId,
      "marketId": item.marketId,
      "skuName": item.skuName,
      "ourPrice": item.ourPrice,
      "patches": [
        {
          "op": "replace",
          "path": "/attributes/purchasable_offer",
          "value": [
            {
              "marketplace_id": "ATVPDKIKX0DER",
              "currency": "USD",
              "our_price": [
                {
                  "schedule": [
                    {
                      "value_with_tax": batchData.form.num
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    return obj;
  })
  batchData.loading = true
  try {
    await ourPriceEdit({ editOurPriceItems })
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