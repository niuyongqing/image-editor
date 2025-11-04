<template>
  <div
    id="appTableBox"
    class="appTableBox"
  >
    <a-card style="margin-bottom: 10px">
      <div class="table-title">
        <a-space>
          <!--  顶部左侧区域 -->
          <slot name="leftTool"></slot>
          <div></div>
        </a-space>
        <a-space>
          <!-- 顶部右侧工具按钮插槽 -->
          <slot name="rightTool"></slot>
          <a-button
            type="primary"
            @click="tableSetting"
          >
            <template #icon>
              <SettingOutlined />
            </template>
            {{ btnLoading.dropAble ? '保存表格设置' : '表格设置' }}
          </a-button>
        </a-space>
      </div>
      <div class="table-content">
        <a-table
          v-bind="$attrs"
          :columns="columns"
          :data-source="dataSource"
        >
          <template #headerCell="{ column }">
            <slot
              :name="'headerCell'"
              :column="column"
            >
              {{ column?.title }}
            </slot>
            <!-- {{ column.name }} -->
          </template>
          <template #bodyCell="{ column, record }">
            <slot
              name="bodyCell"
              :record="record"
              :index="index"
              :column="column"
            >
              {{ record[column?.key] }}
            </slot>
            <!-- {{ record[column.key] }} -->
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
    default: () => [],
  },
  dataSource: {
    type: Array,
    default: () => ([])
  },
  filterColumns: {
    // 当前展示的表头，用v-model直接绑定即可
    type: Array,
    default: () => [],
  },
  tableLoading: {
    // 表格加载状态
    type: Boolean,
    default: false,
  },
  subsidiaryTableLoading: {
    // 附属表格加载状态
    type: Boolean,
    default: false,
  },
  showSubsidiaryTable: Boolean, // 是否展示附表，默认不展示
});
const btnLoading = reactive({
  dropAble: false,
  resetSetting: false,
});
const heightX = ref(0); // 高度拖拉初始值
const heightX2 = ref(0);
const filterColumns = ref([]);
const columns = ref([]);
const tableData = reactive({
  header: [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ],
  data: [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ],
  total: 0,
  loading: false,
  selectedRowKeys: [],
  selectedRows: [],

  params: {
    pageNum: 1,
    pageSize: 50,
    // "order": "descending", // 倒正序，必须 descending/ascending
    // "prop": "complete_time" // 排序列，必须
  },
});
const columnList = computed(() => {
  return props.tableHeard.map(i => {
    let obj = {
      sorter: false,
      fixed: false,
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
    getInnerHeight();
  });
});
// 获取当前的dom高度
function getInnerHeight() {
  // let appTableBox = document.querySelector('#appTableBox')
  let height = window.innerHeight;
  if (props.showSubsidiaryTable) {
    heightX.value = height - 344 - 200; // 344是工具栏及附表的初始高度  200是瞎写的
    heightX2.value = 268;
  } else {
    heightX.value = height - 200;
  }
  // _this.$forceUpdate()
}
function updateDom(val) {
  // console.log(555);
  heightX2.value = val;
  _this.$forceUpdate();
}
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
// 重置表格
async function resetSettings() {
  if (!props.resetSetMenu) {
    columns.value = props.tableHeard;
    filterColumns.value = columns.value.filter(item => item.show);
    return;
  }
  btnLoading.resetSetting = true;
  try {
    await settingTableEdit({ menu: props.resetSetMenu, table: null });
    message.success('已保存');
    columns.value = props.tableHeard;
    filterColumns.value = props.tableHeard;
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
  columnDrop();
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
  const wrapperTr = document.querySelector('.ant-table-thead tr');
  if (!wrapperTr) return;
  if (!btnLoading.dropAble) {
    sortable.destroy();
    sortable = null;
    return;
  }
  sortable = Sortable.create(wrapperTr, {
    animation: 300,
    delay: 0,
    onEnd: evt => {
      dropColumn(evt);
    },
  });
}
// 保存拖拽列
function dropColumn(evt) {
  let headers = cloneDeep(filterColumns.value);
  const oldItem = headers[evt.oldIndex - 1];
  headers.splice(evt.oldIndex - 1, 1);
  headers.splice(evt.newIndex - 1, 0, oldItem);
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
</style>
