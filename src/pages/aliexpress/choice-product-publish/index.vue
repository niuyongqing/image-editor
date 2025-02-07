<!-- 全托管刊登页 -->
<template>
  <div class="choice-product-publish text-left">
    <a-spin :spinning="queryDetailLoading">
      <a-space class="mb-3 pr-4 w-full justify-end">
        <a-button
          :loading="saveLoading"
          @click="saveDraft"
          >保存草稿</a-button
        >
        <a-button
          type="primary"
          :loading="saveLoading"
          @click="submit"
          >提 交</a-button
        >
      </a-space>

      <BaseInfo ref="baseInfoRef" />
      <ImageInfo ref="imageInfoRef" />
      <SKUInfo ref="SKUInfoRef" />
      <ChoiceInfo ref="choiceInfoRef" />
      <Description ref="descriptionRef" />
      <Others ref="othersRef" />
      
      <a-space class="mt-3 pr-4 w-full justify-end">
        <a-button
          :loading="saveLoading"
          @click="saveDraft"
          >保存草稿</a-button
        >
        <a-button
          type="primary"
          :loading="saveLoading"
          @click="submit"
          >提交</a-button
        >
      </a-space>
    </a-spin>
  </div>
</template>

<script setup>
  import BaseInfo from './components/BaseInfo.vue'
  import ImageInfo from './components/ImageInfo.vue'
  import SKUInfo from './components/SKUInfo.vue'
  import ChoiceInfo from './components/ChoiceInfo.vue'
  import Description from './components/Description.vue'
  import Others from './components/Others.vue'

  import { createApi, detailApi, editApi, saveDraftApi } from '../apis/choice-product'
  import { draftListApi } from '../apis/choice-product-draft'
  import { useAliexpressChoiceProductStore } from '~@/stores/aliexpress-choice-product'
  import { Modal, message } from 'ant-design-vue'

  // 页面卸载前弹窗提醒
  onMounted(() => {
    window.addEventListener('beforeunload', stopUnload)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', stopUnload)
  })
  function stopUnload(e) {
    e.preventDefault()
    e.returnValue = ''
  }

  /** 编辑; 获取数据 */
  const query = useRoute().query
  const queryDetailLoading = ref(false)
  let draftId = undefined
  getDetail()

  function getDetail() {
    if (Object.keys(query).length === 0) return

    queryDetailLoading.value = true
    const store = useAliexpressChoiceProductStore()
    if (query.draftId) {
      // 草稿
      draftId = query.draftId
      draftListApi(query)
        .then(res => {
          const productDetail = res.rows[0] || {}
          store.$patch(state => {
            state.isEdit = true
            state.sellerId = productDetail.sellerId
            state.productDetail = productDetail
          })
        })
        .finally(() => {
          queryDetailLoading.value = false
        })
    } else {
      // 速卖通平台产品
      detailApi(query)
        .then(res => {
          const productDetail = res.data || {}
          store.$patch(state => {
            state.isEdit = true
            state.sellerId = query.sellerId
            state.productDetail = productDetail
          })
        })
        .finally(() => {
          queryDetailLoading.value = false
        })
    }
  }

  const baseInfoRef = ref()
  const imageInfoRef = ref()
  const SKUInfoRef = ref()
  const choiceInfoRef = ref()
  const descriptionRef = ref()
  const othersRef = ref()

  /** 保存草稿 */
  async function saveDraft() {
    // 基本信息
    const baseInfo = await baseInfoRef.value.emitData({ isDraft: true })
    // 图片信息
    const imageInfo = await imageInfoRef.value.emitData({ isDraft: true })
    // SKU 信息
    const SKUInfo = await SKUInfoRefInfoRef.value.emitData({ isDraft: true })
    // 全托管信息
    const choiceInfo = await choiceInfoRef.value.emitData({ isDraft: true })
    // 描述信息
    const description = await descriptionRef.value.emitData({ isDraft: true })
    // 其他信息
    const others = await othersRef.value.emitData({ isDraft: true })

    // 若有校验不通过
    if (!baseInfo || !imageInfo || !SKUInfo || !choiceInfo || !description || !others) {
      Modal.warning({ title: '请填写必填项' })

      return
    }

    const params = {
      draftId,
      ...baseInfo,
      ...imageInfo,
      ...SKUInfo,
      ...choiceInfo,
      ...description,
      productExtDto: {
        ...others,
        productType: baseInfo.productType
      }
    }
    delete params.productType

    saveLoading.value = true
    saveDraftApi(params)
      .then(_ => {
        message.success('保存成功')
        // 弹窗; 新建, 继续编辑
      })
      .finally(() => {
        saveLoading.value = false
      })
  }

  /** 提交 */
  const saveLoading = ref(false)
  async function submit() {
    // 基本信息
    const baseInfo = await baseInfoRef.value.emitData({ isDraft: false })
    // 图片信息
    const imageInfo = await imageInfoRef.value.emitData({ isDraft: false })
    // SKU 信息
    const SKUInfo = await SKUInfoRef.value.emitData({ isDraft: false })
    // 全托管信息
    const choiceInfo = choiceInfoRef.value.emitData({ isDraft: false })
    // 描述信息
    const description = await descriptionRef.value.emitData({ isDraft: false })
    // 其他信息
    const others = await othersRef.value.emitData({ isDraft: false })

    // 若有校验不通过
    if (!baseInfo || !imageInfo || !SKUInfo || !choiceInfo || !description || !others) {
      Modal.warning({ title: '请填写必填项' })

      return
    }

    const params = {
      ...baseInfo,
      ...imageInfo,
      ...SKUInfo,
      ...choiceInfo,
      ...description,
      productExtDto: {
        ...others,
        productType: baseInfo.productType
      }
    }
    // 如果是从草稿中发布的, 传入草稿 id, 发布成功后会删除该条草稿数据
    params.draftId = draftId
    params.productInfoDto.productId = query.productId
    delete params.productType

    saveLoading.value = true
    const requestApi = query.productId ? editApi : createApi
    requestApi(params)
      .then(_ => {
        store.$reset()
        message.success('提交成功')
        window.removeEventListener('beforeunload', stopUnload)
        setTimeout(() => {
          window.close()
        }, 300)
      })
      .finally(() => {
        saveLoading.value = false
      })
  }
</script>
