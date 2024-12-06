<template>
  <div id="configAccountCont">
    <a-card style="margin-top: 20px">
      <a-form :model="formState" layout="inline">
        <a-form-item label="用户：" name="userId">
          <a-select
            v-model:value="formState.userId"
            show-search
            placeholder="请选择用户"
            style="width: 200px"
            :options="userOptions"
            :filter-option="filterOption"
            :fieldNames="userLabels"
          ></a-select>
        </a-form-item>
        <a-form-item label="部门：" name="depId">
          <a-cascader
            v-model:value="formState.depId"
            :options="depOptions"
            style="width: 200px"
            placeholder="Please select"
            :fieldNames="depLabels"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSubmit">查询</a-button>
          <a-button style="margin-left: 10px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px">
      <div>
        <a-row>
          <a-col :span="1.5" style="margin: 0 5px"
            ><a-button type="primary">新增</a-button></a-col
          >
          <a-col :span="1.5" style="margin: 0 5px"
            ><a-button>修改</a-button></a-col
          >
          <a-col :span="1.5" style="margin: 0 5px"
            ><a-button type="primary" danger>删除</a-button></a-col
          >
        </a-row>
      </div>
      <div style="margin-top: 20px">
        <a-table
          :row-selection="rowSelection"
          :columns="columns"
          :data-source="tableData"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'userId'">
              <span>
                {{ hideUser(record.userId) }}
              </span>
            </template>
            <template v-if="column.key === 'account'">
              <span
                v-for="(item, index) in record.account.split(',')"
                :key="index"
              >
                <a-tag color="blue" style="margin-right: 5px">{{
                  getsimpleName(item)
                }}</a-tag>
              </span>
            </template>
            <template v-if="column.key === 'depId'">
              <a-cascader
                style="width: 100%"
                v-model:value="record.depId"
                :options="depOptions"
                :fieldNames="depLabels"
                showCheckedStrategy="show_child"
              >
              </a-cascader>
            </template>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script setup name="configAccounts">
import {
  delAccount,
  getAccountUser,
  setAccountlist,
  ozonAccount,
  userDep,
} from "@/pages/ozon/api/accountConfig";
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import tableHeader from "@/pages/ozon/tabColumns/accountConfig";
const formState = reactive({
  userId: "", //用户多选ID
  depId: [], //部门多选ID
});
const userOptions = ref([]);
const depOptions = ref([]);
const loading = ref(false);
const tableData = ref([]);
const selectedRowKeys = ref([]);
const getAccountUserArr = ref([]);
const total = ref(0);
const columns = tableHeader;
const userLabels = ref({
  label: "simpleName",
  value: "account",
});
const depLabels = ref({
  label: "deptName",
  value: "deptId",
  children: "children",
});

const rowSelection = {
  onChange: (selectedRow) => {
    selectedRowKeys.value = selectedRow;
  },
};
const showCheckedStrategy = ref('SHOW_CHILD');
const filterOption = (input, option) => {
  return option.simpleName.indexOf(input) >= 0;
};
const onSubmit = () => {
  getList();
};

const getList = () => {
  let params = {
    pageNum: 1,
    pageSize: 9999,
    userId: formState.userId,
    depId: formState.depId[formState.depId.length - 1],
  };
  loading.value = true;
  setAccountlist(params)
    .then((res) => {
      tableData.value = res?.rows || [];
      total.value = res?.total || 0;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 获取账号
const getAccountList = () => {
  ozonAccount().then((res) => {
    userOptions.value = res.data || [];
  });
};
//部门列表
const getUserDep = () => {
  userDep().then((res) => {
    depOptions.value = res.data;
  });
};
// 处理字段回显
const getsimpleName = (v) => {
  let msg = "";
  userOptions.value.forEach((value) => {
    if (v == value.account) {
      msg = value.simpleName;
    }
  });
  return msg;
};
const getAccountUserList = () => {
  let data = {
    userName: "",
  };
  getAccountUser(data).then((res) => {
    getAccountUserArr.value = res.data;
  });
};

const hideUser = (id) => {
  let msg = [];

  if (id.indexOf(",") !== -1) {
    id.split(",").forEach((value) => {
      getAccountUserArr.value.forEach((s) => {
        if (value == s.userId) {
          msg.push(s.userName);
        }
      });
    });
  } else {
    getAccountUserArr.value.forEach((s) => {
      if (id == s.userId) {
        msg.push(s.userName);
      }
    });
  }
  return msg.join();
};
onMounted(() => {
  getAccountList();
  getUserDep();
  getList();
  getAccountUserList();
});
</script>
<style lang="less" scoped>
</style>