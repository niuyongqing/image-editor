<template>
<div id="AmazonBaseInfo">
  <div class="title">
    <span>基本信息</span>
  </div>
  <div class="content">
    <a-form 
      :model="formState" 
      :rules="rules"
    >
      <a-form-item label="店铺账号：" name="shopId">
        <a-select
          ref="select"
          v-model:value="formState.shopId"
          @change="marketplaceIdChange"
        >
          <a-select-option 
            v-for="item in shopList"
            :key="item.id"
          >{{ item.shopName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="站点选择：" name="countryCode">
        <a-select
          ref="select"
          v-model:value="formState.countryCode"
          @change="countryCodeChange"
        >
          <a-select-option 
            v-for="item in countryCodeList"
            :key="item.countryCode"
          >{{ item.countryZhName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="产品分类：" name="productType">
        <a-cascader
          v-model:value="formState.productType"
          :options="productTypes"
          :load-data="loadData"
          :fieldNames="{
            label: 'chineseName', 
            value: 'categoryId', 
            children: 'children'
          }"
          placeholder="Please select"
          @change="productTypeChange"
          change-on-select
        />
      </a-form-item>
      <a-form-item label="售卖形式：">
        <a-radio-group v-model:value="formState.sellType">
          <a-radio value="1">单品</a-radio>
          <a-radio value="2">多变种</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item 
        label="UPC豁免："
        tooltip="如果您注册了品牌且亚马逊后台表格上传产品时不用写UPC/EAN，请选择【是】，如果不是以上情况，请选择【否】。"
      >
        <a-radio-group v-model:value="formState.upc">
          <a-radio value="1">是</a-radio>
          <a-radio value="2">否</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</div>
</template>

<script setup>
import { getShopList, getMarketList, getProductTypes } from '@/pages/amazon/js/api/activeProduct'
import VueForm from '@/assets/library/jsonScheam_v3_ant/vue3-form-ant.esm.min.js';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({
  name: "AmazonBaseInfo"
})
const emit = defineEmits(['selectedProductType'])
const props = defineProps({
  // 属性数据
  schemaData: {
    type: Object,
    required: true,
    default: () => {}
  }
});
onMounted(async () => {
  let res = await getShopList()
  if (res.data && res.data.length) {
    shopList.value = res.data
    formState.shopId = res.data[0].id
    getCountryCode(res.data[0].id)
  }

})
const productTypes = ref([]);
async function getProductTypesFn(categoryParentId) {
  let params = {
    "keywords":"",
    "site": formState.countryCode,
    "categoryParentId": categoryParentId || 0
  }
  let res = await getProductTypes(params)
  let data = res.data
  if (data && data.length) {
    data.forEach(item => {
      item.isLeaf = !!item.leafCategory
    })
    return data
  }
}
async function loadData(selectedOptions) {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  targetOption.children = await getProductTypesFn(targetOption.categoryId)
  targetOption.loading = false;
  productTypes.value = [...productTypes.value];
}
// 类别选择完成
function productTypeChange(value, selectedOptions) {
  // console.log({value, selectedOptions});
  const targetOption = selectedOptions[selectedOptions.length - 1];
  if (targetOption.isLeaf) {
    let obj = countryCodeList.value.find(i => i.countryCode === formState.countryCode)
    let params = {
      "productType": targetOption.productType,
      "marketId": obj.marketplaceId,
      "shopId": formState.shopId
    }
    emit('selectedProductType', params)
  }
}
let shopList = ref([]) // 店铺列表
let countryCodeList = ref([]);  // 站点列表
// 获取站点
function getCountryCode(id) {
  getMarketList(id).then(res => {
    countryCodeList.value = res.data
  })
}
async function countryCodeChange(val) {
  let data = await getProductTypesFn()
  productTypes.value = data
}
const formState = reactive({
  shopId: '',
  countryCode: '',
  productType: [],
  sellType: '',
  upc: '',
});
const rules = {
  shopId: [
    {
      required: true,
      message: '请选择店铺',
      trigger: 'change',
    }
  ],
  countryCode: [
    {
      required: true,
      message: '请选择站点',
      trigger: 'change',
    },
  ],
  productType: [
    {
      required: true,
      message: '请选择产品',
      trigger: 'change',
    },
  ]
};
let form = {};             // 取值对象
let schemaData = props.schemaData
let formRef = ref(null)
function formMounted(ref, { formData }) {
  // console.log(ref, { formData });
  formRef.value = ref
}
function marketplaceIdChange(val) {

}
defineExpose({
  formRef
})
</script>
<style lang="less" scoped>
#AmazonBaseInfo {
  .content {
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 0 3px 1px rgba(0, 0, 0, 0.1);
    padding: 10px 15px 5px;
    ::v-deep(.ant-form-item-row) {
      .ant-form-item-label {
        width: 200px;
        height: auto;
        word-break: break-all;
        word-wrap: break-word;
        text-align: right;
        line-height: unset;
        padding-bottom: 0;
      }
      .ant-form-item-control-input {
        // width: 140px;
        width: 100%;
        .ant-form-item-control-input-content {
          display: flex;
          text-align: left;
        }
      }
    }
  }
}
</style>