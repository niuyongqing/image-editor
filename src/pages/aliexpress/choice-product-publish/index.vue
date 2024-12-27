<!-- 全托管刊登页 -->
<template>
  <div class="choice-product-publish text-left">
    <a-space class="mb-3 pr-4 w-full justify-end">
      <!-- <a-button :loading="saveDraftLoading" @click="saveDraft">保存草稿</a-button> -->
      <a-button
        type="primary"
        :loading="saveLoading"
        @click="submit"
        >提交</a-button
      >
    </a-space>
    <BaseInfo ref="baseInfoRef" />
    <ImageInfo ref="imageInfoRef" />
    <SKUInfo ref="SKUInfoRef" />
    <ChoiceInfo ref="choiceInfoRef" />
    <Description ref="descriptionRef" />
    <Others ref="othersRef" />
    <a-space class="mt-3 pr-4 w-full justify-end">
      <!-- <a-button :loading="saveDraftLoading" @click="saveDraft">保存草稿</a-button> -->
      <a-button
        type="primary"
        :loading="saveLoading"
        @click="submit"
        >提交</a-button
      >
    </a-space>
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
  import { Modal, message } from 'ant-design-vue'

  const baseInfoRef = ref()
  const imageInfoRef = ref()
  const SKUInfoRef = ref()
  const choiceInfoRef = ref()
  const descriptionRef = ref()
  const othersRef = ref()

  // 提交
  const saveLoading = ref(false)
  function submit() {
    // 基本信息
    const baseInfo = baseInfoRef.value.emitData({ isDraft: false })
    // 图片信息
    const imageInfo = imageInfoRef.value.emitData({ isDraft: false })
    // SKU 信息
    const SKUInfo = SKUInfoRef.value.emitData({ isDraft: false })
    // 全托管信息
    const choiceInfo = choiceInfoRef.value.emitData({ isDraft: false })
    // 描述信息
    const description = descriptionRef.value.emitData({ isDraft: false })
    // 其他信息
    const others = othersRef.value.emitData({ isDraft: false })

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
    params.draftId = productDetail.value.draftId
    params.productInfoDto.productId = query.productId
    delete params.productType

    console.log('params', params)
    return

    saveLoading.value = true
    const requestApi = query.productId ? editApi : createApi
    requestApi(params)
      .then(_ => {
        message.success('提交成功')
        handleClose()
      })
      .finally(() => {
        saveLoading.value = false
      })
  }
</script>
