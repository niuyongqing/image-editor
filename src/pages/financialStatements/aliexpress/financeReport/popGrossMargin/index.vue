<template>
  <div>
<!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit">
      <template #formItemBox>
        <a-form-item label="店铺" name="name">
          <a-select v-model:value="searchForm.name" mode="multiple" show-search allowClear :maxTagCount="1" placeholder="请输入店铺">
            <a-select-option v-for="shop in shopOptions" :key="shop" :value="shop">
              {{ shop }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="部门" name="dept">
          <a-select v-model:value="searchForm.dept" mode="multiple" show-search allowClear :maxTagCount="1" placeholder="请输入部门">
            <a-select-option v-for="dept in deptOptions" :key="dept" :value="dept">
              {{ dept }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="运营人员" name="people">
          <a-select v-model:value="searchForm.people" mode="multiple" show-search allowClear :maxTagCount="1" placeholder="请输入运营人员">
            <a-select-option v-for="people in peopleOptions" :key="people" :value="people">
              {{ people }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <template #formItemRow>
        <a-form-item label="日期" name="people">
          <a-select v-model:value="searchForm.people" mode="multiple" show-search allowClear :maxTagCount="1" placeholder="请输入运营人员">
            <a-select-option v-for="people in peopleOptions" :key="people" :value="people">
              {{ people }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
    </app-table-form>

<!--    表格区域-->
    <app-table-box :reset-set-menu="resetSetMenu" :table-header="columns" :data-source="tableData" :scroll="{x: 1800,y: tableHeight}" @change="tableDataChange">
<!--      按钮-->
      <template #leftTool>
        <a-button type="primary"><ArrowDownOutlined />导出</a-button>
      </template>
<!--      表格个性化区域-->
      <template #headerCell="{ column }">
        <div class="custom-header-group" :class="getHeaderClass(column)">
<!--          &lt;!&ndash; 副标题 &ndash;&gt;-->
<!--          <div class="group-title" v-if="column.groupShow">-->
<!--            {{ column.group }}-->
<!--          </div>-->
          <!-- 主标题 -->
          <div class="main-title">
            {{ column.title }}
          </div>
        </div>
      </template>
<!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="tableParms.pageNum" v-model:pageSize="tableParms.pageSize" :total="tableParms.total" @pageNumChange="pageNumChange" @pageSizeChange="pageSizeChange"></pagination>
      </template>
    </app-table-box>
  </div>
</template>

<script setup>
defineOptions({ name: 'popGrossMargin' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import { ArrowDownOutlined } from "@ant-design/icons-vue";
import tableHeader from '@/pages/financialStatements/aliexpress/financeReport/popGrossMargin/js/tableHeader.js';

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));

const resetSetMenu = 'popGrossMargin';
const tableData = ref([]);
const shopOptions = ref(['店铺1', '店铺2', '店铺3']);
const deptOptions = ref(['部门1', '部门2', '部门3']);
const peopleOptions = ref(['人员1', '人员2', '人员3'])

const tableParms = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const searchForm = reactive({
  pageNum: 1,
  pageSize: 50,
  name: [],
  dept: [],
  people: [],
});

onMounted(() => {
  tableData.value = [
    {
      id: 1,
      netProfit: '150.25',
      sourceProfit: '17.36',
      shopProfitRate: '120.25',
      actualProfit: '',
      orderAmount: '102.21',
      refundAmount: '21.36'
    },
    {
      id: 2,
      netProfit: '150.25',
      sourceProfit: '',
      shopProfitRate: '',
      actualProfit: '90.56',
      orderAmount: '102.21',
      refundAmount: '21.36'
    },
    {
      id: 3,
      netProfit: '150.25',
      sourceProfit: '',
      shopProfitRate: '',
      actualProfit: '90.56',
      orderAmount: '102.21',
      refundAmount: '21.36'
    },
    {
      id: 4,
      netProfit: '150.25',
      sourceProfit: '17.36',
      shopProfitRate: '120.25',
      actualProfit: '',
      orderAmount: '102.21',
      refundAmount: '21.36'
    },
    {
      id: 5,
      netProfit: '150.25',
      sourceProfit: '17.36',
      shopProfitRate: '120.25',
      actualProfit: '',
      orderAmount: '102.21',
      refundAmount: '21.36'
    }
  ];
});

//进入页面计算表格高度
const tableHeight = computed(() => {
  return window.innerHeight - 320
})

// 处理列配置，确保有 group 属性
const columns = computed(() => {
  return tableHeader.map(col => ({
    ...col,
    // 确保每个列都有 group 属性，如果没有就设为空字符串
    group: col.group || ''
  }));
});

// 根据 group 返回对应的 CSS 类名
const getHeaderClass = (column) => {
  const groupMap = {
    '利润': 'profit-group',
    '收入': 'income-group',
    '成本': 'cost-group',
    '支出': 'expenditure-group',
    '其他': 'other-group',
    '': 'default-group'
  };
  return groupMap[column.group] || 'default-group';
};

//查询回调
const onSubmit = (e) => {
  console.log(searchForm);
};

//表格排序操作
const tableDataChange = (pagination, filters, sorter) => {
  console.log(sorter);
};

//页数回调
const pageNumChange = (val) =>{
  console.log(val);
}

//页数大小回调
const pageSizeChange = (val) =>{
  console.log(val);
}
</script>

<style lang="less" scoped>
:deep(.ant-table-thead > tr .ant-table-cell-scrollbar){
  display: none;
}
// 表头分组样式
:deep(.ant-table-thead > tr > th) {
  vertical-align: bottom !important;
  padding: 8px 12px !important;
  text-align: center !important;

  &:has(.profit-group) {
    background: linear-gradient(180deg, #D8E0FF, #FFFFFF) !important;

  }

  &:has(.income-group) {
    background: linear-gradient(180deg, #DFECFF, #FFFFFF) !important;
  }

  &:has(.cost-group) {
    background: linear-gradient(180deg, #FFEAD1, #FFFFFF) !important;
  }

  &:has(.expenditure-group) {
    background: linear-gradient(180deg, #F0FBE1, #FFFFFF) !important;
  }

  &:has(.other-group) {
    background: linear-gradient(180deg, #FFF1F1, #FFFFFF) !important;
  }
}

// 分组内容样式
.profit-group {
  .main-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
  }
  .group-title {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #161AFF;
  }
}

.income-group {
  .main-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
  }
  .group-title {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #1677FF;
  }
}

.cost-group {
  .main-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
  }
  .group-title {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #FF961A;
  }
}

.expenditure-group {
  .main-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
  }
  .group-title {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #ADFF1A;
  }
}

.other-group {
  .main-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.2;
  }
  .group-title {
    position: absolute;
    left: 0;
    bottom: 0;
    color: #FFACAC;
  }
}

.default-group {
  .main-title {
    color: #000000;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.2;
  }
}
</style>