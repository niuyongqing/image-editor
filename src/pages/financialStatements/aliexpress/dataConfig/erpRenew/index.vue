<template>
  <div>
    <!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit">
      <template #formItemBox>
        <a-form-item label="月份" name="month">
          <a-range-picker picker="month" v-model:value="searchForm.month" :bordered="true" format="YYYYMM" value-format="YYYYMM"/>
        </a-form-item>

        <a-form-item label="店铺" name="shopName">
          <a-select v-model:value="searchForm.shopName"
                    :filter-option="false"
                    :option="shopNameOptions"
                    :not-found-content="shopNameModelLoading ? '加载中...' : '暂无数据'"
                    :loading="shopNameModelLoading"
                    @search="handleShopNameModelSearch"
                    show-search
                    allowClear
                    :maxTagCount="1"
                    placeholder="请输入业务模式"
          >
            <template #notFoundContent>
              <div v-if="shopNameModelLoading">
                <a-spin size="small" />
                <span style="margin-left: 8px">加载中...</span>
              </div>
              <div v-else>暂无数据</div>
            </template>

            <a-select-option v-for="option in shopNameOptions" :key="option.value" :value="option.label">
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
              placeholder="请输入操作人"
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
        <a-button type="primary" @click="importBtnModel = true"><upload-outlined />导入新增</a-button>
        <a-button type="primary" @click="exportList" :loading="exoprtBtnLoading"><VerticalAlignBottomOutlined />导出</a-button>
      </template>

      <template #bodyCell="{ column, record, index }">
        <div v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </div>
      </template>
      <!--      操作区-->
      <template #options="{ record, column }">
        <a-button type="text" danger @click="delItem(record)">删除</a-button>
      </template>
      <!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="searchForm.pageNum" v-model:pageSize="searchForm.pageSize" :total="tableTotal" @change="paginationChange"></pagination>
      </template>
    </app-table-box>



    <!--    编辑-->
    <importModel v-model:visible="importBtnModel" :resetSetMenu="resetSetMenu" @update:listData="getList"></importModel>
  </div>
</template>

<script setup>
/*                     EPR续费                  */

defineOptions({ name: 'erpRenew' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import { DeleteOutlined, UploadOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons-vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { eprList, userList, batchDelete, exportEprList } from "~/pages/financialStatements/aliexpress/dataConfig/erpRenew/js/api.js";
import tableHeader from '@/pages/financialStatements/aliexpress/dataConfig/erpRenew/js/tableHeader.js';
import download from "~/api/common/download.js";

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));
const importModel = defineAsyncComponent(() => import('@/pages/financialStatements/aliexpress/dataConfig/erpRenew/common/importModel.vue'));

const resetSetMenu = 'erpRenew';

//操作人
const searchTimeout = ref(null); //防抖定时器
const searchKeyword = ref(''); //储存输入的值
const userNameLoading = ref(false); //loading
const userNameOptions = ref([]); //搜索出来的数组

//店铺
const shopNameSearchTimeout = ref(null); //防抖定时器
const shopNameSearchKeyword = ref(''); //储存输入的值
const shopNameModelLoading = ref(false); //loading
const shopNameOptions = ref([]); //搜索出来的数组

const loadingConfig = ref({
  spinning: false,
  tip: '数据加载中，请稍候...',
  delay: 300,
})

const tableData = ref([]);
const selectedRowsArr = ref([]); //勾选的数据
const selectedRowKeys = ref([]);
const importBtnModel = ref(false);
const delBtnLoading = ref(false);
const exoprtBtnLoading = ref(false);

const tableTotal = ref(0);
const searchForm = reactive({
  pageNum: 1,
  pageSize: 50,
  prop: 'dataYearMonth',
  order: 'desc',
  shopName: null,
  userName: null,
  month: null,
  startMonth: '',
  endMonth: '',
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
      shopName: searchForm.shopName,
      userName: searchForm.userName,
      startTime: searchForm.startTime ? new Date(searchForm.startTime).getTime() : null,
      endTime: searchForm.endTime ? new Date(searchForm.endTime).getTime() : null,
      startMonth: searchForm.startMonth ,
      endMonth: searchForm.endMonth,
    }
    loadingConfig.value.spinning = true;
    let obj = await eprList(data)
    tableData.value = obj.data
    //获取列表里面的店铺名称 下拉框数据
    shopNameOptions.value = tableData.value.map(item => {
      return {
        label: item.shopName,
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

//费用项远程搜索
const handleShopNameModelSearch = (value) =>{
  searchForm.shopName = value;
  shopNameSearchKeyword.value = value;
  clearTimeout(shopNameSearchTimeout.value);
  shopNameSearchTimeout.value = setTimeout(() => {
    getList()
  }, 500);
}

//删除单个
const delItem = (row) => {
  batchDelete({ids: [row.id]}).then(res => {
    message.success(res.msg)
  }).finally(() => {
    getList()
  })
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

//导出
const exportList = () =>{
  if ( selectedRowsArr.value.length > 0 ){
    exoprtBtnLoading.value = true;
    exportEprList({ids: selectedRowsArr.value.map(item =>{ return item.id })}).then(res => {
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