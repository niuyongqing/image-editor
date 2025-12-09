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
        <a-button @click="translateOpen = true">翻译</a-button>
        <a-button
          type="primary"
          :loading="saveLoading"
          @click="beforeSave(save)"
          >保存</a-button
        >
        <a-button
          type="primary"
          :disabled="auditStatus !== 20 || disabledPhoto"
          @click="applicationPhoto"
          >申请拍照</a-button
        >
        <a-button
          v-if="hasEditPermi"
          type="primary"
          :loading="reviewLoading"
          @click="beforeSave(toFinalReview)"
          >保存并提交终审</a-button
        >
      </template>

      <!-- 刊登待审核 -->
      <a-button
        v-if="!isEditDetail && hasPermi"
        type="primary"
        @click="reviewOpen = true"
      >
        审核
      </a-button>
    </a-space>

    <!-- 回到顶部 -->
    <a-back-top :target="targetFn" />

    <!-- 翻译弹窗 -->
    <a-modal
      v-model:open="translateOpen"
      title="翻译"
      :mask-closable="false"
      :confirm-loading="translateLoading"
      @cancel="translateCancel"
      @ok="translate"
    >
      <a-form
        :model="translateForm"
        :label-col="{ style: { width: '80px' } }"
        ref="translateFormRef"
      >
        <a-form-item label="翻译语种">
          <div class="flex">
            <a-select
              v-model:value="translateForm.sourceLanguageCode"
              :options="SOURCE_LANGUAGE_OPTIONS"
              placeholder="请选择源语言"
            />
            <span class="mx-2">→</span>
            <a-form-item-rest>
              <a-select
                v-model:value="translateForm.targetLanguageCode"
                :options="TARGET_LANGUAGE_OPTIONS"
                placeholder="请选择目标语言"
              />
            </a-form-item-rest>
          </div>
        </a-form-item>

        <a-form-item
          name="field"
          label="翻译内容"
          :rules="[
            {
              required: true,
              type: 'array',
              min: 1,
              message: '请选择翻译字段',
              trigger: 'change'
            }
          ]"
        >
          <a-checkbox-group
            v-model:value="translateForm.field"
            :options="FIELD_OPTIONS"
          />
        </a-form-item>
      </a-form>
    </a-modal>

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
            allow-clear
            placeholder="请输入审核备注（驳回时必填）"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
  import BaseInfo from './components/BaseInfo.vue'
  import SKUInfo from './components/SKUInfo.vue'
  import ImageInfo from './components/ImageInfo.vue'

  import { getDetailApi, updateProductDetailApi } from './api'
  import { yandexTranslateApi } from '@/api/common/translate.js'
  import { lastAudit, auditApi } from '~@/pages/product-review/config/api/product-review.js'
  import { message, Modal } from 'ant-design-vue'
  import { checkPermi, checkRole } from '~/utils/permission/component/permission.js'

  const store = useProductReviewStore()
  const route = useRoute()

  provide('databaseId', { value: route.query.commodityId })
  // 权限校验
  // 是否为资料待编辑详情
  const hasPermi = computed(() => checkPermi(['platform:ozon:intelligent:first:audit']) || checkRole('admin'))
  const hasEditPermi = computed(() => checkPermi(['platform:ozon:intelligent:edit:audit']) || checkRole('admin'))
  const isEditDetail = computed(() => route.path === '/platform/product-review/data-for-editing-detail')
  const auditStatus = Number(route.query.auditStatus)

  const baseInfoRef = ref()
  const SKUInfoRef = ref()
  const imageInfoRef = ref()

  /** 详情 */
  let detail = {}
  getDetail()
  function getDetail() {
    const id = route.query.intelligentProductId
    if (!id) {
      message.error('缺少详情id')
      return
    }

    getDetailApi(id).then(res => {
      detail = res.data || {}
      store.$patch(state => {
        state.detail = detail
      })
    })
  }

  function close() {
    window.close()
  }

  /** 翻译 */
  const rawAttributes = computed(() => store.attributes)

  const translateLoading = ref(false)
  const translateOpen = ref(false)
  const translateForm = reactive({
    sourceLanguageCode: 'zh',
    targetLanguageCode: 'ru',
    field: []
  })
  const translateFormRef = ref()

  const SOURCE_LANGUAGE_OPTIONS = [
    { label: '中文', value: 'zh' },
    { label: '英语', value: 'en' }
  ]
  const TARGET_LANGUAGE_OPTIONS = [{ label: '俄语', value: 'ru' }]
  const FIELD_OPTIONS = [
    { label: '产品属性', value: '1' },
    { label: 'JSON富文本', value: '2' },
    { label: '变种属性', value: '3' }
  ]

  function translateCancel() {
    translateOpen.value = false

    translateForm.sourceLanguageCode = 'zh'
    translateForm.targetLanguageCode = 'ru'
    translateFormRef.value.resetFields()
  }

  function translate() {
    translateFormRef.value.validate().then(_ => {
      const attributesObj = baseInfoRef.value.attributesObj
      const form = baseInfoRef.value.form
      const filteredAspectList = SKUInfoRef.value.filteredAspectList

      const contentJSON = {}
      const attributes = []
      const jsons = []
      const aspects = []
      // 产品属性
      if (translateForm.field.includes('1')) {
        const stringNameList = rawAttributes.value.filter(item => item.selectType === 'input' && item.type === 'String').map(item => item.name)
        stringNameList.forEach(name => {
          const value = attributesObj[name]
          if (containsLanguage(value, translateForm.sourceLanguageCode)) {
            attributes.push({ name, value })
          }
        })
      }
      // JSON富文本
      if (translateForm.field.includes('2')) {
        jsons.push(...collectJsonFields(form.jsons))
      }
      // 变种属性
      if (translateForm.field.includes('3')) {
        filteredAspectList.forEach(item => {
          const stringNameList = item.columns
            .slice(0, -1)
            .filter(col => col.selectType === 'input' && col.type === 'String')
            .map(col => col.name)
          stringNameList.forEach(name => {
            item.tableData.forEach(row => {
              // const value = row[name]
              const value = row[name].value
              if (containsLanguage(value, translateForm.sourceLanguageCode)) {
                aspects.push(value)
              }
            })
          })
        })
      }

      // 校验
      if (attributes.length === 0 && jsons.length === 0 && aspects.length === 0) {
        message.warning('所选内容中不包含可翻译的文本')
        return
      }

      contentJSON.attributes = attributes.length > 0 ? attributes.map(item => item.value) : undefined
      contentJSON.jsons = jsons.length > 0 ? jsons : undefined
      contentJSON.aspects = aspects.length > 0 ? aspects : undefined

      const params = {
        sourceLanguageCode: translateForm.sourceLanguageCode,
        targetLanguageCode: translateForm.targetLanguageCode,
        contentJSON
      }

      // 调用翻译接口
      translateLoading.value = true
      yandexTranslateApi(params)
        .then(res => {
          const data = res.data || []
          if (attributes.length > 0) {
            const targetAttributes = data.filter(item => item.name === 'attributes')
            attributes.forEach((item, i) => {
              attributesObj[item.name] = targetAttributes[i].value
            })
          }

          if (jsons.length > 0) {
            const targetJsons = data.filter(item => item.name === 'jsons').map(item => item.value)
            form.jsons = replaceJsonFields(form.jsons, targetJsons)
          }

          if (aspects.length > 0) {
            const targetAspects = data.filter(item => item.name === 'aspects').map(item => item.value)
            let i = 0
            filteredAspectList.forEach(item => {
              const stringNameList = item.columns
                .slice(0, -1)
                .filter(col => col.selectType === 'input' && col.type === 'String')
                .map(col => col.name)
              stringNameList.forEach(name => {
                item.tableData.forEach(row => {
                  const value = row[name].value
                  if (containsLanguage(value, translateForm.sourceLanguageCode)) {
                    row[name].value = targetAspects[i]
                    i++
                  }
                })
              })
            })
          }

          message.success('翻译成功')
          translateOpen.value = false
          translateCancel()
        })
        .finally(() => {
          translateLoading.value = false
        })
    })
  }

  // 判断文本中是否包含 中文/英语
  function containsLanguage(text, language) {
    if (!text) return false

    let regex
    if (language === 'zh') {
      regex = /[\u4e00-\u9fff]/
    } else if (language === 'en') {
      regex = /[a-zA-Z]/
    } else {
      return false
    }

    return regex.test(text)
  }

  // 收集 jsons 中待翻译的字段
  function collectJsonFields(jsonStr) {
    if (!jsonStr) return []

    try {
      const jsonArray = JSON.parse(jsonStr).content || []
      const fields = []
      jsonArray.forEach(item => {
        // 文本
        if (item.widgetName === 'raTextBlock') {
          if (item.title.content.length) {
            const str = item.title.content.join('\n')
            if (containsLanguage(str, translateForm.sourceLanguageCode)) {
              fields.push(str)
            }
          }
          if (item.text.content.length) {
            const str = item.text.content.join('\n')
            if (containsLanguage(str, translateForm.sourceLanguageCode)) {
              fields.push(str)
            }
          }
        } else {
          // raShowcase 图片和图文共用, 除 roll(图片)外是图文
          if (item.type !== 'roll') {
            item.blocks.forEach(block => {
              if (block.title.content.length) {
                const str = block.title.content.join('\n')
                if (containsLanguage(str, translateForm.sourceLanguageCode)) {
                  fields.push(str)
                }
              }
              if (block.text.content.length) {
                const str = block.text.content.join('\n')
                if (containsLanguage(str, translateForm.sourceLanguageCode)) {
                  fields.push(str)
                }
              }
            })
          }
        }
      })
      return fields
    } catch (err) {
      console.error(err)
      return []
    }
  }

  // 替换 jsons 中被翻译的字段
  function replaceJsonFields(jsonStr, targets) {
    let i = 0
    const jsonArray = JSON.parse(jsonStr).content || []
    const fields = []
    jsonArray.forEach(item => {
      // 文本
      if (item.widgetName === 'raTextBlock') {
        if (item.title.content.length) {
          const str = item.title.content.join('\n')
          if (containsLanguage(str, translateForm.sourceLanguageCode)) {
            item.title.content = targets[i].split('\n')
            i++
          }
        }
        if (item.text.content.length) {
          const str = item.text.content.join('\n')
          if (containsLanguage(str, translateForm.sourceLanguageCode)) {
            item.text.content = targets[i].split('\n')
            i++
          }
        }
      } else {
        // raShowcase 图片和图文共用, 除 roll(图片)外是图文
        if (item.type !== 'roll') {
          item.blocks.forEach(block => {
            if (block.title.content.length) {
              const str = block.title.content.join('\n')
              if (containsLanguage(str, translateForm.sourceLanguageCode)) {
                block.title.content = targets[i].split('\n')
                i++
              }
            }
            if (block.text.content.length) {
              const str = block.text.content.join('\n')
              if (containsLanguage(str, translateForm.sourceLanguageCode)) {
                block.text.content = targets[i].split('\n')
                i++
              }
            }
          })
        }
      }
    })

    const obj = {
      ...JSON.parse(jsonStr),
      content: jsonArray
    }
    return JSON.stringify(obj)
  }

  /** 在保存前校验 SKU 和 多数量策划 */
  async function beforeSave(fn) {
    // 获取数据
    const baseInfo = await baseInfoRef.value.emitData()
    const skuList = SKUInfoRef.value.emitData()
    if (!baseInfo || !skuList) return

    // 校验 skuCode 中是否存在 [*, +, /], 存在则校验是否勾选多数量策划
    const reg = /[/*/+//]/
    const showModal = skuList.some(sku => reg.test(sku.skuCode) && sku.isPlanNum === 0)
    if (showModal) {
      Modal.confirm({
        title: '提示',
        content: '检测到SKU编码有多数量策划意图, 但对应的多数量策划未勾选, 是否继续保存？',
        onOk() {
          // 确认保存
          fn()
        },
        onCancel() {}
      })
    } else {
      // 校验通过, 直接执行后续 fn
      fn()
    }
  }

  /** 保存 */
  const saveLoading = ref(false)
  function save(skipClose = false) {
    return new Promise(async (resolve, reject) => {
      // 获取数据
      const baseInfo = await baseInfoRef.value.emitData()
      const skuList = SKUInfoRef.value.emitData()
      if (!baseInfo || !skuList) {
        reject('校验不通过')
        return
      }

      const params = {
        selectRecordId: route.query.selectRecordId, // 资料待编辑列表 id
        ...baseInfo,
        mainImage: skuList[0].mainImages[0],
        subImage: skuList[0].subImages[0],
        skuList
      }

      saveLoading.value = true
      updateProductDetailApi(params)
        .then(res => {
          message.success('保存成功')

          refreshList()

          !skipClose &&
            setTimeout(() => {
              window.close()
            }, 1000)

          resolve()
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          saveLoading.value = false
        })
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

  /** 保存并提交终审 */
  const reviewLoading = ref(false)
  function toFinalReview() {
    save(true)
      .then(() => {
        reviewLoading.value = true
        const params = [
          {
            auditStatus: 50, // 待终审
            id: detail.selectAuditId,
            commodityId: detail.commodityId,
            remark: undefined
          }
        ]

        auditApi(params)
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
      })
      .catch(() => {
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
          auditStatus: reviewForm.auditStatus === 1 ? 60 : 20, // 审核状态：10 待初审，20 待编辑，30 申请重拍，40 资料员审核，50 待终审，60 终审完成，70 运营驳回 (例初审列表查询传10, 驳回列表查询传70)
          id: detail.selectAuditId,
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

  /** 监听编辑页保存后的跨窗口通信 */
  window.addEventListener('message', receiveMessage)

  onBeforeUnmount(() => {
    window.removeEventListener('message', receiveMessage)
  })

  // 更新拍照状态
  const disabledPhoto = ref(false)
  function receiveMessage(event) {
    if (event.origin === window.location.origin && event.data === 'toggleStatus') {
      disabledPhoto.value = true
    }
  }

  /** 返回需要监听其滚动事件的元素 */
  function targetFn() {
    // 编辑 ? 外层父元素 : 页面顶层元素
    return isEditDetail.value ? document.getElementById('common-detail') : document.querySelector('.ant-layout-content')
  }
</script>
