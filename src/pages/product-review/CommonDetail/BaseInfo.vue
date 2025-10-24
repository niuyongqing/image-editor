<!-- 基本信息 -->
<template>
  <div>
    <a-form
      :model="form"
      ref="formRef"
      :label-col="{ style: { width: '94px' } }"
    >
      <a-form-item
        label="产品标题"
        name="productName"
        required
      >
        <a-input
          v-model:value="form.productName"
          placeholder="请输入中文产品标题"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="前缀修饰词">
        <a-input
          v-model:value="form.prefixDecorateName"
          placeholder="请输入中文前缀修饰词, 多个请用英文逗号隔开"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="后缀修饰词">
        <a-input
          v-model:value="form.suffixDecorateName"
          placeholder="请输入中文后缀修饰词, 多个请用英文逗号隔开"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        label="分类"
        name="categoryId"
        required
      >
        <a-button @click="categoryOpen = true">选择分类</a-button>
        <div
          v-if="categoryLabels"
          class="text-gray"
        >
          {{ categoryLabels }}
        </div>
      </a-form-item>
      <a-form-item
        label="VAT"
        name="vat"
      >
        <a-select
          v-model:value="form.vat"
          :options="VAT_OPTIONS"
          class="w-40!"
        />
      </a-form-item>

      <a-divider />

      <a-form-item label="竞品链接">
        <div
          class="flex mb-1"
          v-for="(item, i) in form.competitiveInfos"
          :key="item.id"
        >
          <span class="mr-1">{{ i + 1 }}</span>
          <a-input
            v-model:value="item.linkUrl"
            placeholder="请输入网址"
          />

          <a-button
            type="link"
            @click="copy(item.linkUrl)"
          >
            复制
          </a-button>
          <a-button
            type="link"
            @click="open(item.linkUrl)"
          >
            访问
          </a-button>
          <a-button
            type="link"
            title="添加"
            :disabled="form.competitiveInfos.length > 4"
            @click="addCompetitiveLink"
            ><PlusOutlined
          /></a-button>
          <a-button
            type="link"
            title="删除"
            :disabled="form.competitiveInfos.length === 1"
            danger
            @click="delCompetitiveLink(item.id)"
            ><MinusOutlined
          /></a-button>
        </div>
      </a-form-item>

      <a-divider />

      <a-form-item label="采购链接">
        <div
          class="flex mb-1"
          v-for="(item, i) in form.purchaseLinkUrls"
          :key="item.id"
        >
          <span class="mr-1">{{ i + 1 }}</span>
          <a-input
            v-model:value="item.linkUrl"
            placeholder="请输入网址"
          />

          <a-button
            type="link"
            @click="copy(item.linkUrl)"
          >
            复制
          </a-button>
          <a-button
            type="link"
            @click="open(item.linkUrl)"
          >
            访问
          </a-button>
          <a-button
            type="link"
            title="添加"
            :disabled="form.purchaseLinkUrls.length > 4"
            @click="addPurchaseLink"
            ><PlusOutlined
          /></a-button>
          <a-button
            type="link"
            title="删除"
            :disabled="form.purchaseLinkUrls.length === 1"
            danger
            @click="delPurchaseLink(item.id)"
            ><MinusOutlined
          /></a-button>
        </div>
      </a-form-item>

      <a-divider />

      <a-form-item label="产品属性">
        <a-card
          :loading="attrLoading"
          class="min-h-15 max-h-160 overflow-y-auto"
        >
          <a-form
            ref="attrFormRef"
            :model="attributesObj"
            :label-col="{ span: 4 }"
          >
            <a-form-item
              v-for="item in attributeList"
              :key="item.id"
              :name="item.name"
              :required="item.isRequired"
            >
              <template #label>
                <span
                  class="mr-2 truncate"
                  :title="item.name"
                  >{{ item.name }}</span
                >
                <a-tooltip :title="item.description">
                  <QuestionCircleOutlined />
                </a-tooltip>
              </template>

              <a-input
                v-if="item.selectType === 'input'"
                v-model:value="attributesObj[item.name]"
                allow-clear
                placeholder="请输入"
              />

              <a-select
                v-else-if="item.selectType === 'select'"
                v-model:value="attributesObj[item.name]"
                :options="item.options"
                option-filter-prop="value"
                :field-names="{ label: 'value', value: 'id' }"
                label-in-value
                show-search
                allow-clear
                class="w-1/3!"
                placeholder="请选择"
              />

              <div v-else-if="item.selectType == 'multSelect'">
                <!-- 更多的属性放在下拉框里, 选中则添加 -->
                <div v-if="item.options && item.options.length > 25">
                  <a-form-item-rest>
                    <a-select
                      v-model:value="item.tempValue"
                      :options="item.options"
                      show-search
                      :field-names="{ label: 'value', value: 'id' }"
                      option-filter-prop="value"
                      class="mb-1 w-1/3!"
                      placeholder="更多属性值请搜索添加"
                      @select="(val, opt) => addAttrItemVal(val, opt, item)"
                    />
                  </a-form-item-rest>
                </div>

                <a-checkbox-group v-model:value="attributesObj[item.name]">
                  <a-checkbox
                    v-for="checkbox in item.optionPieces"
                    :key="checkbox.id"
                    :value="checkbox.id"
                    :title="checkbox.value"
                  >
                    <span
                      class="inline-block w-40 align-middle truncate"
                      :title="checkbox.value"
                      >{{ checkbox.value }}</span
                    >
                  </a-checkbox>
                </a-checkbox-group>
              </div>
            </a-form-item>
          </a-form>
        </a-card>
      </a-form-item>

      <a-form-item
        label="产品描述"
        name="desc"
        required
      >
        <a-textarea
          v-model:value="form.desc"
          :rows="6"
          show-count
        />
      </a-form-item>
      <a-form-item
        label="JSON富文本"
        name="jsons"
        required
      >
        <a-form-item-rest>
          <JSONEditor
            :json-content="form.jsons"
            shop="没用的字段"
            @clear="form.jsons = ''"
            @back-result="backResult"
          />
        </a-form-item-rest>
      </a-form-item>

      <a-form-item label="视频">
        <div class="flex">
          <div>
            封面视频
            <a-upload
              v-if="!form.coverVideoUrl"
              :maxCount="1"
              :action="uploadVideoUrl"
              accept=".mp4,.mov"
              list-type="picture-card"
              :headers="headers"
              :showUploadList="false"
              :before-upload="beforeUpload"
              @change="handleCoverVideoChange"
            >
              <div>
                <PlusOutlined />
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
            <div
              class="w-50 h-50"
              v-if="form.coverVideoUrl"
            >
              <video
                controls
                :src="form.coverVideoUrl"
                width="100%"
                height="200px"
              ></video>
              <div class="text-right">
                <a-button
                  type="link"
                  danger
                  size="middle"
                  @click="removeVideo"
                >
                  <DeleteOutlined />
                </a-button>
              </div>
            </div>
          </div>
          <div
            class="ml-7.5 flex flex-col overflow-x-auto"
            style="scrollbar-width: thin"
          >
            <span>详情描述视频</span>
            <div class="flex">
              <div
                v-if="form.videoList.length > 0"
                class="flex"
              >
                <div
                  v-for="(item, i) in form.videoList"
                  :key="i"
                  class="mr-2"
                >
                  <video
                    controls
                    :src="item.url"
                    width="200px"
                    height="200px"
                  ></video>
                  <div class="text-right">
                    <a-button
                      type="link"
                      danger
                      size="middle"
                      @click="removeVideoList(i)"
                    >
                      <DeleteOutlined />
                    </a-button>
                  </div>
                </div>
              </div>
              <div v-if="form.videoList.length < 5">
                <a-upload
                  list-type="picture-card"
                  :action="uploadVideoUrl"
                  :headers="headers"
                  accept=".mp4,.mov"
                  :showUploadList="false"
                  :before-upload="beforeUpload"
                  @change="handleVideoChange"
                >
                  <div>
                    <PlusOutlined />
                    <div style="margin-top: 8px">Upload</div>
                  </div>
                </a-upload>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
    </a-form>
    <a-divider />

    <!-- 分类弹窗 -->
    <CustomCategorySelector
      v-model:open="categoryOpen"
      v-model:category-ids="form.categoryId"
      v-model:category-labels="categoryLabels"
      @change="categoryChange"
    />
  </div>
</template>

<script setup>
  import CustomCategorySelector from '@/components/custom-category-selector/index.vue'
  import { getAttributesApi } from './api'
  import JSONEditor from '@/pages/ozon/config/component/json/index.vue'
  import { processImageSource } from '@/pages/ozon/config/commJs/index'
  import { v4 as uuidv4 } from 'uuid'
  import { copyText } from '@/utils'
  import { message } from 'ant-design-vue'
  import { DeleteOutlined, PlusOutlined, MinusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

  const store = useProductReviewStore()
  const categoryOpen = ref(false)
  const form = reactive({
    id: '',
    productName: '',
    prefixDecorateName: '',
    suffixDecorateName: '',
    categoryId: '',
    vat: 0,
    competitiveInfos: [{ id: uuidv4(), linkUrl: '' }],
    purchaseLinkUrls: [{ id: uuidv4(), linkUrl: '' }],
    desc: '',
    jsons: '',
    coverVideoUrl: '', // 封面视频
    videoList: [] // 详情视频
  })
  const attributesObj = ref({}) // 产品属性的值

  const formRef = ref()
  // VAT 下拉选项
  const VAT_OPTIONS = [
    { label: '免税', value: 0 },
    { label: '10%', value: 10 },
    { label: '20%', value: 20 }
  ]

  const categoryLabels = ref('未选择分类') // 分类 label

  function categoryChange(list) {
    // 选择分类后校验(目的是为了清空下方 error 信息)
    formRef.value.validateFields(['categoryId'])

    getAttributes()
  }

  /** 产品属性 */
  // 定义常量ID提升可维护性
  const ATTR_ID_ENUM = {
    jsons: 11254,
    desc: 4191,
    video: 21841, // 视频链接
    videoName: 21837, // 视频名称
    videoProduct: 22273, // 视频产品
    coverVideo: 21845, // 视频封面
    nonsense1: 4080, // URL ?
    nonsense2: 8229, // 类型
    nonsense3: 8789, // PDF 名称
    nonsense4: 8790, // PDF 文件
    nonsense5: 4180, // 名称
    nonsense6: 9024 // 卖家代码
  }
  const attributeList = ref([])
  const attrLoading = ref(false)
  const attrFormRef = ref()

  function getAttributes(arg = {}) {
    const categoryIdList = form.categoryId.split(',')
    const params = {
      descriptionCategoryId: categoryIdList[1],
      typeId: categoryIdList[2]
    }

    attrLoading.value = true
    getAttributesApi(params)
      .then(res => {
        const rawData = res.data || []

        // 塞上 intelligentAttributeId, relatedAttributeId
        if (Object.keys(store.productDetail).length !== 0) {
          const attributes = store.productDetail.skuList?.[0].attributes || []
          // 塞上, 都塞上
          attributes.forEach(item => {
            const target = rawData.find(attr => attr.id === item.id)
            if (target) {
              target.relatedAttributeId = item.relatedAttributeId
              target.intelligentAttributeId = item.intelligentAttributeId
            }
          })
        }

        // 截取多选备选大于 25 的
        rawData.forEach(item => {
          if (item.selectType === 'multSelect') {
            item.optionPieces = item.options ? item.options.slice(0, 25) : []
          }
        })

        // 存到 pinia 里给 SKUInfo 用
        store.$patch(state => {
          state.attributes = rawData
        })

        // 过滤出需要展示的产品属性
        const exceptList = Object.values(ATTR_ID_ENUM)
        const nonAspectList = rawData.filter(item => !exceptList.includes(item.id)).filter(item => !item.isAspect)
        // 将必填项提出来, 放前头
        const requiredList = nonAspectList.filter(item => item.isRequired)
        const nonRequiredList = nonAspectList.filter(item => !item.isRequired)
        // 赋值
        attributeList.value = [...requiredList, ...nonRequiredList]

        // 初始化(详情里的值回显)
        if (arg.init) dispatchDetail()

        // (品牌 85: 无品牌 126745801)设默认值
        const brandItem = attributeList.value.find(attr => attr.id === 85)
        if (brandItem) {
          brandItem.options = [{ value: '无品牌', id: 126745801 }] // 字段跟接口返回的保持统一

          if (!attributesObj.value[brandItem.name]) {
            // 无值才设默认值
            attributesObj.value[brandItem.name] = {
              label: '无品牌',
              value: 126745801
            }
          }
        }
        // (制造国 4389: 中国 90296)设默认值
        const countryLabel = attributeList.value.find(attr => attr.id === 4389)?.name
        if (countryLabel && !(attributesObj.value[countryLabel] && attributesObj.value[countryLabel].length)) {
          attributesObj.value[countryLabel] = [90296]
        }

        diffAttributesObj()
      })
      .finally(() => {
        attrLoading.value = false
      })
  }

  // 回显详情
  function dispatchDetail() {
    if (Object.keys(store.productDetail).length !== 0) {
      const attributes = store.productDetail.skuList?.[0].attributes || []
      const nonVariantList = attributes.filter(item => !item.isVariant)
      nonVariantList.forEach(item => {
        const target = attributeList.value.find(attr => attr.id === item.id)
        if (target) {
          const valueList = item.values
          switch (target.selectType) {
            case 'input':
              attributesObj.value[target.name] = valueList[0].value
              break
            case 'select':
              attributesObj.value[target.name] = {
                label: valueList[0].value,
                value: valueList[0].dictionaryValueId
              }
              break
            case 'multSelect':
              attributesObj.value[target.name] = valueList.map(val => val.dictionaryValueId)
              break

            default:
              console.error('未处理类型: ', target.selectType, target.name)
              break
          }
        }
      })
    }
  }

  // 切换分类后删除不存在的属性的值, 保留相同的属性的值
  function diffAttributesObj() {
    const attrNameList = attributeList.value.map(item => item.name)
    for (const name in attributesObj.value) {
      if (!attrNameList.includes(name)) {
        delete attributesObj.value[name]
      }
    }
  }

  // 添加属性的选项值
  function addAttrItemVal(val, opt, item) {
    attributesObj.value[item.name] ||= [] // 若无值, 则初始化为 []
    const isExist = item.optionPieces.findIndex(ele => ele.id === val) > -1
    //!  判断搜索出来的是否在初始的数组中显示
    if (isExist) {
      // 如果已有该数据, 不再添加
      if (!attributesObj.value[item.name].includes(val)) {
        attributesObj.value[item.name].push(val)
      }
    } else {
      attributesObj.value[item.name].push(val)
      item.optionPieces.push(opt)
    }
    nextTick(() => {
      item.tempValue = undefined
    })
  }

  function copy(text) {
    if (!text) {
      message.warning('内容为空')
      return
    }

    copyText(text)
      .then(() => {
        message.success('已复制')
      })
      .catch(err => {
        message.error(err)
      })
  }

  function open(link) {
    if (!link) {
      message.warning('内容为空')
      return
    }

    window.open(link)
  }

  // 竞品链接
  function addCompetitiveLink() {
    form.competitiveInfos.push({ id: uuidv4(), linkUrl: '' })
  }

  function delCompetitiveLink(id) {
    form.competitiveInfos = form.competitiveInfos.filter(item => item.id !== id)
  }

  // 采购链接
  function addPurchaseLink() {
    form.purchaseLinkUrls.push({ id: uuidv4(), linkUrl: '' })
  }

  function delPurchaseLink(id) {
    form.purchaseLinkUrls = form.purchaseLinkUrls.filter(item => item.id !== id)
  }

  /** JSON 富文本 */
  function backResult(jsonContent) {
    form.jsons = JSON.stringify(jsonContent)
    formRef.value.validateFields(['jsons'])
  }

  /** 视频 */
  const headers = {
    Authorization: 'Bearer ' + useAuthorization().value
  }
  const uploadVideoUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/video'

  // 视频上传预处理
  function beforeUpload(file) {
    // 限制 100M
    if (file.size / 1024 / 1024 > 100) {
      message.warning('视频文件超过100M')
      return false
    }
  }

  const handleCoverVideoChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        form.coverVideoUrl = processImageSource(info.file.response.url)
      } else {
        message.error(info.file.response.msg)
      }
    }
  }
  const handleVideoChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        form.videoList.push({
          url: processImageSource(info.file.response.url)
        })
      } else {
        message.error(info.file.response.msg)
      }
    }
  }
  const removeVideo = () => {
    form.coverVideoUrl = ''
  }
  const removeVideoList = i => {
    form.videoList.splice(i, 1)
  }

  /** 详情回显 */
  watch(
    () => store.productDetail,
    detail => {
      if (Object.keys(detail).length === 0) return

      form.id = detail.id
      form.productName = detail.productName
      form.prefixDecorateName = detail.prefixDecorateName
      form.suffixDecorateName = detail.suffixDecorateName

      // 分类
      if (detail.categoryId) {
        form.categoryId = detail.categoryId

        getAttributes({ init: true })
      }

      // 采购链接(字符串, ','分割)
      if (detail.purchaseLinkUrls) {
        form.purchaseLinkUrls = detail.purchaseLinkUrls.split(',').map(linkUrl => ({ id: uuidv4(), linkUrl }))
      }
      // 竞品链接(数组)
      if (detail.competitiveInfos?.length) {
        form.competitiveInfos = detail.competitiveInfos
      }

      const { attributes = [], complexAttributes = [] } = detail.skuList?.[0]
      // 详描
      const descObj = attributes.find(attr => attr.id === ATTR_ID_ENUM.desc)
      form.desc = descObj?.values?.[0]?.value
      // JSON富文本
      const jsonsObj = attributes.find(attr => attr.id === ATTR_ID_ENUM.jsons)
      form.jsons = jsonsObj?.values?.[0]?.value || ''

      // 视频
      complexAttributes.forEach(item => {
        switch (item.id) {
          case ATTR_ID_ENUM.video:
            form.videoList =
              item.values?.map(ele => ({
                url: processImageSource(ele.value)
              })) || []
            break
          case ATTR_ID_ENUM.coverVideo:
            form.coverVideoUrl = processImageSource(item.values[0]?.value || '')
            break
        }
      })
    }
  )

  // 获取用于提交的 attributes 数据
  function getSubmitAttributes() {
    let submitAttributes = []
    // 产品属性
    let target
    for (const name in attributesObj.value) {
      switch (Object.prototype.toString.call(attributesObj.value[name]).slice(8, -1)) {
        case 'String':
          target = attributeList.value.find(item => item.name === name)
          if (target) {
            submitAttributes.push({
              id: target.relatedAttributeId,
              intelligentAttributeId: target.intelligentAttributeId,
              complexId: '0',
              attributeId: target.id,
              attributeName: name,
              attributeOptionId: '0',
              attributeValue: attributesObj.value[name],
              isVariant: false
            })
          }
          break
        case 'Array':
          target = attributeList.value.find(item => item.name === name)
          if (target) {
            const relatedAttributeIdList = target.relatedAttributeId?.split(',') || []
            attributesObj.value[name].forEach((attributeOptionId, i) => {
              const targetOption = target.options.find(item => item.id === attributeOptionId)
              submitAttributes.push({
                id: relatedAttributeIdList[i],
                intelligentAttributeId: target.intelligentAttributeId,
                complexId: '0',
                attributeId: target.id,
                attributeName: name,
                attributeOptionId,
                attributeValue: targetOption ? targetOption.label : undefined,
                isVariant: false
              })
            })
          }
          break
        case 'Object':
          target = attributeList.value.find(item => item.name === name)
          if (target) {
            submitAttributes.push({
              id: target.relatedAttributeId,
              intelligentAttributeId: target.intelligentAttributeId,
              complexId: '0',
              attributeId: target.id,
              attributeName: name,
              attributeOptionId: attributesObj.value[name].value,
              attributeValue: attributesObj.value[name].label,
              isVariant: false
            })
          }
          break

        default:
          console.error('有产品属性遗漏: ', name)
          break
      }
    }

    // 把以下固定的几项给过滤掉
    const idList = Object.values(ATTR_ID_ENUM)
    submitAttributes = submitAttributes.filter(item => !idList.includes(item.attributeId))

    // 产品描述
    if (form.desc) {
      submitAttributes.push({
        complexId: '0',
        attributeId: 4191,
        attributeName: '产品描述',
        attributeOptionId: '0',
        attributeValue: form.desc,
        isVariant: false
      })
    }

    // JSON富文本
    if (form.jsons) {
      submitAttributes.push({
        complexId: '0',
        attributeId: 11254,
        attributeName: 'JSON富文本',
        attributeOptionId: '0',
        attributeValue: form.jsons,
        isVariant: false
      })
    }

    // 封面视频
    if (form.coverVideoUrl) {
      submitAttributes.push({
        complexId: 100002,
        attributeId: 21845,
        attributeName: '封面视频',
        attributeOptionId: '0',
        attributeValue: form.coverVideoUrl,
        isVariant: false
      })
    }

    // 详情视频
    if (form.videoList.length) {
      form.videoList.forEach(video => {
        submitAttributes.push({
          complexId: 100001,
          attributeId: 21841,
          attributeName: '详情视频',
          attributeOptionId: '0',
          attributeValue: video.url,
          isVariant: false
        })
      })
    }

    return submitAttributes
  }

  // 校验并提交数据
  function emitData() {
    // 给分类一个特殊关照
    if (!form.categoryId) message.error('请选择分类!')

    Promise.all([formRef.value.validate(), attrFormRef.value.validate()])
      .then(() => {
        // 外层值
        const outerObj = {
          productId: form.id,
          productName: form.productName,
          prefixDecorateName: form.prefixDecorateName,
          suffixDecorateName: form.suffixDecorateName,
          categoryId: form.categoryId,
          vat: form.vat,
          competitiveInfos: form.competitiveInfos.filter(item => item.linkUrl).map(item => ({ linkUrl: item.linkUrl })),
          purchaseLinkUrls: form.purchaseLinkUrls
            .filter(item => item.linkUrl)
            .map(item => item.linkUrl)
            .join(',')
        }

        // 产品属性
        const submitAttributes = getSubmitAttributes()

        return {
          ...outerObj,
          attributes: submitAttributes
        }
      })
      .catch(err => {
        return false
      })
  }

  defineExpose({ emitData })
</script>
