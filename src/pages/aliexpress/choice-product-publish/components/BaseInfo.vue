<template>
  <a-card
    title="基本信息"
    class="mb-4"
  >
    <a-form
      ref="ruleFormRef"
      :model="form"
      :label-col="{ style: { width: '180px' } }"
      :wrapper-col="{ span: 14 }"
      :rules="rules"
    >
      <a-form-item
        label="店铺名称"
        name="sellerId"
      >
        <a-select
          v-model:value="form.sellerId"
          placeholder="请选择店铺"
          show-search
          allow-clear
          :options="accounts"
          :field-names="{ label: 'simpleName', value: 'sellerId' }"
          option-filter-prop="simpleName"
          @change="handleAccountChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item name="productType">
        <template #label>
          <span class="mr-1">备货类型</span>
          <a-popover overlayClassName="w-[380px]">
            <template #content>
              <span
                >1、国内履约：即时补货模式 (JIT) 商品备货在商家仓库，消费者下单后，商家需在指定时间内快速发货至指定速卖通全托管官方仓。<br />2、海外备仓模式:商家备货到速卖通全托管指定的海外仓模式。消费者下单后，速卖通全托管海外仓直接发货。</span
              >
            </template>
            <InfoCircleOutlined
          /></a-popover>
        </template>
        <a-select
          v-model:value="form.productType"
          placeholder="请选择备货类型"
          :options="productTypeOptions"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="产品标题"
        name="name"
      >
        <a-input
          v-model:value="form.name"
          placeholder="请输入产品英文标题"
          :maxlength="128"
          show-count
        ></a-input>
      </a-form-item>
      <a-form-item
        label="产品分类"
        name="categoryIdList"
      >
        <a-cascader
          v-model:value="form.categoryIdList"
          show-search
          placeholder="请选择产品分类"
          :options="options"
          :field-names="{ value: 'id' }"
          :allow-clear="false"
          @change="getAttributes"
        ></a-cascader>
      </a-form-item>
      <a-form-item label="产品属性">
        <a-card
          :loading="loading"
          class="relative"
        >
          <a-form
            ref="attributeFormRef"
            :model="attributes"
            :label-col="{ style: { width: '150px' } }"
            :wrapper-col="{ style: { width: '186px' } }"
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
                  :ref="`selectRef${item.zh}`"
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
              ></a-input>
              <a-input
                v-else-if="item.attributeShowTypeValue === 'input_int'"
                v-model:value.trim="attributes[item.zh]"
                placeholder="请输入数值"
              ></a-input>
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
              <!-- TODO: item.supportEnumInput -->
              <a-select
                v-else-if="item.attributeShowTypeValue === 'check_box'"
                v-model:value="attributes[item.zh]"
                :options="item.values"
                :field-names="{ label: 'name', value: 'attributeValueId' }"
                mode="multiple"
                show-search
                allow-clear
                label-in-value
                option-filter-prop="name"
                placeholder="请选择"
              >
              </a-select>
              <a-input
                v-else
                v-model:value="item.attributeShowTypeValue"
                disabled
              ></a-input>
            </a-form-item>
          </a-form>
        </a-card>
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
            ></a-input>
            <a-input
              v-model:value="item.value"
              placeholder="属性值"
              class="ml-2.5"
            ></a-input>
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
</template>

<script>
  import { getProductClassificationApi, resultByPostCateIdAndPathApi, getResultByPostCateIdAndPathApi } from '../../apis/product'
  import { accountCacheApi } from '../../apis/common'
  import { queryChannelApi } from '../../apis/choice-product'
  import { InfoCircleOutlined, PlusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import { v4 as uuidv4 } from 'uuid'
  import { cloneDeep } from 'lodash'
  import { useAliexpressChoiceProductStore } from '@/stores/aliexpress-choice-product'
  import { findParentIds } from '@/utils/index'

  export default {
    name: 'BaseInfo',
    components: { InfoCircleOutlined, PlusOutlined, UpOutlined, DownOutlined },
    data() {
      return {
        store: useAliexpressChoiceProductStore(),
        accounts: [],
        productTypeOptions: [
          { label: '国内履约', value: '1' },
          { label: '海外备货', value: '2', disabled: true }
        ],
        options: [],
        form: {
          sellerId: undefined,
          productType: '1',
          name: '',
          category: undefined,
          categoryIdList: [] // 存放产品分类双向绑定的数据
        },
        currencyCode: '',
        loading: false,
        attributes: {}, // 产品属性, 收集值
        rules: {
          sellerId: {
            required: true,
            message: '必填项，请填写',
            trigger: 'change'
          },
          productType: {
            required: true,
            message: '必填项，请填写',
            trigger: 'change'
          },
          name: {
            required: true,
            message: '必填项，请填写',
            trigger: 'change'
          },
          categoryIdList: {
            required: true,
            message: '必填项，请填写',
            trigger: 'change'
          }
        },
        attributeOptions: [], // 属性列表
        parentAndSubAttrCache: {}, // 收集动态添加的下级属性; 格式为{父id: [子id]}
        cusAttribute: [],
        stopHandleAttrOnce: false // 阻止编辑时初次的[中国省份]设置默认值; 一次性
      }
    },
    computed: {
      productDetail() {
        return this.store.productDetail
      }
    },
    watch: {
      productDetail: {
        handler: async function (detail) {
          if (Object.keys(detail).length === 0) return

          this.stopHandleAttrOnce = true
          // 赋值
          this.form.sellerId = this.store.sellerId
          this.handleAccountChange()
          this.form.productType = detail.productExtDto.productType
          this.form.name = detail.productInfoDto.subjectList.find(item => item.locale === 'en_US').value
          this.form.category = String(detail.productInfoDto.categoryId)
          await this.getAttributes()

          // 与品类绑定的属性
          const attributeList = detail.productPropertyList.filter(item => item.attrNameId && item.attrNameId !== -1)
          // 整合先
          const root = {}
          attributeList.forEach(item => {
            if (root[item.attrNameId]) {
              root[item.attrNameId].push(item)
            } else {
              root[item.attrNameId] = [item]
            }
          })
          // 因要判断是否还有下级属性(hasSubAttr), 不能直接赋 productPropertyList 的值; 从 attributeOptions 里取
          const attributesObj = {}
          for (const attrNameId in root) {
            const option = this.attributeOptions.find(option => option.attributeId == attrNameId)
            if (option) {
              switch (option.attributeShowTypeValue) {
                case 'list_box':
                  const target = option.values.find(val => val.attributeValueId == root[attrNameId][0].attrValueId)
                  if (target) {
                    attributesObj[option.zh] = target
                  } else {
                    attributesObj[option.zh] = root[attrNameId][0].attrValue
                  }
                  break

                case 'check_box':
                  attributesObj[option.zh] = root[attrNameId].map(item => {
                    const target = option.values.find(val => val.attributeValueId == item.attrValueId)
                    if (target) {
                      return target
                    } else {
                      return item.attrValue
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
                attributeValueId: Number(root[attrNameId][0].attrValueId),
                name: root[attrNameId][0].attrName,
                en: root[attrNameId][0].attrValue
              }
            }
          }
          // 如果存在下级属性 hasSubAttr
          for (const zh in attributesObj) {
            if (Object.prototype.toString.call(attributesObj[zh]).slice(8, -1) === 'Object') {
              if (attributesObj[zh].hasSubAttr) {
                const i = this.attributeOptions.findIndex(item => item.zh === zh)
                i > -1 && this.handleAttrChange(attributesObj[zh], i, true)
              }
            }
          }
          this.attributes = attributesObj
          // 数据填充完后, 让父组件再缓存一下数据
          // this.$bus.$emit('cacheAfterDetailFill')

          // 自定义属性
          const cusAttributeList = detail.productPropertyList.filter(item => item.attrNameId === -1)
          cusAttributeList.forEach(item => {
            this.cusAttribute.push({
              id: uuidv4(),
              label: item.attrName,
              value: item.attrValue
            })
          })
        }
      }
    },
    mounted() {
      this.getAccounts()
    },
    methods: {
      getAccounts() {
        accountCacheApi(true).then(res => {
          this.accounts = res.data.accountDetail || []
        })
      },
      // 获取产品分类选项
      getCategoryOptions() {
        getProductClassificationApi({ channelSellerId: this.form.sellerId }).then(res => {
          if (res && res.code === 200) {
            const rawList = res.data || []
            rawList.forEach(item => {
              const names = JSON.parse(item.names)
              item.label = `${names.zh}(${names.en})`
            })

            // 添加进第一级数据
            const options = rawList.filter(item => item.levelId === '0')
            generateNodeTree(options)
            this.options = options
            if (this.form.category) {
              // 获取分类的 id 路径
              this.form.categoryIdList = findParentIds(options, this.form.category)
            }

            // 生成节点树
            function generateNodeTree(list) {
              list.forEach(node => {
                if (!node.isleaf) {
                  node.children = rawList.filter(item => item.levelId === node.id)
                  generateNodeTree(node.children)
                }
              })
            }
          }
        })
      },
      // 账号变动时获取产品分类
      handleAccountChange() {
        // 发送至 [图片, 模版, 其他]
        this.store.$patch(state => {
          state.sellerId = this.form.sellerId
        })
        this.getChannelInfo()
        this.form.category = ''
        this.form.categoryIdList = []
        this.options = []
        this.getCategoryOptions()
        this.attributes = {}
        this.attributeOptions = []
      },
      // 获取商家信息
      getChannelInfo() {
        queryChannelApi(this.form.sellerId).then(res => {
          this.store.$patch(state => {
            state.channelInfo = res.data
          })
          this.currencyCode = res.data.channelCurrency
        })
      },
      // 选完分类后获取属性
      getAttributes() {
        if (this.form.categoryIdList.length !== 0) {
          this.form.category = this.form.categoryIdList[this.form.categoryIdList.length - 1]
        }

        this.store.$patch(state => {
          state.categoryId = this.form.category
        })
        return new Promise(resolve => {
          // 发送至其他信息(欧盟责任人)
          this.loading = true
          this.attributes = {}
          this.attributeOptions = []
          const params = {
            channelSellerId: this.form.sellerId,
            categoryId: this.form.category // 叶子类目id
          }
          resultByPostCateIdAndPathApi(params)
            .then(res => {
              if (res.data) {
                // 处理属性数据
                const tempList = res.data.result.attributes || []
                const attributeList = tempList.filter(item => item.visible && !item.sku)
                const SKUList = tempList.filter(item => item.visible && item.sku)
                // 发送至价格与库存, 用于生成SKU
                this.store.$patch(state => {
                  state.SKUList = SKUList
                })
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
                      this.attributes[item.zh] = [{ label: val.name, value: val.attributeValueId, option: val }]
                    }
                  } else {
                    this.attributes[item.zh] = []
                  }
                })

                this.attributeOptions = attributeList

                // 如果属性里有[产地（国家或地区）-219], 默认选[中国大陆-9441741844]
                const i = this.attributeOptions.findIndex(item => item.attributeId === 219)
                if (i > -1) {
                  // 找到[中国大陆-9441741844]
                  const val = this.attributeOptions[i].values.find(item => item.attributeValueId === 9441741844)
                  if (val) {
                    this.attributes[this.attributeOptions[i].zh] = { label: val.name, value: val.attributeValueId, option: val }
                    // 编辑时, 最初的渲染, 不查询下级属性, 因为详情里有数据会组成初次结构; 后续变更不拦截
                    if (this.stopHandleAttrOnce) {
                      this.stopHandleAttrOnce = false
                    } else {
                      this.handleAttrChange(val, i)
                    }
                  }
                }
              } else {
                message.warning('产品分类不存在, 无法获取到该产品属性')
              }
            })
            .finally(() => {
              this.loading = false
              resolve()
            })
        })
      },
      // 属性选择变化
      supportEnumInputSelect(val, option, key, i) {
        if (Object.keys(option).length === 0) {
          // 自定义输入内容
          this.attributes[key] = [{ label: val.value, value: undefined }]
        } else {
          this.attributes[key] = [{ label: val.label, value: val.value, option }]
        }
        this.$refs[`selectRef${key}`][0].blur()

        this.handleAttrChange(this.attributes[key], i)
      },
      // hasSubAttr为true时, 代表有子属性; 主要是为了在产地选中国大陆后, 显示省份, 且默认选浙江省
      handleAttrChange(val, i, isEdit = false) {
        if (!val) return
        // 如果存在过下级属性, 先删除该属性
        if (this.attributeOptions[i].attributeId in this.parentAndSubAttrCache) {
          this.attributeOptions = this.attributeOptions.filter(item => !this.parentAndSubAttrCache[this.attributeOptions[i].attributeId].includes(item.zh))
          this.parentAndSubAttrCache[this.attributeOptions[i].attributeId].forEach(zh => {
            delete this.attributes[zh]
          })
          // 删除该项缓存
          delete this.parentAndSubAttrCache[this.attributeOptions[i].attributeId]
        }
        // 该属性有下级属性, 插入新数据
        if (val.hasSubAttr) {
          setTimeout(() => {
            this.loading = true
          }, 0)
          const params = {
            channelSellerId: this.form.sellerId,
            param1: this.form.category, // 叶子类目id
            param2: `${this.attributeOptions[i].attributeId}=${val.attributeValueId}`
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
                  })
                })
                // 收集下级属性
                this.parentAndSubAttrCache[this.attributeOptions[i].attributeId] = attributeList.map(item => item.zh)
                if (!isEdit) {
                  // 设置中国省份默认为浙江省
                  // const PROVINCE = 'CN'
                  const PROVINCE = '中国省份'
                  const showProvince = attributeList.some(item => item.zh === PROVINCE)
                  if (showProvince) {
                    this.attributes[PROVINCE] = { attributeValueId: 100015203, name: '浙江(Zhejiang)', en: 'Zhejiang' }
                  }
                } else {
                  attributeList.forEach(item => {
                    const subAttr = this.attributes[item.attributeId]
                    if (subAttr) {
                      this.attributes[item.zh] = subAttr
                      delete this.attributes[item.attributeId]
                    }
                  })
                }

                const checkboxList = attributeList.filter(item => item.attributeShowTypeValue === 'check_box')
                checkboxList.forEach(item => {
                  this.attributes[item.zh] = []
                })

                this.attributeOptions.splice(i + 1, 0, ...attributeList)
              }
            })
            .finally(() => (this.loading = false))
        }
      },
      addAttr() {
        this.cusAttribute.push({
          id: uuidv4(),
          label: '',
          value: ''
        })
      },
      // 自定义属性 上/下移
      move(type, i) {
        let targetIndex = undefined
        if (type === 'up') {
          targetIndex = i - 1
        } else if (type === 'down') {
          targetIndex = i + 1
        }
        const temp = { ...this.cusAttribute[i] }
        this.cusAttribute[i] = this.cusAttribute[targetIndex]
        this.cusAttribute[targetIndex] = temp
      },
      delAttr(id) {
        this.cusAttribute = this.cusAttribute.filter(item => item.id !== id)
      },
      // 向上级提交数据
      async emitData({ isDraft = false }) {
        let ruleFormValid = true
        await this.$refs.ruleFormRef.validate().catch(err => {
          ruleFormValid = false
        })
        let attrValid = true
        await this.$refs.attributeFormRef.validate().catch(err => {
          attrValid = false
        })
        // 自定义属性
        const hasEmpty = this.cusAttribute.some(item => !item.label || !item.value)
        if (hasEmpty) {
          message.warning('请将自定义属性填写完整')
        }
        // 若有校验不通过, return; 阻断下序操作
        if (!ruleFormValid || !attrValid || hasEmpty) return

        let subjectList = []
        if (Object.keys(this.productDetail).length === 0) {
          subjectList = [{ locale: 'en_US', value: this.form.name }]
        } else {
          subjectList = cloneDeep(this.productDetail.productInfoDto.subjectList)
          subjectList.forEach(item => {
            if (item.locale === 'en_US') {
              item.value = this.form.name
            }
          })
        }
        const productInfoDto = {
          locale: 'en_US',
          categoryId: this.form.category,
          currencyCode: this.currencyCode,
          subjectList
        }

        const productPropertyList = []
        for (const key in this.attributes) {
          const tempObj = this.attributeOptions.find(item => item.zh === key)
          switch (Object.prototype.toString.call(this.attributes[key]).slice(8, -1)) {
            case 'Object':
              productPropertyList.push({
                attrName: key,
                attrNameId: tempObj.attributeId,
                attrValue: this.attributes[key].label,
                attrValueId: this.attributes[key].value
              })
              break
            case 'Array':
              // 一个属性多个选中值的情况，以多个该对象存放
              this.attributes[key].forEach(val => {
                productPropertyList.push({
                  attrName: key,
                  attrNameId: tempObj.attributeId,
                  attrValue: val.label, // 原写法值为: 选择的属性(Object) || 自定义(String)
                  attrValueId: val.value
                })
              })
              break
            case 'String':
            default:
              productPropertyList.push({
                attrName: key,
                attrNameId: tempObj.attributeId,
                attrValue: this.attributes[key]
              })
              break
          }
        }

        const result = this.cusAttribute.map(item => {
          return {
            attrName: item.label,
            attrValue: item.value
          }
        })

        productPropertyList.push(...result)
        // 产品标题local默认为英文; 分类必须传叶子类目
        return {
          sellerId: this.form.sellerId,
          productType: this.form.productType,
          productInfoDto,
          productPropertyList
        }
      }
    }
  }
</script>
