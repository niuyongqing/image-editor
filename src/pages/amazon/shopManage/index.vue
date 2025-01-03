<template>
  <div id="shopManageCont">
    <a-card class="cards">
      <a-form :model="formState" layout="inline" ref="formRef">
        <a-form-item label="店铺名称：" name="shopName">
          <a-input
            v-model:value="formState.shopName"
            placeholder="请输入店铺名称"
          />
        </a-form-item>
        <a-form-item label="简称：" name="simpleName">
          <a-input
            v-model:value="formState.simpleName"
            placeholder="请输入简称"
          />
        </a-form-item>
        <a-form-item style="display: flex">
          <a-button type="primary" @click="onSubmit">查询</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px;height:100vh">
      <a-row style="margin-bottom: 20px">
        <a-col :span="1.5" style="padding: 0 5px">
          <a-button
            type="primary"
            @click="showAddModal = true"
            v-has-permi="['system:platform:amazon:account:add']"
          >
            新增
          </a-button>
        </a-col>
        <a-col :span="1.5" style="padding: 0 5px">
          <a-button
            @click="showEditModal = true"
            v-has-permi="['system:platform:amazon:account:edit']"
            :disabled="selectedRowKeys.length != 1"
            >修改
          </a-button>
        </a-col>
        <a-col :span="1.5" style="padding: 0 5px">
          <a-popconfirm
            class="popconfirm-del"
            ok-text="是"
            cancel-text="否"
            title="确定删除选中账号吗？"
            @confirm="del"
            :disabled="selectedRowKeys.length != 1"
          >
            <!-- v-has-permi="['system:platform:amazon:account:del']" -->
            <a-button
              type="primary"
              danger
              :disabled="selectedRowKeys.length != 1"
              >删除</a-button
            >
            <!-- style="background-color: red; color: #fff" -->
          </a-popconfirm>
        </a-col>
      </a-row>
      <a-table
        bordered
        :rowKey="(record) => record"
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="false"
        :default-expand-all-rows="true"
        :row-selection="{
          selectedRowKeys,
          onChange,
        }"
      >
      </a-table>
      <a-pagination
        style="margin-top: 20px"
        :show-total="total => `共 ${total} 条`"
        v-model:current="paginations.pageNum"
        v-model:pageSize="paginations.pageSize"
        :total="total"
        class="pages"
        :defaultPageSize="50"
        :showSizeChanger="true"
        :pageSizeOptions="[50,100,200]"
        @change="changePagination"
      />
      <!-- :scroll="{ y: tableHeight, x: '100%', virtual: true }" -->
    </a-card>
    <shopManageAdd
      v-model:showAddModal="showAddModal"
      :getList="getList"
    ></shopManageAdd>
    <shopManageEdit
      v-model:showEditModal="showEditModal"
      :getList="getList"
      :selectedRowKeys="selectedRowKeys"
    ></shopManageEdit>
  </div>
</template>

<script setup name="shopManage">
import { ref, reactive, onMounted, onUnmounted, watchPostEffect } from "vue";
import { shopList, delShop } from "@/pages/amazon/js/api/shopManage.js";
import tableHead from "@/pages/amazon/js/tableHead/shopManage";
import shopManageAdd from "@/pages/amazon/shopManage/common/shopManageAdd.vue";
import shopManageEdit from "@/pages/amazon/shopManage/common/shopManageEdit.vue";
import { message } from "ant-design-vue";
const formRef = ref();
const formState = reactive({
  shopName: "",
  simpleName: "",
});
const columns = tableHead;
const total = ref(0);
const tableHeight = ref(0);
const loading = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const deptTableContainer = ref(null);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
});
const selectedRowKeys = ref([]);
const tableData = ref([]);
const onChange = (selecteds) => {
  console.log("selectedRows: ", selecteds);
  selectedRowKeys.value = selecteds;
};

const onSubmit = () => {
  getList();
};
const changePagination = (pageNumber) => {
  getList();
};
// 获取列表
const getList = () => {
  let params = {
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
    shopName: formState.shopName,
    simpleName: formState.simpleName,
  };
  loading.value = true;
  shopList(params)
    .then((res) => {
      tableData.value = res.data.rows;
      total.value = res.data.total ? res.data.total : 0;
    })
    .finally(() => {
      loading.value = false;
      selectedRowKeys.value = [];
    });
};
// 删除
const del = () => {
  let id = selectedRowKeys.value[0].id;
  delShop(id)
    .then((res) => {
      if (res.code == 200) {
        message.success(res.msg);
        selectedRowKeys.value = [];
      }
    })
    .finally(() => {
      getList();
    });
};
const resetForm = () => {
  formRef.value.resetFields();
  onSubmit();
};
const setTableHeight = () => {
  if (deptTableContainer.value) {
    tableHeight.value =
      window.innerHeight -
      deptTableContainer.value.getBoundingClientRect().top -
      70; // 偏移量可根据需求调整
  }
};
onMounted(() => {
  setTableHeight();
  window.addEventListener("resize", setTableHeight);
  // getUserDep();
  getList();
});
onUnmounted(() => {
  window.removeEventListener("resize", setTableHeight);
});
</script>
<style lang="less" scoped>
:deep(.pages) {
  .ant-pagination-options .ant-select {
    width: 100px;
  }
}
</style>