<template>
<div id="acquisitionEdit_index" class="acquisitionEdit_index">
  <div class="title">数据采集>编辑</div>
  <!-- 基本信息 -->
  <baseInfo :product-data="productInfo.data" v-model:base-info-data="formData.baseInfoData"></baseInfo>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRoute } from 'vue-router';
import { productDetail } from './js/api';

import baseInfo from './components/baseInfo.vue';
defineOptions({ name: "acquisitionEdit_index" })
const { proxy: _this } = getCurrentInstance()
const route = useRoute();
const productInfo = reactive({
  id: '',
  data: null,
})
const formData = reactive({
  baseInfoData: {},
})
onMounted(() => {
  // console.log(route.query);
  productInfo.id = route.query.id
  productDetailFn()
})
async function productDetailFn(params) {
  try {
    let res = await productDetail({ id: productInfo.id });
    console.log({ res });
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