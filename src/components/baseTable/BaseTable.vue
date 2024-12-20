<template>
    <div class="table-container">
        <a-card>
            <div class="" ref="tableContainer">
                <div class="w-full flex justify-between mb-3">
                    <div>
                        <a-space>
                            <slot name="leftBar"></slot>
                        </a-space>
                    </div>
                </div>
                <a-table v-bind="$attrs" :columns="columns" :row-key="rowKey" :data-source="tableData"
                    :loading="loading"
                    :pagination="{ ...pagination, showQuickJumper: true, ShowSizeChanger: true, showTotal: (total) => `共${total}条` }"
                    @change="handleChange" v-model:current="pagination.current" v-model:pageSize="pagination.pageSize"
                    ellipsis bordered :scroll="{ y: tableHeight, x: '100%', virtual: true }">
                    <template #headerCell="{ column }">
                        <slot v-if="column.headerCell" name="headerCell" :column="column"></slot>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.slot && !['leftBar'].includes(column.slot)">
                            <slot :name="column.slot" :record="record" :index="index"></slot>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { computed, h, nextTick, watch } from 'vue';
import { EyeOutlined, UndoOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useTable } from './useTable';
import { omit } from 'lodash';
const { columns, api, rowKey, showPagination, dropAble, initSearchParam } = defineProps({
    columns: {
        type: Array,
        default: () => []
    },
    dropAble: {
        type: Boolean,
        default: false
    },
    rowKey: {
        type: String,
        default: 'id'
    },
    // 是否显示分页
    showPagination: {
        type: Boolean,
        default: true
    },
    api: {
        type: Function,
        required: true
    },
    initSearchParam: {
        type: Object,
        default: () => ({})
    }
});
const { tableData, pagination, handleChange, loading, updatedTotalParam, setLoading, search, reload } = useTable(api, initSearchParam);
const tableHeight = ref(0); // 表格高度
const tableContainer = ref(null);
const setTableHeight = () => {
    if (tableContainer.value) {
        tableHeight.value = window.innerHeight - tableContainer.value.getBoundingClientRect().top - 70; // 偏移量可根据需求调整
    }
};
onMounted(() => {
    setTableHeight();
    window.addEventListener('resize', setTableHeight);

})
onUnmounted(() => {
    window.removeEventListener('resize', setTableHeight);
});

defineExpose({
    tableData,
    pagination,
    handleChange,
    loading,
    updatedTotalParam,
    setLoading,
    search,
    reload
});
</script>