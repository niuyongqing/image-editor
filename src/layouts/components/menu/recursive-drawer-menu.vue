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
         :expandIcon="getExpandIcon"
      >
        <a-collapse-panel :key="item.path">
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
                  {{ item.commonUse === 0 ? "点击常驻" : "取消常驻" }}
                </template>
                <AsyncIcon
                  @click.stop="handleCollect(item)"
                  :style="{ color: item.commonUse === 0 ? '#999' : '#1890ff', marginLeft: 'auto', cursor: 'pointer' }"
                  id="commonUse"
                  icon="PushpinOutlined"
                  size="15px"
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
            {{ item.commonUse === 0 ? "点击常驻" : "取消常驻" }}
          </template>
          <AsyncIcon
            @click.stop="handleCollect(item)"
            :style="{ color: item.commonUse === 0 ? '#999' : '#1890ff', marginLeft: 'auto', cursor: 'pointer' }"
            id="commonUse"
            icon="PushpinOutlined"
            size="15px"
          />
        </a-tooltip>
      </div>
    </template>
  </div>
</template>

<script setup>
// 导入必要的依赖
import { ref, computed, createVNode } from "vue";
import AsyncIcon from "./async-icon.vue";
import { isUrl, isFunction } from "@v-c/utils";
import recursiveDrawerMenu from "./recursive-drawer-menu.vue";
import { DownOutlined, UpOutlined } from "@ant-design/icons-vue";
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
});

// 渲染菜单标题
function renderTitle(title) {
  if (isFunction(title)) return title();
  return title;
}

// 子级折叠面板的激活状态
const childActiveKeys = ref([]);

// 获取展开图标
function getExpandIcon(panelProps) {
  // 判断当前面板是否展开
  const isExpanded = panelProps.isActive;
  // 使用直接导入的createVNode创建组件
  return createVNode(isExpanded ? UpOutlined : DownOutlined);
}

// 判断是否有子菜单
const hasChildren = computed(() => {
  return (
    props.item.children &&
    props.item.children.length > 0 &&
    !props.item.hideChildrenInMenu
  );
});

// 处理常驻功能
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

/* 常驻图标样式 */
#commonUse {
  transform: rotate(-40deg);
  transition: all 0.2s ease;
}

/* 常驻图标悬浮效果 */
#commonUse:hover {
  transform: scale(1.2) rotate(-40deg) !important;
  filter: brightness(1.2);
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
