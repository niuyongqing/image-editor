<!-- 公共的详情页, 基于 Ozon 产品详情页 -->
<template>
  <div class="bg-#fff p-6">
    <BaseInfo ref="baseInfoRef" />

    <SKUInfo ref="SKUInfoRef" />

    <ImageInfo ref="ImageInfoRef" />
  </div>
</template>

<script setup>
  import BaseInfo from './BaseInfo.vue'
  import SKUInfo from './SKUInfo.vue'
  import ImageInfo from './ImageInfo.vue'

  import { getDetailApi, updateProductDetailApi } from './api'
  import { lastAudit } from '~@/pages/product-review/config/api/product-review.js'
  import { message } from 'ant-design-vue'

  const store = useProductReviewStore()
  const route = useRoute()

  const baseInfoRef = ref()
  const SKUInfoRef = ref()
  const imageInfoRef = ref()

  /** 详情 */
  let detail = {}
  getDetail()
  function getDetail() {
    const id = route.query.id
    if (!id) {
      message.error('缺少详情id')
      return
    }

    getDetailApi(id).then(res => {
      detail = res.data || {}
      store.$patch(state => {
        state.productDetail = detail
        state.dataType = 'edit'
      })
    })
  }

  /** 保存 */
  async function save() {
    // 校验
    const baseInfoFlag = await baseInfoRef.value.childForm()
    const SKUFlag = SKUInfoRef.value.submitForm()
    if (!baseInfoFlag || !SKUFlag) {
      // message.error('')
      return
    }

    // 获取数据
    const baseInfoForm = baseInfoRef.value.baseInfoForm
    // 在外面那一层的字段
    const outerObj = {
      productId: baseInfoForm.id,
      productName: baseInfoForm.productName,
      prefixDecorateName: baseInfoForm.prefixDecorateName,
      suffixDecorateName: baseInfoForm.suffixDecorateName,
      categoryId: baseInfoForm.categoryId,
      vat: baseInfoForm.vat,
      competitiveInfos: baseInfoForm.competitiveInfos.filter(item => item.linkUrl).map(item => ({ linkUrl: item.linkUrl })),
      purchaseLinkUrls: baseInfoForm.purchaseLinkUrls
        .filter(item => item.linkUrl)
        .map(item => ({ linkUrl: item.linkUrl }))
        .join(',')
    }
    const submitAttributes = baseInfoRef.value.getSubmitAttributes()
    const skuList = SKUInfoRef.value.getSkuList()

    const params = {
      ...outerObj,
      mainImage: skuList[0].mainImages[0],
      attributes: submitAttributes,
      skuList
    }

    updateProductDetailApi(params).then(res => {
      message.success('保存成功')
      // FIXME:
      // setTimeout(() => {
      //   window.close(0)
      // }, 2000)
    })
  }

  const router = useRouter()
  /** 申请拍照 */
  function applicationPhoto() {
    const query = {
      id: detail.id,
      tradeName: detail.productName, //商品名称
      classify: detail.categoryId, //商品分类
      skuList: detail.skuCodes //商品SKU列表
    }

    const urlData = router.resolve({
      path: '/platform/product-review/pending-editing-application-photo',
      query
    })
    window.open(urlData.href, '_blank')
  }

  /** 提交终审 */
  function toFinalReview() {
    const params = {
      state: 50, // 待终审
      commodityId: detail.commodityId,
      remark: undefined
    }

    lastAudit(params).then(res => {
      message.success('提交终审成功')
    })
  }

  /** 暴露出克 */
  defineExpose({ save, applicationPhoto, toFinalReview })
</script>
