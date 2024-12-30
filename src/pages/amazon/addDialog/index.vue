<template>
<div id="addDialog" class="addDialog">
  <div class="main-content">
    <baseInfo
      :schema-data="baseData"
      class="baseInfoRef"
      ref="baseInfoRef"
      @selectedProductType="selectedProductType"
    ></baseInfo>
    <a-spin :spinning="!!spinning">
      <productInfo
        v-if="formData.product.$id"
        :key="formData.product.$_key"
        :schema-data="formData.product"
        v-model:modelForm="form.product"
        @formMounted="formMounted"
        @formValueChange="formValueChange"
        class="productInfoRef"
        ref="productInfoRef"
      ></productInfo>
      <descriptionInfo
        v-if="formData.description.$id"
        :key="formData.description.$_key"
        :schema-data="formData.description"
        v-model:modelForm="form.description"
        @formMounted="formMounted"
        @formValueChange="formValueChange"
        ref="descriptionInfoRef"
      ></descriptionInfo>
      <imageInfo></imageInfo>
      <attributeInfo
        v-if="formData.attribute.$id"
        :key="formData.attribute.$_key"
        :schema-data="formData.attribute"
        v-model:modelForm="form.attribute"
        @formMounted="formMounted"
        @formValueChange="formValueChange"
        class="attributeInfoRef"
        ref="attributeInfoRef"
      ></attributeInfo>
      <offerInfo
        v-if="formData.offer.$id"
        :key="formData.offer.$_key"
        :schema-data="formData.offer"
        v-model:modelForm="form.offer"
        @formMounted="formMounted"
        @formValueChange="formValueChange"
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
import { ref, reactive, onMounted, computed, watchPostEffect, getCurrentInstance, nextTick } from 'vue'
import { getJsonUrl, validateJson } from '@/pages/amazon/js/api/activeProduct'
import axios from "axios";
// 判断对象是否相等
class ObjectUtils{
  getDataType(data) {
    const temp = Object.prototype.toString.call(data);
    const type = temp.match(/\b\w+\b/g);
    return (type.length < 2) ? 'Undefined' : type[1];
  }
  iterable(data){
    return ['Object', 'Array'].includes(this.getDataType(data));
  }
  isObjectChangedSimple(source, comparison){
    const _source = JSON.stringify(source)
    const _comparison = JSON.stringify({...source,...comparison})
    return _source !== _comparison
  }
  isObjectChanged(source, comparison) {
    if (!this.iterable(source)) {
      throw new Error(`source should be a Object or Array , but got ${this.getDataType(source)}`);
    }
    if (this.getDataType(source) !== this.getDataType(comparison)) {
      return true;
    }
    const sourceKeys = Object.keys(source);
    const comparisonKeys = Object.keys({...source, ...comparison});
    if (sourceKeys.length !== comparisonKeys.length) {
      return true;
    }
    return comparisonKeys.some(key => {
      if (this.iterable(source[key])) {
        return this.isObjectChanged(source[key], comparison[key]);
      } else {
        return source[key] !== comparison[key];
      }
    });
  }
}

defineOptions({
  name: "addDialog",
});
let _this = null; // 当前的vue实例
onMounted(() => {
  let { proxy } = getCurrentInstance()
  _this = proxy
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
const spinning = ref(0)       // 是否加载完成
const scheam = ref({})
const _attributeData = ref({})     // 原始数据
const jsonParams = ref({}); // 获取json链接的参数

const baseInfoRef = ref()
const productInfoRef = ref()
const attributeInfoRef = ref()
const descriptionInfoRef = ref()
const offerInfoRef = ref()
// console.log({attributeInfoRef});
const baseData = ref({})
// const productData = ref({})
// const descriptionData = ref({})
// const attributeData = ref({})
// const offerData = ref({})

const finalParams = ref({});    // 收集到的全部json参数
// const productForm = ref({})
// const descriptionForm = ref({})
// const attributeForm = ref({})
// const offerForm = ref({})
const formData = reactive({ // 用于生成表单的数据
  product: {},
  description: {},
  attribute: {},
  offer: {},
})
const form = reactive({     // 实时表单数据
  product: {},
  description: {},
  attribute: {},
  offer: {},
});
const formValue = reactive({     // 表单更新之前的数据，用于回填
  product: {},
  description: {},
  attribute: {},
  offer: {},
}) 

watchPostEffect(() => {
  // finalParams.value = {
  //   ...descriptionForm.value,
  //   ...productForm.value,
  //   ...attributeForm.value,
  //   ...offerForm.value,
  // };
  // console.log(spinning.value);
  
  // if (!spinning.value && spinning.value !== 0) {
  //   console.log(123);
    
  //   // validateJsonFn();
  // }
});
// 表单的值发生改变
function formValueChange(type) {
  finalParams.value = {
    ...form.product,
    ...form.description,
    ...form.attribute,
    ...form.offer,
  };
  console.log(spinning.value);
  
  if (!spinning.value && spinning.value !== 0) {
    // console.log({_this});
    attributeChangeValidate(type);
  }
}
// form加载完成触发
function formMounted(type) {
  if (productInfoRef.value.isComplete && attributeInfoRef.value.isComplete && descriptionInfoRef.value.isComplete && offerInfoRef.value.isComplete) {
    spinning.value = false
  }
  console.log('表单完成加载', {formValue, type});
  // return;
  let keys = Object.keys(formValue[type])
  if (keys.length < 1) return;
  // 表单回填
  _this.$refs[`${type}InfoRef`].updateForm(formValue[type])
  
  // if (productInfoRef.value.isComplete) {
  //   spinning.value = false
  // }
};
// 属性变更校验
async function attributeChangeValidate(val) {
  // console.log({val});
  let data = {
    productType: jsonParams.value.productType,
    content: finalParams.value
  }
  try {
    let res = await validateJson(data)
    let final = res.data
    // let keyList = final.map(i => {
    //   return i.arguments[0]
    // })
    // console.log({ keyList }, _attributeData.value.properties);
    let arr = Object.keys(_attributeData.value.properties)
    let add = []    // 新增字段
    let del = []    // 删除字段
    final.forEach(item => {
      if (item.type === 'required') {
        let key = item.arguments[0]
        if (scheam.value.properties[key] && !arr.includes(key)) {
          add.push(key)
        }
      } else if (item.type === 'not') {
        let key = item.path.split('.')[1]
        if (key.includes('[')) {
          key = key.split('[')[0]
        }
        if (scheam.value.properties[key] && arr.includes(key)) {
          del.push(key)
        }
      }
    })
    // keyList.forEach(key => {
    //   if (scheam.value.properties[key] && !arr.includes(key)) {
    //     add.push(key)
    //   }
    // })
    console.log({add, del});
    
    if (add.length > 0 || del.length > 0) {
      // console.log({add}, _this);
      formValue[val] = form[val]
      let addScheam = JSON.parse(JSON.stringify(scheam.value))
      Object.keys(addScheam.properties).forEach(key => {
        if (!add.includes(key)) {
          delete addScheam.properties[key]
        }
        if (del.includes(key)) {
          delete formData[val].properties[key]
        }
      })
      let $_key = createRandom()
      formData[val].$_key = $_key
      formData[val].properties = {
        ...formData[val].properties,
        ...addScheam.properties
      }
    }
    // 更新属性
    Object.keys(formData).forEach(item => {
      _attributeData.value.properties = {
        ..._attributeData.value.properties,
        ...formData[item].properties
      }
    })
    // _attributeData.value.properties = {
    //   ...productData.value.properties,
    //   ...descriptionData.value.properties,
    //   ...attributeData.value.properties,
    //   ...offerData.value.properties,
    // }
    
    return final
  } catch (error) {
    console.log(error);
    spinning.value = false
  }
}
// 校验必填属性
async function validateJsonFn() {
  let data = {
    productType: jsonParams.value.productType,
    content: finalParams.value
  }
  try {
    let res = await validateJson(data)
    let final = res.data
    let keyList = final.map(i => {
      return i.arguments[0]
    })
    // console.log({ keyList }, _attributeData.value.properties);
    let arr = Object.keys(_attributeData.value.properties)
    arr.forEach(key => {
      if (!keyList.includes(key)) {
        delete _attributeData.value.properties[key]
      }
    })
    formData.product = setAttributeData(productIdentityList).data
    formData.description = setAttributeData(descriptionList).data
    formData.attribute = getDetails()
    formData.offer = setAttributeData(offerList).data
    return final
  } catch (error) {
    console.log(error);
    spinning.value = false
  }
}
// 选中属性
async function selectedProductType(val) {
  jsonParams.value = val
  spinning.value = true
  let urlRes = await getJsonUrl(val)
  let url = urlRes.data || ''
  // console.log({ url });
  let res = await axios.get(url)
  scheam.value = res.data
  _attributeData.value = JSON.parse(JSON.stringify(scheam.value))
  formData.product = {}
  formData.description = {}
  formData.attribute = {}
  formData.offer = {}
  finalParams.value = {}

  formData.product = {}
  formData.description = {}
  formData.attribute = {}
  formData.offer = {}
  await validateJsonFn()
  // spinning.value = false
}
// 获取数据
function copyData() {
  return JSON.parse(JSON.stringify(_attributeData.value))
}
let productIdentity = {}
let description = {}
let offer = {}
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
  // let flag = productResult
  let flag = (offerResult && productResult && attributeResult && descriptionResult)
  if (!flag) return;
  finalParams.value = {
    ...offerParams,
    ...productParams,
    ...attributeParams,
    ...descriptionParams
  }
  let data = {
    productType: jsonParams.value.productType,
    content: finalParams.value
  }
  let final = await validateJson(data)
  console.log({final});
}
// 找出对应属性
function filterType(title, data) {
  
  let list = data.filter(item => {
    // console.log({title}, item.title);
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
  let obj = {};  // 收集属性
  // debugger
  let _data = handleFormItem(copyData().properties, []);   // 将属性转换成数组
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
  // console.log({obj});
  
  data.properties = obj
  data.$_key = createRandom()
  return {data, propertiesList}
}
// 生成一个随机数
function createRandom() {
  return Math.floor(Math.random() * 100000000) + ''
}
// 处理数据，使其变成数组结构
function handleFormItem(data, requiredList) {
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