<template>
  <div id="setOperationalGoals_index">
    <appTableForm 
    v-model:formData="formData" 
    @onSubmit="onSubmit"
    @formHeightChange="formHeightChange" 
    resetSetMenu="serialNumberManagement"
    label-width="100"
  >
    <template #formItemBox>
      <a-form-item 
        label="年份" 
        name="year"
      >
        <a-date-picker 
          v-model:value="formData.year" 
          picker="year" 
          value-format="YYYY"
        />
      </a-form-item>
      <a-form-item label="月份" name="month">
        <a-select
          v-model:value="formData.month"
          :options="options.monthList"
          placeholder="请选择月份"
          allowClear
          @change="getVersionList"
        ></a-select>
      </a-form-item>
      <a-form-item label="部门" name="departments">
        <a-select 
          v-model:value="formData.departments" 
          show-search
          :options="options.departmentList" 
          :optionFilterProp="'label'"  
          :filterOption="userFilterOption"  
          placeholder="请选择部门" 
          allowClear
        ></a-select>
      </a-form-item>
      <a-form-item label="组" name="groups">
        <a-select 
          v-model:value="formData.groups" 
          show-search
          :options="options.groupList" 
          :optionFilterProp="'label'"  
          :filterOption="userFilterOption"  
          placeholder="请选择组" 
          allowClear
        ></a-select>
      </a-form-item>
      <a-form-item label="运营" name="shopUserName">
        <a-select
          v-model:value="formData.shopUserName"
          style="width: 100%" 
          placeholder="请输入关键字"
          :options="options.shopUserNameList"
        ></a-select>
      </a-form-item>
      <a-form-item label="流水号" name="serialNumber">
        <a-select
          v-model:value="formData.serialNumber"
          :options="options.serialNumberList"
          placeholder="请选择流水号"
          allowClear
        ></a-select>
      </a-form-item>
    </template>
  </appTableForm>
  <appTableBox 
    :table-header="setOperationalGoals_header" 
    :data-source="setOperationalGoals.data"
    reset-set-menu="setOperationalGoals" 
    :scroll="{y: tableScrollHeihth, x: 1800}"
    :loading="tableLoading"
  >
    <!-- <template #bodyCell="{ column: { key }, record: row }">


    </template> -->
    <template #leftTool>
      <a-button type="primary" >导入新增</a-button>
      <a-button type="primary" >新增</a-button>
      <a-button type="primary" danger >删除</a-button>
    </template>
    <!-- 操作区 -->
    <template #options="{ record, column }">
      <a-button type="link">编辑</a-button>
      <a-button type="link">删除</a-button>
      <a-button type="text">日志</a-button>
    </template>
    <template #pagination>
      <app-table-pagination
        v-model:current="setOperationalGoals.tableParams.pageNum"
        v-model:page-size="setOperationalGoals.tableParams.pageSize"
        :total="setOperationalGoals.total"
        @pageNumChange="pageNumChange"
        @pageSizeChange="pageSizeChange"
      ></app-table-pagination>
    </template>
  </appTableBox>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { monthList } from '~@/pages/financialStatements/common/data';
import { setOperationalGoals_header } from './js/tableHeader';
import { dictList,versionList } from './js/api';

defineOptions({ name: "setOperationalGoals_index" })

const tableLoading = ref(false);
const setOperationalGoals = reactive({
  data: [],
  total: 0,
  tableParams: {
    "pageNum": 1,
    "pageSize": 20,
    "order": "DESC",
    "prop": "create_time"
  }
});
const formData = reactive({
  year: dayjs(),
  month: dayjs().format('MMMM'),
  departments: [],
  groups: [],
  shopUserName: '',
  serialNumber: '',
});
const options = reactive({
  monthList,  // 月
  departmentList: [], // 部门列表
  groupList: [], // 组列表
  serialNumberList: [], // 流水号列表
  shopUserNameList: [], // 运营列表
})

const formHeight = ref(0);
const tableScrollHeihth = computed(() => {
  return ((window.innerHeight * 0.96) - 20 - 24 - 24 - 8 - 40 - 56 - formHeight.value);
});


function userFilterOption(val, option) {
  // 将输入值和选项的 label（姓名）都转为小写，实现不区分大小写的模糊匹配
  return option.label.toLowerCase().includes(val.toLowerCase());
}

function onSubmit(val) {
  console.log(val)
}

function formHeightChange(height) {
  formHeight.value = height;
}

// 分页器页数变化
function pageNumChange(val) {
  setOperationalGoals.tableParams.pageNum = val;
}
// 分页器每页条数变化
function pageSizeChange(val) {
  setOperationalGoals.tableParams.pageSize = val;
  pageNumChange(1);
}

async function getCommonDictList() {
  try {
    // 使用 Promise.all 并发请求三个字典数据
    const [departmentRes, groupRes, marketerRes] = await Promise.all([
      dictList('dict_department'),
      dictList('dict_group'),
      dictList('dict_marketer')
    ]);

    // 统一处理响应结果
    if (departmentRes.code === 200) {
      options.departmentList = departmentRes.data.map(item => ({
        label: item.itemName,
        value: item.itemValue,
      }));
    }

    if (groupRes.code === 200) {
      options.groupList = groupRes.data.map(item => ({
        label: item.itemName,
        value: item.itemValue,
      }));
    }

    if (marketerRes.code === 200) {
      options.shopUserNameList = marketerRes.data.map(item => ({
        label: item.itemName,
        value: item.itemValue,
      }));
    }
  } catch (error) {
    console.error('获取字典数据失败:', error);
    // 可以在这里添加错误处理逻辑，如重试机制或用户提示
  }
}

function getVersionList() {
  console.log({formData})
  let params = {
    dataYear: dayjs(formData.year).year(),
    dataMonth: dayjs(formData.month).month() + 1
  };
  versionList(params).then(res => {
    if (res.code === 200) {
      options.serialNumberList = res.data.map(item => ({
        label: item.version,
        value: item.version,
      }));
    }
  })
}

onMounted(() => {
  getCommonDictList();
  getVersionList();
});
</script>
<style lang="less" scoped></style>