<template>
  <div>
      <app-table-box
        :align="'left'"
        resetSetMenu="product-list"
        :table-header="columns"
        :data-source="dataSource"
        v-model:filter-columns="columns"
        row-key="deptId"
        :loading="tableLoading"
      >
      <template #leftTool>
        <a-button
          class="spacing"
          type="primary"
          @click="addDept"
          v-has-permi="['system:dept:add']"
          >添加</a-button
        >
      </template>
        <template #bodyCell="{ column, text, record }" :style="record.style">
          <div v-if="column.dataIndex === 'status'">
            <a-tag v-if="record.status === '0'" color="#2db7f5">正常</a-tag>
            <a-tag v-else color="#f50">停用</a-tag>
          </div>

          <div v-if="column.dataIndex === 'option'">
            <a-button
              type="link"
              @click.stop="add(record)"
              color="#2db7f5"
              v-if="checkPermi(['system:dept:add'])"
              >添加</a-button
            >
            <a-button
              type="link"
              @click.stop="edit(record)"
              v-if="checkPermi(['system:dept:edit'])"
              >编辑</a-button
            >
            <a-popconfirm
              :title="'确定要删除部门吗？'"
              @confirm="confirmDeleteDept(record)"
              v-if="checkPermi(['system:dept:remove']) && record.parentId !== 0"
            >
              <a-button type="text" danger>删除</a-button>
            </a-popconfirm>
          </div>
        </template>
      </app-table-box>

    <add-or-edit
      :data="editData"
      :title="title"
      :dept="dataSource"
      :open="open"
      @close="close"
    ></add-or-edit>
  </div>
</template>
<script setup lang="js">
import { message } from "ant-design-vue";
import { ref, onMounted, onUnmounted } from 'vue';
import AddOrEdit from "~/pages/system/dept/component/addOrEdit.vue";
import appTableBox from '~/components/common/appTableBox.vue';
import appTablePagination from '~@/components/common/appTablePagination.vue';
const dataSource = ref([])
const editData = ref({});
const title = ref('');
const open = ref(false);
const tableLoading = ref(false)
const deptTableContainer = ref(null);
const tableHeight = ref(0)
const search = ref({})
import { handleTree } from '~/utils/handleTree.js'
import { deleteDept, deptListApi, editDept } from '~/api/common/dept.js'
import { checkPermi } from "~/utils/permission/component/permission.js";
const tableContainer = ref(null);
const columns = ref([
  {
    title: '部门名称',
    dataIndex: 'deptName',
    key: 'deptName',
    style: { textAlign: 'center' },
  }, {
    title: '排序',
    dataIndex: 'orderNum',
    key: 'orderNum',
    width: '100px',
    align: 'right',
    style: { textAlign: 'center' },
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: '100px',
    style: { textAlign: 'center' },
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: '200px',
    align: 'center',
    style: { textAlign: 'center' },
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    width: '200px',
    align: 'center',
    fixed: 'right',
  }
])
const setTableHeight = () => {
  // 使用固定高度，因为deptTableContainer已被注释
  tableHeight.value = window.innerHeight - 250; // 偏移量可根据需求调整
};
onMounted(() => {
  setTableHeight();
  window.addEventListener('resize', setTableHeight);
  getDeptList(search)
})
onUnmounted(() => {
  window.removeEventListener('resize', setTableHeight);
});
function close() {
  title.value = ''
  open.value = false
  editData.value = {}
  getDeptList(search)
}

function getDeptList(search) {
  tableLoading.value = true
  deptListApi(search.value).then(res => {
    dataSource.value = handleTree(res.data, "deptId")
    console.log(dataSource.value)
  }).finally(() => {
    tableLoading.value = false
  })
}

function addDept() {
  open.value = true
  title.value = '新增部门'
}

function edit(record) {
  editData.value = record;
  open.value = true
  title.value = '编辑部门'
}

function add(record) {
  editData.value = record;
  open.value = true
  title.value = '新增子部门'
}

function confirmDeleteDept(record) {
  tableLoading.value = true
  deleteDept(record).then(res => {
    if (res.code === 200) {
      message.success(res.msg);
      getDeptList(search)
    } else {
      message.error(res.msg);
    }
  }).finally(() => {
    tableLoading.value = false;
  })
}
</script>
<style scoped lang="less">
.dept-table-container {
  padding: 0;
  background-color: #fff;
}

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
