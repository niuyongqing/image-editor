<template>
  <div>
    <a-modal
      :open="props.showEditModal"
      title="新增"
      @cancel="handleCancel"
      @ok="onSubmit"
      :maskClosable="false"
      :keyboard="false"
    >
      <a-form ref="formRef" :model="formState" :rules="rules">
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
            style="width: 400px"
            placeholder="请选择店铺"
            mode="multiple"
            :options="userOptions"
            :fieldNames="userLabels"
            :filter-option="filterOption"
            allowClear
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

<script setup name="editAccountConfig">
import { ref, reactive, onMounted, watch } from "vue";
import { shopList } from "@/pages/amazon/js/api/shopManage";
import {
  getAccountUser,
  editAccount,
} from "@/pages/amazon/js/api/configAccount.js";
import { message } from "ant-design-vue";

const props = defineProps({
  showEditModal: Boolean,
  depOptions: Array,
  getList: Function,
  selectedRowKeys: Array,
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["update:showEditModal"]);
watch(
  () => props.selectedRowKeys,
  (newSelectedRowKeys) => {
    if (newSelectedRowKeys && newSelectedRowKeys.length > 0) {
      const firstSelectedRow = newSelectedRowKeys[0];
      console.log("firstSelectedRow", firstSelectedRow);
      if (firstSelectedRow.userId.indexOf(",") !== -1) {
        firstSelectedRow.userId.split(",").forEach((value) => {
          formState.userId.push(parseFloat(value));
        });
      } else {
        formState.userId.push(parseFloat(firstSelectedRow.userId));
      }
      formState.shopId = firstSelectedRow.shopId;
      formState.depId = firstSelectedRow.depId;
    }
  }
);

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

// 用户数据
const getUserList = (val) => {
  getAccountUser({ userName: "" }).then((res) => {
    userOptions.value = res.data;
  });
};

const filterOption = (input, option) => {
  return option.userName.indexOf(input) >= 0;
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
        id: props.selectedRowKeys[0].id,
        shopId: formState.shopId,
        userIds: formState.userId,
        depId:
          formState.depId.length > 0
            ? formState.depId[formState.depId.length - 1]
            : formState.depId,
      };
      editAccount(params)
        .then((res) => {
          if (res.code == 200) {
            message.success(res.msg);
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
  emit("update:showEditModal", false);
  formRef.value.resetFields();
};
onMounted(() => {
  getShopList();
  getUserList();
});
</script>
<style lang="less" scoped>
</style>