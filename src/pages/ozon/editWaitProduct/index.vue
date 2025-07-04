<template>
  <div id="editWaitProductCont" class="pr-14">
    <div class="w-19/20">
      <div class="flex justify-end mt-5">
        <a-button :loading="loading" class="ml-2.5" @click="onSubmit(2)">保存</a-button>
        <a-button :loading="loading" class="ml-2.5" @click="onSubmit(1)" type="primary">发布</a-button>
      </div>
      <br />
      <!-- 基本信息 -->
      <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo" :categoryAttributesLoading="categoryAttributesLoading"
        :shopList="shopList" :productDetail="productDetail" @sendShortCode="sendShortCode"
        @getAttributes="getAttributes"></ozon-base-info>
      <br />
      <!-- 描述信息 -->
      <ozon-new-image-info ref="ozonImageInfoRef" id="ozonNewImageInfo" :shopCode="formData.shortCode"
        :productDetail="productDetail"></ozon-new-image-info>

      <!-- 变种信息. -->
      <OzonNewVariantInfo ref="ozonNewVariantInfoRef" id="ozonNewVariantInfo" :productDetail="productDetail"
        :shopCode="formData.shortCode" class="mt-5"></OzonNewVariantInfo>
      <div class="flex justify-end mt-5">
        <a-button :loading="loading" class="ml-2.5" @click="onSubmit(2)">保存</a-button>
        <a-button :loading="loading" class="ml-2.5" @click="onSubmit(1)" type="primary">发布</a-button>
      </div>
    </div>
    <div style="position: fixed;top: 10%;right: 3%;">
      <a-timeline>
        <a-timeline-item v-for="item in anchorList" :key="item.id" :color="item.turnRed ? 'red' : 'blue'"><a-button
            type="text" :danger="item.turnRed" @click="scroll(item.id)">{{ item.label }}</a-button></a-timeline-item>
      </a-timeline>
    </div>
    <a-back-top :visibility-height="0" style="margin-right: 10px;" @click="backToTop" />
  </div>
</template>

<script setup name='editWaitProduct'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { ozonProductDetail, categoryAttributes, ozonProductEdit, productPublish } from "../config/api/waitProduct"
import { accountCache } from "../config/api/product";
import OzonBaseInfo from './comm/OzonBaseInfo.vue';
import OzonNewImageInfo from './comm/OzonNewImageInfo.vue';
import OzonNewVariantInfo from "./comm/OzonNewVariantInfo.vue"
import { useOzonProductStore } from '~@/stores/ozon-product'
import {
  findFalseInArrayLikeObject, getInputValue, getSelectValue, getMultiSelectValue,
  isNotEmpty, createAndUpdateBaseObj
} from '~/pages/ozon/config/commJs/index';
import { message } from "ant-design-vue";
import { skuList } from '~@/pages/lazada/product/api';

const ozonBaseInfoRef = ref(null)
const ozonImageInfoRef = ref(null)
const ozonNewVariantInfoRef = ref(null)
const waitId = ref("")
const attributes = ref([])
const shopList = ref([])
const productDetail = ref({})
const anchorList = ref([
  {
    turnRed: false,
    id: 'ozonBaseInfo',
    label: '基本信息',
  },
  {
    turnRed: false,
    id: 'ozonNewImageInfo',
    label: '描述信息',
  },
  {
    turnRed: false,
    id: 'ozonNewVariantInfo',
    label: 'sku信息',
  }
])
const categoryAttributesLoading = ref(false)
const loading = ref(false)
const formData = reactive({
  shortCode: ""
})
const backToTop = () => {
  let elements = document.getElementsByClassName('ant-layout-content');
  if (elements) {
    elements[0].scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
// 锚点滚动
const scroll = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
}
const getProductDetail = (waitId, account) => {
  ozonProductDetail({ account, waitId }).then(res => {
    productDetail.value = res?.data ?? {}
    getAttributes(res?.data.account, res?.data)
  })
}

// 根据是否选择店铺后选择资料库
const sendShortCode = (shortCode) => {
  formData.shortCode = shortCode ? shortCode : null;
}

// 获取店铺列表
const getAccount = () => {
  accountCache().then((res) => {
    if (res.data) {
      shopList.value = res?.data.map(item => {
        return {
          label: item.simpleName,
          value: item.account
        }
      }) ?? [];

    }
  });
}

// 获取属性
const getAttributes = (account, cId) => {
  if (!account) {
    return;
  }
  categoryAttributesLoading.value = true;
  categoryAttributes({
    account,
    descriptionCategoryId: cId.descriptionCategoryId ? cId.descriptionCategoryId : cId.secondCategoryId,
    typeId: cId.typeId ? cId.typeId : cId.threeCategoryId,
  }).then((res) => {
    if (res.data) {
      attributes.value = res?.data ?? [];
      const ozonStore = useOzonProductStore()
      ozonStore.$patch(state => {
        state.attributes = attributes.value
      })
    }
  })
    .finally(() => {
      categoryAttributesLoading.value = false;
    });
}

const scrollTo = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const onSubmit = async (type) => {
  const ozonBaseInfo = await ozonBaseInfoRef.value.childForm();
  const OzonNewImageInfo = await ozonImageInfoRef.value.submitForm();
  const ozonNewVariantInfo = await ozonNewVariantInfoRef.value.submitForm();
  const errorIndex = findFalseInArrayLikeObject({ ozonBaseInfo, OzonNewImageInfo, ozonNewVariantInfo })
  console.log('errorIndex', errorIndex);

  anchorList.value.forEach(item => {
    item.turnRed = errorIndex.includes(item.id)
  })
  if (errorIndex.length) {
    scrollTo(errorIndex[0])
    message.error("信息填写有误！");
    return
  }

  let base = ozonBaseInfoRef.value.form;
  let image = ozonImageInfoRef.value.form;
  let tableDatas = ozonNewVariantInfoRef.value.tableData;
  console.log('base', base);
  console.log('image', image);
  console.log('tableDatas', tableDatas);

  //! 过滤一些属性
  const newList = attributes.value.filter(
    (a) =>
      !(
        a.id === 4080 ||
        a.id == 8789 ||
        a.id == 8790 ||
        a.id == 4180 ||
        a.id == 9024
      ) &&
      !(
        a.attributeComplexId == "100001" || a.attributeComplexId == "100002"
      )
  );
  let warehouse = []
  tableDatas.forEach((item) => {
    item?.warehouseList?.forEach(warehouseItem => {
      // 将 warehouse 数组中的每个元素添加到数组 b 中
      warehouse.push(warehouseItem);
    });
  });
  let newComplexAttributes = [];
  //! 判断视频有没有上传
  const baseObj = {
    attributes: [
      {
        complexId: null,
        id: null,
        values: [
          {
            value: "",
          },
        ],
      },
    ],
  };

  if (image.coverUrl !== "" && image.video.length > 0) {
    // 创建video对应的baseObj副本并更新value值
    let videoBaseObj = JSON.parse(JSON.stringify(baseObj));
    videoBaseObj = createAndUpdateBaseObj(image.coverUrl, 100002, 21845, type === 1 ? 1 : 2);
    newComplexAttributes.push(videoBaseObj);

    // 创建coverUrl对应的baseObj副本并更新value值
    let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj));
    coverUrlBaseObj = createAndUpdateBaseObj(
      image.video,
      100001,
      21841, type === 1 ? 1 : 2
    );
    newComplexAttributes.push(coverUrlBaseObj);
  } else if (image.coverUrl !== "") {
    let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj));
    coverUrlBaseObj = createAndUpdateBaseObj(
      image.coverUrl,
      100002,
      21845, type === 1 ? 1 : 2
    );
    newComplexAttributes.push(coverUrlBaseObj);
  } else if (image.video.length > 0) {
    let videoBaseObj = JSON.parse(JSON.stringify(baseObj));
    videoBaseObj = createAndUpdateBaseObj(image.video, 100001, 21841, type === 1 ? 1 : 2);
    newComplexAttributes.push(videoBaseObj);
  }
  console.log("newComplexAttributes", newComplexAttributes);
  const addHeaderList = useOzonProductStore().addHeaderList
  const resItem = tableDatas.map((item) => {
    const moditAttributes = [];
    const getDictionaryIdKey = 'dictionaryValueId';
    const getComplexIdKey = 'complexId';
    const createValueObj = (newId, newVal) => ({
      [getDictionaryIdKey]: newId || 0,
      value: newVal instanceof Array ? newVal.split(",") : newVal || "",
    });
    const createAttrItem = (attr, values) => ({
      id: attr.id,
      [getComplexIdKey]: attr.attributeComplexId,
      values,
    });
    for (let attr of newList) {
      let newId = null;
      let newVal = "";
      let mSlect = [];
      // 根据属性类型进行处理
      switch (attr.selectType) {
        case "input":
          newVal = getInputValue(attr, base, image, item);
          if (isNotEmpty(newVal)) {
            const inputValueObj = createValueObj(0, newVal);
            moditAttributes.push(createAttrItem(attr, [inputValueObj]));
          }
          break;
        case "select":
          [newId, newVal] = getSelectValue(attr, base, item);
          if (isNotEmpty(newVal)) {
            const selectValueObj = createValueObj(newId, newVal);
            moditAttributes.push(createAttrItem(attr, [selectValueObj]));
          }
          break;
        case "multSelect":
          mSlect = getMultiSelectValue(
            attr,
            item,
            base,
            createValueObj, 2
          );
          const filteredMSlect = mSlect.filter(
            (obj) => obj.value || obj?.dictionary_value_id !== 0 || obj?.dictionaryValueid !== 0
          );
          if (filteredMSlect.length) {
            moditAttributes.push(createAttrItem(attr, filteredMSlect));
          }
          break;
      }
    }
    console.log("moditAttributes--", moditAttributes);

    return {
      attributes: moditAttributes,
      complexAttributes: newComplexAttributes ?? null, // 非必填 100002-21845-封面视频 100001-21841-视频
      colorImage: item?.colorImg[0]?.url.replace('/prod-api', '') ?? "", // 非必填
      images: item.imageUrl && item.imageUrl.map(item => item.url.replace('/prod-api', '')),
      warehouseList: item?.warehouseList,
      offerId: item.sellerSKU,
      oldPrice: item.oldPrice, // 非必填
      price: item.price,
      weightUnit: "g",
      dimensionUnit: "mm",
      name: addHeaderList.includes("skuTitle") ? item.name : base.name,
      weight: item.packageWeight,
      height: item.packageHeight,
      depth: item.packageLength,
      width: item.packageWidth,
    };
  });

  let params = {
    account: base.shortCode,
    vat: base.vat,
    skuList: resItem,
    waitId: waitId.value,
    // historyCategoryId: base?.categoryId?.threeCategoryId, //平台分类ID
    // storeHistoryCategoryId: base?.categoryId?.storeHistoryCategoryId
    //   ? base?.categoryId?.storeHistoryCategoryId
    //   : "", //资料库分类ID
    // historyAttributes: base.attributes,
    descriptionCategoryId:
      base.categoryId.secondCategoryId, // 二级id
    typeId: base.categoryId.threeCategoryId, // 三级分id
  }
  console.log('params', params);
  loading.value = true;
  
  if (type === 2) {
    ozonProductEdit(params).then(res => {
      message.success(res.msg)
      setTimeout(() => {
        window.close();
      }, 2000);
    })
      .finally(() => {
        loading.value = false;
      });
  } else {
    productPublish(params).then(res => {
      message.success(res.msg)
      setTimeout(() => {
        window.close();
      }, 2000);
    })
      .finally(() => {
        loading.value = false;
      });
  }
}


onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const rowId = urlParams.get('id');
  const rowAccount = urlParams.get('account');
  waitId.value = urlParams.get('id');
  getProductDetail(rowId, rowAccount)
  getAccount()
})
</script>
<style lang="less" scoped></style>