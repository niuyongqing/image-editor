<template>
  <div id="acquisitionEdit_index" class="acquisitionEdit_index">
    <div class="title">数据采集>编辑</div>
    <a-spin :spinning="spinning">
      <!-- 基本信息 -->
      <baseInfo :product-data="productInfo.data" v-model:base-info-data="formData.baseInfoData" />
      <br>
      <!-- 图片信息 -->
      <imageInfo :product-data="productInfo.data" v-model:image-info-data="formData.imageInfoData" />
      <br>
      <!-- 变种信息 -->
      <variantInfo :product-data="productInfo.data" v-model:variant-info-data="formData.variantInfoData" />
      <br>
      <!-- 描述信息 -->
      <descriptionInfo :product-data="productInfo.data" v-model:description-info-data="formData.descriptionInfoData" />
      <br>
      <!-- 包装运输 -->
      <packagingInfo :product-data="productInfo.data" v-model:packaging-info-data="formData.packagingInfoData" />
      <br>
      <div class="footer-box">
        <a-button type="primary" @click="saveForm">保存</a-button>
      </div>
    </a-spin>
    <div style="position: fixed; top: 11%; right: 10%;">
      <a-timeline>
        <a-timeline-item 
          v-for="item in anchorList" 
          :key="item.id" 
          :color="item.turnRed ? 'red' : 'blue'"
        >
          <a-button
            type="text" 
            :danger="item.turnRed" 
            @click="scroll(item.id)"
          >
            {{ item.label }}
          </a-button>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { useRoute } from 'vue-router';
import { productDetail, productUpdate } from './js/api';
import { v4 as uuidv4 } from 'uuid'

import baseInfo from './components/baseInfo.vue';
import imageInfo from './components/imageInfo.vue';
import variantInfo from './components/variantInfo.vue';
import descriptionInfo from './components/descriptionInfo.vue';
import packagingInfo from './components/packagingInfo.vue';
import { message } from 'ant-design-vue';
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

let anchorList = ref([
  {
    turnRed: false,
    id: 'acquisitionEdit_baseInfo',
    label: 'ERP信息',
  },
  {
    turnRed: false,
    id: 'acquisitionEdit_baseInfo',
    label: '产品信息',
  },
  {
    turnRed: false,
    id: 'acquisitionEdit_imageInfo',
    label: '图片信息',
  },
  {
    turnRed: false,
    id: 'acquisitionEdit_variantInfo',
    label: '变种属性',
  },
  {
    turnRed: false,
    id: 'acquisitionEdit_variantInfo',
    label: '变种信息',
  },
  {
    turnRed: false,
    id: 'acquisitionEdit_descriptionInfo',
    label: '描述信息',
  },
  {
    turnRed: false,
    id: 'acquisitionEdit_packagingInfo',
    label: '包装运输',
  },
]);
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
    let {
      id,
      platform,
      priceInfo,
      variantAttr2,
      packageInfo
    } = productInfo.data;
  
    let { header, tableData } = formData.variantInfoData;
    // 变种属性
    let variantAttr = {}
    header.forEach(item => {
      variantAttr[item.title] = [];
      tableData.forEach(i => {
        if (!variantAttr[item.title].includes(i[item.key].name)) {
          variantAttr[item.title].push(i[item.key].name)
        }
      })
    })
    // 变种信息
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
    // 包装运输信息
    let basePackageInfo = {}
    Object.keys(formData.packagingInfoData).forEach(key => {
      basePackageInfo[key] = formData.packagingInfoData[key] ? String(formData.packagingInfoData[key]) : undefined;
    })

    // 合并处理imagesList和imageList字段，确保所有需要的图片数组都正确初始化和处理
    let params = {
      id,
      platform,
      ...formData.baseInfoData,
      ...formData.imageInfoData,
      variantAttr,
      variantInfoList,
      ...formData.descriptionInfoData,
      packageInfo: {
        ...(packageInfo || {}),
        basePackageInfo,
      },
      imagesList: productInfo.data.imagesList?.map(item => ({
        ...item,
        image: item.image.replace('/prod-api', '')
      })),
      // 处理imageList字段，去除'/prod-api'前缀
      imageList: formData.imageInfoData?.imageList?.map(item => {
        if (item && typeof item === 'string') {
          return item.replace('/prod-api', '')
        }
        return item
      }) || []
    }

    if (params.imageList.length < 1) {
      scroll('acquisitionEdit_imageInfo');
      spinning.value = false;
      return message.error('请添加图片信息！');
    }
  console.log("params", params);
  await productUpdate(params);
  message.success('编辑成功！');
  // 刷新采集数据表格
  let uid = uuidv4();
  localStorage.setItem('urlAcquisition', uid);
} catch (error) {
console.error(error);
}
  spinning.value = false;
}
// 锚点滚动
const scroll = (id) => {
  // anchorList.value.forEach(i => {
  //   i.turnRed = id === i.id
  // })
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
}
</script>
<style lang="less" scoped>
.acquisitionEdit_index {
  height: 100%;
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