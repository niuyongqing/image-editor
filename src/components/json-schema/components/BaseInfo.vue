<template>
  <div>
    <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >
      <a-form-item label="店铺账号：" name="shopId" :required="true">
        <a-select ref="select" v-model:value="formState.shopId" @change="marketplaceIdChange" style="text-align: left">
          <a-select-option v-for="item in shopList" :key="item.id">{{ item.shopName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="站点选择：" name="countryCode" :required="true">
        <a-select ref="select" v-model:value="formState.countryCode" @change="countryCodeChange" style="text-align: left" placeholder="请选择需要发布的站点">
          <a-select-option v-for="item in countryCodeList" :key="item.countryCode">{{ item.countryZhName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item  label="商品名称" :rules="[{ required: true}]" >
        <a-textarea v-model:value="formState.itemName" :auto-size="{ minRows: 4, maxRows: 5 }" placeholder="请输入商品名称" :maxlength="200" :showCount="true"></a-textarea>
      </a-form-item>
      <a-form-item label="产品分类：" name="productType" :required="true" >
        <a-cascader  style="text-align: left" v-model:value="formState.productType" :options="productTypes" :load-data="loadProductTypes" :fieldNames="{ label: 'chineseName',   value: 'categoryId',  children: 'children'}" placeholder="请选择产品分类" @change="productTypeChange" change-on-select/>
      </a-form-item>
      <a-form-item label="产品类型关键字" >
        <a-textarea v-model:value="formState.itemTypeKeyword" :auto-size="{ minRows: 4, maxRows: 5 }"  placeholder="请输入产品类型关键字" :maxlength="20090" :showCount="true"></a-textarea>
      </a-form-item>
      <a-form-item label="产品变体"   :rules="[{ required: !variationsSelect}]">
        <a-spin :spinning="loading">
          <a-checkbox style="display: flex;margin-top: 5px" v-model:checked="variationsSelect" :disabled="variationsSelectDisable">此商品没有更多变体</a-checkbox>
          <div v-if="!variationsSelect">
            <a-row :gutter="24">
            <span v-for="item in variations">
              <a-col  :spa="2" v-if="scheam.properties[item.key.toLocaleLowerCase()]">
                <a-checkbox  style="display: flex;margin-top: 5px" v-model:checked="item.select" :disabled="item.disabled" @change="(val)=>selectVariationsFunc(item,val)">{{scheam.properties[item.key.toLocaleLowerCase()].title}}</a-checkbox>
              </a-col>
            </span>
            </a-row>
          </div>
        </a-spin>
      </a-form-item>
      <a-form-item label="品牌名称" :rules="[{ required: !brandSelect}]">
        <a-input :disabled="brandSelect"  v-model:value="formState.brand" placeholder="请输入品牌名称" :maxlength="100" :showCount="true"></a-input>
        <a-checkbox style="display: flex;margin-top: 5px" v-model:checked="brandSelect" @change="brandSelectFunc">此商品没有品牌名称</a-checkbox>
      </a-form-item>
      <a-form-item label="外部产品ID" :rules="[{ required: !externallyAssignedProductIdentifierSelect}]">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-input :disabled="externallyAssignedProductIdentifierSelect" v-model:value="formState.externallyAssignedProductIdentifier" placeholder="请输入外部产品ID" :maxlength="100"  :showCount="true"></a-input>
            </a-col>
            <a-col :span="12">
              <a-spin :spinning="loading">
                <a-select  ref="select" v-model:value="formState.externallyAssignedProductIdentifierType"  style="text-align: left;" :disabled="externallyAssignedProductIdentifierSelect" placeholder="示例：UPC">
                  <a-select-option v-if="json.properties" v-for="item in enumNames" :key="item">{{ item }}</a-select-option>
                </a-select>
              </a-spin>
            </a-col>
          </a-row>
        <a-checkbox style="display: flex;margin-top: 5px" v-model:checked="externallyAssignedProductIdentifierSelect">我没有商品编码</a-checkbox>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="js">
import {onMounted, ref,reactive} from "vue";
import {getJsonUrl, getMarketList, getProductTypes, getShopList} from "~/pages/amazon/js/api/activeProduct.js";
import axios from "axios";
const emit = defineEmits(['scheam']);

const props = defineProps({
  json:{required:true,type:JSON}
})
const variationsSelectDisable = ref(false) // 没有变体的分类禁用选择变体
let shopList = ref([]) // 店铺列表
let countryCodeList = ref([]);  // 站点列表
const productTypes = ref([]); // 产品类型
const brandSelect = ref(false) // 是否填写品牌
const variationsSelect = ref(false) // 是否填写变体
const externallyAssignedProductIdentifierSelect = ref(false) // 是否填写外部产品ID
const enumNames = ref([]) // 外部产品ID枚举类型
const variationTheme = ref([]) // 所有变体
const scheam = ref({})
const loading = ref(false)
const variations = ref([]) // 默认可选择变体
const formState = reactive({
  brand:"Generic",
  variations:false,
})

onMounted(async () => {
  let res = await getShopList()
  if (res.data && res.data.length) {
    shopList.value = res.data
    formState.shopId = res.data[0].id
    getCountryCode(res.data[0].id)
  }
})

// 变体切换与禁用
function selectVariationsFunc(item,val) {
  console.log(val.target.checked)
  for (let i=0;i<variationTheme.value.length;i++) {
    if(!variationTheme.value[i].includes(item.key.toLocaleString()) ){
      for (let x of variations.value) {
        if(!item.key.includes(x.key) && val.target.checked){
          x.disabled = !val.target.checked
          x.select = val.target.checked
        }
      }
    }
  }
}

// 重新设置品牌为默认
function brandSelectFunc() {
  formState.brand = "Generic"
}

// 获取站点
function getCountryCode(id) {
  getMarketList(id).then(res => {
    countryCodeList.value = res.data
  })
}

// 类别选择完成
function productTypeChange(value, selectedOptions) {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  if (targetOption.isLeaf) {
    let obj = countryCodeList.value.filter(i => i.countryCode === formState.countryCode)
    let params = {
      "productType": targetOption.productType,
      "marketId": obj[0].marketplaceId,
      "shopId": formState.shopId
    }
    loadVariations(params)
  }
}

async function loadVariations(params){
  loading.value = true
  let urlRes = await getJsonUrl(params)
  let url = urlRes.data || ''
  let res = await axios.get(url)
  scheam.value = res.data
  if(scheam.value.properties.variation_theme){
    variationsSelect.value = false
    variationsSelectDisable.value = false
    enumNames.value = res.data.properties.externally_assigned_product_identifier.items.properties.type.enumNames
    emit("scheam",scheam.value)
    variationTheme.value = scheam.value.properties.variation_theme.items.properties.name.enum;
    variations.value = []
    variations.value.push({key:'Size',select:false,disabled:false})
    variations.value.push({key:'Color',select:false,disabled:false})
    let temp = ['SIZE','COLOR']
    for (let i = 0; i < variationTheme.value.length; i++) {
      if(variationTheme.value[i] !== 'SIZE' && variationTheme.value[i] !== 'COLOR'){
        let split =  variationTheme.value[i].split("/")
        for (let j = 0; j < split.length; j++) {
          if(!temp.includes(split[j])){
            variations.value.push({key:split[j],select:false,disabled:false});
            temp.push(split[j])
          }
        }
      }
    }
  }else {
    if(!variationsSelect.value){
      variationsSelect.value = true
      variationsSelectDisable.value = true
    }
  }
  loading.value = false
}



async function loadProductTypes(selectedOptions) {
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  targetOption.children = await getProductTypesFn(targetOption.categoryId)
  targetOption.loading = false;
  productTypes.value = [...productTypes.value];
}

async function countryCodeChange(val) {
  productTypes.value = await getProductTypesFn()
}

function marketplaceIdChange(val) {

}

async function getProductTypesFn(categoryParentId) {
  let params = {
    keywords:"",
    site: formState.countryCode,
    categoryParentId: categoryParentId || 0
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


function onFinish(json) {

}

function onFinishFailed(error){

}
</script>
<style scoped lang="less">

</style>