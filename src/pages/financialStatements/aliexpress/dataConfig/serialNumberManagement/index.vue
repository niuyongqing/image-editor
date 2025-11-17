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
      <a-form-item label="字典名称" name="itemName">
        <a-input v-model:value="formData.itemName" placeholder="请输入字典名称"></a-input>
      </a-form-item>
    </template>
  </appTableForm>
  <appTableBox 
    :table-header="serialNumberManagement_header" 
    :data-source="serialNumber.data"
    reset-set-menu="serialNumberManagement" 
    :scroll="{y: tableScrollHeihth}"
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
    <template #options="{ record: row }">
      <a-button type="link" @click="rowEdit(row)">编辑</a-button>
    </template>
    <template #leftTool>
      <a-button type="primary" @click="modalInfo.uploadOpen = !modalInfo.uploadOpen">导入新增</a-button>
      <a-button type="primary" @click="rowEdit()">新增</a-button>
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
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { serialNumberManagement_header } from './js/tableHeader'
defineOptions({ name: "serialNumberManagement_index" })
const { proxy: _this } = getCurrentInstance()

const serialNumber = reactive({
  data: [],
  total: 0,
  itemList: [],
  itemInfo: {},

  selectedKeys: [],
  tableParams: {
    "pageNum": 1,
    "pageSize": 20,
    "order": "DESC",
    "prop": "create_time"
  }
});
const tableLoading = ref(false);
const modalInfo = reactive({
  row: {},
  editOpen: false,
  uploadOpen: false,
});
const formData = reactive({
  itemName: undefined,
});
const formParams = {};
const formHeight = ref(0);
const innerHeight = computed(() => {
  return (window.innerHeight * 0.95) + 'px';
});
const tableScrollHeihth = computed(() => {
  return ((window.innerHeight * 0.96) - 20 - 24 - 24 - 8 - 40 - 56 - formHeight.value);
});
</script>
<style lang="less" scoped>

</style>