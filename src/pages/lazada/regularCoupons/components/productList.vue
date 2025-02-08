<template>
    <div>
        <!-- 商品列表 -->
        <BaseModal title="商品列表" @close="cancel" width="1200px" @register="register" showCancelBtn :showSaveBtn="true"
            @submit="submit">
            <a-card>
                <div class="clearfix" style="margin-bottom: 16px;">
                    <span style="float: left;">
                        <span>商品列表信息</span>
                    </span>
                    <div style="float: right; margin-right: 10px;">
                        <a-input-group compact style="width: 650px;">
                            <a-select v-model:value="searchForm.selectionValue" placeholder="请选择" style="width: 120px;">
                                <a-select-option value="itemName">产品名称</a-select-option>
                                <a-select-option value="itemId">产品ID</a-select-option>
                            </a-select>
                            <a-input v-model:value="searchForm.inputValue" placeholder="请输入内容" style="width: 400px;" />
                            <a-button @click="searchTable">
                                <SearchOutlined />
                            </a-button>
                            <a-button @click="refrechTable" type="primary">
                                <ReloadOutlined></ReloadOutlined>
                            </a-button>
                        </a-input-group>
                    </div>
                </div>
                <template #actions></template>
            </a-card>

            <a-card>
                <BaseTable ref="baseTableRef" :columns="columns" :api="lazadaProductList" rowKey="itemId"
                    :immediate="false" :table-height-offset="300" :row-selection="rowSelection">
                    <template #name="{ record }">
                        <a-popover placement="right" trigger="hover">
                            <template #content>
                                <img :src="JSON.parse(record.images)" style="height: 400px; width: 400px;" alt="" />
                            </template>
                            <div flex gap-5px>
                                <a-image style="width: 56px; height: 56px; border: 1px solid #ccc;"
                                    :src="JSON.parse(record.images)[0]" :preview-src-list="JSON.parse(record.images)">
                                    <template #placeholder>
                                        <div class="image-slot">加载中<span class="dot">...</span></div>
                                    </template>
                                    <template #error>
                                        <div class="image-slot"><i class="anticon anticon-picture"></i></div>
                                    </template>
                                </a-image>
                                <span>{{ record.itemName }}</span>
                            </div>
                        </a-popover>
                    </template>

                </BaseTable>
            </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseTable from '@/components/baseTable/BaseTable.vue';
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { lazadaProductList } from '@/pages/lazada/regularCoupons/api';

const columns = [
    {
        title: 'ID',
        dataIndex: 'itemId',
    }, {
        title: '产品名称',
        dataIndex: 'name',
        slot: 'name',
        width: 500
    },
    {
        title: '零售价格',
        dataIndex: 'minRetailPrice',
    }, {
        title: '当前销售价',
        dataIndex: 'minPrice',
    }, {
        title: '当前库存',
        dataIndex: 'totalStock',
    },
];
const emits = defineEmits(['success']);
const { rowSelection, selectedRowKeys, selectedRows, clearSelection } = useTableSelection();

const searchForm = reactive({
    selectionValue: 'itemName',
    inputValue: ''
});
const { state: pagination, reset } = useResetReactive({
    currentPage: 1,
    pageSize: 50,
    total: 0,
});
const loading = ref(false);
const rowsData = ref({});
const baseTableEl = useTemplateRef('baseTableRef');
const oldTableData = ref([]);
const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};

const searchTable = () => {
    if (searchForm.selectionValue === 'itemName') {
        const tableData = oldTableData.value.filter((v) => { return v.itemName === searchForm.inputValue })
        pagination.total = tableData.length;
        baseTableEl.value.setTableData(tableData);
    }
    if (searchForm.selectionValue === 'itemId') {
        const tableData = oldTableData.value.filter((v) => { return v.itemId === searchForm.inputValue });
        pagination.total = tableData.length;
        baseTableEl.value.setTableData(tableData);
    }
};

const refrechTable = () => {
    searchForm.selectionValue = 'itemName';
    searchForm.inputValue = '';
    pagination.currentPage = 1;
    pagination.pageSize = 50;
    pagination.total = oldTableData.value.length;
    baseTableEl.value.setTableData(oldTableData.value);
};

const submit = () => {
    emits('success', selectedRows.value);
    modelMethods.value.closeModal();
};

const open = (shortCode, rows) => {
    loading.value = true
    let itemId = rows.map(v => { return v.itemId })
    let data = {
        shortCode: shortCode,
        notInItemIdList: itemId
    };
    rowsData.value = data
    modelMethods.value.openModal();
    nextTick(async () => {
        await baseTableEl.value.search(data);
        const tableData = await baseTableEl.value.tableData;
        oldTableData.value = tableData || [];
    })

};
const cancel = () => {
    clearSelection();
    searchForm.selectionValue = 'itemName';
    searchForm.inputValue = '';
}
defineExpose({
    open,
})
</script>

<style lang="less" scoped></style>