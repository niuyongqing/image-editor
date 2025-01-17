<template>
<div id="imageDialog" class="imageDialog">
  <a-modal 
    v-model:open="props.open" 
    :title="'批量修改主图/标题'" 
    @ok="handleOk"
    width="50%"
    :closable="false"
  >
    <div class="modal-box">
      <div 
        class="batchForm-item"
        v-for="item in props.rows"
        :key="item.key"
      >
        <div class="batchForm-item-title">{{ item.sku }}</div>
        <a-form
          layout="horizontal"
          :model="batchData.form[item.key]"
          style="max-width: 600px"
          :ref="`batchForm_${item.key}`"
        >
          <a-form-item 
            label="标题"
            name="name"
            :rules="[{ required: true, message: '请输入标题！' }]"
          >
            <a-textarea  
              v-model:value="batchData.form[item.key].name" 
              placeholder="请输入" 
              :rows="2"
            />
          </a-form-item>
          <a-form-item
            label="主图"
            name="image"
            :rules="[{ required: true, message: '请上传图片！' }]"
          >
            <a-input v-show="false" v-model:value="batchData.form[item.key].image" placeholder="" :disabled="true" />
            <a-form-item-rest>
              <div class="batchForm-item-image">
                <a-image
                  :width="100"
                  style="margin-bottom: 10px;"
                  :src="batchData.form[item.key].image"
                />
                <a-upload
                  v-model:file-list="batchData.form[item.key].fileList"
                  name="file"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  :headers="{
                    'Content-Type': 'image/png',
                  }"
                  @change="handleChange"
                >
                  <a-button>上传图片</a-button>
                </a-upload>
              </div>
            </a-form-item-rest>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" :loading="batchData.loading" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { imageEdit, nameEdit } from '../../js/api/activeProduct';
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
  keyList: [],
  form: {}
});
watch(() => props.open, (newVal) => {
  console.log({newVal});
  if (newVal) {
    Object.keys(batchData.form).forEach(key => {
      delete batchData.form[key]
    })
    props.rows.forEach(item => {
      batchData.form[item.key] = {
        name: item.itemName,
        image: item.attribute.main_product_image_locator[0].media_location,
        fileList: []
      }
    })
    batchData.keyList = props.rows.map(i => i.key)
  }
})
function handleChange(info) {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}
// 弹窗保存
async function handleOk() {
  let result = []   // 收集校验结果
  for (let index = 0; index < batchData.keyList.length; index++) {
    const key = batchData.keyList[index];
    try {
      let res = await _this.$refs[`batchForm_${key}`][0].validateFields()
      // console.log(batchData.form);
      // return
      result.push(true)
    } catch (error) {
      result.push(false)
      console.log(error);
    };
  }
  let flag = result.every(i => i)
  // console.log({result, flag});
  // 判断校验是否通过
  if (flag) {
    updateImage()
  }
}
// 更新库存
async function updateImage() {
  // return;
  let editListMainImageItems = []       // 主图参数
  let editListItemNameItems = []        // 标题参数
  props.rows.forEach(item => {
    let imageItem = {     // 创建主图参数数据结构
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
              "marketplace_id": item.marketId,
              "media_location": batchData.form[item.key].image
            }
          ]
        }
      ]
    };
    let nameItem = {        // 创建标题参数数据结构
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
              "marketplace_id": item.marketId,
              "value": batchData.form[item.key].name,
              "language_tag": item.attribute.item_name[0].language_tag
            }
          ]
        }
      ]
    }
    editListMainImageItems.push(imageItem)
    editListItemNameItems.push(nameItem)
  })
  batchData.loading = true
  try {
    await imageEdit({ editListMainImageItems })
    await nameEdit({ editListItemNameItems })
    emit('editDone')
    handleCancel()
  } catch (error) {
    batchData.loading = false
  }
}
// 关闭弹窗
function handleCancel() {
  // _this.$refs.batchForm.resetFields()
  emit('update:open', false)
  batchData.loading = false
}
</script>
<style lang="less" scoped>
.modal-box {
  width: 100%;
  max-height: 700px;
  overflow-y: auto;
  padding: 10px;
  .batchForm-item {
    width: 100%;
    margin-bottom: 30px;
    .batchForm-item-title {
      font-size: 18px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .batchForm-item-image {
      display: flex;
      flex-direction: column;
      .image-item {
        margin-bottom: 10px;
      }
    }
    ::v-deep(.ant-form-item) {
      margin-bottom: 10px;
    }
  }
}
</style>