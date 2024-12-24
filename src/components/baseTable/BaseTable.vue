<template>
    <div class="table-container">
        <a-card>
            <div ref="tableContainer">
                <div class="w-full flex justify-between mb-3">
                    <div>

                        <slot name="leftBar"></slot>

                    </div>
                    <div>
                        <!-- 店铺商品表格右侧分页 -->
                        <a-space>
                            <slot name="rightBar"></slot>
                            <a-pagination size="small" v-model:current="pagination[pageField]"
                                v-if="showRightPagination" v-model:pageSize="pagination.pageSize"
                                :total="pagination.total" show-size-changer show-quick-jumper
                                :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
                                @change="handleChange" />
                        </a-space>
                    </div>
                </div>
                <a-table v-bind="$attrs" :columns="columns" :row-key="rowKey" :data-source="tableData"
                    :loading="loading" :pagination="{
                        ...pagination,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: (total, range) => `第${range[0]}-${range[1]}条, 共${total}条`
                    }" @change="handleChange" v-model:current="pagination[pageField]"
                    v-model:pageSize="pagination.pageSize" ellipsis bordered
                    :scroll="{ y: tableHeight, x: '100%', virtual: true }">
                    <template #headerCell="{ column }">
                        <slot v-if="column.headerCell" name="headerCell" :column="column"></slot>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.slot && !['leftBar', 'rightBar'].includes(column.slot)">
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
const { columns, api, rowKey, dropAble, showRightPagination, initSearchParam, pageField } = defineProps({
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
    showRightPagination: {
        type: Boolean,
        default: false
    },
    api: {
        type: Function,
        required: true
    },
    initSearchParam: {
        type: Object,
        default: () => ({})
    },
    // 当前页码字段名
    pageField: {
        type: String,
        default: 'pageNum'
    },
    immediate: {
        type: Boolean,
        default: true
    }
});
const { tableData, pagination, loading, handleChange, getTableList, updatedTotalParam, setLoading, search, reload } = useTable(api, initSearchParam, pageField);
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
    loading,
    handleChange,
    getTableList,
    updatedTotalParam,
    setLoading,
    search,
    reload
});
</script>