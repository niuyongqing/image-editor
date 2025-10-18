<!-- 基本信息 -->
<template>
  <div>
    <a-form
      :model="baseInfoForm"
      ref="formRef"
      :label-col="{ style: { width: '85px' } }"
    >
      <a-form-item label="产品标题">
        <a-input
          v-model:value="baseInfoForm.productName"
          placeholder="请输入英文产品标题"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="前缀修饰词">
        <a-input
          v-model:value="baseInfoForm.prefixDecorateName"
          placeholder="请输入英文前缀修饰词, 多个请用英文逗号隔开"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="后缀修饰词">
        <a-input
          v-model:value="baseInfoForm.suffixDecorateName"
          placeholder="请输入英文后缀修饰词, 多个请用英文逗号隔开"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="分类">
        <!-- <a-select
          v-model:value="baseInfoForm.categoryId"
          :options="[{ label: 'label', value: 1 }]"
          :field-names="{ label: 'threeCategoryName', value: 'threeCategoryId' }"
          placeholder="请选择分类"
          allow-clear
          show-search
        /> -->
        <a-button @click="openCascaderCategorySelector">选择分类</a-button>
        <div
          v-if="categoryLabel"
          class="text-#933"
        >
          {{ categoryLabel }}
        </div>
        <!-- 分类弹窗 -->
        <CascaderCategorySelector
          ref="cascaderCategorySelectorRef"
          :tail-category-id="tailCategoryId"
          @select="selectCategory"
        />
      </a-form-item>
      <a-space>
        <a-form-item label="VAT">
          <a-select
            v-model:value="baseInfoForm.vat"
            :options="VAT_OPTIONS"
            class="w-40!"
          />
        </a-form-item>
      </a-space>

      <a-divider />

      <a-form-item label="竞品链接">
        <div
          class="flex mb-1"
          v-for="(item, i) in baseInfoForm.competitiveInfos"
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
            :disabled="baseInfoForm.competitiveInfos.length > 4"
            @click="addCompetitiveLink"
            ><PlusOutlined
          /></a-button>
          <a-button
            type="link"
            title="删除"
            :disabled="baseInfoForm.competitiveInfos.length === 1"
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
          v-for="(item, i) in baseInfoForm.purchaseLinkUrls"
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
            :disabled="baseInfoForm.purchaseLinkUrls.length > 4"
            @click="addPurchaseLink"
            ><PlusOutlined
          /></a-button>
          <a-button
            type="link"
            title="删除"
            :disabled="baseInfoForm.purchaseLinkUrls.length === 1"
            danger
            @click="delPurchaseLink(item.id)"
            ><MinusOutlined
          /></a-button>
        </div>
      </a-form-item>

      <a-divider />

      <a-form-item label="产品属性">
        <!-- <div class="min-h-12 border border-solid border-gray-200 rounded-md"></div> -->
        <a-card
          :loading="attrLoading"
          style="position: relative; max-height: 600px; overflow-y: auto"
        >
          <!-- 展开收起 -->
          <div
            v-if="attributeList.length"
            w-full
            sticky
            top-2
            right-0
            z-2
          >
            <a-button
              class="flex justify-end"
              type="link"
              @click="isExpand = !isExpand"
            >
              {{ isExpand ? '- 收起' : '+ 展开' }}</a-button
            >
          </div>
          <a-form
            ref="ruleForm2"
            :model="baseInfoForm.attributes"
            :label-col="{ span: 5 }"
            :rules="rules2"
            style="margin-top: 25px"
          >
            <div
              v-for="(item, i) in showAttributeList"
              :key="i"
              style="margin: 10px; flex: 0 0 auto"
            >
              <a-form-item
                :name="item.name"
                v-if="item.show"
              >
                <template #label>
                  <span class="mr-2.5 truncate">{{ item.label ? item.label : item.name }}</span>
                  <a-tooltip
                    effect="dark"
                    :title="item.description"
                    placement="top"
                  >
                    <QuestionCircleOutlined />
                  </a-tooltip>
                </template>
                <a-input
                  v-if="item.selectType === 'input'"
                  v-model:value="baseInfoForm.attributes[item.name]"
                  :style="'width: 80%'"
                  allow-clear
                  :maxlength="item.name == '海关编码' || item.name == 'IKP公司' ? 17 : item.name == '海关编码' ? 9999999 : 100"
                  :minlength="1000000"
                ></a-input>
                <div v-if="item.type == 'String' && item.isCollection && item.selectType == 'multSelect'">
                  <div v-if="item.options && item.options.length > 25">
                    <a-select
                      optionFilterProp="label"
                      show-search
                      v-model:value="item.selectDate"
                      allowClear
                      style="width: 200px; margin-bottom: 5px"
                      placeholder="请输入内容"
                      labelInValue
                    >
                      <a-select-option
                        :value="v"
                        :label="v.label"
                        v-for="(v, i) in item.options"
                        :key="i"
                        >{{ v.label }}</a-select-option
                      >
                    </a-select>
                    <a-button
                      style="margin-left: 10px"
                      @click="addItemValues(item)"
                      type="primary"
                      >添加</a-button
                    >
                  </div>
                  <a-form-item-rest>
                    <a-checkbox-group
                      v-model:value="baseInfoForm.attributes[item.name]"
                      style="width: 80%"
                      :options="item.acquiesceList"
                      @change="changeRule(baseInfoForm.attributes, item.name)"
                    >
                    </a-checkbox-group>
                  </a-form-item-rest>
                </div>
                <a-select
                  v-model:value="baseInfoForm.attributes[item.name]"
                  v-if="item.selectType === 'select'"
                  optionFilterProp="label"
                  show-search
                  labelInValue
                  :style="'width: 80%'"
                  allowClear
                >
                  <template v-if="[85, 31].includes(item.id)">
                    <a-select-option
                      v-for="option in [{ label: '无品牌', value: '126745801' }]"
                      :key="option.value"
                      :value="option"
                    >
                      {{ option.label }}
                    </a-select-option>
                  </template>

                  <template v-else>
                    <a-select-option
                      v-for="(v, i) in item.options"
                      :key="i"
                      :value="v"
                    >
                      {{ v.label }}
                    </a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </div>
          </a-form>
        </a-card>
      </a-form-item>
      <a-form-item label="产品描述">
        <a-textarea
          v-model:value="baseInfoForm.desc"
          :rows="6"
          show-count
        />
      </a-form-item>
      <a-form-item label="JSON富文本">
        <JSONEditor
          :json-content="baseInfoForm.jsons"
          shop="没用的字段"
          @clear="baseInfoForm.jsons = ''"
          @back-result="backResult"
        />
      </a-form-item>

      <a-form-item label="视频">
        <div class="flex">
          <div>
            封面视频
            <a-upload
              v-if="!baseInfoForm.coverUrl"
              :maxCount="1"
              :action="uploadVideoUrl"
              accept=".mp4,.mov"
              list-type="picture-card"
              :headers="headers"
              :showUploadList="false"
              @change="handleCoverVideoChange"
            >
              <div>
                <PlusOutlined />
                <div style="margin-top: 8px">Upload</div>
              </div>
            </a-upload>
            <div
              class="w-50 h-50"
              v-if="baseInfoForm.coverUrl"
            >
              <video
                controls
                :src="baseInfoForm.coverUrl"
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
                v-if="baseInfoForm.video.length > 0"
                class="flex"
              >
                <div
                  v-for="(item, i) in baseInfoForm.video"
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
              <div v-if="baseInfoForm.video.length < 5">
                <a-upload
                  list-type="picture-card"
                  :action="uploadVideoUrl"
                  :headers="headers"
                  accept=".mp4,.mov"
                  :showUploadList="false"
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
  </div>
</template>

<script setup>
  import CascaderCategorySelector from './CascaderCategorySelector.vue'
  import { getAttributesApi } from './api'
  import JSONEditor from '@/pages/ozon/config/component/json/index.vue'
  import { processImageSource } from '@/pages/ozon/config/commJs/index'
  import { v4 as uuidv4 } from 'uuid'
  import { copyText } from '@/utils'
  import { message } from 'ant-design-vue'
  import { DeleteOutlined, PlusOutlined, MinusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

  const store = useProductReviewStore()
  const tailCategoryId = ref('') // 末尾的分类id
  const baseInfoForm = reactive({
    id: '',
    productName: '',
    prefixDecorateName: '',
    suffixDecorateName: '',
    categoryId: undefined,
    vat: 0,
    competitiveInfos: [{ id: uuidv4(), linkUrl: '' }],
    purchaseLinkUrls: [{ id: uuidv4(), linkUrl: '' }],
    attributes: {}, //产品属性
    desc: '',
    jsons: '',
    coverUrl: '', // 封面视频
    video: [] // 详情视频
  })
  const formRef = ref()
  // VAT 下拉选项
  const VAT_OPTIONS = [
    { label: '免税', value: 0 },
    { label: '10%', value: 10 },
    { label: '20%', value: 20 }
  ]

  // 分类
  const cascaderCategorySelectorRef = ref()
  const categoryLabel = ref('')

  function openCascaderCategorySelector() {
    cascaderCategorySelectorRef.value.open()
  }

  function selectCategory(data) {
    baseInfoForm.categoryId = data.ids.join(',')
    categoryLabel.value = data.labels.join(' / ')

    // 初始化时, 只用于回显分类信息, 不进行后续操作
    if (data.initialization) return

    const params = {
      descriptionCategoryId: data.ids[1],
      typeId: data.ids[2]
    }
    getAttributes(params)

    // 切换不同分类后SKU清空
    store.$patch(state => {
      state.dataType = ''
    })
  }

  /** 产品属性(搬屎) */
  const attributeList = ref([])
  const attrLoading = ref(false)
  const isExpand = ref(false)
  const rules2 = ref({})
  const ruleForm2 = ref()

  const showAttributeList = computed(() => {
    return isExpand.value ? attributeList.value : attributeList.value.filter(item => item.isRequired)
  })

  function getAttributes(params) {
    attrLoading.value = true
    getAttributesApi(params)
      .then(res => {
        const rawData = res.data || []
        // 存到 pinia 里给 SKUInfo 用
        store.$patch(state => {
          state.attributes = rawData
        })

        const newAttributesCache = processAttributesCache(rawData)
        let noThemeAttributesCache = newAttributesCache.filter(a => !a.isAspect)
        if (noThemeAttributesCache) {
          noThemeAttributesCache.sort((a, b) => {
            if (a.isRequired && !b.isRequired) return -1
            if (!a.isRequired && b.isRequired) return 1
            return 0
          })

          let data = noThemeAttributesCache.filter(a => a.isRequired)
          rules2.value = {}
          let attributes = {}
          // 属性类型处理
          noThemeAttributesCache.forEach(item => {
            item.selectDate = {
              label: '',
              value: ''
            }
            if (item.id === 9070) {
              item.options = item?.options?.map(item => {
                return {
                  ...item,
                  label: item.label,
                  value: item.value
                }
              })
            } else {
              item.options = item?.options?.map(item => {
                return {
                  ...item,
                  label: item.value,
                  value: item.id
                }
              })
            }
            item.acquiesceList = (item.options && item.options.slice(0, 25)) || []
            attributes[item.name] = item.selectType === 'multSelect' ? [] : undefined
            attributes['制造国(Страна-изготовитель)'] = [90296] //设置默认值
          })

          // 属性校验
          for (let i = 0; i < data.length; i++) {
            let obj = {
              required: true,
              message: `${data[i].name} 为必填项，请填写`,
              trigger: noThemeAttributesCache[i].selectType == 'input' ? 'blur' : 'change'
            }
            rules2.value[noThemeAttributesCache[i].name] = obj
          }

          let oldAttributes = []
          if (Object.keys(store.productDetail).length !== 0) {
            oldAttributes = store.productDetail?.skuList?.[0].attributes
            // 塞上 intelligentAttributeId, relatedAttributeId
            oldAttributes.forEach(item => {
              const target = noThemeAttributesCache.find(attr => attr.id === item.id)
              if (target) {
                target.relatedAttributeId = item.relatedAttributeId
                target.intelligentAttributeId = item.intelligentAttributeId
              }
            })
            // 塞上, 都塞上
            oldAttributes.forEach(item => {
              const target = rawData.find(attr => attr.id === item.id)
              if (target) {
                target.relatedAttributeId = item.relatedAttributeId
                target.intelligentAttributeId = item.intelligentAttributeId
              }
            })
          }

          attributeList.value = noThemeAttributesCache

          // 赋值
          const proceRes = assignValues(oldAttributes, attributeList.value)
          // (品牌 85: 无品牌 126745801)和(制造国 4389: 中国 90296)设默认值
          const brandLabel = attributeList.value.find(attr => attr.id === 85)?.name
          if (brandLabel && !proceRes[brandLabel]) {
            proceRes[brandLabel] = {
              label: '无品牌',
              value: '126745801'
            }
          }
          const countryLabel = attributeList.value.find(attr => attr.id === 4389)?.name
          if (countryLabel && !(proceRes[countryLabel] && proceRes[countryLabel].length)) {
            proceRes[countryLabel] = [90296]
          }

          baseInfoForm.attributes = proceRes
        }
      })
      .finally(() => {
        attrLoading.value = false
      })
  }

  const processAttributesCache = attributesCache => {
    return attributesCache.map(item => {
      item.show = true
      if (shouldHideItem(item)) {
        item.show = false
      }
      return item
    })
  }
  const shouldHideItem = item => {
    return (
      item.id === 4080 ||
      item.id === 8229 ||
      item.id === 8789 ||
      item.id === 8790 ||
      item.id === 4180 ||
      item.id === 4191 ||
      item.id === 11254 ||
      item.id === 9024 ||
      item.attributeComplexId === '100001' ||
      item.attributeComplexId === '100002' ||
      (item.isAspect && !item.isRequired) ||
      (item.isAspect && item.isCollection)
    )
  }
  // 清除校验
  const changeRule = (attributes, name) => {
    ruleForm2.value.clearValidate(name)
  }

  // 此方法将历史缓存中的属性值进行重新赋值
  const assignValues = (oldAttr, attr) => {
    let newRes = oldAttr.map(item => {
      return {
        ...item,
        values: item.values.map(value => {
          return {
            ...value,
            id: Number(value.dictionaryValueId),
            info: '',
            picture: '',
            label: ''
          }
        })
      }
    })

    const result = {}
    // 根据b数组填充结果对象
    attr.forEach(item => {
      const name = item.name
      const selectType = item.selectType
      newRes.forEach(resItem => {
        const attributeId = resItem.id
        const allValidItems = resItem.values.every(item => item.value !== '')
        if (attributeId === item.id && allValidItems) {
          if (selectType === 'multSelect') {
            result[name] = resItem.values.map(item => item.id)
            item.acquiesceList = moveMatchedItemForward(
              item.options,
              resItem.values.map(item => item.id)
            )
          } else if (selectType === 'select') {
            result[name] = findMatchedOption(attributeId, resItem.values[0], item.options)
          } else {
            result[name] = resItem.values[0].value
          }
        } else {
          if (item.id === 4389) {
            result[name] = [90296]
          } else if (item.id === 85 || item.id === 31) {
            result[name] = {
              label: '无品牌',
              value: '126745801'
            }
          }
        }
      })
    })

    return result
  }

  const findMatchedOption = (attributeId, data, options) => {
    const matchedOption = options?.find(option => option.id === data.id)
    if (attributeId == 9070) {
      return {
        label: data.value,
        value: data.id
      }
    } else if (attributeId == 85 || attributeId == 31) {
      return {
        label: '无品牌',
        value: data.id
      }
    } else if (attributeId === 4389) {
      return {
        label: data.value,
        value: [90296]
      }
    } else if (matchedOption) {
      return {
        id: matchedOption.id,
        value: matchedOption.value,
        label: matchedOption.label
      }
    }
    return null
  }

  const moveMatchedItemForward = (data, arr) => {
    const newData = []
    const remainingData = []

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      if (arr.includes(item.id)) {
        newData.push(item)
      } else {
        remainingData.push(item)
      }
    }

    return newData.concat(remainingData).slice(0, 25)
  }

  const addItemValues = obj => {
    if (!obj.selectDate.value) return
    const { attributes } = baseInfoForm
    attributes[obj.name] ||= [] // 若无值, 则初始化为 []
    const isExist = obj.acquiesceList.some(item => item.value === obj.selectDate.value)
    //!  判断搜索出来的是否在初始的数组中显示
    if (isExist) {
      // 如果已有该数据, 不再添加
      if (!attributes[obj.name].includes(obj.selectDate.value)) {
        attributes[obj.name].push(obj.selectDate.value)
      }
    } else {
      attributes[obj.name].push(obj.selectDate.value)
      obj.acquiesceList.push(obj.selectDate)
    }
    obj.selectDate = undefined
  }

  const childForm = async () => {
    // 收集需要校验的表单引用
    const formRefs = [ruleForm2]

    // 循环遍历表单引用数组进行校验
    for (const formRef of formRefs) {
      try {
        // 如果表单引用不存在，跳过本次循环
        if (!formRef.value) continue

        // 调用表单的 validate 方法进行校验
        await formRef.value.validate()
      } catch (error) {
        // 若校验失败，捕获错误并返回 false
        return false
      }
    }
    // 所有表单都校验通过，返回 true
    return true
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
    baseInfoForm.competitiveInfos.push({ id: uuidv4(), linkUrl: '' })
  }

  function delCompetitiveLink(id) {
    baseInfoForm.competitiveInfos = baseInfoForm.competitiveInfos.filter(item => item.id !== id)
  }

  // 采购链接
  function addPurchaseLink() {
    baseInfoForm.purchaseLinkUrls.push({ id: uuidv4(), linkUrl: '' })
  }

  function delPurchaseLink(id) {
    baseInfoForm.purchaseLinkUrls = baseInfoForm.purchaseLinkUrls.filter(item => item.id !== id)
  }

  /** JSON 富文本 */
  function backResult(jsonContent) {
    baseInfoForm.jsons = JSON.stringify(jsonContent)
  }

  /** 视频 */
  const headers = {
    Authorization: 'Bearer ' + useAuthorization().value
  }
  const uploadVideoUrl = import.meta.env.VITE_APP_BASE_API + '/platform-ozon/platform/ozon/file/upload/video'

  const handleCoverVideoChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        baseInfoForm.coverUrl = processImageSource(info.file.response.url)
      } else {
        message.error(info.file.response.msg)
      }
    }
  }
  const handleVideoChange = info => {
    if (info.file.status === 'done') {
      if (info.file.response.code == 200) {
        baseInfoForm.video.push({
          url: processImageSource(info.file.response.url)
        })
      } else {
        message.error(info.file.response.msg)
      }
    }
  }
  const removeVideo = () => {
    baseInfoForm.coverUrl = ''
  }
  const removeVideoList = i => {
    baseInfoForm.video.splice(i, 1)
  }

  /** 详情回显 */
  watch(
    () => store.productDetail,
    detail => {
      if (Object.keys(detail).length === 0) return

      baseInfoForm.id = detail.id
      baseInfoForm.productName = detail.productName
      baseInfoForm.prefixDecorateName = detail.prefixDecorateName
      baseInfoForm.suffixDecorateName = detail.suffixDecorateName
      // 分类
      if (detail.categoryId) {
        baseInfoForm.categoryId = detail.categoryId
        const categoryIdList = detail.categoryId.split(',')
        tailCategoryId.value = categoryIdList.at(-1)
        const params = {
          descriptionCategoryId: categoryIdList[1],
          typeId: categoryIdList[2]
        }
        getAttributes(params)
      }
      // 采购链接(字符串, ','分割)
      if (detail.purchaseLinkUrls) {
        baseInfoForm.purchaseLinkUrls = detail.purchaseLinkUrls.split(',').map(linkUrl => ({ id: uuidv4(), linkUrl }))
      }
      // 竞品链接(数组)
      if (detail.competitiveInfos?.length) {
        baseInfoForm.competitiveInfos = detail.competitiveInfos
      }

      // JSON富文本和视频
      const { attributes, complexAttributes } = detail.skuList?.[0] || {}
      if (!attributes || attributes.length === 0) return
      commDispose(attributes, complexAttributes)
    }
  )

  // 定义常量ID提升可维护性
  const ATTRIBUTE_IDS = {
    JSON_CONTENT: 11254,
    DESCRIPTION: 4191,
    VIDEO: 21841,
    COVER_IMAGE: 21845
  }

  function commDispose(attributes, complexAttributes) {
    // 完善空值检查并使用可选链
    const copyAttr = attributes?.filter(a => a.id === ATTRIBUTE_IDS.JSON_CONTENT || a.id === ATTRIBUTE_IDS.DESCRIPTION) || []

    // 处理复杂属性-视频
    if (Array.isArray(complexAttributes)) {
      complexAttributes.forEach(item => {
        switch (item.id) {
          case ATTRIBUTE_IDS.VIDEO:
            baseInfoForm.video =
              item.values?.map(e => ({
                url: processImageSource(e?.value || '')
              })) || []
            break
          case ATTRIBUTE_IDS.COVER_IMAGE:
            baseInfoForm.coverUrl = processImageSource(item.values?.[0]?.value || '')
            break
        }
      })
    }

    // 处理普通属性 不用循环处理是为了防止数据在变动时无法重置或更新
    const jsonContentAttr = copyAttr.find(attr => attr.id === ATTRIBUTE_IDS.JSON_CONTENT)
    const descriptionAttr = copyAttr.find(attr => attr.id === ATTRIBUTE_IDS.DESCRIPTION)

    baseInfoForm.jsons = jsonContentAttr?.values?.[0]?.value || ''
    baseInfoForm.desc = descriptionAttr?.values?.[0]?.value || ''
  }

  // 获取用于提交的 attributes 数据
  function getSubmitAttributes() {
    let submitAttributes = []
    // 产品属性
    let target
    for (const name in baseInfoForm.attributes) {
      switch (Object.prototype.toString.call(baseInfoForm.attributes[name]).slice(8, -1)) {
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
              attributeValue: baseInfoForm.attributes[name],
              isVariant: false
            })
          }
          break
        case 'Array':
          target = attributeList.value.find(item => item.name === name)
          if (target) {
            const relatedAttributeIdList = target.relatedAttributeId?.split(',') || []
            baseInfoForm.attributes[name].forEach((attributeOptionId, i) => {
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
              attributeOptionId: baseInfoForm.attributes[name].value,
              attributeValue: baseInfoForm.attributes[name].label,
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
    const idList = Object.values(ATTRIBUTE_IDS)
    submitAttributes = submitAttributes.filter(item => !idList.includes(item.attributeId))

    // 产品描述
    if (baseInfoForm.desc) {
      submitAttributes.push({
        complexId: '0',
        attributeId: 4191,
        attributeName: '产品描述',
        attributeOptionId: '0',
        attributeValue: baseInfoForm.desc,
        isVariant: false
      })
    }

    // JSON富文本
    if (baseInfoForm.jsons) {
      submitAttributes.push({
        complexId: '0',
        attributeId: 11254,
        attributeName: 'JSON富文本',
        attributeOptionId: '0',
        attributeValue: baseInfoForm.jsons,
        isVariant: false
      })
    }

    // 封面视频
    if (baseInfoForm.coverUrl) {
      submitAttributes.push({
        complexId: 100002,
        attributeId: 21845,
        attributeName: '封面视频',
        attributeOptionId: '0',
        attributeValue: baseInfoForm.coverUrl,
        isVariant: false
      })
    }

    // 详情视频
    if (baseInfoForm.video.length) {
      baseInfoForm.video.forEach(video => {
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

  defineExpose({ baseInfoForm, getSubmitAttributes, childForm })
</script>
