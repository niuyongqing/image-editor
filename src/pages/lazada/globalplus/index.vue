<template>
    <div>
        <!-- gobalplus 商品 -->
        <Search @search="handleSearch" v-model:modelValue="searchLoading" pageField="current" :account="account">
        </Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="GlobalpPlusList" :init-search-param="initSearchParam"
            :row-selection="rowSelection" :tableHeightOffset="150">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" @click="handleUpdateGp" :disabled="singleDisabled">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        升级GP商品
                    </a-button>

                    <a-button type="primary" @click="handleExcelUpdate">
                        <template #icon>
                            <FilterOutlined />
                        </template>
                        Excel升级GP商品
                    </a-button>

                    <a-button type="primary" @click="handleAdd">
                        <template #icon>
                            <UndoOutlined />
                        </template>
                        同步可升级GP商品
                    </a-button>
                </a-space>
            </template>
            <template #skus="{ record }">
                <div p-15px>
                    <a-table :columns="skuColumns" :dataSource="displayedSkus(record)" rowKey="sellerSku" bordered
                        :pagination="false">
                        <template #expandedRowRender="{ record }">
                            <div pt-10px pb-10px pr-10px>
                                <a-table :columns="innerColumns" :dataSource="record.countryInfo" rowKey="currency"
                                    bordered :pagination="false">
                                </a-table>
                            </div>
                        </template>
                    </a-table>
                    <div v-if="record.skus.length > 3" pt-10px>
                        <a-button type="link" @click="showMore(record)">共{{ record.skus.length }}条SKU，{{
                            !record.show ? '展开' :
                                '收起' }}</a-button>
                    </div>
                </div>
            </template>
        </BaseTable>
        <UpgradeGP ref="upgradeGPRef" @success="reload"></UpgradeGP>
        <ExcelUpgradeGP ref="ExcelUpgradeGPRef" @success="reload"></ExcelUpgradeGP>
        <AddModal ref="addModalRef" @success="reload"></AddModal>
    </div>
</template>

<script setup>
import { PlusOutlined, FilterOutlined, UndoOutlined } from '@ant-design/icons-vue';
import { columns, skuColumns, innerColumns } from './columns';
import { GlobalpPlusList } from './api';
import UpgradeGP from './components/upgradeGP.vue';
import ExcelUpgradeGP from './components/excelUpgradeGP.vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { Modal, message } from 'ant-design-vue';
import { accountCache } from '@/pages/lazada/product/api'
import AddModal from './components/addModal.vue';
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';

const initSearchParam = {
    prop: 'create_time',
    order: "desc",
    type: "global"
};
const account = ref([]);
const searchLoading = ref(false);
const addModalEl = useTemplateRef('addModalRef');
const baseTableEl = useTemplateRef('baseTableRef');
const upgradeGPEl = useTemplateRef('upgradeGPRef');
const ExcelUpgradeGPEl = useTemplateRef('ExcelUpgradeGPRef');
const { singleDisabled, rowSelection, tableRow, clearSelection } = useTableSelection()

function displayedSkus(row) {
    return row.show ? row.skus : row.skus.slice(0, 3);
};

const showMore = (row) => {
    row.show = !row.show;
}

//  重新刷新
const reload = () => {
    baseTableEl.value.reload();
    clearSelection();
};
// 查询
const handleSearch = async (state) => {
    await baseTableEl.value.search(state);
    searchLoading.value = false;
};

// Global Plus 商品升级
const handleUpdateGp = () => {
    upgradeGPEl.value.open(tableRow.value);
};

// 新增
const handleAdd = () => {
    nextTick(() => {
        addModalEl.value.open();
    })
};

function getAccount() {
    accountCache().then(res => {
        if (res.data) {
            for (const resKey in res.data.accountDetail) {
                account.value.push(...res.data.accountDetail[resKey])
            }
        }
    })
};
onMounted(() => {
    getAccount();
})
</script>

<style lang="less" scoped></style>
