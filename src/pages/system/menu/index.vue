<script setup lang="js">
import {ref, reactive} from 'vue';
import {getMenusListApi, delMenuApi,} from '~/api/common/menu.js'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import AddOrEdit from "~/pages/system/menu/component/addOrEdit.vue";
import {sortBySortKey} from "~/utils/tools.js";
import { VXETable } from 'vxe-table';
import 'vxe-table/lib/style.css';
import 'vxe-pc-ui/lib/style.css';
import { VxeTable, VxeColumn } from 'vxe-table';
const tableContainer = ref(null);
const dataSource = ref([])
const originalData = ref([])
// 使用originalData作为vxe-table的数据源
const rowConfig = reactive({ 
  drag: true,
  isCurrent: true,
  isHover: true,
})
const columnConfig = reactive({
  resizable: true,// 列宽可以拖拽
})

const rowDragConfig = reactive({
  isPeerDrag: true,
    showIcon: false,
  showGuidesStatus: true,
  trigger: 'row',// 触发方式改为行拖动
  
})
const treeConfig = ref({
  transform: true,
  rowField: 'id',
  parentField: 'parentId',
})

const title = ref(''); // 当前点击按钮是添加还是编辑
const editData = ref({})
const tableHeight = ref(0);
const open = ref(false);
const tableLoading = ref(false);

const cellDblclickEvent = ({ row, column, rowIndex, columnIndex }) => {
  edit(row)
}
const setTableHeight = () => {
  if (tableContainer.value) {
    tableHeight.value = window.innerHeight - tableContainer.value.getBoundingClientRect().top - 100; // 偏移量可根据需求调整
  }
};
VXETable.setup({
   icon: {
    TABLE_DRAG_STATUS_SUB_ROW: 'vxe-icon-add-sub',
    // 更多图标配置...
  }
})
onMounted(()=>{
  setTableHeight();
  window.addEventListener('resize', setTableHeight);
})
onUnmounted(() => {
  window.removeEventListener('resize', setTableHeight);
});
function formatMenu(route, path) {
  return {
    id: route.meta?.id,
    sort: route.meta?.sort,
    commonUse: route.meta?.commonUse,
    parentId: route.meta?.parentId,
    permission:route.permission,
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


function generateTreeRoutes(menus) {
  const routeDataMap = /* @__PURE__ */ new Map()
  for (const menuItem of menus) {
    if (!menuItem.id)
      continue
    const route = {
      id: menuItem.id,
      path: menuItem.path,
      permission:menuItem.permission,
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

function confirmDeleteMenu(item) {
  delMenuApi({id: item.meta.id}).then(res => {
    getMenusList({})
  })
}

function getMenusList() {
  tableLoading.value = true
  getMenusListApi({}).then((value) => {
    dataSource.value = generateTreeRoutes(value.data).routeData
    // 获取原数据
    originalData.value = [...value.data]
  }).finally(()=>{
    tableLoading.value = false
  })
}

function edit(pam) {
  title.value = '编辑'
  open.value = true
  editData.value = pam
}

function add(pam) {
  title.value = '新增'
  open.value = true
  editData.value = pam
}

function addOneMenu() {
  title.value = '添加一级菜单'
  open.value = true
}

function close() {
  title.value = ''
  open.value = false
  editData.value = {}
  getMenusList()
}


// vxe-table 已在模板中直接定义列配置，无需外部columns数组
onBeforeMount(() => {
  getMenusList({});
})
</script>

<template>
  <div>
    <a-card style="margin-top: 10px">
      <div style="margin-bottom: 10px;text-align: left;">
        <a-button class="spacing" type="primary" @click="addOneMenu">添加</a-button>
      </div>
      <div class="table-container" ref="tableContainer">
        <vxe-table 
          border 
          :row-config="rowConfig" 
          :row-drag-config="rowDragConfig"
          :column-config="columnConfig" 
          @cell-dblclick="cellDblclickEvent"
          :tree-config="treeConfig" 
          class="mytable-style"
          :data="originalData" 
          :cell-config="{height: 44}"
          :loading="tableLoading"> 
          <vxe-column type="seq" width="80"></vxe-column> 
          <vxe-column field="title" title="菜单名" width="240" tree-node drag-sort>
            <template #default="{ row }">
              <div>
                <AsyncIcon v-if="row.icon || (row.meta && row.meta.icon)" :icon="row.icon || row.meta.icon"></AsyncIcon>
                {{ row.title }}
              </div>
            </template>
          </vxe-column> 
          <vxe-column field="swmcName" title="分类" width="140"></vxe-column> 
          <vxe-column field="sort" title="排序" width="80"></vxe-column> 
          <vxe-column field="type" title="类型" width="100">
            <template #default="{ row }">
              <div v-if="row.type === 1">文件夹</div>
              <div v-if="row.type === 2">菜单</div>
              <div v-if="row.type === 3">按钮</div>
            </template>
          </vxe-column> 
          <vxe-column field="permission" title="权限字符" width="180"></vxe-column> 
          <vxe-column field="component" title="组件路径" min-width="200"></vxe-column> 
          <vxe-column field="path" title="路径" min-width="150"></vxe-column> 
          <vxe-column field="redirect" title="重定向" min-width="150"></vxe-column> 
          <vxe-column field="hideInMenu" title="是否隐藏" width="100">
            <template #default="{ row }">
              <a-tag v-if="row.hideInMenu" color="#f50">是</a-tag>
              <a-tag v-else color="#2db7f5">否</a-tag>
            </template>
          </vxe-column> 
          <vxe-column field="keepAlive" title="是否保活" width="100">
            <template #default="{ row }">
              <a-tag v-if="row.keepAlive" color="#f50">是</a-tag>
              <a-tag v-else color="#2db7f5">否</a-tag>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="152">
            <template #default="{ row }">
              <a-button type="link" @click.stop="add(row)" color="#2db7f5">添加</a-button>
              <a-button type="link" @click.stop="edit(row)">编辑</a-button>
              <a-popconfirm :title="'确定要删除菜单吗？'" @confirm="confirmDeleteMenu(row)">
                <a-button type="text" danger>删除</a-button>
              </a-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
      </div>

    </a-card>
    <add-or-edit :open="open" :title="title" :data="editData" @close="close" :menus="dataSource"></add-or-edit>
  </div>
</template>

<style scoped lang="less">
.spacing {
  margin-right: 10px;
}

.ant-table th,
.ant-table td {
  text-align: center;
}

::v-deep(.ant-card) {
  padding: 6px;
}
::v-deep(.mytable-style.vxe-table) {
  color: rgba(0, 0, 0, 0.80);
}
::v-deep(.mytable-style.vxe-table .vxe-header--column) {
  color: rgba(0, 0, 0, 0.88);
}

::v-deep(.vxe-table--render-default .vxe-cell--tree-btn>i) {
   color: rgba(0, 0, 0, 0.80);
}

</style>
