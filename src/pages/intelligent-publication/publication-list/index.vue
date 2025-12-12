<!-- 刊登序列 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <AppTableForm
      v-model:formData="searchForm"
      reset-set-menu="publicationList"
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
          label="刊登模式"
          name="publishType"
        >
          <a-radio-group
            v-model:value="searchForm.publishType"
            :options="PUBLISH_TYPE_OPTIONS"
            name="publishType"
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
                v-model:value="searchForm.productName"
                placeholder="标题"
                allow-clear
              />
              <a-input
                v-model:value="searchForm.skuCode"
                placeholder="产品编码 SKU"
                allow-clear
              />
              <a-input
                v-model:value="searchForm.intelligentWaitProductId"
                placeholder="产品ID"
                allow-clear
              />
            </a-space>
          </a-form-item-rest>
        </a-form-item>
      </template>
    </AppTableForm>

    <!-- TABLE 区 -->
    <AppTableBox
      :loading="state.loading"
      :table-header="COLUMNS"
      :data-source="tableData"
      stripe
      row-key="waitPublishProductId"
      reset-set-menu="publicationList"
      :scroll="{ x: 'max-content' }"
      :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
      @rowDoubleClick="record => goEdit(record)"
    >
      <template #otherCount>
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
        </div>
      </template>

      <template #leftTool>
        <a-space>
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
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          <div>{{ index + 1 + (tableParams.pageNum - 1) * tableParams.pageSize }}</div>
        </template>
        <template v-else-if="column.key === 'mainImage'">
          <a-image
            :src="fixedUrl(record)"
            :width="80"
            :height="80"
            :fallback="EmptyImg"
            class="object-contain border border-solid border-gray-200"
          />
        </template>
        <template v-else-if="column.key === 'title'">
          <div>{{ record.productName || '--' }}</div>
          <div>产品ID: {{ record.waitPublishProductId }}</div>
        </template>
        <template v-else-if="column.key === 'publishType'">
          <div>{{ PUBLISH_TYPE_ENUM[record.publishType] || '--' }}</div>
        </template>
        <template v-else-if="column.key === 'publishStatus'">
          <a-tooltip
            v-if="record.errorMessage"
            :title="record.errorMessage"
            color="#fff"
            :overlay-style="{ maxWidth: '500px' }"
            :overlay-inner-style="{ color: '#ff4d4f' }"
          >
            <a-tag :color="STATUS_TAG_COLOR_ENUM[record.publishStatus]">{{ STATUS_ENUM[record.publishStatus] || '--' }}</a-tag>
          </a-tooltip>
          <a-tag
            v-else
            :color="STATUS_TAG_COLOR_ENUM[record.publishStatus]"
            >{{ STATUS_ENUM[record.publishStatus] || '--' }}</a-tag
          >
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
          <div>{{ record.remark || '--' }}</div>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-space>
            <a-button
              type="link"
              :disabled="![10, 40].includes(record.publishStatus)"
              @click="publish(record)"
              >刊登</a-button
            >
            <a-button
              type="link"
              @click="goEdit(record)"
              >{{ [10, 40].includes(record.publishStatus) ? '编辑' : '查看' }}</a-button
            >
            <a-button
              type="link"
              @click="openRemorkModal(record)"
              >备注</a-button
            >
            <a-button
              type="link"
              @click="goFather(record)"
              >来源</a-button
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

      <template #pagination>
        <AppTablePagination
          v-model:current="tableParams.pageNum"
          v-model:pageSize="tableParams.pageSize"
          :total="state.total"
          @change="getList"
        />
      </template>
    </AppTableBox>

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
  import { listApi, submitToPublishApi, batchSubmitToPublishApi, cancelApi, batchAddRemarkApi } from '../js/publication-list-api'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  /** ======= data ======= */
  const accountList = ref([])
  const searchForm = reactive({
    account: undefined,
    publishType: undefined,
    productName: '',
    skuCode: '',
    intelligentWaitProductId: ''
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
    { label: '全部', value: undefined },
    { label: '手动刊登', value: 2 },
    { label: '自动刊登', value: 1 }
  ]
  const PUBLISH_TYPE_ENUM = { 1: '自动刊登', 2: '手动刊登' }
  const STATUS_ENUM = { 10: '待刊登', 20: '已取消', 25: '刊登中', 30: '已刊登', 40: '刊登失败' }
  const STATUS_TAG_COLOR_ENUM = { 10: 'processing', 20: 'warning', 25: 'processing', 30: 'success', 40: 'error' }
  const TABS = [
    { label: '全部', value: undefined },
    { label: '待刊登', value: 10 },
    // { label: '刊登中', value: 25 },
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
      ...searchForm,
      accountList: searchForm.account ? [searchForm.account] : accountList.value.map(item => item.account),
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

  function fixedUrl(record) {
    let url = record.productSkuList?.[0]?.mainImages
    if (!url) return EmptyImg

    if (url.startsWith('http') || url.startsWith('/prod-api')) return url

    return '/prod-api' + url
  }

  // 刊登
  const loadingId = ref(null)
  function publish(record) {
    loadingId.value = record.waitPublishProductId
    submitToPublishApi(record.waitPublishProductId).then(res => {
      message.success('刊登成功')
      getList()
    }).finally(() => {
      loadingId.value = null
    })
  }

  function batchPublish() {
    return new Promise((resolve, reject) => {
      // 批量; 检查是否有不允许编辑的数据
      const list = tableData.value.filter(item => state.selectedRowKeys.includes(item.waitPublishProductId))
      if (list.some(item => ![10, 40].includes(item.publishStatus))) {
        message.error('只允许刊登『待刊登, 刊登失败』状态的产品')
        reject('YOU SHALL NOT PASS!')

        return
      }

      batchSubmitToPublishApi({ waitPublishProductIdList: state.selectedRowKeys })
        .then(res => {
          message.info(res.data)
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

  // 跳转到来源产品详情
  function goFather(record) {
    window.open(`/platform/intelligent-publication/publication-list-source-detail?intelligentProductId=${record.intelligentProductId}`)
  }

  function cancel(record) {
    return new Promise((resolve, reject) => {
      let waitPublishProductIdList = []
      if (record) {
        waitPublishProductIdList = [record.waitPublishProductId]
      } else {
        // 批量; 检查是否有不允许编辑的数据
        const list = tableData.value.filter(item => state.selectedRowKeys.includes(item.waitPublishProductId))
        if (list.some(item => item.publishStatus !== 10)) {
          message.error('只允许取消『待刊登』状态的产品')
          reject('YOU SHALL NOT PASS!')

          return
        }

        waitPublishProductIdList = state.selectedRowKeys
      }

      cancelApi({ waitPublishProductIdList })
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
    curId = record.waitPublishProductId
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
      waitPublishProductIdList: curId ? [curId] : state.selectedRowKeys,
      remark: remark.value
    }

    remarkLoading.value = true
    batchAddRemarkApi(params)
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
