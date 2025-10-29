<!-- 智能化刊登资料库 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <a-card class="mb-3">
      <a-form
        :model="searchForm"
        ref="searchFormRef"
        layout="inline"
      >
        <a-form-item label="模糊查询">
          <a-space>
            <a-input
              v-model:value="searchForm.tradeName"
              placeholder="请输入产品名称"
              allow-clear
            />
            <a-input
              v-model:value="searchForm.sku"
              placeholder="请输入产品SKU"
              allow-clear
            />
          </a-space>
        </a-form-item>
        <a-form-item
          label="分类"
          name="classify"
        >
          <a-cascader
            v-model:value="searchForm.classify"
            :options="commodityType"
            change-on-select
            placeholder="请选择分类"
            class="w-60!"
          />
        </a-form-item>
        <a-form-item
          label="提交人"
          name="selectUserId"
        >
          <a-select
            v-model:value="searchForm.selectUserId"
            :options="submiterOptions"
            :field-names="{ label: 'userName', value: 'userId' }"
            placeholder="请选择提交人"
            allow-clear
            class="w-40!"
          />
        </a-form-item>
        <a-form-item
          label="完成时间"
          name="finalAuditTime"
        >
          <a-range-picker
            v-model:value="searchForm.finalAuditTime"
            :disabled-date="cur => cur && cur > Date.now()"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            class="mr-2"
            @click="search"
            >查询</a-button
          >
          <a-button @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- table 区 -->
    <a-card>
      <a-space>
        <a-button
          type="primary"
          :disabled="state.selectedRowKeys.length === 0"
          @click="publicationModalOpen = true"
          >批量刊登</a-button
        >
        <a-button
          type="primary"
          :disabled="state.selectedRowKeys.length === 0"
          @click="remarkModalOpen = true"
          >批量备注</a-button
        >
        <a-popconfirm
          title="确定退回编辑吗?"
          :disabled="state.selectedRowKeys.length === 0"
          @confirm="batchReturnEdit"
        >
          <a-button :disabled="state.selectedRowKeys.length === 0">批量退回编辑</a-button>
        </a-popconfirm>
      </a-space>

      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="state.total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        class="mb-4 float-right"
        @change="getList"
      />

      <a-table
        :columns="DEFAULT_TABLE_COLUMN"
        :data-source="tableData"
        :loading="state.loading"
        stripe
        row-key="id"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.mainImage || EmptyImg"
              :width="80"
              :height="80"
              :fallback="EmptyImg"
              class="object-contain border border-solid border-gray-200"
            />
          </template>
          <template v-else-if="column.key === 'commodityName'">
            <div class="w-80">{{ record.commodityName || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'sku'">
            <div class="w-100">{{ record.skuList || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'category'">
            <span>{{ getClassifyLabel(record.classify) }}</span>
          </template>
          <template v-else-if="column.key === 'remark'">
            <div class="w-100">{{ record.remark || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'options'">
            <a-space>
              <a-button
                type="link"
                :disabled="!record.intelligentProductId || record.auditStatus !== 20"
                @click="goDetail(record)"
                >查看</a-button
              >
              <a-button
                type="link"
                :disabled="!record.intelligentProductId || record.auditStatus !== 20"
                @click="openPublicationModal(record)"
                >刊登</a-button
              >
              <a-button
                type="link"
                @click="openLogModal(record)"
                >日志</a-button
              >
              <a-button
                type="link"
                @click="openRemorkModal(record)"
                >备注</a-button
              >
            </a-space>
          </template>
        </template>
      </a-table>

      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="state.total"
        :default-page-size="50"
        show-size-changer
        show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
        class="float-right"
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

    <!-- 刊登弹窗 -->
    <PublicationModal
      v-model:open="publicationModalOpen"
      :id="curRecord.id"
      @refresh="search"
    />
     <LogIndexUpgradeGP ref="logIndexUpgradeGPRef"></LogIndexUpgradeGP>
  </div>
</template>

<script setup>
  import { getUserListApi, getListApi } from '@/pages/product-review/data-for-editing/api'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import { DEFAULT_TABLE_COLUMN } from './config'
  import { MARKET_OPTIONS, STORAGE_OPTIONS } from '@/pages/product-review/data-for-editing/config'
  import commodityType from '~@/utils/commodityType'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'
  import PublicationModal from './PublicationModal.vue'
  import LogIndexUpgradeGP from './LogModal.vue';


  const logIndexUpgradeGPEl = useTemplateRef('logIndexUpgradeGPRef');

  const router = useRouter()

  /** search */
  const searchForm = reactive({
    tradeName: '',
    sku: '',
    classify: undefined,
    selectUserId: undefined,
    finalAuditTime: null
  })
  const searchFormRef = ref()

  // 提交人下拉列表
  const submiterOptions = ref([])
  getUserListApi().then(res => {
    submiterOptions.value = res.data || []
  })

  function search() {
    tableParams.pageNum = 1
    getList()
  }

  function reset() {
    tableParams.pageNum = 1
    searchForm.tradeName = ''
    searchForm.sku = ''
    searchFormRef.value.resetFields()

    getList()
  }

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

  function onSelectChange(selectedRowKeys) {
    state.selectedRowKeys = selectedRowKeys
  }

  getList()
  function getList() {
    state.selectedRowKeys = []
    const params = {
      ...tableParams,
      ...searchForm,
      classify: searchForm.classify ? searchForm.classify.join(',') : undefined,
      startTime: searchForm.finalAuditTime ? dayjs(searchForm.finalAuditTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      endTime: searchForm.finalAuditTime ? dayjs(searchForm.finalAuditTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      auditStatus: '20,30,40'
    }
    delete params.finalAuditTime

    state.loading = true
    getListApi(params)
      .then(res => {
        state.total = res.total ?? 0
        const list = res.rows || []
        list.forEach(item => {
          const mainImageList = JSON.parse(item.artMainImage).map(image => image.url)
          item.mainImage = mainImageList[0]
        })
        tableData.value = list
      })
      .finally(() => {
        state.loading = false
      })
  }

  /** 批量退回编辑 */
  function batchReturnEdit() {
    console.log('退回编辑')
  }

  /** 查看详情 */
  function goDetail(record) {
    window.open(`/platform/intelligent-publication/database-detail?id=${record.intelligentProductId}`)
  }

  let curRecord = {}
  /** 刊登 */
  const publicationModalOpen = ref(false)

  function openPublicationModal(record) {
    publicationModalOpen.value = true
    curRecord = record
  }

  /** 日志 */
  const logModalLoading = ref(false)

  function openLogModal(record) {
    logIndexUpgradeGPEl.value.open();
    curRecord = record
  }

  /** 备注 */
  let curId = ''
  const remark = ref('')
  const remarkModalOpen = ref(false)
  const remarkLoading = ref(false)

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
      id: curId ? curId : state.selectedRowKeys.join(','),
      remark: remark.value
    }

    /* remarkLoading.value = true
      addRemarkApi(params)
      .then(res => {
        message.success('添加备注成功')
        getList()
        remarkCancel()
      })
      .finally(() => {
        remarkLoading.value = false
      })
     */
  }

  // 根据分类 value 获取分类 label
  function getClassifyLabel(classify) {
    if (!classify) return '--'

    const classifyList = classify.split(',')
    const labelList = []
    let currentNodes = commodityType

    for (let i = 0; i < classifyList.length; i++) {
      const value = classifyList[i]
      const node = currentNodes.find(item => item.value === value)

      if (!node) break

      labelList.push(node.label)
      currentNodes = node.children || []
    }

    return labelList.join('/') || '--'
  }

  /** 监听编辑页保存后的跨窗口通信 */
  window.addEventListener('message', receiveMessage)

  onBeforeUnmount(() => {
    window.removeEventListener('message', receiveMessage)
  })

  function receiveMessage(event) {
    if (event.origin === window.location.origin && event.data === 'refresh') {
      getList()
    }
  }
</script>
