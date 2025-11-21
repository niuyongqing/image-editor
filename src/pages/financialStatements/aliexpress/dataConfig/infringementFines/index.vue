<template>
  <div>
<!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit">
      <template #formItemBox>
        <a-form-item label="月份" name="month">
          <a-range-picker v-model:value="searchForm.month" :bordered="true" format="YYYY-MM" value-format="YYYY-MM"/>
        </a-form-item>
        <a-form-item label="店铺" name="simpleName">
          <a-select v-model:value="searchForm.simpleName" mode="multiple" show-search :filter-option="simpleNameFilterOption" allowClear :maxTagCount="1" placeholder="请输入店铺">
            <a-select-option v-for="shop in shopOptions" :key="shop.value" :value="shop.value" :label="shop.label">
              {{ shop.label }}
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
        <a-button type="primary" danger><DeleteOutlined />批量删除</a-button>
        <a-button type="primary" @click="importModel = true"><upload-outlined />导入新增</a-button>
        <a-button type="primary"><VerticalAlignBottomOutlined />导出</a-button>
      </template>

      <template #bodyCell="{ column, record, index }">
        <div v-if="column.dataIndex === 'netProfit'">
          {{ timeFormats.full(record.netProfit) }}
        </div>
      </template>
<!--      操作区-->
      <template #options="{ record, column }">
        <a-button type="text" danger>删除</a-button>
      </template>
<!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="tableParms.pageNum" v-model:pageSize="tableParms.pageSize" :total="tableParms.total" @change="paginationChange"></pagination>
      </template>
    </app-table-box>


<!--    导入新增弹框-->
    <ImportModal v-model:visible="importModel"/>
  </div>
</template>

<script setup>
/*                     侵权罚款                  */

defineOptions({ name: 'infringementFines' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import { message } from "ant-design-vue";
import {
  dictList,
  infringementList,
  userList
} from "~/pages/financialStatements/aliexpress/dataConfig/infringementFines/js/api.js";
import { UploadOutlined,VerticalAlignBottomOutlined,DeleteOutlined } from '@ant-design/icons-vue';
import { timeFormats } from "~/utils/dateUtils.js";
import tableHeader from '@/pages/financialStatements/aliexpress/dataConfig/infringementFines/js/tableHeader.js';

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));
const ImportModal  = defineAsyncComponent(() => import('@/pages/financialStatements/aliexpress/dataConfig/infringementFines/common/importModel.vue'));

const resetSetMenu = 'infringementFines';

//操作人
const searchTimeout = ref(null); //防抖定时器
const searchKeyword = ref(''); //储存输入的值
const userNameLoading = ref(false); //loading
const userNameOptions = ref([]); //搜索出来的数组

const importModel = ref(false);//导入新增弹框
const loadingConfig = ref({
  spinning: false,
  tip: '数据加载中，请稍候...',
  delay: 300,
})
const tableData = ref([]);
const selectedRowsArr = ref([]); //勾选的数据
const shopOptions = ref([]); //店铺列表
const selectedRowKeys = ref([]);

const tableParms = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const searchForm = reactive({
  pageNum: 1,
  pageSize: 50,
  month: null,
  startMonth: '',
  endMonth: '',
  simpleName: [],
  userName: null,
  time: null,
  startTime: '',
  endTime: '',
});

onMounted(() => {
  getDictList()
  getList()
});

//进入页面计算表格高度
const tableHeight = computed(() => {
  return window.innerHeight - 320
})

//查询回调
const onSubmit = (data) => {
  searchForm.pageNum = 1
  searchForm.pageSize = 50;
  tableParms.pageNum = 1
  tableParms.pageSize = 50;
  searchForm.startTime = data.time?.[0] ?? ''
  searchForm.endTime =  data.time?.[1] ?? ''
  searchForm.startMonth = data.month?.[0] ?? ''
  searchForm.endMonth =  data.month?.[1] ?? ''
  getList()
};

//表格排序操作
const tableDataChange = (pagination, filters, sorter) => {
  if ( !sorter ){
    return false;
  }
  console.log(sorter);
};

//页数回调
const paginationChange = (val) =>{
  searchForm.pageNum = val.validPage;
  searchForm.pageSize = val.pageSize;
  getList()
}

//获取店铺列表
const getDictList = async () =>{
  try {
    let obj = await dictList()
    shopOptions.value = obj.data.map(item => {
      return {
        label: item.itemValue,
        value: item.itemId,
      }
    });
  }
  catch (error) {
    message.error('获取数据失败，请重试')
  }
}

//获取列表
const getList = async () =>{
  try {
    let data = {
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize,
      startMonth: searchForm.startTime,
      endMonth: searchForm.endTime,
      simpleName: searchForm.simpleName,
      userName: searchForm.userName,
      startTime: searchForm.startTime,
      endTime: searchForm.endTime,
    }
    loadingConfig.spinning = true;
    let obj = await infringementList(data)
    tableData.value = obj.data
    tableParms.total = obj.total
  }
  catch (error) {
    message.error('获取数据失败，请重试')
  } finally {
    loadingConfig.spinning = true;
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

//店铺搜索事件
const simpleNameFilterOption = (input, option) =>{
  return option.label.toLowerCase().includes(input.toLowerCase());
}

const onSelectChange = (selectedKeys, selectedRows) =>{
  selectedRowKeys.value = selectedKeys;
  selectedRowsArr.value = selectedRows;
}

</script>

<style lang="less" scoped>

</style>