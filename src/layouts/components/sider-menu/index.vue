<script setup>

import {message} from "ant-design-vue";
import { useLayoutState } from '../../basic-layout/context.js'
import Menu from '../menu/index.vue'
import { useUserStore } from '~/stores/user.js'
import { UserOutlined } from '@ant-design/icons-vue'

const baseApi = import.meta.env.VITE_APP_BASE_API_DEV || ''
const router = useRouter()
const userStore = useUserStore()
const multiTabStore = useMultiTab()
const layoutMenuStore = useLayoutMenu()
const {
  collapsed,
  leftCollapsed,
  handleCollapsed,
  selectedMenus,
  splitMenus,
  layout,
  logo,
  theme,
  title,
  collapsedWidth,
  siderWidth,
  headerHeight,
  fixedSider,
  isMobile,
  header,
} = useLayoutState()
const prefixCls = shallowRef('ant-pro-sider')

const userInfo = computed(()=>{
  return  useUserStore().userInfo
})

const siderStyle = computed(() => {
  const style = {
    paddingTop: `${layout.value !== 'side' && !isMobile.value ? headerHeight.value : 0}px`,
    transition: 'background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s',
    overflow: 'hidden',
  }
  if (layout.value === 'mix' && header.value === false)
    style.paddingTop = '0px'
  return style
})
const cls = computed(() => ({
  [prefixCls.value]: true,
  [`${prefixCls.value}-fixed`]: fixedSider.value,
  [`${prefixCls.value}-layout-${layout.value}`]: !!layout.value,
}))
const showLogo = computed(() => {
  return (layout.value === 'side' || isMobile.value) && layout.value !== 'mix'
})

const gotoSetting = () =>{
  router.push("/platform/setting")
}

async function out(){
  const hide = message.loading('退出登录...', 0)
  try {
    await userStore.logout()
  }
  finally {
    hide()
    message.success('退出登录成功', 3)
    router.push({
      path: '/platform/login',
    }).then(() => {
      multiTabStore.clear()
      layoutMenuStore.clear()
    })
  }
}
</script>

<template>
  <div v-if="fixedSider"/>
  <a-layout-sider
      style="position: relative;z-index: 9999;"
    v-if="splitMenus ? (selectedMenus ?? []).length > 0 : true"
    :theme="theme === 'inverted' ? 'dark' : 'light'"
    :collapsed="collapsed && !isMobile"
    :trigger="null"
    :collapsed-width="collapsedWidth"
    :width="siderWidth"
    collapsible
    :class="cls"
    :style="siderStyle"
  >
    <div v-if="showLogo" class="ant-pro-sider-logo" :class="collapsed && !isMobile ? 'ant-pro-sider-collapsed' : ''">
      <a>
        <img :src="logo" alt="logo">
        <h1 v-if="!collapsed || isMobile">{{ title }}</h1>
      </a>
    </div>
    <div class="flex-1 of-x-hidden of-y-auto scrollbar">
      <Menu />
    </div>
    <!-- 个人设置菜单 -->
    <div
      v-if="!isMobile && leftCollapsed"
      @click="gotoSetting"
      class="w-100% flex-shrink-0 ant-pro-sider-collapsed-button goto"
      :class="theme === 'inverted' ? 'ant-pro-sider-collapsed-button-inverted' : ''"
    >
      <div>
        <a-popover placement="right">
          <template #content>
            <div style="display: inline">
              <a-button  class="out-and-goto" @click="out">退出登录</a-button>
            </div>
          </template>
          <div>
            <div style="display: flex;justify-content: center;border-radius: 50%">
              <img v-if="userInfo?.sysUser?.avatar" :src="`${baseApi}${userInfo.sysUser.avatar}`" alt="avatar" style="width: 30px;height: 30px;border-radius: 50%" />
              <a-avatar v-else :size="30">
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </div>
            <div class="truncate font-bold p-1" :text="userInfo?.userInfo?.username">{{userInfo?userInfo.username:""}}</div>
          </div>
        </a-popover>
      </div>
    </div>
  </a-layout-sider>
</template>

<style lang="less">
@import './index.less';
.goto{
  display: inline;
  margin-bottom: 5px;
}
.goto :hover{
  background-color: #1677FF;
  cursor: pointer;
}
</style>
