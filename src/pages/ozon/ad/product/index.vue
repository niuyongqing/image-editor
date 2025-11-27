<!-- 广告产品 列表 -->
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
              :hide-control="['title', 'name'].includes(lazySearchForm.searchKey)"
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
      </a-descriptions>
    </a-card>

    <!-- 按钮区 -->
    <div class="my-4 flex justify-between">
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
          >批量操作 <DownOutlined
        /></a-button>
      </a-dropdown>

      <a-space>
        <a-button
          type="primary"
          @click="open = true"
          >添加广告产品</a-button
        >
        <a-button @click="sync">同步广告产品</a-button>
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
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <div class="flex text-left">
              <a-popover placement="right">
                <template #content>
                  <img
                    :src="record.image || EmptyImg"
                    width="400"
                    height="400"
                  />
                </template>
                <a-image
                  :src="record.image || EmptyImg"
                  :width="80"
                  :height="80"
                  :fallback="EmptyImg"
                  class="object-contain border border-solid border-gray-200"
                />
                <!-- <span>
                  <a-image-preview-group>
                    <a-image
                      style="width: 80px; height: 80px; border: 1px solid #ccc"
                      :src="record.images[0] || EmptyImg"
                      :fallback="EmptyImg"
                    />
                    <a-image
                      v-for="url in record.images.slice(1)"
                      :key="url"
                      :src="url"
                      class="hidden"
                    />
                  </a-image-preview-group>
                </span> -->
              </a-popover>
            </div>
          </template>

          <template v-else-if="column.key === 'title'">
            <div>
              <span :title="record.title">{{ record.title }}</span
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
            <div class="text-gray">「{{ record.simpleName }}」</div>
          </template>

          <template v-else-if="column.key === 'name'">
            <a-button
              type="link"
              class="p-0!"
              @click="goAdManage(record.id)"
              >{{ record.id }}</a-button
            ><a-button
              type="link"
              @click="copy(record.id)"
              ><CopyOutlined
            /></a-button>
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
                >移除</a-button
              >
            </a-popconfirm>
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

  const accountList = ref([])
  // 被 watch 监听的搜索表单; 外层, 点击即可搜索
  const watchedSearchForm = reactive({
    sellerId: undefined,
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
    // loading.value = true
    // 重置选择的数据
    selectedRowKeys.value = []
    selectedRows.value = []

    const params = {
      ...watchedSearchForm,
      ...lazySearchForm,
      [lazySearchForm.searchKey]: lazySearchForm.searchValue,
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
  function sync() {}

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
    const params = [{
      id: record.id,
      productId: record.productId,
      account: record.account
    }]

    removeApi(params).then(res => {
      message.success('删除成功')
    })
  }

  /** 添加广告产品弹窗 */
  const open = ref(false)

  function refresh() {}
</script>
