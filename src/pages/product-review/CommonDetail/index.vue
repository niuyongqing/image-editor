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
  import { message } from 'ant-design-vue'

  const store = useProductReviewStore()
  const route = useRoute()

  defineExpose({ save })

  const baseInfoRef = ref()
  const SKUInfoRef = ref()
  const imageInfoRef = ref()

  getDetail()
  function getDetail() {
    const id = route.query.id
    if (!id) {
      message.error('缺少详情id')
      return
    }

    getDetailApi(id).then(res => {
      const detail = res.data || {}
      store.$patch(state => {
        state.productDetail = detail
        state.dataType = 'edit'
      })
    })
  }

  // 保存
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
      productId: baseInfoForm.productId,
      productName: baseInfoForm.productName,
      prefixDecorateName: baseInfoForm.prefixDecorateName,
      suffixDecorateName: baseInfoForm.suffixDecorateName,
      categoryId: baseInfoForm.categoryId,
      vat: baseInfoForm.vat,
      mainImage: '',
      competitiveInfos: baseInfoForm.competitiveInfos.filter(item => item.linkUrl).map(item => ({ linkUrl: item.linkUrl })),
      purchaseLinkUrls: baseInfoForm.purchaseLinkUrls.filter(item => item.linkUrl).map(item => ({ linkUrl: item.linkUrl })).join(',')
    }
    const submitAttributes = baseInfoRef.value.getSubmitAttributes()
    const skuList = SKUInfoRef.value.getSkuList()

    const params = {
      ...outerObj,
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
</script>
