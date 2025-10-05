<template>
  <div id="editDraftProduct" class="pr-14">
    <div class="w-19/20">
      <div flex w-full justify-between items-center>
        <div>
          <a-breadcrumb separator=">">
            <a-breadcrumb-item>Ozon</a-breadcrumb-item>
            <a-breadcrumb-item>采集箱</a-breadcrumb-item>
            <a-breadcrumb-item>编辑产品</a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div>
          <a-space>
            <!-- <a-dropdown>
              <a-button style="height: 32px; background-color: #f5f5f5; color: #434649">
                一键翻译
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="handleTranslationMenu">
                  <a-menu-item key="en"> 中文—>英文 </a-menu-item>
                  <a-menu-item key="ru"> 中文—>俄语 </a-menu-item>
                </a-menu>
              </template>
</a-dropdown> -->

            <a-button type="primary" @click="onSubmit(1)"
              style="height: 32px; background-color: #ff8345; color: #fff">保存并移入待发布</a-button>
            <a-button type="primary" @click="onSubmit(2)"
              style="height: 32px; background-color: #ff8345; color: #fff">保存</a-button>
            <a-button style="height: 32px; background-color: #096; color: #fff" @click="onSubmit(3)">
              发布
            </a-button>
          </a-space>
        </div>
      </div>

      <br />
      <!-- 基本信息 -->
      <ozon-base-info ref="ozonBaseInfoRef" id="ozonBaseInfo" :categoryAttributesLoading="categoryAttributesLoading"
        :shopList="shopList" :attributesCache="attributes" :productDetail="productDetail" @getAttributes="getAttributes"
        @sendShortCode="sendShortCode"></ozon-base-info>
      <br />
      <!-- ERP信息 -->
      <ErpInfo ref="erpInfoRef" :productDetail="productDetail" />

      <!-- 描述信息 -->
      <OzonNewImageInfo ref="ozonImageInfoRef" id="ozonNewImageInfo" :productDetail="productDetail"
        :shopCode="formData.shortCode">
      </OzonNewImageInfo>

      <!-- 变种信息. -->
      <OzonVariantInfo ref="ozonNewVariantInfoRef" id="ozonNewVariantInfo" :attributesCache="attributes"
        :productDetail="productDetail" :shopCode="formData.shortCode">
      </OzonVariantInfo>

      <div flex w-full justify-end items-center>
        <div mt-15px mb-30px>
          <a-space>
            <!-- <a-dropdown>
              <a-button style="height: 32px; background-color: #f5f5f5; color: #434649">
                一键翻译
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="handleTranslationMenu">
                  <a-menu-item key="en"> 中文—>英文 </a-menu-item>
                  <a-menu-item key="ru"> 中文—>俄语 </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown> -->

            <a-button type="primary" @click="onSubmit(1)"
              style="height: 32px; background-color: #ff8345; color: #fff">保存并移入待发布</a-button>
            <a-button type="primary" @click="onSubmit(2)"
              style="height: 32px; background-color: #ff8345; color: #fff">保存</a-button>
            <a-button style="height: 32px; background-color: #096; color: #fff" @click="onSubmit(3)"> 发布 </a-button>
          </a-space>
        </div>
      </div>
    </div>
    <div style="position: fixed; top: 12%; right: 3%">
      <a-timeline>
        <a-timeline-item v-for="item in anchorList" :key="item.id" :color="item.turnRed ? 'red' : 'blue'"><a-button
            type="text" :danger="item.turnRed" @click="scroll(item.id)">{{ item.label }}</a-button></a-timeline-item>
      </a-timeline>
    </div>
    <a-back-top :visibility-height="0" style="margin-right: 10px" @click="backToTop" />.

    <a-modal :open="publishVis" title="消息提示" @cancel="handleCancel" :width="'20%'" :maskClosable="false"
      :keyboard="false">
      <span>产品已提交发布，请在发布中、发布失败或在线产品中查看！</span>
      <template #footer>
        <a-button @click="handleCancel">关闭</a-button>
        <a-button type="primary" @click="handleOk">继续刊登</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup name="editProductPublish">
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { categoryAttributes, add, accountCache, tempSaveOrUpdate, templateList } from '../config/api/product'
import { ozonDraftDetail, saveToGatherBox, publishToPlatform, addToWaitPublish } from '../config/api/draft'
import OzonBaseInfo from './comm/OzonBaseInfo.vue'
import OzonVariantInfo from './comm/OzonVariantInfo.vue'
import OzonNewImageInfo from './comm/OzonNewImageInfo.vue'
import { useOzonProductStore } from '~@/stores/ozon-product'
import { findFalseInArrayLikeObject, getInputValue, getSelectValue, getMultiSelectValue, isNotEmpty, createAndUpdateBaseObj } from '~/pages/ozon/config/commJs/index'
import { saveTowaitProduct } from '../config/api/waitProduct'
import { message, Modal } from 'ant-design-vue'
import { UploadOutlined, DownOutlined } from '@ant-design/icons-vue'
import ErpInfo from './comm/erpInfo.vue'
import { translationApi, batchTranslationApi } from '~/api/common/translation'
import SelectProduct from '@/components/selectProduct/index.vue'

const collectProductId = ref('')
provide('collectProductId', collectProductId)

const route = useRoute()
const ozonBaseInfoRef = ref(null)
const ozonImageInfoRef = ref(null)
const ozonNewVariantInfoRef = ref(null)
const erpInfoRef = ref(null) // erp信息Dom
const attributes = ref([])
const shopList = ref([])
const productDetail = ref({})
const loading = ref(false)
const publishVis = ref(false)

const columns = [
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '引用模块',
    dataIndex: 'fieldValue',
    key: 'fieldValue'
  },
  {
    title: '创建时间',
    dataIndex: 'gmtCreate',
    key: 'gmtCreate'
  },
  {
    title: '操作',
    dataIndex: 'option',
    key: 'option'
  }
]
const dataSource = ref([])
const paginations = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const anchorList = ref([
  {
    turnRed: false,
    id: 'ozonBaseInfo',
    label: '基本信息'
  },
  {
    turnRed: false,
    id: 'ozonNewImageInfo',
    label: '描述信息'
  },
  {
    turnRed: false,
    id: 'ozonNewVariantInfo',
    label: 'sku信息'
  }
])
const categoryAttributesLoading = ref(false)
const formData = reactive({
  shortCode: ''
})
// 根据是否选择店铺后选择资料库
const sendShortCode = shortCode => {
  formData.shortCode = shortCode ? shortCode : null
}
const getProductDetail = (gatherProductId, account) => {
  formData.shortCode = account
  ozonDraftDetail({ gatherProductId, account }).then(res => {
    productDetail.value = res.data || {}
    collectProductId.value = res.data.sourceProductId
    getAttributes(res?.data.account, res?.data)
  })
}
const backToTop = () => {
  let elements = document.getElementsByClassName('ant-layout-content')
  if (elements) {
    elements[0].scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}
// 获取属性
const getAttributes = (account, cId) => {
  if (!account) {
    return
  }
  categoryAttributesLoading.value = true
  categoryAttributes({
    account,
    descriptionCategoryId: cId.categoryId ? cId.categoryId : cId.secondCategoryId,
    typeId: cId.typeId ? cId.typeId : cId.threeCategoryId
  })
    .then(res => {
      if (res.data) {
        attributes.value = res?.data ?? []
        const ozonStore = useOzonProductStore()
        ozonStore.$patch(state => {
          state.attributes = attributes.value
        })
      }
    })
    .finally(() => {
      categoryAttributesLoading.value = false
    })
}

const scrollTo = id => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
// 获取店铺列表
const getAccount = () => {
  accountCache().then(res => {
    if (res.data) {
      shopList.value =
        res?.data.map(item => {
          return {
            label: item.simpleName,
            value: item.account
          }
        }) ?? []
    }
  })
}

//  提交
const onSubmit = async type => {
  const ozonBaseInfo = await ozonBaseInfoRef.value.childForm()
  const OzonNewImageInfo = await ozonImageInfoRef.value.submitForm()
  const ozonNewVariantInfo = await ozonNewVariantInfoRef.value.submitForm()
  const errorIndex = findFalseInArrayLikeObject({ ozonBaseInfo, OzonNewImageInfo, ozonNewVariantInfo })

  const erpInfo = erpInfoRef.value

  anchorList.value.forEach(item => {
    item.turnRed = errorIndex.includes(item.id)
  })
  if (errorIndex.length) {
    scrollTo(errorIndex[0])
    message.error('信息填写有误！')
    return
  }

  let base = ozonBaseInfoRef.value.form
  let image = ozonImageInfoRef.value.form
  let tableDatas = ozonNewVariantInfoRef.value.tableData
  console.log("tableDatas", tableDatas);

  //! 过滤一些属性
  const newList = attributes.value.filter(
    a => !(a.id === 4080 || a.id == 8789 || a.id == 8790 || a.id == 4180 || a.id == 9024) && !(a.attributeComplexId == '100001' || a.attributeComplexId == '100002')
  )
  let warehouse = []
  tableDatas.forEach(item => {
    item?.warehouseList?.forEach(warehouseItem => {
      // 将 warehouse 数组中的每个元素添加到数组 b 中
      warehouse.push(warehouseItem)
    })
  })
  let newComplexAttributes = []
  //! 判断视频有没有上传
  const baseObj = {
    complexId: null,
    id: null,
    values: [
      {
        value: ''
      }
    ]
  }

  if (image.coverUrl !== '' && image.video.length > 0) {
    // 创建video对应的baseObj副本并更新value值
    let videoBaseObj = JSON.parse(JSON.stringify(baseObj))
    videoBaseObj = createAndUpdateBaseObj(image.coverUrl, 100002, 21845, type === 1 ? 1 : 2)
    newComplexAttributes.push(videoBaseObj)

    // 创建coverUrl对应的baseObj副本并更新value值
    let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj))
    coverUrlBaseObj = createAndUpdateBaseObj(image.video, 100001, 21841, type === 1 ? 1 : 2)
    newComplexAttributes.push(coverUrlBaseObj)
  } else if (image.coverUrl !== '') {
    let coverUrlBaseObj = JSON.parse(JSON.stringify(baseObj))
    coverUrlBaseObj = createAndUpdateBaseObj(image.coverUrl, 100002, 21845, type === 1 ? 1 : 2)
    newComplexAttributes.push(coverUrlBaseObj)
  } else if (image.video.length > 0) {
    let videoBaseObj = JSON.parse(JSON.stringify(baseObj))
    videoBaseObj = createAndUpdateBaseObj(image.video, 100001, 21841, type === 1 ? 1 : 2)
    newComplexAttributes.push(videoBaseObj)
  }
  console.log('newComplexAttributes', newComplexAttributes)
  const addHeaderList = useOzonProductStore().addHeaderList
  const resItem = tableDatas.map(item => {
    const moditAttributes = []
    const getDictionaryIdKey = 'dictionaryValueId'
    const getComplexIdKey = 'complexId'
    const createValueObj = (newId, newVal) => ({
      [getDictionaryIdKey]: newId || 0,
      value: newVal instanceof Array ? newVal.split(',') : newVal || ''
    })
    const createAttrItem = (attr, values) => ({
      id: attr.id,
      [getComplexIdKey]: attr.attributeComplexId,
      values
    })
    for (let attr of newList) {
      let newId = null
      let newVal = ''
      let mSlect = []
      // 根据属性类型进行处理
      switch (attr.selectType) {
        case 'input':
          newVal = getInputValue(attr, base, image, item)
          if (isNotEmpty(newVal)) {
            const inputValueObj = createValueObj(0, newVal)
            moditAttributes.push(createAttrItem(attr, [inputValueObj]))
          }
          break
        case 'select':
          ;[newId, newVal] = getSelectValue(attr, base, item)
          if (isNotEmpty(newVal)) {
            const selectValueObj = createValueObj(newId, newVal)
            moditAttributes.push(createAttrItem(attr, [selectValueObj]))
          }
          break
        case 'multSelect':
          mSlect = getMultiSelectValue(attr, item, base, createValueObj, 2)
          const filteredMSlect = mSlect.filter(obj => obj.value || obj?.dictionary_value_id !== 0 || obj?.dictionaryValueid !== 0)
          if (filteredMSlect.length) {
            moditAttributes.push(createAttrItem(attr, filteredMSlect))
          }
          break
      }
    }

    return {
      attributes: moditAttributes,
      complexAttributes: newComplexAttributes ?? null, // 非必填 100002-21845-封面视频 100001-21841-视频
      colorImage: item?.colorImg[0]?.url.replace('/prod-api', '') ?? '', // 非必填
      images: item.imageUrl && item.imageUrl.map(item => item.url.replace('/prod-api', '')),
      imageList: item.imageList,
      warehouseList: item?.warehouseList,
      offerId: item.sellerSKU,
      oldPrice: item.oldPrice, // 非必填
      price: item.price,
      weightUnit: 'g',
      dimensionUnit: 'mm',
      name: addHeaderList.includes('skuTitle') ? item.skuTitle : base.name,
      weight: item.packageWeight,
      height: item.packageHeight,
      depth: item.packageLength,
      width: item.packageWidth
    }
  })
  let params = {
    name: base.name,
    categoryId: base.categoryId.secondCategoryId,
    gatherProductId: productDetail.value.gatherProductId,
    account: base.shortCode,
    vat: base.vat,
    skuList: resItem,
    storeHistoryCategoryId: base?.categoryId?.storeHistoryCategoryId ? base?.categoryId?.storeHistoryCategoryId : '', //资料库分类ID
    // categoryId: base.categoryId.secondCategoryId, // 二级id
    typeId: base.categoryId.threeCategoryId, // 三级分id
    historyCategoryId: base.categoryId.threeCategoryId, // 三级分id

    customCategoryId: erpInfo.currentClass,
    sourceUrlList: erpInfo.sourceUrlList.map(item => item.sourceUrl)
  }
  console.log("params", params);

  loading.value = true
  if (type === 1) {
    //  保存并移入待发布
    saveToGatherBox(params).then(res => {
      message.success(res.msg)
      addToWaitPublish({
        account: base.shortCode, //店铺账号
        gatherProductId: productDetail.value.gatherProductId //采集箱产品id
      })
        .then(res => {
          message.success('移入待发布成功')
        })
        .finally(() => {
          loading.value = false
        })
    })
  } else if (type === 2) {
    //  保存
    saveToGatherBox(params)
      .then(res => {
        message.success(res.msg)
      })
      .finally(() => {
        loading.value = false
      })
  }
  else if (type === 3) {
    //  发布
    saveToGatherBox(params).then(res => {
      message.success(res.msg)
      publishToPlatform({
        account: base.shortCode,
        gatherProductId: productDetail.value.gatherProductId
      })
        .then(res => {
          message.success(res.msg)
        })
        .finally(() => {
          loading.value = false
        })
    })
  }
}

const handleCancel = () => {
  publishVis.value = false
  window.close()
}
const handleOk = () => {
  publishVis.value = false
  location.reload()
}
// 锚点滚动
const scroll = id => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' })
}
//  翻译
const handleTranslationMenu = ({ key }) => {
  const form = ozonBaseInfoRef.value.form || {}
  const descriptionForm = ozonImageInfoRef.value.form || {}
  // 调多次呗, 还能咋滴
  if (form.name) {
    translationApi({
      content: form.name, // 商品标题
      sourceCode: 'zh',
      destCode: key,
      scene: 'title'
    }).then(res => {
      if (res.code === 200) {
        form.name = res.msg
      }
    })
  }
  if (descriptionForm.description) {
    translationApi({
      content: descriptionForm.description, // 商品描述
      sourceCode: 'zh',
      destCode: key,
      scene: 'description'
    }).then(res => {
      if (res.code === 200) {
        descriptionForm.description = res.msg
      }
    })
  }
}

onMounted(() => {
  const { id, account } = route.query
  getProductDetail(id, account)
  getAccount()
})
</script>
<style lang="less" scoped></style>
