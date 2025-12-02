<template>
  <div id="storeManagementCont">
    <appTableForm
      ref="formRef"
      v-model:formData="formData"
      reset-set-menu="storeManagementCont"
      @onSubmit="onSubmit"
    >
      <template #formItemRow>
        <a-form-item name="account" label="店铺：">
          <selectComm
            ref="shopSelectComm"
            :options="shopAccount"
            style="margin-left: 10px"
            :fieldObj="shopObj"
            @backSelectAll="shopSelectAll"
            @backSelectItem="shopSelectItem"
          ></selectComm>
        </a-form-item>
      </template>

      <template #formItemBox>
        <a-form-item name="name" label="仓库名称：">
          <a-input
            v-model:value="formData.name"
            placeholder="仓库名称"
            style="width: 200px; display: flex; margin-left: 10px"
          ></a-input>
        </a-form-item>
        <a-form-item name="status" label="仓库状态：">
          <selectComm
            style="margin-left: 10px"
            :options="storeOptions"
            :fieldObj="statusObj"
            @backSelectAll="statusSelectAll"
            @backSelectItem="statusSelectItem"
          ></selectComm>
        </a-form-item>
      </template>
    </appTableForm>


    <!-- <a-card style="margin: 10px 0">
      <a-row style="margin: 10px">
        <a-col :span="1.5">
          <a-button type="primary" @click="syncOrder" :loading="syncLoading"
            >同步仓库数据</a-button
          >
        </a-col>
        <a-col :span="1.5">
          <a-button
            type="primary"
            style="margin-left: 10px"
            @click="syncStore"
            :loading="exportLoading"
            >同步仓库方式信息</a-button
          >
        </a-col>
      </a-row> -->

       <app-table-box
      v-model:filter-columns="columns"
      :data-source="tableData"
      :table-header="columns"
      reset-set-menu="empowerCont"
      :loading="loading"
      :scroll="{y: 'none'}"
    >
    <template #leftTool>
          <a-button type="primary" @click="syncOrder" :loading="syncLoading"
            >同步仓库数据</a-button
          >
          <a-button
            type="primary"
            style="margin-left: 10px"
            @click="syncStore"
            :loading="exportLoading"
            >同步仓库方式信息</a-button
          >
    </template>
        <template #bodyCell="{ column, record, index }">
             <!-- 索引列 -->
        <template v-if="column.key === 'index'">
          {{ index + 1 + (paginations.pageNum - 1) * paginations.pageSize }}
        </template>
          <template v-if="column.dataIndex === 'status'">
            <span>{{ getChineseLabelByValue(record.status) }}</span>
          </template>
          <template v-if="column.dataIndex === 'option'">
            <a-button @click="edit(record)">查看物流方式</a-button>
          </template>
        </template>
        <template #pagination>
            <appTablePagination
                v-model:current="paginations.pageNum"
                v-model:pageSize="paginations.pageSize"
                :defaultPageSize="50"
                :showSizeChanger="true"
                 @pageNumChange="pageNumChange"
          @pageSizeChange="pageSizeChange"
          :total="paginations.total" 
            />
        </template>
        </app-table-box>
      <!-- </a-table> -->
      <!-- <a-pagination
        style="margin-top: 20px; text-align: right"
        :show-total="(total) => `共 ${total} 条`"
        :total="paginations.total"
        v-model:current="paginations.pageNum"
        v-model:pageSize="paginations.pageSize"
        :defaultPageSize="50"
        :showSizeChanger="true"
        @change="getList"
        :pageSizeOptions="[50, 100, 200]"
      ></a-pagination> -->
    <!-- </a-card> -->
    <showModal
      :showOpen="showOpen"
      :tabRow="tabRow"
      @backClose="backClose"
    ></showModal>
  </div>
</template>

<script setup name="storeManagement">
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import { accountCache } from "../config/api/product";
import {
  warehouseList,
  warehouse,
  syncDelivery,
} from "../config/api/storeManagement";
import tableHead from "../config/tabColumns/storeManagement";
import showModal from "./comm/showModal.vue";
import { message } from "ant-design-vue";
import { storeStatus } from "../config/commDic/defDic";
import appTableBox from "~/components/common/appTableBox.vue";
import appTablePagination from "~@/components/common/appTablePagination.vue";
import appTableForm from "~@/components/common/appTableForm.vue";
import selectComm from "@/pages/intelligent-publication/whd-test/selectComm.vue";
const ruleForm = ref(null);
const shopSelectComm = ref(null);
const formData = reactive({
  name: "",
  status: "",
  account: "",
});
const labelCol = {
  style: {
    width: "70px",
  },
};
const shopAccount = ref([]);
const storeOptions = storeStatus;
const loading = ref(false);
const syncLoading = ref(false);
const exportLoading = ref(false);
const showOpen = ref(false);
const tableData = ref([]);
const tabRow = ref({});
const columns = tableHead;
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0,
});
const shopObj = {
  fieldKey: "value",
  fieldLabel: "label",
};
const statusObj = {
  fieldKey: "value",
  fieldLabel: "label",
};
const edit = (row) => {
  showOpen.value = true;
  tabRow.value = row;
};
const backClose = () => {
  showOpen.value = false;
};
const getChineseLabelByValue = (targetValue) => {
  return storeOptions.find((item) => item.value === targetValue)?.label || "";
};

const shopSelectAll = () => {
  formData.account = "";
};
const shopSelectItem = (val) => {
  formData.account = val;
};

// 状态全选和单选
const statusSelectAll = () => {
  formData.status = "";
  getList();
};
const statusSelectItem = (val) => {
  formData.status = val;
  getList();
};

// 店铺数据
const getAccount = () => {
  accountCache().then((res) => {
    if (res.data) {
      shopAccount.value =
        res?.data?.map((item) => {
          return {
            label: item.simpleName,
            value: item.account,
          };
        }) ?? [];
      // formData.account = res?.data[0].account ?? "";
      getList();
    }
  });
};
const onSubmit = () => {
  getList();
};

watch(() => formData.account, (newVal, oldVal) => {
    console.log({ newVal, oldVal });
  if (newVal === '') {
    shopSelectComm.value?.selectAll(false);
  }
});

// 分页变化
function pageNumChange(val) {
  paginations.pageNum = val;
  console.log({ val });
  getList();
}
function pageSizeChange(val) {
  paginations.pageSize = val;
  console.log({ val });
  getList();
}

const resetForm = () => {
  ruleForm.value.resetFields();
  formData.account = shopAccount.value[0].value;
  getList();
};

const syncOrder = () => {
  syncLoading.value = true;
  warehouse()
    .then((res) => {
      message.success(res.msg);
      getList();
    })
    .finally(() => {
      syncLoading.value = false;
    });
};

const syncStore = () => {
  exportLoading.value = true;
  syncDelivery()
    .then((res) => {
      message.success(res.msg);
      getList();
    })
    .finally(() => {
      exportLoading.value = false;
    });
};

const getList = () => {
  loading.value = true;
  let params = {
    ...formData,
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
  };
  warehouseList(params)
    .then((res) => {
      tableData.value = res?.rows || [];
      paginations.total = res?.total || 0;
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  getAccount();
});
</script>
<style lang="less" scoped></style>
