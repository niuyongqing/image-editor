<template>
  <div ref="tableContainerParent">
    <a-card style="margin-top: 10px">
      <div style="margin-bottom: 10px; text-align: left">
        <a-button class="spacing" type="primary" @click="addOneMenu"
          >添加</a-button
        >
        <a-button class="spacing" type="primary" @click="dragMenuSave"
          >拖拽保存</a-button
        >
      </div>
      <div
        :style="{ width: autoWidth }"
        class="table-container"
        ref="tableContainer"
      >
        <vxe-table
          border
          ref="xGrid2"
          height="1160"
          header-align="center"
          :sort-config="sortConfig"
          :row-drag-config="rowDragConfig"
          :column-config="columnConfig"
          class="mytable-style"
          :loading="tableLoading"
          :data="newTopLevelMenuList"
          :row-config="{
            keyField: 'id',
            drag: true,
            isHover: true,
            isCurrent: true,
          }"
          :tree-config="treeConfig"
          :scroll-y="{ enabled: true, gt: 100 }"
          @cell-dblclick="cellDblclickEvent"
          @row-dragend="rowDragendEvent"
        >
          <vxe-column
            type="seq"
            fixed="left"
            align="center"
            width="80"
          ></vxe-column>
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
          <vxe-column field="sort" align="center" title="排序" width="80" />
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
          <vxe-column field="hideInMenu" align="center" title="是否隐藏">
            <template #default="{ row }">
              <a-tag :color="row.hideInMenu ? '#f50' : '#2db7f5'">
                {{ row.hideInMenu ? "是" : "否" }}
              </a-tag>
            </template>
          </vxe-column>
          <vxe-column field="keepAlive" align="center" title="是否保活">
            <template #default="{ row }">
              <a-tag :color="row.keepAlive ? '#f50' : '#2db7f5'">
                {{ row.keepAlive ? "是" : "否" }}
              </a-tag>
            </template>
          </vxe-column>
          <vxe-column title="操作" fixed="right" align="center">
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
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
import { h } from "vue";
import { useLayoutState } from "~/layouts/basic-layout/context.js";
const { collapsed } = useLayoutState();
const tableContainerParent = ref(null);
let timer1 = null;
const autoWidth = ref("2240px");
watch(
  () => collapsed.value,
  (newVal) => {
    timer1 = setTimeout(() => {
      autoWidth.value = tableContainerParent.value.clientWidth - 40 + "px";
    }, 220);
  }
);

// 配置图标 - 使用VXETable的箭头图标名称
VXETable.setIcon({
  "vxe-icon-arrow-right": (renderOpts) =>
    h(DownOutlined, { class: renderOpts.className }),
  "vxe-icon-arrow-down": (renderOpts) =>
    h(UpOutlined, { class: renderOpts.className }),
});

// 使用更高效的同步引入方式加载图标组件，避免展开时的异步加载延迟
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import AddOrEdit from "~/pages/system/menu/component/addOrEdit.vue";
import { message } from "ant-design-vue";
import "vxe-table/lib/style.css";
import { useRouter } from "vue-router";
const router = useRouter();

// 在组件中引入userStore
import { useUserStore } from "~/stores/user.js";

const newTopLevelMenuList = ref([]);

// 更新菜单数据
const refreshMenu = async () => {
  const userStore = useUserStore();
  const currentRoute = await userStore.generateDynamicRoutes();
  // 更新路由
  router.removeRoute(currentRoute.name);
  router.addRoute(currentRoute);
  // let rootPath = router.getRoutes().find(i => i.name === currentRoute.name)
  // console.log({
  //   router: router.getRoutes(),
  //   hasRoute: router.hasRoute(currentRoute.name),
  //   rootPath
  // });
};
const tableContainer = ref(null);
const originalData = ref([]); // 只保留一个数据源
// 使用局部常量代替响应式对象，减少内存占用
const rowConfig = {
  drag: true,
  isHover: true,
  isCurrent: true,
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

// index.vue 约 157 行
const treeConfig = ref({
  transform: true, // 开启平行数组自动转换
  rowField: "id", // 对应数据中的 id
  parentField: "parentId", // 对应数据中的 parentId
  lazy: false, // 关闭懒加载，解决顶级菜单虚增问题
  hasChild: "hasChild",
  reserve: true, // 核心：数据更新后自动保留展开状态
  trigger: "row",
  iconClose: "vxe-icon-arrow-right",
  iconOpen: "vxe-icon-arrow-down",
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
let timer = null;
function debounce(fn, delay = 100) {
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

// 2. 修改 getMenusList：对接平行数组，移除懒加载逻辑
function getMenusList() {
  tableLoading.value = true;
  getMenusListApi({})
    .then((value) => {
      const data = value.data || [];

      // 预排序：确保 transform 渲染后的同级顺序正确
      const sortedMenuList = [...data].sort(
        (a, b) => (a.sort || 0) - (b.sort || 0)
      );

      // 直接保存全量平行数组
      topLevelMenuList = sortedMenuList;

      newTopLevelMenuList.value = topLevelMenuList;
      // 构建嵌套树，供 addOrEdit 弹窗的 a-tree-select 使用
      buildTreeForComponent(sortedMenuList);
    })
    .finally(() => {
      tableLoading.value = false;
    });
}

// 3. 新增辅助函数：为弹窗组件构建嵌套树（因为 a-tree-select 需要 children 结构）
const buildTreeForComponent = (flatData) => {
  const map = Object.create(null);
  const result = [];
  flatData.forEach((item) => {
    map[item.id] = { ...item, title: item.title, key: item.id, children: [] };
  });
  flatData.forEach((item) => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      result.push(map[item.id]);
    }
  });
  treeMenuData = result; // 响应式更新弹窗中的树
};

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
  timer = null;
  clearTimeout(timer1);
});

</script>

<style scoped lang="less">
.table-container {
  margin: 0 auto;
}

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
  pointer-events: auto;
}

:deep(.vxe-table--render-default .vxe-cell--tree-btn) {
  /* 修改为使用flex布局实现居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(20%, 1);
  border-radius: 8px;
}

:deep(.vxe-table--render-default .vxe-cell--tree-btn > i) {
  transform: scale(0.8);
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
