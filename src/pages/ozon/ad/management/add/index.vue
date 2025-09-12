<!-- 创建广告 -->
<template>
  <div class="w-300 mx-auto text-left">
    <a-card
      title="基本信息"
      class="mb-4"
    >
      <a-form
        :model="form"
        :label-col="{ style: { width: '120px' } }"
        :wrapper-col="{ span: 10 }"
        ref="formRef"
      >
        <a-form-item
          label="店铺账号"
          name="sellerId"
          required
        >
          <a-select
            v-model:value="form.sellerId"
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'account' }"
            option-filter-prop="simpleName"
            placeholder="请选择"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="活动名称"
          name="name"
          required
        >
          <a-input
            v-model:value="form.title"
            placeholder="请输入"
          />
        </a-form-item>
        <a-form-item
          label="广告类型"
          name="type"
        >
          <a-radio-group v-model:value="form.type">
            <a-radio
              v-for="item in TYPE_RADIO_OPTIONS"
              :key="item.value"
              :value="item.value"
            >
              <span class="mr-1">{{ item.label }}</span>
              <a-tooltip :title="item.tooltip"><QuestionCircleOutlined /></a-tooltip>
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="广告策略"
          name="strategy"
        >
          <a-radio-group
            v-model:value="form.strategy"
            :options="STRATEGY_RADIO_OPTIONS"
          />
        </a-form-item>
        <a-form-item
          label="活动开始日期"
          name="startTime"
          required
        >
          <a-date-picker v-model:value="form.startTime" />
          <span class="text-gray ml-2">(莫斯科时间)</span>
        </a-form-item>
        <a-form-item
          label="活动结束日期"
          name="endTime"
        >
          <a-date-picker v-model:value="form.endTime" />
          <span class="text-gray ml-2">(莫斯科时间)</span>
        </a-form-item>
        <a-form-item
          label="每周预算"
          name="weeklyBudget"
          required
        >
          <a-input-number
            v-model:value="form.weeklyBudget"
            :controls="false"
            :precision="1"
            :min="0"
            :max="99999"
            class="w-35"
          />
          <span class="text-gray ml-2">RUB</span>
        </a-form-item>
        <a-form-item
          label="自动增加预算"
          name="addPercent"
        >
          <a-input-number
            v-model:value="form.addPercent"
            :controls="false"
            :precision="1"
            :min="10"
            :max="50"
            class="w-35"
          />
          <span class="text-gray ml-2">% (10 ~ 50)</span>
        </a-form-item>
        <a-form-item
          label=" "
          :colon="false"
        >
          <span>自动增加后的预算: {{ maxBudget }}</span>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="活动预算和周期">
      <div class="flex justify-between mb-3">
        <a-space>
          <span class="inline-block w-30 text-right">广告产品: </span>
          <a-button
            v-if="form.strategy === 2"
            type="primary"
            :disabled="selectedRowKeys.length === 0"
            >批量设置竞价</a-button
          >
          <a-button
            type="primary"
            danger
            :disabled="selectedRowKeys.length === 0"
            >批量移除</a-button
          >
        </a-space>
        <a-space>
          <span>选择产品: {{ selectedRowKeys.length }}/500</span>
          <a-button type="primary">选择产品</a-button>
        </a-space>
      </div>

      <a-table
        :columns="columns"
        row-key="id"
        :data-source="tableData"
        :pagination="false"
        :loading="loading"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ y: '500px' }"
        class="ml-30"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :width="40"
              :height="40"
              :src="record.image"
              class="rounded-md object-contain"
            />
          </template>
          <template v-else-if="column.key === 'title'">
            <div>
              <span
                :title="record.title"
                class="inline-block w-60 align-middle truncate"
                >{{ record.title }}</span
              ><a-button
                type="link"
                @click="copy(record.title)"
                ><CopyOutlined
              /></a-button>
            </div>
            <div>
              <a-button
                type="link"
                class="p-0!"
                @click="goOzon(record.id)"
                >{{ record.id }}</a-button
              ><a-button
                type="link"
                @click="copy(record.id)"
                ><CopyOutlined
              /></a-button>
            </div>
          </template>
          <template v-else-if="column.key === 'price'">{{ `${record.currency}  ${record.price}` }}</template>
          <template v-else-if="column.key === 'bidding'">
            <a-input-number
              v-model:value="record.bidding"
              :controls="false"
              :precision="1"
              :min="0"
              :max="99999"
            />
          </template>
          <template v-else-if="column.key === 'options'">
            <a-popconfirm
              title="确定移除吗?"
              @confirm="remove(record.id)"
            >
              <a-button
                type="link"
                title="移除"
                danger
                ><DeleteOutlined
              /></a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-space class="float-right mt-4">
      <a-button @click="close">关闭</a-button>
      <a-button
        type="primary"
        :loading="loading"
        @click="submit"
        >保存</a-button
      >
    </a-space>
  </div>
</template>

<script setup>
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { message } from 'ant-design-vue'
  import { CopyOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
  import { copyText } from '@/utils'

  /** 基本信息 */
  const form = reactive({
    sellerId: undefined,
    name: '',
    type: 1,
    strategy: 1,
    startTime: null,
    endTime: null,
    weeklyBudget: null,
    addPercent: null
  })
  const formRef = ref()
  const accountList = ref([])
  const TYPE_RADIO_OPTIONS = [
    { label: '登上顶端', value: 1, tooltip: '在搜索结果中的前12个位置推广商品。对于登上顶端活动中的所有商品，平台将免费置顶评价' },
    { label: '模板', value: 2, tooltip: '自动挑选商品展示位置：搜索结果页上、类目中、推荐货架上和促销选择页面上' }
  ]
  const STRATEGY_RADIO_OPTIONS = [
    { label: '自动策略', value: 1 },
    { label: '平均每次点击花费', value: 2 }
  ]

  // 增加后的预算
  const maxBudget = computed(() => {
    if (!form.weeklyBudget || !form.addPercent) return '--'

    return (form.weeklyBudget * (1 + form.addPercent / 100)).toFixed(1)
  })

  getAccountList()
  function getAccountList() {
    accountCache().then(res => {
      accountList.value = res.data || []
      if (accountList.value.length === 0) {
        message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
      }
    })
  }

  /** 活动预算和周期 */
  const selectedRowKeys = ref([])
  const selectedRows = ref([])
  const COLUMNS = [
    { title: '图片', key: 'image', width: 60 },
    { title: '产品标题/产品 ID', key: 'title', width: 250 },
    { title: '售价', key: 'price', width: 60 },
    { title: '竞价', key: 'bidding', width: 80 },
    { title: '操作', key: 'options', width: 50 }
  ]
  const columns = computed(() => {
    if (form.strategy === 1) {
      return COLUMNS.filter(item => item.key !== 'bidding')
    } else {
      return COLUMNS
    }
  })
  const tableData = ref([])

  function onSelectChange(keys, rows) {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  }

  // 跳往 Ozon 后台
  function goOzon(id) {
    window.open(`https://ozon.ru/context/detail/id/${id}`)
  }

  function copy(context) {
    copyText(context)
      .then(() => {
        message.success('已复制')
      })
      .catch(err => {
        message.error(err)
      })
  }

  function remove(id) {
    console.log('remove', id)
  }

  /** 功能按钮 */
  function close() {}

  const loading = ref(false)
  function submit() {
    formRef.value
      .validate()
      .then(() => {
        /* loading.value = true
        const params = {
          ...form
        }

        if (id) params.id = id

        const requestApi = id ? watermarkEditApi : watermarkAddApi
        requestApi(params)
          .then(res => {
            message.success('保存成功')
            // 成功后延时关闭当前窗口, 交互友好
            setTimeout(() => {
              close()
            }, 2000)
          })
          .finally(() => {
            loading.value = false
          }) */
      })
      .catch(err => {
        console.log(err)
      })
  }
</script>
