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
        @click="openModal"
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


  <!-- 使用自定义footer -->
  <AppModal v-model="customModalVisible" title="自定义底部弹窗1">
    <template #appContent>
      <p>弹窗内容</p>
    </template>
    
    <template #appFooter>
      <a-button @click="handleCustomCancel">自定义取消</a-button>
      <a-button type="primary" @click="handleCustomOk">自定义确定</a-button>
      <a-button type="dashed">其他操作</a-button>
    </template>
  </AppModal>
</div>
</template>

<script setup>
import appTableBox from '~/components/common/appTableBox/index.vue'
import appModal from '~/components/common/appModal/index.vue'
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

// 弹窗相关
const customModalVisible = ref(false)

// 复选框
function onSelectChange(keys, rows) {
  tableData.selectedRowKeys = keys
  tableData.selectedRows = rows
}

const openModal = () => {
  customModalVisible.value = true
}

// 自定义底部弹窗事件
const handleCustomCancel = () => {
  console.log('自定义取消操作')
  customModalVisible.value = false
}

const handleCustomOk = () => {
  console.log('自定义确定操作')
  customModalVisible.value = false
}



</script>

<style lang="less" scoped>
.publication_sequence {
  text-align: left;
}
</style>