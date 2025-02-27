<!-- 订单管理 -->
<template>
  <div class="order text-left">
    <!-- 搜索区 -->
    <a-card>
      <a-descriptions :column="1">
        <a-descriptions-item label="店铺账号">
          <TiledSelect
            v-model:value="watchedSearchForm.sellerId"
            :options="accountList"
            :field-names="{ label: 'simpleName', value: 'sellerId' }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="搜索类型">
          <TiledSelect
            v-model:value="lazySearchForm.searchKey"
            :options="searchPropOptions"
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
              :hide-control="['productName'].includes(lazySearchForm.searchKey)"
              :placeholder="placeholderEnum[lazySearchForm.searchKey]"
              @enter="search"
            />
            <a-button
              type="primary"
              :loading="loading"
              @click="search"
              >搜索</a-button
            >
            <a-button
              type="link"
              @click="toggleFold"
              >高级搜索</a-button
            >
          </a-space>
          <a-form
            v-show="!isFold"
            ref="extendSearchFormRef"
            :model="lazySearchForm"
            :label-col="{ style: { width: '100px' } }"
            class="mt-4 p-3 bg-[--pro-ant-color-primary-bg]"
          >
            <a-form-item
              name="orderStatus"
              label="订单状态"
            >
              <a-select
                v-model:value="lazySearchForm.orderStatus"
                placeholder="请选择"
                allow-clear
                show-search
                option-filter-prop="label"
                :options="STATUS_OPTIONS"
              />
            </a-form-item>
            <a-form-item
              name="queryHistoryOrder"
              label="订单类型"
            >
              <a-radio-group
                v-model:value="lazySearchForm.queryHistoryOrder"
                @change="() => (lazySearchForm.createTime = null)"
              >
                <a-radio :value="false">120天内订单</a-radio>
                <a-radio :value="true">历史订单</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              name="createTime"
              label="创建时间"
            >
              <a-range-picker
                v-model:value="lazySearchForm.createTime"
                :disabled-date="disabledDate"
                allow-clear
              >
              </a-range-picker>
            </a-form-item>

            <a-form-item class="text-right mb-0">
              <a-space>
                <a-button
                  type="link"
                  @click="foldExtendSearch"
                  >取消</a-button
                >
                <a-button
                  type="link"
                  @click="resetExtendSearchForm"
                  >重置</a-button
                >
                <a-button
                  type="primary"
                  :loading="loading"
                  @click="search"
                  >搜索</a-button
                >
              </a-space>
            </a-form-item>
          </a-form>
        </a-descriptions-item>
        <a-descriptions-item label="排序类型">
          <TiledSelectSort
            v-model:value="watchedSearchForm.prop"
            v-model:sortType="watchedSearchForm.order"
            :options="sortTypeOptions"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-space
      v-has-permi="['system:platform:aliexpress:accredit']"
      class="my-4"
    >
      <a-button
        type="primary"
        title="请先选择创建时间"
        :disabled="!lazySearchForm.createTime"
        :loading="syncLoading"
        @click="sync"
        >{{ lazySearchForm.queryHistoryOrder ? '同步历史数据' : '同步数据' }}</a-button
      >
      <a-dropdown :disabled="!lazySearchForm.createTime">
        <a-button
          type="primary"
          title="请先选择创建时间"
          >导出</a-button
        >
        <template #overlay>
          <a-menu @click="exportFile">
            <a-menu-item key="0">导出excel</a-menu-item>
            <a-menu-item key="1">导出cvs</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-space>

    <!-- table 区 -->
    <a-card>
      <div>
        <a-pagination
          v-model:current="pageParams.pageNum"
          v-model:pageSize="pageParams.pageSize"
          class="text-right mb-3"
          :total="total"
          :default-page-size="50"
          show-size-changer
          show-quick-jumper
          :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
          @change="getList"
        />
      </div>
      <a-table
        :data-source="tableData"
        :columns="DEFAULT_TABLE_COLUMN"
        :loading="loading"
        stripe
        bordered
        row-key="id"
        :pagination="{ defaultPageSize: 50, hideOnSinglePage: true }"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.title === '订单信息'">
            <div>
              订单号:
              <span
                title="复制ID"
                class="cursor-pointer"
                @click="copyId(record.id)"
                >{{ record.id }} <CopyOutlined
              /></span>
            </div>
            <div v-if="record.isPhone">手机订单</div>
          </template>
          <template v-else-if="column.title === '买家信息'">
            <span>[ {{ record.buyerInfo.country }} ] {{ record.buyerSignerFullname }}</span>
          </template>
          <template v-else-if="column.title === '商品信息'">
            <div
              class="flex text-left"
              v-for="(item, i) in record.childOrderList"
              :key="i"
            >
              <a-popover placement="right">
                <template #content>
                  <img
                    :src="item.snapshotSmallPhotoPath || EmptyImg"
                    style="height: 400px; width: 400px"
                  />
                </template>
                <span>
                  <a-image
                    style="width: 56px; height: 56px; border: 1px solid #ccc"
                    :src="item.snapshotSmallPhotoPath || EmptyImg"
                    :fallback="EmptyImg"
                  />
                </span>
              </a-popover>
              <div style="margin-left: 10px; width: 90%">
                <a-tooltip :title="item.productName">
                  <div
                    class="truncate cursor-pointer"
                    @click="goAliExpress(item.productId)"
                  >
                    {{ item.productName }}
                  </div>
                </a-tooltip>
                <div style="color: #999">
                  商品ID:
                  <span
                    title="复制ID"
                    class="cursor-pointer"
                    @click="copyId(item.productId)"
                    >{{ item.productId }} <CopyOutlined
                  /></span>
                </div>
                <div>数量: {{ item.productCount }}</div>
              </div>
            </div>
          </template>
          <template v-else-if="column.title === '金额'">
            <span>[ {{ record.newSellerOrderAmount.currencyCode }} ] {{ record.newSellerOrderAmount.amount }}</span>
          </template>
          <template v-else-if="column.title === '订单状态'">
            <div>{{ STATUS_OPTIONS.find(item => item.value === record.orderStatus).label }}</div>
            <div
              v-if="record.leftSendGoodDay || record.leftSendGoodHour || record.leftSendGoodMin"
              style="color: #ff5e00"
            >
              {{ `${record.leftSendGoodDay || '--'} 天 ${record.leftSendGoodHour || '--'}:${record.leftSendGoodMin || '--'}` }}
            </div>
          </template>
          <template v-else-if="column.title === '时间'">
            <div>
              下单时间：<span>{{ record.gmtCreate }}</span>
            </div>
            <div>
              付款时间：<span>{{ record.gmtPaySuccess || '--' }}</span>
            </div>
          </template>
        </template>
      </a-table>
      <a-pagination
        v-model:current="pageParams.pageNum"
        v-model:pageSize="pageParams.pageSize"
        class="text-right mt-3"
        :total="total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
    </a-card>

    <!-- 同步进度条 -->
    <a-modal
      title="同步进度"
      v-model:open="syncProgressOpen"
      :footer="null"
    >
      <a-progress :percent="syncPercentage" />
    </a-modal>
  </div>
</template>

<script setup>
  import { checkPermi, checkRole } from '~/utils/permission/component/permission'
  import { copyText } from '@/utils'
  import download from '@/api/common/download'
  import { accountCacheApi } from '../apis/common'
  import { orderListApi, orderExportApi, orderSyncApi, orderSyncHistoryApi, syncProgressApi } from '../apis/order'
  import { DEFAULT_TABLE_COLUMN, STATUS_OPTIONS } from './config'
  import dayjs from 'dayjs'
  import { CopyOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  const hasPermi = computed(() => checkPermi(['system:platform:aliexpress:account']) || checkRole('admin'))

  const accountList = ref([])
  getAccountList()
  function getAccountList() {
    accountCacheApi()
      .then(res => {
        accountList.value = res.data.accountDetail || []
        if (accountList.value.length === 0) {
          message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
        }
      })
      .finally(() => {
        getList()
      })
  }

  // 被 watch 监听的搜索表单; 外层, 点击即可搜索
  const watchedSearchForm = ref({
    sellerId: undefined,
    prop: 'create_time',
    order: 'desc'
  })

  watch(
    () => watchedSearchForm.value,
    () => {
      search()
    },
    { deep: true }
  )

  const isFold = ref(true)
  // 高级搜索表单; 需点击'搜索'按钮再执行搜索动作
  const extendSearchFormRef = ref()
  const lazySearchForm = ref({
    searchKey: 'productName',
    searchValue: undefined,
    orderStatus: undefined,
    queryHistoryOrder: false,
    createTime: null
  })
  const searchPropOptions = ref([
    { label: '商品名称', value: 'productName' },
    { label: '订单编号', value: 'orderId' }
  ])
  const placeholderEnum = ref({
    productName: '商品名称',
    orderId: '订单编号, 多个编号间用英文逗号隔开'
  })
  const sortTypeOptions = ref([{ label: '按创建时间', value: 'create_time' }])
  const pageParams = ref({
    pageNum: 1,
    pageSize: 50
  })

  // 创建时间禁选区间
  function disabledDate(cur) {
    if (lazySearchForm.value.queryHistoryOrder) {
      // 历史订单
      return cur > dayjs().subtract(120, 'day')
    } else {
      // 120 天内
      return cur < dayjs().subtract(120, 'day') || cur > dayjs()
    }
  }

  function toggleFold() {
    if (isFold.value) {
      isFold.value = false
    } else {
      foldExtendSearch()
    }
  }
  // 高级搜索重置
  function resetExtendSearchForm() {
    extendSearchFormRef.value.resetFields()
    lazySearchForm.value.createTime = null
  }
  // 收起高级搜索
  function foldExtendSearch() {
    resetExtendSearchForm()
    isFold.value = true
  }

  function search() {
    pageParams.value.pageNum = 1
    getList()
  }
  function reset() {
    pageParams.value.pageNum = 1
    searchFormRef.value.resetFields()
    getList()
  }

  // 列表数据
  const tableData = ref([])
  const total = ref(0)
  const loading = ref(false)
  getList()
  function getList() {
    loading.value = true
    const params = {
      ...watchedSearchForm.value,
      ...lazySearchForm.value,
      [lazySearchForm.value.searchKey]: lazySearchForm.value.searchValue,
      ...pageParams.value,
      createDateStart: lazySearchForm.value.createTime ? dayjs(lazySearchForm.value.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      createDateEnd: lazySearchForm.value.createTime ? dayjs(lazySearchForm.value.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
    }
    delete params.createTime
    delete params.searchKey
    delete params.searchValue

    orderListApi(params)
      .then(res => {
        tableData.value = res.rows || []
        total.value = res.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  function goAliExpress(productId) {
    window.open(`https://vi.aliexpress.com/item/${productId}.html`)
  }

  /** 同步 */
  const syncLoading = ref(false)
  const syncProgressOpen = ref(false)
  const syncPercentage = ref(0)

  function sync() {
    syncProgressOpen.value = true
    const params = {
      sellerId: watchedSearchForm.value.sellerId,
      createDateStart: dayjs(lazySearchForm.value.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      createDateEnd: dayjs(lazySearchForm.value.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    }
    const requestApi = lazySearchForm.value.queryHistoryOrder ? orderSyncHistoryApi : orderSyncApi
    requestApi(params)
      .then(res => {
        getSyncProgress(res.data)
      })
      .catch(e => {
        syncProgressOpen.value = false
      })
  }
  function getSyncProgress(token) {
    syncProgressApi(token)
      .then(res => {
        if (res.data) {
          const resList = res.data.split(':')
          if (resList[0] === 'undone') {
            syncPercentage.value = Number(((resList[2] / resList[1]) * 100).toFixed())
            setTimeout(() => {
              getSyncProgress(token)
            }, 3 * 1000)
          } else {
            syncPercentage.value = 0
            syncProgressOpen.value = false
            search()
          }
        } else {
          setTimeout(() => {
            getSyncProgress(token)
          }, 2 * 1000)
        }
      })
      .catch(e => {
        syncProgressOpen.value = false
      })
  }

  /** 导出 */
  function exportFile({ key }) {
    const params = {
      exportFileType: key,
      sellerId: watchedSearchForm.value.sellerId,
      orderStatus: lazySearchForm.value.orderStatus,
      createDateStart: dayjs(lazySearchForm.value.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      createDateEnd: dayjs(lazySearchForm.value.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    }
    orderExportApi(params).then(res => {
      message.success('下载任务已开始！请耐心等待完成')
      download.name(res.msg)
    })
  }

  /** 复制产品ID到剪贴板 */
  function copyId(id) {
    copyText(id)
      .then(() => {
        message.success('已复制')
      })
      .catch(err => {
        message.error(err)
      })
  }
</script>
