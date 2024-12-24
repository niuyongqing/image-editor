<template>
  <div id="configAccountCont">
    <a-card style="margin-top: 20px">
      <a-form :model="formState" layout="inline" ref="formRef">
        <a-form-item label="用户：" name="userId">
          <a-select
            v-model:value="formState.userId"
            show-search
            placeholder="请输入用户"
            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :fieldNames="userLabels"
            :options="userOptions"
            @search="handleSearch"
            @change="handleChange"
          ></a-select>
        </a-form-item>
        <a-form-item label="部门：" name="depId">
          <a-cascader
            v-model:value="formState.depId"
            style="width: 200px"
            placeholder="请选择部门"
            :options="depOptions"
            :fieldNames="depLabels"
          ></a-cascader>
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
        style="margin-top: 10px;text-align: right"
        :show-total="total => `共 ${total} 条`"
        v-model:current="paginations.pageNum"
        v-model:pageSize="paginations.pageSize"
        :total="paginations.total"
        class="pages"
        :show-quick-jumper="true"
        :showSizeChanger="true"
        :pageSizeOptions="[50,100,200]"
        @change="getList"
      />
    </a-card>
    <addAccountConfig
      v-model:showAddModal.sync="showAddModal"
      :depOptions="depOptions"
      :getList="getList"
    ></addAccountConfig>
    <editAccountConfig
      v-model:showEditModal.sync="showEditModal"
      :depOptions="depOptions"
      :getList="getList"
      :selectedRowKeys="selectedRowKeys"
    ></editAccountConfig>
  </div>
</template>

<script setup name="configAccount">
import { ref, reactive, onMounted, onUnmounted, watchPostEffect } from "vue";
import {
  accountList,
  getAccountUser,
  userDep,
  delAccount,
} from "@/pages/amazon/js/api/configAccount.js";
import tableHeader from "@/pages/amazon/js/tableHead/configAccount";
import addAccountConfig from "@/pages/amazon/configAccount/common/addAccountConfig.vue";
import editAccountConfig from "@/pages/amazon/configAccount/common/editAccountConfig.vue";
import { message } from "ant-design-vue";

//表单
const formRef = ref();
const formState = reactive({
  userId: "",
  depId: "",
});
// 部门格式
const depLabels = ref({
  value: "deptId",
  label: "deptName",
  children: "children",
  checkStrictly: true,
});
// 用户格式
const userLabels = ref({
  label: "userName",
  value: "userId",
});

const columns = tableHeader; //表头
const tableData = ref([]); //表格数据
const userOptions = ref([]); //用户数据
const depOptions = ref([]); //部门数据
const loading = ref(false);
const showAddModal = ref(false);
const showEditModal = ref(false);
const total = ref(0);
const paginations = reactive({
  pageNum: 1,
  pageSize: 50,
  total:0
});
const selectedRowKeys = ref([]);
const onChange = (selecteds) => {
  selectedRowKeys.value = selecteds;
};
const changePagination = (pageNumber) => {
  getList();
};
// 用户数据远程搜索
const handleSearch = (val) => {
  if (val !== "") {
    let params = {
      userName: val,
    };
    getAccountUser(params).then((res) => {
      userOptions.value = res.data;
    });
  } else {
    userOptions.value = [];
  }
};
// 用户数据选择后赋值
const handleChange = (val) => {
  formState.userId = val;
};
const onSubmit = () => {
  // emit("requestParams", formState);
  getList();
};
const resetForm = () => {
  formRef.value.resetFields();
  onSubmit();
};
// 获取部门数据接口
const getUserDep = () => {
  userDep().then((res) => {
    fn(res.data);
    depOptions.value = res.data;
  });
  // 处理子级节点
  function fn(children) {
    children.forEach((item) => {
      if (item.children && item.children.length < 1) {
        delete item.children;
      } else {
        fn(item.children);
      }
    });
  }
};
//获取列表
const getList = () => {
  let params = {
    pageNum: paginations.pageNum,
    pageSize: paginations.pageSize,
    userId: formState.userId,
    depId: formState.depId[formState.depId.length - 1] || "",
  };
  loading.value = true;
  accountList(params)
    .then((res) => {
      tableData.value = res?.data?.rows;
      paginations.total = res.data.total ? res.data.total : 0;
    })
    .finally(() => {
      loading.value = false;
      selectedRowKeys.value = [];
    });
};
// 删除
const del = () => {
  let id = selectedRowKeys.value[0].id;
  delAccount(id)
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

onMounted(() => {
  
  getUserDep();
  getList();
});
</script>
<style lang="less" scoped>
:deep(.pages) {
  .ant-pagination-options .ant-select {
    width: 100px;
  }
}
</style>