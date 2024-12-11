<template>
<div id="AmazonBaseInfo">
  <div class="title">
    <span>基本信息</span>
  </div>
  <div class="content">
    <a-form 
      :model="formState" 
    >
      <a-form-item label="店铺账号：">
        <a-select
          ref="select"
          v-model:value="formState.shopId"
          style="width: 120px"
          @change="marketplaceIdChange"
        >
          <a-select-option 
            v-for="item in shopList"
            :key="item.id"
          >{{ item.shopName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="站点选择：">
        <a-select
          ref="select"
          v-model:value="formState.countryCode"
          style="width: 120px"
          @change="countryCodeChange"
        >
          <a-select-option 
            v-for="item in countryCodeList"
            :key="item.countryCode"
          >{{ item.countryZhName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="产品分类：">
        <a-cascader
          v-model:value="formState.productType"
          :options="productTypes"
          :load-data="loadData"
          placeholder="Please select"
          change-on-select
        />
      </a-form-item>
      <a-form-item label="售卖形式">
        <a-radio-group v-model:value="formState.resource">
          <a-radio value="1">Sponsor</a-radio>
          <a-radio value="2">Venue</a-radio>
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
const productTypes = ref([
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
]);
function getProductTypesFn(categoryParentId) {
  let params = {
    "keywords":"",
    "site": formState.countryCode,
    "categoryParentId": categoryParentId || 0
  }
  getProductTypes(params).then(res => {

  })
}
function loadData(selectedOptions) {
  console.log({selectedOptions});
  
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  setTimeout(() => {
    targetOption.loading = false;
    targetOption.children = [
      {
        label: `${targetOption.label} Dynamic 1`,
        value: 'dynamic1',
      },
      {
        label: `${targetOption.label} Dynamic 2`,
        value: 'dynamic2',
      },
    ];
    productTypes.value = [...productTypes.value];
  }, 1000);
}
let shopList = ref([]) // 店铺列表
let countryCodeList = ref([]);  // 站点列表
// 获取站点
function getCountryCode(id) {
  getMarketList(id).then(res => {
    countryCodeList.value = res.data
  })
}
function countryCodeChange(val) {

}
const wrapperCol = {
  span: 14,
};
const formState = reactive({
  shopId: '',
  countryCode: '',
  productType: [],
  resource: '',
  desc: '',
});
const rules = {
  shopId: [
    {
      required: true,
      message: '请选择店铺',
      trigger: 'change',
    }
  ],
  region: [
    {
      required: true,
      message: '请选择站点',
      trigger: 'change',
    },
  ],
  date1: [
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
    ::v-deep(.ant-form-item-row .ant-form-item-label) {
      width: 200px;
      height: auto;
      word-break: break-all;
      word-wrap: break-word;
      text-align: right;
      line-height: unset;
      padding-bottom: 0;
    }
  }
}
</style>