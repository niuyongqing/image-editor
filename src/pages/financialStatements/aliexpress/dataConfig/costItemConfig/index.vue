<template>
  <div>
<!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit">
      <template #formItemBox>
        <a-form-item label="费用项" name="costItem">
          <a-select v-model:value="searchForm.costItem"
                    :filter-option="false"
                    :option="costItemOptions"
                    :not-found-content="costItemLoading ? '加载中...' : '暂无数据'"
                    :loading="costItemLoading"
                    @search="handleCostItemSearch"
                    show-search
                    allowClear
                    :maxTagCount="1"
                    placeholder="请输入店铺"
          >
            <template #notFoundContent>
              <div v-if="costItemLoading">
                <a-spin size="small" />
                <span style="margin-left: 8px">加载中...</span>
              </div>
              <div v-else>暂无数据</div>
            </template>

            <a-select-option v-for="option in costItemOptions" :key="option.value" :value="option.label">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="费用类型" name="costType">
          <a-select v-model:value="searchForm.costType"
                    :filter-option="false"
                    :option="costTypeOptions"
                    :not-found-content="costTypeLoading ? '加载中...' : '暂无数据'"
                    :loading="costTypeLoading"
                    @search="handleCostTypeSearch"
                    show-search
                    allowClear
                    :maxTagCount="1"
                    placeholder="请输入店铺"
          >
            <template #notFoundContent>
              <div v-if="costTypeLoading">
                <a-spin size="small" />
                <span style="margin-left: 8px">加载中...</span>
              </div>
              <div v-else>暂无数据</div>
            </template>

            <a-select-option v-for="option in costTypeOptions" :key="option.value" :value="option.label">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="业务模式" name="businessModel">
          <a-select v-model:value="searchForm.businessModel"
                    :filter-option="false"
                    :option="businessModelOptions"
                    :not-found-content="businessModelLoading ? '加载中...' : '暂无数据'"
                    :loading="businessModelLoading"
                    @search="handleBusinessModelSearch"
                    show-search
                    allowClear
                    :maxTagCount="1"
                    placeholder="请输入店铺"
          >
            <template #notFoundContent>
              <div v-if="businessModelLoading">
                <a-spin size="small" />
                <span style="margin-left: 8px">加载中...</span>
              </div>
              <div v-else>暂无数据</div>
            </template>

            <a-select-option v-for="option in businessModelOptions" :key="option.value" :value="option.label">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

      </template>

      <template #formItemRow>
        <a-form-item label="操作人" name="operator">
          <a-select
              v-model:value="searchForm.operator"
              show-search
              allow-clear
              :filter-option="false"
              :not-found-content="operatorLoading ? '加载中...' : '暂无数据'"
              :options="operatorOptions"
              :loading="operatorLoading"
              @search="handleSearch"
              placeholder="请输入关键词搜索"
          >
            <template #notFoundContent>
              <div v-if="operatorLoading">
                <a-spin size="small" />
                <span style="margin-left: 8px">加载中...</span>
              </div>
              <div v-else>暂无数据</div>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="操作时间" name="time">
          <a-range-picker v-model:value="searchForm.time" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" show-time/>
        </a-form-item>
      </template>
    </app-table-form>

<!--    表格区域-->
    <app-table-box
        :reset-set-menu="resetSetMenu"
        :table-header="tableHeader"
        :data-source="tableData"
        :scroll="{x: 1800,y: tableHeight}" row-key="id"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="tableDataChange"
        :loading="loadingConfig"
    >
      <template #bodyCell="{ column, record, index }">
        <div v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </template>
<!--      操作区-->
      <template #options="{ record, column }">
        <a-button type="primary" @click="editItem(record)">编辑</a-button>
      </template>
<!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="searchForm.pageNum" v-model:pageSize="searchForm.pageSize" :total="tableTotal" @change="paginationChange"></pagination>
      </template>
    </app-table-box>



<!--    编辑-->
    <editCostItem v-model:visible="editCostItemModel" :resetSetMenu="resetSetMenu" :itemId="itemId" @update:listData="getList"></editCostItem>
  </div>
</template>

<script setup>
/*                     费用项管理                  */

defineOptions({ name: 'costItemConfig' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { costItemList, userList } from "~/pages/financialStatements/aliexpress/dataConfig/costItemConfig/js/api.js";
import tableHeader from '@/pages/financialStatements/aliexpress/dataConfig/costItemConfig/js/tableHeader.js';

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));
const editCostItem = defineAsyncComponent(() => import('@/pages/financialStatements/aliexpress/dataConfig/costItemConfig/common/editCostItem.vue'));

const resetSetMenu = 'costItemConfig';

//操作人
const searchTimeout = ref(null); //防抖定时器
const searchKeyword = ref(''); //储存输入的值
const operatorLoading = ref(false); //loading
const operatorOptions = ref([]); //搜索出来的数组

//费用项
const costItemSearchTimeout = ref(null); //防抖定时器
const costItemSearchKeyword = ref(''); //储存输入的值
const costItemLoading = ref(false); //loading
const costItemOptions = ref([]); //搜索出来的数组

//费用类型
const costTypeSearchTimeout = ref(null); //防抖定时器
const costTypeSearchKeyword = ref(''); //储存输入的值
const costTypeLoading = ref(false); //loading
const costTypeOptions = ref([]); //搜索出来的数组

//业务模式
const businessModelSearchTimeout = ref(null); //防抖定时器
const businessModelSearchKeyword = ref(''); //储存输入的值
const businessModelLoading = ref(false); //loading
const businessModelOptions = ref([]); //搜索出来的数组

const loadingConfig = ref({
  spinning: false,
  tip: '数据加载中，请稍候...',
  delay: 300,
})
const editCostItemModel = ref(false);
const tableData = ref([]);
const selectedRowsArr = ref([]); //勾选的数据
const selectedRowKeys = ref([]);
let itemId = '';

const tableTotal = ref(0);
const searchForm = reactive({
  pageNum: 1,
  pageSize: 50,
  prop: 'createTime',
  order: 'desc',
  costItem: null,
  costType: null,
  businessModel: null,
  currencyName: null,
  operator: null,
  time: null,
  operateTimeBegin: '',
  operateTimeEnd: '',
});

onMounted(() => {
  getList()
});

//进入页面计算表格高度
const tableHeight = computed(() => {
  return window.innerHeight - 330
})

//表格排序操作
const tableDataChange = (pagination, filters, sorter) => {
  if ( !sorter ){
    return false;
  }
  console.log(sorter);
};

//查询回调
const onSubmit = (data) => {
  searchForm.pageNum = 1
  searchForm.pageSize = 50;
  searchForm.operateTimeBegin = data.time?.[0] ?? ''
  searchForm.operateTimeEnd =  data.time?.[1] ?? ''
  searchForm.startMonth = data.month?.[0] ?? ''
  searchForm.endMonth =  data.month?.[1] ?? ''
  getList()
};

//获取列表
const getList = async () =>{
  try {
    let data = {
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize,
      prop: searchForm.prop,
      order: searchForm.order,
      costItem: searchForm.costItem,
      costType: searchForm.costType,
      businessModel: searchForm.businessModel,
      operator: searchForm.operator,
      operateTimeBegin: searchForm.operateTimeBegin ? new Date(searchForm.operateTimeBegin).getTime() : null,
      operateTimeEnd: searchForm.operateTimeEnd ? new Date(searchForm.operateTimeEnd).getTime() : null,
    }
    loadingConfig.value.spinning = true;
    let obj = await costItemList(data)
    tableData.value = obj.data
    //获取列表里面的费用项名称 下拉框数据
    costItemOptions.value = tableData.value.map(item => {
      return {
        label: item.costItem,
        value: item.id,
      }
    })
    //获取列表里面的费用类型名称 下拉框数据
    costTypeOptions.value = tableData.value.map(item => {
      return {
        label: item.costType,
        value: item.id,
      }
    })
    //获取列表里面的业务模式名称 下拉框数据
    businessModelOptions.value = tableData.value.map(item => {
      return {
        label: item.businessModel,
        value: item.id,
      }
    })
    tableTotal.value = obj.total
  }
  catch (error) {
    message.error('获取数据失败，请重试')
  } finally {
    loadingConfig.value.spinning = false;
    selectedRowsArr.value = []
    selectedRowKeys.value = []
  }
}

//操作人远程搜索
const handleSearch = (value) =>{
  searchKeyword.value = value;
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    userList({operator: searchKeyword.value}).then((res) => {
      operatorOptions.value = res.data.map((item) => {
        return {
          label: item.userName,
          value: item.userName,
        }
      });
    })
  }, 500);
}

//费用项远程搜索
const handleCostItemSearch = (value) =>{
  searchForm.costItem = value;
  costItemSearchKeyword.value = value;
  clearTimeout(costItemSearchTimeout.value);
  costItemSearchTimeout.value = setTimeout(() => {
    getList()
  }, 500);
}

//费用类型远程搜索
const handleCostTypeSearch = (value) =>{
  searchForm.costType = value;
  costTypeSearchKeyword.value = value;
  clearTimeout(costTypeSearchTimeout.value);
  costTypeSearchTimeout.value = setTimeout(() => {
    getList()
  }, 500);
}

//业务模式远程搜索
const handleBusinessModelSearch = (value) =>{
  searchForm.businessModel = value;
  businessModelSearchKeyword.value = value;
  clearTimeout(businessModelSearchTimeout.value);
  businessModelSearchTimeout.value = setTimeout(() => {
    getList()
  }, 500);
}

//编辑
const editItem = (data) => {
  itemId = data.id;
  editCostItemModel.value = true;
}
const onSelectChange = (selectedKeys, selectedRows) =>{
  selectedRowKeys.value = selectedKeys;
  selectedRowsArr.value = selectedRows;
}

//页数回调
const paginationChange = (val) =>{
  searchForm.pageNum = val.validPage;
  searchForm.pageSize = val.pageSize;
  getList()
}

</script>

<style lang="less" scoped>

</style>