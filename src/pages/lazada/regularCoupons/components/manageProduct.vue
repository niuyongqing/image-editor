<template>
    <div>
        <!-- 管理商品 -->
        <BaseModal title="管理商品" @close="cancel" width="1000px" :submit-btn-loading="submitBtnLoading"
            :showCancelBtn="true" :showSaveBtn="true" @submit="sumbit" @register="register">
            <a-card>
                <div class="clearfix" style="margin-bottom: 16px;">
                    <span style="float: left;">
                        <a-button type="primary" @click="selectProduct">选择商品</a-button>
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
            </a-card>

            <a-card>
                <a-table :columns="columns" :row-selection="rowSelection"
                    :data-source="tableData.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)"
                    row-key="itemId" :scroll="{ y: 800 }">
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.dataIndex === 'name'">
                            <a-popover placement="right" trigger="hover">
                                <template #content>
                                    <img :src="JSON.parse(record.images)" style="height: 400px; width: 400px;" alt="" />
                                </template>
                                <a-image style="width: 56px; height: 56px; border: 1px solid #ccc;"
                                    :src="JSON.parse(record.images)[0]" :preview-src-list="JSON.parse(record.images)">
                                    <template #placeholder>
                                        <div class="image-slot">加载中<span class="dot">...</span></div>
                                    </template>
                                    <template #error>
                                        <div class="image-slot"><i class="anticon anticon-picture"></i></div>
                                    </template>
                                </a-image>
                            </a-popover>
                        </template>
                        <template v-if="column.dataIndex === 'minRetailPrice'">
                            <div>RM{{ record.minRetailPrice }} ~ RM{{ record.maxRetailPrice }}</div>
                        </template>
                        <template v-if="column.dataIndex === 'minPrice'">
                            <div>RM{{ record.minPrice }} ~ RM{{ record.maxPrice }}</div>
                        </template>
                        <template v-if="column.dataIndex === 'action'">
                            <a-space>
                                <a-button type="primary" @click="configSku(record)">管理SKU</a-button>
                                <a-button type="primary" danger @click="delTable(index)">删除</a-button>
                            </a-space>
                        </template>
                    </template>

                </a-table>
            </a-card>

            <!-- 选择商品弹窗 -->
            <ProductList ref="productListRef" @success="productListSuccess"></ProductList>
            <!-- 管理sku 弹窗 -->
            <ProductItemSku ref="productItemSkuRef"></ProductItemSku>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import ManageProduct from './manageProduct.vue';
import ProductList from './productList.vue';
import ProductItemSku from './productItemSku.vue';
import { addLazadaProductVoucher } from "@/pages/lazada/regularCoupons/api";
import { Modal } from 'ant-design-vue';

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
        dataIndex: 'action',
    },
];
const emits = defineEmits(['success']);

const { rowSelection, selectedRowKeys, selectedRows, clearSelection } = useTableSelection();
const submitBtnLoading = ref(false);
const searchForm = reactive({
    selectionValue: 'itemName',
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
const manageProductEl = useTemplateRef('manageProductRef');
const productListEl = useTemplateRef('productListRef');
const productItemSkuEl = useTemplateRef('productItemSkuRef');

const modelMethods = ref({});
const register = (modal) => {
    modelMethods.value = modal;
};

//  选择商品
const selectProduct = () => {
    productListEl.value.open(shortCodeNumber.value, tableData.value);
};

// 管理SKU
const configSku = (record) => {
    productItemSkuEl.value.open(record)
};

const productListSuccess = (list) => {
    tableData.value = [...tableData.value, ...list]
};

const delTable = (index) => {
    tableData.value.splice(index, 1)
};

// 确定提交
const sumbit = () => {
    let skus = [] //所有商品的SKU
    tableData.value.forEach((v) => {
        skus = skus.concat(v.skus)
    })
    let selectSkus = skus.filter((v) => { return v.isSelect === true }) //选中的商品SKU
    let selectSkusArr = selectSkus.map((v) => { return v.skuId })
    let data = {
        shortCode: shortCodeNumber.value,
        voucherId: voucherIdNumber.value,
        productSkuIdList: selectSkusArr
    }
    console.log('data', data);

    submitBtnLoading.value = true
    addLazadaProductVoucher(data).then(res => {
        if (res.code === 200) {
            Modal.confirm({
                title: '提示',
                content: '成功',
                onOk: () => {
                    modelMethods.value.closeModal();
                    emits('success')
                },
                // 隐藏取消按钮
                okText: '确定',
                cancelButtonProps: { style: { display: 'none' } }
            })
        }
        else {
            Modal.confirm({
                title: '提示',
                content: '失败',
                onOk: () => {
                    modelMethods.value.closeModal();
                },
                // 隐藏取消按钮
                okText: '确定',
                cancelButtonProps: { style: { display: 'none' } }
            })
        }
    }).finally(() => {
        submitBtnLoading.value = false
        cancel()
    })
};

const cancel = () => {
    oldTableData.value = [];
    voucherIdNumber.value = '';
    shortCodeNumber.value = '';
}
const open = (rows) => {
    console.log('rows', rows);

    loading.value = true
    voucherIdNumber.value = rows.voucherId
    shortCodeNumber.value = rows.shortCode
    // if (rows.selectionProductList) {
    //     // this.$bus.$emit('detailSelectionProductList', e.selectionProductList)
    // }
    tableData.value = rows.selectionProductList ?? []
    oldTableData.value = rows.selectionProductList ?? []
    modelMethods.value.openModal();
};

defineExpose({
    open,
})
</script>