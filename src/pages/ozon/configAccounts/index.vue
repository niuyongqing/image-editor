<template>
  <div id="configAccountCont">
    <appTableForm
      ref="formRef"
      v-model:formData="formState"
      reset-set-menu="configAccountCont"
      @onSubmit="onSubmit"
    >
      <template #formItemBox>
        <a-form-item label="用户：" name="userId" class="text-left">
          <a-select
            v-model:value="formState.userId"
            allow-clear
            show-search
            placeholder="请选择用户"
            style="width: 200px"
            :options="getAccountUserArr"
            :filter-option="filterOption"
            :fieldNames="userLabels"
          ></a-select>
        </a-form-item>
        <a-form-item label="部门：" name="depId" class="text-left">
          <a-cascader
            v-model:value="formState.depId"
            :options="depOptions"
            style="width: 200px"
            placeholder="请选择部门"
            :fieldNames="depLabels"
          />
        </a-form-item>
      </template>
    </appTableForm>
      <app-table-box
        :data-source="tableData"
        :table-header="columns"
        reset-set-menu="configAccountCont"
        :rowKey="(row) => row"
        :row-selection="rowSelection"
        :scroll="{ x: 1 }"
      >
        <template #leftTool>
          <a-button
            type="primary"
            v-has-permi="['platform:ozon:account:relevance:add']"
            @click="showAdd = true"
            >新增</a-button
          >
          <a-button
            @click="showEdit = true"
            v-has-permi="['platform:ozon:account:relevance:update']"
            :disabled="selectedRowKeys.length !== 1"
            >修改</a-button
          >
          <a-popconfirm
            placement="top"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirm"
            :disabled="selectedRowKeys.length !== 1"
          >
            <template #title>
              <p>是否确定删除？</p>
            </template>
            <a-button
              type="primary"
              danger
              v-has-permi="['platform:ozon:account:relevance:del']"
              :disabled="selectedRowKeys.length !== 1"
              >删除</a-button
            >
          </a-popconfirm>
        </template>
        <template #bodyCell="{ column, record, index }">
          <!-- 索引列 -->
        <template v-if="column.key === 'index'">
          {{ index + 1 + (pages.pageNum - 1) * pages.pageSize }}
        </template>
          <template v-if="column.key === 'userId'">
            <span>
              {{ hideUser(record.userId) }}
            </span>
          </template>
          <template v-if="column.key === 'account'">
            <span
              v-for="(item, index) in getsimpleName(record.account)"
              :key="index"
            >
              <a-tag color="blue" class="mt-1.5">{{ item }}</a-tag>
            </span>
          </template>
          <template v-if="column.key === 'depId'">
            <a-cascader
              style="width: 100%"
              v-model:value="record.depId"
              :options="depOptions"
              :field-names="depLabels"
              :disabled="true"
            >
            </a-cascader>
          </template>
        </template>
        <template #pagination>
          <appTablePagination
            :total="pages.total"
            v-model:current="pages.pageNum"
            v-model:pageSize="pages.pageSize"
            class="pages"
            :defaultPageSize="50"
            :showSizeChanger="true"
            @pageNumChange="pageNumChange" 
          @pageSizeChange="pageSizeChange"
          />
        </template>
      </app-table-box>
    <addAccountConfig
      :showAdd="showAdd"
      :depOptions="depOptions"
      :getAccountUserArr="getAccountUserArr"
      @backAddForm="backAddForm"
    ></addAccountConfig>
    <editAccountConfig
      :showEdit="showEdit"
      :depOptions="depOptions"
      :getAccountUserArr="getAccountUserArr"
      @backEditForm="backEditForm"
      :selectedRowKeys="selectedRowKeys"
    ></editAccountConfig>
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
import appTableBox from "~/components/common/appTableBox.vue";
import appTablePagination from "~@/components/common/appTablePagination.vue";
import appTableForm from "~@/components/common/appTableForm.vue";

const formRef = ref(null);
const formState = reactive({
  userId: null, //用户多选ID
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
  total: 0,
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
};

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
// 处理字段回显根据店铺中的数字值排序
const getsimpleName = (v) => {
  // 分割account字符串为ID数组
  const accountIds = v.split(",");

  // 创建account到simpleName的映射表
  const accountMap = new Map(
    accountOptions.value.map((option) => [option.account, option.simpleName])
  );

  // 匹配并过滤有效结果
  const matchedNames = accountIds
    .map((id) => accountMap.get(id))
    .filter(Boolean); // 排除未匹配项

  // 按simpleName中的数字排序 (例如Ozon04中的04)
  const numberRegex = /Ozon(\d+)-/;
  return matchedNames.sort((a, b) => {
    const numA = parseInt(a.match(numberRegex)[1], 10);
    const numB = parseInt(b.match(numberRegex)[1], 10);
    return numA - numB;
  });
};
const getAccountUserList = () => {
  getAccountUser({ userName: "" }).then((res) => {
    getAccountUserArr.value = res.data;
  });
};

// 分页变化
function pageNumChange(val) {
  pages.pageNum = val;
  console.log({ val });
  getList();

};
function pageSizeChange(val) {
  pages.pageSize = val;
  console.log({ val });
  getList();

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
