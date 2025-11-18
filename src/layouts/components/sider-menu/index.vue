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
      v-if="!isMobile"
      ref="drawerMenuRef"
      :selectedMenus="selectedMenus"
      :collapsed="collapsed"
      :open="drawerOpen"
      @close="onDrawerClose"
      :padding-left="paddingLeft"
    />
    <!-- 收缩按钮 -->
    <div
      @click="handleCollapsedFun(!collapsed)"
      class="w-100% flex-shrink-0  menuCollapsedIcon"
    >
      <svg
        t="1762393332550"
        class="RightCircleOutlinedSvg"
        :class="collapsed ? 'rotate-180' : ''"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="44942"
        data-spm-anchor-id="a313x.search_index.0.i41.5ab93a81N7wBQc"
        width="24"
        height="24"
      >
        <path
          d="M303.8 989.24c-14.52 0-29.04-5.64-40.08-16.8-22.2-22.32-22.2-58.56 0-80.99999999L640.04 511.76 263.72 131.95999999c-22.2-22.32-22.2-58.68 0-80.99999999 22.2-22.44 58.08-22.44 80.39999999 0l416.40000001 420.36c22.2 22.32 22.2 58.68 1e-8 81L344.00000001 972.44c-11.16 11.28-25.56 16.8-40.20000001 16.8z"
          p-id="44943"
          fill="#ffffff"
        ></path>
      </svg>
      <!-- <RightCircleOutlined /> -->
      <!-- <LeftCircleTwoTone class="menuCollapsedIconColor1" v-if="!collapsed" />
      <RightCircleTwoTone class="menuCollapsedIconColor1" v-else /> -->
    </div>

    <!-- 个人设置菜单 -->
    <div v-if="!isMobile">
      <div class="setMenu-box">
        <a-tooltip placement="top" :z-index="999999" color="#1677ff">
          <template #title>
            <div style="display: inline">
              <a-button class="out-and-goto" @click="out">退出登录</a-button>
            </div>
          </template>
          <img
            v-if="userInfo?.sysUser?.avatar"
            @click="gotoSetting"
            :src="`${baseApi}${userInfo.sysUser.avatar}`"
            alt="avatar"
            style="width: 30px; height: 30px; border-radius: 50%"
          />
          <a-avatar v-else :size="30">
            <template #icon>
              <UserOutlined  @click="gotoSetting"/>
            </template>
          </a-avatar>
        </a-tooltip>
        <!-- 设置按钮 -->
        <a-tooltip
          v-if="!collapsed"
          placement="top"
          :z-index="999999"
          color="#1677ff"
        >
          <template #title>
            <span>设置常驻菜单</span>
          </template>
          <div class="borderIcon" style="margin-left: 1px" @click="setMenu">
            <svg
              t="1762493800185"
              style="margin-top: 3px"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4574"
              width="24"
              height="24"
            >
              <path
                d="M33.28 151.552h909.824v118.784h-909.824zM33.28 451.072h403.456v118.784h-403.456zM33.28 753.664h424.96v118.784h-424.96zM985.6 559.104c-30.208 4.096-61.952-11.776-79.872-41.984-17.92-30.72-14.848-67.072 4.608-91.136-26.624-24.576-58.368-43.52-94.208-55.296-10.752 29.184-40.96 50.176-76.8 50.176s-66.048-20.992-76.8-50.176c-35.328 11.264-67.072 30.208-93.696 54.784 19.456 24.576 22.016 60.928 4.608 91.136s-49.664 45.568-79.872 41.472c-3.584 16.896-5.632 34.304-5.632 52.224 0 19.456 2.048 38.4 6.656 56.832 29.696-3.072 61.44 12.288 78.336 41.984 16.896 29.184 14.848 63.488-2.048 87.552 26.624 24.064 58.368 42.496 93.696 53.248 12.288-26.624 40.96-45.056 74.752-45.056s61.952 18.432 74.752 45.056c34.816-10.752 66.56-29.184 93.184-52.736-17.92-23.552-19.456-58.368-2.56-87.04 16.896-29.696 48.64-45.056 78.336-41.984 4.608-18.432 6.656-37.888 6.656-57.856 1.024-17.408-1.024-34.304-4.096-51.2z m-246.272 160.768c-60.416 0-109.056-49.152-109.056-109.056 0-60.416 49.152-109.056 109.056-109.056s109.056 49.152 109.056 109.056c0.512 59.904-48.64 109.056-109.056 109.056z"
                p-id="4575"
                fill="#193f78"
              ></path>
            </svg>
          </div>
        </a-tooltip>
        <!-- 设置按钮 -->
        <a-tooltip
          v-if="!collapsed"
          placement="top"
          :z-index="999999"
          color="#1677ff"
        >
          <template #title>
            <span>设置布局风格</span>
          </template>
          <div class="borderIcon">
            <SettingOutlined
              @click="toggleSettingDrawer"
              :class="`${prefixCls}-handle-icon${
                theme === 'light' ? '' : '-dark'
              }`"
              style="font-size: 24px; color: #193f78; padding-top: 3px"
            />
          </div>
        </a-tooltip>
      </div>
      <!-- <div
              class="truncate font-bold p-1"
              style="text-align: center"
              :text="userInfo?.userInfo?.username"
            >
              {{ userInfo ? userInfo.username : "" }}
            </div> -->
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
import { useAppStore } from "~/stores/app.js";
import DrawerMenu from "../menu/drawer-menu.vue";
import { CloseOutlined, SettingOutlined } from "@ant-design/icons-vue";
import EventBus from "@/utils/event-bus";
import {
  UserOutlined,
  LeftCircleTwoTone,
  RightCircleTwoTone,
  StepForwardOutlined,
  StepBackwardOutlined,
  RightCircleOutlined,
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
  paddingLeft.value = collapsed.value ? "50px" : `${siderWidth.value}px`;
};
const paddingLeft = ref("200px");
const handleCollapsedFun = (isFlag) => {
  handleCollapsed(isFlag);
  // 抽屉菜单的paddingLeft根据菜单是否折叠而变化
  if (isFlag) {
    paddingLeft.value = "50px";
  } else {
    paddingLeft.value = `${siderWidth.value}px`;
  }
};
// 更新抽屉菜单打开状态
const toggleSettingDrawer = () => {
  // 从store中获取当前抽屉状态
  const appStore = useAppStore();
  const currentState = appStore.layoutSetting.drawerVisible;
  EventBus.emit('updateDrawerStateHandleVisible', !currentState);
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

.selected {
  background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
  color: white !important;
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

.setMenu-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
  .borderIcon {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background-color: #ffffff;
    text-align: center;
  }
}
.RightCircleOutlinedSvg {
  background: #1677ff;
  //  background: linear-gradient(to right, #1c1866, #6366f1);
  border-radius: 50%;
  padding: 5px;
  padding-left: 6px;
  transform: rotate(180deg);
}
.rotate-180 {
  transform: rotate(0);
}
</style>
