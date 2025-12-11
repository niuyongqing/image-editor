<!-- components/ImportModal.vue -->
<template>
  <appModal v-model:openValue="internalVisible" width="20%" title="更改封账时间" @cancel="handleCancel" @close="handleCancel" @ok="handleOk">
    <template #appContent>
      <a-form ref="formRef" :model="formState" :rules="rules">
        <a-form-item label="版本封账时间: " name="sealingTime">
          <a-date-picker v-model:value="formState.sealingTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请选择封账时间"/>
        </a-form-item>
      </a-form>
    </template>
  </appModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { UploadOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useAuthorization } from "~/composables/authorization.js";

// 定义props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// 定义emit事件
const emit = defineEmits(['update:visible'])

//定义变量
const internalVisible = ref(props.visible)
const formRef = ref();
const formState = reactive({
  sealingTime: undefined
});
const rules = {
  sealingTime: [
    {
      required: true,
      message: '请选择封账时间',
      trigger: 'change',
    }
  ]
};

// 监听外部 visible 的变化
watch(() => props.visible, (newVal) => {
  internalVisible.value = newVal
})

watch(internalVisible, (newVal) => {
  emit('update:visible', newVal)
})

// 处理取消
const handleCancel = () => {
  formRef.value.resetFields();
  emit('update:visible', false)
}

// 处理确定
const handleOk = () => {
  formRef.value.validate().then(() => {
    console.log(formState.sealingTime);
    handleCancel()
  })
}
</script>

<style scoped>

</style>