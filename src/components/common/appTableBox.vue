<template>
  <!-- 通用表格组件 -->
  <div id="appTableBox" class="appTableBox" :class="`${resetSetMenu}-appTableBox`">
    <a-card>
      <!--   表格 按钮设置区域上方其他功能插槽，如tabs，分页器等   -->
      <div class="table-otherCount" v-if="!!otherCount">
        <slot name="otherCount"></slot>
      </div>
      <div class="table-title">
        <div class="table-title-item">
          <a-space>
            <!--  顶部左侧区域 -->
            <slot name="leftTool"></slot>
            <div></div>
          </a-space>
        </div>
        <div class="table-title-item item-right">
          <a-space>
            <a-popconfirm title="是否保存?" ok-text="是" cancel-text="否" @confirm="tableSetting(columns.list)"
              v-if="columns.columnChange">
              <a-button type="dashed" danger :loading="btnLoading">
                保存当前列表视图
              </a-button>
            </a-popconfirm>
            <!-- 顶部右侧工具按钮插槽 -->
            <slot name="rightTool"></slot>
            <a-popover 
              placement="bottomRight" 
              trigger="click" 
              v-if="isTableSetting"
              @openChange="e => columnDrop(e)"
            >
              <template #content>
                <div class="tableSetting-box leftList">
                  <div class="tableSetting-columnRow" v-for="item in columns.leftList" :key="item.key">
                    <div class="columnRow-title">{{ item.title }}</div>
                    <a-checkbox v-model:checked="item.show">显示</a-checkbox>
                    <a-checkbox 
                      v-model:checked="item.fixedLeft" 
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'left')"
                    >固定左侧</a-checkbox>
                    <a-checkbox 
                      v-model:checked="item.fixedRight" 
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'right')"
                    >固定右侧</a-checkbox>
                  </div>
                </div>
                <div class="tableSetting-box centerList">
                  <div class="tableSetting-columnRow" v-for="item in columns.centerList" :key="item.key">
                    <div class="columnRow-title">{{ item.title }}</div>
                    <a-checkbox v-model:checked="item.show">显示</a-checkbox>
                    <a-checkbox 
                      v-model:checked="item.fixedLeft" 
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'left')"
                    >固定左侧</a-checkbox>
                    <a-checkbox 
                      v-model:checked="item.fixedRight" 
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'right')"
                    >固定右侧</a-checkbox>
                  </div>
                </div>
                <div class="tableSetting-box rightList">
                  <div class="tableSetting-columnRow" v-for="item in columns.rightList" :key="item.key">
                    <div class="columnRow-title">{{ item.title }}</div>
                    <a-checkbox v-model:checked="item.show">显示</a-checkbox>
                    <a-checkbox 
                      v-model:checked="item.fixedLeft" 
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'left')"
                    >固定左侧</a-checkbox>
                    <a-checkbox 
                      v-model:checked="item.fixedRight" 
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'right')"
                    >固定右侧</a-checkbox>
                  </div>
                </div>
                <div class="tableSetting-btn">
                  <a-space>
                    <a-button @click="tableSetting(null)" :loading="btnLoading">重置设置</a-button>
                    <a-button type="primary" @click="tableSetting(columns.list)" :loading="btnLoading">保存设置</a-button>
                  </a-space>
                </div>
              </template>
              <template #title>
                <span>表格设置</span>
              </template>
              <a-button type="primary">
                <template #icon><SettingOutlined /></template>
                {{ '表格设置' }}
              </a-button>
            </a-popover>
          </a-space>
        </div>
      </div>
      <div class="table-content" :class="`${resetSetMenu}-table`">
        <a-table 
          :columns="showHeader" 
          :data-source="tableInfo.data" 
          :scroll="scrollData"
          :pagination="false"
          :customRow="customRow" 
          bordered 
          :row-key="rowKeyFn"
          :row-class-name="rowClassNameFn"
          ref="tableRef"
          :expanded-row-keys="tableInfo.expandedRowKeys"
          @update:expanded-row-keys="expandedRowKeysFn"
          v-bind="$attrs" 
          :key="tableInfo.key"
        >
          <template #headerCell="{ title, column }">
            <div class="resizable-header" v-if="column.key">
              <slot 
                name="headerCell" 
                :column="column || {}"
                :title="title"
              >
                {{ column?.title }}
              </slot>
              <div v-if="!column.children" class="resizable-header-right" @mousedown.stop="e => onMouseDown(e, column)"></div>
            </div>
          </template>
          <template #bodyCell="{ column, record, index, text }">
            <slot 
              name="bodyCell" 
              :record="record || {}" 
              :index="index" 
              :column="column || {}"
              :text="text"
            >
              {{ record[column.dataIndex || column.key] }}
              <!-- <appEllipsisTooltip :title="record[column.key || column.dataIndex]"></appEllipsisTooltip> -->
            </slot>
            <template v-if="!!options && column.key === 'options'">
              <a-space>
                <slot name="options" :record="record || {}" :column="column || {}"></slot>
              </a-space>
            </template>
          </template>
          <template #summary v-if="!!summary">
            <slot name="summary"></slot>
          </template>
          <template #expandedRowRender="{ record, index, indent, expanded }" v-if="!!expandedRowRender">
            <slot 
              name="expandedRowRender" 
              :record="record || {}"
              :index="index"
              :indent="indent"
              :expanded="expanded"
            ></slot>
          </template>
        </a-table>
      </div>
      <div class="table-pagination" v-if="!!pagination">
        <slot name="pagination"></slot>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { SettingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { cloneDeep, debounce, set } from 'lodash-es';
import Sortable from 'sortablejs';
import { computed, onMounted, reactive, ref, useSlots } from 'vue';

// import appEllipsisTooltip from '@/components/common/appEllipsisTooltip.vue';
import { v4 as uuid } from 'uuid';
defineOptions({ name: 'appTableBox' });
const { proxy: _this } = getCurrentInstance();
/**
 * rowClick         行单击事件
 * rowDoubleClick   行双击事件
 *//*  */
const emit = defineEmits([
  'update:filterColumns',     
  'update:expandedRowKeys',      
  'rowClick',               // 表格行单击
  'rowDoubleClick',         // 表格行双击
  'dragEnd'                 // 行拖拽结束
]);
const props = defineProps({
  resetSetMenu: {
    // 表头唯一标识，不能重复，必传
    type: String,
    default: '',
  },
  tableHeader: {
    // 原始表头
    type: Array,
    default: () => [],
  },
  dataSource: {
    // 表格数据
    type: Array,
    default: () => [],
  },
  rowKey: {       
    type: [String, Function],
    default: 'key'
  },
  rowClassName: {
    type: [String, Function],
    default: '',
  },
  filterColumns: {
    // 当前展示的表头，用v-model直接绑定即可
    type: Array,
    default: () => [],
  },
  expandedRowKeys: {
    type: Array,
    default: () => [],
  },
  scroll: {
    // 表格滚动属性
    type: Object,
    default: () => ({ x: 800 }),
  },
  isTableSetting: {             // 是否启用表格设置
    type: Boolean,
    default: true,
  },
  autoHeight: {             // 是否启用表格自适应
    type: Boolean,
    default: true,
  },
  rowDrag: Boolean,         // 是否启用行拖拽
});
const {
  otherCount,           // 最上方插槽，放置tabs，上分页器等
  leftTool,             // 左侧工具button插槽名
  rightTool,            // 右侧工具button插槽名
  headerCell,           // 表格表头插槽名
  bodyCell,             // 表格内容行插槽名
  options,              // 表格行操作列插槽名
  summary,              // 表格合计行插槽名
  expandedRowRender,    // 表格展开插槽名
  pagination            // 表格分页器插槽名
} = useSlots();

// console.log({slots});
const btnLoading = ref(false);
const columns = reactive({
  list: [],                 // 实际表头
  leftList: [],             // 固定在左侧的表头
  rightList: [],
  centerList: [],
  isResizing: false,
  resizingColumnKey: null,
  columnChange: false,        

  columnList: [],         // 原始表头
});
let optionsColumn = {
  sorter: false,
  fixed: 'right',
  fixedLeft: false,
  fixedRight: true,
  show: true,
  resizable: false,
  key: 'options',
  title: '操作',
  width: 150,
  align: 'left'
};
const heightInfo = reactive({
  formDom: null,          // 搜索表单实例
  formHeight: 0,          // 表单高度
  outerDomHeight: 0,      // 除了表单之外计算出来的滚动高度
})
const tableInfo = reactive({
  data: [],              // 用于渲染的表格数据
  sortable: null,             // Sortable实例
  key: uuid(),
  expandedRowKeys: [],
})
const showHeader = computed(() => {
  let list = columns.list.filter(i => i.show);
  // list = !!options ? [...list, optionsColumn] : list;
  return list;
})
const scrollData = computed(() => {
  let maxHeight = '';
  if (props.scroll.y) {
    if (typeof props.scroll.y === 'number') {
      maxHeight = props.scroll.y + 'px'
    } else {
      maxHeight = props.scroll.y
    }
  } else {
    maxHeight = (heightInfo.outerDomHeight - heightInfo.formHeight) + 'px';
  }
  return props.autoHeight ? { y: maxHeight, ...props.scroll } : props.scroll;
})
const scrollHeigth = computed(() => {
  let maxHeight = (heightInfo.outerDomHeight - heightInfo.formHeight) + 'px';
  return props.autoHeight ? maxHeight : 'auto';
})
generateHeader();
getSettingList();
onMounted(() => {
  nextTick(() => {
    columns.columnChange = false;
    setTimeout(() => {
      getHeight()
      resizDomSetting();
    }, 300);
  });
});
onUnmounted(() => {
  heightInfo.formDom && heightInfo.formDom.disconnect();
})
watch(() => columns.list, (val, oldVal) => {
  columns.columnChange = true;
  emit('update:filterColumns', columns.list);
}, {
  deep: true,
});
// 监听默认展开的行
watch(() => props.expandedRowKeys, (val) => {
  tableInfo.expandedRowKeys = [...val]
}, {
  deep: true,
  immediate: true,
})
watch(() => props.dataSource, (val, oldVal) => {
  tableInfo.data = cloneDeep(val)
  setTableData(tableInfo.data)
  nextTick(dragInit())
}, {
  deep: true,
  immediate: true,
})
watch(() => props.rowDrag, (val) => {
  tableInfo.key = uuid()
  if (val) {
    nextTick(dragInit())
  } else {
    if (tableInfo.sortable) tableInfo.sortable.destroy();
    tableInfo.sortable = null
  }
})
// 计算查询表单和表格滚动区的总高度
function getHeight() {
  let dom = document.querySelector(`.${props.resetSetMenu}-appTableBox`)
  let antTabsHeight = document.querySelector('.ant-tabs.ant-tabs-top')?.offsetHeight || 0;
  let tableOtherCountHeight = dom.querySelector('.table-otherCount')?.offsetHeight || 0;
  let tableTitleHeight = dom.querySelector('.table-title')?.offsetHeight || 0;
  let tablePaginationHeight = dom.querySelector('.table-pagination')?.offsetHeight || 0;
  let tableHeaderHeight = dom.querySelector('.ant-table-header thead')?.offsetHeight || 0;
  // let thead = dom.querySelector('.ant-table-header thead');
  let tableSummaryHeight = dom.querySelector('.ant-table-summary table')?.offsetHeight || 0;
  // console.log({
  //   antTabsHeight,tableOtherCountHeight,tableTitleHeight,tablePaginationHeight,tableSummaryHeight,tableHeaderHeight,thead
  // });
  
  heightInfo.outerDomHeight = window.innerHeight - antTabsHeight - tableOtherCountHeight - (tableTitleHeight + 8) - tablePaginationHeight - tableHeaderHeight - tableSummaryHeight - 20 - 24 - 12 - 8 - 4;
  // 总高度 - 页签栏高度 - 表格最上方插槽高度 - 表格工具按钮栏高度+margin-bottom - 分页器插槽高度 - 表头高度 - 合计行高度 - main容器上下margin（20） - 表格组件card容器上下padding（24） - 横向滚动条高度（12） - 表格组件和查询表单组件的上下padding（8） - 冗余（4）

  const targetDom = document.getElementById('appTableForm');
  if (!targetDom) return;
  // 1. 监听尺寸变化（ResizeObserver）
  heightInfo.formDom = new ResizeObserver(entries => {
    heightInfo.formHeight = entries[0].contentRect.height;
  });
  heightInfo.formDom.observe(targetDom);
}
// 重新生成表头
function generateHeader() {
  columns.columnList = props.tableHeader.map((i, index) => {
    let obj = {
      sorter: false,
      fixed: false,
      fixedLeft: false,
      fixedRight: false,
      show: true,
      ...i,
      resizable: false,
    };
    obj.key = obj.key || obj.dataIndex;
    return obj;
  });
}
// 获取表头
function getSettingList() {
  if (!props.resetSetMenu) {
    console.error('缺少resetSetMenu！');
    return;
  }
  let { data } = getHeader();
  if (data) {
    columns.list = data
  } else {
    let list = cloneDeep(columns.columnList);
    let col = cloneDeep(optionsColumn)
    columns.list = !!options ? [...list, col] : list;
  }
  // list = !!options ? [...list, optionsColumn] : list;
  columns.leftList = columns.list.filter(i => {
    if (i.fixed === 'left') {
      i.fixedLeft = true
    }
    return i.fixed === 'left'
  });
  columns.rightList = columns.list.filter(i => {
    if (i.fixed === 'right') {
      i.fixedRight = true
    }
    return i.fixed === 'right'
  });
  columns.centerList = columns.list.filter(i => !i.fixed);
  columns.list = [...columns.leftList, ...columns.centerList, ...columns.rightList];
  setColumnItem(columns.list);
  columns.columnChange = false;
}
/**
 * 固定表头
 * @param col  表头对象
 * @param type 固定方式
 */
function fixedCheckboxChange(col, type) {
  // console.log({ col, type });
  if (type === 'left') {
    col.fixedRight = false;
    col.fixed = col.fixedLeft ? 'left' : false;
  }
  if (type === 'right') {
    col.fixedLeft = false;
    col.fixed = col.fixedRight ? 'right' : false;
  }
  columns.leftList = columns.list.filter(i => i.fixed === 'left');
  columns.rightList = columns.list.filter(i => i.fixed === 'right');
  columns.centerList = columns.list.filter(i => !i.fixed);
  columns.list = [...columns.leftList, ...columns.centerList, ...columns.rightList];
  setColumnItem(columns.list);
}
let clickTimer = null; // 处理单击和双击冲突的定时器
// 自定义行属性（同时绑定单击和双击）
function customRow(row) {
  return {
    onClick: () => {
      // 清除之前的定时器
      if (clickTimer) clearTimeout(clickTimer);
      // 设置新定时器（250ms内没有双击则视为单击）
      clickTimer = setTimeout(() => {
        emit('rowClick', row)
      }, 250);
    },
    onDblclick: () => {
      // 双击时立即清除单击定时器
      clearTimeout(clickTimer);
      emit('rowDoubleClick', row)
    },
  };
}
function rowKeyFn(record) {
  let rowKey = typeof props.rowKey === 'string' ? record[props.rowKey] : props.rowKey(record);
  // console.log({rowKey});
  return rowKey;
}
// 为每行绑定层级和父节点ID的DOM属性
function rowClassNameFn(record, index) {
  nextTick(() => {
    // 异步获取行元素并绑定data属性（确保DOM已渲染），用于表格行拖拽
    const rowEl = document.querySelector(`tr[data-row-key="${rowKeyFn(record)}"]`);
    if (rowEl) {
      rowEl.setAttribute('data-level', record._level);
      rowEl.setAttribute('data-drag-key', record._dragKey);
      rowEl.setAttribute('data-parent-key', record._parentKey);
    }
  });
  let className = typeof props.rowClassName === 'string' ? props.rowClassName : props.rowClassName(record, index);
  let striped = index % 2 === 1 ? 'table-striped' : '';   // 斑马纹设定
  let dragClass = props.rowDrag ? ` table-drag` : '';     // 拖拽样式
  return striped + (className ? (striped ? ` ${className}` : className) : '') + dragClass;
};
// 树形表格展开行变化
function expandedRowKeysFn(val) {
  tableInfo.expandedRowKeys = [...val];
  emit('update:expandedRowKeys', val)
}
// 处理拖动dom
function resizDomSetting() {
  let thead = document.querySelector(`.${props.resetSetMenu}-table`);
  let sorters = [...(thead.querySelectorAll('.ant-table-column-has-sorters') || [])];
  // console.log({ thead, sorters });
  sorters.forEach(item => {
    let resizable = item.querySelector('.resizable-header-right');
    let columnSorters = item.querySelector('.ant-table-column-sorters');
    resizable.className += ' sorters';
    columnSorters.after(resizable);
  });
}
// 根据key找出表头对象
function getColumnItem(key, data) {
  let col = null;
  let list = data ? data : columns.list
  list.some(item => {
    // console.log(item.key === key, item.key, key);
    if (item.key === key) {
      col = item;
    } else if (item.children && item.children.length > 0) {
      col = getColumnItem(key, item.children);
    }
    return col;
  });
  return col
}
// 设置深层级表头的固定方式
function setColumnItem(data, pData) {
  data.forEach(item => {
    if (pData) {
      item.fixed = pData.fixed;
      item.fixedLeft = pData.fixedLeft;
      item.fixedRight = pData.fixedRight;
    }
    if (item.children && item.children.length > 0) {
      setColumnItem(item.children, item);
    } 
  })
}
// 点击拖拽设置列宽
function onMouseDown(event, column) {
  // console.log({ event, column });
  // 只能拖拽最底层表头
  if (column.children) return;
  const startX = event.clientX; // 获取鼠标初始位置

  const startWidth = column.width || 0; // 获取初始宽度
  columns.isResizing = true;
  columns.resizingColumnKey = column.key;
  let animationFrameId; // 为了让移动更丝滑
  // let val = columns.list.find(i => i.key === column.key);
  let val = getColumnItem(column.key);
  let parentElement = event.target.parentNode;
  let target = event.target.cloneNode();
  let sorter = val.sorter;
  val.sorter = false;
  const mouseMoveHandler = e => {
    if (!columns.isResizing || !columns.resizingColumnKey) return;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      const newWidth = Math.max(50, startWidth + (e.clientX - startX));
      if (newWidth !== column.width) {
        column.width = newWidth;
        val.width = newWidth;
        // console.log({ newWidth });
      }
    });
  };

  const mouseUpHandler = () => {
    columns.isResizing = false;
    columns.resizingColumnKey = '';
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (sorter) {
      setTimeout(() => {
        val.sorter = sorter;
        nextTick(() => {
          let columnSorters = parentElement.querySelector('.ant-table-column-sorters');
          target.addEventListener('mousedown', e => onMouseDown(e, column));
          columnSorters.after(target);
        });
      }, 100);
    }
    columns.columnChange = true;
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
}
// 保存表格设置
function tableSetting(val) {
  updateHeader(val);
  getSettingList();
  nextTick(() => {
    message.success('已保存');
    columns.columnChange = false;
  });
}
//列拖拽
function columnDrop(e) {
  if (!e) return;
  let arr = ['leftList', 'centerList', 'rightList'];
  nextTick(() => {
    arr.forEach(item => {
      const wrapperTr = document.querySelector(`.tableSetting-box.${item}`);
      if (!wrapperTr) return;
      Sortable.create(wrapperTr, {
        animation: 300,
        delay: 0,
        onEnd: evt => {
          dropColumn(evt, item);
        },
      });
    });
  })
}
// 保存拖拽列
function dropColumn(evt, key) {
  let headers = cloneDeep(columns[key]);
  const oldItem = headers[evt.oldIndex];
  headers.splice(evt.oldIndex, 1);
  headers.splice(evt.newIndex, 0, oldItem);
  columns[key] = headers;
  columns.list = [...columns.leftList, ...columns.centerList, ...columns.rightList];
}

/**
 * // 更新表头
 * @param data 表头数据
 */
function updateHeader(data) {
  let localTableHeader = JSON.parse(localStorage.getItem('localTableHeader') || '[]');
  let obj = {
    menu: props.resetSetMenu,
    data: data,
  };
  let header = localTableHeader.find(i => i.menu === obj.menu);
  if (header) {
    header.data = data;
  } else {
    localTableHeader.push(obj);
  }
  let str = JSON.stringify(localTableHeader);
  localStorage.setItem('localTableHeader', str);
}
/**
 * 获取表头数据
 */
function getHeader() {
  let localTableHeader = JSON.parse(localStorage.getItem('localTableHeader') || '[]');
  let header = localTableHeader.find(i => i.menu === props.resetSetMenu);
  let obj = {
    menu: props.resetSetMenu,
    data: header ? header.data : null,
  };
  return obj;
}

// 拖拽相关方法
function dragInit() {
  // setTableData(tableInfo.data)
  setTimeout(() => {
    initSortable()
    // 同步展开信息
    emit('update:expandedRowKeys', tableInfo.expandedRowKeys)
  });
}
// 初始化拖拽逻辑
function initSortable() {
  if (!props.rowDrag) return;
  const tableEl = _this.$refs.tableRef?.$el;
  // console.log(tableEl);
  
  if (!tableEl) return;
  
  // 获取表格tbody（Ant Design Vue 4.x DOM结构）  
  const tbody = tableEl.querySelector('.ant-table-tbody');
  if (!tbody) return;

  // 销毁旧实例，避免重复绑定
  if (tableInfo.sortable) tableInfo.sortable.destroy();

  // 创建Sortable实例
  tableInfo.sortable = new Sortable(tbody, {
    animation: 150,
    handle: '.ant-table-row', // 整行可拖拽
    // 拖拽校验：仅同层级+同父节点允许拖拽
    
    onMove: (evt) => {
      const sourceEl = evt.dragged;         // 拖拽节点
      const targetEl = evt.related;         // 被放置的节点

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
      const sourceEl = evt.item;
      const sourceParentKey = sourceEl.getAttribute('data-parent-key');
      // const sourceLevel = sourceEl.getAttribute('data-level');
      const sourceDragKey = sourceEl.getAttribute('data-drag-key');
      let expandedRowKeys = [...tableInfo.expandedRowKeys]
      nextTick(() => {
        // 调整子数组顺序并触发响应式更新
        const parentNode = findParentChildren(tableInfo.data, sourceParentKey);
        let children = parentNode ? parentNode.children : tableInfo.data
        let rowList = [...document.querySelectorAll(`tr[data-parent-key="${sourceParentKey}"]`)].map(item => {
          let dragKey = item.getAttribute('data-drag-key');
          let row = children.find(i => i._dragKey === dragKey);
          return row;
        })
        if (parentNode) {
          parentNode.children = rowList
        } else {
          tableInfo.data = [...rowList]
        }
        // 通过改变key来更新表格
        setTableData(tableInfo.data)
        tableInfo.key = uuid()
        tableInfo.expandedRowKeys = expandedRowKeys;
        let obj = {
          node: findParentChildren(children, sourceDragKey),
          parentNode,
          findParentChildren: children,
        }
        emit('dragEnd', cloneDeep(obj))
        setTimeout(() => {
          initSortable()
        }, 200);
      })
    },
  });
};
// 递归查找当前排序层级的父节点
function findParentChildren(data, parentKey) {
  if (parentKey === `${props.resetSetMenu}_parentKey`) {
    return null;
  }
  let parentNode = null;
  data.some(item => {
    if (item._dragKey === parentKey) {
      parentNode = item
    } else if (item.children?.length) {
      parentNode = findParentChildren(item.children, parentKey)
    }
    return parentNode;
  })
  return parentNode;
}
// 处理树形结构数据，添加必要属性
function setTableData(data, pNode = null) {
  // console.log(_this.$attrs.defaultExpandAllRows, _this.$attrs);
  data.forEach((item, index) => {
    if (pNode) {
      item._level = (pNode._level + 1);
      item._dragKey = `${pNode._dragKey}-${index}`;
      item._parentKey = pNode._dragKey;
    } else {
      item._level = 1;
      item._dragKey = `${props.resetSetMenu}_${index}`;
      item._parentKey = `${props.resetSetMenu}_parentKey`;
    }
    if (item.children?.length) {
      setTableData(item.children, item);
      if (_this.$attrs.defaultExpandAllRows || _this.$attrs['default-expand-all-rows']) {
        tableInfo.expandedRowKeys.push(rowKeyFn(item))
      }
    }
  });
}
</script>

<style lang="less" scoped>
.appTableBox {
  width: 100%;
  // height: 100%;
  padding: 4px;
  display: flex;
  flex-direction: column;

  .table-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 24px;
    margin-bottom: 8px;
    .table-title-item {
      width: 60%;
      display: flex;
      &.item-right { 
        width: 38%;
        justify-content: flex-end;
      }

      :deep(.ant-space) {
        flex-wrap: wrap;
      }
    }
  }
  .table-content {
    width: 100%;
    // height: calc(100% - 344px);
    // margin-bottom: 10px;
    :deep(.ant-table) {
      .ant-table-body {
        height: v-bind(scrollHeigth) !important;
      }
    }
  }

  .table-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // height: 40px;
    width: 100%;
  }

  .subsidiaryTable-content {
    width: 100%;
    height: 276px;
  }

  :deep(.ant-spin-nested-loading) {
    width: 100%;
    height: 100%;

    .ant-spin-container {
      width: 100%;
      height: 100%;
    }
  }
}

:deep(.ant-table-cell-ellipsis.ant-table-cell-fix-left-last .ant-table-cell-content) {
  overflow: visible;
}
:deep(.table-striped) td {
  background-color: #fafafa;
}
:deep(.table-drag) td {
  cursor: all-scroll;
}

.resizable-header {
  // height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .resizable-header-right {
    width: 6px;
    height: 100%;
    position: absolute;
    top: 0;
    right: -8px;
    z-index: 999;
    cursor: col-resize;
  
    &.sorters {
      right: -3px;
    }
  }
}


.tableSetting-box {
  max-height: 300px;
  overflow-y: auto;

  .tableSetting-columnRow {
    min-height: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 4px 0;
    background: #fafafa;

    .columnRow-title {
      width: 200px;
      cursor: all-scroll;
      padding-left: 4px;
    }

    :deep(.ant-checkbox-wrapper) {
      margin-left: 16px;
    }
  }
}

.tableSetting-btn {
  padding: 8px 0;
  text-align: right;
}
</style>
