<template>
  <div v-if="fixedSider" />
  <a-layout-sider
    style="position: relative; z-index: 9999"
    v-if="splitMenus ? (selectedMenus ?? []).length > 0 : true"
    :theme="theme === 'inverted' ? 'dark' : 'light'"
    :trigger="null"
    :collapsed-width="collapsedWidth"
    :width="siderWidth"
    collapsible
    :collapsed="collapsed"
    :class="cls"
    :style="siderStyle"
  >
    <div
      v-if="showLogo"
      class="ant-pro-sider-logo"
      :class="collapsed && !isMobile ? 'ant-pro-sider-collapsed' : ''"
    >
      <a>
        <img :src="logo" alt="logo" />
        <h1 v-if="!collapsed || isMobile">{{ title }}</h1>
      </a>
    </div>
    <div class="flex-1 of-x-hidden of-y-auto scrollbar">
      <Menu />
    </div>
    <!-- 常驻菜单模板 -->
    <!-- 引入新的抽屉菜单组件 -->
    <DrawerMenu
      ref="drawerMenuRef"
      :selectedMenus="selectedMenus"
      :collapsed="collapsed"
      :open="drawerOpen"
      @close="onDrawerClose"
      :padding-left="paddingLeft"
    />
    <!-- 收缩按钮 -->
    <div
      v-if="!isMobile"
      @click="handleCollapsedFun(!collapsed)"
      class="w-100% flex-shrink-0 ant-pro-sider-collapsed-button menuCollapsedIcon"
      :class="
        theme === 'inverted' ? 'ant-pro-sider-collapsed-button-inverted' : ''
      "
    >
      <LeftCircleTwoTone v-if="!collapsed" />
      <RightCircleTwoTone v-else />
    </div>

    <!-- 设置按钮 -->
    <a-tooltip placement="top" :z-index="999999" color="#1677ff">
      <template #title>
        <span>设置常驻菜单</span>
      </template>
      <div
        v-if="!isMobile"
        @click="setMenu"
        class="w-100% flex-shrink-0 ant-pro-sider-collapsed-button menuSetIcon"
        :class="
          theme === 'inverted' ? 'ant-pro-sider-collapsed-button-inverted' : ''
        "
      >
        <svg
          t="1762150486483"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="21808"
          width="24"
          height="24"
        >
          <path
            d="M845.59 959.04H176.74c-19.56 0-35.41-15.85-35.41-35.41V97.4c0-19.56 15.85-35.41 35.41-35.41h480.74c10.26 0 20.02 4.46 26.74 12.2l188.11 216.89a35.416 35.416 0 0 1 8.66 23.21v609.33c0.01 19.57-15.84 35.42-35.4 35.42z m-633.44-70.82h598.04V327.51l-168.86-194.7H212.15v755.41z"
            fill="#ffffff"
            p-id="21809"
          ></path>
          <path
            d="M376.02 771.06c-7.38 0-14.72-2.31-20.92-6.84a35.434 35.434 0 0 1-13.77-35.67l26.78-130.56-99.38-90.14c-10.32-9.34-14.18-23.86-9.91-37.1a35.35 35.35 0 0 1 29.72-24.3l134.38-15.23 56.12-121.45a35.395 35.395 0 0 1 32.14-20.56c13.81 0 26.36 8.03 32.14 20.56l56.1 121.45 134.4 15.23a35.393 35.393 0 0 1 29.72 24.3c4.26 13.26 0.4 27.76-9.91 37.1l-99.4 90.14 26.78 130.56a35.434 35.434 0 0 1-13.77 35.67c-11.2 8.18-26.11 9.13-38.17 2.34l-117.88-65.8-117.9 65.8a35.31 35.31 0 0 1-17.27 4.5zM374.29 508l56.35 51.1a35.35 35.35 0 0 1 10.91 33.33l-15.31 74.63 67.68-37.77a35.364 35.364 0 0 1 34.5 0l67.66 37.77-15.31-74.63a35.342 35.342 0 0 1 10.91-33.33l56.35-51.1-76.38-8.66a35.342 35.342 0 0 1-28.16-20.33l-32.31-69.97-32.33 69.97a35.392 35.392 0 0 1-28.16 20.33l-76.4 8.66z"
            fill="#ffffff"
            p-id="21810"
          ></path>
        </svg>
      </div>
    </a-tooltip>

    <!-- 个人设置菜单 -->
    <div
      v-if="!isMobile && leftCollapsed"
      @click="gotoSetting"
      class="w-100% flex-shrink-0 ant-pro-sider-collapsed-button goto"
      :class="
        theme === 'inverted' ? 'ant-pro-sider-collapsed-button-inverted' : ''
      "
    >
      <div>
        <a-popover placement="right">
          <template #content>
            <div style="display: inline">
              <a-button class="out-and-goto" @click="out">退出登录</a-button>
            </div>
          </template>
          <div>
            <div
              style="display: flex; justify-content: center; border-radius: 50%"
            >
              <img
                v-if="userInfo?.sysUser?.avatar"
                :src="`${baseApi}${userInfo.sysUser.avatar}`"
                alt="avatar"
                style="width: 30px; height: 30px; border-radius: 50%"
              />
              <a-avatar v-else :size="30">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
            </div>
            <div
              class="truncate font-bold p-1"
              style="text-align: center"
              :text="userInfo?.userInfo?.username"
            >
              {{ userInfo ? userInfo.username : "" }}
            </div>
          </div>
        </a-popover>
      </div>
    </div>
  </a-layout-sider>
</template>
<script setup>
import { message } from "ant-design-vue";
import { useLayoutState } from "../../basic-layout/context.js";
import Menu from "../menu/index.vue";
import { useUserStore } from "~/stores/user.js";
import { useMultiTab } from "~/stores/multi-tab.js";
import { useLayoutMenu } from "~/stores/layout-menu.js";
import DrawerMenu from "../menu/drawer-menu.vue";
import {
  UserOutlined,
  LeftCircleTwoTone,
  RightCircleTwoTone,
  StepForwardOutlined,
  StepBackwardOutlined,
} from "@ant-design/icons-vue";
import { shallowRef, ref } from "vue";

const baseApi = import.meta.env.VITE_APP_BASE_API_DEV || "";
// 抽屉菜单的打开状态
const drawerOpen = ref(false);
const router = useRouter();
const userStore = useUserStore();
const multiTabStore = useMultiTab();
const layoutMenuStore = useLayoutMenu();
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
} = useLayoutState();
const prefixCls = shallowRef("ant-pro-sider");

const userInfo = computed(() => {
  return useUserStore().userInfo;
});

const siderStyle = computed(() => {
  const style = {
    paddingTop: `${
      layout.value !== "side" && !isMobile.value ? headerHeight.value : 0
    }px`,
    // 保留完整的过渡效果，同时优化性能
    transition:
      "transform 0.3s ease 0s, width 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s,",
    willChange: "transform, width, min-width, max-width",
    transform: "translateZ(0)",
    // 添加硬件加速
    backfaceVisibility: "hidden",
    // 使用CSS硬件加速的更多属性
    perspective: "1000px",
    // 减少布局重排
    contain: "layout style",
  };
  if (layout.value === "mix" && header.value === false)
    style.paddingTop = "0px";
  return style;
});
const cls = computed(() => ({
  [prefixCls.value]: true,
  [`${prefixCls.value}-fixed`]: fixedSider.value,
  [`${prefixCls.value}-layout-${layout.value}`]: !!layout.value,
}));
const showLogo = computed(() => {
  return (layout.value === "side" || isMobile.value) && layout.value !== "mix";
});
const drawerMenuRef = ref(null);

// 处理抽屉关闭事件
const onDrawerClose = () => {
  drawerOpen.value = false;
};

// 设置常驻菜单模板打开
const setMenu = () => {
  // 仅控制抽屉开关
  drawerOpen.value = !drawerOpen.value;
  // 抽屉展开时同步 paddingLeft
  paddingLeft.value = collapsed.value ? "50px" : "200px";
};
const paddingLeft = ref("200px");
const handleCollapsedFun = (isFlag) => {
  handleCollapsed(isFlag);
  // 抽屉菜单的paddingLeft根据菜单是否折叠而变化
  if (isFlag) {
    paddingLeft.value = "50px";
  } else {
    paddingLeft.value = "200px";
  }
};

const gotoSetting = () => {
  router.push("/platform/setting");
};

async function out() {
  const hide = message.loading("退出登录...", 0);
  try {
    await userStore.logout();
  } finally {
    hide();
    message.success("退出登录成功", 3);
    router
      .push({
        path: "/platform/login",
      })
      .then(() => {
        multiTabStore.clear();
        layoutMenuStore.clear();
      });
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
@import "./index.less";
.menuSetIcon {
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  padding-left: 3px;
}

.goto {
  display: inline;
  margin-bottom: 5px;
}

.goto :hover {
  background-color: #1677ff;
  cursor: pointer;
}

.menuCollapsedIcon {
  width: 30px;
  text-align: center;
  overflow: hidden;
  font-size: 22px;
  position: absolute;
  top: 50%;
  right: -15px;
  cursor: pointer;
  z-index: 999999999999;
  // 硬件加速
  transform: translateY(-50%) translateZ(0);
  will-change: transform;
}
</style>
