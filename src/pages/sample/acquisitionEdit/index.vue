<template>
<div id="acquisitionEdit_index" class="acquisitionEdit_index">
  <div class="title">数据采集>编辑</div>
  <a-spin :spinning="spinning">
    <!-- 基本信息 -->
    <baseInfo :product-data="productInfo.data" v-model:base-info-data="formData.baseInfoData"/>
    <br>
    <!-- 图片信息 -->
    <imageInfo :product-data="productInfo.data" v-model:image-info-data="formData.imageInfoData"/>
    <br>
    <!-- 变种信息 -->
    <variantInfo :product-data="productInfo.data" v-model:variant-info-data="formData.variantInfoData"/>
    <br>
    <!-- 描述信息 -->
    <descriptionInfo :product-data="productInfo.data" v-model:description-info-data="formData.descriptionInfoData"/>
    <br>
    <packagingInfo :product-data="productInfo.data" v-model:packaging-info-data="formData.packagingInfoData"/>
    <br>
    <div class="footer-box">
      <a-button type="primary" @click="saveForm">保存</a-button>
    </div>
  </a-spin>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRoute } from 'vue-router';
import { productDetail } from './js/api';

import baseInfo from './components/baseInfo.vue';
import imageInfo from './components/imageInfo.vue';
import variantInfo from './components/variantInfo.vue';
import descriptionInfo from './components/descriptionInfo.vue';
import packagingInfo from './components/packagingInfo.vue';
defineOptions({ name: "acquisitionEdit_index" })
const { proxy: _this } = getCurrentInstance()
const route = useRoute();
const spinning = ref(false)
const productInfo = reactive({
  id: '',
  data: null,
})
const formData = reactive({
  baseInfoData: {
    productCategoryId: '',
    spu: '',
    productTitle: '',
    originUrl: '',
  },
  imageInfoData: {
    imageList: [],
    videoList: [],
  },
  variantInfoData: {
    tableData: [],
    header: []
  },
  descriptionInfoData: {
    simpleDesc: '',
    detailDesc: '',
    detailImageList: []
  },
  packagingInfoData: {
    length: undefined, // 长
    width: undefined, // 宽
    height: undefined,  // 高
    weight: undefined,  // 重量
  }
})
onMounted(() => {
  // console.log(route.query);
  productInfo.id = route.query.id
  productDetailFn()
})
async function productDetailFn(params) {
  spinning.value = true;
  try {
    let res = await productDetail({ id: productInfo.id });
    // console.log({ res });
    res.data.classPlatform = 'public';     // 统一将所属平台改为公共平台
    productInfo.data = res.data
  } catch (error) {
    console.error(error)
  }
  spinning.value = false;
}
async function saveForm() {
  spinning.value = true;
  try {
    let res = await productDetail({ id: productInfo.id });
    let {
      id,
      platform,
      priceInfo,
      variantAttr2,
      status,
      packageInfo
    } = res.data;
  
    let { header, tableData } = formData.variantInfoData;
    let variantAttr = {}
    header.forEach(item => {
      variantAttr[item.title] = tableData.map(i => i[item.key].name)
    })
    let variantInfoList = tableData.map(item => {
      let obj = {
        "currency": priceInfo.currency,
        "currencySymbol": priceInfo.currencySymbol,
        "currentPrice": (item.currentPrice ?? 0) + '',
        "originalPrice": (item.originalPrice ?? 0) + '',
        "inventory": item.inventory,  //库存
        "skuCode": item.skuCode ?? '' //SKU编码
      }
      header.forEach(i => {
        obj[i.title] = item[i.key].name
      })
      return obj;
    })
  
    let params = {
      id,
      platform,
      priceInfo,
      ...formData.baseInfoData,
      ...formData.imageInfoData,
      variantAttr,
      variantInfoList,
      ...formData.descriptionInfoData,
      packageInfo: {
        ...(packageInfo || {}),
        basePackageInfo: { ...formData.packagingInfoData }
      },
      status,
    }
    console.log({params});
  } catch (error) {
    console.error(error)
  }
  spinning.value = false;
}
</script>
<style lang="less" scoped>
.acquisitionEdit_index {
  padding: 10px 15%;
  .title {
    text-align: left;
    margin-bottom: 10px;
  }
  .footer-box {
    display: flex;
    justify-content: flex-end;
  }
}
</style>