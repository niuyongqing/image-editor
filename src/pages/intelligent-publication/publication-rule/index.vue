<!-- 智能化刊登规则 列表 -->
<template>
  <div class="text-left">
    <!-- 搜索区 -->
    <a-card class="mb-3">
      <a-form :model="searchForm" ref="searchFormRef" layout="inline">
        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="searchForm.status" :options="STATUS_OPTIONS" />
        </a-form-item>
        <a-form-item label="模糊查询">
          <a-space>
            <a-input v-model:value="searchForm.ruleName" placeholder="请输入规则名称" allow-clear />
          </a-space>
        </a-form-item>
        <a-form-item label="分类" name="categoryId">
        <a-cascader 
          placeholder="分类" 
          allowClear 
          style="width: 300px;"
          v-model:value="searchForm.categoryId" 
          :options="commodityTypeList"
          :allow-clear="true" 
          show-search
          :filterOption="filterOption"
          :field-names="{ value: 'descriptionCategoryId', label: 'categoryName', children: 'children' }" 
        />
      </a-form-item>
        <!-- <a-form-item label="分类" name="categoryId">
          <a-select filterable style="width: 600px" v-model:value="searchForm.categoryId" :options="flatTreeList" 
          :field-names="{
            label: 'label',
            value: 'uniqueCode',
          }"
          show-search
          :filterOption="filterOption"
          placeholder="分类" allowClear></a-select>
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" class="mr-2" @click="search">查询</a-button>
          <a-button @click="reset">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- table 区 -->
    <a-card>
      <a-space>
        <a-button type="primary" @click="add">新增</a-button>
        <!-- <a-popconfirm
          title="确定启用吗?"
          :disabled="state.selectedRowKeys.length === 0"
          @confirm="batchToggleStatus({ status: 1 })"
        >
          <a-button :disabled="state.selectedRowKeys.length === 0">批量启用</a-button>
        </a-popconfirm>
        <a-popconfirm
          title="确定停用吗?"
          :disabled="state.selectedRowKeys.length === 0"
          @confirm="batchToggleStatus({ status: 0 })"
        >
          <a-button
            danger
            :disabled="state.selectedRowKeys.length === 0"
            >批量停用</a-button
          >
        </a-popconfirm> -->
        <a-button type="primary" :disabled="state.selectedRowKeys.length === 0"
          @click="remarkModalOpen = true">批量备注</a-button>
      </a-space>

      <a-pagination v-model:current="tableParams.pageNum" v-model:pageSize="tableParams.pageSize" :total="state.total"
        :default-page-size="50" show-size-changer show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`" class="mb-4 float-right"
        @change="getList" />

      <a-table :columns="DEFAULT_TABLE_COLUMN" :data-source="tableData" :loading="state.loading" stripe row-key="id"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
        :custom-row="record => ({ onDblclick: () => goDetail(record) })" :pagination="false"
        :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <div>{{ index + 1 + (tableParams.pageNum - 1) * tableParams.pageSize }}</div>
          </template>
          <template v-else-if="column.key === 'name'">
            <div class="w-50">{{ record.ruleName || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'category'">
            <a-tag color="success">{{ getCategoryLabel(record.categoryId) }}</a-tag>
          </template>
          <template v-else-if="column.key === 'averageCostPriceRange'">
            <span>[ {{ record.costPriceMin || '_' }}, {{ record.costPriceMax || '_' }} ]</span>
          </template>
          <template v-else-if="column.key === 'averageWeightRange'">
            <span>[ {{ record.weightMin || '_' }} , {{ record.weightMax || '_' }} ]</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch :checked="record.status" checked-children="启用" :checked-value="1" un-checked-children="停用"
              :un-checked-value="0" :loading="record.loading" size="default" @change="toggleStatus(record)" />
          </template>
          <template v-else-if="column.key === 'remark'">
            <div class="w-50">{{ record.remark || '--' }}</div>
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-space>
              <a-button type="link" :disabled="false && !record.id" @click="goDetail(record)">查看</a-button>
              <a-button type="link" :disabled="false && !record.id" @click="goEdit(record)">编辑</a-button>
              <a-button type="link" @click="openRemorkModal(record)">备注</a-button>
            </a-space>
          </template>
        </template>
      </a-table>

      <a-pagination v-model:current="tableParams.pageNum" v-model:pageSize="tableParams.pageSize" :total="state.total"
        :default-page-size="50" show-size-changer show-quick-jumper
        :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`" class="float-right" @change="getList" />
    </a-card>

    <!-- 备注弹窗 -->
    <a-modal title="添加备注" v-model:open="remarkModalOpen" width="30%" :confirm-loading="remarkLoading"
      :mask-closable="false" @cancel="remarkCancel" @ok="remarkOk">
      <a-textarea v-model:value="remark" :rows="4" :maxlength="255" show-count placeholder="请输入备注内容" class="mb-7" />
    </a-modal>
  </div>
</template>

<script setup>
  import { DEFAULT_TABLE_COLUMN } from './config'
  import { listApi, updateRuleStatusApi, updateRuleRemarkApi } from '../js/publication-rule-api'
  import { newCategoryTreeApi } from '@/pages/product-review/CommonDetail/api'
  import { message } from 'ant-design-vue'
  import { useReceiveMessage } from '@/utils/postMessage'

  const router = useRouter()

  /** search */
  const searchForm = reactive({
    ruleName: '',
    categoryId: [],
    status: 2
  })
  const searchFormRef = ref()
  // 状态选项
  const STATUS_OPTIONS = [
    { label: '全部', value: 2 },
    { label: '启用', value: 1 },
    { label: '停用', value: 0 }
  ]

  // 过滤选项
const filterOption = (inputValue, option) => {
  const label = option.categoryName; // 因为你的数据中有 categoryName 字段
  return label.toLowerCase().includes(inputValue.toLowerCase());
};

  function search() {
    tableParams.pageNum = 1
    getList()
  }

  function reset() {
    tableParams.pageNum = 1
    searchFormRef.value.resetFields()
    searchForm.ruleName = ''
    searchForm.categoryId = []

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
      ...searchForm
    }
    params.categoryId = params.categoryId.join(',')
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

  // 查询条件分类数据
  const commodityTypeList = ref([])

  /** 分类数据 */
  const flatTreeList = ref([])

  getOptions()
  function getOptions() {
    newCategoryTreeApi().then(res => {
      commodityTypeList.value = res.data || []
      const rawData = res.data || []
      const flatList = []

      // 遍历第一级
      for (const level1 of rawData) {
        // 遍历第二级
        for (const level2 of level1.children) {
          // 遍历第三级
          for (const level3 of level2.children) {
            // 将路径添加到结果数组
            const resLevel1 = { categoryName: level1.categoryName, descriptionCategoryId: level1.descriptionCategoryId }
            const resLevel2 = { categoryName: level2.categoryName, descriptionCategoryId: level2.descriptionCategoryId }
            const resLevel3 = { categoryName: level3.categoryName, descriptionCategoryId: level3.descriptionCategoryId }
            const valueArr = [resLevel1, resLevel2, resLevel3]
            const label = valueArr.map(item => item.categoryName).join(' / ')
            const uniqueCode = valueArr.map(item => item.descriptionCategoryId).join(',')

            flatList.push({ label, uniqueCode, value: valueArr })
          }
        }
      }
      console.log(flatList)
      flatTreeList.value = flatList
    })
  }

  // 获取分类 label
  function getCategoryLabel(categoryIds) {
    return flatTreeList.value.find(item => item.uniqueCode === categoryIds)?.label || '--'
  }

  /** 批量 启用/停用 */
  /* function batchToggleStatus({ status = 1 }) {
    return new Promise(resolve => {
      const params = {
        ruleId: state.selectedRowKeys.join(','),
        status
      }

      updateRuleStatusApi(params)
        .then(res => {
          message.success('批量修改状态成功')
          getList()
        })
        .finally(() => {
          resolve()
        })
    })
  } */

  /** 新增 */
  function add() {
    window.open('/platform/intelligent-publication/publication-rule-detail')
  }

  /** 查看详情 */
  function goDetail(record) {
    window.open(`/platform/intelligent-publication/publication-rule-detail?type=view&id=${record.id}`)
  }

  /** 编辑 */
  function goEdit(record) {
    window.open(`/platform/intelligent-publication/publication-rule-detail?type=edit&id=${record.id}`)
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
      ruleId: curId ? curId : state.selectedRowKeys.join(','),
      remark: remark.value
    }

    remarkLoading.value = true
    updateRuleRemarkApi(params)
      .then(res => {
        message.success('添加备注成功')
        getList()
        remarkCancel()
      })
      .finally(() => {
        remarkLoading.value = false
      })
  }

  /** 切换 status */
  function toggleStatus(record) {
    const params = {
      ruleId: record.id,
      status: record.status === 1 ? 0 : 1
    }

    record.loading = true
    updateRuleStatusApi(params)
      .then(res => {
        message.success('修改状态成功')
        getList()
      })
      .finally(() => {
        record.loading = false
      })
  }

  /** 监听编辑页保存后的跨窗口通信 */
  useReceiveMessage(getList)
</script>
