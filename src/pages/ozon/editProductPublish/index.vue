<template>
  <div id="editProductPublishCont" class="pr-14">
    <div class="w-19/20">
      <div class="flex justify-end mt-5">
        <a-button :loading="loading" size="middle" @click="showTempModal">存为模板</a-button>
        <!-- <a-button class="mx-2.5" @click="onSubmit(2)" size="middle">保存待发布</a-button> -->
        <a-button type="primary" :loading="loading" class="mx-2.5" size="middle" @click="onSubmit(1)">更新</a-button>
      </div>
      <br />
      <!-- 基本信息 -->
      <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo" :categoryAttributesLoading="categoryAttributesLoading"
        :shopList="shopList" :attributesCache="attributes" :productDetail="productDetail"></ozon-base-info>
      <br />

      <!-- ERP信息 -->
      <ErpInfo ref="erpInfoRef" :productDetail="productDetail" />

      <!-- 描述信息 -->
      <OzonNewImageInfo ref="ozonImageInfoRef" id="ozonNewImageInfo" :productDetail="productDetail"
        :shopCode="formData.shortCode">
      </OzonNewImageInfo>

      <!-- 变种信息. -->
      <OzonVariantInfo ref="ozonNewVariantInfoRef" id="ozonNewVariantInfo" :attributesCache="attributes"
        :productDetail="productDetail">

      </OzonVariantInfo>
      <div class="flex justify-end mr-5 mt-5">
        <a-button :loading="loading" size="middle" @click="showTempModal">存为模板</a-button>
        <!-- <a-button :loading="loading" @click="onSubmit(2)" size="middle" class="ml-2.5">保存待发布</a-button> -->
        <a-button type="primary" :loading="loading" size="middle" @click="onSubmit(1)" class="ml-2.5">更新</a-button>
      </div>
    </div>
    <div style="position: fixed;top: 12%;right: 3%;">
      <a-timeline>
        <a-timeline-item v-for="item in anchorList" :key="item.id" :color="item.turnRed ? 'red' : 'blue'"><a-button
            type="text" :danger="item.turnRed" @click="scroll(item.id)">{{ item.label }}</a-button></a-timeline-item>
      </a-timeline>
    </div>
    <a-back-top :visibility-height="0" style="margin-right: 10px;" @click="backToTop" />
    <a-modal :open="publishVis" title="消息提示" @cancel="handleCancel" :width="'20%'" :maskClosable="false"
      :keyboard="false">
      <span>产品已提交发布，请在发布中、发布失败或在线产品中查看！</span>
      <template #footer>
        <a-button @click="handleCancel">关闭</a-button>
        <a-button type="primary" @click="handleOk">继续刊登</a-button>
      </template>
    </a-modal>
    <a-modal :open="tempVis" title="存为模板" @cancel="closeModal" :width="'20%'" :maskClosable="false" :keyboard="false">
      <div class="my30px"><span>模板名称：</span><a-input style="width: 300px;" v-model:value="templateName"
          placeholder="请输入" />
      </div>
      <template #footer>
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" @click="saveTemplate">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup name='editProductPublish'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { getDetail, categoryAttributes, add, accountCache, tempSaveOrUpdate } from "../config/api/product"
import OzonBaseInfo from './comm/OzonBaseInfo.vue';
import OzonVariantInfo from './comm/OzonVariantInfo.vue';
import OzonNewImageInfo from "./comm/OzonNewImageInfo.vue";
import { useOzonProductStore } from '~@/stores/ozon-product'
import {
  findFalseInArrayLikeObject, getInputValue, getSelectValue, getMultiSelectValue,
  isNotEmpty
} from '~/pages/ozon/config/commJs/index';
import { saveTowaitProduct } from "../config/api/waitProduct"
import { message, Modal } from "ant-design-vue";
import ErpInfo from '@/pages/ozon/editDraftProduct/comm/erpInfo.vue';

const collectProductId = ref('')
provide('collectProductId', collectProductId)

const ozonBaseInfoRef = ref(null)
const erpInfoRef = ref(null) // erp信息Dom
const ozonImageInfoRef = ref(null)
const ozonNewVariantInfoRef = ref(null)
const attributes = ref([])
const shopList = ref([])
const productDetail = ref({})
const loading = ref(false)
const publishVis = ref(false)
const anchorList = ref([
  {
    turnRed: false,
    id: 'ozonBaseInfo',
    label: '基本信息',
  },
  {
    turnRed: false,
    id: 'ozonNewImageInfo',
    label: '图片信息',
  },
  {
    turnRed: false,
    id: 'ozonNewVariantInfo',
    label: 'sku信息',
  }
])
const categoryAttributesLoading = ref(false)
const tempVis = ref(false)
const templateName = ref("")
const formData = reactive({
  shortCode: ""
})

const showTempModal = () => {
  if (!formData.shortCode) {
    message.error("请先选择店铺！");
    return
  }
  tempVis.value = true;
}

const saveTemplate = async () => {
  if (!templateName.value) {
    message.error("请输入模板名称！");
    return
  }
  let base = ozonBaseInfoRef.value.form;
  let image = ozonImageInfoRef.value.form;
  let tableDatas = ozonNewVariantInfoRef.value.tableData;
  let params = {
    type: 1, //模板类型 1-产品模板  2-尺码模板 3-变种模板 4-富内容模板
    id: null, // id 为null  新增  不为null 是修改
    name: templateName.value, // 模板名称
    state: 1, // 状态是否生效  0-不生效 1-生效
    account: formData.shortCode,
    categoryId: base.categoryId || {},
    content: {
      productTemplate: {
        productAttr: base.attributes || {},
        productDesc: image.description || ""
      },
      jsonRich: image.jsons || {}
    }
  }
  console.log("params", params);

  tempSaveOrUpdate(params).then(res => {
    if (res.code == 200) {
      message.success("保存成功！");
    }
  }).finally(() => {
    tempVis.value = false;
  })
}

const closeModal = () => {
  tempVis.value = false;
  templateName.value = "";
}

const getProductDetail = (offerIds, account) => {
  formData.shortCode = account
  getDetail({ account, offerIds }).then(res => {
    productDetail.value = res?.data ?? {}
    collectProductId.value = res.data.collectProductId
    getAttributes(account, res?.data?.typeId, res?.data?.descriptionCategoryId)
  })
}
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
// 获取属性
const getAttributes = (account, typeId, descriptionCategoryId) => {
  categoryAttributesLoading.value = true;
  categoryAttributes({
    account,
    descriptionCategoryId,
    typeId,
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

const isObjectProperty = (obj, prop) => {
  const value = obj[prop];
  return value instanceof Object && !(value instanceof Array);
}

const onSubmit = async (type = 1) => {
  const ozonBaseInfo = await ozonBaseInfoRef.value.childForm();
  const OzonNewImageInfo = await ozonImageInfoRef.value.submitForm();
  const ozonNewVariantInfo = await ozonNewVariantInfoRef.value.submitForm();
  const errorIndex = findFalseInArrayLikeObject({ ozonBaseInfo, OzonNewImageInfo, ozonNewVariantInfo })
  const erpInfo = erpInfoRef.value;

  anchorList.value.forEach(item => {
    item.turnRed = errorIndex.includes(item.id)
  })
  if (errorIndex.length > 0) {
    scrollTo(errorIndex[0])
    message.error("信息填写有误！");
    return
  }

  let base = ozonBaseInfoRef.value.form;
  let image = ozonImageInfoRef.value.form;
  let tableDatas = ozonNewVariantInfoRef.value.tableData;

  console.log('base', base);
  // console.log('image', image);
  console.log('tableDatas', tableDatas);
  let hisAttr = {}
  const source = base.attributes;
  for (const key in source) {
    if (Object.hasOwnProperty.call(source, key)) {
      let value = source[key];

      // 解包 ref
      if (isRef(value)) {
        value = value.value;
      }
      // 获取 reactive 的原始对象
      else if (isReactive(value)) {
        value = toRaw(value);
      }

      // 过滤无效值
      if (value != null && value !== '') {
        hisAttr[key] = key === '品牌(Бренд)' || key === '服装和鞋类品牌(Бренд в одежде и обуви)' ? '无品牌' : value;
      }
    }
  }
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
    item.warehouseList.forEach(warehouseItem => {
      // 将 warehouse 数组中的每个元素添加到数组 b 中
      warehouseItem.offerId = item.sellerSKU
      warehouse.push(warehouseItem);
    });
  });
  let newComplexAttributes = [];
  //! 判断视频有没有上传
  const baseObj = {
    attributes: [
      {
        complex_id: null,
        id: null,
        values: [
          {
            value: "",
          },
        ],
      },
    ],
  };
  const baseObj2 = {
    complex_id: null,
    id: null,
    values: [
      {
        value: "",
      },
    ],
  };

  if (image.coverUrl !== "" && image.video.length > 0) {
    // 创建video对应的baseObj副本并更新value值
    let videoBaseObj = JSON.parse(JSON.stringify(type === 1 ? baseObj : baseObj2));
    videoBaseObj = createAndUpdateBaseObj(image.coverUrl, 100002, 21845, type === 1 ? 1 : 2);
    newComplexAttributes.push(videoBaseObj);

    // 创建coverUrl对应的baseObj副本并更新value值
    let coverUrlBaseObj = JSON.parse(JSON.stringify(type === 1 ? baseObj : baseObj2));
    coverUrlBaseObj = createAndUpdateBaseObj(
      image.video,
      100001,
      21841, type === 1 ? 1 : 2
    );
    newComplexAttributes.push(coverUrlBaseObj);
  } else if (image.coverUrl !== "") {
    let coverUrlBaseObj = JSON.parse(JSON.stringify(type === 1 ? baseObj : baseObj2));
    coverUrlBaseObj = createAndUpdateBaseObj(
      image.coverUrl,
      100002,
      21845, type === 1 ? 1 : 2
    );
    newComplexAttributes.push(coverUrlBaseObj);
  } else if (image.video.length > 0) {
    let videoBaseObj = JSON.parse(JSON.stringify(type === 1 ? baseObj : baseObj2));
    videoBaseObj = createAndUpdateBaseObj(image.video, 100001, 21841, type === 1 ? 1 : 2);
    newComplexAttributes.push(videoBaseObj);
  }
  // console.log("newComplexAttributes", newComplexAttributes);

  const resItem = tableDatas.map((item) => {
    const moditAttributes = [];
    const getDictionaryIdKey = type === 1 ? 'dictionary_value_id' : 'dictionaryValueId';
    const getComplexIdKey = type === 1 ? 'complex_id' : 'complexId';
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
          let inputValueObj = {}
          if (isNotEmpty(newVal)) {
            inputValueObj = createValueObj(0, newVal);
            moditAttributes.push(createAttrItem(attr, [inputValueObj]));
          } else if (item.hasOwnProperty(attr.name)) {
            inputValueObj = createValueObj(0, item[attr.name]);
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
            createValueObj,
            type
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
    // console.log("moditAttributes--", moditAttributes);


    return {
      attributes: moditAttributes,
      complex_attributes: newComplexAttributes ?? null, // 非必填 100002-21845-封面视频 100001-21841-视频
      color_image: item?.colorImg[0]?.url ?? "", // 非必填
      images: item.imageUrl && item?.imageUrl?.map(e => e.url),
      imageList: item.imageList,
      offer_id: item.sellerSKU,
      old_price: item.oldPrice, // 非必填
      price: item.price,
      min_price: item.minPrice,
      dimension_unit: "mm",
      weight_unit: "g",
      depth: item.packageLength,
      height: item.packageHeight,
      weight: item.packageWeight,
      width: item.packageWidth,
      vat: base.vat,
      name: base.name,
      description_category_id:
        base.categoryId.secondCategoryId, // 二级id
      type_id: base.categoryId.threeCategoryId, // 三级分id
    };

  });
  let params = {
    account: base.shortCode,
    items: resItem,
    warehouseList: warehouse,
    historyCategoryId: base?.categoryId?.threeCategoryId, //平台分类ID
    historyAttributes: hisAttr,  //hisAttr
    customCategoryId: erpInfo.currentClass,
    sourceUrlList: erpInfo.sourceUrlList.map((item) => item.sourceUrl),
    isUpdate: true
  };
  console.log('params', params);
  loading.value = true;
  add(params).then((res) => {
    message.success(res.msg);
    publishVis.value = true
  })
    .finally(() => {
      loading.value = false;
    });
}

// 处理视频格式
const createAndUpdateBaseObj = (targetObj, complexId, id, type) => {
  // 统一属性命名格式
  const keyStyle = type === 1 ? "snake" : "camel";

  // 映射属性名
  const keyMap = {
    complexId: keyStyle === "snake" ? "complex_id" : "complexId",
    dictionaryValueId:
      keyStyle === "snake" ? "dictionary_value_id" : "dictionaryValueId",
  };
  // 100001 多个视频
  // 100002 单个视频
  // 通用值处理逻辑
  const processValues = () => {
    if (complexId === 100002) {
      // return [{ [keyMap.dictionaryValueId]: 0, value: targetObj.replace('/prod-api', '') }];
      return [
        {
          [keyMap.dictionaryValueId]: 0,
          value: targetObj,
        },
      ];
    }
    return (Array.isArray(targetObj) ? targetObj : []).map((item) => ({
      [keyMap.dictionaryValueId]: 0,
      // value: item?.url?.replace('/prod-api', '') || null // 添加空值保护
      value: item?.url || null,
    }));
  };

  return type == 1 ? {
    attributes: [
      {
        [keyMap.complexId]: complexId,
        id: id,
        values: processValues(),
      },
    ],
  } : {
    [keyMap.complexId]: complexId,
    id: id,
    values: processValues(),
  };
};

const handleCancel = () => {
  publishVis.value = false
  window.close();
}
const handleOk = () => {
  publishVis.value = false
  location.reload();
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const rowId = urlParams.get('id');
  const offerIds = rowId ? JSON.parse(decodeURIComponent(rowId)) : [];
  const rowAccount = urlParams.get('account');
  getProductDetail(offerIds, rowAccount)
  getAccount()
})
</script>
<style lang="less" scoped></style>