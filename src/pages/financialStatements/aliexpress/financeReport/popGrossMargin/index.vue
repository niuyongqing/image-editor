<template>
  <div>
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit" :mini="true">
      <template #formItemBox>
        <a-form-item label="Activity name" name="name">
          <a-input v-model:value="searchForm.name" />
        </a-form-item>
      </template>
    </app-table-form>
    <app-table-box :reset-set-menu="resetSetMenu" :table-header="columns" :data-source="tableData" :scroll="{x: 1800,y: tableHeight}" @change="tableDataChange">
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
    </app-table-box>
  </div>
</template>

<script setup>
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
defineOptions({ name: 'popGrossMargin' });
import tableHeader from '@/pages/financialStatements/aliexpress/financeReport/popGrossMargin/js/tableHeader.js';

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));

const resetSetMenu = 'popGrossMargin';
const tableData = ref([]);
const searchForm = reactive({ name: '' });

//进入页面计算表格高度
const tableHeight = computed(() => {
  return window.innerHeight - 390
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

const onSubmit = (e) => {
  console.log(searchForm);
};

const tableDataChange = (pagination, filters, sorter) => {
  console.log(sorter);
};
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