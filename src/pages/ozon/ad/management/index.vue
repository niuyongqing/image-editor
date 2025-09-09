<!-- 广告管理 列表 -->
<template>
  <div class="text-left">
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
            v-model:value="watchedSearchForm.enableState"
            :options="ENABLE_STATE_OPTIONS"
          />
        </a-descriptions-item>
        <a-descriptions-item label="活动状态">
          <TiledSelect
            v-model:value="watchedSearchForm.activeState"
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
        <a-button type="primary" @click="add">创建广告</a-button>
        <a-button @click="sync">同步广告</a-button>
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
            :tab="`${item.label}(${LIST_TABS_COUNT_ENUM[item.value] || 0})`"
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
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'option'">
            <a-button
              type="link"
              @click="edit(record)"
              >编辑</a-button
            >
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
  import { DEFAULT_TABLE_COLUMN, SEARCH_PROP_OPTIONS, PLACEHOLDER_ENUM, PAY_TYPE_OPTIONS, ENABLE_STATE_OPTIONS, ACTIVE_STATE_OPTIONS, LIST_TABS, LIST_TABS_COUNT_ENUM } from './config'
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { message } from 'ant-design-vue'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'
  import { CopyOutlined, DownOutlined } from '@ant-design/icons-vue'

  const accountList = ref([])
  // 被 watch 监听的搜索表单; 外层, 点击即可搜索
  const watchedSearchForm = reactive({
    sellerId: undefined,
    payType: undefined,
    enableState: undefined,
    activeState: undefined,
    tab: 'all'
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
    // loading.value = true
    // 重置选择的数据
    selectedRowKeys.value = []
    selectedRows.value = []

    const params = {
      ...watchedSearchForm,
      ...lazySearchForm,
      [lazySearchForm.searchKey]: lazySearchForm.searchValue,
      ...tableParams
      // startCreateTime: lazySearchForm.createTime ? dayjs(lazySearchForm.createTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      // endCreateTime: lazySearchForm.createTime ? dayjs(lazySearchForm.createTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined
    }
    delete params.searchKey
    delete params.searchValue
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
        console.log('批量开启')
        break
      case '3':
        // 批量关闭
        console.log('批量关闭')
        break

      default:
        break
    }
  }

  // 创建
  function add() {}

  // 同步
  function sync() {}

  /** table 操作 */
  function edit(record) {}

  function handleMore(key, record) {
    console.log(key)
  }
</script>
