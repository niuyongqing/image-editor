<template>
<div id="imageDialog" class="imageDialog">
  <a-modal 
    v-model:open="props.open" 
    :title="'批量修改主图'" 
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
        v-for="(item, index) in props.rows"
        :label="item.key"
        :key="item.key + index"
        :name="item.key"
        :rules="[{ required: true, message: '请输入标题！' }]"
      >
        <a-textarea  
          v-model:value="batchData.form[item.key]" 
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
import { imageEdit } from '../../js/api/activeProduct';
defineOptions({
  name: "imageDialog"
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
  form: {}
});
watch(() => props.open, (newVal) => {
  console.log({newVal});
  if (newVal) {
    Object.keys(batchData.form).forEach(key => {
      delete batchData.form[key]
    })
    props.rows.forEach(item => {
      batchData.form[item.key] = ''
    })
  }
})

// 弹窗保存
async function handleOk() {
  // console.log(_this.$refs.batchForm);
  try {
    let res = await _this.$refs.batchForm.validateFields()
    console.log(batchData.form);
    return
    updateImage()
  } catch (error) {
    console.log(error);
  };
}
// 更新库存
async function updateImage() {
  let editListMainImageItems = props.rows.map(item => {
    let obj = {
      "asin": item.asin,
      "shopId": item.shopId,
      "marketId": item.marketId,  
      "skuName": item.skuName,
      "patches": [
        {
          "op": "replace",
          "path": "/attributes/main_offer_image_locator",
          "value": [
            {
              "marketplace_id": "ATVPDKIKX0DER",
              "media_location": "https://m.media-amazon.com/images/I/41x1rHn66IL._SL75_.jpg"
            }
          ]
        }
      ]
    };
    return obj;
  })
  batchData.loading = true
  try {
    await imageEdit({ editListMainImageItems })
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