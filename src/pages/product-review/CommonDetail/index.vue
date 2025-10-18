<!-- 公共的详情页, 基于 Ozon 产品详情页 -->
<template>
  <div class="bg-#fff p-6 text-left">
    <BaseInfo ref="baseInfoRef" />

    <SKUInfo ref="SKUInfoRef" />

    <ImageInfo ref="ImageInfoRef" />

    <!-- 底部按钮 -->
    <a-space class="float-right mt-10">
      <a-button @click="close">关闭</a-button>

      <!-- 资料待编辑 -->
      <template v-if="isEditDetail">
        <a-button
          type="primary"
          :loading="saveLoading"
          @click="save"
          >保存</a-button
        >
        <a-button
          type="primary"
          :disabled="auditStatus !== 20"
          @click="applicationPhoto"
          >申请拍照</a-button
        >
        <a-button
          type="primary"
          :loading="reviewLoading"
          @click="toFinalReview"
          >提交终审</a-button
        >
      </template>

      <!-- 刊登待审核 -->
      <a-button
        v-else
        type="primary"
        @click="reviewOpen = true"
      >
        审核
      </a-button>
    </a-space>

    <!-- 回到顶部 -->
    <a-back-top :target="targetFn" />

    <!-- 审核弹窗 -->
    <a-modal
      v-model:open="reviewOpen"
      title="审核"
      centered
      :confirm-loading="reviewLoading"
      @cancel="reviewModalCancel"
      @ok="reviewModalOk"
    >
      <a-form
        :model="reviewForm"
        ref="reviewFormRef"
        layout="vertical"
      >
        <a-form-item name="auditStatus">
          <div class="text-center">
            <a-radio-group v-model:value="reviewForm.auditStatus">
              <a-radio
                :value="1"
                class="mr-4"
                >审核通过</a-radio
              >
              <a-radio :value="0">审核驳回</a-radio>
            </a-radio-group>
          </div>
        </a-form-item>

        <a-form-item
          name="remark"
          label="备注"
          :rules="[
            {
              required: reviewForm.auditStatus === 0,
              message: '请输入审核备注',
              trigger: 'blur'
            }
          ]"
        >
          <a-textarea
            v-model:value="reviewForm.remark"
            :rows="4"
            :maxlength="255"
            show-count
            allowClear
            placeholder="请输入审核备注（驳回时必填）"
          />
        </a-form-item>
      </a-form>
    </a-modal>
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

  provide('databaseId', route.query.commodityId)
  // 是否为资料待编辑详情
  const isEditDetail = computed(() => route.path === '/platform/product-review/data-for-editing-detail')
  const auditStatus = Number(route.query.auditStatus)

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

  function close() {
    window.close()
  }

  /** 保存 */
  const saveLoading = ref(false)
  async function save() {
    // 校验
    const baseInfoFlag = await baseInfoRef.value.childForm()
    const SKUFlag = SKUInfoRef.value.submitForm()
    !baseInfoFlag && message.error('请完善产品属性')
    if (!baseInfoFlag || !SKUFlag) return

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
        .map(item => item.linkUrl)
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

    saveLoading.value = true
    updateProductDetailApi(params)
      .then(res => {
        message.success('保存成功')

        refreshList()

        setTimeout(() => {
          window.close(0)
        }, 1000)
      })
      .finally(() => {
        saveLoading.value = false
      })
  }

  const router = useRouter()
  /** 申请拍照 */
  function applicationPhoto() {
    const query = {
      id: detail.commodityId,
      tradeName: detail.productName, //商品名称
      classify: detail.categoryId, //商品分类
      skuList: detail.skuCodes, //商品SKU列表
      productId: detail.id //商品ID
    }

    const urlData = router.resolve({
      path: '/platform/product-review/pending-editing-application-photo',
      query
    })
    window.open(urlData.href, '_blank')
  }

  /** 提交终审 */
  const reviewLoading = ref(false)
  function toFinalReview() {
    const params = [
      {
        auditStatus: 50, // 待终审
        id: detail.selectAuditId,
        commodityId: detail.commodityId,
        remark: undefined
      }
    ]

    reviewLoading.value = true
    lastAudit(params)
      .then(res => {
        message.success('提交终审成功')

        refreshList()

        setTimeout(() => {
          window.close()
        }, 1000)
      })
      .finally(() => {
        reviewLoading.value = false
      })
  }

  /** 审核弹窗 */
  const reviewOpen = ref(false)
  const reviewFormRef = ref()
  const reviewForm = reactive({
    auditStatus: 1,
    remark: ''
  })

  function reviewModalCancel() {
    reviewOpen.value = false
    reviewForm.auditStatus = 1
    reviewForm.remark = ''
  }

  function reviewModalOk() {
    reviewFormRef.value.validate().then(_ => {
      const params = [
        {
          auditStatus: reviewForm.auditStatus === 1 ? 60 : 70, // 60 终审完成; 70 运营驳回
          id: detail.id,
          commodityId: detail.commodityId,
          remark: reviewForm.remark
        }
      ]

      reviewLoading.value = true
      lastAudit(params)
        .then(res => {
          message.success('审核成功')
          reviewModalCancel()

          refreshList()

          setTimeout(() => {
            window.close()
          }, 1000)
        })
        .finally(() => {
          reviewLoading.value = false
        })
    })
  }

  /** 窗口通信, 刷新列表页 */
  const targetWindow = window.opener
  function refreshList() {
    if (targetWindow) {
      targetWindow.postMessage('refresh', targetWindow.location.origin)
    }
  }

  /** 返回需要监听其滚动事件的元素 */
  function targetFn() {
    // 编辑 ? 外层父元素 : 页面顶层元素
    return isEditDetail.value ? document.getElementById('common-detail') : document.querySelector('.ant-layout-content')
  }
</script>
