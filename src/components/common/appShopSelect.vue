<template>
<div id="appShopSelect" class="appShopSelect">
  <a-popover placement="bottomLeft" trigger="click">
    <template #content>
      <div class="appShopSelect-accountForm">
        <div
          @click="selectItem(index, item)"
          class="ant-btn"
          :class="account === item[fieldObj.value] ? 'primary' : ''"
          v-for="(item, index) in optionList"
          :key="item[fieldObj.value]"
        >{{ item[fieldObj.label] }}</div>
      </div>
    </template>
    <a-button class="appShopSelect-btn">
      <span class="appShopSelect-btn-text">{{ actionItem[fieldObj.label] }}</span>
    </a-button>
  </a-popover>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
defineOptions({ name: "appShopSelect" })
const { proxy: _this } = getCurrentInstance()
const props = defineProps({
  account: {
    type: String,
    default: ''
  },
  isShowAll: {
    type: Boolean,
    default: true,
  },
  options: Array,
  fieldObj: {
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value'
    })
  },

});
// 使用defineEmits获取emit函数
const emit = defineEmits(["selectItem", 'update:account']);
const actionItem = ref({})    // 被选中的项
const optionList = computed(() => {
  let list = props.options;
  if (props.isShowAll) {
    let obj = {}
    obj[props.fieldObj.label] = '全部'
    obj[props.fieldObj.value] = ''
    list = [obj, ...list]
  }
  return list;
})
watch(() => props.account, (val, oldVal) => {
  actionItem.value = optionList.value.find(i => i[props.fieldObj.value] === val) || {};
}, {
  // deep: true,
  immediate: true,
})
const selectItem = (index, item) => {
  actionItem.value = item
  emit('update:account', item[props.fieldObj.value]);
  emit('selectItem', item[props.fieldObj.value])
};
// defineExpose({});
</script>
<style lang="less" scoped>
.appShopSelect {
  width: 100%;
  height: 100%;
  .appShopSelect-btn {
    width: 100%; 
    height: 100%; 
    text-align: left;
    display: flex;
    align-items: center;
    .appShopSelect-btn-text {
      display: inline-block;
      width: 100%;
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
    }
  }
}
.appShopSelect-accountForm {
  width: 1200px;
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
      background-color: #4096ff;
    }
  }
}
</style>