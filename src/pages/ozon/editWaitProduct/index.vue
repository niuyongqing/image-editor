<template>
  <div id="editWaitProductCont" class="pr-14">
    <div class="w-19/20">
      <div class="flex justify-end mt-5">
        <a-button class="mx-2.5" :loading="loading" size="middle" @click="showTempModal">存为模板</a-button>
        <a-dropdown size="middle">
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="1">
                引用现有产品
              </a-menu-item>
              <a-menu-item key="2" :disabled="!formData.shortCode">
                引用产品模板
              </a-menu-item>
              <a-menu-item key="3" :disabled="!formData.shortCode"> 
                引用资料库产品
              </a-menu-item>
            </a-menu>
          </template>
          <a-button size="middle">
            引用产品
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <a-button :loading="loading" size="middle" class="ml-2.5" @click="onSubmit(2)">保存</a-button>
        <a-button :loading="loading" size="middle" class="ml-2.5" @click="onSubmit(1)" type="primary">发布</a-button>
      </div>
      <br />
      <!-- 基本信息 -->
      <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo" :categoryAttributesLoading="categoryAttributesLoading"
        :shopList="shopList" :productDetail="productDetail" @sendShortCode="sendShortCode"
        @getAttributes="getAttributes"></ozon-base-info>
      <br />

      <!-- ERP信息 -->
      <ErpInfo ref="erpInfoRef" :productDetail="productDetail" />

      <!-- 描述信息 -->
      <ozon-new-image-info ref="ozonImageInfoRef" id="ozonNewImageInfo" :shopCode="formData.shortCode"
        :productDetail="productDetail"></ozon-new-image-info>

      <!-- 变种信息. -->
      <OzonNewVariantInfo ref="ozonNewVariantInfoRef" id="ozonNewVariantInfo" :productDetail="productDetail"
        :shopCode="formData.shortCode" :existProductData="existProductData" :databaseProduct="databaseProduct" class="mt-5" @getAttributes="getAttributes"></OzonNewVariantInfo>

      <div class="flex justify-end mt-5">
        <a-button class="mx-2.5" :loading="loading" size="middle" @click="showTempModal">存为模板</a-button>
        <a-dropdown size="middle">
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="1">
                引用现有产品
              </a-menu-item>
              <a-menu-item key="2" :disabled="!formData.shortCode">
                引用产品模板
              </a-menu-item>
              <a-menu-item key="3" :disabled="!formData.shortCode">
                引用资料库产品
              </a-menu-item>
            </a-menu>
          </template>
          <a-button size="middle">
            引用产品
            <DownOutlined />
          </a-button>
        </a-dropdown>
        <a-button :loading="loading" size="middle" class="ml-2.5" @click="onSubmit(2)">保存</a-button>
        <a-button :loading="loading" size="middle" class="ml-2.5" @click="onSubmit(1)" type="primary">发布</a-button>
      </div>
    </div>
    <div style="position: fixed;top: 10%;right: 3%;">
      <a-timeline>
        <a-timeline-item v-for="item in anchorList" :key="item.id" :color="item.turnRed ? 'red' : 'blue'"><a-button
            type="text" :danger="item.turnRed" @click="scroll(item.id)">{{ item.label }}</a-button></a-timeline-item>
      </a-timeline>
    </div>
    <a-back-top :visibility-height="0" style="margin-right: 10px;" @click="backToTop" />

    <a-modal :open="tempVis" title="存为模板" @cancel="closeModal" :width="'20%'" :maskClosable="false" :keyboard="false">
      <div class="my30px"><span>模板名称：</span><a-input style="width: 300px;" v-model:value="templateName"
          placeholder="请输入" />
      </div>
      <template #footer>
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" @click="saveTemplate">确定</a-button>
      </template>
    </a-modal>
    <a-modal :open="quoteVis" title="引用产品模板" :footer="null" @cancel="quoteVis = false" :width="'30%'"
      :maskClosable="false" :keyboard="false">
      <div class="my30px"><span>模板名称：</span><a-input style="width: 300px;" v-model:value="quoteTemplateName"
          placeholder="请输入" /><a-button class="ml-20px" type="primary">搜索</a-button></div>
      <a-divider />
      <a-table :dataSource="dataSource" :columns="columns" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'option'">
            <a-button type="link" @click="quoteTemp(record)">引用</a-button>
          </template>
        </template>
      </a-table>
      <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
        v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize" :total="paginations.total"
        class="pages" :show-quick-jumper="true" @change="getTemplateList" :showSizeChanger="true"
        :pageSizeOptions="[50, 100, 200]" />
    </a-modal>

    <!-- 现有产品 -->
    <existingProducts ref="existProduct" @handleSelect="handleSelect"></existingProducts>
    <!-- 产品资料库 -->
    <productDatabase ref="productDatabaseRef" @handleSelect="handleProductSelect"></productDatabase>
    <!-- 分类关联弹窗 -->
    <editCategoryModal ref="editCategoryModalRef" :relationType="3"  @feedBackData="feedBackData"></editCategoryModal>
  </div>
</template>

<script setup name='editWaitProduct'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { ozonProductDetail, categoryAttributes, ozonProductEdit, productPublish, relationProductDetail } from "../config/api/waitProduct"
import { accountCache, tempSaveOrUpdate, templateList, brandDatabase, relationDetail } from "../config/api/product";
import OzonBaseInfo from './comm/OzonBaseInfo.vue';
import OzonNewImageInfo from './comm/OzonNewImageInfo.vue';
import OzonNewVariantInfo from "./comm/OzonNewVariantInfo.vue"
import { useOzonProductStore } from '~@/stores/ozon-product'
import {
  findFalseInArrayLikeObject, getInputValue, getSelectValue, getMultiSelectValue,
  isNotEmpty, createAndUpdateBaseObj
} from '~/pages/ozon/config/commJs/index';
import { message } from "ant-design-vue";
import { DownOutlined, ArrowRightOutlined, SettingOutlined } from '@ant-design/icons-vue';
import existingProducts from "../common/existingProducts/index.vue";
import productDatabase from "~/components/productDatabase/index.vue";
import editCategoryModal from "../config/component/editCategoryModal/index.vue";
import ErpInfo from '@/pages/ozon/editDraftProduct/comm/erpInfo.vue';

const collectProductId = ref('')
provide('collectProductId', collectProductId)

const ozonBaseInfoRef = ref(null)
const erpInfoRef = ref(null) // erp信息Dom
const ozonImageInfoRef = ref(null)
const ozonNewVariantInfoRef = ref(null)
const ozonStore = useOzonProductStore()
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
const tempVis = ref(false)
const quoteVis = ref(false)
const templateName = ref("")
const quoteTemplateName = ref("")
const columns = [
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '引用模块',
    dataIndex: 'fieldValue',
    key: 'fieldValue',
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate',
  },
  {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
  },
]
const dataSource = ref([])
const existProduct = ref(null)
const existProductData = ref({})
const productDatabaseRef = ref(null)
const editCategoryModalRef = ref(null)  // 分类弹窗
const databaseId = ref("") //资料库ID
const databaseProduct = ref({}) //资料库数据

const paginations = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
})
const formData = reactive({
  shortCode: ""
})
// 注入现有产品数据
provide('existProductData', existProductData)
// 注入资料库产品数据
provide('databaseProduct', databaseProduct)
// 注入采集产品ID
provide('databaseId', databaseId)

// 现有产品
const handleSelect = (record) => {
  collectProductId.value = ""  // 此处清空是因为当数据是采集过来的时候，切换成现有产品的话也能打开引用采集的图片
  existProductData.value = record;
  ozonStore.$patch(state => {
    state.dataType = "existProduct"
  })
}

// 资料库
const handleProductSelect = (record) => {
  databaseId.value = record.commodityId
  // 需要优先调用查询是否有关联过分类
  relationDetail({ productCollectId: record.commodityId, platformName: "ozon" }).then(res => {
    // 当data为null时需要弹出关联分类的弹窗
    if(res.data == null) {
      editCategoryModalRef.value.open({
        account: formData.shortCode,
        id: record.commodityId,
        record
      })
    }else {
      let categoryObj = {
        secondCategoryId: res.data.categoryId,
        typeId: res.data.typeId,
      }
      feedBackData(categoryObj)
    }
  })

}

// 分类关联弹窗回调
const feedBackData = (categoryObj) => {
  let params = {
    account: formData.shortCode,  //账号不能为空
    commodityId: databaseId.value,  //资料库ID不能为空
    categoryId: categoryObj.secondCategoryId,  //ozon平台产品分类ID不能为空
    typeId: categoryObj.typeId    //ozon平台商品类型ID不能为空
  }
  categoryAttributesLoading.value = true

  relationProductDetail(params).then(res => {
    databaseProduct.value = res.data || {}
    ozonStore.$patch(state => {
      state.dataType = "database"
    })
  }).finally(() => {
    categoryAttributesLoading.value = false
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
const getProductDetail = (waitId, account) => {
  ozonProductDetail({ account, waitId }).then(res => {
    productDetail.value = res.data || {}
    collectProductId.value = res.data.collectProductId
    ozonStore.$patch(state => {
      state.dataType = "edit"
    })
    getAttributes(res?.data?.account, res?.data)
    ozonStore.$patch(state => {
      state.dataType = "edit"
    })
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

// 引用产品
const handleMenuClick = (e) => {
  if (e.key === '1') {
    existProduct.value.modalOpenFn();
  } else if (e.key === '2') {
    getTemplateList();
  }else if (e.key === '3') {
    productDatabaseRef.value.modalOpenFn();
  }
}

// 获取引用模板列表
const getTemplateList = () => {
  templateList({
    account: formData.shortCode,
    type: 1,
    name: quoteTemplateName.value,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,

  }).then(res => {
    if (res.code == 200) {
      message.success("查询成功！");
      dataSource.value = res.rows || []
      quoteVis.value = true;
      paginations.total = res.total || 0;
    }
  })
}

// 引用模板
const quoteTemp = (record) => {
  
  ozonStore.$patch(state => {
    state.productTemplate = {
      account: record.account,
      content: record.content,
      category: record.category
    }
  })
  quoteTemplateName.value = "";
  quoteVis.value = false;
}

// 获取属性
const getAttributes =  async (account, cId) => {
  if (!account) {
    return;
  }
  categoryAttributesLoading.value = true;
  await categoryAttributes({
    account,
    descriptionCategoryId: cId.descriptionCategoryId ? cId.descriptionCategoryId : cId.secondCategoryId,
    typeId: cId?.typeId ? cId.typeId : cId.threeCategoryId,
  }).then((res) => {
    if (res.data) {
      attributes.value = res?.data ?? [];
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

  const erpInfo = erpInfoRef.value;

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
  // console.log('base', base);
  // console.log('image', image);
  // console.log('tableDatas', tableDatas);

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
    complexId: null,
    id: null,
    values: [
      {
        value: "",
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
      name: addHeaderList.includes("skuTitle") ? item.skuTitle : base.name,
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

    customCategoryId: erpInfo.currentClass,
    sourceUrlList: erpInfo.sourceUrlList.map((item) => item.sourceUrl)
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