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
              :hide-control="['title'].includes(lazySearchForm.searchKey)"
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
        :scroll="{ x: 'max-content', y: '1000px' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
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
            </a-popover>
          </template>

          <template v-else-if="column.key === 'title'">
            <div>
              <span :title="record.title">{{ record.title }}</span>
              <a-button
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
              >
              <a-button
                type="link"
                @click="copy(record.id)"
                ><CopyOutlined
              /></a-button>
            </div>
            <div v-if="record.mergeState">
              <a-button
                type="link"
                @click="mergeProductModalOpen = true"
                >已合并</a-button
              >
            </div>
          </template>

          <template v-else-if="column.key === 'price'">{{ `${record.currency} ${record.price}` }}</template>

          <template v-else-if="column.key === 'originPrice'">{{ `${record.currency} ${record.originPrice}` }}</template>

          <template v-else-if="column.key === 'state'"
            ><a-tag color="green">{{ record.state }}</a-tag></template
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
        :data-source="tableData"
        stripe
        row-key="id"
        :pagination="false"
        :scroll="{ x: 'max-content', y: '1000px' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
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
            </a-popover>
          </template>

          <template v-else-if="column.key === 'title'">
            <div>
              <span :title="record.title">{{ record.title }}</span>
              <a-button
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
              >
              <a-button
                type="link"
                @click="copy(record.id)"
                ><CopyOutlined
              /></a-button>
            </div>
          </template>

          <template v-else-if="column.key === 'price'">{{ `${record.currency} ${record.price}` }}</template>

          <template v-else-if="column.key === 'originPrice'">{{ `${record.currency} ${record.originPrice}` }}</template>

          <template v-else-if="column.key === 'state'"
            ><a-tag color="green">{{ record.state }}</a-tag></template
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

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:open', 'addProduct'])

  // 默认表头
  const DEFAULT_TABLE_COLUMN = [
    { title: '图片', key: 'image' },
    { title: '产品标题', key: 'title' },
    { title: 'SKU', key: 'sku', dataIndex: 'sku' },
    { title: '售价', key: 'price' },
    { title: '原价', key: 'originPrice' },
    { title: '库存', key: 'stock', dataIndex: 'stock' },
    { title: '状态', key: 'state' },
    { title: '操作', key: 'options' }
  ]

  // 搜索类型
  const SEARCH_PROP_OPTIONS = [
    { label: '产品标题', value: 'title' },
    { label: '产品 ID', value: 'productId' },
    { label: 'SKU', value: 'sku' }
  ]
  const PLACEHOLDER_ENUM = {
    title: '产品标题',
    productId: '产品 ID, 多个 ID 间用英文逗号隔开',
    sku: 'SKU, 多个 SKU 间用英文逗号隔开'
  }

  // 点击'搜索'按钮再执行搜索动作
  const lazySearchForm = reactive({
    searchKey: 'title', // 搜索类型
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

  getList()
  function getList() {
    // loading.value = true
    // 重置选择的数据
    selectedRowKeys.value = []
    selectedRows.value = []

    const params = {
      ...lazySearchForm,
      [lazySearchForm.searchKey]: lazySearchForm.searchValue,
      ...tableParams
    }
    delete params.searchKey
    delete params.searchValue
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

  // 添加
  function add(record) {
    emits('addProduct', [record])
  }

  function cancel() {
    // 重置状态
    lazySearchForm.searchKey = 'title'
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
