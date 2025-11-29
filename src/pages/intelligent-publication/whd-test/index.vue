<template>
  <appTableBox
    ref="tableRef"
    :columns="columns"
    :data-source="treeData"
    :reset-set-menu="'sdsdfsadfsad'"
    :tree-data-props="{ children: 'children', title: 'name' }"
    :row-class-name="rowClassName"
    bordered
  />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import appTableBox from '~@/components/common/appTableBox.vue';
import Sortable from 'sortablejs';

// 模拟树形表格数据（含层级、父节点标识）
const treeData = ref([
  {
    key: '1',
    name: '父节点1',
    children: [
      { key: '1-1', name: '子节点1-1', level: 1, parentKey: '1' },
      { key: '1-2', name: '子节点1-2', level: 1, parentKey: '1' },
      { key: '1-3', name: '子节点1-3', level: 1, parentKey: '1' },
    ],
    level: 0,
    parentKey: '',
  },
  {
    key: '2',
    name: '父节点2dfgdfgasdfgasdgasdfgasdgfsgsdgsdgsadgs',
    children: [
      { key: '2-1', name: '子节点2-1', level: 1, parentKey: '2' },
      {
        key: '2-2',
        name: '子节点2-2',
        level: 1,
        parentKey: '2',
        children: [
          { key: '2-2-1', name: '孙节点2-2-1', level: 2, parentKey: '2-2' },
          { key: '2-2-2', name: '孙节点2-2-2', level: 2, parentKey: '2-2' },
        ],
      },
    ],
    level: 0,
    parentKey: '',
  },
]);

// 表格列配置
const columns = ref([
  { title: '名称', dataIndex: 'name', key: 'name', width: 100 },
  { title: '层级', dataIndex: 'level', key: 'level', width: 200 },
  { title: '层级', dataIndex: 'sdgsdg', key: 'sdgsdg', width: 200 },
  { title: '层级', dataIndex: 'ergdfg', key: 'ergdfg', width: 200 },
  { title: '层级', dataIndex: 'er5sdfs', key: 'er5sdfs', width: 200 },
  { title: '层级', dataIndex: 'ertsdf', key: 'ertsdf', width: 200 },
]);

const tableRef = ref(null);
let sortable = null;

// 初始化拖拽逻辑
const initSortable = () => {
  const tableEl = tableRef.value?.$el;
  if (!tableEl) return;

  // 获取表格tbody（Ant Design Vue 4.x DOM结构）
  const tbody = tableEl.querySelector('.ant-table-tbody');
  if (!tbody) return;

  // 销毁旧实例，避免重复绑定
  if (sortable) sortable.destroy();

  // 创建Sortable实例
  sortable = new Sortable(tbody, {
    animation: 150,
    handle: '.ant-table-row', // 整行可拖拽
    // 拖拽校验：仅同层级+同父节点允许拖拽
    onMove: (evt) => {
      const sourceEl = evt.item;
      const targetEl = evt.to;

      // 从DOM属性获取层级和父节点ID
      const sourceLevel = sourceEl.getAttribute('data-level');
      const sourceParentKey = sourceEl.getAttribute('data-parent-key');
      const targetLevel = targetEl?.getAttribute('data-level');
      const targetParentKey = targetEl?.getAttribute('data-parent-key');

      // 层级或父节点不一致则阻止拖拽
      return sourceLevel === targetLevel && sourceParentKey === targetParentKey;
    },
    // 拖拽结束后更新树形数据
    onEnd: (evt) => {
      console.log({evt});
      
      const { oldIndex, newIndex } = evt;
      const sourceEl = evt.item;
      const sourceParentKey = sourceEl.getAttribute('data-parent-key');
      const sourceLevel = sourceEl.getAttribute('data-level');

      // 递归查找当前父节点的子数组
      const findParentChildren = (data, parentKey) => {
        for (const item of data) {
          if (item.key === parentKey) return item.children;
          if (item.children) {
            const res = findParentChildren(item.children, parentKey);
            if (res) return res;
          }
        }
        // 顶级节点（level=0）直接返回根数组
        return sourceLevel === '0' ? data : null;
      };

      // 调整子数组顺序并触发响应式更新
      const targetChildren = findParentChildren(treeData.value, sourceParentKey);
      if (targetChildren) {
        const [movedItem] = targetChildren.splice(oldIndex, 1);
        targetChildren.splice(newIndex, 0, movedItem);
        treeData.value = [...treeData.value]; // 触发视图更新
      }
    },
  });
};

// 为每行绑定层级和父节点ID的DOM属性
const rowClassName = (record) => {
  // 异步获取行元素并绑定data属性（确保DOM已渲染）
  nextTick(() => {
    const rowEl = document.querySelector(`tr[data-row-key="${record.key}"]`);
    if (rowEl) {
      rowEl.setAttribute('data-level', record.level);
      rowEl.setAttribute('data-parent-key', record.parentKey);
    }
  });
  return '';
};

// 表格渲染后初始化拖拽
onMounted(() => {
  nextTick(() => initSortable());
});

// 数据更新后重新初始化拖拽（避免DOM变化导致失效）
watch(treeData, () => {
  nextTick(() => initSortable());
});
</script>

<style scoped>
/* 拖拽样式优化 */
.ant-table-row {
  cursor: move;
}
.sortable-ghost {
  background-color: #f5f5f5;
}
</style>