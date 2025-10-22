<template>
  <a-drawer
    :width="620"
    :style="{ paddingLeft: paddingLeft, transition: 'padding-left 0.3s ease' }"
    title="菜单收藏"
    :body-style="{ padding: '12px 40px 0 20px' }"
    :placement="placement"
    :open="open"
    @close="onClose"
  >
    <a-collapse
      accordion
      v-model:activeKey="activeKeys"
      :style="{ width: '100%', border: 'none' }"
      :class="collapsed ? 'ant-pro-collapse-menu' : ''"
      ghost
    >
      <!-- 根级菜单 -->
      <template v-for="item in selectedMenus">
        <template v-if="!item.hideInMenu">
          <template
            v-if="
              item.children &&
              item.children.length > 0 &&
              !item.hideChildrenInMenu
            "
          >
            <a-collapse-panel :key="item.path">
              <template #header>
                <div class="menu-header">
                  <async-icon
                    v-if="item.icon"
                    :icon="item.icon"
                    style="margin-right: 8px"
                  />
                  <span>{{ renderTitle(item.title) }}</span>
                  <a-tooltip placement="top">
                    <template #title>
                      {{ item.commonUse === 0 ? "点击收藏" : "取消收藏" }}
                    </template>
                    <img
                      @click.stop="handleCollect(item)"
                      class="startIcon"
                      :src="item.commonUse === 0 ? noStartIcon : startIcon"
                      alt=""
                    />
                  </a-tooltip>
                </div>
              </template>
              <div class="collapse-content">
                <!-- 递归渲染子菜单 -->
                <recursiveDrawerMenu
                  v-for="child in item.children"
                  :key="child.path"
                  :item="child"
                  :on-collect="handleCollect"
                  :start-icon="startIcon"
                  :no-start-icon="noStartIcon"
                />
              </div>
            </a-collapse-panel>
          </template>
          <template v-else>
            <!-- 无子女菜单 -->
            <div :key="item.path" class="menu-item">
              <router-link v-if="!isUrl(item.path)" :to="item.path">
                <div class="menu-item-content">
                  <async-icon
                    v-if="item.icon"
                    :icon="item.icon"
                    style="margin-right: 8px"
                  />
                  <span>{{ renderTitle(item.title) }}</span>
                  <a-tooltip placement="top">
                    <template #title>
                      {{ item.commonUse === 0 ? "点击收藏" : "取消收藏" }}
                    </template>
                    <img
                      @click.stop="handleCollect(item)"
                      class="startIcon"
                      :src="item.commonUse === 0 ? noStartIcon : startIcon"
                      alt=""
                    />
                  </a-tooltip>
                </div>
              </router-link>
              <template v-else>
                <div class="menu-item-content">
                  <async-icon
                    v-if="item.icon"
                    :icon="item.icon"
                    style="margin-right: 8px"
                  />
                  <span>{{ renderTitle(item.title) }}</span>
                  <a-tooltip placement="top">
                    <template #title>
                      {{ item.commonUse === 0 ? "点击收藏" : "取消收藏" }}
                    </template>
                    <img
                      @click.stop="handleCollect(item)"
                      class="startIcon"
                      :src="item.commonUse === 0 ? noStartIcon : startIcon"
                      alt=""
                    />
                  </a-tooltip>
                </div>
              </template>
            </div>
          </template>
        </template>
      </template>
    </a-collapse>
  </a-drawer>
</template>

<script setup>
// 导入必要的依赖
import { ref, computed } from "vue";
import recursiveDrawerMenu from "./recursive-drawer-menu.vue";
import { message } from "ant-design-vue";
import AsyncIcon from "./async-icon.vue";
import { editCommonUseMenu } from "~/api/common/menu.js";
import { isUrl, isFunction } from "@v-c/utils";
import { useUserStore } from "~/stores/user.js";
import startIcon from "@/assets/images/common/start.png";
import noStartIcon from "@/assets/images/common/noStart.png";

// 渲染菜单标题
function renderTitle(title) {
  if (isFunction(title)) return title();
  return title;
}

// 定义组件属性
const props = defineProps({
  selectedMenus: {
    type: Array,
    default: () => [],
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  open: {
    type: Boolean,
    default: false,
  },
  paddingLeft: {
    type: String,
    default: "200px",
  },
});

// 定义组件事件
const emit = defineEmits(["close"]);

// 折叠面板的激活状态
const activeKeys = ref([]);

// 抽屉位置
const placement = ref("left");

// 刷新菜单数据
const refreshMenu = async () => {
  const userStore = useUserStore();
  await userStore.generateDynamicRoutes();
};

// 处理菜单收藏功能
const handleCollect = (item) => {
  const newType = item.commonUse === 1 ? 0 : 1;
  editCommonUseMenu({ commonUse: newType, menuId: item.id }).then((res) => {
    if (res.code === 200) {
      item.commonUse = newType;
      message.success(newType === 1 ? "收藏成功" : "取消成功");
      refreshMenu();
    } else {
      message.error(res.msg);
    }
  });
};

const onClose = () => {
  emit("close");
};

// 暴露方法给父组件使用
defineExpose({
  // 可以在这里添加其他需要暴露的方法
});
</script>

<style scoped lang="less">
.ant-pro-collapse-menu {
  ::v-deep(.ant-collapse-header) {
    padding-top: 0;
    padding-bottom: 0;
  }

  ::v-deep(.ant-collapse-content-box) {
    padding-left: 48px;
  }
}

.menu-header {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 8px 0;
  transition: all 0.3s ease;

  &:hover {
    color: #1890ff;
    transform: scale(1.01);
  }
}

/* 折叠面板内容区域 */
.collapse-content {
  padding-right: 0;
}

.menu-item {
  padding: 4px 0;
}

.menu-item-content {
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    background-color: rgba(5, 150, 105, 0.1);
  }
}

/* 收藏图标样式 */
.startIcon {
  width: 16px;
  height: 16px;
  margin-left: auto;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.2);
    filter: brightness(1.2);
  }
}

.sub-menu-content {
  padding: 0 0 0 20px;
}

/* 递归菜单的缩进样式 */
.menu-item-with-children {
  padding-left: 0;
}

/* 确保嵌套折叠面板的样式正确 */
::v-deep(.ant-collapse .ant-collapse) {
  margin: 0;
}

/* 调整递归折叠面板内容区域的内边距 */
::v-deep(.ant-collapse .ant-collapse-content-box) {
  padding: 0 0 0 30px !important;
}

/* 调整折叠面板内容区域的内边距 */
::v-deep(.ant-collapse-content-box) {
  padding: 0 0 0 60px !important;
}

/* 确保嵌套折叠面板的右边距为0 */
::v-deep(.ant-collapse) {
  padding-right: 0 !important;
  margin-right: 0 !important;
}

/* 确保折叠面板头部的右边距为0 */
::v-deep(.ant-collapse-header) {
  padding: 8px 0 8px 16px !important;
}

/* 确保折叠面板项的右边距为0 */
::v-deep(.ant-collapse-item) {
  margin-right: 0 !important;
  font-size: 15px;

  .ant-collapse-expand-icon {
    margin-top: 9px !important;
  }
}

/* 为抽屉paddingLeft添加过渡动画 */
:deep(.ant-drawer) {
  transition: padding-left 0.3s ease;
}

/* 确保paddingLeft样式平滑过渡 */
.ant-drawer {
  transition: padding-left 0.3s ease;
}
</style>
