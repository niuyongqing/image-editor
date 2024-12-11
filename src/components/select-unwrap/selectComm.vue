<template>
  <div id="selectComm">
    <div class="accountForm">
      <a-button @click="selectAll" :type="isAllSelected ? 'primary' : ''"
        >全部</a-button
      >
      <a-button
        @click="selectItem(index, item[fieldObj.fieldKey])"
        :type="selectedIndex === index ? 'primary' : ''"
        v-for="(item, index) in options"
        :key="item[fieldObj.fieldKey]"
        >{{ item[fieldObj.fieldLabel] }}</a-button
      >
    </div>
  </div>
</template>

<script setup name='selectComm'>
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
const isAllSelected = ref(true);
const selectedIndex = ref(null);
const props = defineProps({
  options: Array,
  fieldObj: Object,
});
// 使用defineEmits获取emit函数
const emit = defineEmits(["backSelectAll", "backSelectItem"]);
const selectAll = () => {
  isAllSelected.value = true;
  selectedIndex.value = null;
  emit("backSelectAll");
};
const selectItem = (index, account) => {
  if (isAllSelected.value) {
    isAllSelected.value = false;
  }
  selectedIndex.value = index;
  emit("backSelectItem", account);
};
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