/**
 * @description 表格多选数据操作
 * */
import { computed } from "vue";
export const useTableSelection = () => {
  const selectedRowKeys = ref(undefined); //选中表格key
  const selectedRows = ref([]); // 选中表格keys
  const singleDisabled = ref(true); // 单选按钮禁用
  const multipleDisabled = ref(true); // 单选按钮禁用

  const rowSelection = computed(() => {
    return {
      type: "checkbox",
      selectedRowKeys: selectedRowKeys.value,
      onChange: (rowKeys, rows) => {
        selectedRowKeys.value = rowKeys;
        selectedRows.value = rows;
        if (!selectedRows.value.length) {
          selectedRows.value = [];
          multipleDisabled.value = true;
        } else {
          multipleDisabled.value = false;
        }
        if (selectedRows.value.length === 1) {
          singleDisabled.value = false;
        } else {
          singleDisabled.value = true;
        }
      },
    };
  });

  // 单行数据
  const tableRow = computed(() => selectedRows.value[0] || {});
  // 清空复选框
  const clearSelection = () => {
    selectedRowKeys.value = undefined;
    selectedRows.value = [];
  };

  return {
    selectedRowKeys,
    selectedRows,
    singleDisabled,
    multipleDisabled,
    rowSelection,
    tableRow,
    clearSelection,
  };
};
