<template>
<div id="dictionaryManagement_index" class="dictionaryManagement_index">
  <div class="index-box left">
    <a-card style="width: 100%;">
      <a-menu
        v-model:selectedKeys="dictionary.selectedKeys"
        mode="inline"
        :items="dictionary.itemList"
        @select="itemSelect"
      ></a-menu>
    </a-card>
  </div>
  <div class="index-box right">
    <appTableForm 
      v-model:formData="formData" 
      @onSubmit="onSubmit"
      @formHeightChange="formHeightChange" 
      resetSetMenu="dictionaryManagement"
    >
      <template #formItemBox>
        <a-form-item label="字典名称" name="itemName">
          <a-input v-model:value="formData.itemName" placeholder="请输入字典名称"></a-input>
        </a-form-item>
      </template>
    </appTableForm>
    <appTableBox 
      :table-header="dictionaryManagement_header" 
      :data-source="dictionary.data"
      reset-set-menu="dictionaryManagement" 
      :scroll="{y: tableScrollHeihth}"
    >
      <template #bodyCell="{ column: { key }, record: row }">
        <template v-if="key === 'dictType'">
          {{ dictionary.itemList.find(i => i.dictType === row[key]).dictName }}
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
      <template #options>
        <a-button type="link">编辑</a-button>
      </template>
      <template #leftTool>
        <a-button type="primary">导入新增</a-button>
        <a-button type="primary">新增</a-button>
      </template>
      <template #pagination>
        <app-table-pagination
          v-model:current="dictionary.tableParams.pageNum"
          v-model:page-size="dictionary.tableParams.pageSize"
          :total="dictionary.total"
          @pageNumChange="pageNumChange"
          @pageSizeChange="pageSizeChange"
        ></app-table-pagination>
      </template>
    </appTableBox>
  </div>
  <appModal></appModal>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { itemList, itemStatus, typeList } from './js/api';
import { dictionaryManagement_header } from './js/tableHeader';
import appTableForm from '~@/components/common/appTableForm.vue';
import appTableBox from '~@/components/common/appTableBox.vue';
import appTablePagination from '~@/components/common/appTablePagination.vue';
import appModal from '~@/components/common/appModal.vue';
import { message } from 'ant-design-vue';
defineOptions({ name: "dictionaryManagement_index" })
const { proxy: _this } = getCurrentInstance()
const dictionary = reactive({
  data: [],
  total: 0,
  itemList: [],
  
  selectedKeys: [],
  tableParams: {
    "pageNum": 1,
    "pageSize": 20,
    "order": "DESC",
    "prop": "create_time"
  }
})
const modalInfo = reactive({})
const formData = reactive({
  itemName: undefined,
})
const formParams = {}
const formHeight = ref(0)
const innerHeight = computed(() => {
  return (window.innerHeight * 0.95) + 'px';
})
const tableScrollHeihth = computed(() => {
  return ((window.innerHeight * 0.96) - 20 - 24 - 24 - 8 - 40 - 56 - formHeight.value) + 'px';
})
onMounted(async () => {
  await getTypeList()
  await getItemList()
})
// 获取字典类型列表
async function getTypeList() {
  try {
    let res = await typeList()
    res.data = res.data ?? [];
    res.data.forEach(item => {
      item.key = item.dictType
      item.label = item.dictName
      item.title = item.dictName
    })
    dictionary.itemList = res.data;
    dictionary.selectedKeys.push(res.data[0]?.dictType)
  } catch (error) {
    console.error(error);
  }
}
// 点击字典类型
function itemSelect({ item, key, selectedKeys }) {
  console.log({ item, key, selectedKeys });
}
// 分页器页数变化
function pageNumChange(val) {
  dictionary.tableParams.pageNum = val
  getItemList()
}
// 分页器每页条数变化
function pageSizeChange(val) {
  dictionary.tableParams.pageSize = val;
  pageNumChange(1)
}
// 点击搜索
function onSubmit(val) {
  Object.assign(formParams, formData)
  pageNumChange(1)
}
async function statusChange(val, row) {
  // console.log({val, row});
  let params = {
    "itemId": row.itemId,
    "status": val,
  }
  try {
    await itemStatus(params)
    message.success(val === 'enabled' ? '启用成功！':'停用成功！')
  } catch (error) {
    row.status = val !== 'enabled' ? 'enabled' : 'disabled';
  }
}
function formHeightChange(val) {
  formHeight.value = val;
}
// 获取字典数据
async function getItemList(val) {
  let params = {
    "itemName": formParams.itemName,
    "itemValue": "",
    "dictType": dictionary.selectedKeys[0],
    "status": "",
    "remark": "",
    "pageNum": dictionary.tableParams.pageNum,
    "pageSize": dictionary.tableParams.pageSize,
    "order": "DESC",
    "prop": "create_time"
  }
  let res = await itemList(params);
  let data = res.data;
  data.map((item, index) => {
    item.rowIndex = index + 1;
    // item.statusType = (item.status === 'enabled');
  })
  // dictionary.total = res.total
  dictionary.data = data;
}
</script>
<style lang="less" scoped>
.dictionaryManagement_index {
  display: flex;
  height: v-bind(innerHeight);
  .index-box {
    height: 100%;
    &.left {
      padding: 4px;
      width: 150px;
    }
    &.right {
      width: calc(100% - 150px);
    }
  }
}
</style>