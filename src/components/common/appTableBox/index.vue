<template>
  <div
    id="appTableBox"
    class="appTableBox"
  >
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
            <a-popconfirm
              title="是否保存?"
              ok-text="是"
              cancel-text="否"
              @confirm="tableSetting"
              v-if="columns.columnChange"
            >
              <a-button
                type="dashed"
                danger
                :loading="btnLoading"
              >
                保存当前列表视图
              </a-button>
            </a-popconfirm>
            <!-- 顶部右侧工具按钮插槽 -->
            <slot name="rightTool"></slot>
            <a-popover
              placement="bottomRight"
              trigger="click"
            >
              <template #content>
                <div class="tableSetting-box">
                  <div
                    class="tableSetting-columnRow"
                    v-for="item in columns.list"
                    :key="item.key"
                  >
                    <div class="columnRow-title">{{ item.title }}</div>
                    <a-checkbox v-model:checked="item.show">显示</a-checkbox>
                    <a-checkbox
                      v-model:checked="item.fixedLeft"
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'left')"
                    >
                      固定左侧
                    </a-checkbox>
                    <a-checkbox
                      v-model:checked="item.fixedRight"
                      :disabled="!item.show"
                      @change="e => fixedCheckboxChange(item, 'right')"
                    >
                      固定右侧
                    </a-checkbox>
                  </div>
                </div>
                <div class="tableSetting-btn">
                  <a-space>
                    <a-button
                      @click="resetSettings"
                      :loading="btnLoading"
                    >
                      重置设置
                    </a-button>
                    <a-button
                      type="primary"
                      @click="tableSetting"
                      :loading="btnLoading"
                    >
                      保存设置
                    </a-button>
                  </a-space>
                </div>
              </template>
              <template #title>
                <span>表格设置</span>
              </template>
              <a-button
                type="primary"
                @click="columnDrop()"
              >
                <template #icon>
                  <SettingOutlined />
                </template>
                {{ '表格设置' }}
              </a-button>
            </a-popover>
          </a-space>
        </div>
      </div>
      <div
        class="table-content"
        :class="`${resetSetMenu}-table`"
      >
        <a-table
          v-bind="$attrs"
          :columns="columns.list.filter(i => i.show)"
          :data-source="dataSource"
          :scroll="scroll"
          bordered
          :pagination="false"
          resizable
        >
          <template #headerCell="{ column }">
            <div class="resizable-header">
              <slot
                :name="'headerCell'"
                :column="column"
              >
                {{ column?.title }}
              </slot>
              <div
                class="resizable-header-right"
                @mousedown.stop="e => onMouseDown(e, column)"
              ></div>
            </div>
          </template>
          <template #bodyCell="{ column, record, index }">
            <slot
              name="bodyCell"
              :record="record"
              :index="index"
              :column="column"
            >
              {{ record[column?.key] }}
            </slot>
          </template>
          <template #summary v-if="isSummary">
            <slot name="summary"></slot>
          </template>
          <template #expandedRowRender="{ record }" v-if="isExpandedRowRender">
            <slot name="expandedRowRender" :record="record"></slot>
          </template>
          <template #expandColumnTitle>
            <slot name="expandColumnTitle"></slot>
          </template>
        </a-table>
      </div>
      <div class="table-pagination">
        <slot name="pagination"></slot>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { EyeOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import Sortable from 'sortablejs';
import { onMounted, reactive, ref } from 'vue';
import { settingList, settingTableEdit } from './js/api';
defineOptions({ name: 'appTableBox' });
const { proxy: _this } = getCurrentInstance();
const emit = defineEmits(['update:filterColumns']);
const props = defineProps({
  resetSetMenu: {
    // 表头唯一标识，不能重复，必传
    type: String,
    default: '',
  },
  tableHeard: {
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
  isSummary: Boolean,               // 启用总结行插槽
  isExpandedRowRender: Boolean,     // 启用行展开插槽
});
const btnLoading = ref(false);
const columns = reactive({
  list: [],
  isResizing: false,
  resizingColumnKey: null,
  columnChange: false,
});
const columnList = computed(() => {
  return props.tableHeard.map((i, index) => {
    let obj = {
      sorter: index % 3 === 1,
      fixed: false,
      fixedLeft: false,
      fixedRight: false,
      show: true,
      ...i,
      resizable: false,
    };
    return obj;
  });
});
//  获取columns
onMounted(async () => {
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
})
// 获取表头
async function getSettingList() {
  if (!props.resetSetMenu) {
    console.error('缺少resetSetMenu！');
    return;
  }
  try {
    let res = await settingList({ menu: props.resetSetMenu });
    if (res.code === 200) {
      columns.list = res.data?.table ? JSON.parse(res.data.table) : cloneDeep(columnList.value);
      columns.columnChange = false;
    }
  } catch (error) {
    console.error(error);
  }
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
  let leftList = columns.list.filter(i => i.fixed === 'left');
  let rightList = columns.list.filter(i => i.fixed === 'right');
  let list = columns.list.filter(i => !i.fixed);
  columns.list = [...leftList, ...list, ...rightList];
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
// 重置表格
async function resetSettings() {
  btnLoading.value = true;
  try {
    await settingTableEdit({ menu: props.resetSetMenu, table: null });
    message.success('已保存');
    columns.list = cloneDeep(columnList.value);
    nextTick(() => {
      columns.columnChange = false;
    })
  } catch (error) {
    console.error(error);
  }
  btnLoading.value = false;
}
// 保存表格设置
async function tableSetting(value) {
  btnLoading.value = true;
  try {
    let params = {
      menu: props.resetSetMenu,
      table: JSON.stringify(columns.list),
    };
    await settingTableEdit(params);
    await getSettingList();
    columns.columnChange = false;
    message.success('已保存');
  } catch (error) {
    console.error(error);
  }
  btnLoading.value = false;
  return Promise.resolve()
}
let sortable = null; // 拖拽对象实例
//列拖拽
function columnDrop() {
  setTimeout(() => {
    const wrapperTr = document.querySelector('.tableSetting-box');
    if (!wrapperTr) return;
    sortable = Sortable.create(wrapperTr, {
      animation: 300,
      delay: 0,
      onEnd: evt => {
        dropColumn(evt);
      },
    });
  }, 200);
}
// 保存拖拽列
function dropColumn(evt) {
  let headers = cloneDeep(columns.list);
  const oldItem = headers[evt.oldIndex];
  headers.splice(evt.oldIndex, 1);
  headers.splice(evt.newIndex, 0, oldItem);
  columns.list = headers;
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
  max-height: 500px;
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
