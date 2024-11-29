<script setup lang="js">
import {ref} from 'vue';
import {getMenusListApi, delMenuApi,} from '~/api/common/menu.js'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import AddOrEdit from "~/pages/system/menu/component/addOrEdit.vue";
import {sortBySortKey} from "~/utils/tools.js";
const tableContainer = ref(null);
const dataSource = ref([])
const title = ref(''); // 当前点击按钮是添加还是编辑
const editData = ref({})
const tableHeight = ref(0);
const open = ref(false);
const tableLoading = ref(false);
const setTableHeight = () => {
  if (tableContainer.value) {
    tableHeight.value = window.innerHeight - tableContainer.value.getBoundingClientRect().top - 100; // 偏移量可根据需求调整
  }
};

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


const columns = ref([
  {
    title: '菜单名',
    dataIndex: 'name',
    width: '30%',
    style: {textAlign: 'center'},
  }, {
    title: '分类',
    dataIndex: 'swmcName',
    style: {textAlign: 'center'},
  },
  {
    title: '排序',
    dataIndex: 'sort',
    style: {textAlign: 'center'},
  },
  {
    title: '类型',
    dataIndex: 'type',
    style: {textAlign: 'center'},
  },
  {
    title: '权限字符',
    dataIndex: 'permission',
    style: {textAlign: 'center'},
  },  {
    title: '组件路径',
    dataIndex: 'component',
    style: {textAlign: 'component'},
  },
  {
    title: '路径',
    dataIndex: 'path',
    style: {textAlign: 'center'},
  },
  {
    title: '重定向',
    dataIndex: 'redirect',
    style: {textAlign: 'center'},
  },
  {
    title: '是否隐藏',
    dataIndex: 'hideInMenu',
    style: {textAlign: 'center'},
  },
  {
    title: '是否保活',
    dataIndex: 'keepAlive',
    style: {textAlign: 'center'},
  }, {
    title: '操作',
    dataIndex: 'option',
    style: {textAlign: 'center'},
  },
])
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
        <a-table :data-source="dataSource" :indent-size="30" :resizable="true" bordered :columns="columns" row-key="id"  :loading="tableLoading">
          <template #bodyCell="{ column, text, record }" :style="record.style">
            <div v-if="column.dataIndex === 'name'">
              <AsyncIcon v-if="record.meta.icon" :icon="record.meta.icon"></AsyncIcon>
              {{ record.title }}
            </div>
            <div v-if="column.dataIndex === 'hideInMenu'">
              <a-tag v-if="record.meta.hideInMenu" color="#f50">是</a-tag>
              <a-tag v-else color="#2db7f5">否</a-tag>
            </div>
            <div v-if="column.dataIndex === 'swmcName'">

            </div>
            <div v-if="column.dataIndex === 'keepAlive'">
              <a-tag v-if="record.meta.keepAlive" color="#f50">是</a-tag>
              <a-tag v-else color="#2db7f5">否</a-tag>
            </div>
            <div v-if="column.dataIndex === 'type'">
              <div v-if="record.type === 1">文件夹</div>
              <div v-if="record.type === 2">菜单</div>
              <div v-if="record.type === 3">按钮</div>
            </div>
            <div v-if="column.dataIndex === 'option'">
              <a-button type="link" @click.stop="add(record)" color="#2db7f5">添加</a-button>
              <a-button type="link" @click.stop="edit(record)">编辑</a-button>
              <a-popconfirm :title="'确定要删除菜单吗？'" @confirm="confirmDeleteMenu(record)">
                <a-button type="text" danger>删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
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
</style>