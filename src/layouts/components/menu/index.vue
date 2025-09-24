
<template>
  <div>
    <!-- :open-keys="collapsed ? [] : openKeys" -->
    <a-menu
      :inlineCollapsed="false"
      :mode="'inline'"
      :theme="menuTheme"
      :style="{ width: '200px' }"
      class="ant-pro-sider-menu"
      :selectedKeys="selectedKeys"
      @update:selectedKeys="handleSelectedKeys"
    >
      <div class="recursive-menu-container">
        <template v-for="item in selectedMenus">
          <template v-if="!item.hideInMenu">
            <RecursiveMenu
              :key="item.path"
              :item="item"
            />
          </template>
        </template>
      </div>
    </a-menu>
    
  </div>
</template>


<script setup>
  import { message } from 'ant-design-vue'
  import { editCommonUseMenu } from '~/api/common/menu.js'
  import AsyncIcon from '~/layouts/components/menu/async-icon.vue'
  import { useLayoutState } from '../../basic-layout/context.js'
  import { useRoute, useRouter } from 'vue-router'
  import { isFunction } from '@v-c/utils'
  import { ref, reactive, computed, watch } from 'vue'
  import RecursiveMenu from './recursive-menu.vue'
  
  const { theme, layout, isMobile, selectedMenus, selectedKeys, handleSelectedKeys } = useLayoutState()
  const router = useRouter()
  const route = useRoute()
  
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

</script>

<style scoped lang="less">

</style>
