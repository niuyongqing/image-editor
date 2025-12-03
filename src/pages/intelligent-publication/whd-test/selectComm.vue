<template>
  <div id="selectComm">
    <div class="accountForm">
      <a-button @click="selectAll" :type="isAllSelected ? 'primary' : ''">全部</a-button>
      <a-button
        @click="selectItem(item[fieldObj.fieldKey])"
        :type="selectedIndex.includes(item[fieldObj.fieldKey]) ? 'primary' : ''"
        v-for="(item, index) in options"
        :key="item[fieldObj.fieldKey]"
      >
        {{ item[fieldObj.fieldLabel] }}
      </a-button>
    </div>
  </div>
</template>

<script setup name='selectComm'>
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
const isAllSelected = ref(true);
const selectedIndex = ref([]);// 选中的值
const props = defineProps({
  options: Array,
  fieldObj: {
    type: Object,
    default: () => {
      return {
        fieldKey: 'value',
        fieldLabel: 'label',
      }
    }
  },
  multiple: Boolean,      // 是否多选
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["backSelectAll", "backSelectItem"]);
const selectAll = () => {
  if (isAllSelected.value) {
    return;
  }
  isAllSelected.value = true;
  selectedIndex.value = []
  if (props.multiple) {
    let value = props.options.map(i => i[props.fieldObj.fieldKey]);
    emit("backSelectAll", value);
  } else {
    emit("backSelectAll", null);
  }
};
const selectItem = (account) => {
  if (isAllSelected.value) {
    isAllSelected.value = false;
  }
  if (props.multiple) {
    if (selectedIndex.value.includes(account)) {
      selectedIndex.value = selectedIndex.value.filter(i => i !== account)
    } else {
      selectedIndex.value.push(account);
    }
    emit("backSelectItem", selectedIndex.value);
  } else {
    selectedIndex.value = []
    selectedIndex.value.push(account);
    emit("backSelectItem", selectedIndex.value[0]);
  }
};
// 暴露内部状态和方法给父组件
defineExpose({
  selectAll,
});
</script>
<style lang="less" scoped>
.accountForm {
  display: flex;
  flex-wrap: wrap;
  .ant-btn {
    margin: 0 5px 10px 0;
  }
}
</style>