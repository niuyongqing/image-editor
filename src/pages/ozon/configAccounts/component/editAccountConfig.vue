<template>
  <div id="addAccountConfigCont">
    <a-modal
      :open="showEdit"
      title="新增"
      @ok="onSubmit"
      @cancel="cancel"
      :keyboard="false"
      :maskClosable="false"
    >
      <a-form ref="formRef" :model="formState" :rules="rules">
        <a-form-item required label="平台：" name="platform">
          <a-input disabled v-model:value="formState.platform" />
        </a-form-item>
        <a-form-item label="用户：" name="userId" required>
          <a-select
            v-model:value="formState.userId"
            show-search
            mode="multiple"
            placeholder="请选择用户"
            :default-active-first-option="false"
            :show-arrow="false"
            :not-found-content="null"
            :options="getAccountUserArr"
            :filter-option="filterOption"
            :field-names="{
              label: 'userName',
              value: 'userId',
            }"
          ></a-select>
        </a-form-item>
        <a-form-item label="部门：" required name="depId">
          <a-cascader
            v-model:value="formState.depId"
            :options="depOptions"
            placeholder="请选择部门"
            :field-names="{
              label: 'deptName',
              value: 'deptId',
              children: 'children',
            }"
          />
        </a-form-item>
        <a-form-item label="账号：" name="account" required>
          <a-select
            v-model:value="formState.account"
            mode="multiple"
            placeholder="请选择账号"
            :options="accountOptions"
            :field-names="{
              label: 'simpleName',
              value: 'account',
            }"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup name='addAccountConfig'>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { ozonAccount, editAccount } from "@/pages/ozon/config/api/accountConfig";
import { message } from "ant-design-vue";
const props = defineProps({
  showEdit: Boolean,
  depOptions: Array,
  getAccountUserArr: Array,
  selectedRowKeys: Array,
});
const emit = defineEmits(["backEditForm"]);

const formRef = ref();
const formState = reactive({
  account: [],
  depId: [],
  platform: "Ozon",
  userId: [],
});
const accountOptions = ref([]);
const rules = {
  account: [
    {
      required: true,
      message: "请选择账号",
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
  userId: [
    {
      required: true,
      message: "请选择用户",
      trigger: "change",
    },
  ],
};
watch(
  () => props.selectedRowKeys,
  (newList) => {
    if (newList && newList.length > 0) {
      newList.forEach((val) => {
        formState.depId = val.depId;
        formState.userId = (
          val.userId.includes(",")
            ? val.userId.split(",").map((v) => parseFloat(v))
            : [parseFloat(val.userId)]
        ).flat();
        formState.account = (
          val.account.includes(",")
            ? val.account.split(",").map((v) => v)
            : [val.account]
        ).flat();
      });
    }
  }
);

const getAccount = () => {
  ozonAccount().then((res) => {
    accountOptions.value = res.data || [];
  });
};
const filterOption = (input, option) => {
  return option.userName.indexOf(input) >= 0;
};
const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      let data = {
        id: props.selectedRowKeys[0].id,
        platform: formState.platform,
        userId: formState.userId.join(),
        account: formState.account.join(),
        depId: formState.depId,
      };
      editAccount(data)
        .then((res) => {
          if (res.code == 200) {
            message.success(res.msg);
            emit("backEditForm");
          }
        })
        .finally(() => {
          formRef.value.resetFields();
        });
    })
    .catch((error) => {
      message.error("必填项未填写，请填写后提交");
    });
};

const cancel = () => {
  formRef.value.resetFields();
  emit("backEditForm");
};

onMounted(() => {
  getAccount();
});
</script>
<style lang="less" scoped>
</style>