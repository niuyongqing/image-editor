<template>
<div id="appShopSelect" class="appShopSelect">
  <a-popover placement="bottomLeft" trigger="click">
    <template #content>
      <div class="appShopSelect-accountForm">
        <div
          v-if="isShowAll" 
          class="ant-btn"
          @click="selectAll" 
          :class="isAllSelected ? 'primary' : ''"
        >全部</div>
        <div
          @click="selectItem(index, item)"
          class="ant-btn"
          :class="selectedIndex === index ? 'primary' : ''"
          v-for="(item, index) in options"
          :key="item[fieldObj.fieldKey]"
        >{{ item[fieldObj.fieldLabel] }}</div>
      </div>
    </template>
    <a-button class="appShopSelect-btn">{{ isAllSelected ? '全部' : actionItem[fieldObj.fieldLabel] }}</a-button>
  </a-popover>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
defineOptions({ name: "appShopSelect" })
const { proxy: _this } = getCurrentInstance()
const isAllSelected = ref(true);
const selectedIndex = ref(null);
const actionItem = ref({})
const props = defineProps({
  isShowAll: {
    type: Boolean,
    default: true,
  },
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
const selectItem = (index, item) => {
  if (isAllSelected.value) {
    isAllSelected.value = false;
  }
  actionItem.value = item
  selectedIndex.value = index;
  emit("backSelectItem", item[props.fieldObj.fieldKey]);
};
defineExpose({
  selectAll,
});
</script>
<style lang="less" scoped>
.appShopSelect {
  width: 100%;
  height: 100%;
  .appShopSelect-btn {
    width: 100%; 
    height: 100%; 
    text-align: left;
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