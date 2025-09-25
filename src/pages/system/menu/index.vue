<template>
  <div>
    <a-card style="margin-top: 10px">
      <div style="margin-bottom: 10px;text-align: left;">
        <a-button class="spacing" type="primary" @click="addOneMenu">添加</a-button>
        <a-button class="spacing" type="primary" @click="saveMenuOrder" :loading="saving">保存排序</a-button>
      </div>
      <div class="table-container" ref="tableContainer">
        <a-table :data-source="dataSource" :indent-size="30" :resizable="true" bordered :columns="columns" row-key="id"  :loading="tableLoading">
          <!-- 覆盖表格体，实现拖拽功能 -->
          <template #body>
            <tbody>
              <Draggable
                v-model="dataSource"
                :disabled="tableLoading"
                :animation="200"
                ghost-class="ghost"
                group="menu"
                @end="handleDragEnd"
              >
                <template #item="{ element: node }">
                  <tr>
                    <!-- 名称列 - 显示拖拽手柄 -->
                    <td style="padding-left: 30px; text-align: left; cursor: move;">
                      <span class="drag-handle" style="margin-right: 8px;">⋮⋮</span>
                      <AsyncIcon v-if="node.meta.icon" :icon="node.meta.icon"></AsyncIcon>
                      {{ node.title }}
                    </td>
                    <!-- 其他列数据 -->
                    <td>{{ node.swmcName || '-' }}</td>
                    <td>{{ node.sort }}</td>
                    <td>{{ node.type === 1 ? '文件夹' : node.type === 2 ? '菜单' : '按钮' }}</td>
                    <td>{{ node.permission }}</td>
                    <td>{{ node.component }}</td>
                    <td>{{ node.path }}</td>
                    <td>{{ node.redirect || '-' }}</td>
                    <td>
                      <a-tag v-if="node.meta.hideInMenu" color="#f50">是</a-tag>
                      <a-tag v-else color="#2db7f5">否</a-tag>
                    </td>
                    <td>
                      <a-tag v-if="node.meta.keepAlive" color="#f50">是</a-tag>
                      <a-tag v-else color="#2db7f5">否</a-tag>
                    </td>
                    <td>
                      <a-button type="link" @click.stop="add(node)" color="#2db7f5">添加</a-button>
                      <a-button type="link" @click.stop="edit(node)">编辑</a-button>
                      <a-popconfirm :title="'确定要删除菜单吗？'" @confirm="confirmDeleteMenu(node)">
                        <a-button type="text" danger>删除</a-button>
                      </a-popconfirm>
                    </td>
                  </tr>
                  <!-- 递归渲染子菜单 -->
                  <template v-if="node.children && node.children.length > 0">
                    <RecursiveMenuItem
                      v-for="child in node.children"
                      :key="child.id"
                      :node="child"
                      :level="1"
                      :menus="node.children"
                      @add="add"
                      @edit="edit"
                      @delete="confirmDeleteMenu"
                    />
                  </template>
                </template>
              </Draggable>
            </tbody>
          </template>
        </a-table>
      </div>
    </a-card>
    <add-or-edit :open="open" :title="title" :data="editData" @close="close" :menus="dataSource"></add-or-edit>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, onBeforeMount, h} from 'vue';
import {getMenusListApi, delMenuApi, updateMenuSortApi} from '~/api/common/menu.js'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import AddOrEdit from "~/pages/system/menu/component/addOrEdit.vue";
import {sortBySortKey} from "~/utils/tools.js";
import Draggable from 'vuedraggable';
import {message} from 'ant-design-vue';

// 递归组件，用于渲染子菜单
const RecursiveMenuItem = {
  name: 'RecursiveMenuItem',
  props: {
    node: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    menus: {
      type: Array,
      required: true
    }
  },
  emits: ['add', 'edit', 'delete'],
  components: {
    AsyncIcon,
    Draggable
  },
  template: `
    <tr>
      <td :style="{ paddingLeft: (30 + level * 20) + 'px', textAlign: 'left', cursor: move }"><span v-if="node.type !== 3" class="drag-handle" style="margin-right: 8px;">⋮⋮</span>
        <AsyncIcon v-if="node.meta.icon" :icon="node.meta.icon"></AsyncIcon>
        {{ node.title }}
      </td>
      <td>{{ node.swmcName || '-' }}</td>
      <td>{{ node.sort }}</td>
      <td>{{ node.type === 1 ? '文件夹' : node.type === 2 ? '菜单' : '按钮' }}</td>
      <td>{{ node.permission }}</td>
      <td>{{ node.component }}</td>
      <td>{{ node.path }}</td>
      <td>{{ node.redirect || '-' }}</td>
      <td>
        <a-tag v-if="node.meta.hideInMenu" color="#f50">是</a-tag>
        <a-tag v-else color="#2db7f5">否</a-tag>
      </td>
      <td>
        <a-tag v-if="node.meta.keepAlive" color="#f50">是</a-tag>
        <a-tag v-else color="#2db7f5">否</a-tag>
      </td>
      <td>
        <a-button type="link" @click.stop="$emit('add', node)" color="#2db7f5">添加</a-button>
        <a-button type="link" @click.stop="$emit('edit', node)">编辑</a-button>
        <a-popconfirm :title="'确定要删除菜单吗？'" @confirm="$emit('delete', node)">
          <a-button type="text" danger>删除</a-button>
        </a-popconfirm>
      </td>
    </tr>
    <template v-if="node.children && node.children.length > 0">
      <Draggable
        v-model="node.children"
        :disabled="false"
        :animation="200"
        ghost-class="ghost"
        group="menu"
        @end="handleChildDragEnd"
      >
        <template #item="{ element: child }">
          <RecursiveMenuItem
            :node="child"
            :level="level + 1"
            :menus="node.children"
            @add="$emit('add', $event)"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
          />
        </template>
      </Draggable>
    </template>
  `,
  methods: {
    handleChildDragEnd(evt) {
      // 处理子菜单拖拽结束事件
      this.updateSort(this.menus)
    },
    updateSort(items) {
      // 更新排序号
      items.forEach((item, index) => {
        item.sort = index + 1
        if (item.children && item.children.length > 0) {
          this.updateSort(item.children)
        }
      })
    }
  }
}
const tableContainer = ref(null);
const dataSource = ref([])
const title = ref(''); // 当前点击按钮是添加还是编辑
const editData = ref({})
const tableHeight = ref(0);
const open = ref(false);
const tableLoading = ref(false);
const saving = ref(false); // 保存排序的加载状态
const myMenus = ref([]); // 存储原始菜单数据
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
    title: route.meta?.title || route.title,
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
  // 使用sortBySortKey函数对路由数据进行排序
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

// 处理拖拽结束事件
function handleDragEnd(evt) {
  // 更新排序号
  updateSort(dataSource.value)
  // 同步到myMenus
  myMenus.value = JSON.parse(JSON.stringify(dataSource.value))
}

// 更新排序号
function updateSort(items) {
  items.forEach((item, index) => {
    item.sort = index + 1
    if (item.children && item.children.length > 0) {
      updateSort(item.children)
    }
  })
  // 对当前层级根据sort键进行排序
  items.sort((a, b) => a.sort - b.sort)
}

// 检查数据是否合法
function validateMenuData(menus) {
  // 检查是否有循环引用（将自己拖入自己的子级中）
  const hasCircularReference = (node, path = []) => {
    if (path.includes(node.id)) {
      return true
    }
    if (!node.children || node.children.length === 0) {
      return false
    }
    return node.children.some(child => hasCircularReference(child, [...path, node.id]))
  }

  return !menus.some(menu => hasCircularReference(menu))
}

// 转换数据结构，仅保留需要的字段
function formatMenuData(menus) {
  return menus.map(menu => {
    const formatted = {
      id: menu.meta.id,
      parentId: menu.meta.parentId,
      sort: menu.sort
    }
    if (menu.children && menu.children.length > 0) {
      formatted.children = formatMenuData(menu.children)
    }
    return formatted
  })
}

// 保存菜单排序
function saveMenuOrder() {
  if (saving.value) {
    return
  }

  // 验证数据
  if (!validateMenuData(dataSource.value)) {
    message.error('菜单数据存在循环引用，无法保存')
    return
  }

  saving.value = true
  
  const menuData = formatMenuData(dataSource.value)

  updateMenuSortApi({
    menus: menuData
  }).then(res => {
    if (res.success) {
      message.success('菜单排序保存成功')
      // 重新获取菜单数据，确保数据一致性
      getMenusList()
    } else {
      message.error(res.message || '保存失败')
      // 恢复到之前的数据状态
      dataSource.value = JSON.parse(JSON.stringify(myMenus.value))
    }
  }).catch(() => {
    message.error('保存失败，请重试')
    // 恢复到之前的数据状态
    dataSource.value = JSON.parse(JSON.stringify(myMenus.value))
  }).finally(() => {
    saving.value = false
  })
}

// 获取菜单列表数据
function getMenusList() {
  tableLoading.value = true
  getMenusListApi({}).then((value) => {
    console.log('获取的菜单数据:', value);
    
    // 增加数据校验，确保value和value.data存在且为数组
    if (value && Array.isArray(value.data)) {
      try {
          const generationResult = generateTreeRoutes(value.data);
          const result = generationResult?.routeData || [];
          console.log('生成的菜单数据:', result);
          // 检查生成的菜单数据是否正确
          if (result && Array.isArray(result)) {
            dataSource.value = result
            // 深拷贝保存原始数据，用于拖拽操作和数据恢复
            myMenus.value = JSON.parse(JSON.stringify(dataSource.value))
          } else {
            console.warn('生成的菜单数据格式不正确:', result)
            dataSource.value = []
            myMenus.value = []
          }
        } catch (error) {
          console.error('处理菜单数据时出错:', error)
          dataSource.value = []
          myMenus.value = []
        }
    } else {
      console.warn('获取的菜单数据格式不正确:', value)
      dataSource.value = []
      myMenus.value = []
    }
  }).catch(error => {
    console.error('获取菜单列表失败:', error)
    dataSource.value = []
    myMenus.value = []
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
  getMenusList();
})
</script>
<style scoped lang="less">
.spacing {
  margin-right: 10px;
}

.ant-table th,
.ant-table td {
  text-align: center;
}

/* 拖拽相关样式 */
.drag-handle {
  cursor: move;
  user-select: none;
  opacity: 0.7;
  font-size: 16px;
}

.drag-handle:hover {
  opacity: 1;
}

.ghost {
  opacity: 0.5;
  background: #f0f0f0;
}

/* 拖拽过程中表格行的样式 */
tr.dragging {
  background-color: #f5f5f5 !important;
}

/* 拖拽容器宽度自适应 */
.vuedraggable-list {
  width: 100%;
}

/* 嵌套菜单缩进修复 */
.ant-table-tbody > tr > td {
  vertical-align: top;
}
</style>