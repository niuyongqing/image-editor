<script setup lang="js">

import {ref} from 'vue'
import { format } from 'date-fns';
import {
  getRoleListApi,
  changeStatusApi,
  delRoleApi,
  getRoleUserApi,
  delRoleUserApi,
  getRoleApi
} from "~/api/common/role.js";
import { message } from 'ant-design-vue';
import AddOrEdit from "~/pages/system/role/component/addOrEdit.vue";
import allocation from '~/pages/system/role/component/allocation.vue'
import CopyPermission from "~/pages/system/role/component/copyPermission.vue";
import {checkPermi} from "~/utils/permission/component/permission.js";
import { Table } from 'ant-design-vue';
import {sortBySortKey} from "~/utils/tools.js";
// 定义分页配置
const pagination = ref({
  current: 1,
  pageSize: 50,
  total: 0, // 例如，总条目数为50
  pageSizeOptions: ['50','100','200'],
});
const tableHeight = ref(0);
const tableContainer = ref(null);
const userTableData = ref([])
const userTableLoading = ref(false);
const expandedKeys = ref([])
const columns = [
  Table.EXPAND_COLUMN,
  {
    title: '角色编号',
    dataIndex: 'roleId',
    key: 'roleId',
    width: 100,
  },{
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
  },{
    title: '显示顺序',
    dataIndex: 'sort',
    key: 'sort',
    width: 100,
  },{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 50,
  },{
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
  },{
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },{
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    width: 250,
  },
]
const userColumns = ref([
  {
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
    width: 100,
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  },{
    title: '别名',
    dataIndex: 'nickName',
    key: 'nickName',
  },{
    title: '电话号码',
    dataIndex: 'phonenumber',
    key: 'phonenumber',
  },{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 50,
  },{
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },{
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  // {
  //   title: '操作',
  //   dataIndex: 'option',
  //   key: 'option',
  //   width: 100,
  // },
]);
const open = ref(false);
const title = ref("");
const editData = ref({})
const tableLoading = ref(false);
const roleId = ref(undefined);
const allocationOpen = ref(false);
const copyOpen = ref(false);
const allocationData  = ref({});
const copyData  = ref({});
const menu = ref([])
const formState = ref({
  userName:"",
  phonenumber:"",
  picker:[],
  pageNum:1,
  pageSize:50
})
const setTableHeight = () => {
  if (tableContainer.value) {
    tableHeight.value = window.innerHeight - tableContainer.value.getBoundingClientRect().top - 100; // 偏移量可根据需求调整
  }
};

onMounted(()=>{
  handleFinish()
  setTableHeight();
  getMenu()
  window.addEventListener('resize', setTableHeight);
})
onUnmounted(() => {
  window.removeEventListener('resize', setTableHeight);
});
const tableData = ref([])


function handleFinish() {
  expandedKeys.value = []
  const [startDate, endDate] = formState.value.picker || [];
  let data = {
    roleName:formState.value.roleName,
    status:formState.value.status,
    phonenumber:formState.value.phonenumber,
    beginTime:startDate?format(new Date(startDate), 'yyyy-MM-dd'):"",
    endTime:endDate?format(new Date(endDate), 'yyyy-MM-dd'):"",
    pageNum:formState.value.pageNum,
    pageSize:formState.value.pageSize
  }
  tableLoading.value = true;
  getRoleListApi(data).then(res=>{
    tableData.value = res.rows
    for (let i = 0; i < tableData.value.length; i++) {
      tableData.value[i].dateil = []
    }
    pagination.value.total = res.total
  }).finally(()=>{
    tableLoading.value = false;
  })
}


// 处理表格变化（如分页、排序等）
function handleTableChange(pageNum, pageSize) {
  formState.value.pageNum = pageNum
  formState.value.pageSize = pageSize
  pagination.value.pageSize  = pageSize
  pagination.value.current = pageNum
  handleFinish();
}



function handleFinishFailed() {

}


function setStatus(item) {
  changeStatusApi({roleId:item.roleId,status:item.status}).then(res=>{
    if(res.code === 200){
      message.success(res.msg)
    }else {
      message.error(res.msg)
    }
  }).finally(()=>{
    handleFinish();
  })
}

function edit(item) {
  title.value = "编辑角色"
  editData.value = item
  open.value = true
}

/**
 * 分配角色
 */
function allocationRole(record) {
  allocationData.value = record
  allocationOpen.value = true
}

/**
 * 复制权限
 */
function copy(record){
  copyData.value = record
  copyOpen.value = true
}

function addUser() {
  title.value = "新增角色"
  editData.value = {}
  open.value = true
}

function del(item) {
  delRoleApi({roleId:item.roleId}).then(res=>{
   if(res.code === 200){
     message.success(res.msg)
     handleFinish();
   }else {
     message.error(res.msg)
   }
  })
}


const resetForm = () => {
  formState.value = {
    userName:"",
    phonenumber:"",
    picker:[],
    pageNum:1,
    pageSize:pagination.value.pageSize
  };
  handleFinish()
}
const close = () => {
  open.value = false
  title.value = ""
  userTableData.value = []
  roleId.value = undefined
  editData.value = {}
  handleFinish()
}

const closeCopy = () => {
  copyOpen.value = false
  handleFinish()
}

const closeAllocation = () =>{
  allocationData.value = {}
  allocationOpen.value = false
  handleFinish()
}

const showTotal = (total, range) => {
  return `总共${total}条`;
};

function getRoleUserList(id) {
  expandedKeys.value = id
  userTableLoading.value = true
  if(id){
    getRoleUserApi({roleId: expandedKeys.value[expandedKeys.value.length - 1]}).then(res=>{
        for(let i=0;i<tableData.value.length;i++){
          if(tableData.value[i].roleId === expandedKeys.value[expandedKeys.value.length - 1]){
            tableData.value[i].dateil = res.data
          }
        }
    }).finally(()=>{
      userTableLoading.value = false
    })
  }
}
function delRoleUser(record){
  delRoleUserApi({userId: record.userId,roleId:roleId.value}).then(res=>{
    message.success(res.msg)
    getRoleUserList()
  })
}

function formatMenu(route, path) {
  return {
    id: route.meta?.id,
    sort: route.meta?.sort,
    commonUse: route.meta?.commonUse,
    parentId: route.meta?.parentId,
    title: route,
    icon: route.meta?.icon || '',
    path: path ?? route.path,
    hideInMenu: route.meta?.hideInMenu || false,
    parentKeys: route.meta?.parentKeys || [],
    hideInBreadcrumb: route.meta?.hideInBreadcrumb || false,
    hideChildrenInMenu: route.meta?.hideChildrenInMenu || false,
    locale: route.meta?.locale,
    keepAlive: route.meta?.keepAlive || false,
    name: route.name,
    url: route.meta?.url || '',
    target: route.meta?.target || '_blank',
  }
}

function getMenu(){
  getRoleApi({}).then(res=>{
    menu.value = generateTreeRoutes(res.data).routeData;
  })
}

function generateTreeRoutes(menus) {
  const routeDataMap = /* @__PURE__ */ new Map()
  for (const menuItem of menus) {
    if (!menuItem.id)
      continue
    const route = {
      id: menuItem.id,
      path: menuItem.path,
      name: menuItem.name,
      component: menuItem.component,
      redirect: menuItem.redirect || void 0,
      sort: menuItem?.sort,
      title: menuItem.title,
      type: menuItem?.type,
      commonUse: menuItem?.commonUse,
      meta: {
        sort: menuItem?.sort,
        title: menuItem?.title,
        icon: menuItem?.icon,
        keepAlive: menuItem?.keepAlive,
        id: menuItem?.id,
        parentId: menuItem?.parentId,
        affix: menuItem?.affix,
        parentKeys: menuItem?.parentKeys,
        url: menuItem?.url,
        hideInMenu: menuItem?.hideInMenu,
        hideChildrenInMenu: menuItem?.hideChildrenInMenu,
        hideInBreadcrumb: menuItem?.hideInBreadcrumb,
        target: menuItem?.target,
        locale: menuItem?.locale,
      },
    }
    formatMenu(route)
    routeDataMap.set(menuItem.id, route)
  }
  const routeData = []
  for (const menuItem of menus) {
    if (!menuItem.id)
      continue
    const currentRoute = routeDataMap.get(menuItem.id)
    if (!menuItem.parentId) {
      if (currentRoute) {
        routeData.push(currentRoute)
      }
    } else {
      const pRoute = routeDataMap.get(menuItem.parentId)
      if (currentRoute && pRoute) {
        if (pRoute.children) {
          pRoute.children.push(currentRoute)
        } else {
          pRoute.children = [currentRoute]
        }
      }
    }
  }
  sortBySortKey(routeData);
  return {
    routeData,
  }
}
</script>

<template>
  <div>
      <a-form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
        <a-form-item>
          <a-input v-model:value="formState.roleName" placeholder="角色名称"></a-input>
        </a-form-item>
        <a-form-item>
          <a-select ref="select" v-model:value="formState.status" style="width: 200px;text-align: left" allow-clear placeholder="角色状态">
            <a-select-option value="0">正常</a-select-option>
            <a-select-option value="1">停用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-range-picker v-model:value="formState.picker" :placeholder="['创建开始','创建结束']"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" >查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    <a-card style="margin-top: 10px;padding: 0">
    <div class="table-container" ref="tableContainer" style="text-align: left" >
        <a-button type="primary" style="margin-bottom: 10px;" @click="addUser"  v-has-permi="['system:platform:role:add']">新增</a-button>
        <a-table bordered :dataSource="tableData" rowKey="roleId" :columns="columns" :pagination="false" :scroll="{ y: tableHeight, x: '100%',virtual: true }" :loading="tableLoading" :expandedRowKeys="expandedKeys" @expandedRowsChange="getRoleUserList">
          <template #expandedRowRender="{ record }">
            <p style="margin: 0" >
              <a-table bordered :dataSource="record.dateil?record.dateil:[]" rowKey="userId"  :columns="userColumns" :loading="userTableLoading" :pagination="false" >
                <template #bodyCell="{ column, record}">
                  <div v-if="column.dataIndex === 'status'" >{{record.status === '0'?'正常':'禁用'}}</div>
<!--                  <div v-if="column.dataIndex === 'option'" >-->
<!--                    <a-popconfirm title="确定删除吗？" ok-text="Yes" cancel-text="No" @confirm="delRoleUser(record)"  v-if="record.userName !== 'admin' && checkPermi(['system:platform:role:edit'])" ><a  color="red">删除</a></a-popconfirm>-->
<!--                  </div>-->
                </template>
              </a-table>
            </p>
          </template>
          <template #bodyCell="{ column, record}">
            <div v-if="column.dataIndex === 'status'" ><a-switch v-if="record.userName !== 'admin'" v-model:checked="record.status" checkedValue="0" unCheckedValue="1" @change="setStatus(record)" :disabled="!checkPermi(['system:platform:role:edit'])"/></div>
            <div v-if="column.dataIndex === 'option'" >
              <a-button @click="copy(record)" type="text" color="amber" v-if="checkPermi(['system:platform:role:edit'])">复制权限</a-button>
              <a-button @click="allocationRole(record)" type="text" color="emerald" v-if="checkPermi(['system:platform:role:edit'])">分配用户</a-button>
              <a-button @click="edit(record)" type="text" color="blue" v-if="checkPermi(['system:platform:role:edit'])">编辑</a-button>
              <a-popconfirm title="确定删除吗？" ok-text="Yes" cancel-text="No" @confirm="del(record)"  v-if="checkPermi(['system:platform:role:del'])" ><a  color="red">删除</a></a-popconfirm>
            </div>
          </template>
        </a-table>
<!--        <a-pagination style="text-align: right;margin-top: 10px;" :current="pagination.pageNum" :page-size="pagination.pageSize" :page-size-options="pagination.pageSizeOptions" :show-quick-jumper="true" :show-less-items="true" :show-title="true" :show-total="showTotal" :total="pagination.total" @change="handleTableChange"/>-->
    </div>
    </a-card>
    <add-or-edit :open="open" :title="title" :data="editData" :menu="menu" @close="close"></add-or-edit>
    <allocation :open="allocationOpen" :data="allocationData"  @close="closeAllocation"></allocation>
    <copy-permission :open="copyOpen" @close="closeCopy" :data="copyData"></copy-permission>
  </div>
</template>

<style scoped lang="less">
.table-container {
  padding: 0;
  background-color: #fff;
}
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>