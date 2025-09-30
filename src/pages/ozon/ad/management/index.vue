<!-- 广告管理 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <a-card>
      <a-descriptions :column="1">
        <a-descriptions-item label="选择日期">
          <TiledDateSelect v-model:value="watchedSearchForm.dateRange" />
        </a-descriptions-item>
        <a-descriptions-item label="店铺账号">
          <TiledSelect
            v-model:value="watchedSearchForm.account"
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'account' }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="搜索类型">
          <TiledSelect
            v-model:value="lazySearchForm.searchKey"
            :options="SEARCH_PROP_OPTIONS"
            :append-all="false"
          />
        </a-descriptions-item>
        <a-descriptions-item
          label="搜索内容"
          :content-style="{ 'flex-direction': 'column' }"
        >
          <a-space align="start">
            <SearchContentInput
              v-model:value="lazySearchForm.searchValue"
              :hide-control="['title'].includes(lazySearchForm.searchKey)"
              :placeholder="PLACEHOLDER_ENUM[lazySearchForm.searchKey]"
              @enter="search"
            />
            <a-button
              type="primary"
              :loading="loading"
              @click="search"
              >搜索</a-button
            >
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="付款类型">
          <TiledSelect
            v-model:value="watchedSearchForm.payType"
            :options="PAY_TYPE_OPTIONS"
          />
        </a-descriptions-item>
        <a-descriptions-item label="启用状态">
          <TiledSelect
            v-model:value="watchedSearchForm.state"
            :options="ENABLE_STATE_OPTIONS"
          />
        </a-descriptions-item>
        <a-descriptions-item label="活动状态">
          <TiledSelect
            v-model:value="watchedSearchForm.activityState"
            :options="ACTIVE_STATE_OPTIONS"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <!-- 按钮区 -->
    <div class="my-4 flex justify-between">
      <a-dropdown :disabled="selectedRows.length === 0">
        <template #overlay>
          <a-menu @click="handleMenuClick">
            <a-menu-item key="1">批量修改预算</a-menu-item>
            <a-menu-item key="2">批量开启</a-menu-item>
            <a-menu-item key="3">批量关闭</a-menu-item>
          </a-menu>
        </template>
        <a-button
          type="primary"
          title="勾选广告后批量操作"
          >批量操作 <DownOutlined
        /></a-button>
      </a-dropdown>

      <a-space>
        <a-button
          type="primary"
          @click="add"
          >创建广告</a-button
        >
        <a-button
          :loading="syncLoading"
          @click="sync"
          >同步广告</a-button
        >
      </a-space>
    </div>

    <!-- TABLE 区 -->
    <a-card>
      <div class="flex justify-between items-center">
        <a-tabs
          v-model:activeKey="watchedSearchForm.tab"
          :animated="false"
          class="flex-1"
        >
          <a-tab-pane
            v-for="item in LIST_TABS"
            :key="item.value"
            :tab="`${item.label}(${listTabsCountEnum[item.value] || 0})`"
          ></a-tab-pane>
        </a-tabs>
        <a-pagination
          v-model:current="tableParams.pageNum"
          v-model:pageSize="tableParams.pageSize"
          :total="total"
          :default-page-size="50"
          show-size-changer
          show-quick-jumper
          :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
          class="flex-none"
          @change="getList"
        />
      </div>

      <a-table
        :columns="DEFAULT_TABLE_COLUMN"
        :data-source="tableData"
        :loading="loading"
        stripe
        ref="tableRef"
        row-key="id"
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 'max-content' }"
      >
        <template #headerCell="{ column }">
          <template v-if="column.title === '订单量'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="参与广告产生的订单数量"><QuestionCircleOutlined /></a-tooltip>
          </template>
          <template v-else-if="column.title === '订单金额'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="参与广告产生的订单金额"><QuestionCircleOutlined /></a-tooltip>
          </template>
          <template v-else-if="column.title === '广告费用'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="广告产生的花费"><QuestionCircleOutlined /></a-tooltip>
          </template>
          <template v-else-if="column.title === '广告费用占比'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="广告费用占比=广告费用/订单金额"><QuestionCircleOutlined /></a-tooltip>
          </template>
          <template v-else-if="column.title === '添加购物车次数'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="产品加入广告后添加到购物车的次数"><QuestionCircleOutlined /></a-tooltip>
          </template>
          <template v-else-if="column.title === '点击率'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="点击率=点击量/展示次数"><QuestionCircleOutlined /></a-tooltip>
          </template>
          <template v-else-if="column.title === '平均点击价格'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="平均点击价格=广告费用/点击量"><QuestionCircleOutlined /></a-tooltip>
          </template>
          <template v-else-if="column.title === 'CPM'">
            <span class="mr-1">{{ column.title }}</span>
            <a-tooltip title="每千次展示的广告费用"><QuestionCircleOutlined /></a-tooltip>
          </template>
        </template>

        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '活动名称'">
            <div>
              <span :title="record.title">{{ record.title }}</span>
              <a-button
                type="link"
                @click="copy(record.title)"
                ><CopyOutlined
              /></a-button>
            </div>
            <div>
              <span>{{ record.id }}</span>
              <a-button
                type="link"
                @click="copy(record.id)"
                ><CopyOutlined
              /></a-button>
            </div>
            <div class="text-gray">「{{ record.simpleName }}」</div>
          </template>
          <template v-else-if="column.title === '广告类型'">
            <span>{{ PLACEMENT_ENUM[record.placement] }}</span>
          </template>
          <template v-else-if="column.title === '广告产品'">
            <a-button
              type="link"
              @click="goAdProduct(record.actionId)"
              >{{ record.productCount }}</a-button
            >
          </template>
          <template v-else-if="column.title === '付费类型'">
            <span>{{ CHARGE_TYPE_ENUM[record.advObjectType] }}</span>
          </template>
          <template v-else-if="column.title === '广告策略'">
            <span>{{ STRATEGY_ENUM[record.productAutopilotStrategy] }}</span>
          </template>
          <template v-else-if="column.title === '每日预算'">
            <span class="mr-1">{{ record.currency || 'RUB' }}</span>
            <span>{{ record.dailyBudget || '--' }}</span>
          </template>
          <template v-else-if="column.title === '每周预算'">
            <span class="mr-1">{{ record.currency || 'RUB' }}</span>
            <span>{{ record.weeklyBudget || '--' }}</span>
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
          <template v-else-if="column.title === '添加购物车次数'">
            <span>{{ record.shoppingCartcQuantity ?? '--' }}</span>
          </template>
          <template v-else-if="column.title === '点击率'">
            <span>{{ record.clickRate ?? '--' }} %</span>
          </template>
          <template v-else-if="column.title === '平均点击价格'">
            <span class="mr-1">{{ record.currency || 'RUB' }}</span>
            <span>{{ record.averageClickPrice || '--' }}</span>
          </template>
          <template v-else-if="column.title === '平均利率'">
            <span>{{ record.averageInterestRate ?? '--' }} %</span>
          </template>
          <template v-else-if="column.title === 'CPM'">
            <span class="mr-1">{{ record.currency || 'RUB' }}</span>
            <span>{{ record.cpm || '--' }}</span>
          </template>
          <template v-else-if="column.title === '活动状态'">
            <span>{{ record.activityState || '--' }}</span>
          </template>
          <template v-else-if="column.title === '启用状态'">
            <a-switch
              :checked="record.state"
              :disabled="record.activityState === 'CAMPAIGN_STATE_ARCHIVED'"
              checked-value="CAMPAIGN_STATE_RUNNING"
              un-checked-value="CAMPAIGN_STATE_INACTIVE"
              @change="toggleState(record)"
            />
          </template>
          <template v-else-if="column.title === '操作'">
            <a-button
              type="link"
              @click="goDetail('view', record)"
              >查看</a-button
            >
            <br />
            <a-dropdown>
              <template #overlay>
                <a-menu @click="({ key }) => handleMore(key, record)">
                  <a-menu-item key="1">同步</a-menu-item>
                  <a-menu-item key="2">复制</a-menu-item>
                </a-menu>
              </template>
              <a-button type="link">更多 <DownOutlined /></a-button>
            </a-dropdown>
          </template>
        </template>
      </a-table>

      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        class="text-right mt-3"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
    </a-card>
  </div>
</template>

<script setup>
  import {
    DEFAULT_TABLE_COLUMN,
    PLACEMENT_ENUM,
    STRATEGY_ENUM,
    CHARGE_TYPE_ENUM,
    SEARCH_PROP_OPTIONS,
    PLACEHOLDER_ENUM,
    PAY_TYPE_OPTIONS,
    ENABLE_STATE_OPTIONS,
    ACTIVE_STATE_OPTIONS,
    LIST_TABS,
    listTabsCountEnum
  } from './config'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { adSyncApi, adSyncSingleApi, adListApi, toggleActivateApi } from '../api'
  import { message } from 'ant-design-vue'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'
  import TiledDateSelect from '../commComponents/TiledDateSelect.vue'
  import { CopyOutlined, DownOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

  const router = useRouter()
  const accountList = ref([])
  // 被 watch 监听的搜索表单; 外层, 点击即可搜索
  const watchedSearchForm = reactive({
    dateRange: [dayjs().subtract(7, 'day'), dayjs()],
    account: undefined,
    payType: undefined,
    state: undefined,
    activityState: undefined,
    tab: 'ALL'
  })
  // 点击'搜索'按钮再执行搜索动作
  const lazySearchForm = reactive({
    searchKey: 'title', // 搜索类型
    searchValue: undefined // 搜索内容
  })
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const total = ref(0)
  const tableData = ref([])
  const loading = ref(false)
  const selectedRowKeys = ref([])
  const selectedRows = ref([])

  watch(
    () => watchedSearchForm,
    () => {
      search()
    },
    { deep: true }
  )

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
      ...watchedSearchForm,
      ...lazySearchForm,
      [lazySearchForm.searchKey]: lazySearchForm.searchValue,
      ...tableParams
      // startTime: watchedSearchForm.dateRange ? dayjs(watchedSearchForm.dateRange[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      // endTime: watchedSearchForm.dateRange ? dayjs(watchedSearchForm.dateRange[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
    }
    delete params.searchKey
    delete params.searchValue
    delete params.dateRange

    adListApi(params)
      .then(res => {
        total.value = res.total ?? 0
        tableData.value = res.rows[0].list || []

        const aggregationState = res.rows[0].aggregationState || []
        for (const key in listTabsCountEnum) {
          const target = aggregationState.find(item => item.state === key)
          target && (listTabsCountEnum[key] = target.count ?? 0)
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  function search() {
    tableParams.pageNum = 1
    getList()
  }

  /** 批量操作 */
  function handleMenuClick({ key }) {
    switch (key) {
      case '1':
        // 批量修改预算
        console.log('批量修改预算')
        break
      case '2':
        // 批量开启
        toggleStateBatch(true)
        break
      case '3':
        // 批量关闭
        toggleStateBatch(false)
        break

      default:
        break
    }
  }

  // 创建
  function add() {
    window.open('/platform/ozon/ad/management/add')
  }

  // 同步
  const syncLoading = ref(false)
  function sync() {
    syncLoading.value = true
    adSyncApi({ account: watchedSearchForm.account || '' })
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
  // 跳转详情 [查看-view, 复制-copy]
  function goDetail(type, record) {
    const query = {
      type,
      id: record.id,
      account: record.account
    }

    const queryStr = Object.entries(query)
      .map(arr => arr.join('='))
      .join('&')
    window.open(`/platform/ozon/ad/management/add?${queryStr}`)
  }

  // 更多操作
  function handleMore(key, record) {
    switch (key) {
      case '1':
        // 同步单个
        const params = {
          account: record.account,
          id: record.id
        }
        adSyncSingleApi(params).then(() => {
          message.success('同步成功')
          getList()
        })
        break
      case '2':
        // 复制
        goDetail('copy', record)
        break

      default:
        break
    }
  }
</script>
