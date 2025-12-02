<template>
<div id="appShopSelect" class="appShopSelect">
  <a-popover placement="bottomLeft" trigger="click">
    <template #content>
      <div class="appShopSelect-accountForm">
        <div
          @click="selectItem(index, item)"
          class="ant-btn"
          :class="selectItemClass(item)"
          v-for="(item, index) in optionList"
          :key="item[fieldValue]"
        >{{ item[fieldLabel] }}</div>
      </div>
    </template>
    <div class="appShopSelect-btn">
      <span class="appShopSelect-btn-text">
        <!-- {{ actionItem.length > 0 ? actionItem[0][fieldLabel]:'' }} -->
        {{ actionItem.map(i => i[fieldLabel]).join(' , ') }}
      </span>
      <span class="appShopSelect-btn-num" v-if="multiple && actionItem.length > 1">
        {{ `  +${actionItem.length - 1}` }}
      </span>
      <asyncIcon 
        v-if="multiple && actionItem.length > 0" 
        icon="CloseCircleOutlined"
        @click.stop="allowClear"
      ></asyncIcon>
    </div>
  </a-popover>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import asyncIcon from '~@/layouts/components/menu/async-icon.vue';
defineOptions({ name: "appShopSelect" });
const { proxy: _this } = getCurrentInstance();
const props = defineProps({
  account: {            // 绑定字段 v-model:account
    type: [String, Array],
    default: ''
  },
  isShowAll: {          // 是否启用全选按钮，一般用于单选
    type: Boolean,
    default: true,
  },
  options: Array,       // 展示数据
  fieldObj: {           // 配置字段 label：展示字段 value：值
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value'
    })
  },
  multiple: Boolean,    // 是否多选
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["selectItem", 'update:account']);
const actionItem = ref([]);    // 被选中的项
let {label: fieldLabel, value: fieldValue} = props.fieldObj
const optionList = computed(() => {
  let list = props.options;
  if (props.isShowAll) {
    let obj = {};
    obj[fieldLabel] = '全部';
    obj[fieldValue] = '';
    list = [obj, ...list];
  }
  return list;
});
watch(() => props.account, (val, oldVal) => {
  if (props.multiple) {
    let data = val && Array.isArray(val) ? val : [];
    actionItem.value = optionList.value.filter(i => data.includes(i[fieldValue]));
  } else {
    actionItem.value = [optionList.value.find(i => i[fieldValue] === val) || {}];
  }
}, {
  // deep: true,
  immediate: true,
});
function selectItem(index, item) {
  let data = null;
  if (props.multiple) {
    data = actionItem.value.map(i => i[fieldValue]);
    if (data.includes(item[fieldValue])) {
      data = data.filter(i => i !== item[fieldValue]);
      actionItem.value = actionItem.value.filter(i => i[fieldValue] !== item[fieldValue]);
    } else {
      data.push(item[fieldValue]);
      actionItem.value.push(item);
    }
  } else {
    actionItem.value = [];
    actionItem.value.push(item);
    data = item[fieldValue];
  }
  let option = [...actionItem.value]
  emit('update:account', data);
  emit('selectItem', { data, option });
};
function selectItemClass(item) {
  return props.account === item[fieldValue] || ((props.multiple && Array.isArray(props.account)) && props.account.some(i => i === item[fieldValue])) ? 'primary' : ''
}
function allowClear() {
  actionItem.value = [];
  let data = props.multiple ? [] : '';
  emit('update:account', data);
  emit('selectItem', { data, option: [] });
}
// defineExpose({});
</script>
<style lang="less" scoped>
.appShopSelect {
  width: 400px;
  height: 100%;
  .appShopSelect-btn {
    width: 100%; 
    height: 24px; 
    font-size: 14px;
    padding: 0px 7px;
    border-radius: 4px;
    text-align: left;
    display: flex;
    align-items: center;
    background-color: #fff;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    &:hover {
      // color: #4096ff;
      border-color: #4096ff;
    }
    .appShopSelect-btn-text {
      display: inline-block;
      // width: calc(100% - 20px);
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
      margin-right: 4px;
    }
    .appShopSelect-btn-num {
      margin-right: 8px;
    }
    :deep(.anticon) {
      margin-left: auto;
      &:hover {
        color: #8c8c8c;
      }
    }
  }
}
.appShopSelect-accountForm {
  width: 1600px;
  display: flex;
  flex-wrap: wrap;
  .ant-btn {
    font-size: 14px;
    height: 24px;
    padding: 0px 7px;
    border-radius: 4px;
    margin: 0 5px 10px 0;
    cursor: pointer;
    &.primary {
      color: #fff;
      background-color: #1677ff;
    }
  }
}
</style>