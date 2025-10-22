<template>
  <div
    v-if="item && !item.hideInMenu"
    :class="['menu-item', { 'menu-item-with-children': hasChildren }]"
  >
    <!-- 有子菜单的项 -->
    <template v-if="hasChildren">
      <a-collapse
        ghost
        class="custom-collapse"
        :style="{ width: '100%' }"
        v-model:activeKey="childActiveKeys"
      >
        <a-collapse-panel :key="item.path" sty>
          <template #header>
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
                  @click.prevent="handleCollect(item)"
                  class="startIcon"
                  :src="item.commonUse === 0 ? noStartIcon : startIcon"
                  alt=""
                />
              </a-tooltip>
            </div>
          </template>
          <div class="sub-menu-content">
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
      </a-collapse>
    </template>
    <!-- 无子菜单的项 -->
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
            @click.prevent="handleCollect(item)"
            class="startIcon"
            :src="item.commonUse === 0 ? noStartIcon : startIcon"
            alt=""
          />
        </a-tooltip>
      </div>
    </template>
  </div>
</template>

<script setup>
// 导入必要的依赖
import { ref, computed } from "vue";
import AsyncIcon from "./async-icon.vue";
import { isUrl, isFunction } from "@v-c/utils";
import recursiveDrawerMenu from "./recursive-drawer-menu.vue";
import { CaretRightOutlined } from "@ant-design/icons-vue";
// 定义组件属性
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  onCollect: {
    type: Function,
    required: true,
  },
  startIcon: {
    type: String,
    required: true,
  },
  noStartIcon: {
    type: String,
    required: true,
  },
});

// 渲染菜单标题
function renderTitle(title) {
  if (isFunction(title)) return title();
  return title;
}

// 子级折叠面板的激活状态
const childActiveKeys = ref([]);

// 判断是否有子菜单
const hasChildren = computed(() => {
  return (
    props.item.children &&
    props.item.children.length > 0 &&
    !props.item.hideChildrenInMenu
  );
});

// 处理收藏功能
function handleCollect(item) {
  props.onCollect(item);
}
</script>

<style scoped lang="less">
.menu-item {
  width: 100%;
  transition: all 0.3s ease;
  padding-right: 0 !important;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  position: relative;
}

/* 菜单项悬浮效果 */
.menu-item-content:hover {
  color: #1890ff;
  transform: scale(1.01);
}

/* 收藏图标样式 */
.startIcon {
  width: 16px;
  height: 16px;
  margin-left: auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 收藏图标悬浮效果 */
.startIcon:hover {
  transform: scale(1.1);
  filter: brightness(1.1);
}

/* 子菜单内容样式 */
.sub-menu-content {
  padding: 0 0 0 24px;
}

/* 自定义折叠面板样式 */
.custom-collapse {
  border-radius: 6px;
  overflow: hidden;
  padding-right: 0 !important;
}

/* 确保嵌套折叠面板的右边距为0 */
:deep(.ant-collapse) {
  padding-right: 0 !important;
  margin-right: 0 !important;
}

/* 确保折叠面板内容区域的右边距为0 */
:deep(.ant-collapse-content-box) {
  padding-right: 0 !important;
}

/* 确保折叠面板头部的右边距为0 */
:deep(.ant-collapse-header) {
  padding-right: 0 !important;
}

/* 确保折叠面板项的右边距为0 */
:deep(.ant-collapse-item) {
  margin-right: 0 !important;
}
</style>
