<!-- 刊登序列 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <a-card>
      <a-descriptions :column="1">
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
              hide-control
              :placeholder="PLACEHOLDER_ENUM[lazySearchForm.searchKey]"
              @enter="search"
            />
            <a-button
              type="primary"
              :loading="state.loading"
              @click="search"
              >搜索</a-button
            >
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="刊登模式">
          <TiledSelect
            v-model:value="watchedSearchForm.publishType"
            :options="PUBLISH_TYPE_OPTIONS"
          />
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <a-space class="my-4">
      <a-button
        type="primary"
        :disabled="state.selectedRowKeys.length === 0"
        @click="batchPublish"
        >批量刊登</a-button
      >
      <a-button
        type="primary"
        :disabled="state.selectedRowKeys.length === 0"
        @click="remarkModalOpen = true"
        >批量备注</a-button
      >
      <a-popconfirm
        title="确定取消刊登?"
        :disabled="state.selectedRowKeys.length === 0"
        @confirm="cancel()"
      >
        <a-button
          type="primary"
          danger
          :disabled="state.selectedRowKeys.length === 0"
          >批量取消</a-button
        >
      </a-popconfirm>
    </a-space>

    <!-- TABLE 区 -->
    <a-card>
      <div class="flex justify-between items-center">
        <a-tabs
          v-model:activeKey="activeTab"
          :animated="false"
          @change="search"
        >
          <a-tab-pane
            v-for="item in TABS"
            :key="item.value"
            :tab="item.label"
          ></a-tab-pane>
        </a-tabs>
        <a-pagination
          v-model:current="tableParams.pageNum"
          v-model:pageSize="tableParams.pageSize"
          :total="state.total"
          :default-page-size="50"
          show-size-changer
          show-quick-jumper
          :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
          @change="getList"
        />
      </div>

      <a-table
        :loading="state.loading"
        :columns="COLUMNS"
        :data-source="tableData"
        stripe
        row-key="waitPublishProductId"
        :pagination="false"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :custom-row="record => ({ onDblclick: () => goEdit(record) })"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <div>{{ index + 1 + (tableParams.pageNum - 1) * tableParams.pageSize }}</div>
          </template>
          <template v-else-if="column.key === 'mainImage'">
            <a-image
              :src="fixedUrl(record.mainImage)"
              :width="80"
              :height="80"
              :fallback="EmptyImg"
              class="object-contain border border-solid border-gray-200"
            />
          </template>
          <template v-else-if="column.key === 'title'">
            <div class="w-80">{{ record.productName || '--' }}</div>
            <div>id: {{ record.waitPublishProductId }}</div>
          </template>
          <template v-else-if="column.key === 'publishType'">
            <div>{{ PUBLISH_TYPE_ENUM[record.publishType] || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'publishStatus'">
            <a-tag :color="STATUS_TAG_COLOR_ENUM[record.publishStatus]">{{ STATUS_ENUM[record.publishStatus] || '--' }}</a-tag>
          </template>
          <template v-else-if="['skuCode', 'price', 'originalPrice', 'stock'].includes(column.key)">
            <div
              v-for="item in record.productSkuList"
              :key="item.id"
            >
              <div class="text-center">{{ item[column.key] ?? '--' }}</div>
              <a-divider
                dashed
                class="my-0"
              />
            </div>
          </template>
          <template v-else-if="column.key === 'time'">
            <div>创建时间: {{ record.createTime || '--' }}</div>
            <div>计划刊登时间: {{ record.planPublishTime || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'remark'">
            <div class="w-80">{{ record.remark || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space>
              <a-button
                type="link"
                :disabled="record.publishStatus !== 10"
                @click="publish(record)"
                >刊登</a-button
              >
              <a-button
                type="link"
                @click="goEdit(record)"
                >{{ record.publishStatus === 10 ? '编辑' : '查看' }}</a-button
              >
              <a-button
                type="link"
                @click="openRemorkModal(record)"
                >备注</a-button
              >
              <a-popconfirm
                title="确定取消刊登?"
                :disabled="record.publishStatus !== 10"
                @confirm="cancel(record)"
              >
                <a-button
                  type="link"
                  danger
                  :disabled="record.publishStatus !== 10"
                  >取消</a-button
                >
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        class="text-right mt-3"
        :total="state.total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        @change="getList"
      />
    </a-card>

    <!-- 备注弹窗 -->
    <a-modal
      title="添加备注"
      v-model:open="remarkModalOpen"
      width="30%"
      :confirm-loading="remarkLoading"
      @cancel="remarkCancel"
      @ok="remarkOk"
    >
      <a-textarea
        v-model:value="remark"
        :rows="4"
        :maxlength="255"
        show-count
        placeholder="请输入备注内容"
        class="mb-7"
      />
    </a-modal>
  </div>
</template>

<script setup>
  import dayjs from 'dayjs'
  import { COLUMNS } from '../js/publication-list-config'
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { listApi, submitToPublishApi, batchSubmitToPublishApi, cancelApi } from '../js/publication-list-api'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  /** ======= data ======= */
  const accountList = ref([])
  const watchedSearchForm = reactive({
    account: undefined,
    publishType: undefined
  })
  const lazySearchForm = reactive({
    searchKey: 'productName',
    searchValue: undefined
  })
  const SEARCH_PROP_OPTIONS = [
    { label: '标题', value: 'productName' },
    { label: 'SKU编码', value: 'skuCode' },
    { label: '产品ID', value: 'intelligentWaitProductId' }
  ]
  const PLACEHOLDER_ENUM = {
    productName: '标题',
    skuCode: '产品编码 SKU',
    intelligentWaitProductId: '产品ID'
  }
  // 刊登模式选项
  const PUBLISH_TYPE_OPTIONS = [
    { label: '手动刊登', value: 2 },
    { label: '自动刊登', value: 1 }
  ]
  const PUBLISH_TYPE_ENUM = { 1: '自动刊登', 2: '手动刊登' }
  const STATUS_ENUM = { 10: '待刊登', 20: '已取消', 25: '刊登中', 30: '已刊登', 40: '刊登失败' }
  const STATUS_TAG_COLOR_ENUM = { 10: 'processing', 20: 'warning', 25: 'processing', 30: 'success', 40: 'error' }
  const TABS = [
    { label: '全部', value: undefined },
    { label: '待刊登', value: 10 },
    { label: '刊登中', value: 25 },
    { label: '已取消', value: 20 }
  ]
  const activeTab = ref(undefined)

  /** table */
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const state = reactive({
    loading: false,
    total: 0,
    selectedRowKeys: []
  })
  const tableData = ref([])

  /** 备注 */
  let curId = ''
  const remark = ref('')
  const remarkModalOpen = ref(false)
  const remarkLoading = ref(false)

  /** ======= watch ======= */
  watch(
    () => watchedSearchForm,
    _ => {
      search()
    },
    { deep: true }
  )

  /** ======= liftcycle hooks ======= */
  getAccountList()

  /** 监听编辑页保存后的跨窗口通信 */
  window.addEventListener('message', receiveMessage)

  onBeforeUnmount(() => {
    window.removeEventListener('message', receiveMessage)
  })

  /** ======= methods ======= */
  function onSelectChange(selectedRowKeys) {
    state.selectedRowKeys = selectedRowKeys
  }

  function getAccountList() {
    accountCache()
      .then(res => {
        accountList.value = res.data || []
        if (accountList.value.length === 0) {
          message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
        } else {
          getList()
        }
      })
      .finally(() => {})
  }

  function getList() {
    state.selectedRowKeys = []
    const params = {
      ...tableParams,
      ...watchedSearchForm,
      accountList: watchedSearchForm.account ? [watchedSearchForm.account] : accountList.value.map(item => item.account),
      [lazySearchForm.searchKey]: lazySearchForm.searchValue,
      publishStatus: activeTab.value
    }
    delete params.account

    state.loading = true
    listApi(params)
      .then(res => {
        state.total = res.total ?? 0
        tableData.value = res.data || []
      })
      .finally(() => {
        state.loading = false
      })
  }

  function search() {
    tableParams.pageNum = 1
    getList()
  }

  function fixedUrl(url) {
    if (!url) return EmptyImg

    if (url.startsWith('http') || url.startsWith('/prod-api')) return url

    return '/prod-api' + url
  }

  // 刊登
  function publish(record) {
    submitToPublishApi(record.waitPublishProductId).then(res => {
      message.success('刊登成功')
      getList()
    })
  }

  function batchPublish() {
    return new Promise((resolve, reject) => {
      // 批量; 检查是否有不允许编辑的数据
      const list = tableData.value.filter(item => state.selectedRowKeys.includes(item.waitPublishProductId))
      if (list.some(item => item.publishStatus !== 10)) {
        message.error('只允许刊登『待刊登』状态的产品')
        reject('YOU SHALL NOT PASS!')

        return
      }

      batchSubmitToPublishApi({ waitPublishProductList: state.selectedRowKeys })
        .then(res => {
          message.success('刊登成功')
          getList()
        })
        .finally(() => {
          resolve()
        })
    })
  }

  function goEdit(record) {
    window.open(`/platform/intelligent-publication/publication-list-detail?waitPublishProductId=${record.waitPublishProductId}`)
  }

  function cancel(record) {
    return new Promise((resolve, reject) => {
      let waitPublishProductIds = []
      if (record) {
        waitPublishProductIds = [record.waitPublishProductId]
      } else {
        // 批量; 检查是否有不允许编辑的数据
        const list = tableData.value.filter(item => state.selectedRowKeys.includes(item.waitPublishProductId))
        if (list.some(item => item.publishStatus !== 10)) {
          message.error('只允许取消『待刊登』状态的产品')
          reject('YOU SHALL NOT PASS!')

          return
        }

        waitPublishProductIds = state.selectedRowKeys
      }

      cancelApi({ waitPublishProductIds })
        .then(res => {
          message.success('取消成功')
          getList()
        })
        .finally(() => {
          resolve()
        })
    })
  }

  // 打开弹窗
  function openRemorkModal(record) {
    curId = record.id
    remark.value = record.remark
    remarkModalOpen.value = true
  }

  function remarkCancel() {
    remarkModalOpen.value = false
    curId = ''
    remark.value = ''
  }

  function remarkOk() {
    const params = {
      id: curId,
      remark: remark.value
    }

    remarkLoading.value = true
    addRemarkApi(params)
      .then(res => {
        message.success('添加备注成功')
        getList()
        remarkCancel()
      })
      .finally(() => {
        remarkLoading.value = false
      })
  }

  function receiveMessage(event) {
    if (event.origin === window.location.origin && event.data === 'refresh') {
      getList()
    }
  }
</script>
