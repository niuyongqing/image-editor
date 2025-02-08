<template>
  <div id="configAccountCont">
    <a-card style="margin-top: 20px">
      <a-form :model="formState" layout="inline" ref="formRef">
        <a-form-item label="用户：" name="userId">
          <a-select v-model:value="formState.userId" show-search placeholder="请选择用户" style="width: 200px"
            :options="getAccountUserArr" :filter-option="filterOption" :fieldNames="userLabels"></a-select>
        </a-form-item>
        <a-form-item label="部门：" name="depId">
          <a-cascader v-model:value="formState.depId" :options="depOptions" style="width: 200px"
            placeholder="Please select" :fieldNames="depLabels" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onSubmit">查询</a-button>
          <a-button style="margin-left: 10px" @click="restForm">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card style="margin-top: 20px">
      <div>
        <a-row>
          <a-col :span="1.5" style="margin: 0 5px"><a-button type="primary"
              v-has-permi="['platform:ozon:account:relevance:add']" @click="showAdd = true">新增</a-button></a-col>
          <a-col :span="1.5" style="margin: 0 5px"><a-button @click="showEdit = true"
              v-has-permi="['platform:ozon:account:relevance:update']"
              :disabled="selectedRowKeys.length !== 1">修改</a-button></a-col>
          <a-col :span="1.5" style="margin: 0 5px">
            <a-popconfirm placement="top" ok-text="Yes" cancel-text="No" @confirm="confirm"
              :disabled="selectedRowKeys.length !== 1">
              <template #title>
                <p>是否确定删除？</p>
              </template>
              <a-button type="primary" danger v-has-permi="['platform:ozon:account:relevance:del']"
                :disabled="selectedRowKeys.length !== 1">删除</a-button>
            </a-popconfirm>
          </a-col>
        </a-row>
      </div>
      <div style="margin-top: 20px">
        <a-table :row-selection="rowSelection" :columns="columns" :data-source="tableData" :rowKey="(row) => row"
          bordered :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'userId'">
              <span>
                {{ hideUser(record.userId) }}
              </span>
            </template>
            <template v-if="column.key === 'account'">
              <span v-for="(item, index) in record.account.split(',')" :key="index">
                <a-tag color="blue" class="mt-1.5">{{
                  getsimpleName(item)
                }}</a-tag>
              </span>
            </template>
            <template v-if="column.key === 'depId'">
              <a-cascader style="width: 100%" v-model:value="record.depId" :options="depOptions"
                :field-names="depLabels" :disabled="true">
              </a-cascader>
            </template>
          </template>
        </a-table>
        <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
          v-model:current="pages.pageNum" v-model:pageSize="pages.pageSize" :total="pages.total" class="pages"
          :defaultPageSize="50" :showSizeChanger="true" :pageSizeOptions="[50, 100, 200]" @change="getList" />
      </div>
    </a-card>
    <addAccountConfig :showAdd="showAdd" :depOptions="depOptions" :getAccountUserArr="getAccountUserArr"
      @backAddForm="backAddForm"></addAccountConfig>
    <editAccountConfig :showEdit="showEdit" :depOptions="depOptions" :getAccountUserArr="getAccountUserArr"
      @backEditForm="backEditForm" :selectedRowKeys="selectedRowKeys"></editAccountConfig>
  </div>
</template>

<script setup name="configAccounts">
import {
  delAccount,
  getAccountUser,
  setAccountlist,
  ozonAccount,
  userDep,
} from "@/pages/ozon/config/api/accountConfig";
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import tableHeader from "~@/pages/ozon/config/tabColumns/accountConfig";
import addAccountConfig from "@/pages/ozon/configAccounts/component/addAccountConfig.vue";
import editAccountConfig from "@/pages/ozon/configAccounts/component/editAccountConfig.vue";
import { message } from "ant-design-vue";

const formRef = ref(null)
const formState = reactive({
  userId: "", //用户多选ID
  depId: [], //部门多选ID
});
const accountOptions = ref([]);
const depOptions = ref([]);
const loading = ref(false);
const showAdd = ref(false);
const showEdit = ref(false);
const tableData = ref([]);
const selectedRowKeys = ref([]);
const getAccountUserArr = ref([]);
const pages = reactive({
  pageNum: 1,
  pageSize: 50,
  total: 0
});
const columns = tableHeader;
const userLabels = ref({
  label: "userName",
  value: "userId",
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

const filterOption = (input, option) => {
  return option.userName.indexOf(input) >= 0;
};

const backAddForm = () => {
  getList();
  showAdd.value = false;
};
const backEditForm = () => {
  getList();
  showEdit.value = false;
};
const onSubmit = () => {
  getList();
};

const getList = () => {
  let params = {
    pageNum: pages.pageNum,
    pageSize: pages.pageSize,
    userId: formState.userId,
    // depId: formState.depId[formState.depId.length - 1],
    depId: formState.depId,
  };
  loading.value = true;
  setAccountlist(params)
    .then((res) => {
      tableData.value =
        res?.rows?.map((e) => {
          e.depId = e.depId.split(",").map((item) => Number(item));
          return e;
        }) || [];
      pages.total = res?.total || 0;
    })
    .finally(() => {
      loading.value = false;
    });
};

const restForm = () => {
  formRef.value.resetFields();
  getList();
}

// 获取账号
const getAccountList = () => {
  ozonAccount().then((res) => {
    accountOptions.value = res.data || [];
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
  accountOptions.value.forEach((value) => {
    if (v == value.account) {
      msg = value.simpleName;
    }
  });
  return msg;
};
const getAccountUserList = () => {
  getAccountUser({ userName: "" }).then((res) => {
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
// 删除
const confirm = () => {
  let ids = selectedRowKeys.value.map((value) => value.id);
  delAccount({ ids })
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
  getAccountList();
  getUserDep();
  getList();
  getAccountUserList();
});
</script>
<style lang="less" scoped>
:deep(.pages) {
  .ant-pagination-options .ant-select {
    width: 100px;
  }
}
</style>