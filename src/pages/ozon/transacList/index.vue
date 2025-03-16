<template>
    <div id="transacListCont">
        <a-card style="margin-top: 10px;">
            <a-form :layout="'inline'" ref="ruleForm" :model="formData">
                <a-form-item label="店铺：" name="account">
                    <a-select v-model:value="formData.account" style="width: 200px" placeholder="请选择店铺"
                        :options="shopAccount"></a-select>
                </a-form-item>
                <a-form-item label="状态：">
                    <a-select v-model:value="formData.type" valueFormat="YYYY-MM-DD HH:mm:ss" style="width: 200px"
                        :options="typeList"></a-select>
                </a-form-item>
                <a-form-item label="时间：" name="times">
                    <a-range-picker v-model:value="formData.times" valueFormat="YYYY-MM-DD HH:mm:ss"
                        style="width: 300px" @change="handlerChange">
                    </a-range-picker>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="onSubmit">查询</a-button>
                    <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card style="margin: 10px 0">
            <a-row style="margin: 10px">
                <a-col :span="1.5">
                    <a-button type="primary" @click="syncOrder" :loading="syncLoading"
                        v-has-permi="[`system:platform:ozon:transaction:sync`]">同步财务数据</a-button>
                </a-col>
                <a-col :span="1.5">
                    <a-button type="primary" style="margin-left: 10px" @click="toExport" :loading="exportLoading"
                        v-has-permi="[`system:platform:ozon:transaction:export`]">导出财务数据</a-button>
                </a-col>
            </a-row>

            <a-table :pagination="false" class="pages" :loading="loading" :data-source="tableData" bordered
                :columns="columns">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'type'">
                        <span>{{ getChineseLabelByValue(record.type) }} </span>
                    </template>
                    <template v-if="column.dataIndex === 'accrualsForSale'">
                        <span>{{ record.accrualsForSale }} ₽</span>
                    </template>
                    <template v-if="column.dataIndex === 'saleCommission'">
                        <span>{{ record.saleCommission }} ₽</span>
                    </template>
                    <template v-if="column.dataIndex === 'returnDeliveryCharge'">
                        <span>{{ record.returnDeliveryCharge }} ₽</span>
                    </template>
                    <template v-if="column.prop === 'deliveryCharge'">
                        <span>{{ record.deliveryCharge }} ₽</span>
                    </template>
                    <template v-if="column.prop === 'amount'">
                        <span>{{ record.amount }} ₽</span>
                    </template>
                </template>
            </a-table>
            <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
                :total="paginations.total" v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize"
                :defaultPageSize="50" :showSizeChanger="true" @change="getList"
                :pageSizeOptions="[50, 100, 200]"></a-pagination>
        </a-card>
        <a-modal v-model:open="expType" title="导出文件格式选择" @cancel="exportTypes = false" @ok="handleOk"
            :maskClosable="false" :keyboard="false" :destroyOnClose="true" :width="'15%'">
            <a-select ref="select" v-model:value="exportTypes" class="w-50 mt-5">
                <a-select-option :value="0">.excel</a-select-option>
                <a-select-option :value="1">.csv</a-select-option>
            </a-select>
        </a-modal>
    </div>
</template>

<script setup name='transacList'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import tableHead from "../config/tabColumns/transacList"
import { accountCache } from "../config/api/product"
import { transactionList, syncTransaction, exportTransaction } from "../config/api/financial";
import { tradStatus } from "../config/commDic/defDic"
import { message } from "ant-design-vue";
import download from '@/api/common/download'
const ruleForm = ref(null)
const formData = reactive({
    order: "desc",
    prop: "operation_date",
    account: "",
    type: "",
    times: [],
    to: "",
    from: ""
})
const typeList = tradStatus
const columns = tableHead
const shopAccount = ref([])
const tableData = ref([])
const loading = ref(false)
const syncLoading = ref(false)
const exportLoading = ref(false)
const expType = ref(false)
const exportTypes = ref(1)
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
})
const handlerChange = (dates, dateStrings) => {
    //开始结束时间
    if (formData.times !== null && formData.times.length > 0) {
        formData.from = dates[0];
        formData.to = dates[1];
    } else {
        formData.from = "";
        formData.to = "";
    }
}
// 获取店铺列表
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            shopAccount.value = res?.data.map(item => {
                return {
                    label: item.simpleName,
                    value: item.account
                }
            }) || [];
            formData.account = res?.data[0].account || "";
            getList()
        }
    });
}
const syncOrder = () => {
    console.log("searchData", formData);
    if (!formData.from && !formData.to) {
        message.error("请先选择时间后同步！");
        return;
    }
    const { account, to, from } = formData;
    let params = {
        account,
        to,
        from,
    };
    syncLoading.value = true;
    syncTransaction(params)
        .then((res) => {
            message.success("同步成功！");
            getList()
        })
        .finally(() => {
            syncLoading.value = false;
        });
}
const toExport = () => {
    if (!formData.from && !formData.to) {
        message.error("请先选择时间后导出！");
        return;
    }
    expType.value = true
}

const handleOk = () => {
    const { account, from, to } = formData;
    let params = {
        account,
        from,
        to,
        exportFileType: exportTypes.value
    };
    exportLoading.value = true;
    exportTransaction(params).then((res) => {
        download.name(res.msg);
        message.success("下载任务已开始！请耐心等待完成");
    })
        .finally(() => {
            exportLoading.value = false;
        });
}

const onSubmit = () => {
    getList()
}
const getChineseLabelByValue = (targetValue) => {
    return typeList.find(item => item.value === targetValue)?.label || "";
}
const resetForm = () => {
    formData.to = ""
    formData.from = ""
    formData.times = []
    formData.type = "";
    formData.account = shopAccount.value[0].value
    getList()
}
const getList = () => {
    loading.value = true;
    let params = {
        ...formData,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize
    }
    transactionList(params)
        .then((res) => {
            tableData.value = res?.rows ?? [];
            paginations.total = res?.total ?? 0;
        })
        .finally(() => {
            loading.value = false;
        });
}

onMounted(() => {
    getAccount()

})
</script>
<style lang="less" scoped></style>