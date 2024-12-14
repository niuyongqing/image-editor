<template>
<div id="addDialog" class="addDialog">
  <div class="main-content">
    <baseInfo
      :schema-data="baseData"
      class="baseInfoRef"
      ref="baseInfoRef"
      @selectedProductType="selectedProductType"
    ></baseInfo>
    <a-spin :spinning="spinning">
      <productInfo
        :schema-data="productData"
        v-model:productForm="productForm"
        class="productInfoRef"
        ref="productInfoRef"
      ></productInfo>
      <descriptionInfo
        :schema-data="descriptionData"
        v-model:descriptionForm="descriptionForm"
        ref="descriptionInfoRef"
      ></descriptionInfo>
      <imageInfo></imageInfo>
      <attributeInfo
        :schema-data="attributeData"
        v-model:attributeForm="attributeForm"
        class="attributeInfoRef"
        ref="attributeInfoRef"
      ></attributeInfo>
      <offerInfo
        :schema-data="offerData"
        v-model:offerForm="offerForm"
        class="AmazonOfferInfoRef"
        ref="offerInfoRef"
      ></offerInfo>
      <div class="form-footer">
        <a-button style="margin-right: 20px">取消</a-button>
        <a-button type="primary" @click="sure">确定</a-button>
      </div>
    </a-spin>
  </div>
  <div class="addDialog-anchor">
    <div
      class="addDialog-anchor-item"
      v-for="item in anchorList"
      :key="item.key"
      @click="toHref(item.href)"
    >{{ item.title }}</div>
  </div>
</div>
</template>

<script setup>
import "../js/main.less";
import baseInfo from '@/pages/amazon/common/addDialog/baseInfo.vue'
import productInfo from "@/pages/amazon/common/addDialog/productInfo.vue";
import descriptionInfo from '@/pages/amazon/common/addDialog/descriptionInfo.vue'
import imageInfo from "@/pages/amazon/common/addDialog/imageInfo.vue";
// import amazonAttributeInfo from '@/pages/amazon/common/amazonAttributeInfo.vue'
import attributeInfo from '@/pages/amazon/common/addDialog/attributeInfo.vue'
import offerInfo from '@/pages/amazon/common/addDialog/offerInfo.vue'
import '@/assets/library/jsonScheam_v3_ant/style/baseForm.css'

// import scheam from './TrainSets - 副本.json'
// import scheam from './TrainSets.json'
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { getJsonUrl, validateJson } from '@/pages/amazon/js/api/activeProduct'
import axios from "axios";
defineOptions({
  name: "addDialog"
})
let anchorList = [    // 模块列表
  {
    key: 'AmazonBaseInfo',
    href: '#AmazonBaseInfo',
    title: '基本信息',
  },
  {
    key: 'AmazonDescriptionInfo',
    href: '#AmazonDescriptionInfo',
    title: '详细信息',
  },
  {
    key: 'AmazonAttributeInfo',
    href: '#AmazonAttributeInfo',
    title: '属性信息',
  },
  {
    key: 'AmazonOfferInfo',
    href: '#AmazonOfferInfo',
    title: '价格信息',
  },
];
const spinning = ref(false)
let scheam = {}
let _attributeData = {}     // 原始数据
const jsonParams = ref({}); // 获取json链接的参数

const baseInfoRef = ref()
const productInfoRef = ref()
const attributeInfoRef = ref()
const descriptionInfoRef = ref()
const offerInfoRef = ref()
// console.log({attributeInfoRef});
const baseData = ref()
const productData = ref()
const descriptionData = ref()
const attributeData = ref()
const offerData = ref()

const finalParams = ref({});    // 收集到的全部json参数
const productForm = ref({})
const descriptionForm = ref({})
const attributeForm = ref({})
const offerForm = ref({})

watchPostEffect(() => {
  finalParams.value = {
    ...descriptionForm.value,
    ...productForm.value,
    ...attributeForm.value,
    ...offerForm.value,
  }
  let jsonStr = JSON.stringify(finalParams.value)
  // validateJsonFn(jsonStr)
})
// 校验必填属性
async function validateJsonFn(val) {
  console.log({val});
  
  if (val === '{}') return;
  let data = {
    productType: jsonParams.value.productType,
    content: finalParams.value
  }
  console.log({data});
  
  let res = await validateJson(data)
  let final = res.data
  let keyList = final.map(i => {
    return i.arguments[0]
  })
  console.log({ keyList });
  let arr = Object.keys(_attributeData.properties)
  arr.forEach(key => {
    if (!keyList.includes(key)) {
      delete _attributeData.properties[key]
    }
  })
  // 赋值
  productData.value = setAttributeData(productIdentityList).data
  descriptionData.value = setAttributeData(descriptionList).data
  attributeData.value = getDetails()
  offerData.value = setAttributeData(offerList).data
  return final
}
// 选中属性
async function selectedProductType(val) {
  jsonParams.value = val
  spinning.value = true
  let urlRes = await getJsonUrl(val)
  let url = urlRes.data || ''
  // console.log({ url });
  let res = await axios.get(url)
  scheam = res.data
  _attributeData = JSON.parse(JSON.stringify(scheam))
  await validateJsonFn()
  spinning.value = false
}
// 获取数据
function copyData() {
  return JSON.parse(JSON.stringify(_attributeData))
}
// _attributeData.required.forEach(item => {
//   delete _attributeData.properties[item]
// });
let productIdentity = {}
let description = {}
let offer = {}
// Object.keys(_attributeData.properties).forEach(key => {
//   // 清除图片属性 通过key判断
//   let delList = ['product_image_locator', 'offer_image_locator']
//   let flag = delList.some(i => key.includes(i))
//   if (flag) {
//     delete _attributeData.properties[key]
//   }
// })
let productIdentityList = [       // 产品表示  名称 品牌等
  'Item Name',
  'Product Type',
  'Item Type Keyword',
  'Brand Name',
  'External Product ID',
]
let descriptionList = [           // 产品描述
  'Product Description',
  'Bullet Point',
  'Images',
]
let offerList = [                 // 报价
  'Quantity',
  'Handling Time',
  'Restock Date',
  'Minimum Advertised Price',
  'Your Price',
  'Sale Price',
  'Sale Start Date',
  'Sale End Date',
  'Offering Release Date',
  'Offering Condition Type',
  'Offer Condition Note',
  'List Price',
  'Product Tax Code',
  'Merchant Release Date',
  'Merchant Shipping Group',
  'Maximum Order Quantity'
]
// 跳转对应模块
function toHref(href) {
  document.querySelector(href).scrollIntoView({
    behavior: 'smooth'
  })
}
// 校验
async function sure() {
  let {result:offerResult, params: offerParams} = await offerInfoRef.value.save()
  let {result:productResult, params: productParams} = await productInfoRef.value.save()
  let {result:attributeResult, params: attributeParams} = await attributeInfoRef.value.save()
  let {result:descriptionResult, params: descriptionParams} = await descriptionInfoRef.value.save()
  console.log({ offerResult, productResult, attributeResult, descriptionResult });
  let flag = (offerResult && productResult && attributeResult && descriptionResult)
  if (!flag) return;
  finalParams.value = {
    ...offerParams,
    ...productParams,
    ...attributeParams,
    ...descriptionParams
  }
  let final = await validateJsonFn()
  console.log({final});
}
// 找出对应属性
function filterType(title, data) {
  let list = data.filter(item => {
    if (item.title === title) {
      return item.title === title
    } else if (item.children && item.children.length > 0) {
      let l = filterType(title, item.children)
      if (l.length > 0) {
        // console.log(item.title);
      }
      return l.length > 0
    }
  })
  return list
}
// 获取详情属性
function getDetails() {
  let titleList = [
    ...productIdentityList,
    ...descriptionList,
    ...offerList
  ]
  // 获取其余属性
  let propertiesList = setAttributeData(titleList).propertiesList
  let data = copyData()
  Object.keys(data.properties).forEach(key => {
    let list = ['_offer_image_locator', '_product_image_locator']
    let flag = list.some(i => key.includes(i))
    if (flag) {
      propertiesList.push(key)
    }
  })
  // console.log(propertiesList);
  propertiesList.forEach(key => {
    delete data.properties[key]
  })
  return data
}
// 提取属性
function setAttributeData(arr) {
  let data = copyData()
  let obj = {}  // 收集属性
  let _data = handleFormItem(copyData().properties, [])   // 将属性转换成数组
  let propertiesList = []   // 收集属性字段
  let list = arr.map(item => {
    return filterType(item, _data)
  })
  list.forEach(item => {
    let keys = item.map(i => i._key)
    propertiesList.push(...keys)
  })
  // 去重
  propertiesList = [...new Set(propertiesList)]
  // console.log({ propertiesList });

  propertiesList.forEach(item => {
    obj[item] = data.properties[item]
  })
  data.properties = obj
  return {data, propertiesList}
}
// 处理数据，使其变成数组结构
function handleFormItem(data, requiredList) {
  // console.log(11);
  let list = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key];
      let obj = {
        _key: key,
        ...item
      }
      if ((obj.items && obj.items.properties) || obj.properties) {
        let properties = obj.items?.properties || obj.properties
        let required = obj.items?.required || []
        obj.children = handleFormItem(properties, required)
      }
      list.push(obj)
    }
  }
  return list
}
</script>
<style lang="less" scoped>
@import "@/assets/library/jsonScheam_v3_ant/style/sechma-form.less";
.addDialog {
  width: 1250px;
  height: 100%;
  margin: 0 auto;
  // margin: -50px auto 0;
  // position: relative;
  // border: 1px solid #848383;
  background: rgb(254, 254, 254);
  padding: 20px 60px;
  display: flex;
  // display: flex;
  .main-content {
    width: 100%;
    .form-footer {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    ::v-deep(.ant-anchor-wrapper) {
      // width: 130px;
      // position: sticky;
      // top: 20px;
      // margin-left: 1300px
    }
  }
  .addDialog-anchor {
    width: 130px;
    height: 300px;
    position: sticky;
    top: 20px;
    .addDialog-anchor-item {
      width: 130px;
      margin-bottom: 10px;
      cursor: pointer;
      font-size: 18px;
      font-weight: 600;
      &:hover {
        color: red;
      }
    }
  }
}
</style>