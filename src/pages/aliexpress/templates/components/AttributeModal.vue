<!-- 属性模版 -->
<template>
  <a-modal
    :open="open"
    title="属性模版"
    width="40%"
    :confirm-loading="confirmLoading"
    @cancel="cancel"
    @ok="handleOk"
  >
    <a-card
      title="模板信息"
      class="mb-4"
    >
      <a-form
        :model="baseInfoForm"
        ref="baseInfoFormRef"
        :label-col="{ style: { width: '100px' } }"
        :rules="rules"
      >
        <a-form-item
          label="模板名称"
          name="name"
        >
          <a-input
            v-model:value="baseInfoForm.name"
            placeholder="请输入"
            :maxlength="128"
            show-count
          />
        </a-form-item>
        <a-form-item
          label="店铺名称"
          name="sellerId"
        >
          <a-select
            v-model:value="baseInfoForm.sellerId"
            placeholder="请选择店铺"
            show-search
            allow-clear
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'sellerId' }"
            option-filter-prop="simpleName"
            @change="handleAccountChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          label="产品分类"
          name="categoryIds"
        >
          <a-cascader
            v-model:value="baseInfoForm.categoryIds"
            show-search
            placeholder="请选择产品分类"
            :options="categoryOptions"
            :field-names="{ value: 'id' }"
            :allow-clear="false"
            @change="getAttributes"
          ></a-cascader>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card title="产品属性">
      <a-form :label-col="{ style: { width: '100px' } }">
        <a-form-item label="产品属性">
          <a-spin :spinning="loading">
            <a-card class="relative">
              <a-form
                ref="attributeFormRef"
                :model="attributes"
                :label-col="{ style: { width: '150px' } }"
                :wrapper-col="{ style: { width: '240px' } }"
                class="mt-6 flex flex-wrap"
              >
                <a-form-item
                  v-for="(item, i) in attributeOptions"
                  :key="item.attributeId"
                  :required="item.required"
                  :label="item.zh || item.en"
                  :name="item.zh"
                >
                  <!-- supportEnumInput 当前属性是否支持自定义枚举类型属性值(通过filterable来控制能否输入) -->
                  <template v-if="item.attributeShowTypeValue === 'list_box'">
                    <a-select
                      v-if="!item.supportEnumInput"
                      v-model:value="attributes[item.zh]"
                      :options="item.values"
                      :field-names="{ label: 'name', value: 'attributeValueId' }"
                      show-search
                      allow-clear
                      label-in-value
                      placeholder="请选择"
                      option-filter-prop="name"
                      @change="val => handleAttrChange(val, i)"
                    >
                    </a-select>
                    <!-- 可自定义填写内容 -->
                    <a-select
                      v-else
                      v-model:value="attributes[item.zh]"
                      :options="item.values"
                      :field-names="{ label: 'name', value: 'attributeValueId' }"
                      :ref="el => setRef(el, item.zh)"
                      mode="tags"
                      show-search
                      allow-clear
                      label-in-value
                      placeholder="输入或选择;回车确认输入值"
                      option-filter-prop="name"
                      @select="(val, option) => supportEnumInputSelect(val, option, item.zh, i)"
                    >
                      <template #tagRender="{ label }">
                        <span>{{ label }}</span>
                      </template>
                    </a-select>
                  </template>
                  <a-input
                    v-else-if="item.attributeShowTypeValue === 'input'"
                    v-model:value="attributes[item.zh]"
                    placeholder="请输入"
                  />
                  <a-input
                    v-else-if="item.attributeShowTypeValue === 'input_int'"
                    v-model:value.trim="attributes[item.zh]"
                    placeholder="请输入数值"
                  />
                  <a-radio-group
                    v-else-if="item.attributeShowTypeValue === 'radio'"
                    v-model:value="attributes[item.zh]"
                    :name="item.zh"
                  >
                    <a-radio
                      v-for="radio in item.values"
                      :key="radio.attributeValueId"
                      :value="radio.attributeValueId"
                      >{{ radio.name }}</a-radio
                    >
                  </a-radio-group>
                  <!-- 高关注化学物质(check_box)选项太多了, 用多选下拉框替代 -->
                  <template v-else-if="item.attributeShowTypeValue === 'check_box'">
                    <!-- feature 含 AE_FEATURE_material_ratio 的需填材质比例 -->
                    <template v-if="item.showPercent">
                      <div
                        v-for="(materialItem, i2) in attributes[item.zh]"
                        :key="materialItem.id"
                        class="flex mb-1"
                      >
                        <a-form-item-rest>
                          <a-space class="z-1">
                            <a-select
                              v-model:value="materialItem.material"
                              :options="item.values"
                              :field-names="{ label: 'name', value: 'attributeValueId' }"
                              show-search
                              allow-clear
                              label-in-value
                              placeholder="请选择"
                              option-filter-prop="name"
                              style="width: 128px"
                            />
                            <a-input-number
                              v-model:value="materialItem.percent"
                              :controls="false"
                              :precision="0"
                              :min="1"
                              :max="100"
                              style="width: 76px"
                            >
                              <template #addonAfter>%</template>
                            </a-input-number>
                            <a-button
                              v-if="i2 === attributes[item.zh].length - 1"
                              type="link"
                              title="添加"
                              @click="materialAdd(attributes[item.zh])"
                            >
                              <template #icon><PlusOutlined /></template>
                            </a-button>
                            <a-button
                              v-if="attributes[item.zh].length !== 1"
                              type="link"
                              title="删除"
                              @click="materialDel(attributes[item.zh], i2)"
                            >
                              <template #icon><MinusOutlined /></template>
                            </a-button>
                            <a-popover v-if="i2 === 0">
                              <template #content>
                                <span>材质百分比之和须等于 100%</span>
                              </template>
                              <InfoCircleOutlined />
                            </a-popover>
                          </a-space>
                        </a-form-item-rest>
                      </div>
                    </template>
                    <a-select
                      v-else
                      v-model:value="attributes[item.zh]"
                      :options="item.values"
                      :field-names="{ label: 'name', value: 'attributeValueId' }"
                      :mode="item.supportEnumInput ? 'tags' : 'multiple'"
                      show-search
                      allow-clear
                      label-in-value
                      placeholder="输入或选择;回车确认输入值"
                      option-filter-prop="name"
                    />
                  </template>
                  <a-input
                    v-else
                    v-model:value="item.attributeShowTypeValue"
                    disabled
                  />
                </a-form-item>
              </a-form>
            </a-card>
          </a-spin>
        </a-form-item>
        <a-form-item label="自定义属性">
          <div class="w-1/2">
            <div
              class="flex mb-3"
              v-for="(item, i) in cusAttribute"
              :key="item.id"
            >
              <a-input
                v-model:value="item.label"
                placeholder="属性名"
              />
              <a-input
                v-model:value="item.value"
                placeholder="属性值"
                class="ml-2.5"
              />
              <a-space>
                <a-button
                  type="link"
                  class="ml-2.5"
                  :disabled="i === 0"
                  @click="move('up', i)"
                >
                  <template #icon><UpOutlined /></template>
                </a-button>
                <a-button
                  type="link"
                  :disabled="i === cusAttribute.length - 1"
                  @click="move('down', i)"
                >
                  <template #icon><DownOutlined /></template>
                </a-button>
                <a-button
                  type="link"
                  @click="delAttr(item.id)"
                  >删除</a-button
                >
              </a-space>
            </div>
          </div>
          <a-button @click="addAttr">
            <template #icon><PlusOutlined /></template>
            添加自定义属性
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script setup>
  import { getProductClassificationApi, resultByPostCateIdAndPathApi, getResultByPostCateIdAndPathApi } from '../../apis/product'
  import { templateAddApi, templateUpdateApi } from '../../apis/templates'
  import { message } from 'ant-design-vue'
  import { v4 as uuidv4 } from 'uuid'
  import { InfoCircleOutlined, PlusOutlined, MinusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    detail: {
      type: Object,
      default: () => ({})
    },
    accountList: {
      type: Array,
      default: () => []
    }
  })
  const emits = defineEmits(['update:open', 'confirm', 'refresh'])

  /** 弹窗相关 */
  function cancel() {
    emits('update:open', false)
  }
  const confirmLoading = ref(false)
  async function handleOk() {
    let baseInfoFormValid = true
    await baseInfoFormRef.value.validate().catch(err => {
      baseInfoFormValid = false
    })
    let attrValid = true
    await attributeFormRef.value.validate().catch(err => {
      attrValid = false
    })
    // 校验材质比例; 1. 非空; 2. 重复; 3. 和为 100%
    let hasMaterialErr = false
    const materialList = attributeOptions.value.filter(item => item.showPercent).map(item => item.zh)
    if (materialList.length) {
      materialList.forEach(key => {
        // 非空
        if (attributes.value[key].some(item => !item.material || !item.percent)) {
          message.warning('材质比例存在空值!')
          hasMaterialErr = true
          return
        }
        // 判断是否有重复
        const valList = new Set(attributes.value[key].map(item => item.material.value))
        if (valList.size !== attributes.value[key].length) {
          message.warning('材质存在重复值!')
          hasMaterialErr = true
          return
        }
        // 和为 100
        const sum = attributes.value[key].reduce((pre, cur) => cur.percent + pre, 0)
        if (sum !== 100) {
          message.warning('材质百分比之和须等于 100!')
          hasMaterialErr = true
        }
      })
    }
    // 自定义属性
    const hasEmpty = cusAttribute.value.some(item => !item.label || !item.value)
    if (hasEmpty) {
      message.warning('请将自定义属性填写完整')
    }
    // 若有校验不通过, return; 阻断下序操作
    if (!baseInfoFormValid || !attrValid || hasMaterialErr || hasEmpty) return

    confirmLoading.value = true
    const aeopAeProductPropertys = []
    for (const key in attributes.value) {
      const tempObj = attributeOptions.value.find(item => item.zh === key)
      switch (Object.prototype.toString.call(attributes.value[key]).slice(8, -1)) {
        case 'Object':
          aeopAeProductPropertys.push({
            attrName: key,
            attrNameId: tempObj.attributeId,
            attrValue: attributes.value[key].label,
            attrValueId: attributes.value[key].value
          })
          break
        case 'Array':
          // 一个属性多个选中值的情况，以多个该对象存放
          if (materialList.includes(key)) {
            attributes.value[key].forEach(val => {
              aeopAeProductPropertys.push({
                attrName: key,
                attrNameId: tempObj.attributeId,
                attrValue: val.material.label, // 原写法值为: 选择的属性(Object) || 自定义(String)
                attrValueId: val.material.value,
                percent: val.percent
              })
            })
          } else {
            attributes.value[key].forEach(val => {
              aeopAeProductPropertys.push({
                attrName: key,
                attrNameId: tempObj.attributeId,
                attrValue: val.label, // 原写法值为: 选择的属性(Object) || 自定义(String)
                attrValueId: val.value
              })
            })
          }
          break
        case 'String':
        default:
          aeopAeProductPropertys.push({
            attrName: key,
            attrNameId: tempObj.attributeId,
            attrValue: attributes.value[key]
          })
          break
      }
    }

    const result = cusAttribute.value.map(item => {
      return {
        attrNameId: -1,
        attrName: item.label,
        attrValue: item.value
      }
    })
    // 分类 label
    const textList = baseInfoForm.value.categoryIds.map(id => {
      const target = categoryRawList.value.find(item => item.id === id)
      return target.label
    })
    let displayText = textList.join('/')

    aeopAeProductPropertys.push(...result)
    const params = {
      id: props.detail.id,
      sellerId: baseInfoForm.value.sellerId,
      templateName: baseInfoForm.value.name,
      templateType: 6,
      productClassification: baseInfoForm.value.categoryIds,
      displayText,
      templateValue: JSON.stringify(aeopAeProductPropertys)
    }
    const requestApi = props.detail.id ?  templateUpdateApi : templateAddApi
    requestApi(params)
      .then(res => {
        cancel()
        emits('refresh')
      })
      .finally(() => {
        confirmLoading.value = false
      })
  }

  /** 表单内容 */
  const baseInfoFormRef = ref()
  const baseInfoForm = ref({
    name: '',
    sellerId: undefined,
    categoryIds: []
  })
  const rules = ref({
    sellerId: {
      required: true,
      message: '必填项，请填写',
      trigger: 'change'
    },
    name: {
      required: true,
      message: '必填项，请填写',
      trigger: 'change'
    },
    categoryIds: {
      required: true,
      message: '必填项，请填写',
      trigger: 'change'
    }
  })

  // 产品属性表单
  const attributeFormRef = ref()
  const attributeForm = ref({})
  const categoryOptions = ref([])
  const attributes = ref({})
  const attributeOptions = ref([]) // 属性列表
  const parentAndSubAttrCache = ref({}) // 收集动态添加的下级属性; 格式为{父id: [子id]}

  function handleAccountChange() {
    baseInfoForm.value.categoryIds = []
    categoryRawList.value = []
    categoryOptions.value = []
    getCategoryOptions()
    attributes.value = {}
    attributeOptions.value = []
  }

  // 获取分类选项列表
  const categoryRawList = ref([]) // 分类数据原始列表, 供查询分类 label 用
  function getCategoryOptions() {
    getProductClassificationApi({ channelSellerId: baseInfoForm.value.sellerId }).then(res => {
      const rawList = res.data || []
      rawList.forEach(item => {
        const names = JSON.parse(item.names)
        item.label = `${names.zh}(${names.en})`
      })
      categoryRawList.value = rawList

      // 添加进第一级数据
      const options = rawList.filter(item => item.levelId === '0')
      generateNodeTree(options)
      categoryOptions.value = options

      // 生成节点树
      function generateNodeTree(list) {
        list.forEach(node => {
          if (!node.isleaf) {
            node.children = rawList.filter(item => item.levelId === node.id)
            generateNodeTree(node.children)
          }
        })
      }
    })
  }

  const stopHandleAttrOnce = ref(false) // 阻止编辑时初次的[中国省份]设置默认值; 一次性
  const loading = ref(false)
  // 选完分类后获取属性
  function getAttributes() {
    return new Promise(resolve => {
      loading.value = true
      attributes.value = {}
      attributeOptions.value = []
      const params = {
        channelSellerId: baseInfoForm.value.sellerId,
        categoryId: baseInfoForm.value.categoryIds.slice(-1)[0] // 叶子类目id
      }
      resultByPostCateIdAndPathApi(params)
        .then(res => {
          if (res.data) {
            // 处理属性数据
            const tempList = res.data.result.attributes || []
            const attributeList = tempList.filter(item => item.visible && !item.sku)
            const SKUList = tempList.filter(item => item.visible && item.sku)
            /**
             * attributeShowTypeValue 枚举值
             * list_box 下拉列表
             * input 输入框
             * input_int 数字输入框
             * input_string 文本框
             * radio 单选
             * check_box 多选框
             *  == 以下的描述有点迷惑 (⊙_⊙)? ==
             * group_table check_box属性含有子属性
             * group_item check_box多选子属性
             * unit 单位
             * interval 区间输入框
             * other
             */
            attributeList.forEach(item => {
              item.zh = JSON.parse(item.names).zh
              item.en = JSON.parse(item.names).en
              // 是否支持材质百分比(有 AE_FEATURE_material_ratio 字段则为需要填写百分比)
              item.showPercent = item.features.includes('AE_FEATURE_material_ratio')
              item.values.forEach(value => {
                const names = JSON.parse(value.names)
                value.name = names.zh + '(' + names.en + ')'
                value.en = names.en
                // 删除空属性 attributes; 它会导致控制台出一堆警告
                delete value.attributes
              })
            })

            // check_box给赋一个初始值[], 这个没初始值会校验报红; 其他的就靠双向绑定赋值了
            const checkboxList = attributeList.filter(item => item.attributeShowTypeValue === 'check_box')
            checkboxList.forEach(item => {
              // [高关注化学物质-400000603], 默认选[无-23399591357]
              if (item.attributeId === 400000603) {
                const val = item.values.find(item => item.attributeValueId === 23399591357)
                if (val) {
                  attributes.value[item.zh] = [{ label: val.name, value: val.attributeValueId, option: val }]
                }
              } else if (item.showPercent) {
                // 填写材质比例
                attributes.value[item.zh] = [{ id: uuidv4(), material: undefined, percent: undefined }]
              } else {
                attributes.value[item.zh] = []
              }
            })

            attributeOptions.value = attributeList

            // 如果属性里有[产地（国家或地区）-219], 默认选[中国大陆-9441741844]
            const i = attributeOptions.value.findIndex(item => item.attributeId === 219)
            if (i > -1) {
              // 找到[中国大陆-9441741844]
              const val = attributeOptions.value[i].values.find(item => item.attributeValueId === 9441741844)
              if (val) {
                attributes.value[attributeOptions.value[i].zh] = { label: val.name, value: val.attributeValueId, option: val }
                // 编辑时, 最初的渲染, 不查询下级属性, 因为详情里有数据会组成初次结构; 后续变更不拦截
                if (stopHandleAttrOnce.value) {
                  stopHandleAttrOnce.value = false
                } else {
                  handleAttrChange(val, i)
                }
              }
            }
          } else {
            message.warning('产品分类不存在, 无法获取到该产品属性')
          }
        })
        .finally(() => {
          loading.value = false
          resolve()
        })
    })
  }
  const selectRefs = ref({})
  // 属性选择变化
  function supportEnumInputSelect(val, option, key, i) {
    if (Object.keys(option).length === 0) {
      // 自定义输入内容
      attributes.value[key] = [{ label: val.value, value: undefined }]
    } else {
      attributes.value[key] = [{ label: val.label, value: val.value, option }]
    }
    selectRefs.value[key].blur()

    handleAttrChange(attributes.value[key], i)
  }

  // 动态绑定 ref
  function setRef(el, key) {
    if (el) {
      selectRefs.value[key] = el
    }
  }

  // hasSubAttr为true时, 代表有子属性; 主要是为了在产地选中国大陆后, 显示省份, 且默认选浙江省
  function handleAttrChange(val, i, isEdit = false) {
    if (!val) return
    // 如果存在过下级属性, 先删除该属性
    if (attributeOptions.value[i].attributeId in parentAndSubAttrCache.value) {
      attributeOptions.value = attributeOptions.value.filter(item => !parentAndSubAttrCache.value[attributeOptions.value[i].attributeId].includes(item.zh))
      parentAndSubAttrCache.value[attributeOptions.value[i].attributeId].forEach(zh => {
        delete attributes.value[zh]
      })
      // 删除该项缓存
      delete parentAndSubAttrCache.value[attributeOptions.value[i].attributeId]
    }
    // 代码调用时, val 内没 option; 手动选择时调用, 原始值放在 val 的 option 中;
    const attrInfo = {
      ...val,
      ...val.option
    }
    // 该属性有下级属性, 插入新数据
    if (attrInfo.hasSubAttr) {
      setTimeout(() => {
        loading.value = true
      }, 0)
      const params = {
        channelSellerId: baseInfoForm.value.sellerId,
        param1: baseInfoForm.value.categoryIds.slice(-1)[0], // 叶子类目id
        param2: `${attributeOptions.value[i].attributeId}=${attrInfo.attributeValueId}`
      }
      getResultByPostCateIdAndPathApi(params)
        .then(res => {
          if (res && res.code === 200) {
            // 处理属性数据
            const tempList = res.data.result.attributes || []
            const attributeList = tempList.filter(item => item.visible && !item.sku)
            attributeList.forEach(item => {
              item.zh = JSON.parse(item.names).zh
              item.en = JSON.parse(item.names).en
              item.values.forEach(value => {
                value.name = JSON.parse(value.names).zh + '(' + JSON.parse(value.names).en + ')'
                delete value.attributes
              })
            })
            // 收集下级属性
            parentAndSubAttrCache.value[attributeOptions.value[i].attributeId] = attributeList.map(item => item.zh)
            if (!isEdit) {
              // 设置中国省份默认为浙江省
              // const PROVINCE = 'CN'
              const PROVINCE = '中国省份'
              const showProvince = attributeList.some(item => item.zh === PROVINCE)
              if (showProvince) {
                attributes.value[PROVINCE] = { value: 100015203, label: '浙江(Zhejiang)', en: 'Zhejiang', option: { attributeValueId: 100015203, name: '浙江(Zhejiang)', en: 'Zhejiang' } }
              }
            } else {
              // 狸猫换太子
              attributeList.forEach(item => {
                const subAttr = attributes.value[item.attributeId]
                if (subAttr) {
                  attributes.value[item.zh] = subAttr
                  delete attributes.value[item.attributeId]
                }
              })
            }

            const checkboxList = attributeList.filter(item => item.attributeShowTypeValue === 'check_box')
            checkboxList.forEach(item => {
              attributes.value[item.zh] = []
            })

            attributeOptions.value.splice(i + 1, 0, ...attributeList)
          }
        })
        .finally(() => (loading.value = false))
    }
  }

  /** 自定义属性 */
  const cusAttribute = ref([])
  function addAttr() {
    cusAttribute.value.push({
      id: uuidv4(),
      label: '',
      value: ''
    })
  }
  /** 材质百分比 添加/删除 */
  function materialAdd(list) {
    list.push({ id: uuidv4(), material: undefined, percent: undefined })
  }
  function materialDel(list, i) {
    list.splice(i, 1)
  }
  // 自定义属性 上/下移
  function move(type, i) {
    let targetIndex = undefined
    if (type === 'up') {
      targetIndex = i - 1
    } else if (type === 'down') {
      targetIndex = i + 1
    }
    const temp = { ...cusAttribute.value[i] }
    cusAttribute.value[i] = cusAttribute.value[targetIndex]
    cusAttribute.value[targetIndex] = temp
  }
  function delAttr(id) {
    cusAttribute.value = cusAttribute.value.filter(item => item.id !== id)
  }

  watch(
    () => props.open,
    async open => {
      if (open && Object.keys(props.detail).length) {
        stopHandleAttrOnce.value = true
        baseInfoForm.value.name = props.detail.templateName
        baseInfoForm.value.sellerId = props.detail.sellerId
        handleAccountChange()
        baseInfoForm.value.categoryIds = props.detail.productClassification
        await getAttributes()

        const templateValue = JSON.parse(props.detail.templateValue)
        // 与品类绑定的属性
        const attributeList = templateValue.filter(item => item.attrNameId && item.attrNameId !== -1)
        // 整合先
        const root = {}
        attributeList.forEach(item => {
          if (root[item.attrNameId]) {
            root[item.attrNameId].push(item)
          } else {
            root[item.attrNameId] = [item]
          }
        })
        // 因要判断是否还有下级属性(hasSubAttr), 不能直接赋 aeopAeProductPropertys 的值; 从 attributeOptions 里取
        const attributesObj = {}
        for (const attrNameId in root) {
          const option = attributeOptions.value.find(option => option.attributeId == attrNameId)
          if (option) {
            switch (option.attributeShowTypeValue) {
              case 'list_box':
                const target = option.values.find(val => val.attributeValueId == root[attrNameId][0].attrValueId)
                if (target) {
                  // 如果 supportEnumInput 为 true, 则设置 mode = tags, 值为 Array
                  attributesObj[option.zh] = option.supportEnumInput
                    ? [
                        {
                          label: target.name,
                          value: target.attributeValueId,
                          key: target.attributeValueId,
                          option: target
                        }
                      ]
                    : {
                        label: target.name,
                        value: target.attributeValueId,
                        key: target.attributeValueId,
                        option: target
                      }
                } else {
                  attributesObj[option.zh] = option.supportEnumInput ? [{ label: root[attrNameId][0].attrValue, value: undefined }] : { label: root[attrNameId][0].attrValue, value: undefined }
                }
                break

              case 'check_box':
                attributesObj[option.zh] = root[attrNameId].map(item => {
                  const target = option.values.find(val => val.attributeValueId == item.attrValueId)
                  if (target) {
                    // 材质百分比
                    if (option.showPercent) {
                      return {
                        material: {
                          label: target.name,
                          value: target.attributeValueId,
                          key: target.attributeValueId,
                          option: target
                        },
                        percent: item.percent
                      }
                    } else {
                      // 其他多选类型
                      return {
                        label: target.name,
                        value: target.attributeValueId,
                        key: target.attributeValueId,
                        option: target
                      }
                    }
                  } else {
                    return { label: item.attrValue, value: undefined }
                  }
                })
                break

              case 'input':
              case 'input_int':
              case 'radio':
              default:
                attributesObj[option.zh] = root[attrNameId][0].attrValue
                break
            }
          } else {
            // 动态添加的下级属性(查不到, 下面查到属性后再狸猫换太子)
            attributesObj[attrNameId] = {
              en: root[attrNameId][0].attrValue,
              value: root[attrNameId][0].attrValueId,
              option: {
                en: root[attrNameId][0].attrValue,
                name: root[attrNameId][0].attrName,
                attributeValueId: Number(root[attrNameId][0].attrValueId)
              }
            }
          }
        }
        // 如果存在下级属性 hasSubAttr
        for (const zh in attributesObj) {
          if (Object.prototype.toString.call(attributesObj[zh]).slice(8, -1) === 'Object') {
            if (attributesObj[zh].option.hasSubAttr) {
              const i = attributeOptions.value.findIndex(item => item.zh === zh)
              i > -1 && handleAttrChange(attributesObj[zh], i, true)
            }
          }
        }
        attributes.value = attributesObj
        // 自定义属性
        const cusAttributeList = templateValue.filter(item => item.attrNameId === -1)
        cusAttributeList.forEach(item => {
          cusAttribute.value.push({
            id: uuidv4(),
            label: item.attrName,
            value: item.attrValue
          })
        })
      }
    },
    // 因为父组件用了 v-if, 这里侦听器立即触发一次
    { immediate: true }
  )
</script>
