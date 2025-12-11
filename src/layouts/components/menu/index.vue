<template>
  <div>
    <div class="flex-1 of-x-hidden of-y-auto scrollbar">
      <a-menu
        :mode="'inline'"
        :theme="menuTheme"
        :style="{ width: '100%' }"
        :class="collapsed ? 'ant-pro-sider-menu' : ''"
        :selectedKeys="selectedKeys"
        :openKeys="openKeys"
        @update:selectedKeys="handleSelectedKeys"
        @openChange="onOpenChange"
      >
        <div class="recursive-menu-container">
          <template v-for="item in selectedMenus">
            <template v-if="!item.hideInMenu">
              <RecursiveMenu :key="item.path" :item="item" />
            </template>
          </template>
        </div>
      </a-menu>
    </div>
  </div>
</template>

<script setup>
// 导入必要的依赖
import { message } from "ant-design-vue";
import { editCommonUseMenu } from "~/api/common/menu.js";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { useLayoutState } from "../../basic-layout/context.js";
import { useLayoutMenu } from "~/stores/layout-menu.js";
import { useRoute, useRouter } from "vue-router";
import { isFunction } from "@v-c/utils";
import { ref, reactive, computed, watch } from "vue";
import RecursiveMenu from "./recursive-menu.vue";

// 菜单组件核心逻辑
const {
  theme,
  layout,
  isMobile,
  selectedMenus,
  selectedKeys,
  handleSelectedKeys,
  collapsed,
} = useLayoutState();
const router = useRouter();
const route = useRoute();

// 获取布局菜单store实例
const layoutMenuStore = useLayoutMenu();

// 更新当前路由的展开菜单项
const updateOpenKeysForCurrentRoute = () => {
  const currentRoute = router.currentRoute.value;
  const originPath = currentRoute.meta?.originPath ?? currentRoute.path;
  
  // 从菜单数据映射中找到当前路由对应的菜单项
  if (layoutMenuStore.menuDataMap.has(originPath)) {
    const menuItem = layoutMenuStore.menuDataMap.get(originPath);
    // 设置展开的菜单项为当前菜单项的所有父级路径
    if (menuItem?.matched) {
      openKeys.value = menuItem.matched.map(item => item.path);
    }
  }
};

// 展开的菜单键
const openKeys = ref([]);
// 之前展开的菜单键，用于收缩时保存状态
const preOpenKeys = ref([]);

// 计算菜单主题
const menuTheme = computed(() => {
  if (theme.value === "inverted") return "dark";
  return theme.value;
});

// 监听路由变化，更新菜单选中状态
watch(
  () => route.fullPath,
  (newPath) => {
    // 当路由变化时，更新选中的菜单项
    handleSelectedKeys([newPath]);

  },
  { immediate: true }
);

// 监听openKeys变化，保存上一次的展开状态
watch(
  () => openKeys.value,
  (newVal, oldVal) => {
    if (!collapsed.value) {
      preOpenKeys.value = oldVal || [];
    }
  },
  { deep: true }
);

// 监听收缩状态变化，管理展开的菜单
watch(
  () => collapsed.value,
  (newVal) => {
    if (newVal) {
      // 收缩时保存当前展开状态并清空
      preOpenKeys.value = [...openKeys.value];
      openKeys.value = [];
    } else {
      // 展开时恢复之前的展开状态
      openKeys.value = [...preOpenKeys.value];
    }
  }
);
let rootSubmenuKeys = computed(() => {
  return selectedMenus.value?.map(item => item.path) || [];
});

// 查找具有相同父级的菜单项
const findSiblingMenuKeys = (key) => {
  // 从菜单数据映射中找到当前菜单项
  const menuItem = layoutMenuStore.menuDataMap.get(key);
  if (!menuItem || !menuItem.parentId) {
    // 如果没有父级，则属于根级菜单
    return rootSubmenuKeys.value;
  }
  
  // 找到父级菜单项
  for (const [path, item] of layoutMenuStore.menuDataMap.entries()) {
    if (item.id === menuItem.parentId) {
      // 返回父级菜单的所有子菜单路径
      if (item.children && item.children.length) {
        return item.children.map(child => child.path);
      }
      break;
    }
  }
  
  // 如果找不到父级或父级没有子菜单，则返回根级菜单
  return rootSubmenuKeys.value;
};

// 处理菜单展开收起事件
const onOpenChange = (keys) => {
  // 手风琴模式 点开一个菜单的时候 关闭其他同级菜单
  const latestOpenKey = keys.find(key => openKeys.value.indexOf(key) === -1);
  
  if (latestOpenKey) {
    // 找到同级菜单项
    const siblingKeys = findSiblingMenuKeys(latestOpenKey);
    
    // 如果最新打开的菜单在同级菜单中，则只保留它和它的父级菜单
    if (siblingKeys.includes(latestOpenKey)) {
      // 保留所有非同级菜单的展开项
      const nonSiblingKeys = openKeys.value.filter(key => !siblingKeys.includes(key));
      openKeys.value = [...nonSiblingKeys, latestOpenKey];
    } else {
      // 如果不是同级菜单，则正常处理
      openKeys.value = keys;
    }
  } else {
    openKeys.value = keys;
  }
  
  // console.log(keys);
};

onMounted(() => {
  // 初始化时更新当前路由的展开菜单项
  updateOpenKeysForCurrentRoute();
  
});
</script>

<style scoped lang="less">
.ant-pro-sider-menu {
  ::v-deep(.ant-menu-submenu-title) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  ::v-deep(.ant-menu-submenu-arrow) {
    display: none !important;
  }
  ::v-deep(.ant-menu-item-icon) {
    scale: 1.5;
    // transform: translateX(4px);
  }
  /* 隐藏收缩状态下的一级菜单标题 */
  ::v-deep(.ant-menu-title-content) {
    display: none;
  }
  /* 确保一级子菜单标题在展开时正常显示 */
  ::v-deep(.ant-menu-sub.ant-menu-inline > .ant-menu-item > .ant-menu-title-content) {
    display: block;
  }
}
</style>

