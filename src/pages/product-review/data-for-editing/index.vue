<!-- 资料待编辑 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <AppTableForm
      v-model:formData="searchForm"
      reset-set-menu="dataForEditing"
      @on-submit="search"
      @formHeightChange="height => { formHeight = height }"
    >
      <template #formItemBox>
        <a-form-item
          label="分类"
          name="classify"
        >
          <a-cascader
            v-model:value="searchForm.classify"
            :options="commodityType"
            change-on-select
            placeholder="请选择分类"
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
        <a-form-item
          label="模糊查询"
          name="mult"
        >
          <a-form-item-rest>
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
          </a-form-item-rest>
        </a-form-item>
      </template>
    </AppTableForm>

    <!-- table 区 -->
    <AppTableBox
      :table-header="DEFAULT_TABLE_COLUMN"
      :data-source="tableData"
      :loading="loading"
      reset-set-menu="dataForEditing"
      stripe
      row-key="id"
      :scroll="scrollConfig"
      @rowDoubleClick="record => goEdit(record)"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- 索引列 -->
        <template v-if="column.key === 'index'">
          {{ index + 1 + (tableParams.pageNum - 1) * tableParams.pageSize }}
        </template>
        <template v-else-if="column.key === 'image'">
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
        <template v-else-if="column.key === 'market'">
          <span>{{ MARKET_OPTIONS.find(item => item.value === record.devAttributableMarket)?.label || '--' }}</span>
        </template>
        <template v-else-if="column.key === 'sku'">
          <div class="w-100">{{ record.skuCodes || record.skuList || '--' }}</div>
        </template>
        <template v-else-if="column.key === 'storage'">
          <span>{{ STORAGE_OPTIONS.find(item => item.value === record.meansKeepGrain)?.label || '--' }}</span>
        </template>
        <template v-else-if="column.key === 'category'">
          <span>{{ getClassifyLabel(record.classify) }}</span>
        </template>
        <template v-else-if="column.key === 'reviewer'">
          <span>{{ record.lastAuditUserName || record.firstAuditName }}</span>
        </template>
        <template v-else-if="column.key === 'selectReason'">
          <div class="w-100">{{ record.selectReason || '--' }}</div>
        </template>
        <template v-else-if="column.key === 'remark'">
          <div class="w-100">{{ record.remark || '--' }}</div>
        </template>
        <template v-else-if="column.key === 'operation'">
          <a-space>
            <a-button
              type="link"
              :disabled="!record.intelligentProductId || ![20, 30, 40].includes(record.auditStatus)"
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
              @click="openRemorkModal(record)"
              >添加备注</a-button
            >
            <!-- <a-popconfirm
              title="请确定是否删除"
              @confirm="del(record)"
            >
              <a-button
                type="link"
                danger
                >删除</a-button
              >
            </a-popconfirm> -->
          </a-space>
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

    <!-- 备注弹窗 -->
    <a-modal
      title="添加备注"
      v-model:open="remarkModalOpen"
      width="30%"
      :confirm-loading="remarkLoading"
      :mask-closable="false"
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
  import { getListApi, getUserListApi, addRemarkApi } from './api'
  import EmptyImg from '@/assets/images/aliexpress/empty.png'
  import { DEFAULT_TABLE_COLUMN, MARKET_OPTIONS, STORAGE_OPTIONS } from './config'
  import commodityType from '~@/utils/commodityType'
  import dayjs from 'dayjs'
  import { message } from 'ant-design-vue'
  import { useUserStore } from "~/stores/user.js";
  const userStore = useUserStore();
  const hasEditPermission = userStore.userRouterAuth?.some(item => item.path === '/platform/product-review/data-for-editing-detail');
  const hasAddPhoto = userStore.userRouterAuth?.some(item => item.path === '/platform/product-review/pending-editing-application-photo');

  /** search */
  const searchForm = reactive({
    tradeName: '',
    sku: '',
    classify: undefined,
    devAttributableMarket: undefined,
    selectUserId: undefined,
    submitTime: null
  })
  const formHeight = ref(0)

  // 提交人下拉列表
  const submiterOptions = ref([])
  getUserListApi().then(res => {
    submiterOptions.value = res.data || []
  })

  /** table */
  const loading = ref(false)
  const tableParams = reactive({
    pageNum: 1,
    pageSize: 50
  })
  const tableData = ref([])
  const total = ref(0)

  const scrollConfig = computed(() => {
    return {
      x: 'max-content',
      y: `calc(100vh - 210px - ${formHeight.value}px)`
    }
  })

  getList()
  function getList() {
    const params = {
      ...tableParams,
      ...searchForm,
      classify: searchForm.classify ? searchForm.classify.join(',') : undefined,
      startTime: searchForm.submitTime ? dayjs(searchForm.submitTime[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      endTime: searchForm.submitTime ? dayjs(searchForm.submitTime[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss') : undefined,
      auditStatus: '20,30,40'
    }
    delete params.submitTime

    loading.value = true
    getListApi(params)
      .then(res => {
        total.value = res.total ?? 0
        const list = res.rows || []
        list.forEach(item => {
          const mainImageList = JSON.parse(item.artMainImage).map(image => image.url)
          item.mainImage = mainImageList[0]
        })
        tableData.value = list
      })
      .finally(() => {
        loading.value = false
      })
  }

  function search() {
    tableParams.pageNum = 1
    getList()
  }

  /** 编辑 */
  function goEdit(record) {
    if (!hasEditPermission) {
      message.error('您没有编辑权限')
      return
    }
    const query = `commodityId=${record.commodityId}&intelligentProductId=${record.intelligentProductId}&auditStatus=${record.auditStatus}&selectRecordId=${record.id}`

    window.open(`/platform/product-review/data-for-editing-detail?${query}`)
  }

  /** 申请拍照 */
  const router = useRouter()
  function applicationPhoto(record) {
    const query = {
      id: record.commodityId,
      tradeName: record.commodityName, //商品名称
      classify: record.classify, //商品分类
      skuList: record.skuCodes || record.skuList, //商品SKU列表
      productId: record.intelligentProductId //商品ID
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
