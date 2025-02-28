<template>
    <div id="merchandCont">
        <a-card style="margin-top: 10px;">
            <a-form :layout="'inline'" ref="ruleForm" :model="formData">
                <a-form-item label="店铺：" name="account">
                    <a-select v-model:value="formData.account" style="width: 200px" placeholder="请选择店铺"
                        :options="shopAccount"></a-select>
                </a-form-item>
                <a-form-item label="时间：" name="times">
                    <a-date-picker v-model:value="formData.times" style="width: 200px" @change="handlerChange"
                        type="month" placeholder="选择月">
                    </a-date-picker>
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
                        v-has-permi="[`system:platform:ozon:product:sell:sync`]">同步财务数据</a-button>
                </a-col>
                <a-col :span="1.5">
                    <a-button type="primary" style="margin-left: 10px" @click="toExport" :loading="exportLoading"
                        v-has-permi="[`system:platform:ozon:product:sell:export`]">导出财务数据</a-button>
                </a-col>
            </a-row>

            <a-table :pagination="false" class="pages" :loading="loading" :data-source="tableData" bordered
                :columns="columns">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'pricePerInstance'">
                        <span>{{ record.pricePerInstance }} CNY</span>
                    </template>
                    <template v-if="column.dataIndex === 'bankCoinvestment'">
                        <span>{{ record.bankCoinvestment }} CNY</span>
                    </template>
                    <template v-if="column.dataIndex === 'amount'">
                        <span>{{ record.amount }} CNY</span>
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

<script setup name='merchand'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import tableHead from "../config/tabColumns/merchand"
import { accountCache } from "../config/api/product"
import { sellList, syncProductSell, exportProductSell } from "../config/api/financial";
import { message } from 'ant-design-vue';
import download from "~/api/common/download";

const ruleForm = ref(null)
const formData = reactive({
    order: "desc",
    prop: "operation_date",
    account: "",
    times: "",
    month: "",
    year: ""
})
const columns = tableHead
const shopAccount = ref([])
const tableData = ref([])
const loading = ref(false)
const syncLoading = ref(false)
const exportLoading = ref(false)
const expType = ref(false)
const exportTypes = ref()
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
})

const onSubmit = () => {
    getList()
}
const resetForm = () => {
    formData.month = ""
    formData.year = ""
    formData.times = ""
    formData.account = shopAccount.value[0].value
    getList()
}

const handlerChange = (dates, dateStrings) => {
    //开始结束时间
    if (formData.times !== null && formData.times !== "") {
        let parts = dateStrings.split("-");
        formData.year = parts[0];
        formData.month = parts[1];
    } else {
        formData.year = "";
        formData.month = "";
    }
}

const syncOrder = () => {
    if (!formData.month && !formData.year) {
        message.error("请先选择时间后同步！");
        return;
    }
    const { account, month, year } = formData;
    let params = {
        account,
        month,
        year,
    };
    syncLoading.value = true;
    syncProductSell(params)
        .then((res) => {
            message.success("同步成功！");
        })
        .finally(() => {
            syncLoading.value = false;
            formData.month = ""
            formData.year = ""
            formData.times = ""
            getList()
        });
}
const toExport = () => {
    if (!formData.month && !formData.year) {
        message.error("请先选择时间后导出！");
        return;
    }
    expType.value = true
}

const handleOk = () => {
    const { account, month, year } = formData;
    let params = {
        account,
        month,
        year,
        exportFileType: exportTypes.value
    };
    exportLoading.value = true;
    exportProductSell(params).then((res) => {
        download.name(res.msg);
        message.success("下载任务已开始！请耐心等待完成");
    })
        .finally(() => {
            exportLoading.value = false;
        });
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
const getList = () => {
    loading.value = true;
    let params = {
        ...formData,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize
    }
    sellList(params)
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