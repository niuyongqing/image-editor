<template>
    <div id="productListCont">
        <a-modal :open="prodListVisible" :maskClosable="false" @cancel="handleCancel" :width="'50%'" :keyboard="false"
            title="合并产品" :footer="null">
            <a-table :columns="columns" :data-source="childList" :pagination="false" :scroll="{ y: 600 }">
                <template #bodyCell="{ column, record }">
                    <div v-if="column.dataIndex === 'name'" class="flex">
                        <div class="flex text-left items-center">
                            <a-image style="width: 100px; height: 100px;" :src="record.primaryImage ? record.primaryImage[0] : record.images[0]
                                ">
                            </a-image>
                            <div style="margin-left: 10px; display: block">
                                <a-tooltip class="item">
                                    <template #title>
                                        <span>{{ record.name }}</span>
                                    </template>
                                    <div class="w-50 truncate">{{ record.name }}</div>
                                </a-tooltip>
                                <div style="color: #999; float: left">
                                    产品ID：<a style="color: #1677ff" href="#" @click="jumpTo(record.id)">{{
                                        record.id }}</a>
                                </div>
                                <br />
                                <div style="color: #999; float: left">
                                    店铺: {{ record.simpleName }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="column.dataIndex === 'sku'">
                        {{ record.offerId }}
                    </div>
                    <div v-if="column.dataIndex === 'state'">
                        <a-tag :bordered="false" :color="getStateColor(record.state)">
                            {{ record.state || ' ' }}
                        </a-tag>
                    </div>
                    <div v-if="column.dataIndex === 'stock'">
                        <a-tooltip style="margin-right: 10px" effect="dark" placement="top" v-if="record.warehouse">
                            <template #title>
                                <div v-for="(item, index) in record.warehouse" :key="index">
                                    <span>{{ item.warehouseName }}</span>:
                                    <span>{{ item.present ? item.present : 0 }}</span>
                                </div>
                            </template>
                            <span style="color: #1677ff">{{ record.stock }}</span>
                        </a-tooltip>
                        <span v-else style="color: #1677ff; margin-right: 10px">{{
                            record.stock
                            }}</span>
                    </div>
                </template>
            </a-table>
        </a-modal>
    </div>
</template>

<script setup name='productList'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
const props = defineProps({
    prodListVisible: Boolean,
    childList: Array,
});
const emit = defineEmits(["handleProductListClose"]);
const columns = [
    {
        title: "标题/产品ID",
        dataIndex: "name",
        align: "center",
        width: 400
    },
    {
        title: "SKU",
        dataIndex: "sku",
        align: "center",
    },
    {
        title: "售价",
        dataIndex: "price",
        align: "center",
    },
    {
        title: "原价",
        dataIndex: "oldPrice",
        align: "center",
    },
    {
        title: "总库存",
        dataIndex: "stock",
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "state", // state
        align: "center",
    },
]

const getStateColor = (state) => {
    const colorMap = {
        '平台审核': 'processing',
        '在售': 'success',
        '审核不通过': 'warning',
        '准备出售': 'error',
        '': 'default'
    };
    return colorMap[state] || 'default';
}
const handleCancel = () => {
    emit("handleProductListClose")
}
</script>
<style lang="less" scoped></style>