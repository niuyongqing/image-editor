<template>
  <div>
<!--    搜索区域-->
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit">
      <template #formItemBox>
        <a-form-item label="月份" name="month">
          <a-range-picker v-model:value="searchForm.month" picker="month" :bordered="true" format="YYYY-MM" value-format="YYYY-MM"/>
        </a-form-item>
        <a-form-item label="店铺" name="name">
          <a-select v-model:value="searchForm.name" mode="multiple" show-search allowClear :maxTagCount="1" placeholder="请输入店铺">
            <a-select-option v-for="shop in shopOptions" :key="shop" :value="shop">
              {{ shop }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
    </app-table-form>

<!--    表格区域-->
    <app-table-box :reset-set-menu="resetSetMenu" :table-header="tableHeader" :data-source="tableData" :scroll="{x: 1800,y: tableHeight}" @change="tableDataChange">
<!--      按钮-->
      <template #leftTool>
        <a-button type="primary" @click="importModel = true"><upload-outlined />导入新增</a-button>
        <a-button type="primary" @click="importModel = true"><upload-outlined />导出</a-button>
      </template>
<!--      操作区-->
      <template #options="{ record, column }">
        <a-button type="text" danger>删除</a-button>
      </template>
<!--      分页器区域-->
      <template #pagination>
        <pagination v-model:current="tableParms.pageNum" v-model:pageSize="tableParms.pageSize" :total="tableParms.total" @pageNumChange="pageNumChange" @pageSizeChange="pageSizeChange"></pagination>
      </template>
    </app-table-box>


<!--    导入新增弹框-->
    <ImportModal v-model:visible="importModel" @importSuccess="handleImportSuccess" @cancel="handleImportCancel"/>
  </div>
</template>

<script setup>
/*                     直通车扣费                  */
defineOptions({ name: 'directTrainDeduction' });
import { ref, reactive, defineAsyncComponent, onMounted, computed } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import tableHeader from '@/pages/financialStatements/aliexpress/dataConfig/directTrainDeduction/js/tableHeader.js';

// 异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const pagination = defineAsyncComponent(() => import('@/components/common/appTablePagination.vue'));
const ImportModal  = defineAsyncComponent(() => import('@/pages/financialStatements/aliexpress/dataConfig/directTrainDeduction/common/importModel.vue'));

const resetSetMenu = 'directTrainDeduction';
const importModel = ref(false);//导入新增弹框
const tableData = ref([]);
const shopOptions = ref(['店铺1', '店铺2', '店铺3']);

const tableParms = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const searchForm = reactive({
  pageNum: 1,
  pageSize: 50,
  month: null,
  name: [],
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

// 导入成功回调
const handleImportSuccess = (fileList) => {
  console.log('导入成功', fileList);
  // 这里可以重新加载表格数据
  // loadTableData()
}

// 导入取消回调
const handleImportCancel = () => {
  console.log('导入取消');
}

</script>

<style lang="less" scoped>

</style>