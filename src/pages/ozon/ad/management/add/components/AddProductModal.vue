<!-- 添加广告活动产品 -->
<template>
  <a-modal
    :open="open"
    title="添加活动产品"
    width="60%"
    :footer="null"
    @cancel="cancel"
  >
    <!-- 搜索区 -->
    <a-card>
      <a-descriptions :column="1">
        <a-descriptions-item label="搜索类型">
          <TiledSelect
            v-model:value="lazySearchForm.searchKey"
            :options="SEARCH_PROP_OPTIONS"
            :append-all="false"
            ref="searchKeyRef"
          />
        </a-descriptions-item>
        <a-descriptions-item
          label="搜索内容"
          :content-style="{ 'flex-direction': 'column' }"
        >
          <a-space align="start">
            <SearchContentInput
              v-model:value="lazySearchForm.searchValue"
              :hide-control="['name'].includes(lazySearchForm.searchKey)"
              :placeholder="PLACEHOLDER_ENUM[lazySearchForm.searchKey]"
              ref="searchValueRef"
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

    <div class="my-3">
      <a-tag color="blue">说明</a-tag>
      <span class="ml-1">仅支持添加状态为在售的产品</span>
    </div>

    <!-- TABLE 区 -->
    <a-card>
      <div class="my-4 flex justify-between">
        <a-button
          type="primary"
          :disabled="selectedRowKeys.length === 0"
          @click="batchAdd"
          >批量添加</a-button
        >

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
        row-key="id"
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 'max-content', y: '760px' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.primaryImage?.[0] || EmptyImg"
              :width="80"
              :height="80"
              :fallback="EmptyImg"
              class="object-contain border border-solid border-gray-200"
            />
          </template>

          <template v-else-if="column.key === 'name'">
            <div>
              <span :title="record.name">{{ record.name }}</span>
              <a-button
                type="link"
                @click="copy(record.name)"
                ><CopyOutlined
              /></a-button>
            </div>
            <div>
              <a-button
                type="link"
                class="p-0!"
                @click="goOzon(record.id)"
                >{{ record.id }}</a-button
              >
              <a-button
                type="link"
                @click="copy(record.id)"
                ><CopyOutlined
              /></a-button>
            </div>
            <div v-if="record.count > 1">
              <a-button
                type="link"
                @click="getMergeTableData(record)"
                >已合并</a-button
              >
            </div>
          </template>

          <template v-else-if="column.key === 'price'">{{ `${record.currencyCode || 'CNY'} ${record.price}` }}</template>

          <template v-else-if="column.key === 'oldPrice'">{{ `${record.currencyCode || 'CNY'} ${record.oldPrice}` }}</template>

          <template v-else-if="column.key === 'stock'">
            <a-popover>
              <template #content>
                <p
                  v-for="warehouse in record.warehouseList"
                  :key="warehouse.warehouseName"
                >
                  {{ `${warehouse.warehouseName}: ${warehouse.present}` }}
                </p>
              </template>
              <span>{{ record.stock ?? '--' }}</span>
            </a-popover>
          </template>

          <template v-else-if="column.key === 'state'"
            ><a-tag :color="record.state === '在售' ? 'green' : 'default'">{{ record.state }}</a-tag></template
          >

          <template v-else-if="column.key === 'options'">
            <a-button
              type="link"
              @click="add(record)"
              >添加</a-button
            >
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

    <!-- 合并产品 弹窗 -->
    <a-modal
      v-model:open="mergeProductModalOpen"
      title="合并产品"
      :footer="null"
      width="50%"
    >
      <a-table
        :columns="DEFAULT_TABLE_COLUMN.slice(0, -1)"
        :data-source="mergeTableData"
        :loading="mergeTableLoading"
        stripe
        row-key="id"
        :pagination="false"
        :scroll="{ x: 'max-content', y: '1000px' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.primaryImage?.[0] || EmptyImg"
              :width="80"
              :height="80"
              :fallback="EmptyImg"
              class="object-contain border border-solid border-gray-200"
            />
          </template>

          <template v-else-if="column.key === 'name'">
            <div>
              <span :title="record.name">{{ record.name }}</span>
              <a-button
                type="link"
                @click="copy(record.name)"
                ><CopyOutlined
              /></a-button>
            </div>
            <div>
              <a-button
                type="link"
                class="p-0!"
                @click="goOzon(record.id)"
                >{{ record.id }}</a-button
              >
              <a-button
                type="link"
                @click="copy(record.id)"
                ><CopyOutlined
              /></a-button>
            </div>
          </template>

          <template v-else-if="column.key === 'price'">{{ `${record.currencyCode || 'CNY'} ${record.price}` }}</template>

          <template v-else-if="column.key === 'oldPrice'">{{ `${record.currencyCode || 'CNY'} ${record.oldPrice}` }}</template>

          <template v-else-if="column.key === 'stock'">
            <a-popover>
              <template #content>
                <p
                  v-for="warehouse in record.warehouseList"
                  :key="warehouse.warehouseName"
                >
                  {{ `${warehouse.warehouseName}: ${warehouse.present}` }}
                </p>
              </template>
              <span>{{ record.stock ?? '--' }}</span>
            </a-popover>
          </template>

          <template v-else-if="column.key === 'state'"
            ><a-tag :color="record.state === '在售' ? 'green' : 'default'">{{ record.state }}</a-tag></template
          >
        </template>
      </a-table>
    </a-modal>
  </a-modal>
</template>

<script setup>
  import dayjs from 'dayjs'
  import { copyText } from '@/utils'
  import { message } from 'ant-design-vue'
  import TiledSelect from '~/components/tiled-select/index.vue'
  import SearchContentInput from '~/components/search-content-input/index.vue'
  import { CopyOutlined } from '@ant-design/icons-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import { referenceProductApi, mergeListApi } from '../../../api'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    account: {
      type: String,
      default: ''
    },
    excludeIds: {
      type: Array,
      default: () => []
    }
  })
  const emits = defineEmits(['update:open', 'addProduct'])

  // 打开弹窗时查询活动产品列表
  watch(
    () => props.open,
    open => {
      if (open) {
        getList()
      }
    }
  )

  // 默认表头
  const DEFAULT_TABLE_COLUMN = [
    { title: '图片', key: 'image' },
    { title: '产品标题', key: 'name', width: 300 },
    { title: 'SKU', key: 'sku', dataIndex: 'offerId' },
    { title: '售价', key: 'price' },
    { title: '原价', key: 'oldPrice' },
    { title: '库存', key: 'stock' },
    { title: '状态', key: 'state' },
    { title: '操作', key: 'options' }
  ]

  // 搜索类型
  const SEARCH_PROP_OPTIONS = [
    { label: '产品标题', value: 'name' },
    { label: '产品 ID', value: 'id' },
    { label: 'SKU', value: 'sku' }
  ]
  const PLACEHOLDER_ENUM = {
    title: '产品标题',
    productId: '产品 ID, 多个 ID 间用英文逗号隔开',
    sku: 'SKU, 多个 SKU 间用英文逗号隔开'
  }

  // 点击'搜索'按钮再执行搜索动作
  const lazySearchForm = reactive({
    searchKey: 'name', // 搜索类型
    searchValue: undefined // 搜索内容
  })
  const searchKeyRef = ref()
  const searchValueRef = ref()
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const total = ref(0)
  const tableData = ref([])
  const loading = ref(false)
  const selectedRowKeys = ref([])
  const selectedRows = ref([])

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
      account: props.account,
      excludeIds: props.excludeIds,
      [lazySearchForm.searchKey]: lazySearchForm.searchValue,
      ...tableParams
    }

    referenceProductApi(params)
      .then(res => {
        total.value = res.total ?? 0
        tableData.value = res.rows || []
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
  function batchAdd() {
    emits('addProduct', selectedRows.value)
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

  // 跳往 Ozon 后台
  function goOzon(id) {
    window.open(`https://ozon.ru/context/detail/id/${id}`)
  }

  /** 合并产品弹窗 */
  const mergeProductModalOpen = ref(false)
  const mergeTableData = ref([])
  const mergeTableLoading = ref(false)

  // 点击已合并, 获取合并产品数据
  function getMergeTableData(record) {
    mergeProductModalOpen.value = true
    mergeTableData.value = []
    mergeTableLoading.value = true

    const params = {
      account: record.account,
      attributeId: record.attributeId,
      categoryId: record.categoryId
    }
    mergeListApi(params)
      .then(res => {
        mergeTableData.value = res.data || []
      })
      .finally(() => {
        mergeTableLoading.value = false
      })
  }

  // 添加
  function add(record) {
    emits('addProduct', [record])
  }

  function cancel() {
    // 重置状态
    lazySearchForm.searchKey = 'name'
    lazySearchForm.searchValue = undefined
    searchKeyRef.value.curIndex = 0
    searchValueRef.value.content = ''
    tableParams.pageNum = 1
    tableParams.pageSize = 50
    total.value = 0
    tableData.value = []
    selectedRowKeys.value = []
    selectedRows.value = []

    emits('update:open', false)
  }
</script>
