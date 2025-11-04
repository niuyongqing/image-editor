<template>
  <div>
    <a-card style="margin-top: 10px">
      <div style="margin-bottom: 10px; text-align: left">
        <a-button class="spacing" type="primary" @click="addOneMenu"
          >添加</a-button
        >
        <a-button class="spacing" type="primary" @click="dragMenuSave"
          >拖拽保存</a-button
        >
      </div>
      <div class="table-container" ref="tableContainer">
        <vxe-table
          border
          ref="xGrid2"
          class="mytable-style"
          :sort-config="sortConfig"
          :row-config="rowConfig"
          :row-drag-config="rowDragConfig"
          :column-config="columnConfig"
          @cell-dblclick="cellDblclickEvent"
          @row-dragend="rowDragendEvent"
          :tree-config="treeConfig"
          :data="topLevelMenuList"
          :loading="tableLoading"
          height="1100"
        >
          <vxe-column type="seq" fixed="left" width="80"></vxe-column>
          <vxe-column
            fixed="left"
            field="title"
            title="菜单名"
            tree-node
            drag-sort
            :key-field="'title'"
          >
            <template #default="{ row }">
              <div class="menu-title-container">
                <!-- 简化图标判断逻辑，减少不必要的属性访问 -->
                <AsyncIcon
                  v-if="row.icon || (row.meta && row.meta.icon)"
                  :icon="row.icon || row.meta.icon"
                  :component-key="`icon-${row.id}`"
                ></AsyncIcon>
                {{ row.title }}
              </div>
            </template>
          </vxe-column>
          <vxe-column field="classify" title="分类">
            <template #default="{ row }">
              <div>{{ classifyMap[row.classify] || "" }}</div>
            </template>
          </vxe-column>
          <vxe-column field="sort" title="排序" width="50" />
          <vxe-column field="type" title="类型">
            <template #default="{ row }">
              <div v-if="row.type === 1">文件夹</div>
              <div v-if="row.type === 2">菜单</div>
              <div v-if="row.type === 3">按钮</div>
            </template>
          </vxe-column>
          <vxe-column field="permission" title="权限字符"></vxe-column>
          <vxe-column field="component" title="组件路径"></vxe-column>
          <vxe-column field="path" title="路径"></vxe-column>
          <vxe-column field="redirect" title="重定向"></vxe-column>
          <vxe-column field="hideInMenu" title="是否隐藏">
            <template #default="{ row }">
              <a-tag :color="row.hideInMenu ? '#f50' : '#2db7f5'">
                {{ row.hideInMenu ? "是" : "否" }}
              </a-tag>
            </template>
          </vxe-column>
          <vxe-column field="keepAlive" title="是否保活">
            <template #default="{ row }">
              <a-tag :color="row.keepAlive ? '#f50' : '#2db7f5'">
                {{ row.keepAlive ? "是" : "否" }}
              </a-tag>
            </template>
          </vxe-column>
          <vxe-column title="操作" fixed="right">
            <template #default="{ row }">
              <a-button type="link" @click.stop="add(row)" color="#2db7f5"
                >添加</a-button
              >
              <a-button type="link" @click.stop="edit(row)">编辑</a-button>
              <a-popconfirm
                :title="'确定要删除菜单吗？'"
                @confirm="confirmDeleteMenu(row)"
              >
                <a-button type="text" danger>删除</a-button>
              </a-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
    </a-card>
    <add-or-edit
      ref="addOrEditRef"
      :open="open"
      :title="title"
      :data="editData"
      @close="close"
      @getMenuClassify="getMenuClassify"
      @refreshMenu="refreshMenu"
      @getMenusList="getMenusList"
      :menus="treeMenuData"
      :classify="classifyList"
    ></add-or-edit>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue";
import {
  getMenusListApi,
  delMenuApi,
  updateMenuSortApi,
  selectMenuClassify,
} from "~/api/common/menu.js";
import { VXETable } from "vxe-table";

// 使用更高效的同步引入方式加载图标组件，避免展开时的异步加载延迟
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import AddOrEdit from "~/pages/system/menu/component/addOrEdit.vue";
import { message } from "ant-design-vue";
import "vxe-table/lib/style.css";
import {
  splitMenuDataForLazyLoad,
  fetchMenuChildren,
  buildCompleteMenuTree,
} from "./menuDataUtils";

// 在组件中引入userStore
import { useUserStore } from "~/stores/user.js";
VXETable.setup({
  icon: {
    TABLE_DRAG_STATUS_SUB_ROW: "vxe-icon-add-sub",
    // 更多图标配置...
  },
});
// 更新菜单数据
const refreshMenu = async () => {
  const userStore = useUserStore();
  await userStore.generateDynamicRoutes();
};
const tableContainer = ref(null);
const originalData = ref([]); // 只保留一个数据源
// 使用局部常量代替响应式对象，减少内存占用
const rowConfig = {
  drag: true,
  isHover: true,
};
const columnConfig = {
  resizable: true,
};

const rowDragConfig = {
  isCrossDrag: false, // 禁止跨级拖拽
  isSelfToChildDrag: false, // 禁止拖拽到自己的子级
  isToChildDrag: false, // 禁止拖拽成子节点
  isPeerDrag: true, // 允许同级拖拽排序
  showIcon: false,
  showGuidesStatus: true,
  trigger: "row",
};

// 优化树形配置，禁用不必要的特性
const treeConfig = ref({
  transform: true,
  rowField: "id",
  parentField: "parentId",
  lazy: true,
  hasChild: "hasChild",
  loadMethod({ row }) {
    // 使用工具函数异步加载子菜单
    return fetchMenuChildren(childrenMapList, row.id).then((children) => {
      // 记录加载的子菜单，用于保存时重建完整菜单树
      completeChildrenMap.set(row.id, [...children]);
      return children;
    });
  },
});

const addOrEditRef = ref(null);
const title = ref(""); // 当前点击按钮是添加还是编辑
const editData = ref({});
const open = ref(false);
const tableLoading = ref(false);
const xGrid2 = ref(null);
let treeMenuData = [];
let topLevelMenuList = [];
let childrenMapList = new Map();
// 存储完整的子菜单数据，用于重建菜单树
const completeChildrenMap = new Map();
// 使用普通Map存储拖拽数据，支持clear()方法
const draggedMenuMap = new Map();
const classifyList = ref([]);
const classifyMap = ref({}); // 用于快速查找分类名称的映射
const cellDblclickEvent = ({ row, column, rowIndex, columnIndex }) => {
  edit(row);
};

// 获取菜单分类并构建映射 - 优化为同步构建映射
function getMenuClassify() {
  selectMenuClassify().then((res) => {
    const data = res.data || [];
    classifyList.value = data;
    // 使用对象字面量并循环赋值，减少数组方法调用
    const map = Object.create(null); // 使用Object.create(null)避免原型链查找
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      map[item.id] = item.name;
    }
    classifyMap.value = map;
  });
}

// 添加防抖函数 - 优化闭包结构
function debounce(fn, delay = 100) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null; // 清理定时器引用
    }, delay);
  };
}

// 创建防抖版本的拖拽处理函数
const debouncedRowDragend = debounce((dragRow, tableData) => {
  if (!dragRow || !tableData) return;

  // 直接处理拖拽行的同级元素，避免构建整个映射
  const parentId = dragRow.parentId || "";

  // 就地更新排序，避免创建额外数组
  let siblingCount = 0;
  for (let i = 0, len = tableData.length; i < len; i++) {
    const item = tableData[i];
    if ((item.parentId || "") === parentId) {
      item.sort = ++siblingCount;
    }
  }

  // 使用WeakMap存储拖拽数据，避免内存泄漏
  const parentKey = parentId || "root";
  const parentGroup = draggedMenuMap.get(parentKey) || {
    parentId,
    sortMenus: [],
  };

  // 复用数组而不是创建新数组
  parentGroup.sortMenus.length = 0;
  for (let i = 0, len = tableData.length; i < len; i++) {
    const item = tableData[i];
    if ((item.parentId || "") === parentId) {
      // 最小化对象创建
      parentGroup.sortMenus.push({
        id: item.id,
        // 移除不必要的title属性
        sort: item.sort,
        parentId: item.parentId,
      });
    }
  }

  draggedMenuMap.set(parentKey, parentGroup);
}, 200);

// 处理菜单拖拽排序事件 - 优化内存使用
const rowDragendEvent = ({ dragRow }) => {
  if (!xGrid2.value || !dragRow) return;
  // 获取表格当前的数据
  const tableData = xGrid2.value.getTableData().tableData;
  // 使用防抖函数处理，减少频繁计算
  debouncedRowDragend(dragRow, tableData);
};

const sortConfig = {
  field: "sort",
  order: "asc",
  remote: false, // 使用本地排序而不是远程排序
};

// 拖拽保存菜单排序 - 优化数据转换
const dragMenuSave = () => {
  // 从WeakMap转换为数组格式
  const draggedMenuArray = [];
  draggedMenuMap.forEach((group) => {
    draggedMenuArray.push(group);
  });
if (!draggedMenuArray.length) return message.warning("请先拖拽排序");
tableLoading.value = true;
  updateMenuSortApi(draggedMenuArray).then((res) => {
    if (res.code === 200) {
      message.success("菜单排序更新成功");
      // 清理WeakMap中的数据
      draggedMenuMap.clear();
      // 刷新菜单数据
      refreshMenu();
    } else {
      message.error(res.msg || "菜单排序更新失败");
    }
    tableLoading.value = false;
  });
};

onMounted(() => {
  // 加载菜单数据
  getMenusList();
  // 获取分类数据
  getMenuClassify();
});

function confirmDeleteMenu(item) {
  if (!item || !item.id) return;
  delMenuApi({ id: item.id }).then((res) => {
    // 先清理缓存再重新获取数据
    draggedMenuMap.clear();
    getMenusList();
    refreshMenu();
  });
}

/**
 * 将菜单列表转换为树结构 - 优化内存使用
 * @param {Array} menuList - 原始菜单列表
 */
const getTreeMenu = (menuList) => {
  if (!menuList || !menuList.length) {
    treeMenuData = [];
    return;
  }

  // 先对菜单列表进行排序
  const sortedMenuList = [...menuList].sort((a, b) => {
    const aSort = a.sort || 0;
    const bSort = b.sort || 0;
    return aSort - bSort;
  });

  // 使用局部变量构建树结构
  const map = Object.create(null); // 使用Object.create(null)避免原型链查找
  const result = [];
  const len = sortedMenuList.length;

  // 单次遍历构建树结构，避免两次遍历
  for (let i = 0; i < len; i++) {
    const item = sortedMenuList[i];
    const id = item.id;

    // 如果节点不存在，则创建
    if (!map[id]) {
      map[id] = { children: [] };
    }

    // 合并属性，避免完整复制对象
    Object.assign(map[id], item);

    const parentId = item.parentId;

    if (!parentId || parentId === null) {
      // 顶级节点
      result.push(map[id]);
    } else {
      // 确保父节点存在
      if (!map[parentId]) {
        map[parentId] = { children: [] };
      }
      // 子节点，挂到父节点下
      map[parentId].children.push(map[id]);
    }
  }
  treeMenuData = JSON.parse(JSON.stringify(result));
  // 初始化，拆分菜单数据用于懒加载
  const { topLevelMenus, childrenMap } = splitMenuDataForLazyLoad(result);
  // 直接赋值
  topLevelMenuList = topLevelMenus;
  console.log("childrenMap:", childrenMap);
  childrenMapList = childrenMap;
  // 复制原始子菜单映射到完整子菜单映射
  childrenMapList.forEach((children, parentId) => {
    completeChildrenMap.set(parentId, [...children]);
  });

  defaultSort();
};

// 默认排序
const defaultSort = () => {
  // 为顶级菜单排序
  if (topLevelMenuList && topLevelMenuList.length > 0) {
    topLevelMenuList.sort((a, b) => {
      const sortA = a.sort || a.orderNum || 0;
      const sortB = b.sort || b.orderNum || 0;
      return sortA - sortB;
    });
  }

  // 为所有子菜单排序
  childrenMapList.forEach((children, parentId) => {
    if (children && children.length > 0) {
      children.sort((a, b) => {
        const sortA = a.sort || a.orderNum || 0;
        const sortB = b.sort || b.orderNum || 0;
        return sortA - sortB;
      });
    }

    // 同步更新完整子菜单映射
    if (completeChildrenMap.has(parentId)) {
      completeChildrenMap.set(parentId, [...children]);
    }
  });
};
function getMenusList() {
  tableLoading.value = true;
  getMenusListApi({})
    .then((value) => {
      // 使用局部变量缓存数据
      const data = value.data || [];

      // 先创建树结构
      getTreeMenu(data);
    })
    .finally(() => {
      tableLoading.value = false;
    });
}

function edit(pam) {
  title.value = "编辑";
  open.value = true;
  // 创建副本避免修改原始数据
  editData.value = { ...pam };
}

function add(pam) {
  title.value = "新增";
  open.value = true;
  // 创建副本避免修改原始数据
  editData.value = { ...pam };
}

function addOneMenu() {
  title.value = "添加一级菜单";
  open.value = true;
  // 添加一级菜单
  const maxSort = getMaxMenuSort() + 1;
  addOrEditRef.value.setParentMenu(maxSort);
}

const getMaxMenuSort = () => {
  let maxSort = 0;
  // 使用局部变量缓存treeMenuData，减少响应式访问
  const menuData = topLevelMenuList;
  // 缓存长度属性
  const len = menuData.length;

  // 直接循环获取最大值，避免额外的属性访问
  for (let i = 0; i < len; i++) {
    const item = menuData[i];
    if (item && item.sort > maxSort) {
      maxSort = item.sort;
    }
  }
  return maxSort;
};

function close() {
  title.value = "";
  open.value = false;
  // 清空对象而不是创建新对象
  Object.keys(editData.value).forEach((key) => {
    delete editData.value[key];
  });
}

// 组件卸载前清理资源，避免内存泄漏
onBeforeUnmount(() => {
  // 清理拖拽数据
  draggedMenuMap.clear();
  // 清空响应式数据
  originalData.value = [];
  classifyList.value = [];
  classifyMap.value = {};
  // 清空editData
  Object.keys(editData.value).forEach((key) => {
    delete editData.value[key];
  });
});

// 已在上面的onMounted中处理
</script>

<style scoped lang="less">
.spacing {
  margin-right: 10px;
}

/* 优化样式选择器，减少深度选择器的使用 */
:deep(.ant-card) {
  padding: 6px;
}
:deep(.mytable-style.vxe-table) {
  color: rgba(0, 0, 0, 0.8);
  /* 减少重绘和回流 */
  will-change: transform;
  /* 禁用动画效果以提高性能 */
  transition: none;
}
:deep(.mytable-style.vxe-table .vxe-header--column) {
  color: rgba(0, 0, 0, 0.88);
}
:deep(
    .vxe-table--render-default .vxe-cell--tree-btn .vxe-table-icon-caret-right
  ) {
  color: rgba(0, 0, 0, 0.8);
  /* 提升图标响应速度 */
  pointer-events: auto;
}
:deep(.vxe-table--render-default .vxe-cell--tree-btn) {
  /* 修改为使用flex布局实现完美居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(20%, 0);
  border-radius: 8px;
  /* 扩大点击区域：增大内边距 */
  padding: 12px 10px 12px 12px;
  margin: -12px -10px -12px -12px;
  cursor: pointer;
  border: 1px solid transparent;
}
:deep(.vxe-table--render-default .vxe-cell--tree-btn):hover {
  border: 1px solid #69b1ff;
}

/* 优化菜单标题容器样式 */
.menu-title-container {
  display: flex;
  align-items: center;
  gap: 4px;
  /* 避免不必要的重绘 */
  transform: none;
}
</style>
