<template>
<div id="appTableForm" class="appTableForm" :class="{'stickyTop': form.scrollTop > form.offsetHeight}">
  <a-card>
    <a-form 
      v-bind="$attrs" 
      v-show="form.formShow"
      :model="formData" 
      ref="appTableFormRef"
      :rules="rules"
      :class="{'mini-form': mini}"
    >
      <div class="formItem-box" v-if="!!formItemBox">
        <!-- 标准筛选项使用该插槽 -->
        <slot name="formItemBox"></slot>
      </div>
      <div class="formItem-row" v-if="!!formItemRow">
        <!-- 自定义宽度的筛选项用这个插槽，独占一行 -->
        <slot name="formItemRow"></slot>
      </div>
      <div class="formItem-row right">
        <a-space>
          <a-button key="submit" type="primary" @click="onSubmit">查询</a-button>
          <a-button key="submit" @click="resetForm">重置</a-button>
          <a-popover placement="bottomRight" trigger="click">
            <template #content>
              <div class="formSetting-box">
                <div class="formSetting-itemRow" v-for="item in form.settingList" :key="item.name">
                  <div class="itemRow-title">{{ item.label }}</div>
                  <a-checkbox 
                    v-model:checked="item.show" 
                    @change="e => formItemShow(item, e)"
                    :disabled="item.disabled"
                  >{{ item.disabled ? '必填项':'显示' }}</a-checkbox>
                </div>
              </div>
              <div class="formSetting-btn">
                <!-- 筛选项设置列表是根据form-item的name属性生成，没有设置name的项和必填项不会出现在设置列表 -->
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
  <div class="form-show-btn" @click="formShowFn">
    <asyncIcon v-show="form.formShow" icon="UpCircleOutlined"></asyncIcon>
    <asyncIcon v-show="!form.formShow" icon="DownCircleOutlined"></asyncIcon>
  </div>
</div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { cloneDeep, debounce } from 'lodash-es';
import { ref, reactive, onMounted, onBeforeUnmount, computed, toRefs, useSlots } from 'vue';
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
  rules: {
    type: Object,
    default: () => ({})
  },
  mini: Boolean,            // 是否采用小型紧凑
  labelWidth: {
    type: [String, Number],
    default: '150',
  }
});
const { formData } = toRefs(props); 
const form = reactive({
  copyFormData: {},         // 原始数据用于重置
  settingList: [],          // 设置列表
  formShow: true,
  offsetHeight: null,       // 当前表单组件高度
  scrollTop: null,          // 当前外滚动条的高度
});
let currentDom = null;      // 当前组件dom
let contentDom = null;      // 滚动容器dom
const btnLoading = ref(false);
const { formItemBox, formItemRow, } = useSlots();
const labelWidth = computed(() => {
  let width = props.mini ? (Number(props.labelWidth) * 0.8) : props.labelWidth;
  return width + 'px';
})
onMounted(() => {
  currentDom = document.querySelector('#appTableForm');
  contentDom = document.querySelector('.ant-layout-content');
  form.copyFormData = cloneDeep(props.formData);
  getSettingList();
  getHeight();
  // scrollFn()
  contentDom.addEventListener('scroll', scrollFn);
});
onBeforeUnmount(() => {
  contentDom.removeEventListener('scroll', scrollFn);
});
const scrollFn = debounce(e => {
  form.scrollTop = contentDom.scrollTop;
  // form.formShow = (form.scrollTop <= form.offsetHeight)
  if (form.formShow && (form.scrollTop > form.offsetHeight)) {
    form.formShow = false;
    contentDom.scrollTop += 10
  } else if (form.scrollTop === 0) {
    form.formShow = true;
  }
}, 50);
function formShowFn() {
  if (!form.formShow) {
    contentDom.scrollTop = 0;
  }
  form.formShow = !form.formShow;
  setTimeout(() => {
    getHeight();
  }, 60);
}
// 获取当前表单组件高度
function getHeight() {
  form.offsetHeight = currentDom.offsetHeight;
  emit('formHeightChange', form.offsetHeight);
}
// 生成筛选条件设置列表
function generateSettingNameList(val) {
  let formItemList = [...currentDom.querySelectorAll('.ant-form-item')];
  let list = [];
  formItemList.forEach(item => {
    // 本地没有数据说明是未设置或重置，显示全部项
    !val && item.classList.remove('item-hide');
    // console.log({val: !val});
    let label = item.querySelector('label');
    let f = null;
    label && (f = label.getAttribute('for'));
    if (f) {
      let obj = {
        name: f.split('_')[2],
        label: label.innerText,
        formItem: item,
        show: true,
        disabled: label.className.includes('ant-form-item-required')
      };
      list.push(obj);
    }
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
  let settingList = generateSettingNameList(data);
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
    // console.log(22, val.formItem);
  }
  getHeight();
}
// 查询
async function onSubmit() {
  try {
    await _this.$refs.appTableFormRef.validateFields();
    emit('onSubmit', cloneDeep(formData.value));
  } catch (error) {
    message.error('请填写必填项！');
  }
}
// 重置
function resetForm() {
  let data = cloneDeep(form.copyFormData);
  Object.assign(formData.value, data);
  emit('update:formData', formData.value);
  nextTick(() => {
    _this.$refs.appTableFormRef.resetFields();
  });
}
</script>
<style lang="less" scoped>
#appTableForm.appTableForm {
  padding: 4px;
  position: relative;
  &.stickyTop {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  :deep(.ant-form-item) {
    margin: 0 16px 16px 0;
    .ant-form-item-label {
      width: v-bind(labelWidth);
      text-align: right;
    }
    .ant-form-item-control {
      width: 200px;
      min-width: 200px;
      .ant-picker {
        width: 100%;
        .ant-picker-range-separator {
          padding: 0 4px;
        }
      }
    }
    .ant-form-item-explain.ant-form-item-explain-connected.ant-form-show-help {
      height: 16px;
      & > div {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
      }
    }
    &.item-hide {
      display: none;
    }
  }
  :deep(.mini-form .ant-form-item) {
    margin: 0 8px 8px 0;
    .ant-form-item-label {
      width: v-bind(labelWidth);
      text-align: right;
      * {
        height: 20px;
        line-height: 20px;
        font-size: 12px !important;
      }
    }
    .ant-form-item-control {
      width: 180px;
      min-width: 180px;
      .ant-picker {
        width: 100%;
        .ant-picker-range-separator {
          padding: 0 4px;
        }
      }
      input {
        font-size: 12px !important;
        height: 20px !important;
        line-height: 20px;
      }
      .ant-form-item-control-input {
        min-height: 20px;
        .ant-form-item-control-input-content {
          min-height: 20px;
        }
      }
      .ant-select {
        width: 100%;
        height: 20px;
        .ant-select-selector {
          height: 20px;
          line-height: 18px;
          padding-top: 0;
          padding-bottom: 0;
          margin: 0;
          .ant-select-selection-item {
            line-height: 18px;
          }
          .ant-select-selection-overflow {
            height: 14px;
            line-height: 12px;
            padding-top: 0;
            padding-bottom: 0;
            padding-top: 0;
            & * {
              height: 100% !important;
              font-size: 8px !important;
              line-height: 14px;
              margin-top: 0;
              margin-bottom: 0;
              padding-top: 0;
            }
          }
          input {
            font-size: 12px !important;
            height: 16px !important;
            line-height: 16px;
          }
          .ant-select-selection-placeholder {
            font-size: 10px;
          }
        }
        .ant-select-arrow {
          top: 50%
        }
      }
    }
    .ant-form-item-explain.ant-form-item-explain-connected.ant-form-show-help {
      height: 8px;
      & > div {
        height: 8px;
        line-height: 8px;
        font-size: 7px;
      }
    }
  }
  .formItem-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    :deep(.ant-form-item):last-child {
      .ant-form-item-control {
        width: auto;
      }
    }
  }
  .formItem-row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    &.right {
      justify-content: flex-end;
    }
    :deep(.ant-form-item) {
      .ant-form-item-control {
        width: auto;
      }
    }
  }
  .form-show-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: -8px;
    left: calc(50% - 16px);
    cursor: pointer;
    span {
      font-size: 24px !important;
      color: #4e5969;
      opacity: 0.3; /* 整个元素及内容半透明 */
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