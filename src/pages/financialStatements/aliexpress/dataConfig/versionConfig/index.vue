<template>
  <div>
<!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" :rules="searchRules" @onSubmit="onSubmit">
      <template #formItemBox>
        <a-form-item label="版本月份" name="month">
          <a-range-picker v-model:value="searchForm.month" :bordered="true" format="YYYY-MM" value-format="YYYY-MM"/>
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="searchForm.status" :options="statusOptions" placeholder="请选择状态" allowClear></a-select>
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
        <a-form-item label="操作时间" name="updateTime">
          <a-range-picker v-model:value="searchForm.updateTime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" :default-time="['T00:00:00.000Z', 'T23:59:59.000Z']"/>
        </a-form-item>
      </template>
    </app-table-form>

<!--    表格区域-->
    <app-table-box
        :reset-set-menu="resetSetMenu"
        :table-header="tableHeader"
        :data-source="tableData"
        row-key="id"
        :scroll="{x: 1800,y: tableHeight}"
        @change="tableDataChange"
        :loading="loadingConfig"
    >
      <template #bodyCell="{ column, record, index }">
        <div v-if="column.dataIndex === 'status'">
          <div v-if="record.status === 1" flex flex-between flex-center><div class="ver-true"></div><div>使用版本</div></div>
          <div v-if="record.status === 0" flex flex-between flex-center><div class="ver-false"></div><div>历史版本</div></div>
        </div>
      </template>
<!--      操作区-->
      <template #options="{ record, column }">
        <a-button type="link">回溯版本</a-button>
        <a-button type="link" @click="editSealingTimeModel = true">更改封账时间</a-button>
      </template>
<!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="tableParms.pageNum" v-model:pageSize="tableParms.pageSize" :total="tableParms.total" @change="paginationChange"></pagination>
      </template>
    </app-table-box>



<!--    更改封账时间-->
    <editSealingTime v-model:visible="editSealingTimeModel"></editSealingTime>
  </div>
</template>

<script setup>
/*                     版本管理                  */
defineOptions({ name: 'versionConfig' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import { userList, versionList } from "~/pages/financialStatements/aliexpress/dataConfig/versionConfig/js/api.js";
import tableHeader from '@/pages/financialStatements/aliexpress/dataConfig/versionConfig/js/tableHeader.js';
import { message } from "ant-design-vue";

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));
const editSealingTime = defineAsyncComponent(() => import('@/pages/financialStatements/aliexpress/dataConfig/versionConfig/common/editSealingTime.vue'));

const resetSetMenu = 'versionConfig';
//操作人
const searchTimeout = ref(null); //防抖定时器
const searchKeyword = ref(''); //储存输入的值
const userNameLoading = ref(false); //loading
const userNameOptions = ref([]); //搜索出来的数组

//更改封账时间 弹框
const editSealingTimeModel = ref(false);

//表格数据
const tableData = ref([]);

//表格loading配置
const loadingConfig = ref({
  spinning: false,
  tip: '数据加载中，请稍候...',
  delay: 300,
})

//状态选择框
const statusOptions = [
    {
      label: "使用版本",
      value: 1
    },
    {
      label: "历史版本",
      value: 0
    }
]

//搜索校验
const searchRules = {
  month: [
    {
      required: true,
      message: '请选择月份',
      trigger: 'change',
    },
  ],
};

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
  status: null,
  userName: null,
  updateTime: null,
  updateTimeStart: '',
  updateTimeEnd: '',
});

onMounted(() => {
  getVersionList()
});

//获取列表
const getVersionList = async () =>{
  try {
    let data = {
      pageNum: searchForm.pageNum,
      pageSize: searchForm.pageSize,
      startMonth: searchForm.startMonth,
      endMonth: searchForm.endMonth,
      status: searchForm.status,
      userName: searchForm.userName,
      updateTimeStart: searchForm.updateTimeStart,
      updateTimeEnd: searchForm.updateTimeEnd,
    }
    loadingConfig.spinning = true;
    let obj = await versionList(data)
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

//进入页面计算表格高度
const tableHeight = computed(() => {
  return window.innerHeight - 360
})

//查询回调
const onSubmit = (data) => {
  searchForm.pageNum = 1
  searchForm.pageSize = 50;
  tableParms.pageNum = 1
  tableParms.pageSize = 50;
  searchForm.updateTimeStart = data.updateTime?.[0] ?? ''
  searchForm.updateTimeEnd =  data.updateTime?.[1] ?? ''
  searchForm.startMonth = data.month?.[0] ?? ''
  searchForm.endMonth =  data.month?.[1] ?? ''
  getVersionList(searchForm)
};

//表格排序操作
const tableDataChange = (pagination, filters, sorter) => {
  console.log(sorter);
};

//页数回调
const paginationChange = (val) =>{
  searchForm.pageNum = val.validPage;
  searchForm.pageSize = val.pageSize;
  getVersionList()
}

</script>

<style lang="less" scoped>
.ver-true{
  width: 8px;
  height: 8px;
  background-color: green;
  border-radius: 50%;
  margin-right: 10px
}
.ver-false{
  width: 8px;
  height: 8px;
  background-color: gray;
  border-radius: 50%;
  margin-right: 10px
}
</style>