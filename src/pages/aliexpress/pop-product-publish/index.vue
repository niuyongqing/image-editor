<!-- POP 商品 刊登页 -->
<template>
  <div class="Pop-product-publish text-left">
    <a-spin :spinning="queryDetailLoading">
      <a-space class="mb-3 pr-4 w-full justify-end">
        <!-- 正式的商品编辑, 不显示保存到草稿 -->
        <!-- 有草稿ID则显示 -->
        <a-button
          v-if="!productDetail.productId"
          :loading="submitLoading"
          @click="saveDraft({ looseValidate: true })"
          >保存草稿</a-button
        >
        <a-button
          v-if="!(isSemiCustodial && !productDetail.productId)"
          type="primary"
          :loading="submitLoading"
          @click="submit"
          >提 交</a-button
        >
        <a-button
          v-if="isSemiCustodial && !productDetail.productId"
          type="primary"
          :loading="submitLoading"
          @click="saveDraft({ looseValidate: false })"
          >编辑半托管信息</a-button
        >
      </a-space>
      <BaseInfo ref="baseInfoRef" />
      <!-- <ImageInfo ref="imageInfoRef" />
      <PriceAndStock ref="priceAndStockRef" />
      <NationalQuote ref="nationalQuoteRef" /> -->
      <Description ref="descriptionRef" />
      <!-- <PackageInfo ref="packageInfoRef" />
      <TemplateInfo ref="templateInfoRef" />
      <Others ref="othersRef" /> -->
      <a-space class="mt-3 pr-4 w-full justify-end">
        <!-- 正式的商品编辑, 不显示保存到草稿 -->
        <!-- 有草稿ID则显示 -->
        <a-button
          v-if="!productDetail.productId"
          :loading="submitLoading"
          @click="saveDraft({ looseValidate: true })"
          >保存草稿</a-button
        >
        <a-button
          v-if="!(isSemiCustodial && !productDetail.productId)"
          type="primary"
          :loading="submitLoading"
          @click="submit"
          >提 交</a-button
        >
        <a-button
          v-if="isSemiCustodial && !productDetail.productId"
          type="primary"
          :loading="submitLoading"
          @click="saveDraft({ looseValidate: false })"
          >编辑半托管信息</a-button
        >
      </a-space>
    </a-spin>
  </div>
</template>

<script setup>
  import BaseInfo from './components/BaseInfo.vue'
  import ImageInfo from './components/ImageInfo.vue'
  import PriceAndStock from './components/PriceAndStock.vue'
  import NationalQuote from './components/NationalQuote.vue'
  import PackageInfo from './components/PackageInfo.vue'
  import TemplateInfo from './components/TemplateInfo.vue'
  import Description from './components/Description.vue'
  import Others from './components/Others.vue'

  import { addProductApi, productDetailApi, editProductApi, saveProductDraftsApi, editProductDraftsApi, popOneSubmitApi } from '../apis/product'
  import { useAliexpressPopProductStore } from '~@/stores/aliexpress-pop-product'
  import { Modal, message } from 'ant-design-vue'

  // 页面卸载前弹窗提醒
  /* onMounted(() => {
    window.addEventListener('beforeunload', stopUnload)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', stopUnload)
  })
  function stopUnload(e) {
    e.preventDefault()
    e.returnValue = ''
  } */

  /** 编辑; 获取数据 */
  const query = useRoute().query
  const queryDetailLoading = ref(false)
  const productDetail = ref({})
  let draftId = undefined
  getDetail()

  function getDetail() {
    if (Object.keys(query).length === 0) return

    queryDetailLoading.value = true
    const store = useAliexpressPopProductStore()
    if (query.draftId) {
      // 草稿
      /* draftId = query.draftId
      draftListApi(query)
        .then(res => {
          const detail = res.rows[0] || {}
          productDetail.value = detail
          store.$patch(state => {
            state.sellerId = detail.sellerId
            state.productDetail = detail
          })
        })
        .finally(() => {
          queryDetailLoading.value = false
        }) */
    } else {
      // 速卖通平台产品
      productDetailApi(query)
        .then(res => {
          const detail = res.data || {}
          productDetail.value = detail
          store.$patch(state => {
            state.sellerId = query.sellerId
            state.productDetail = detail
          })
        })
        .finally(() => {
          queryDetailLoading.value = false
        })
    }
  }

  const isSemiCustodial = ref(false)

  const baseInfoRef = ref()
  const imageInfoRef = ref()
  const priceAndStockRef = ref()
  const nationalQuoteRef = ref()
  const packageInfoRef = ref()
  const templateInfoRef = ref()
  const descriptionRef = ref()
  const othersRef = ref()

  /** 保存草稿 */
  async function saveDraft({ looseValidate = false }) {
    // 基本信息
    const baseInfo = await baseInfoRef.value.emitData({ looseValidate })
    // 图片信息
    const imageInfo = await imageInfoRef.value.emitData({ looseValidate })
    // 价格和库存
    const priceAndStock = await priceAndStockRef.value.emitData({ looseValidate })
    // 区域调价
    const nationalQuote = await nationalQuoteRef.value.emitData({ looseValidate })
    // 描述信息
    const description = await descriptionRef.value.emitData({ looseValidate })
    // 包装信息
    const packageInfo = await packageInfoRef.value.emitData({ looseValidate })
    // 模版信息
    const templateInfo = await templateInfoRef.value.emitData({ looseValidate })
    // 其他信息
    const others = await othersRef.value.emitData({ looseValidate })

    // 若有校验不通过
    if (!baseInfo || !imageInfo || !priceAndStock || !nationalQuote || !description || !templateInfo || !others) {
      Modal.warning({ title: '请填写必填项' })

      return
    }
    // 选择半托管则区域调价只能直接报价
    if (isSemiCustodial.value && nationalQuote.aeopNationalQuoteConfiguration.configurationType !== 'absolute') {
      Modal.warning('半托管商品区域定价的定价方式仅支持直接报价，如果你在商品编辑时使用了调整比例或其他方式进行价格设置，请调整为直接报价。')

      return
    }

    const params = {
      draftId: productDetail.value.draftId, // 速卖通草稿 id (产品 id)
      draftsId: productDetail.value.draftsId // uuid
    }
    const result = {
      ...baseInfo,
      ...imageInfo,
      ...priceAndStock,
      ...nationalQuote,
      ...description,
      ...packageInfo,
      ...templateInfo,
      ...others
    }
    // 存 ERP 的草稿数据包一层 result; 提交到速卖通的半托管一阶段数据不包
    if (looseValidate) {
      params.createTime = productDetail.value.createTime
      params.sellerId = baseInfo.sellerId
      params.result = result
    } else {
      Object.assign(params, result)
    }

    const submitLoading = ref(true)
    const saveDraftApi = looseValidate ? (productDetail.valuedraftsId ? editProductDraftsApi : saveProductDraftsApi) : popOneSubmitApi
    saveDraftApi(params)
      .then(res => {
        if (looseValidate) {
          message.success('保存成功')
        } else {
          // 跳转半托管
          const query = {
            sellerId: params.sellerId,
            draftsId: res.data.draftsId, // 给半托管传草稿的 uuid
            draftId: res.data.draftId, // 产品 id
            fromPath: productDetail.value.draftId ? 'Pop-product-draft' : 'Pop-product'
          }
          const router = useRouter()
          router.push({
            name: 'Pop-choice-product',
            params: query
          })

          window.removeEventListener('beforeunload', stopUnload)
          setTimeout(() => {
            window.close()
          }, 300)
        }
      })
      .finally(() => {
        submitLoading.value = false
      })
  }

  /** 提交 */
  const submitLoading = ref(false)
  async function submit() {
    // 基本信息
    /* const baseInfo = await baseInfoRef.value.emitData({ looseValidate: false })
    // 图片信息
    const imageInfo = await imageInfoRef.value.emitData({ looseValidate: false })
    // 价格和库存
    const priceAndStock = await priceAndStockRef.value.emitData({ looseValidate: false })
    // 区域调价
    const nationalQuote = await nationalQuoteRef.value.emitData({ looseValidate: false }) */
    // 描述信息
    const description = await descriptionRef.value.emitData({ looseValidate: false })
    console.log('description', description)
    return
    // 包装信息
    const packageInfo = await packageInfoRef.value.emitData({ looseValidate: false })
    // 模版信息
    const templateInfo = await templateInfoRef.value.emitData({ looseValidate: false })
    // 其他信息
    const others = await othersRef.value.emitData({ looseValidate: false })

    // 若有校验不通过
    if (!baseInfo || !imageInfo || !priceAndStock || !description || !packageInfo || !templateInfo || !others) {
      Modal.warning({ title: '请填写必填项' })

      return
    }
    // 选择半托管则区域调价只能直接报价
    if (isSemiCustodial.value && nationalQuote.aeopNationalQuoteConfiguration.configurationType !== 'absolute') {
      Modal.warning('半托管商品区域定价的定价方式仅支持直接报价，如果你在商品编辑时使用了调整比例或其他方式进行价格设置，请调整为直接报价。')

      return
    }

    const params = {
      productId: productDetail.value.productId,
      ...baseInfo,
      ...imageInfo,
      ...priceAndStock,
      ...nationalQuote,
      ...description,
      ...packageInfo,
      ...templateInfo,
      ...others
    }

    submitLoading.value = true
    const requestApi = productDetail.value.productId ? editProductApi : addProductApi
    requestApi(params)
      .then(res => {
        if (res.msg) {
          // 如果是由草稿发布的, 发布成功后删除该草稿
          if (productDetail.value.draftsId) {
            // this.$bus.$emit('delDraftAndRefresh', { draftsId: productDetail.value.draftsId })
          }
        }
      })
      .catch(err => {
        console.log('发布失败', err)
      })
      .finally(() => {
        submitLoading.value = false
      })
  }
</script>
