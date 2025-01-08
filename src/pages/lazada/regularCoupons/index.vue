<template>
    <div>
        <Search :account="account" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam"
            :row-selection="rowSelection" :show-right-pagination="false" rowKey="id" :immediate="false">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" @click="handleAdd">
                        <PlusCircleOutlined /> 新增
                    </a-button>
                    <a-button type="primary" @click="handleEdit" :disabled="singleDisabled">
                        <EditOutlined /> 编辑
                    </a-button>
                    <a-button type="primary" @click="handleView" :disabled="singleDisabled">
                        <EyeOutlined /> 查看
                    </a-button>
                    <a-button type="primary" @click="settingProduct" :disabled="singleDisabled">
                        <SettingOutlined /> 管理商品
                    </a-button>

                    <a-button type="primary" @click="activate" :disabled="multipleDisabled">
                        <CheckOutlined /> 激活
                    </a-button>

                    <a-button type="primary" @click="deactivateVoucher" :disabled="multipleDisabled">
                        <StopOutlined />
                        暂停
                    </a-button>
                    <a-button type="primary" @click="syncLazadaVoucher" :disabled="multipleDisabled">
                        <ReloadOutlined /> 同步优惠卷
                    </a-button>
                    <a-button type="primary" @click="syncLazadaShopVoucher">
                        <CloudSyncOutlined /> 同步店铺优惠卷
                    </a-button>
                </a-space>
            </template>
            <template #periodStartTime="{ record }">
                <div>
                    <div>从 {{ Timedata(parseFloat(record.periodStartTime)) }}</div>
                    <div>到 {{ Timedata(parseFloat(record.periodEndTime)) }}</div>
                </div>
            </template>
            <template #status="{ record }">
                <a-tag v-if="record.status == 'NOT_START'" color="blue">未开始</a-tag>
                <a-tag v-if="record.status == 'ONGOING'" color="green">进行中</a-tag>
                <a-tag v-if="record.status == 'SUSPEND'" color="red">暂停</a-tag>
                <a-tag v-if="rorecordw.status == 'FINISH'" color="orange">已过期</a-tag>
            </template>
            <template #syncTime="{ record }">
                <div>{{ Timedata(parseFloat(record.syncTime) * 1000) }}</div>
            </template>
        </BaseTable>
        <AddVoucher ref="addVoucherRef" @success="reload" />
        <EditVoucher ref="editVoucherRef" @success="reload" />
        <ViewVoucher ref="viewVoucherRef" @success="reload" />
    </div>
</template>

<script setup>
import { PlusCircleOutlined, EditOutlined, EyeOutlined, SettingOutlined, CheckOutlined, StopOutlined, ReloadOutlined, CloudSyncOutlined } from '@ant-design/icons-vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { getList, accountCache, activateVoucher } from './api';
import { columns } from './columns';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import Search from './components/search.vue';
import { Timedata } from '~@/pages/lazada/regularCoupons/common/util.js';
import AddVoucher from './components/addVoucher.vue';
import EditVoucher from './components/editVoucher.vue';
import ViewVoucher from './components/viewVoucher.vue';

const initSearchParam = {
    prop: "create_time",
    order: "desc"
};
const { singleDisabled, multipleDisabled, rowSelection, tableRow, clearSelection } = useTableSelection();
const baseTableEl = useTemplateRef('baseTableRef');
const addVoucherEl = useTemplateRef('addVoucherRef');
const editVoucherEl = useTemplateRef('editVoucherRef');
const viewVoucherEl = useTemplateRef('viewVoucherRef');

const account = ref([]);
// 查询
const handleSearch = async (state) => {
    await baseTableEl.value.search(state);
};
// 查询
const reload = async (state) => {
    await baseTableEl.value.reload();
};

// 新增
const handleAdd = () => {
    addVoucherEl.value.open();
};

// 编辑
const handleEdit = () => {
    editVoucherEl.value.open();
};

// 查看
const handleView = () => {
    viewVoucherEl.value.open();
};

//  管理商品
const settingProduct = () => { };

// 激活
const activate = () => { };

// 暂停
const deactivateVoucher = () => { };

// 同步优惠卷
const syncLazadaVoucher = () => { };

// 同步店铺优惠卷
const syncLazadaShopVoucher = () => { };


onMounted(async () => {
    const accountCacheRes = await accountCache();
    if (accountCacheRes.code === 200) {
        let codes = [];
        for (const resKey in accountCacheRes.data.accountDetail) {
            codes.push(...accountCacheRes.data.accountDetail[resKey])
        };
        account.value = codes;
    };
});

</script>

<style lang="less" scoped></style>