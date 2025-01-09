<template>
    <div>
        <Search :account="account" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="lazadaFlexicomboList" :immediate="false"
            :init-search-param="initSearchParam">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" @click="handleAdd">
                        <PlusCircleOutlined /> 新增
                    </a-button>
                    <a-button type="primary" @click="activate" :disabled="multipleDisabled" :loading="activateLoading">
                        <CheckOutlined /> 激活
                    </a-button>
                    <a-button type="primary" @click="deactivateVoucher" :disabled="multipleDisabled"
                        :loading="deactivateVoucherLoading">
                        <StopOutlined />
                        暂停
                    </a-button>
                    <a-button type="primary" @click="syncLazadaShopVoucher" :loading="syncLazadaShopLoading">
                        <CloudSyncOutlined /> 同步店铺优惠卷
                    </a-button>
                </a-space>
            </template>
            <template #time="{ record }">
                <div>从 {{ Timedata(parseFloat(record.startTime)) }}</div>
                <div>到 {{ Timedata(parseFloat(record.endTime)) }}</div>
            </template>
            <template #status="{ record }">
                <a-tag v-if="record.status == 'NOT_START'" color="blue">未开始</a-tag>
                <a-tag v-if="record.status == 'ONGOING'" color="green">进行中</a-tag>
                <a-tag v-if="record.status == 'SUSPEND'" color="red">暂停</a-tag>
                <a-tag v-if="rorecordw.status == 'FINISH'" color="orange">已过期</a-tag>
            </template>
            <template #apply="{ record }">
                <div v-if="record.apply === 'ENTIRE_SHOP'">全店商品</div>
                <div v-if="record.apply === 'SPECIFIC_PRODUCTS'">部分商品</div>
            </template>
            <template #syncTime="{ record }">
                <div>{{ Timedata(parseFloat(record.syncTime) * 1000) }}</div>
            </template>
        </BaseTable>
        <AddManyDiscount ref="addManyDiscountRef"></AddManyDiscount>
    </div>
</template>

<script setup>
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { columns } from './columns';
import {
    lazadaFlexicomboList,
    accountCache,
    flexiComboActivateVoucher,
    flexiComboDeactivateVoucher,
    syncLazadaShopFlexiVoucher
} from './api';
import Search from './components/search.vue';
import { Timedata } from '~@/pages/lazada/manyDiscount/common/util.js';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import AddManyDiscount from './components/addManyDiscount/index.vue';

const { singleDisabled, multipleDisabled, rowSelection, selectedRowKeys, tableRow, clearSelection } = useTableSelection();
const shortCode = ref('');
const account = ref([]);
const activateLoading = ref(false); // 激活 loading
const deactivateVoucherLoading = ref(false); //暂停loading
const syncLazadaShopLoading = ref(false); // 同步loading
const baseTableEl = useTemplateRef('baseTableRef');
const addManyDiscountEl = useTemplateRef('addManyDiscountRef');

const initSearchParam = {
    prop: 'create_time',
    order: 'desc'
};
// 查询
const handleSearch = async (state) => {
    await baseTableEl.value.search(state);
};

const reload = async (state) => {
    await baseTableEl.value.reload();
};

const handleAdd = () => {
    addManyDiscountEl.value.open();
};
const activate = () => {
    let activateVoucherList = []
    selectedRowKeys.forEach((item) => {
        activateVoucherList.push(item.id)
    })
    let data = {
        shortCode: this.shortCode,
        flexiComboId: activateVoucherList.join()
    }
    activateLoading.value = true
    flexiComboActivateVoucher(data).then(res => {
        if (res.code === 200) {
            message.success(res.message)
        }
        else {
            message.error(res.message)
        }
    }).finally(() => {
        activateLoading.value = false
        reload()
    })
};
const deactivateVoucher = () => {
    let activateVoucherList = []
    selectedRowKeys.forEach((item) => {
        activateVoucherList.push(item.id)
    })
    let data = {
        shortCode: this.shortCode,
        flexiComboId: activateVoucherList.join()
    }
    deactivateVoucherLoading.value = true
    flexiComboDeactivateVoucher(data).then(res => {
        if (res.code === 200) {
            message.success(res.message)
        }
        else {
            message.error(res.message)
        }
    }).finally(() => {
        deactivateVoucherLoading.value = false
        reload()
    })
};
const syncLazadaShopVoucher = () => {
    syncLazadaShopLoading.value = true
    let data = {
        shortCode: shortCode.value
    }
    syncLazadaShopFlexiVoucher(data).then(res => {
        if (res.code === 200) {
            message.success(res.message)
        }
        else {
            message.error(res.message)
        }
    }).finally(() => {
        syncLazadaShopLoading.value = false
        reload()
    })
};

onMounted(async () => {
    const accountCacheRes = await accountCache();
    if (accountCacheRes.code === 200) {
        let codes = [];
        for (const resKey in accountCacheRes.data.accountDetail) {
            codes.push(...accountCacheRes.data.accountDetail[resKey])
        };
        account.value = codes;
        shortCode.value = codes[0].shortCode;
    };
});


</script>

<style scoped></style>