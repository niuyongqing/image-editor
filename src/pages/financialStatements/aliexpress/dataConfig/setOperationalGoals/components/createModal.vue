<template>
<div id="dictionaryManagement_editModal" class="dictionaryManagement_editModal">
  <appModal 
    v-model:open-value="openValue" 
    width="700px"
    :title="title"
  >
    <template #appContent>
      <!-- :label-col="{ span: 6 }" -->
      <a-form 
        v-model:model="formData" 
        ref="formRef"
        :rules="rules"
        :labelAlign="'left'"
      >
      <div class="flex flex-wrap justify-between">
        <div class="w-48%">
          <a-form-item 
            label="年份：" 
            name="dataYear" 
          >
            <a-date-picker 
              v-model:value="formData.dataYear" 
              picker="year" 
              value-format="YYYY"
              class="w-full"
            />
          </a-form-item>
          <a-form-item label="部门：" name="department">
          <a-select
            v-model:value="formData.department"
            :options="options.departmentList"
            placeholder="请选择部门"
            allowClear
          ></a-select>
        </a-form-item>
        <a-form-item label="运营：" name="userName">
          <a-select
            v-model:value="formData.userName"
            placeholder="请输入关键字"
            :options="options.shopUserNameList"
          ></a-select>
        </a-form-item>
        </div>
        <div class="w-48%">
          <a-form-item 
            label="月份：" 
            name="dataMonth"
          >
            <a-select
              v-model:value="formData.dataMonth"
              :options="options.monthList"
              placeholder="请输入月份"
              allowClear
            ></a-select>
          </a-form-item>
          <a-form-item label="小组：" name="group">
            <a-select
              v-model:value="formData.group"
              :options="options.groupList"
              placeholder="请选择组"
              allowClear
            ></a-select>
          </a-form-item>
        </div>
      </div>
      <a-form-item label="GMV基础目标（万元）：" name="gmvBaseTarget">
        <a-input-number v-model:value="formData.gmvBaseTarget" :min="0" 
        :controls="false" placeholder="请输入GMV基础目标" class="w-50%" />
      </a-form-item>
      <a-form-item label="GMV上浮目标（万元）：" name="gmvIncreaseTarget">
        <a-input-number v-model:value="formData.gmvIncreaseTarget" :min="0" 
        :controls="false" placeholder="请输入GMV上浮目标" class="w-50%" />
      </a-form-item>
      <a-form-item label="GMV挑战目标（万元）：" name="gmvChallengeTarget">
        <a-input-number v-model:value="formData.gmvChallengeTarget" :min="0" 
        :controls="false" placeholder="请输入GMV挑战目标" class="w-50%" />
      </a-form-item>
      </a-form>
    </template>
    <template #appFooter>
      <a-button @click="handleCustomCancel">取消</a-button>
      <a-button type="primary" @click="handleCustomOk" :loading="btnLoading">确定</a-button>
    </template>
  </appModal>
</div>
</template>

<script setup>
import dayjs from 'dayjs';
import appModal from '~@/components/common/appModal.vue'
import { message } from 'ant-design-vue';
import { add,checkUnique } from '../js/api.js'

defineOptions({ name: "setOperationalGoals_createModal" })

const emit = defineEmits(['update:open', 'save'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => ({
      monthList: []
    })
  }
})
const openValue = ref(false);
const btnLoading = ref(false);
const formRef = ref(null);
const formData = reactive({
  dataYear: dayjs(),
  dataMonth: dayjs().format('MM'),
  department: '',
  group : '',
  userName: '',
  gmvBaseTarget: '',
  gmvIncreaseTarget: '',
  gmvChallengeTarget: '',
});
const resetData = {
  dataYear: dayjs(),
  dataMonth: dayjs().format('MM'),
  department: '',
  group: '',
  userName: '',
  gmvBaseTarget: '',
  gmvIncreaseTarget: '',
  gmvChallengeTarget: '',
}
const rules = reactive({
  dataYear: [{ required: true, message: '请选择年份!' }],
  dataMonth: [{ required: true, message: '请选择月份!' }],
  department: [{ required: true, message: '请选择部门!' }],
  groups: [{ required: true, message: '请选择小组!' }],
  userName: [{ required: true, message: '请选择运营!' }],
  gmvBaseTarget: [{ required: true, message: '请输入GMV基础目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: 'GMV基础目标必须大于0!',
      trigger: 'blur'
    }],
  gmvIncreaseTarget: [{ required: true, message: '请输入GMV上浮目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: 'GMV上浮目标必须大于0!',
      trigger: 'blur'
    }],
  gmvChallengeTarget: [{ required: true, message: '请输入GMV挑战目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: 'GMV挑战目标必须大于0!',
      trigger: 'blur'
    }],
})
const title = '新增';
watch(() => props.open, (val, oldVal) => {
  openValue.value = val;
});
watch(() => openValue.value, (val, oldVal) => {
  emit('update:open', val);
  !val && (Object.assign(formData, resetData))
});
function handleCustomCancel() {
  formRef.value.resetFields()
  openValue.value = false
}
async function handleCustomOk() {
  try {
    await formRef.value.validate();
    console.log('表单验证通过，数据:', formData);
    btnLoading.value = true;
    let params = {
      ...formData,
      dataYear: dayjs(formData.dataYear).format('YYYY'),
      dataMonth: dayjs(formData.dataMonth).format('MM'),
    }
    console.log(params,'params');
    let queryParams = {
      dataYear: dayjs(formData.dataYear).format('YYYY'),
      dataMonth: dayjs(formData.dataMonth).format('MM'),
      userName: formData.userName,
    }
    console.log(queryParams,'queryParams');
    checkUnique(queryParams).then(res => {
      if (res.data) {
        message.success('该运营目标已存在')
        return
      }else {
        add(params).then(res => {
          btnLoading.value = false;
          if (res.code === 200) {
            message.success('模板导出成功')
            handleCustomCancel();
            emit('save');
          } else {
            message.error('新增失败');
          }
        })
      }
    }).finally(() => {
      btnLoading.value = false;
    })

  } catch (error) {
    console.log('表单验证失败:', error);
  }
}
</script>
<style lang="less" scoped>

</style>