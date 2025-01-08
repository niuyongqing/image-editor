<template>
    <div>
        <Search :account="account" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam"
            :row-selection="rowSelection" :show-right-pagination="false" rowKey="id" :immediate="false">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" @click="add">新增</a-button>
                    <a-button type="primary" @click="add">激活</a-button>
                    <a-button type="primary" @click="add">暂停</a-button>
                    <a-button type="primary" @click="add">同步店铺优惠卷</a-button>
                </a-space>
            </template>



        </BaseTable>
    </div>
</template>

<script setup>
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { getList, accountCache } from './api';
import { columns } from './columns';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import Search from './components/search.vue';

const initSearchParam = {
    prop: "create_time",
    order: "desc"
};
const { singleDisabled, rowSelection, tableRow, clearSelection } = useTableSelection();
const baseTableEl = useTemplateRef('baseTableRef');
const account = ref([]);
// 查询
const handleSearch = async (state) => {
    await baseTableEl.value.search(state);
};

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