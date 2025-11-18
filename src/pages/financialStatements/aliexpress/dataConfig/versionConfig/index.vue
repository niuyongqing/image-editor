<template>
  <div>
<!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" :rules="searchRules" @onSubmit="onSubmit">
      <template #formItemRow>
        <a-form-item label="版本月份" name="month">
          <a-range-picker v-model:value="searchForm.month" picker="month" :bordered="true" format="YYYY-MM" value-format="YYYY-MM"/>
        </a-form-item>
      </template>
    </app-table-form>

<!--    表格区域-->
    <app-table-box :reset-set-menu="resetSetMenu" :table-header="tableHeader" :data-source="tableData" :scroll="{x: 1800,y: tableHeight}" @change="tableDataChange">
<!--      操作区-->
      <template #options="{ record, column }">
        <a-button type="link">回溯版本</a-button>
      </template>
<!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="tableParms.pageNum" v-model:pageSize="tableParms.pageSize" :total="tableParms.total" @pageNumChange="pageNumChange" @pageSizeChange="pageSizeChange"></pagination>
      </template>
    </app-table-box>
  </div>
</template>

<script setup>
/*                     版本管理                  */
defineOptions({ name: 'versionConfig' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import tableHeader from '@/pages/financialStatements/aliexpress/dataConfig/versionConfig/js/tableHeader.js';

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));

const resetSetMenu = 'versionConfig';
const tableData = ref([]);
const searchRules = {
  month: [
    {
      required: true,
      message: '请选择月份',
      trigger: 'change',
    },
  ],
};

const tableParms = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const searchForm = reactive({
  pageNum: 1,
  pageSize: 50,
  month: null
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

</style>