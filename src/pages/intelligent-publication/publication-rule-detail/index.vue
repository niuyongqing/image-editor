<!-- 刊登规则详情 -->
<template>
  <a-card class="text-left w-3/5 mx-auto h-[calc(100vh-60px)] pt-4">
    <div class="h-[calc(100vh-140px)] overflow-y-auto">
      <a-form
        ref="formRef"
        :model="form"
        hide-required-mark
        :rules="rules"
        :label-col="{ style: { width: '120px' } }"
        :disabled="query.type === 'view'"
      >
        <a-form-item
          label="模版名称"
          name="name"
        >
          <a-input
            v-model:value="form.name"
            allow-clear
            placeholder="请输入模版名称"
            class="w-1/2"
          />
        </a-form-item>
        <a-form-item
          label="状态"
          name="status"
        >
          <a-radio-group v-model:value="form.status">
            <a-radio value="1">启用</a-radio>
            <a-radio value="0">停用</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-divider />

        <a-form-item
          label="产品分类"
          name="categoryIds"
        >
          <a-button @click="categoryOpen = true">选择分类</a-button>
          <div v-if="categoryLabels">
            {{ categoryLabels }}
          </div>
        </a-form-item>
        <a-form-item
          label="平均成本价区间"
          name="costPrice"
        >
          <div class="flex">
            <a-form-item class="mb-0">
              <a-input-number
                v-model:value="form.costPriceMin"
                :controls="false"
                :min="0.01"
                :max="9999"
                :precision="2"
                placeholder="最低"
                class="mr-1"
              />
            </a-form-item>
            至
            <a-form-item class="mb-0">
              <a-input-number
                v-model:value="form.costPriceMax"
                :controls="false"
                :min="0.01"
                :max="9999"
                :precision="2"
                placeholder="最高"
                class="ml-1"
              />
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item
          label="平均重量区间"
          name="weight"
        >
          <div class="flex">
            <a-form-item class="mb-0">
              <a-input-number
                v-model:value="form.weightMin"
                :controls="false"
                :min="0.01"
                :max="9999"
                :precision="2"
                placeholder="最低"
                class="mr-1"
              />
            </a-form-item>
            至
            <a-form-item class="mb-0">
              <a-input-number
                v-model:value="form.weightMax"
                :controls="false"
                :min="0.01"
                :max="9999"
                :precision="2"
                placeholder="最高"
                class="ml-1"
              />
            </a-form-item>
          </div>
        </a-form-item>

        <a-divider />

        <a-form-item
          label="标题规则"
          name="titleRule"
          class="mb-0"
        >
          <a-radio-group v-model:value="form.titleRule">
            <a-radio value="1">不允许重复</a-radio>
            <a-radio
              value="2"
              class="[&>.ant-radio]:-translate-y-3"
            >
              <div class="flex">
                重复
                <a-form-item name="titleRepeat">
                  <a-input-number
                    v-model:value="form.titleRepeat"
                    :controls="false"
                    :min="1"
                    :max="99"
                    :precision="0"
                    :disabled="form.titleRule !== '2'"
                    class="mx-1"
                    placeholder="选中后填写"
                  />
                </a-form-item>
                次
              </div>
            </a-radio>
            <a-radio value="3">不限制重复次数</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="主图规则"
          name="mainImageRule"
          class="mb-0"
        >
          <a-radio-group v-model:value="form.mainImageRule">
            <a-radio value="1">不允许重复</a-radio>
            <a-radio
              value="2"
              class="[&>.ant-radio]:-translate-y-3"
            >
              <div class="flex">
                重复
                <a-form-item name="mainImageRepeat">
                  <a-input-number
                    v-model:value="form.mainImageRepeat"
                    :controls="false"
                    :min="1"
                    :max="99"
                    :precision="0"
                    :disabled="form.mainImageRule !== '2'"
                    class="mx-1"
                    placeholder="选中后填写"
                  />
                </a-form-item>
                次
              </div>
            </a-radio>
            <a-radio value="3">不限制重复次数</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="副图规则"
          name="subImageRule"
          class="mb-0"
        >
          <a-radio-group v-model:value="form.subImageRule">
            <a-radio value="1">不允许重复</a-radio>
            <a-radio
              value="2"
              class="[&>.ant-radio]:-translate-y-3"
            >
              <div class="flex">
                重复
                <a-form-item name="subImageRepeat">
                  <a-input-number
                    v-model:value="form.subImageRepeat"
                    :controls="false"
                    :min="1"
                    :max="99"
                    :precision="0"
                    :disabled="form.subImageRule !== '2'"
                    class="mx-1"
                    placeholder="选中后填写"
                  />
                </a-form-item>
                次
              </div>
            </a-radio>
            <a-radio value="3">不限制重复次数</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="资料不足时"
          name="dataIsLack"
        >
          <a-radio-group
            v-model:value="form.dataIsLack"
            :options="DATA_IS_LACK_OPTIONS"
          />
        </a-form-item>
        <a-form-item
          label="刊登模式"
          name="publicationMode"
        >
          <a-radio-group
            v-model:value="form.publicationMode"
            :options="PUBLICATION_OPTIONS"
          />
        </a-form-item>
        <a-form-item
          label="刊登店铺"
          name="shops"
        >
          <a-spin :spinning="shopLoading">
            <div class="mb-2">
              <a-form-item-rest>
                <a-checkbox
                  v-model:checked="checkAll"
                  :indeterminate="indeterminate"
                  @change="onCheckAllChange"
                >
                  全选
                </a-checkbox>
              </a-form-item-rest>
            </div>
            <div>
              <a-checkbox-group
                v-model:value="form.shops"
                @change="checkboxChange"
              >
                <a-checkbox
                  v-for="shop in shopList"
                  :key="shop.account"
                  :value="shop.account"
                  :title="shop.simpleName"
                >
                  <span
                    class="inline-block w-30 align-middle truncate"
                    :title="shop.simpleName"
                    >{{ shop.simpleName }}</span
                  >
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </a-spin>
        </a-form-item>
        <a-form-item
          label="刊登频率"
          name="interval"
        >
          <div class="flex">
            同店铺不同商品间隔时间:
            <a-form-item class="mb-2">
              <a-input-number
                v-model:value="form.productIntervalMin"
                :controls="false"
                :min="1"
                :max="999"
                :precision="0"
                placeholder="最少"
                class="mx-1"
              />
            </a-form-item>
            至
            <a-form-item class="mb-2">
              <a-input-number
                v-model:value="form.productIntervalMax"
                :controls="false"
                :min="1"
                :max="999"
                :precision="0"
                placeholder="最多"
                class="mx-1"
              />
            </a-form-item>
            分钟
          </div>
          <div class="flex">
            同商品不同店铺间隔时间:
            <a-form-item class="mb-0">
              <a-input-number
                v-model:value="form.shopIntervalMin"
                :controls="false"
                :min="1"
                :max="999"
                :precision="0"
                placeholder="最少"
                class="mx-1"
              />
            </a-form-item>
            至
            <a-form-item class="mb-0">
              <a-input-number
                v-model:value="form.shopIntervalMax"
                :controls="false"
                :min="1"
                :max="999"
                :precision="0"
                placeholder="最多"
                class="mx-1"
              />
            </a-form-item>
            分钟
          </div>
        </a-form-item>
      </a-form>
    </div>

    <a-space v-if="query.type === 'edit'" class="absolute bottom-4 right-4">
      <a-button @click="close">关闭</a-button>
      <a-button
        type="primary"
        :loading="loading"
        @click="save"
        >保存</a-button
      >
    </a-space>

    <!-- 分类弹窗 -->
    <CustomCategorySelector
      v-model:open="categoryOpen"
      v-model:category-ids="form.categoryIds"
      v-model:categoryLabels="categoryLabels"
      @change="validateCategory"
    />
  </a-card>
</template>

<script setup>
  import { accountCache } from '@/pages/ozon/config/api/product'
  import CustomCategorySelector from '@/components/custom-category-selector/index.vue'
  import { message } from 'ant-design-vue'
  import { usePostMessage } from '@/utils/postMessage'

  const route = useRoute()
  const {query} = route
  // 资料不足时的选项
  const DATA_IS_LACK_OPTIONS = [
    { label: '优先刊登排序靠前的店铺', value: '1' },
    { label: '优先刊登排序靠后的店铺', value: '2' },
    { label: '随机刊登店铺', value: '3' },
    { label: '允许重复产品刊登多个店铺', value: '4' }
  ]
  // 刊登模式选项
  const PUBLICATION_OPTIONS = [
    { label: '手动刊登', value: '1' },
    { label: '自动刊登', value: '2' }
  ]

  const formRef = ref()
  const form = reactive({
    name: '',
    status: '1',
    categoryIds: '',
    costPriceMin: null,
    costPriceMax: null,
    weightMin: null,
    weightMax: null,
    titleRule: '1',
    titleRepeat: null,
    mainImageRule: '1',
    mainImageRepeat: null,
    subImageRule: '3',
    subImageRepeat: null,
    dataIsLack: '3', // 资料不足时
    publicationMode: '1',
    shops: [],
    productIntervalMin: 5, // 不同商品间隔时间
    productIntervalMax: 10,
    shopIntervalMin: 5, // 不同店铺间隔时间
    shopIntervalMax: 10
  })
  const categoryLabels = ref('') // 分类 labels ( / 拼接)

  /** 自定义校验规则 */
  // [成本价, 重量]
  const validateRange = rule => {
    const rangeList = [form[`${rule.field}Min`], form[`${rule.field}Max`]]
    if (!rangeList.every(Boolean)) {
      return Promise.reject('请填写区间')
    }
    if (form[`${rule.field}Min`] >= form[`${rule.field}Max`]) {
      return Promise.reject('前一个数值要小于后一个数值')
    }
    return Promise.resolve()
  }
  // [标题, 主图, 副图]枚举
  const KEY_VALUE_ENUM = {
    titleRule: 'titleRepeat',
    mainImageRule: 'mainImageRepeat',
    subImageRule: 'subImageRepeat',
    // 反之
    titleRepeat: 'titleRule',
    mainImageRepeat: 'mainImageRule',
    subImageRepeat: 'subImageRule'
  }
  // 规则变动, 为[1|3]时清空校验
  const validateRuleChange = (rule, value) => {
    const field = KEY_VALUE_ENUM[rule.field]
    if (['1', '3'].includes(value)) {
      formRef.value.clearValidate([field])
    }
    return Promise.resolve()
  }
  // 重复次数
  const validateRepeatChange = rule => {
    const repeatField = rule.field
    const field = KEY_VALUE_ENUM[repeatField]
    if (form[field] === '2' && !form[repeatField]) {
      return Promise.reject('请填写重复次数')
    } else {
      return Promise.resolve()
    }
  }
  // 刊登频率
  const validateInterval = () => {
    const intervalList = [form.productIntervalMin, form.productIntervalMax, form.shopIntervalMin, form.shopIntervalMax]
    if (!intervalList.every(Boolean)) {
      return Promise.reject('请填写刊登频率')
    }
    if (form.productIntervalMin >= form.productIntervalMax || form.shopIntervalMin >= form.shopIntervalMax) {
      return Promise.reject('前一个时间要小于后一个时间')
    }
    return Promise.resolve()
  }
  const rules = {
    name: [{ required: true }],
    categoryIds: [{ required: true }],
    costPrice: [{ validator: validateRange }],
    weight: [{ validator: validateRange }],
    titleRule: [{ validator: validateRuleChange }],
    titleRepeat: [{ validator: validateRepeatChange }],
    mainImageRule: [{ validator: validateRuleChange }],
    mainImageRepeat: [{ validator: validateRepeatChange }],
    subImageRule: [{ validator: validateRuleChange }],
    subImageRepeat: [{ validator: validateRepeatChange }],
    shops: [{ required: true }],
    interval: [{ validator: validateInterval }]
  }

  /** 产品分类 */
  const categoryOpen = ref(false)

  // 选择分类后校验(目的是为了清空下方 error 信息)
  function validateCategory() {
    formRef.value.validateFields(['categoryIds'])
  }

  /** 店铺列表 */
  let shopList = ref([])
  const shopLoading = ref(false)

  getShopList()
  function getShopList() {
    shopLoading.value = true
    accountCache()
      .then(res => {
        shopList.value = res.data || []
        if (shopList.value.length === 0) {
          message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
        } else {
          form.shops = shopList.value.map(item => item.account)
        }
      })
      .finally(() => {
        shopLoading.value = false
      })
  }

  const checkAll = ref(true)
  const indeterminate = ref(false)

  function onCheckAllChange(e) {
    form.shops = e.target.checked ? shopList.value.map(item => item.account) : []
    indeterminate.value = false
  }

  function checkboxChange(checkedList) {
    const checkedListLength = checkedList.length
    indeterminate.value = checkedListLength > 0 && checkedListLength < shopList.value.length
    checkAll.value = checkedListLength === shopList.value.length
  }

  /** 底部按钮 */
  const loading = ref(false)

  function close() {
    formRef.value.resetFields()
    form.costPriceMin = null
    form.costPriceMax = null
    form.weightMin = null
    form.weightMax = null
    form.productIntervalMin = 5
    form.productIntervalMax = 10
    form.shopIntervalMin = 5
    form.shopIntervalMax = 10
    categoryLabels.value = ''

    window.close()
  }

  function save() {
    formRef.value.validate().then(() => {
      const params = { ...form }
      if (params.mainImageRule !== '2') {
        delete params.mainImageRepeat
      }
      if (params.subImageRule !== '2') {
        delete params.subImageRepeat
      }
      console.log(params)
      return

      // message.success('提交刊登成功')
      // usePostMessage()
    })
  }
</script>
