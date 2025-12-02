<!-- components/ImportModal.vue -->
<template>
  <appModal v-model:openValue="internalVisible" width="30%" title="导入新增">
    <template #appContent>
      <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="{span: 3}"
      >
        <a-form-item label="费用项" name="costItem">
          <a-input v-model:value="formState.costItem" placeholder="请输入费用项"/>
        </a-form-item>
        <a-form-item label="费用类型" name="costType">
          <a-input v-model:value="formState.costType" placeholder="请输入费用类型"/>
        </a-form-item>
        <a-form-item label="业务模式" name="businessModel">
          <a-input v-model:value="formState.businessModel" placeholder="请输入业务模式"/>
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formState.remark" show-count :maxlength="500" placeholder="请输入备注"/>
        </a-form-item>
      </a-form>
    </template>
    <template #appFooter>
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk" :loading="loading">确定</a-button>
      </a-space>
    </template>
  </appModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { detailCostItem, editCostItem } from "~/pages/financialStatements/aliexpress/dataConfig/costItemConfig/js/api.js";

// 定义props
const props = defineProps ( {
  visible: {
    type: Boolean,
    default: false
  },
  itemId: {
    type: String,
    default: ''
  }
} )

// 定义emit事件
const emit = defineEmits ( [ 'update:visible','update:listData'] )

// 定义变量
const formRef = ref();
const loading = ref(false);
const internalVisible = ref ( props.visible )
const formState = reactive({
  id: '',
  costItem: '',
  costType: '',
  businessModel: '',
  remark: '',
});
const rules = {
  costItem: [
    {
      required: true,
      message: '请输入费用项',
      trigger: 'blur',
    },
  ],
  costType: [
    {
      required: true,
      message: '请输入费用类型',
      trigger: 'blur',
    },
  ],
};
// 监听外部 visible 的变化
watch ( () => props.visible, ( newVal ) => {
  internalVisible.value = newVal

  if ( props.visible ) {
    formState.id = props.itemId
    getDetail(props.itemId)
  }
} )

watch ( internalVisible, ( newVal ) => {
  emit ( 'update:visible', newVal )
} )

//获取详情
const getDetail = ( id ) => {
  detailCostItem(id).then(response => {
    if ( response.code === 200 ) {
      formState.costItem = response.data.costItem;
      formState.costType = response.data.costType;
      formState.businessModel = response.data.businessModel;
      formState.remark = response.data.remark;
    }
  })
}
// 处理取消
const handleCancel = () => {
  loading.value = false;
  formRef.value.resetFields();
  emit ( 'update:visible', false )
  emit( 'update:listData' )
}

// 处理确定 - 点击确认时才上传
const handleOk = async () => {
  formRef.value.validate().then(async () => {
    try {
      loading.value = true
      const result = await editCostItem ( formState );
      if ( result.code === 200 ) {
        message.success ( result.msg )
        handleCancel ();
      }
      else {
        message.error ( '编辑失败' )
      }
    } catch ( error ) {
      console.error ( '编辑失败:', error );
    }
  }).catch(error => {
    console.log('error', error);
  })
}

</script>

<style scoped>
</style>