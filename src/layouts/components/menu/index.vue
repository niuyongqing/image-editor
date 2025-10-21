
<template>
  <div>
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
            <RecursiveMenu
              :key="item.path"
              :item="item"
              :collapsed="collapsed"
            />
          </template>
        </template>
      </div>
    </a-menu>
  </div>
</template>


<script setup>
// 导入必要的依赖
import { message } from 'ant-design-vue'
import { editCommonUseMenu } from '~/api/common/menu.js'
import AsyncIcon from '~/layouts/components/menu/async-icon.vue'
import { useLayoutState } from '../../basic-layout/context.js'
import { useRoute, useRouter } from 'vue-router'
import { isFunction } from '@v-c/utils'
import { ref, reactive, computed, watch } from 'vue'
import RecursiveMenu from './recursive-menu.vue'
  
const { theme, layout, isMobile, selectedMenus, selectedKeys, handleSelectedKeys, collapsed } = useLayoutState()
const router = useRouter()
const route = useRoute()
  
// 展开的菜单键
const openKeys = ref([])
// 之前展开的菜单键，用于收缩时保存状态
const preOpenKeys = ref([])
  
// 计算菜单主题
const menuTheme = computed(() => {
  if (theme.value === 'inverted') return 'dark'
  return theme.value
})
  
// 监听路由变化，更新菜单选中状态
watch(
  () => route.fullPath,
  (newPath) => {
    // 当路由变化时，更新选中的菜单项
    handleSelectedKeys([newPath])
  },
  { immediate: true }
)

// 监听openKeys变化，保存上一次的展开状态
watch(
  () => openKeys.value,
  (newVal, oldVal) => {
    if (!collapsed.value) {
      preOpenKeys.value = oldVal || []
    }
  },
  { deep: true }
)

// 监听收缩状态变化，管理展开的菜单
watch(
  () => collapsed.value,
  (newVal) => {
    if (newVal) {
      // 收缩时保存当前展开状态并清空
      preOpenKeys.value = [...openKeys.value]
      openKeys.value = []
    } else {
      // 展开时恢复之前的展开状态
      openKeys.value = [...preOpenKeys.value]
    }
  }
)

// 处理菜单展开收起事件
const onOpenChange = (keys) => {
  // 直接保存当前展开状态
  preOpenKeys.value = keys;
}

</script>

<style scoped lang="less">
.ant-pro-sider-menu {
  ::v-deep(.ant-menu-submenu-arrow) {
    display: none !important;
  }
  ::v-deep(.ant-menu-item-icon) {
    scale: 1.5;
  }
}
</style>
