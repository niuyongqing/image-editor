<template>
    <div>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam">
        </BaseTable>
    </div>
</template>

<script setup>
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { columns } from './columns';
import { getList, accountCache } from './api';
</script>

<style scoped></style>