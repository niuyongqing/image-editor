<template>
<div id="addDialog" class="addDialog">
  <div class="main-content">
    <baseInfo
      :schema-data="baseData"
      class="baseInfoRef"
      ref="baseInfoRef"
    ></baseInfo>
    <productInfo
      :schema-data="productData"
      class="productInfoRef"
      ref="productInfoRef"
    ></productInfo>
    <descriptionInfo
      :schema-data="descriptionData"
      ref="descriptionInfoRef"
    ></descriptionInfo>
    <imageInfo></imageInfo>
    <attributeInfo
      :schema-data="attributeData"
      class="attributeInfoRef"
      ref="attributeInfoRef"
    ></attributeInfo>
    <offerInfo
      :schema-data="offerData"
      class="AmazonOfferInfoRef"
      ref="AmazonOfferInfoRef"
    ></offerInfo>
    <div class="form-footer">
      <a-button style="margin-right: 20px">取消</a-button>
      <a-button type="primary" @click="sure">确定</a-button>
    </div>
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
import scheam from './TrainSets.json'
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({
  name: "addDialog"
})
let anchorList = [
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
]

const _attributeData = JSON.parse(JSON.stringify(scheam))
// 获取数据
function copyData() {
  return JSON.parse(JSON.stringify(scheam))
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
const baseInfoRef = ref()
const productInfoRef = ref()
const attributeInfoRef = ref()
// console.log({attributeInfoRef});
const baseData = ref(
  setAttributeData(productIdentityList).data
)
const productData = ref(
  setAttributeData(productIdentityList).data
)
const descriptionData = ref(
  setAttributeData(descriptionList).data
)
const attributeData = ref(
  getDetails()
  // setAttributeData(offerList).data
)
const offerData = ref(
  setAttributeData(offerList).data
)
function toHref(href) {
  document.querySelector(href).scrollIntoView({
    behavior: 'smooth'
  })
}
function sure() {
  baseInfoRef.value.formRef.validateFields().then(res => {
    console.log(res);
    
  }).catch(err => {
    console.log(err);
    
  }).finally(() => {
    console.log(333);
    
  });
  
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