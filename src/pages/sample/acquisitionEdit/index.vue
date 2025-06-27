<template>
<div id="acquisitionEdit_index" class="acquisitionEdit_index">
  <div class="title">数据采集>编辑</div>
  <!-- 基本信息 -->
  <baseInfo :product-data="productInfo.data" v-model:base-info-data="formData.baseInfoData"/>
  <br>
  <!-- 图片信息 -->
  <imageInfo :product-data="productInfo.data" v-model:image-info-data="formData.imageInfoData"/>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRoute } from 'vue-router';
import { productDetail } from './js/api';

import baseInfo from './components/baseInfo.vue';
import imageInfo from './components/imageInfo.vue';
defineOptions({ name: "acquisitionEdit_index" })
const { proxy: _this } = getCurrentInstance()
const route = useRoute();
const productInfo = reactive({
  id: '',
  data: null,
})
const formData = reactive({
  baseInfoData: {},
  imageInfoData: {},
})
onMounted(() => {
  // console.log(route.query);
  productInfo.id = route.query.id
  productDetailFn()
})
async function productDetailFn(params) {
  try {
    let res = await productDetail({ id: productInfo.id });
    // console.log({ res });
    res.data.classPlatform = 'public';     // 统一将所属平台改为公共平台
    productInfo.data = res.data
  } catch (error) {
    console.error(error)
  }
}
</script>
<style lang="less" scoped>
.acquisitionEdit_index {
  padding: 10px 15%;
  .title {
    text-align: left;
    margin-bottom: 10px;
  }
}
</style>