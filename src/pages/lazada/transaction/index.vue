<template>
    <div>
        <Search @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="myIncomeList" :immediate="false"
            :init-search-param="initSearchParam">

        </BaseTable>

    </div>
</template>

<script setup>
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { columns } from './columns';
import { myIncomeList, shopList } from './api';

const initSearchParam = {};
const shop = ref([]);

const baseTableEl = useTemplateRef('baseTableRef');

const handleSearch = (param) => {
    baseTableEl.value.search(param);
};
const getShop = () => {
    shopList().then(res => {
        shop.value = res.data || []
    })
};

onMounted(() => {
    getShop()
});

</script>

<style scoped></style>