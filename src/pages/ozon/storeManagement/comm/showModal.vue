<template>
    <a-modal :open="showOpen" :maskClosable="false" :width="'40%'" :keyboard="false" title="查看物流方式" @ok="handleCancel"
        @cancel="handleCancel">
        <!-- :columns="columns" -->
        <a-table :data-source="tableData" :columns="columns" bordered style="width: 100%">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'status'">
                    <span>{{ statusObj[record.status] }}</span>
                </template>
            </template>
        </a-table>
    </a-modal>
</template>

<script setup name='showModal'>
import { ref, reactive, onMounted, computed, watchPostEffect, watch } from 'vue'
import { deliveryList } from "../../config/api/storeManagement";

const props = defineProps({
    showOpen: Boolean,
    tabRow: Object,
});
const statusObj = {
    "NEW": "已创建",
    "EDITED": "正在编辑",
    "ACTIVE": "已激活",
    "DISABLED": "未激活",
}

const emit = defineEmits(["backClose"]);
const columns = [
    {
        title: "卖家识别号",
        dataIndex: "companyId",
        align: "center",
    },
    {
        title: "快递方式名称",
        dataIndex: "name",
        align: "center",
    },
    {
        title: "状态",
        dataIndex: "status",
        align: "center",
    },
    {
        title: "创建时间",
        dataIndex: "createdAt",
        align: "center",
    }
]
const tableData = ref([])

const handleCancel = () => {
    emit("backClose");
}
const getList = () => {
    let params = {
        warehouseId: props.tabRow.warehouseId,
        account: props.tabRow.account,
    };
    deliveryList(params).then((res) => {
        tableData.value = res?.rows || [];
    });
}
watchEffect(() => {
    if (JSON.stringify(props.tabRow) !== "{}") {
        getList();
    }
});
</script>
<style lang="less" scoped></style>