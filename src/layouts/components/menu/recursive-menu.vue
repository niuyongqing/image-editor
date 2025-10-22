<template>
  <template
    v-if="item.children && item.children.length > 0 && !item.hideChildrenInMenu"
  >
    <a-sub-menu
      :key="item.path"
      placement="right"
      v-if="item.commonUse !== 0 || menuType === 'drawer'"
    >
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template #title>
        <span>
          {{ renderTitle(item.title) }}
        </span>
        <a-tooltip v-if="menuType === 'drawer'" placement="top">
          <template #title>
            {{ item.commonUse === 0 ? "点击收藏" : "取消收藏" }}
          </template>
          <img
            @click.stop="startCollect(item)"
            class="startIcon"
            :src="item.commonUse === 0 ? noStartIcon : startIcon"
            alt=""
          />
        </a-tooltip>
      </template>
      <template v-for="menu in item.children">
        <template v-if="!menu.hideInMenu">
          <recursive-menu
            :key="menu.path"
            :item="menu"
            :link="link"
            :menu-type="menuType"
          />
        </template>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item
      :key="item.path"
      v-if="item.commonUse !== 0 || menuType === 'drawer'"
    >
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template v-if="!isUrl(item.path)">
        <RouterLink v-if="link" :to="item.path">
          <span>
            {{ renderTitle(item.title) }}
          </span>
        </RouterLink>
        <span v-else>
          {{ renderTitle(item.title) }}
        </span>

        <a-tooltip v-if="menuType === 'drawer'" placement="top">
          <template #title>
            {{ item.commonUse === 0 ? "点击收藏" : "取消收藏" }}
          </template>
          <img
            @click.stop="startCollect(item)"
            class="startIcon"
            :src="item.commonUse === 0 ? noStartIcon : startIcon"
            alt=""
          />
        </a-tooltip>
      </template>
      <template v-else>
        <a :href="item.path" :target="item.target ?? '_blank'">
          <span>
            {{ renderTitle(item.title) }}
          </span>
          <a-tooltip v-if="menuType === 'drawer'" placement="top">
            <template #title>
              {{ item.commonUse === 0 ? "点击收藏" : "取消收藏" }}
            </template>
            <img
              @click.stop="startCollect(item)"
              class="startIcon"
              :src="item.commonUse === 0 ? noStartIcon : startIcon"
              alt=""
            />
          </a-tooltip>
        </a>
      </template>
    </a-menu-item>
  </template>
</template>

<script setup>
import { isFunction, isUrl } from "@v-c/utils";
import AsyncIcon from "./async-icon.vue";
import { editCommonUseMenu } from "~/api/common/menu.js";
import startIcon from "@/assets/images/common/start.png";
import noStartIcon from "@/assets/images/common/noStart.png";
import { message } from "ant-design-vue";
// 在组件中引入userStore
import { useUserStore } from "~/stores/user.js";

// 更新菜单数据
const refreshMenu = async () => {
  const userStore = useUserStore();
  await userStore.generateDynamicRoutes();
};

// 定义组件属性
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },

  link: {
    type: Boolean,
    default: true,
  },
  menuType: {
    type: String,
    default: "",
  },
});

const startCollect = (item) => {
  commonUseFunc(item.commonUse === 1 ? 0 : 1, item);
  console.log(item);
};

// 处理菜单收藏功能
function commonUseFunc(type, item) {
  editCommonUseMenu({ commonUse: type, menuId: item.id }).then((res) => {
    if (res.code === 200) {
      // 直接修改传入的item对象，避免引用未定义的data.value
      item.commonUse = type;
      message.success(type === 1 ? "收藏成功" : "取消成功");
      // 刷新菜单数据
      refreshMenu();
    } else {
      message.error(res.msg);
    }
  });
}
// 渲染菜单标题
function renderTitle(title) {
  if (isFunction(title)) return title();
  return title;
}
</script>

<style scoped lang="less">
::v-deep(.ant-menu-submenu) {
  display: none !important;
  font-size: 15px !important;
}

.startIcon {
  display: inline-block;
  width: 16px;
  position: absolute;
  right: 60px;
  top: 10px;
}
</style>
