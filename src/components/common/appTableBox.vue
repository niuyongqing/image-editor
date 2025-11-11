<template>
  <div id="appTableBox" class="appTableBox">
    <a-card style="margin-bottom: 10px">
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
            <a-popover placement="bottomRight" trigger="click" v-if="isTableSetting">
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
              <a-button type="primary" @click="columnDrop()">
                <template #icon><SettingOutlined /></template>
                {{ '表格设置' }}
              </a-button>
            </a-popover>
          </a-space>
        </div>
      </div>
      <div class="table-content" :class="`${resetSetMenu}-table`">
        <a-table 
          v-bind="$attrs" 
          :columns="showHeader" 
          :data-source="dataSource" 
          :scroll="scroll"
          :pagination="false"
          :customRow="customRow" 
          bordered 
        >
          <template #headerCell="{ column }">
            <div class="resizable-header" v-if="column.key">
              <slot name="headerCell" :column="column">
                {{ column?.title }}
              </slot>
              <div class="resizable-header-right" @mousedown.stop="e => onMouseDown(e, column)"></div>
            </div>
          </template>
          <template #bodyCell="{ column, record, index }">
            <slot name="bodyCell" :record="record" :index="index" :column="column">
              {{ record[column?.key] }}
            </slot>
            <template v-if="!!options && column.key === 'options'">
              <a-space>
                <slot name="options" :record="record" :column="column"></slot>
              </a-space>
            </template>
          </template>
          <template #summary v-if="!!summary">
            <slot name="summary"></slot>
          </template>
          <template #expandedRowRender="{ record }" v-if="!!expandedRowRender">
            <slot name="expandedRowRender" :record="record"></slot>
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
import { cloneDeep } from 'lodash-es';
import Sortable from 'sortablejs';
import { computed, onMounted, reactive, ref, useSlots } from 'vue';
defineOptions({ name: 'appTableBox' });
const { proxy: _this } = getCurrentInstance();
/**
 * rowClick         行单击事件
 * rowDoubleClick   行双击事件
 */
const emit = defineEmits(['update:filterColumns', 'rowClick', 'rowDoubleClick']);
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
  filterColumns: {
    // 当前展示的表头，用v-model直接绑定即可
    type: Array,
    default: () => [],
  },
  scroll: {
    // 表格滚动属性
    type: Object,
    default: () => ({
      y: 'calc(80vh - 120px)',
      x: '1800px',
    }),
  },
  isTableSetting: {             // 是否启用表格设置
    type: Boolean,
    default: true,
  },
});
const {
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
  list: [],
  leftList: [],
  rightList: [],
  centerList: [],
  isResizing: false,
  resizingColumnKey: null,
  columnChange: false,
});
// 原始表头
const columnList = ref([]);
let optionsColumn = {
  sorter: false,
  fixed: 'right',
  show: true,
  resizable: false,
  key: 'options',
  title: '操作',
  width: 150,
  align: 'left'
};
const showHeader = computed(() => {
  let list = columns.list.filter(i => i.show);
  list = !!options ? [...list, optionsColumn] : list;
  return list;
})
//  获取columns
onMounted(async () => {
  generateHeader()
  await getSettingList();
  nextTick(() => {
    columns.columnChange = false;
    // columnDrop();
    resizDomSetting();
  });
});
watch(() => columns.list, (val, oldVal) => {
  columns.columnChange = true;
  emit('update:filterColumns', columns.list);
}, {
  deep: true,
});
// 重新生成表头
function generateHeader() {
  columnList.value = props.tableHeader.map((i, index) => {
    let obj = {
      sorter: false,
      fixed: false,
      fixedLeft: false,
      fixedRight: false,
      show: true,
      ...i,
      resizable: false,
    };
    return obj;
  });
}
// 获取表头
async function getSettingList() {
  if (!props.resetSetMenu) {
    console.error('缺少resetSetMenu！');
    return;
  }
  let { data } = getHeader();
  columns.list = data ? data : cloneDeep(columnList.value);
  columns.leftList = columns.list.filter(i => i.fixed === 'left');
  columns.rightList = columns.list.filter(i => i.fixed === 'right');
  columns.centerList = columns.list.filter(i => !i.fixed);
  columns.columnChange = false;
  return Promise.resolve();
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
        // rowClick(row)
        // console.log({ row }, 'click');
        emit('rowClick', row)
      }, 250);
    },
    onDblclick: () => {
      // 双击时立即清除单击定时器
      clearTimeout(clickTimer);
      // rowDblclick(row);
      // console.log({ row }, 'dblclick');
      emit('rowDoubleClick', row)
    },
  };
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
// 点击拖拽设置列宽
function onMouseDown(event, column) {
  // console.log({ event, column });
  const startX = event.clientX; // 获取鼠标初始位置
  const startWidth = column.width || 0; // 获取初始宽度
  columns.isResizing = true;
  columns.resizingColumnKey = column.key;
  let animationFrameId; // 为了让移动更丝滑
  let val = columns.list.find(i => i.key === column.key);
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
async function tableSetting(val) {
  btnLoading.value = true;
  updateHeader(val);
  getSettingList();
  btnLoading.value = false;
  nextTick(() => {
    message.success('已保存');
    columns.columnChange = false;
  });
  return Promise.resolve();
}
//列拖拽
function columnDrop() {
  let arr = ['leftList', 'centerList', 'rightList'];
  setTimeout(() => {
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
  }, 200);
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
</script>

<style lang="less" scoped>
.appTableBox {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;

  .table-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 24px;
    margin-bottom: 10px;

    .table-title-item {
      width: 48%;

      &.item-right {
        display: flex;
        justify-content: flex-end;
      }

      :deep(.ant-space) {
        flex-wrap: wrap;
      }
    }
  }

  .table-content {
    width: 100%;
    height: calc(100% - 344px);
    // margin-bottom: 10px;
  }

  .table-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 40px;
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

.resizable-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.tableSetting-box {
  max-height: 300px;
  overflow-y: auto;

  .tableSetting-columnRow {
    height: 30px;
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
