<!-- 刊登序列 弹窗 -->
<template>
  <a-modal
    :open="open"
    title="刊登序列"
    width="80%"
    :footer="false"
    @cancel="cancel"
  >
    <a-card>
      <a-table
        :loading="state.loading"
        :columns="COLUMNS"
        :data-source="tableData"
        stripe
        row-key="waitPublishProductId"
        :pagination="false"
        :custom-row="record => ({ onDblclick: () => goEdit(record) })"
        :scroll="{ x: 'max-content', y: '70vh' }"
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
            <div class="w-80">{{ record.remark || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-button
              type="link"
              @click="goEdit(record)"
              >{{ [10, 40].includes(record.publishStatus) ? '编辑' : '查看' }}</a-button
            >
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
  </a-modal>
</template>

<script setup>
  import { COLUMNS } from '@/pages/intelligent-publication/js/publication-list-config'
  import { accountCache } from '@/pages/ozon/config/api/product'
  import { listApi } from '@/pages/intelligent-publication/js/publication-list-api'
  import { message } from 'ant-design-vue'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    }
  })

  const emit = defineEmits(['update:open'])

  watch(
    () => props.open,
    open => {
      if (open) {
        getList()
      }
    }
  )

  /** ======= data ======= */
  const accountList = ref([])
  const PUBLISH_TYPE_ENUM = { 1: '自动刊登', 2: '手动刊登' }
  const STATUS_ENUM = { 10: '待刊登', 20: '已取消', 25: '刊登中', 30: '已刊登', 40: '刊登失败' }
  const STATUS_TAG_COLOR_ENUM = { 10: 'processing', 20: 'warning', 25: 'processing', 30: 'success', 40: 'error' }

  /** table */
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const state = reactive({
    loading: false,
    total: 0
  })
  const tableData = ref([])

  /** ======= liftcycle hooks ======= */
  getAccountList()

  /** ======= methods ======= */
  function getAccountList() {
    accountCache()
      .then(res => {
        accountList.value = res.data || []
        if (accountList.value.length === 0) {
          message.error('当前账号没有配置店铺, 请前往「账号配置」添加, 或联系管理员')
        }
      })
      .finally(() => {})
  }

  function getList() {
    const params = {
      ...tableParams,
      accountList: accountList.value.map(item => item.account),
      intelligentProductId: props.id
    }

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

  function fixedUrl(url) {
    if (!url) return EmptyImg

    if (url.startsWith('http') || url.startsWith('/prod-api')) return url

    return '/prod-api' + url
  }

  function goEdit(record) {
    window.open(`/platform/intelligent-publication/publication-list-detail?waitPublishProductId=${record.waitPublishProductId}`)
  }

  function cancel() {
    emit('update:open', false)
  }
</script>
