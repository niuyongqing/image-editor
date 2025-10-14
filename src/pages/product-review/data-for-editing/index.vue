<!-- 资料待编辑 列表 -->
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
          label="市场方向"
          name="devAttributableMarket"
        >
          <a-select
            v-model:value="searchForm.devAttributableMarket"
            :options="MARKET_OPTIONS"
            placeholder="请选择市场方向"
            allow-clear
            class="w-40!"
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
          label="提交时间"
          name="submitTime"
        >
          <a-range-picker
            v-model:value="searchForm.submitTime"
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
      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="total"
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
        :loading="loading"
        stripe
        row-key="id"
        :pagination="false"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-popover placement="right">
              <template #content>
                <img
                  :src="record.mainImage || EmptyImg"
                  width="400"
                  height="400"
                />
              </template>
              <a-image
                :src="record.mainImage || EmptyImg"
                :width="80"
                :height="80"
                :fallback="EmptyImg"
                class="object-contain border border-solid border-gray-200"
              />
            </a-popover>
          </template>
          <template v-else-if="column.key === 'market'">
            <span>{{ MARKET_OPTIONS.find(item => item.value === record.devAttributableMarket)?.label || '--' }}</span>
          </template>
          <template v-else-if="column.key === 'sku'">
            <span>{{ record.skuList || '--' }}</span>
          </template>
          <template v-else-if="column.key === 'storage'">
            <span>{{ STORAGE_OPTIONS.find(item => item.value === record.meansKeepGrain)?.label || '--' }}</span>
          </template>
          <template v-else-if="column.key === 'category'">
            <span>{{ getClassifyLabel(record.classify) }}</span>
          </template>
          <template v-else-if="column.key === 'submiter'">
            <span>{{ record.selectUserId }}</span>
          </template>
          <template v-else-if="column.key === 'reviewer'">
            <span>{{ record.lastAuditUserName }}</span>
          </template>
          <template v-else-if="column.key === 'options'">
            <a-space>
              <a-button
                type="link"
                @click="goEdit(record)"
                >编辑</a-button
              >
              <a-button
                type="link"
                :disabled="record.auditStatus !== 20"
                @click="applicationPhoto(record)"
                >申请拍照</a-button
              >
              <a-button
                type="link"
                @click="openRemorkModal(record.id)"
                >添加备注</a-button
              >
              <a-popconfirm
                title="请确定是否删除"
                @confirm="del(record)"
              >
                <a-button
                  type="link"
                  danger
                  >删除</a-button
                >
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>

      <a-pagination
        v-model:current="tableParams.pageNum"
        v-model:pageSize="tableParams.pageSize"
        :total="total"
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
        placeholder="请输入备注内容"
      />
    </a-modal>
  </div>
</template>

<script setup>
  import { getListApi, getUserListApi, addRemarkApi } from './api'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import { DEFAULT_TABLE_COLUMN, MARKET_OPTIONS, STORAGE_OPTIONS } from './config'
  import commodityType from '~@/utils/commodityType'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'

  /** search */
  const searchForm = reactive({
    tradeName: '',
    sku: '',
    classify: undefined,
    devAttributableMarket: undefined,
    selectUserId: undefined,
    submitTime: null
  })
  const searchFormRef = ref()

  const options = [
    { label: 'label', value: 'value' },
    { label: 'label2', value: 'value2' }
  ]
  const categoryOptions = ref([])
  categoryOptions.value = options

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
  const loading = ref(false)
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const tableData = ref([])
  const total = ref(0)

  getList()
  function getList() {
    const params = {
      ...tableParams,
      ...searchForm,
      classify: searchForm.classify ? searchForm.classify.join(',') : undefined,
      startTime: searchForm.submitTime ? dayjs(searchForm.submitTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      endTime: searchForm.submitTime ? dayjs(searchForm.submitTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      state: '20,30,40'
    }
    delete params.submitTime

    getListApi(params).then(res => {
      total.value = res.total ?? 0
      const list = res.rows || []
      list.forEach(item => {
        const mainImageList = JSON.parse(item.artMainImage).map(image => image.url)
        item.mainImage = mainImageList[0]
      })
      tableData.value = list
    })
  }

  /** 编辑 */
  function goEdit(record) {
    window.open(`/platform/product-review/data-for-editing-detail?id=${record.id}&commodityId=${record.commodityId}`)
  }

  /** 申请拍照 */
  const router = useRouter()
  function applicationPhoto(record) {
    const query = {
      id: record.id,
      tradeName: record.productName, //商品名称
      classify: record.categoryId, //商品分类
      skuList: record.skuCodes, //商品SKU列表
      productId: record.intelligentProductId, //商品ID
    }

    const urlData = router.resolve({
      path: '/platform/product-review/pending-editing-application-photo',
      query
    })
    window.open(urlData.href, '_blank')
  }

  /** 备注 */
  let curId = ''
  const remark = ref('')
  const remarkModalOpen = ref(false)
  const remarkLoading = ref(false)

  // 打开弹窗
  function openRemorkModal(id) {
    curId = id
    remarkModalOpen.value = true
  }

  function remarkCancel() {
    remarkModalOpen.value = false
    curId = ''
    remark.value = ''
  }

  function remarkOk() {
    remarkLoading.value = true
    const params = {
      id: curId,
      remark: remark.value
    }

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

  /** 删除 */
  function del(record) {}

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
</script>
