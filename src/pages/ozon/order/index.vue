<template>
    <div id="orderCont">
        <a-card style="margin-top: 20px">
            <a-tabs v-model:activeKey="activeKey" type="card" @change="handleTabchange">
                <a-tab-pane :key="1" tab="120天内订单"></a-tab-pane>
                <a-tab-pane :key="2" tab="历史订单"></a-tab-pane>
            </a-tabs>
            <a-form :model="formState" ref="formRef" :label-col="labelCol">
                <a-form-item label="店铺：">
                    <!-- <a-select v-model:value="formState.account" style="width: 200px" :options="shopAccount">
                    </a-select> -->
                    <selectComm style="margin-left: 10px" :options="shopAccount" :fieldObj="shopObj"
                        @backSelectAll="selectAll" @backSelectItem="selectItem"></selectComm>
                </a-form-item>
                <a-form-item label="订单号：">
                    <a-input v-model:value="formState.orderId" style="width: 200px;display: flex;margin-left: 10px;"></a-input>
                </a-form-item>
                <a-form-item label="货件编号：">
                    <a-input v-model:value="formState.postingNumber" style="width: 200px;display: flex;margin-left: 10px;"></a-input>
                </a-form-item>
                <a-form-item label="订单状态：">
                    <!-- <a-select v-model:value="formState.status" style="width: 200px" :options="statusList"
                        placeholder="请选择">
                    </a-select> -->
                    <selectComm style="margin-left: 10px" :options="statusList" :fieldObj="staObj"
                        @backSelectAll="statusSelectAll" @backSelectItem="statusSelectItem"></selectComm>
                </a-form-item>
                <a-form-item label="订单时间：">
                    <a-range-picker :format="'YYYY-MM-DD MM:HH:ss'" style="width: 300px;display: flex;margin-left: 10px;" v-model:value="formState.time"
                        @change="handlerChange" />
                </a-form-item>
                <a-form-item>
                    <div style="width: 200px;display: flex;margin-left: 80px;">
                        <a-button type="primary" @click="onSubmit">查询</a-button>
                        <a-button style="margin-left: 10px" @click="restForm">重置</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card style="margin: 10px 0">
            <a-row style="margin: 10px">
                <a-col :span="1.5">
                    <a-button type="primary" @click="syncOrder" :loading="syncLoading"
                        v-has-permi="[`platform:ozon:order:sync`]">同步所有订单</a-button>
                </a-col>
                <a-col :span="1.5">
                    <a-button type="primary" style="margin-left: 10px" @click="toExport" :loading="exportLoading"
                        v-has-permi="[`platform:ozon:order:export`]">导出订单</a-button>
                </a-col>
            </a-row>

            <a-table :pagination="false" class="pages" :loading="loading" :data-source="tableData" bordered
                :columns="columns">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'status'">
                        <span>{{ statusObj[record.status] }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'products'">
                        <div v-for="(item, index) in record.products" :key="index">
                            <span>{{ item.offerId }}</span>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'customer'">
                        <span>{{ record.customer && record.customer.name }}</span>
                        <span style="margin-left: 10px">[俄罗斯] </span>
                    </template>
                    <template v-if="column.dataIndex === 'inProcessAt'">
                        <div style="display: flex;flex-direction: column; align-items: flex-start;">
                            <div>
                                下单时间：<span style="color: #9e9f9e">{{
                                    record.inProcessAt
                                }}</span>
                            </div>
                            <div>
                                到期时间：<span style="color: #9e9f9e">{{
                                    record.shipmentDate
                                }}</span>
                            </div>
                        </div>
                    </template>
                </template>
            </a-table>
            <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
                :total="paginations.total" show-quick-jumper v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize"
                :defaultPageSize="50" :showSizeChanger="true" @change="getList"
                :pageSizeOptions="[50, 100, 200]"></a-pagination>
        </a-card>
    </div>
</template>

<script setup name='order'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import selectComm from "~/components/select-unwrap/selectComm.vue";
import { accountCache } from "../config/api/product";
import tableHead from "../config/tabColumns/order"
import { orderStatus } from "../config/commDic/defDic"
import { sync, orderExport, orderList } from "../config/api/order";
import download from "~/api/common/download";
import { message } from 'ant-design-vue';

const formRef = ref(null)
const formState = reactive({
    orderId: "",
    account: "",
    status: "",
    time: [],
    startDate: "",
    endDate: "",
    postingNumber: ""
})
const labelCol = {
  style: {
    width: '70px',
  },
};
const statusObj = {
    awaiting_registration: "等待注册",
    acceptance_in_progress: "正在验收",
    awaiting_approve: "等待确认",
    awaiting_packaging: "等待包装",
    awaiting_deliver: "等待装运",
    arbitration: "仲裁",
    client_arbitration: "快递客户仲裁",
    delivering: "运输中",
    driver_pickup: "司机处",
    delivered: "已送达",
    cancelled: "已取消",
    not_accepted: "分拣中心未接受",
    sent_by_seller: "由卖家发送",
}
const shopObj = ref({
    fieldKey: "value",
    fieldLabel: "label",
});
const staObj = ref({
    fieldKey: "value",
    fieldLabel: "label",
});
const activeKey = ref(1); // 默认120天内订单
const statusList = orderStatus
const percentage = ref(0)
const shopAccount = ref([])
const tableData = ref([])
const columns = tableHead
const loading = ref(false)
const syncLoading = ref(false)
const exportLoading = ref(false)
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
})

// 店铺全选和单选
const selectAll = () => {
    formState.account = ""
    getList();
}
const selectItem = (val) => {
    formState.account = val
    getList();
}
// tab切换
const handleTabchange = (activeKey) => {
    getList()
}

// 状态全选和单选
const statusSelectAll = () => {
    formState.status = ""
    getList();
}
const statusSelectItem = (val) => {
    formState.status = val
    getList();
}


// 店铺数据
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            shopAccount.value = res?.data?.map(item => {
                return {
                    label: item.simpleName,
                    value: item.account
                }
            }) ?? [];
            // formState.account = shopAccount.value[0].value
            getList()
        }
    });
}

const onSubmit = () => { getList() }

const restForm = () => {
    formRef.value.resetFields();
    formState.startDate = ""
    formState.endDate = ""
    getList();
}

const handlerChange = (date, dateString) => {
    console.log('ssss', date, dateString);

    //开始结束时间
    if (formState.time !== null && formState.time !== "") {
        formState.startDate = dateString[0];
        formState.endDate = dateString[1];
    } else {
        formState.startDate = "";
        formState.endDate = "";
    }
}

const syncOrder = () => {
    if (!formState.startDate || !formState.endDate) {
        message.error("请先选择时间段后同步！");
        return
    }
    //   dialogTableVisible.value = true;
    syncLoading.value = true;
    let params = {
        startDate: formState.startDate,
        endDate: formState.endDate,
    };
    sync(params)
        .then((res) => {
            percentage.value = 100;
        })
        .catch(() => {
            percentage.value = 0;
        })
        .finally(() => {
            syncLoading.value = false;
            //   dialogTableVisible.value = false;
            setTimeout(() => {
                percentage.value = 0;
            }, 300);
        });
}
const toExport = () => {
    if (!formState.startDate && !formState.endDate) {
        message.error("请先选择时间后导出！");
        return;
    }
    exportLoading.value = true;
    let params = {
        account: formState.account,
        orderId: formState.orderId,
        status: formState.status,
        startDate: formState.startDate,
        endDate: formState.endDate,
    };
    orderExport(params)
        .then((res) => {
            download.name(res.msg, true);
            message.success("下载任务已开始！请耐心等待完成");
        })
        .finally(() => {
            exportLoading.value = false;
        });
}

const getList = () => {
    loading.value = true;
    let params = {
        ...formState,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize,
    }
    orderList(params)
        .then((res) => {
            tableData.value = res?.rows || [];
            paginations.total = res?.total || 0;
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