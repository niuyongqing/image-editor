<template>
    <div>
        <!-- 商品列表 -->
        <BaseModal title="商品列表" @close="cancel" width="60%" @register="register" showCancelBtn :showSaveBtn="false">
            <a-card>
                <div class="clearfix" style="margin-bottom: 16px;">
                    <span style="float: left;">
                        <a-button type="primary" @click="selectProduct">商品列表信息</a-button>
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
                <BaseTable ref="baseTableRef" :columns="columns" :api="lazadaProductList" rowKey="itemId"
                    :immediate="false"></BaseTable>
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

const { rowSelection, selectedRowKeys, selectedRows, clearSelection } = useTableSelection();

const searchForm = reactive({
    selectionValue: undefined,
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

const modelMethods = ref();
const register = (modal) => {
    modelMethods.value = modal;
};

//  选择商品
const selectProduct = () => { }

const open = (rows) => {
    loading.value = true
    console.log('ProductList ->>>>>>>>>>>', rows);
    let itemId = rows.map(v => { return v.itemId })
    let data = {
        shortCode: shortCode,
        notInItemIdList: itemId
    };
    rowsData.value = data
    modelMethods.value.openModal();
    nextTick(() => {
        console.log('nextTick');
        baseTableEl.value.search(data);
    })

};
const cancel = () => { }
defineExpose({
    open,
})
</script>

<style lang="less" scoped></style>