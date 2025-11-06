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
      class="w-100% flex-shrink-0 ant-pro-sider-collapsed-button menuCollapsedIcon"
      :class="
        theme === 'inverted' ? 'ant-pro-sider-collapsed-button-inverted' : ''
      "
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
              <UserOutlined />
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
          <div class="setMenu-Icon" @click="setMenu">
            <svg
              t="1762327242398"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="21782"
              width="30"
              height="30"
            >
              <path
                d="M762.92515 749.271817v0.288959c6.609947 15.676049 18.818483 28.318025 34.241693 35.433651a59.236684 59.236684 0 0 0 49.845503 0c16.940247-6.068148 30.232381-19.577002 35.975449-36.661729a62.884797 62.884797 0 0 0-37.167407-81.7394 62.415238 62.415238 0 0 0-48.364586 0c-7.585185 3.323034-14.303492 8.271464-19.757601 14.484092a78.669206 78.669206 0 0 0-12.967055 19.721481c-3.467513 7.404586-5.16515 15.53157-5.02067 23.622434-0.505679 8.415944 0.650159 16.831887 3.214674 24.850512m-136.497213-49.303704a11.377778 11.377778 0 0 1 5.562469-6.176508 8.849383 8.849383 0 0 1 7.043386 0c9.282822 0.10836 18.457284-1.805996 26.873227-5.634709 7.838025-3.937072 14.014533-10.547019 17.373686-18.637884 3.142434-8.271464 3.648113-17.337566 1.480918-25.934109a40.237601 40.237601 0 0 0-12.967055-21.274638 7.693545 7.693545 0 0 1-3.792593-3.828713 13.111534 13.111534 0 0 1-1.842116-5.923668 41.899118 41.899118 0 0 1 12.750335-24.453193c5.923668-6.393228 13.003175-11.558377 20.877319-15.35097a10.691499 10.691499 0 0 1 8.560424 0 20.805079 20.805079 0 0 1 7.729664 4.370512c5.34575 6.176508 12.641975 10.3303 20.62448 11.847337 8.524303 1.733757 17.337566 0.758519 25.320071-2.672875 8.126984-3.142434 14.809171-9.102222 18.926843-16.759647 4.262152-6.898907 6.212628-14.953651 5.562469-23.080635a28.859824 28.859824 0 0 1 0-8.271464 9.391182 9.391182 0 0 1 5.959788-6.212628c7.946384-3.034074 16.290088-4.731711 24.814392-4.98455 9.752381-1.372557 19.649242 1.083598 27.667866 6.826666 1.300317 1.372557 2.167196 3.106314 2.383915 5.020671a32.435697 32.435697 0 0 0 0 5.923668c1.697637 6.718307 4.117672 13.256014 7.368466 19.468642 3.611993 8.632663 10.3303 15.639929 18.818483 19.468642 8.271464 2.492275 17.120847 2.492275 25.35619 0 8.163104-2.022716 15.60381-6.212628 21.527478-12.136296a13.544974 13.544974 0 0 1 11.847337-5.634709 32.616296 32.616296 0 0 1 20.082681 11.522257c5.670829 5.634709 10.22194 12.244656 13.581093 19.504762 1.191958 3.286914 1.805996 6.790547 1.733757 10.3303a8.849383 8.849383 0 0 1-2.672875 7.657425 53.096296 53.096296 0 0 0-13.508853 22.719436 34.313933 34.313933 0 0 0 18.276684 44.571993c8.415944 3.792593 17.590406 5.815309 26.837108 5.887548a6.754427 6.754427 0 0 1 5.887548 1.480917c2.203316 1.444797 3.937072 3.539753 5.02067 5.887549 4.153792 8.271464 6.212628 17.373686 5.887549 26.584268 1.047478 8.704903-1.011358 17.482046-5.887549 24.814391a25.031111 25.031111 0 0 1-10.00522 4.695591 73.431817 73.431817 0 0 0-29.473863 11.522258 24.850511 24.850511 0 0 0-9.138342 12.750335 36.04769 36.04769 0 0 0 0 23.550194c2.383915 7.260106 6.790547 13.725573 12.678095 18.637883a22.863915 22.863915 0 0 1 7.693545 8.271464c0.722399 2.022716 0.722399 4.189912 0 6.212628a51.39866 51.39866 0 0 1-13.003174 22.755556c-5.670829 6.862787-12.569735 12.678095-20.33552 17.120846a16.073369 16.073369 0 0 1-18.818484-2.636755 40.99612 40.99612 0 0 0-22.177636-13.581093 41.248959 41.248959 0 0 0-26.837108 1.769876 37.203527 37.203527 0 0 0-18.818483 17.951605c-4.045432 7.874145-5.995908 16.615168-5.562469 25.464551a11.919577 11.919577 0 0 1-7.079507 12.678095 67.219189 67.219189 0 0 1-25.35619 5.02067 41.17672 41.17672 0 0 1-22.394356-4.117672 16.217848 16.217848 0 0 1-7.404586-15.38709c0-8.271464-2.094956-16.542928-5.887548-23.875273a31.207619 31.207619 0 0 0-18.601764-15.965009 36.950688 36.950688 0 0 0-25.68127 0 45.800071 45.800071 0 0 0-18.601763 11.233298 22.755556 22.755556 0 0 1-6.790547 5.02067 28.715344 28.715344 0 0 1-9.752381 1.191958 39.370723 39.370723 0 0 1-22.105397-13.256014 43.813474 43.813474 0 0 1-14.159012-22.141517 17.987725 17.987725 0 0 1 2.925714-10.005221 22.069277 22.069277 0 0 0 2.636755-5.309629 37.203527 37.203527 0 0 0 12.136296-21.238519c1.553157-8.307584 0.758519-16.940247-2.347795-24.850511a38.792804 38.792804 0 0 0-17.409806-19.468642 46.414109 46.414109 0 0 0-26.837108-5.887549 16.976367 16.976367 0 0 1-7.657425-2.383915 13.653333 13.653333 0 0 1-5.887548-8.488183 82.714638 82.714638 0 0 1-3.575873-23.947514c-0.541799-6.971146 0.361199-13.761693 2.564515-20.22716"
                fill="#ffffff"
                p-id="21783"
                data-spm-anchor-id="a313x.search_index.0.i3.143d3a81Y7o2xZ"
                class="selected"
              ></path>
              <path
                d="M65.629912 104.747795a55.335732 55.335732 0 1 1 0 110.671464 55.335732 55.335732 0 0 1 0-110.671464zM240.84769 113.994497h719.364515a46.12515 46.12515 0 0 1 0 92.21418H240.84769a46.08903 46.08903 0 1 1 0-92.21418zM65.629912 381.462575a55.335732 55.335732 0 1 1 0 110.671464 55.335732 55.335732 0 0 1 0-110.671464zM240.84769 390.673157h719.364515a46.12515 46.12515 0 0 1 0 92.21418H240.84769a46.08903 46.08903 0 1 1 0-92.21418zM65.629912 667.351817a55.371852 55.371852 0 1 1-0.07224 110.743703 55.371852 55.371852 0 0 1 0.07224-110.743703zM240.84769 676.562399h258.221375a46.08903 46.08903 0 1 1 0 92.214179H240.84769a46.12515 46.12515 0 0 1 0-92.214179z"
                fill="#ffffff"
                p-id="21784"
              ></path>
            </svg>
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
import DrawerMenu from "../menu/drawer-menu.vue";
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
  .setMenu-Icon {
    width: 30px;
    height: 30px;
    padding-top: 3px;
  }
}
.RightCircleOutlinedSvg {
 background: #1677ff;
//  background: linear-gradient(to right, #1c1866, #6366f1);
 border-radius: 50%;
 padding: 5px;
 padding-left:6px;
}
.rotate-180 {
  transform: rotate(180deg);
}
</style>
