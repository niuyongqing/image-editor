<template>
  <div>
    <a-form :model="formState" name="basic" v-bind="$attrs" autocomplete="off" @finish="onFinish"
      @finishFailed="onFinishFailed" ref="formRef">
      <a-form-item :label="item.label" :name="item.name" :rules="item.rules" v-for="item in formList" :key="item.id">
        <div :style="item.style">
          <component :is="componentType(item.type)" :placeholder="placeholderValue(item)" v-bind="item.componentProps"
            v-model:value="formState[item.name]" allow-clear />
          <slot v-if="item.slot" :name="item.slot"></slot>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="$attrs.buttonItemLayout ? $attrs.buttonItemLayout : {}">
        <slot name="default"></slot>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { Input, Select, DatePicker, RangePicker, Checkbox, Switch, TimePicker, Textarea, InputPassword, Cascader } from 'ant-design-vue';
import ApiSelect from './componetns/ApiSelect.vue';

const { formList } = defineProps({
  formList: {
    type: Array,
    default: () => {
      return [
        {
          id: 1,
          type: 'input',
          placeholder: '',
          name: 'username',
          modelValue: '',
          label: '用户名',
          rules: [{ required: true, message: '' }],
          componentProps: {},// antdesign - 组件props属性
        },
        {
          id: 2,
          type: 'input',
          placeholder: '',
          name: 'username2',
          label: '用户名2',
          rules: [{ required: true, message: '' }],
          componentProps: {} // antdesign - 组件props属性
        },
        {
          id: 3,
          type: 'select',
          placeholder: '',
          name: 'select1',
          label: 'select-label',
          rules: [{ required: true, message: '' }],
          componentProps: {
            options: [
              { label: '选项一', value: '1' },
              { label: '选项二', value: '2' },
              { label: '选项三', value: '3' },
            ]
          } // antdesign - 组件props属性
        },

      ]
    }
  }
});

const formEl = useTemplateRef("formRef");
const formState = reactive({
});

const componentMap = {
  input: Input,
  select: Select,
  date: DatePicker,
  rangePicker: RangePicker,
  time: TimePicker,
  cascader: Cascader,
  apiSelect: ApiSelect,
  checkbox: Checkbox,
  switch: Switch,
  textarea: Textarea,
  password: InputPassword,
}
const componentType = (type) => {
  return componentMap[type] || componentMap['input'];
};

const placeholderValue = (item) => {
  return `${item.type === 'input' ? '请输入' : '请选择'}${item.label}`
};


const onFinish = (values) => {
  emits('finish', values);
};

const onFinishFailed = (errorInfo) => {
  emits('finishFailed', errorInfo);
};


//  设置form组件值
const setFieldValue = (fieldName, value) => {
  formState[fieldName] = value;
}
//  批量设置form组件值
const setFieldsValue = (values) => {
  Object.keys(values).forEach(key => {
    formState[key] = values[key];
  });
}
//  获取form-字段组件值
const getFieldValue = (fieldName) => {
  return formState[fieldName];
}
//  获取form组件值
const getFieldsValue = () => {
  return formState;
};
// 清空表单
const clear = () => {
  Object.keys(formState).forEach(key => {
    formState[key] = undefined;
  });
};
// 校验
const validate = async () => {
  return await unref(formEl)?.validate();
};
// 清空校验状态
const reset = async () => {
  await unref(formEl)?.resetFields();
};

const emits = defineEmits(['finish', 'finishFailed'])

defineExpose({
  setFieldValue,
  setFieldsValue,
  getFieldValue,
  getFieldsValue,
  clear,
  reset,
  validate,
  formEl,
});


</script>

<style lang="scss" scoped></style>