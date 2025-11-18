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
        :rules="[{ required: true, message: '请选择年份!' }]"
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
        ></a-select>
      </a-form-item>
      <a-form-item label="部门" name="departments">
        <a-select 
          v-model:value="formData.departments" 
          show-search
          :options="options.allUserList" 
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
          :options="options.allUserList" 
          :optionFilterProp="'label'"  
          :filterOption="userFilterOption"  
          placeholder="请选择组" 
          allowClear
        ></a-select>
      </a-form-item>
      <a-form-item label="运营" name="userName">
        <a-input v-model:value="formData.userName" placeholder="请输入关键字" />
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
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { monthList } from '~@/pages/financialStatements/common/data';
defineOptions({ name: "setOperationalGoals_index" })
const formData = reactive({
  year: dayjs(),
  month: dayjs().format('MMMM'),
  departments: [],
  groups: [],
  userName: '',
  serialNumber: '',
});
const options = reactive({
  monthList,  // 月
  departmentList: [], // 部门列表
  groupList: [], // 组列表
  serialNumberList: [], // 流水号列表
})

function userFilterOption(val, option) {
  // 将输入值和选项的 label（姓名）都转为小写，实现不区分大小写的模糊匹配
  return option.label.toLowerCase().includes(val.toLowerCase());
}

function onSubmit(val) {
  console.log(val)
}

function formHeightChange(height) {
  console.log(height)
}
</script>
<style lang="less" scoped></style>