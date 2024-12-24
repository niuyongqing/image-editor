<template>
  <div>
    <a-modal
      :open="props.showAddModal"
      title="新增"
      @cancel="handleCancel"
      @ok="onSubmit"
      :maskClosable="false"
      :keyboard="false"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
      >
        <a-form-item ref="name" label="店铺：" required name="shopId">
          <a-select
            ref="shopSelect"
            v-model:value="formState.shopId"
            style="width: 400px"
            placeholder="请选择店铺"
            :options="shopOptions"
            :fieldNames="shopLabels"
            allowClear
          ></a-select>
        </a-form-item>
        <a-form-item label="用户：" required name="userId">
          <a-select
            ref="shopSelect"
            v-model:value="formState.userId"
            show-search
            placeholder="请输入用户"
            style="width: 400px"
            mode="multiple"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            :fieldNames="userLabels"
            :options="userOptions"
            @search="handleSearchUser"
            @change="handleChangeUser"
          ></a-select>
        </a-form-item>
        <a-form-item label="部门：" required name="depId">
          <a-cascader
            v-model:value="formState.depId"
            style="width: 400px"
            placeholder="请选择部门"
            :options="depOptions"
            :fieldNames="depLabels"
          ></a-cascader>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup name="addAccountConfig">
import { ref, reactive, onMounted } from "vue";
import { shopList } from "@/pages/amazon/js/api/shopManage";
import {
  getAccountUser,
  addAccount,
} from "@/pages/amazon/js/api/configAccount.js";
import { message } from 'ant-design-vue';

const props = defineProps({
  showAddModal: Boolean,
  depOptions: Array,
  getList: Function,
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["update:showAddModal"]);
const formRef = ref();
const formState = reactive({
  shopId: "",
  userId: [], //用户id
  depId: [], //部门id
});
const shopLabels = ref({
  label: "shopName",
  value: "id",
});
const depLabels = ref({
  value: "deptId",
  label: "deptName",
  children: "children",
  checkStrictly: true,
});
const userLabels = ref({
  label: "userName",
  value: "userId",
});
const rules = {
  shopId: [
    {
      required: true,
      message: "请选择店铺",
      trigger: "change",
    },
  ],
  userId: [
    {
      required: true,
      message: "请选择至少一个用户",
      trigger: "change",
    },
  ],
  depId: [
    {
      required: true,
      message: "请选择部门",
      trigger: "change",
    },
  ],
};
const okType = ref(false);
const shopOptions = ref([]);
const userOptions = ref([]);

// 用户数据远程搜索
const handleSearchUser = (val) => {
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
const handleChangeUser = (val) => {
  formState.userId = val;
};

const getShopList = () => {
  let params = {
    pageNum: 1,
    pageSize: 999,
    shopName: "",
    simpleName: "",
  };
  shopList(params).then((res) => {
    shopOptions.value = res.data.rows;
  });
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      okType.value = true;
      let params = {
        shopId: formState.shopId,
        userIds: formState.userId,
        depId: formState.depId[formState.depId.length - 1],
      };
      console.log("params", params);
      addAccount(params)
        .then((res) => {
          if (res.code == 200) {
            message.success(res.msg);
            // this.$emit("update:dialogVisible", false);
          }
        })
        .finally(() => {
          handleCancel();
          props.getList();
          okType.value = false;
        });
    })
    .catch((error) => {
      console.log("error", error);
    });
};
const handleCancel = () => {
  emit("update:showAddModal", false);
  formRef.value.resetFields();
};
onMounted(() => {
  getShopList();
});
</script>
<style lang="less" scoped>
</style>