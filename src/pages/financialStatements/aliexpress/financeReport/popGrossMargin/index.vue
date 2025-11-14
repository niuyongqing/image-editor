<template>
  <div>
    <app-table-form :reset-set-menu="resetSetMenu" v-model:formData="searchForm" @onSubmit="onSubmit" :mini="true">
      <template #formItemBox>
        <a-form-item label="Activity name" name="name">
          <a-input v-model:value="searchForm.name" />
        </a-form-item>
      </template>
    </app-table-form>
    <app-table-box
        :reset-set-menu="resetSetMenu"
        :table-header="columns"
        :data-source="tableData"
    >
    </app-table-box>
  </div>
</template>

<script setup>
import { ref, reactive, defineAsyncComponent, onMounted } from 'vue';
defineOptions({ name: 'popGrossMargin' });
import tableHeader from '@/pages/financialStatements/aliexpress/financeReport/popGrossMargin/js/tableHeader.js';

//异步加载组件
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue') );
const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue') );

const resetSetMenu = 'popGrossMargin'; // 功能模块唯一标识
const columns = ref(tableHeader); // 表头设置
const tableData = ref([]); // 表格数据
const searchForm = reactive({
  name: '',
}); // 搜索栏

onMounted(() => {
  tableData.value = [
    {
      id: 1,
      name: '测试数据1',
      amount: 1000,
      profit: 200
    },
    {
      id: 2,
      name: '测试数据2',
      amount: 2000,
      profit: 400
    }
  ];
});


const onSubmit = ((e) =>{
  console.log(searchForm)
})
</script>

<style lang="scss" scoped>

</style>