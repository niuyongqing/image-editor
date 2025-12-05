<!-- 广告产品管理 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <AppTableForm
      v-model:formData="searchForm"
      reset-set-menu="adProductManagement"
      @on-submit="search"
    >
      <template #formItemRow>
        <a-form-item
          label="店铺账号"
          name="account"
        >
          <AppCardSelect
            v-model:account="searchForm.account"
            :options="accountList"
            :field-obj="{ label: 'simpleName', value: 'account' }"
            @selectItem="search"
          />
        </a-form-item>
        <a-form-item
          label="选择日期"
          name="dateRange"
        >
          <a-range-picker
            v-model:value="searchForm.dateRange"
            :presets="presets"
            :disabled-date="cur => cur && cur > Date.now()"
          />
        </a-form-item>
        <a-form-item
          label="启用状态"
          name="state"
        >
          <a-radio-group
            v-model:value="searchForm.state"
            :options="ENABLE_STATE_OPTIONS"
            name="state"
            @change="search"
          />
        </a-form-item>
        <a-form-item
          label="模糊查询"
          name="mult"
        >
          <a-form-item-rest>
            <a-space>
              <a-input
                v-model:value="searchForm.title"
                placeholder="活动名称"
                allow-clear
              />
              <a-input
                v-model:value="searchForm.id"
                placeholder="活动 ID, 多个 ID 间用英文逗号隔开"
                allow-clear
              />
              <a-input
                v-model:value="searchForm.sku"
                placeholder="sku编码, 多个编码间用英文逗号隔开"
                allow-clear
              />
            </a-space>
          </a-form-item-rest>
        </a-form-item>
      </template>
    </AppTableForm>

    <!-- TABLE 区 -->
    <AppTableBox
      :table-header="DEFAULT_TABLE_COLUMN"
      :data-source="tableData"
      :loading="loading"
      reset-set-menu="adProductManagement"
      stripe
      ref="tableRef"
      row-key="id"
      :scroll="{ x: 'max-content' }"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #leftTool>
        <a-space>
          <a-button
            type="primary"
            :disabled="selectedRows.length === 0"
            @click="batchEditBidding"
          >批量调整竞价</a-button>
          <a-button
            type="primary"
            @click="addOpen = true"
          >添加推广产品</a-button>
          <a-button
            :loading="syncLoading"
            @click="sync"
          >同步推广产品</a-button>
        </a-space>
      </template>

      <template #headerCell="{ column }">
        <template v-if="column.title === '可见性指数'">
          <span class="mr-1">{{ column.title }}</span>
          <a-tooltip
            title="表示过去24小时内商品最常出现的搜索结果或目录页面。 例如，如果您的商品指数为 “1”，则用户更常在搜索结果或目录的第一页看到该商品。 如果指数为10+，说明该商品在搜索结果中排在第10页之后"
          >
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template v-else-if="column.title === '订单量'">
          <span class="mr-1">{{ column.title }}</span>
          <a-tooltip title="参与广告产生的订单数量">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template v-else-if="column.title === '订单金额'">
          <span class="mr-1">{{ column.title }}</span>
          <a-tooltip title="参与广告产生的订单金额">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template v-else-if="column.title === '广告费用'">
          <span class="mr-1">{{ column.title }}</span>
          <a-tooltip title="广告产生的花费">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template v-else-if="column.title === '广告收入率'">
          <span class="mr-1">{{ column.title }}</span>
          <a-tooltip title="广告收入率=订单金额/广告费用">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <template v-else-if="column.title === '点击率'">
          <span class="mr-1">{{ column.title }}</span>
          <a-tooltip title="点击率=点击量/展示次数">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.title === '图片'">
          <a-image
            :src="record.image || EmptyImg"
            :width="80"
            :height="80"
            :fallback="EmptyImg"
            class="object-contain border border-solid border-gray-200"
          />
        </template>

        <template v-else-if="column.title === '标题/产品 ID'">
          <div>
            <span :title="record.title">{{ record.title }}</span><a-button
              type="link"
              @click="copy(record.title)"
            >
              <CopyOutlined />
            </a-button>
          </div>
          <div>
            <a-button
              type="link"
              class="p-0!"
              @click="goOzon(record.id)"
            >{{ record.id
            }}</a-button><a-button
              type="link"
              @click="copy(record.id)"
            >
              <CopyOutlined />
            </a-button>
          </div>
          <div class="text-gray">「{{ record.simpleName }}」</div>
        </template>

        <template v-else-if="column.title === '是否可搜索'">
          <div>{{ record.isSearchable ? '是' : '否' }}</div>
        </template>
        <template v-else-if="column.title === '竞价'">
          <span class="mr-1">{{ record.currency || 'RUB' }}</span>
          <span>{{ record.weeklyBudget || '--' }}</span>
        </template>
        <template v-else-if="column.title === '产品价格'">
          <span class="mr-1">{{ record.currency || 'RUB' }}</span>
          <span>{{ record.productPrice || '--' }}</span>
        </template>
        <template v-else-if="column.title === '可见性指数'">
          <span>{{ record.visibilityIndex || '--' }}</span>
        </template>
        <template v-else-if="column.title === '订单量'">
          <span>{{ record.orderVolume || '--' }}</span>
        </template>
        <template v-else-if="column.title === '订单金额'">
          <span class="mr-1">{{ record.currency || 'RUB' }}</span>
          <span>{{ record.orderAmount || '--' }}</span>
        </template>
        <template v-else-if="column.title === '广告费用'">
          <span class="mr-1">{{ record.currency || 'RUB' }}</span>
          <span>{{ record.advertisingExpenses || '--' }}</span>
        </template>
        <template v-else-if="column.title === '广告费用占比'">
          <span>{{ record.proportionAdvertisingExpenses ?? '--' }}</span>
        </template>
        <template v-else-if="column.title === '展示次数'">
          <span>{{ record.displayCount ?? '--' }}</span>
        </template>
        <template v-else-if="column.title === '点击量'">
          <span>{{ record.hits ?? '--' }}</span>
        </template>
        <template v-else-if="column.title === '点击率'">
          <span>{{ record.clickRate ?? '--' }} %</span>
        </template>
        <template v-else-if="column.title === '上周期竞价'">
          <span>{{ record.previousBidding ?? '--' }}</span>
        </template>
        <template v-else-if="column.title === '竞价更新时间'">
          <span>{{ record.biddingUpdateTime || '--' }}</span>
        </template>
        <template v-else-if="column.title === '最近更新时间'">
          <span>{{ record.recentUpdateTime || '--' }}</span>
        </template>
        <template v-else-if="column.title === 'CPM'">
          <span class="mr-1">{{ record.currency || 'RUB' }}</span>
          <span>{{ record.cpm || '--' }}</span>
        </template>
        <template v-else-if="column.title === '启用状态'">
          <a-switch
            :checked="record.state"
            checked-value="CAMPAIGN_STATE_RUNNING"
            un-checked-value="CAMPAIGN_STATE_INACTIVE"
            @change="toggleState(record)"
          />
        </template>
        <template v-else-if="column.title === '操作'">
          <a-space>
            <a-button
              type="link"
              @click="del(record)"
            >移除</a-button>
          </a-space>
        </template>
      </template>

      <template #pagination>
        <AppTablePagination
          v-model:current="tableParams.pageNum"
          v-model:pageSize="tableParams.pageSize"
          :total="total"
          @change="getList"
        />
      </template>
    </AppTableBox>

    <!-- 添加推广产品弹窗 -->
    <AddModal
      v-model:open="addOpen"
      @emitData="refresh"
    />
  </div>
</template>

<script setup>
  import {
    DEFAULT_TABLE_COLUMN,
    ENABLE_STATE_OPTIONS,
  } from './config.js'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { adSyncApi, adSyncSingleApi, adListApi, toggleActivateApi } from '../api'
  import { message } from 'ant-design-vue'
  import AddModal from '../product/components/AddModal.vue'
  import { CopyOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  const router = useRouter()
  const accountList = ref([])
  const searchForm = reactive({
    dateRange: [dayjs().subtract(7, 'day'), dayjs()],
    account: undefined,
    state: undefined,
    title: undefined,
    sku: undefined,
    id: undefined
  })
  const presets = ref([
    { label: '昨天', value: [dayjs().add(-1, 'd'), dayjs()] },
    { label: '7天内', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '30天内', value: [dayjs().add(-30, 'd'), dayjs()] },
  ])
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const total = ref(0)
  const tableData = ref([])
  const loading = ref(false)
  const selectedRowKeys = ref([])
  const selectedRows = ref([])

  getAccountList()
  function getAccountList() {
    accountCache()
      .then(res => {
        accountList.value = res.data || []
        if (accountList.value.length === 0) {
          message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
        }
      })
      .finally(() => {
        getList()
      })
  }

  function onSelectChange(keys, rows) {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  }

  function getList() {
    loading.value = true
    // 重置选择的数据
    selectedRowKeys.value = []
    selectedRows.value = []

    const params = {
      ...searchForm,
      ...tableParams
      // startTime: searchForm.dateRange ? dayjs(searchForm.dateRange[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      // endTime: searchForm.dateRange ? dayjs(searchForm.dateRange[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
    }
    delete params.dateRange

    adListApi(params)
      .then(res => {
        total.value = res.total ?? 0
        tableData.value = res.rows[0].list || []
      })
      .finally(() => {
        loading.value = false
      })
  }

  function search() {
    tableParams.pageNum = 1
    getList()
  }

  // 批量调整竞价
  function batchEditBidding() {
    const params = {
      account: searchForm.account || '',
      biddingList: selectedRows.value.map(item => ({
        id: item.id,
        bidding: item.bidding
      }))
    }
  }

  // 同步
  const syncLoading = ref(false)
  function sync() {
    syncLoading.value = true
    adSyncApi({ account: searchForm.account || '' })
      .then(() => {
        message.success('同步成功')
        getList()
      })
      .finally(() => {
        syncLoading.value = false
      })
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

  // 点击广告产品数, 跳转到广告产品页
  function goAdProduct(id) {
    router.push(`/platform/ozon/ad/product?actionId=${id}`)
  }

  // 跳往 Ozon 后台
  function goOzon(id) {
    window.open(`https://ozon.ru/context/detail/id/${id}`)
  }

  // 切换启用状态
  function toggleState(record) {
    const isActivate = record.state === 'CAMPAIGN_STATE_INACTIVE'
    const params = {
      isActivate,
      activateList: [
        {
          account: record.account,
          id: record.id
        }
      ]
    }
    toggleActivateApi(params).then(res => {
      message.success('切换成功')
      getList()
    })
  }

  // 批量切换启用状态
  function toggleStateBatch(isActivate) {
    const activateList = selectedRows.value.map(item => ({
      account: item.account,
      id: item.id
    }))
    const params = {
      isActivate,
      activateList
    }
    toggleActivateApi(params).then(res => {
      message.success('切换成功')
      getList()
    })
  }

  /** table 操作 */
  // 推广产品弹窗
  const addOpen = ref(false)

  function refresh() {
    getList()
  }
  // 更多操作
  function del(record) {
    const params = [
      {
        id: record.id,
        productId: record.productId,
        account: record.account
      }
    ]
  }
</script>
