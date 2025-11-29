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
        name="dataYear" 
        :rules="[{ required: true, message: '请输入年份!' }]"
      >
        <a-date-picker 
          v-model:value="formData.dataYear" 
          picker="year" 
          value-format="YYYY"
        />
      </a-form-item>
      <a-form-item label="月份" name="dataMonth">
        <a-select
          v-model:value="formData.dataMonth"
          :options="options.monthList"
          placeholder="请输入月份"
          allowClear
        ></a-select>
      </a-form-item>
      <!-- <a-form-item label="流水号" name="serialNumber">
        <a-input 
          v-model:value="formData.serialNumber" 
          placeholder="请输入流水号"
          allowClear
        ></a-input>
      </a-form-item> -->
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
    rowKey="id"
  >
    <template #bodyCell="{ column: { key }, record: row }">
      <template v-if="key === 'dictType'">
        {{ row.dictName }}
      </template>
      <template v-if="key === 'status'">
        <a-tag color="success" v-if="row.status === 'finished'">已完成</a-tag>
        <a-tag color="processing" v-else>计算中</a-tag>
      </template>
      <template v-if="key === 'createTime'">
        {{ dayjs(row[key]).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template v-else-if="key === 'accept'">
        <a-switch 
          v-model:checked="row.accept" 
          checked-children="是" 
          un-checked-children="否" 
          @change="(checked, event) => acceptChange(checked, row)"
          :disabled="row.status === 'running' || row.disabledSwitch"
        />
      </template>
      <template v-else-if="['sfdghsdfhdfs','serfhgsdfgds','rdtjfsafsdgf','rtjdvsdfds','hujlkhfdgsdgf','sdfhsdfasfasf','adrfghdfsads',].includes(key)">
        <a-button type="link" @click="viewReport(row, key)">查看</a-button>
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
  <create-modal 
    v-model:open="createModalOpen" 
    :options="options"
    @save="getVersionList"
  ></create-modal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
import { serialNumberManagement_header } from './js/tableHeader';
import { versionList, userList, acceptVersion } from './js/api';
import dayjs from 'dayjs';
import { monthList } from '~@/pages/financialStatements/common/data';
import createModal from './components/createModal.vue';
defineOptions({ name: "serialNumberManagement_index" });
const { proxy: _this } = getCurrentInstance();

const serialNumber = reactive({
  data: [],
  total: 0,
  tableParams: {
    "pageNum": 1,
    "pageSize": 20,
    "order": "DESC",
    "prop": "serial_number"
  }
});
const tableLoading = ref(false);
const createModalOpen = ref(false);
const formData = reactive({
  dataYear: dayjs().year() + '',
  dataMonth: dayjs().month() + '',
  serialNumber: '',
  createTime: [],
  createUserId: null,
  createTimeStart: null,
  createTimeEnd: null,
});
const formParams = {};
const options = reactive({
  monthList,              // 月
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
});
const formHeight = ref(0);
// const innerHeight = computed(() => {
//   return (window.innerHeight * 0.95) + 'px';
// });
const tableScrollHeihth = computed(() => {
  return ((window.innerHeight * 0.96) - 20 - 24 - 24 - 8 - 40 - 56 - formHeight.value);
});
onMounted(() => {
  getUserList();
  onSubmit();
});
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
      };
    });
  } catch (error) {
    console.error(error);
  }
}
// 分页器页数变化
function pageNumChange(val) {
  serialNumber.tableParams.pageNum = val;
  getVersionList();
}
// 分页器每页条数变化
function pageSizeChange(val) {
  serialNumber.tableParams.pageSize = val;
  pageNumChange(1);
}
// 点击搜索
function onSubmit(val) {
  Object.assign(formParams, formData);
  formParams.month = formParams.month ?? '';
  let createTime = formData.createTime || [];
  if (createTime[0] && createTime[1]) {
    formParams.createTimeStart = createTime[0].startOf('day').valueOf();
    formParams.createTimeEnd = createTime[1].endOf('day').valueOf();
  }
  delete formParams.createTime;
  pageNumChange(1);
}
// 获取流水号数据
async function getVersionList(val) {
  let params = {
    ...formParams,
    ...serialNumber.tableParams,
  };
  tableLoading.value = true;
  // console.log({params});
  try {
    let res = await versionList(params);
    let data = res.data;
    data.map((item, index) => {
      item.rowIndex = index + 1;
      item.disabledSwitch = false;
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
// 是否采用
async function acceptChange(val, row) {
  // console.log({val, row});
  try {
    serialNumber.data.forEach(i => (i.disabledSwitch = true));
    await acceptVersion({ id: row.id });
  } catch (error) {
    console.error(error);
  }
  getVersionList();
}
// 查看对应报表
function viewReport(row, key) {
  console.log({ row, key });

}
</script>
<style lang="less" scoped></style>