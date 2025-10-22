<!-- 刊登弹窗 -->
<template>
  <a-modal
    :open="open"
    title="提交刊登"
    width="50%"
    :confirm-loading="loading"
    @cancel="cancel"
    @ok="ok"
  >
    <a-alert
      message="规则仅本次提交时有效, 多次提交相同产品和相同规则会上架相同产品"
      type="warning"
      show-icon
      class="mt-3 mb-4"
    />

    <a-form
      ref="formRef"
      :model="form"
      hide-required-mark
      :rules="rules"
    >
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
  </a-modal>
</template>

<script setup>
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { message } from 'ant-design-vue'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    }
  })
  const emits = defineEmits(['update:open'])

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

  /** 自定义校验规则 */
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
    titleRule: [{ validator: validateRuleChange }],
    titleRepeat: [{ validator: validateRepeatChange }],
    mainImageRule: [{ validator: validateRuleChange }],
    mainImageRepeat: [{ validator: validateRepeatChange }],
    subImageRule: [{ validator: validateRuleChange }],
    subImageRepeat: [{ validator: validateRepeatChange }],
    shops: [{ required: true }],
    interval: [{ validator: validateInterval }]
  }

  /** 店铺列表 */
  let shopList = ref([])

  getShopList()
  function getShopList() {
    accountCache().then(res => {
      shopList.value = res.data || []
      if (shopList.value.length === 0) {
        message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
      }
    })
  }

  const checkAll = ref(true)
  const indeterminate = ref(false)
  // 弹窗打开时, 全选店铺
  watch(
    () => props.open,
    open => {
      if (open) {
        console.log(props.id)
        checkAll.value = true
        indeterminate.value = false
        form.shops = shopList.value.map(item => item.account)
      }
    }
  )

  function onCheckAllChange(e) {
    form.shops = e.target.checked ? shopList.value.map(item => item.account) : []
    indeterminate.value = false
  }

  function checkboxChange(checkedList) {
    const checkedListLength = checkedList.length
    indeterminate.value = checkedListLength > 0 && checkedListLength < shopList.value.length
    checkAll.value = checkedListLength === shopList.value.length
  }

  /** 弹窗事件 */
  function cancel() {
    formRef.value.resetFields()
    form.productIntervalMin = 5
    form.productIntervalMax = 10
    form.shopIntervalMin = 5
    form.shopIntervalMax = 10

    emits('update:open', false)
  }

  const loading = ref(false)
  function ok() {
    formRef.value.validate().then(() => {
      const params = { id: props.id, ...form }
      if (params.mainImageRule !== '2') {
        delete params.mainImageRepeat
      }
      if (params.subImageRule !== '2') {
        delete params.subImageRepeat
      }
      console.log(params)
      return

      // message.success('提交刊登成功')
    })
  }
</script>
