<template>
<div id="appTableForm" class="appTableForm">
  <a-card>
    <a-form 
      v-bind="$attrs" 
      :model="props.formData" 
      ref="appTableFormRef"
      :rules="rules"
    >
      <div class="formItem-box">
        <slot name="formItemBox"></slot>
      </div>
      <div class="formItem-row">
        <slot name="formItemRow"></slot>
      </div>
      <div class="formItem-row right">
        <a-space>
          <a-button key="submit" @click="resetForm">重置</a-button>
          <a-button key="submit" type="primary" @click="onSubmit">查询</a-button>
          <a-popover placement="bottomRight" trigger="click">
            <template #content>
              <div class="formSetting-box">
                <div class="formSetting-itemRow" v-for="item in form.settingList" :key="item.name">
                  <div class="itemRow-title">{{ item.label }}</div>
                  <a-checkbox v-model:checked="item.show" @change="e => formItemShow(item, e)">显示</a-checkbox>
                </div>
              </div>
              <div class="formSetting-btn">
                <a-space>
                  <a-button @click="formSetting(null)" :loading="btnLoading">重置设置</a-button>
                  <a-button type="primary" @click="formSetting(form.settingList)" :loading="btnLoading">保存设置</a-button>
                </a-space>
              </div>
            </template>
            <template #title>
              <span>条件设置</span>
            </template>
            <a-button type="primary">
              <asyncIcon icon="SettingOutlined"></asyncIcon>
              {{ '条件设置' }}
            </a-button>
          </a-popover>
        </a-space>
      </div>
    </a-form>
  </a-card>
</div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue';
import asyncIcon from '~@/layouts/components/menu/async-icon.vue';
defineOptions({ name: "appTableForm" });
const { proxy: _this } = getCurrentInstance();
const emit = defineEmits(['update:formData', 'onSubmit', 'formHeightChange']);
const props = defineProps({
  resetSetMenu: { // 唯一标识，不能重复，必传
    type: String,
    default: ''
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  settingNameList: {
    type: Array,
    default: () => ([])
  },
  rules: {
    type: Object,
    default: () => ({})
  }
});
const form = reactive({
  formData: {},
  copyFormData: {},
  settingList: [],

  currentDom: null,
});
const btnLoading = ref(false);
onMounted(() => {
  // form.formData = cloneDeep(props.formData);
  form.currentDom = document.querySelector('#appTableForm');
  form.copyFormData = cloneDeep(props.formData);
  getSettingList();
  getHeight();
});
// 获取当前表单组件高度
function getHeight() {
  let offsetHeight = form.currentDom.offsetHeight;
  emit('formHeightChange', offsetHeight);
}
// 生成筛选条件设置列表
function generateSettingNameList() {
  let dom = document.querySelector('.appTableForm');
  let formItemList = [...dom.querySelectorAll('.ant-form-item')];
  let list = [];
  formItemList.forEach(item => {
    item.classList.remove('item-hide');
    props.settingNameList.forEach(name => {
      let label = item.querySelector(`[for="form_item_${name}"]`);
      if (label) {
        let obj = {
          name: name,
          label: label.innerText,
          formItem: item,
          show: true,
        };
        list.push(obj);
      }
    });
  });
  return list;
}
// 获取表单
async function getSettingList() {
  if (!props.resetSetMenu) {
    console.error('缺少resetSetMenu！');
    return;
  }
  let { data } = getFrom();
  let settingList = generateSettingNameList();
  if (data) {
    data.forEach(item => {
      let dom = settingList.find(i => i.name === item.name);
      item.formItem = dom.formItem;
      formItemShow(item);
    });
    form.settingList = data;
  } else {
    form.settingList = settingList;
  }
  return Promise.resolve();
}
/**
* // 更新表单
* @param data 表单数据
*/
function updateFrom(data) {
  let localTableFrom = JSON.parse(localStorage.getItem('localTableFrom') || '[]');
  let obj = {
    menu: props.resetSetMenu,
    data: data,
  };
  let form = localTableFrom.find(i => i.menu === obj.menu);
  if (form) {
    form.data = data;
  } else {
    localTableFrom.push(obj);
  }
  let str = JSON.stringify(localTableFrom);
  localStorage.setItem('localTableFrom', str);
}
/**
* 获取表单数据
*/
function getFrom() {
  let localTableFrom = JSON.parse(localStorage.getItem('localTableFrom') || '[]');
  let form = localTableFrom.find(i => i.menu === props.resetSetMenu);
  let obj = {
    menu: props.resetSetMenu,
    data: form ? form.data : null,
  };
  return obj;
}
// 保存表格设置
async function formSetting(val) {
  btnLoading.value = true;
  updateFrom(val);
  getSettingList();
  btnLoading.value = false;
  nextTick(() => {
    message.success('已保存');
  });
  return Promise.resolve();
}
/**
* 筛选项显示设置
* @param val 筛选项对象
*/
function formItemShow(val) {
  if (val.show) {
    val.formItem.classList.remove('item-hide');
  } else {
    val.formItem.classList.add('item-hide');
  }
  getHeight();
}
// 查询
async function onSubmit() {
  try {
    await _this.$refs.appTableFormRef.validateFields();
    emit('onSubmit');
  } catch (error) {
    message.error('请填写必填项！');
  }
}
// 重置
function resetForm() {
  _this.$refs.appTableFormRef.resetFields();
  let data = cloneDeep(form.copyFormData);
  // console.log(111, data);
  emit('update:formData', data);
}
</script>
<style lang="less" scoped>
#appTableForm.appTableForm {
  padding: 4px;
  .formItem-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .formItem-row {
    width: 100%;
    &.right {
      display: flex;
      justify-content: flex-end;
    }
  }
  :deep(.ant-form-item) {
    margin: 0 16px 16px 0;
    .ant-form-item-label {
      width: 150px;
      text-align: right;
    }
    .ant-form-item-control {
      width: 200px;
    }
    &.item-hide {
      display: none;
    }
  }
}
.formSetting-box {
  max-height: 300px;
  overflow-y: auto;
  .formSetting-itemRow {
    height: 30px;
    display: flex;
    align-items: center;
    margin: 4px 0;
    background: #fafafa;
    .itemRow-title {
      width: 200px;
      padding-left: 4px;
    }
    :deep(.ant-checkbox-wrapper) {
      margin-left: 16px;
    }
  }
}
.formSetting-btn {
  padding: 8px 0;
  text-align: right;
}
</style>