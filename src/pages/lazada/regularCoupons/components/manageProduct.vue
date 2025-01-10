<template>
    <div>
        <!-- 管理商品 -->
        <BaseModal title="管理商品" @close="cancel" width="90%" @register="register" showCancelBtn :showSaveBtn="false">
            <a-card>
                <div class="clearfix" style="margin-bottom: 16px;">
                    <span style="float: left;">
                        <a-button type="primary" @click="selectProduct">选择商品</a-button>
                    </span>
                    <div style="float: right; margin-right: 10px;">
                        <a-input-group compact style="width: 650px;">
                            <a-select v-model:value="searchForm.selectionValue" placeholder="请选择" style="width: 150px;">
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
            </a-card>

            <a-card>
                <a-table :columns="columns" :row-selection="rowSelection"
                    :data-source="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                    row-key="itemId" :scroll="{ y: 800 }" />
            </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';

const columns = [
    {
        title: 'ID',
        dataIndex: 'itemId',
    }, {
        title: '产品名称',
        dataIndex: 'name',
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
    {
        title: '操作',
        dataIndex: 'totalStock',
    },
];

const { rowSelection, selectedRowKeys, selectedRows, clearSelection } = useTableSelection();

const searchForm = reactive({
    selectionValue: undefined,
    inputValue: ''
});
const { state: pagination, reset } = useResetReactive({
    currentPage: 1,
    pageSize: 50,
    total: 0,
})


const loading = ref(false);
const voucherIdNumber = ref('');
const shortCodeNumber = ref('');
const tableData = ref([]);
const oldTableData = ref([]);


const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};

//  选择商品
const selectProduct = () => { }

const open = (rows) => {
    loading.value = true
    voucherIdNumber.value = rows.voucherId
    shortCodeNumber.value = rows.shortCode
    // if (rows.selectionProductList) {
    //     // this.$bus.$emit('detailSelectionProductList', e.selectionProductList)
    // }
    tableData.value = rows.selectionProductList
    oldTableData.value = rows.selectionProductList
    modelMethods.value.openModal();
};
const cancel = () => { }
defineExpose({
    open,
})



</script>

<style lang="less" scoped></style>