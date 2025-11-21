<template>
  <div id="shopTargetSet">
    <appTableForm v-model:formData="formData" @onSubmit="onSubmit" @formHeightChange="formHeightChange"
      resetSetMenu="serialNumberManagement" label-width="100">
      <template #formItemBox>
        <a-form-item label="年份" name="dataYear">
          <a-date-picker v-model:value="formData.dataYear" picker="year" value-format="YYYY" />
        </a-form-item>
        <a-form-item label="月份" name="dataMonth">
          <a-select v-model:value="formData.dataMonth" :options="options.monthList" placeholder="请选择月份" allowClear
            @change="getVersionList"></a-select>
        </a-form-item>
        <a-form-item label="运营" name="userName">
          <a-select v-model:value="formData.userName" style="width: 100%" placeholder="请输入关键字"
            :options="options.shopUserNameList" :filterOption="userFilterOption" :optionFilterProp="'label'"
            show-search></a-select>
        </a-form-item>
        <a-form-item label="店铺" name="shopName">
          <a-select v-model:value="formData.shopName" show-search :options="options.shopList" :optionFilterProp="'label'"
            :filterOption="userFilterOption" placeholder="请选择小组" allowClear></a-select>
        </a-form-item>
        <a-form-item label="品类" name="categoryNames">
          <a-select v-model:value="formData.categoryNames" style="width: 100%" placeholder="请选择"
            :options="options.categoryList" :filterOption="userFilterOption" :optionFilterProp="'label'"
            show-search mode="multiple" :maxTagCount="1"></a-select>
        </a-form-item>
        <a-form-item label="流水号" name="serialNumber">
          <a-select v-model:value="formData.serialNumber" :options="options.serialNumberList" placeholder="请选择流水号"
            allowClear></a-select>
        </a-form-item>
      </template>
    </appTableForm>
    <appTableBox :table-header="shopTargetSet_header" :data-source="shopTargetSet.data"
      reset-set-menu="shopTargetSet" :scroll="{ y: tableScrollHeihth, x: 1800 }" :loading="tableLoading"
      :row-selection="rowSelection" rowKey="id">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'rowIndex'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </template>
      <template #leftTool>
        <a-button type="primary" :disabled="isDisabled" @click="importModel = true">导入新增</a-button>
        <a-button type="primary" @click="addItem" :disabled="isDisabled">新增</a-button>
        <a-button type="primary" danger :disabled="isDisabled" @click="deleteAccount">删除</a-button>
      </template>
      <!-- 操作区 -->
      <template #options="{ record }">
        <a-button type="link" @click="editAccount(record)">编辑</a-button>
        <a-button type="link" danger @click="deleteAccount(record)">删除</a-button>
        <a-button type="text" @click="cheackLog(record)">日志</a-button>
      </template>
      <template #pagination>
        <app-table-pagination v-model:current="shopTargetSet.tableParams.pageNum"
          v-model:page-size="shopTargetSet.tableParams.pageSize" :total="shopTargetSet.total"
          @pageNumChange="pageNumChange" @pageSizeChange="pageSizeChange"></app-table-pagination>
      </template>
    </appTableBox>
    <createModal
      v-model:open="addOpen"
      :options="options"
      :page-type="pageType"
      :detail-data="detailData"
    />
    <!-- 导入新增弹框-->
    <ImportModal v-model:visible="importModel" />
    <!-- 日志弹框 -->
    <log-modal v-model:visible="logVisible" :logData="logData"></log-modal>
    <!-- 删除弹框 -->
    <delete-modal v-model:visible="deleteVisible" @deleteCancel="handledeleteCancel"
      @deleteOk="handleDeleteOk"></delete-modal>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { monthList } from '~@/pages/financialStatements/common/data';
import { shopTargetSet_header } from './js/tableHeader.js';
import { dictList, versionList } from '~@/pages/financialStatements/aliexpress/dataConfig/setOperationalGoals/js/api.js';
import { shopTargetSetList,detail,logList,batchDelete } from './js/api.js';
import { message, Modal } from 'ant-design-vue'

defineOptions({ name: "shopTargetSet" })

const appTableForm = defineAsyncComponent(() => import('@/components/common/appTableForm.vue'));
const appTableBox = defineAsyncComponent(() => import('@/components/common/appTableBox.vue'));
const createModal = defineAsyncComponent(() => import('./components/createModal.vue'));
// 导入新增弹框组件
const ImportModal = defineAsyncComponent(() => import('./components/importModal.vue'));

const logModal = defineAsyncComponent(() => import('./components/logModal.vue'));
// 删除弹框组件
const deleteModal = defineAsyncComponent(() => import('./components/deleteModal.vue'));

const tableLoading = ref(false);
const selectedRowList = ref([]); // 选中的行
const isDisabled = ref(false);
const addOpen = ref(false); // 新增弹窗
const detailData = ref({}); // 详情数据
const pageType = ref('add'); // 页面类型
// 日志弹框是否显示
const logVisible = ref(false); // 日志弹框是否显示
const logData = ref([]); // 日志数据
// 删除弹窗是否显示
const deleteVisible = ref(false); // 删除弹窗是否显示
const idList = ref([]); // 删除的ID列表
// 导入新增弹框是否显示
const importModel = ref(false);

const shopTargetSet = reactive({
  data: [],
  total: 0,
  tableParams: {
    "pageNum": 1,
    "pageSize": 20,
    "order": "DESC",
    "prop": "create_time"
  }
});
const formData = reactive({
  dataYear: dayjs(),
  dataMonth: dayjs().format('MM'),
  userName: '',
  shopName: '',
  categoryNames: [],
  serialNumber: '',
});
const options = reactive({
  monthList,  // 月
  shopList: [], // 店铺列表
  serialNumberList: [], // 流水号列表
  shopUserNameList: [], // 运营列表
  categoryList: [], // 品类列表
})

const formHeight = ref(0);
const tableScrollHeihth = computed(() => {
  return ((window.innerHeight * 0.96) - 20 - 24 - 24 - 8 - 40 - 56 - formHeight.value);
});

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowList.value,
    onChange: (rowKeys, rows) => {
      selectedRowList.value = rowKeys; //只接收ID
      console.log('selectedRowList', selectedRowList.value);
    },
  };
});

// 监听流水号是否为空禁用按钮
watch(() => formData.serialNumber, (newVal, oldVal) => {
  isDisabled.value = newVal !== '';
}, {
  immediate: true,
});

function formHeightChange(height) {
  formHeight.value = height;
}

function userFilterOption(val, option) {
  // 将输入值和选项的 label（姓名）都转为小写，实现不区分大小写的模糊匹配
  return option.label.toLowerCase().includes(val.toLowerCase());
}

// 分页器页数变化
function pageNumChange(val) {
  shopTargetSet.tableParams.pageNum = val;
  getOperationalGoalsList();
}
// 分页器每页条数变化
function pageSizeChange(val) {
  shopTargetSet.tableParams.pageSize = val;
  pageNumChange(1);
}

// 查询公共字典
async function getCommonDictList() {
  try {
    // 使用 Promise.all 并发请求三个字典数据
    const [shopRes, marketerRes,categoryRes] = await Promise.all([
      dictList('dict_shop'),
      dictList('dict_marketer'),
      dictList('dict_category')
    ]);

    // 统一处理响应结果
    if (shopRes.code === 200) {
      options.shopList = shopRes.data.map(item => ({
        label: item.itemName,
        value: item.itemValue,
      }));
    }

    if (marketerRes.code === 200) {
      options.shopUserNameList = marketerRes.data.map(item => ({
        label: item.itemName,
        value: item.itemValue,
      }));
    }

    if (categoryRes.code === 200) {
      options.categoryList = categoryRes.data.map(item => ({
        label: item.itemName,
        value: item.itemValue,
      }));
    }
  } catch (error) {
    console.error('获取字典数据失败:', error);
    // 可以在这里添加错误处理逻辑，如重试机制或用户提示
  }
}

// 查询流水号列表
function getVersionList() {
  let params = {
    dataYear: dayjs(formData.dataYear).format('YYYY'),
    dataMonth: dayjs(formData.dataMonth).format('MM')
  };
  versionList(params).then(res => {
    if (res.code === 200) {
      options.serialNumberList = [
        { label: '待生成', value: '' }, // 默认选项放在第一位
        ...res.data.map(item => ({
          label: item.serialNumber,
          value: item.serialNumber,
        }))
      ];
    }
  })
}

// 查询
function onSubmit() {
  getShopTargetSetList();
}

// 新增
function addItem() {
  addOpen.value = true;
}
// 编辑
function editAccount(record) {
  pageType.value = 'edit';
  addOpen.value = true;
  detail(record.id).then(res => {
    if (res.code === 200) {
      detailData.value = res.data;
    }
  })
}

// 删除
function deleteAccount(record) {
  deleteVisible.value = true;
  if (record.id) {
    idList.value = [record.id];
  } else {
    idList.value = selectedRowList.value;
  }
}

// 处理删除取消
function handledeleteCancel() {
  deleteVisible.value = false;
  selectedRowList.value = []; // 清空选中的行
}
// 处理删除确定
function handleDeleteOk() {
  deleteVisible.value = false;
  batchDelete({ ids: idList.value }).then(res => {
    if (res.code === 200) {
      message.success('删除成功');
    }
  })
}

// 查询店铺目标列表
function getShopTargetSetList() {
  let params = {
    dataYear: dayjs(formData.dataYear).format('YYYY'),
    dataMonth: dayjs(formData.dataMonth).format('MM'),
    userName: formData.userName,
    shopName: formData.shopName,
    categoryNames: formData.categoryNames,
    serialNumber: formData.serialNumber,
    pageNum: shopTargetSet.tableParams.pageNum,
    pageSize: shopTargetSet.tableParams.pageSize,
    order: shopTargetSet.tableParams.order,
    prop: shopTargetSet.tableParams.prop
  };
  shopTargetSetList(params).then(res => {
    if (res.code === 200) {
      shopTargetSet.data = res.data.map(item => ({
        ...item,
        profitRateTargetPop: (item.profitRateTargetPop + '%'),
        profitRateTargetSemiJIT: (item.profitRateTargetSemiJIT + '%'),
        profitRateTargetSemiStore: (item.profitRateTargetSemiStore + '%'),
        profitRateTargetFullJIT: (item.profitRateTargetFullJIT + '%'),
        profitRateTargetFullStore: (item.profitRateTargetFullStore + '%'),
      })) || [];
      shopTargetSet.total = res.total || 0;
    }
  })
}

// 日志
function cheackLog(record = null) {
  logVisible.value = true;
  if (record) {
    logList(record.id).then(res => {
      if (res.code === 200) {
        logData.value = res.data;
      }
    })
  }
}

onMounted(() => {
  getCommonDictList();
  getVersionList();
  getShopTargetSetList();
});
</script>
<style lang="less" scoped></style>