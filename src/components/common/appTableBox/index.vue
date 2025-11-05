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
            <!-- 顶部右侧工具按钮插槽 -->
            <slot name="rightTool"></slot>
            <a-popover placement="bottomRight" trigger="click">
              <template #content>
                <div class="tableSetting-box">
                  <div 
                    class="tableSetting-columnRow" 
                    v-for="item in columns"
                    :key="item.key"
                  >
                    <div class="columnRow-title">{{ item.title }}</div>
                    <a-checkbox v-model:checked="item.show">显示</a-checkbox>
                    <a-checkbox v-model:checked="item.fixedLeft" @change="e => fixedCheckboxChange(item, 'left')">固定左侧</a-checkbox>
                    <a-checkbox v-model:checked="item.fixedRight" @change="e => fixedCheckboxChange(item, 'right')">固定右侧</a-checkbox>
                  </div>
                </div>
                <div class="tableSetting-btn">
                  <a-space>
                    <a-button @click="tableSetting">重置设置</a-button>
                    <a-button type="primary" @click="tableSetting">保存设置</a-button>
                  </a-space>
                </div>
              </template>
              <template #title>
                <span>表格设置</span>
              </template>
              <a-button type="primary" @click="columnDrop()">
                <template #icon>
                  <SettingOutlined />
                </template>
                {{ '表格设置' }}
              </a-button>
            </a-popover>
          </a-space>
        </div>
      </div>
      <div class="table-content">
        <a-table
          v-bind="$attrs"
          :columns="columns.filter(i => i.show)"
          :data-source="dataSource"
        >
          <template #headerCell="{ column }">
            <slot
              :name="'headerCell'"
              :column="column"
            >
              {{ column?.title }}
            </slot>
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
        </a-table>
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
    type: String,
    default: '',
  },
  tableHeard: {
    // 原始表头
    type: Array,
    default: () => ([]),
  },
  dataSource: {
    type: Array,
    default: () => ([])
  },
  filterColumns: {
    // 当前展示的表头，用v-model直接绑定即可
    type: Array,
    default: () => ([]),
  },
});
const btnLoading = reactive({
  dropAble: false,
  resetSetting: false,
});
const filterColumns = ref([]);
const columns = ref([]);
const columnList = computed(() => {
  return props.tableHeard.map(i => {
    let obj = {
      sorter: false,
      fixed: false,
      fixedLeft: false,
      fixedRight: false,
      show: true,
      ...i,
    };
    return obj;
  })
})
//  获取columns
onMounted(() => {
  nextTick(() => {
    getSettingList();
    // columnDrop();
  });
});
// 显示/隐藏
function settingChange(item, value) {
  columns.value.forEach(col => {
    if (col.key === item.key) {
      col.show = value;
    }
  });
  if (!props.resetSetMenu) return;
  settingTableEdit({
    menu: props.resetSetMenu,
    table: JSON.stringify(columns.value),
  }).then(res => {
    getSettingList();
    message.success('已保存');
  });
}
// 获取表头
function getSettingList() {
  if (!props.resetSetMenu) {
    console.error('缺少resetSetMenu！');
    return;
  }
  settingList({ menu: props.resetSetMenu }).then(res => {
    if (res.code === 200) {
      columns.value = res.data?.table ? JSON.parse(res.data.table) : columnList.value;
      filterColumns.value = columns.value.filter(item => item.show);
      emit('update:filterColumns', filterColumns.value);
    }
  });
}
/**
 * 固定表头
 * @param col  表头对象
 * @param type 固定方式
 */
function fixedCheckboxChange(col, type) {
  console.log({col, type});
  if (type === 'left') {
    col
  }
}
// 重置表格
async function resetSettings() {
  if (!props.resetSetMenu) {
    columns.value = columnList.value;
    filterColumns.value = columns.value.filter(item => item.show);
    return;
  }
  btnLoading.resetSetting = true;
  try {
    await settingTableEdit({ menu: props.resetSetMenu, table: null });
    message.success('已保存');
    columns.value = columnList.value;
    filterColumns.value = columnList.value;
    emit('update:filterColumns', filterColumns.value);
  } catch (error) {
    console.error(error);
  }
  btnLoading.resetSetting = false;
}
// 表格设置
async function tableSetting(value) {
  // 保存表格列设置
  btnLoading.dropAble = !btnLoading.dropAble;
  // columnDrop();
  if (!props.resetSetMenu) return;
  if (!btnLoading.dropAble) {
    try {
      let params = {
        menu: props.resetSetMenu,
        table: JSON.stringify(filterColumns.value),
      };
      await settingTableEdit(params);
      getSettingList();
      message.success('已保存');
    } catch (error) {
      console.error(error);
    }
  }
}
let sortable = null; // 拖拽对象实例
//列拖拽
function columnDrop() {
  setTimeout(() => {
    const wrapperTr = document.querySelector('.tableSetting-box');
    if (!wrapperTr) return;
    // if (!btnLoading.dropAble) {
    //   sortable.destroy();
    //   sortable = null;
    //   return;
    // }
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
  let headers = cloneDeep(filterColumns.value);
  const oldItem = headers[evt.oldIndex];
  headers.splice(evt.oldIndex, 1);
  headers.splice(evt.newIndex, 0, oldItem);
  filterColumns.value = headers;
  emit('update:filterColumns', filterColumns.value);
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
      width: 50%;
      &.item-right {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .table-content {
    width: 100%;
    height: calc(100% - 344px);
    // margin-bottom: 10px;
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
