<template>
  <div>
<!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit">
      <template #formItemBox>
        <a-form-item label="月份" name="month">
          <a-range-picker picker="month" v-model:value="searchForm.month" :bordered="true" format="YYYY-MM" value-format="YYYY-MM"/>
        </a-form-item>
        <a-form-item label="币种名称" name="currencyName">
          <a-select v-model:value="searchForm.currencyName"
                    :filter-option="false"
                    :option="currencyNameOptions"
                    :not-found-content="currencyNameSearNameLoading ? '加载中...' : '暂无数据'"
                    :loading="currencyNameSearNameLoading"
                    @search="handleCurrencyNameSearch"
                    show-search
                    allowClear
                    :maxTagCount="1"
                    placeholder="请输入店铺"
          >
            <template #notFoundContent>
              <div v-if="currencyNameSearNameLoading">
                <a-spin size="small" />
                <span style="margin-left: 8px">加载中...</span>
              </div>
              <div v-else>暂无数据</div>
            </template>

            <a-select-option v-for="option in currencyNameOptions" :key="option.value" :value="option.label">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="操作人" name="userName">
          <a-select
              v-model:value="searchForm.userName"
              show-search
              allow-clear
              :filter-option="false"
              :not-found-content="userNameLoading ? '加载中...' : '暂无数据'"
              :options="userNameOptions"
              :loading="userNameLoading"
              @search="handleSearch"
              placeholder="请输入关键词搜索"
          >
            <template #notFoundContent>
              <div v-if="userNameLoading">
                <a-spin size="small" />
                <span style="margin-left: 8px">加载中...</span>
              </div>
              <div v-else>暂无数据</div>
            </template>
          </a-select>
        </a-form-item>
      </template>

      <template #formItemRow>
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
<!--      按钮-->
      <template #leftTool>
        <a-button type="primary" danger @click="del" :loading="delBtnLoading"><DeleteOutlined />批量删除</a-button>
        <a-button type="primary" @click="importModel = true"><upload-outlined />导入新增</a-button>
        <a-button type="primary" @click="exportList" :loading="exoprtBtnLoading"><VerticalAlignBottomOutlined />导出</a-button>
      </template>

      <template #bodyCell="{ column, record, index }">
        <div v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </template>
<!--      操作区-->
      <template #options="{ record, column }">
        <a-button type="text" danger @click="itemDel(record)">删除</a-button>
      </template>
<!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="searchForm.pageNum" v-model:pageSize="searchForm.pageSize" :total="tableTotal" @change="paginationChange"></pagination>
      </template>
    </app-table-box>


<!--    导入新增弹框-->
    <ImportModal v-model:visible="importModel" @update:listData="getList"/>
  </div>
</template>

<script setup>
/*                     汇率管理                  */

defineOptions({ name: 'exchangeRateConfig' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { batchDelete, exportExchangeRate, infringementList, userList } from "~/pages/financialStatements/aliexpress/dataConfig/exchangeRateConfig/js/api.js";
import { UploadOutlined,VerticalAlignBottomOutlined,DeleteOutlined } from '@ant-design/icons-vue';
import tableHeader from '@/pages/financialStatements/aliexpress/dataConfig/exchangeRateConfig/js/tableHeader.js';
import download from "~/api/common/download.js";

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));
const ImportModal  = defineAsyncComponent(() => import('@/pages/financialStatements/aliexpress/dataConfig/exchangeRateConfig/common/importModel.vue'));

const resetSetMenu = 'exchangeRateConfig';

//操作人
const searchTimeout = ref(null); //防抖定时器
const searchKeyword = ref(''); //储存输入的值
const userNameLoading = ref(false); //loading
const userNameOptions = ref([]); //搜索出来的数组

//币种名称
const currencyNameSearchTimeout = ref(null); //防抖定时器
const currencyNameSearchKeyword = ref(''); //储存输入的值
const currencyNameSearNameLoading = ref(false); //loading
const currencyNameOptions = ref([]); //币种名称列表

const exoprtBtnLoading = ref(false);//导出按钮loading
const delBtnLoading = ref(false);//删除按钮Loading
const importModel = ref(false);//导入新增弹框
const loadingConfig = ref({
  spinning: false,
  tip: '数据加载中，请稍候...',
  delay: 300,
})
const tableData = ref([]);
const selectedRowsArr = ref([]); //勾选的数据
const selectedRowKeys = ref([]);

const tableTotal = ref(0);
const searchForm = reactive({
  pageNum: 1,
  pageSize: 50,
  prop: 'dataYearMonth',
  order: 'desc',
  month: null,
  startMonth: '',
  endMonth: '',
  currencyName: null,
  userName: null,
  time: null,
  startTime: '',
  endTime: '',
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
  searchForm.startTime = data.time?.[0] ?? ''
  searchForm.endTime =  data.time?.[1] ?? ''
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
      currencyName: searchForm.currencyName,
      userName: searchForm.userName,
      startTime: searchForm.startTime ? new Date(searchForm.startTime).getTime() : null,
      endTime: searchForm.endTime ? new Date(searchForm.endTime).getTime() : null,
      startMonth: searchForm.startMonth ? new Date ( searchForm.startMonth ).getTime () : null,
      endMonth: searchForm.endMonth ? new Date(searchForm.endMonth).getTime() : null,
    }
    loadingConfig.value.spinning = true;
    let obj = await infringementList(data)
    tableData.value = obj.data
    // 获取列表里面的币种名称 下拉框数据
    currencyNameOptions.value = tableData.value.map(item => {
      return {
        label: item.currencyName,
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
    userList({userName: searchKeyword.value}).then((res) => {
      userNameOptions.value = res.data.map((item) => {
        return {
          label: item.userName,
          value: item.userName,
        }
      });
    })
  }, 500);
}

//导出
const exportList = () =>{
  if ( selectedRowsArr.value.length > 0 ){
    exoprtBtnLoading.value = true;
    exportExchangeRate({ids: selectedRowsArr.value.map(item =>{ return item.id })}).then(res => {
      download.name(res.data);
      message.success(res.msg)
    }).finally(() => {
      exoprtBtnLoading.value = false;
      getList()
    })
  }
  else {
    message.error('请先选择列表数据导出')
  }
}

//批量删除
const del = () =>{
  if ( selectedRowsArr.value.length > 0 ){
    delBtnLoading.value = true;
    batchDelete({ids: selectedRowsArr.value.map(item =>{ return item.id })}).then(res => {
      message.success(res.msg)
    }).finally(() => {
      delBtnLoading.value = false;
      getList()
    })
  }
  else {
    message.error('请先选择列表数据删除')
  }
}

//单个删除
const itemDel = (row) =>{
  batchDelete({ids: [row.id]}).then(res => {
    message.success(res.msg)
  }).finally(() => {
    getList()
  })
}

//币种名称搜索事件
const handleCurrencyNameSearch = (value) =>{
  searchForm.currencyName = value;
  currencyNameSearchKeyword.value = value;
  clearTimeout(currencyNameSearchTimeout.value);
  currencyNameSearchTimeout.value = setTimeout(() => {
    getList()
  }, 500);
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