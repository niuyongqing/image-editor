<!-- 广告产品 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <AppTableForm
      v-model:formData="searchForm"
      reset-set-menu="adProduct"
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
                v-model:value="searchForm.activeId"
                placeholder="活动 ID, 多个 ID 间用英文逗号隔开"
                allow-clear
              />
              <a-input
                v-model:value="searchForm.productId"
                placeholder="产品 ID, 多个 ID 间用英文逗号隔开"
                allow-clear
              />
              <a-input
                v-model:value="searchForm.name"
                placeholder="产品名称"
                allow-clear
              />
              <a-input
                v-model:value="searchForm.sku"
                placeholder="SKU"
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
      reset-set-menu="adProduct"
      stripe
      ref="tableRef"
      row-key="id"
      :scroll="{ x: 'max-content' }"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <template #otherCount>
        <a-tabs
          v-model:activeKey="searchForm.tab"
          :animated="false"
          class="flex-1"
          @change="search"
        >
          <a-tab-pane
            v-for="item in LIST_TABS"
            :key="item.value"
            :tab="`${item.label}(${listTabsCountEnum[item.value] || 0})`"
          ></a-tab-pane>
        </a-tabs>
      </template>

      <template #leftTool>
        <a-space>
          <a-dropdown :disabled="selectedRows.length === 0">
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="1">批量修改竞价</a-menu-item>
                <a-menu-item key="2">批量移除</a-menu-item>
              </a-menu>
            </template>
            <a-button
              type="primary"
              title="勾选产品后批量操作"
            >批量操作
              <DownOutlined />
            </a-button>
          </a-dropdown>

          <a-button
            type="primary"
            @click="open = true"
          >添加广告产品</a-button>
          <a-button @click="sync">同步广告产品</a-button>
        </a-space>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'image'">
          <a-image
            :src="record.image || EmptyImg"
            :width="80"
            :height="80"
            :fallback="EmptyImg"
            class="object-contain border border-solid border-gray-200"
          />
        </template>

        <template v-else-if="column.key === 'title'">
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
            >{{ record.id }}</a-button><a-button
              type="link"
              @click="copy(record.id)"
            >
              <CopyOutlined />
            </a-button>
          </div>
          <div class="text-gray">「{{ record.simpleName }}」</div>
        </template>

        <template v-else-if="column.key === 'name'">
          <a-button
            type="link"
            class="p-0!"
            @click="goAdManage(record.id)"
          >{{ record.id }}</a-button><a-button
            type="link"
            @click="copy(record.id)"
          >
            <CopyOutlined />
          </a-button>
          <div>{{ record.activeId }}</div>
        </template>

        <template v-else-if="column.key === 'type'">{{ record.type }}</template>

        <template v-else-if="column.key === 'strategy'">{{ record.strategy }}</template>

        <template v-else-if="column.key === 'bidding'">{{ record.bidding || '--' }}</template>

        <template v-else-if="column.key === 'operation'">
          <a-popconfirm
            title="移除广告产品后数据将会清空，请确定是否移除"
            @confirm="del(record)"
          >
            <a-button
              type="link"
              danger
            >移除</a-button>
          </a-popconfirm>
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

    <!-- 添加广告产品弹窗 -->
    <AddModal
      v-model:open="open"
      @emitData="refresh"
    />
  </div>
</template>

<script setup>
  import { DEFAULT_TABLE_COLUMN, SEARCH_PROP_OPTIONS, PLACEHOLDER_ENUM } from './config'
  import { LIST_TABS, listTabsCountEnum } from '../management/config'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { adProductListApi, adProductAddApi, adProductFindListApi, adProductToggleStateApi, removeApi, updateBidApi } from '../api'
  import { message } from 'ant-design-vue'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'
  import { CopyOutlined, DownOutlined } from '@ant-design/icons-vue'
  import AddModal from './components/AddModal.vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import { title } from 'process'

  const accountList = ref([])
  const searchForm = reactive({
    account: undefined,
    title: '',
    activeId: '',
    productId: '',
    name: '',
    sku: '',
    tab: 'ALL'
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
    // loading.value = true
    // 重置选择的数据
    selectedRowKeys.value = []
    selectedRows.value = []

    const params = {
      ...searchForm,
      ...tableParams
    }
    delete params.searchKey
    delete params.searchValue

    adProductListApi(params)
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
        // 批量修改竞价
        console.log('批量修改竞价')
        break
      case '2':
        // 批量移除
        console.log('批量移除')
        break

      default:
        break
    }
  }

  // 同步
  function sync() { }

  function copy(context) {
    copyText(context)
      .then(() => {
        message.success('已复制')
      })
      .catch(err => {
        message.error(err)
      })
  }

  // 跳往广告管理页
  const router = useRouter()
  function goAdManage(id) {
    router.push(`/platform/ozon/ad/management?id=${id}`)
  }

  // 跳往 Ozon 后台
  function goOzon(id) {
    window.open(`https://ozon.ru/context/detail/id/${id}`)
  }

  // 移除
  function del(record) {
    const params = [
      {
        id: record.id,
        productId: record.productId,
        account: record.account
      }
    ]

    removeApi(params).then(res => {
      message.success('删除成功')
    })
  }

  /** 添加广告产品弹窗 */
  const open = ref(false)

  function refresh() { }
</script>
