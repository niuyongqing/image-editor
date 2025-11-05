<template>
<div id="publication_sequence" class="publication_sequence">
  <!-- <test></test> -->
  <app-table-box 
    v-model:filter-columns="tableData.filterColumns"
    :data-source="tableData.data" 
    :table-heard="tableData.header"
    reset-set-menu="whdTestHeader"
    :row-selection="{ selectedRowKeys: tableData.selectedRowKeys, onChange: onSelectChange }"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          56456464
          Name
        </span>
      </template>
    </template>
    <template #bodyCell="{ column: {key}, record: row }">
      <template v-if="key === 'name'">
        {{ row.name }}{{ '5555' }}
      </template>
      <template v-if="key === 'tags'">
        {{ row[key].join() }}
      </template>
    </template>

    <template #leftTool>
      <a-button 
        type="primary" 
      >提交编辑</a-button>
      <a-button 
        type="primary" 
      >添加备注</a-button>
      <a-button type="primary">Primary Button</a-button>
    </template>
    <template #rightTool>
      <a-button 
        type="primary" 
      >提交编辑</a-button>
      <a-button 
        type="primary" 
      >添加备注</a-button>
      <a-button type="primary">Primary Button</a-button>
    </template>
  </app-table-box> 
</div>
</template>

<script setup>
import appTableBox from '~/components/common/appTableBox/index.vue'
defineOptions({ name: "publication_sequence" })
const { proxy: _this } = getCurrentInstance();

const tableData = reactive({
  header: [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      sorter: true,
      dataIndex: 'tags',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ],
  data: [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ],
  total: 0,
  loading: false,
  selectedRowKeys: [],
  selectedRows: [],
  filterColumns: [],
  params: {
    pageNum: 1,
    pageSize: 50,
    // "order": "descending", // 倒正序，必须 descending/ascending
    // "prop": "complete_time" // 排序列，必须
  },
});

// 复选框
function onSelectChange(keys, rows) {
  tableData.selectedRowKeys = keys
  tableData.selectedRows = rows
}
</script>

<style lang="less" scoped>
.publication_sequence {
  text-align: left;
}
</style>