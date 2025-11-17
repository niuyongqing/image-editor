<template>
<div id="serialNumberManagement_index" class="serialNumberManagement_index">
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
        :rules="[{ required: true, message: '请输入年份!' }]"
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
          placeholder="请输入月份"
          allowClear
        ></a-select>
      </a-form-item>
      <a-form-item label="流水号" name="version">
        <a-input 
          v-model:value="formData.version" 
          placeholder="请输入流水号"
          allowClear
        ></a-input>
      </a-form-item>
      <a-form-item label="创建人" name="createUserId">
        <a-select 
          v-model:value="formData.createUserId" 
          show-search
          :options="options.allUserList" 
          :optionFilterProp="'label'"  
          :filterOption="userFilterOption"  
          placeholder="请选择创建人" 
          allowClear
        ></a-select>
      </a-form-item>
      <a-form-item label="创建时间" name="createTime">
        <a-range-picker
          v-model:value="formData.createTime"
          :presets="options.rangeOptions"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </a-form-item>
    </template>
  </appTableForm>
  <appTableBox 
    :table-header="serialNumberManagement_header" 
    :data-source="serialNumber.data"
    reset-set-menu="serialNumberManagement" 
    :scroll="{y: tableScrollHeihth, x: 1800}"
    :loading="tableLoading"
  >
    <template #bodyCell="{ column: { key }, record: row }">
      <template v-if="key === 'dictType'">
        {{ row.dictName }}
      </template>
      <template v-else-if="key === 'status'">
        <a-switch 
          v-model:checked="row.status" 
          checked-children="已启用" 
          un-checked-children="已停用" 
          :checkedValue="'enabled'"
          :unCheckedValue="'disabled'"
          @change="(checked, event) => statusChange(checked, row)"
        />
      </template>
    </template>
    <template #leftTool>
      <a-button type="primary" @click="createModalOpen = !createModalOpen">手动生成</a-button>
    </template>
    <template #pagination>
      <app-table-pagination
        v-model:current="serialNumber.tableParams.pageNum"
        v-model:page-size="serialNumber.tableParams.pageSize"
        :total="serialNumber.total"
        @pageNumChange="pageNumChange"
        @pageSizeChange="pageSizeChange"
      ></app-table-pagination>
    </template>
  </appTableBox>
  <create-modal v-model:open="createModalOpen" :options="options"></create-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { serialNumberManagement_header } from './js/tableHeader'
import { typeList, userList } from './js/api';
import dayjs from 'dayjs';
import createModal from './components/createModal.vue';
defineOptions({ name: "serialNumberManagement_index" })
const { proxy: _this } = getCurrentInstance()

const serialNumber = reactive({
  data: [],
  total: 0,
  tableParams: {
    "pageNum": 1,
    "pageSize": 20,
    "order": "DESC",
    "prop": "create_time"
  }
});
const tableLoading = ref(false);
const createModalOpen = ref(false);
const formData = reactive({
  year: dayjs(),
  month: undefined,
  version: undefined,
  createTime: [undefined, undefined],
  createUserId: undefined,
  createTimeStart: '',
  createTimeEnd: '',
});
const formParams = {};
const options = reactive({
  monthList: [],              // 月
  allUserList: [],            // 人员列表
  rangeOptions: [
    {
      label: '近一周',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: '近一个月',
      value: [dayjs().add(-1, 'M'), dayjs()],
    },
    {
      label: '近三个月',
      value: [dayjs().add(-3, 'M'), dayjs()],
    },
  ],
})
options.monthList = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString().padStart(2, '0'),
  label: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][i]
}));
const formHeight = ref(0);
const innerHeight = computed(() => {
  return (window.innerHeight * 0.95) + 'px';
});
const tableScrollHeihth = computed(() => {
  return ((window.innerHeight * 0.96) - 20 - 24 - 24 - 8 - 40 - 56 - formHeight.value);
});
onMounted(() => {
  getUserList()
  onSubmit()
})
function formHeightChange(val) {
  formHeight.value = val;
}
function userFilterOption(val, option) {
  // 将输入值和选项的 label（姓名）都转为小写，实现不区分大小写的模糊匹配
  return option.label.toLowerCase().includes(val.toLowerCase());
}
// 获取人员列表
async function getUserList() {
  options.allUserList = [];
  try {
    let params = {
      deptId: "",
      userName: '',
    };
    let res = await userList(params);
    options.allUserList = res.data.map(i => {
      return {
        label: i.userName,
        value: i.userId
      }
    })
  } catch (error) {
    console.error(error);
  }
}
// 分页器页数变化
function pageNumChange(val) {
  serialNumber.tableParams.pageNum = val;
  getTypeList();
}
// 分页器每页条数变化
function pageSizeChange(val) {
  serialNumber.tableParams.pageSize = val;
  pageNumChange(1);
}
// 点击搜索
function onSubmit(val) {
  Object.assign(formParams, formData);
  let createTime = formData.createTime || [];
  if (createTime[0] && createTime[1]) {
    formParams.createTimeStart = `${createTime[0]} 00:00:00`
    formParams.createTimeEnd = `${createTime[1]} 23:59:59`  
  }
  delete formParams.createTime;
  pageNumChange(1);
}
// 获取字典数据
async function getTypeList(val) {
  let params = {
    ...formParams,
    "pageNum": serialNumber.tableParams.pageNum,
    "pageSize": serialNumber.tableParams.pageSize,
    "order": "DESC",
    "prop": "create_time"
  };
  tableLoading.value = true;
  try {
    let res = await typeList(params);
    let data = res.data;
    data.map((item, index) => {
      item.rowIndex = index + 1;
      // item.dictName = serialNumber.itemList.find(i => i.dictType === item.dictType).dictName;
      // item.statusType = (item.status === 'enabled');
    });
    serialNumber.total = res.total;
    serialNumber.data = data;
  } catch (error) {
    console.error(error);
  }
  tableLoading.value = false;
}
</script>
<style lang="less" scoped>

</style>