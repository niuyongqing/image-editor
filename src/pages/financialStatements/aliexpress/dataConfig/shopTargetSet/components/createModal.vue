<template>
<div id="dictionaryManagement_editModal" class="dictionaryManagement_editModal">
  <appModal 
    v-model:open-value="openValue" 
    width="700px"
    :title="pageType === 'add' ? '新增' : '编辑'"
  >
    <template #appContent>
      <!-- :label-col="{ span: 6 }" -->
      <a-form 
        v-model:model="formData" 
        ref="formRef"
        :rules="rules"
        :labelAlign="'left'"
        :label-col="{ span: 6 }"
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
              :disabled="pageType === 'edit'"
            />
          </a-form-item>
          <a-form-item label="店铺：" name="shopName">
          <a-select
            v-model:value="formData.shopName"
            :options="options.shopList"
            placeholder="请选择店铺"
            allowClear
          ></a-select>
        </a-form-item>
        <a-form-item label="运营：" name="userName">
          <a-select
            v-model:value="formData.userName"
            placeholder="请输入关键字"
            :options="options.shopUserNameList"
            :disabled="pageType === 'edit'"
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
              :disabled="pageType === 'edit'"
            ></a-select>
          </a-form-item>
          <a-form-item label="品类：" name="categoryName">
            <a-select
              v-model:value="formData.categoryName"
              :options="options.categoryList"
              placeholder="请选择品类"
              allowClear
            ></a-select>
          </a-form-item>
        </div>
      </div>
      <a-form-item label="POP利润率目标：" name="popProfitRate">
        <a-input-number v-model:value="formData.popProfitRate" :min="0" 
        :controls="false" placeholder="请输入POP利润率目标" class="w-50%" addon-after="%" />
      </a-form-item>
      <a-form-item label="半托管JIT利润率目标：" name="semiManagedJITProfitRate">
        <a-input-number v-model:value="formData.semiManagedJITProfitRate" :min="0" 
        :controls="false" placeholder="请输入半托管JIT利润率目标" class="w-50%" addon-after="%" />
      </a-form-item>
      <a-form-item label="半托管仓发利润率目标：" name="semiManagedWarehouseProfitRate">
        <a-input-number v-model:value="formData.semiManagedWarehouseProfitRate" :min="0" 
        :controls="false" placeholder="请输入半托管仓发利润率目标" class="w-50%" addon-after="%" />
      </a-form-item>
      <a-form-item label="全托管JIT利润率目标：" name="fullyManagedJITProfitRate">
        <a-input-number v-model:value="formData.fullyManagedJITProfitRate" :min="0" 
        :controls="false" placeholder="请输入全托管JIT利润率目标" class="w-50%" addon-after="%" />
      </a-form-item>
      <a-form-item label="全托管仓发利润率目标：" name="fullyManagedWarehouseProfitRate">
        <a-input-number v-model:value="formData.fullyManagedWarehouseProfitRate" :min="0" 
        :controls="false" placeholder="请输入全托管仓发利润率目标" class="w-50%" addon-after="%" />
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
import { message } from 'ant-design-vue';
import { add,checkUnique,updateItem } from '../js/api.js'

defineOptions({ name: "setOperationalGoals_createModal" })

const appModal = defineAsyncComponent(() => import('@/components/common/appModal.vue'));

const emit = defineEmits(['update:open',])
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
  },
  pageType: {
    type: String,
    default: 'add',
  },
  detailData: {
    type: Object,
    default: () => ({})
  }
})
const openValue = ref(false);
const btnLoading = ref(false);
const formRef = ref(null);
const formData = reactive({
  id: '',
  dataYear: dayjs(),
  dataMonth: dayjs().format('MM'),
  shopName: '',
  categoryName: '',
  userName: '',
  popProfitRate: '',
  semiManagedJITProfitRate: '',
  semiManagedWarehouseProfitRate: '',
  fullyManagedJITProfitRate: '',
  fullyManagedWarehouseProfitRate: '',
});
const resetData = {
  dataYear: dayjs(),
  dataMonth: dayjs().format('MM'),
  shopName: '',
  categoryName: '',
  userName: '',
  popProfitRate: '',
  semiManagedJITProfitRate: '',
  semiManagedWarehouseProfitRate: '',
  fullyManagedJITProfitRate: '',
  fullyManagedWarehouseProfitRate: '',
}
const rules = reactive({
  dataYear: [{ required: true, message: '请选择年份!' }],
  dataMonth: [{ required: true, message: '请选择月份!' }],
  categoryName: [{ required: true, message: '请选择部门!' }],
  shopName: [{ required: true, message: '请选择店铺!' }],
  userName: [{ required: true, message: '请选择运营!' }],
  popProfitRate: [{ required: true, message: '请输入POP利润率目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: 'POP利润率目标必须大于0!',
      trigger: 'blur'
    }],
  semiManagedJITProfitRate: [{ required: true, message: '请输入半托管JIT利润率目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: '半托管JIT利润率目标必须大于0!',
      trigger: 'blur'
    }],
  semiManagedWarehouseProfitRate: [{ required: true, message: '请输入半托管仓发利润率目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: '半托管仓发利润率目标必须大于0!',
      trigger: 'blur'
    }],
  fullyManagedJITProfitRate: [{ required: true, message: '请输入全托管JIT利润率目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: '全托管JIT利润率目标必须大于0!',
      trigger: 'blur'
    }],
  fullyManagedWarehouseProfitRate: [{ required: true, message: '请输入全托管仓发利润率目标!' },{ 
      pattern: /^(?=.*[1-9])\d*(?:\.\d+)?$/, 
      message: '全托管仓发利润率目标必须大于0!',
      trigger: 'blur'
    }],
})

watch(() => props.open, (val, oldVal) => {
  openValue.value = val;
});
watch(() => openValue.value, (val, oldVal) => {
  emit('update:open', val);
  !val && (Object.assign(formData, resetData))
});

watch(() => props.detailData, (val, oldVal) => {
  if (val.id) {
    const {id, dataYear,dataMonth, shopName, userName, categoryName,
      profitRateTargetPop, profitRateTargetSemiJIT, profitRateTargetSemiStore, 
      profitRateTargetFullJIT, profitRateTargetFullStore } = val
    console.log(profitRateTargetFullStore,'profitRateTargetFullStore');
    let newObj = {
      id,
      dataYear,
      dataMonth,
      shopName, 
      userName, 
      categoryName,
      popProfitRate: Math.round(profitRateTargetPop *100),
      semiManagedJITProfitRate: Math.round(profitRateTargetSemiJIT *100),
      semiManagedWarehouseProfitRate: Math.round(profitRateTargetSemiStore *100),
      fullyManagedJITProfitRate: Math.round(profitRateTargetFullJIT *100),
      fullyManagedWarehouseProfitRate: Math.round(profitRateTargetFullStore *100),
    }
    console.log(newObj,'newObj');
    Object.assign(formData, newObj)
  }
})



function handleCustomCancel() {
  formRef.value.resetFields()
  openValue.value = false
}
async function handleCustomOk() {
  try {
    await formRef.value.validate();
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
      shopName: formData.shopName,
    }
    if (props.pageType === 'add') {
      checkUnique(queryParams).then(res => {
        if (res.data) {
          message.warning('该运营目标已存在')
          return
        }else {
          addForm(params) 
        }
      }).finally(() => {
        btnLoading.value = false;
      })
    }else {
      editForm(params)
    }

  } catch (error) {
    message.error('表单验证失败，请检查输入');
  }
}

function addForm(params) {
  add(params).then(res => {
    btnLoading.value = false;
    if (res.code === 200) {
      message.success('新增成功')
      handleCustomCancel();
    } else {
      message.error('新增失败');
    }
  })
}

function editForm(params) {
  updateItem(params).then(res => {
    btnLoading.value = false;
    if (res.code === 200) {
      message.success('编辑成功')
      handleCustomCancel();
    } else {
      message.error('编辑失败');
    }
  })
}
</script>
<style lang="less" scoped>

</style>