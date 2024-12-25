<template>
    <div id="promotionCont">
        <a-card style="margin-top: 0; padding: 0">
            <a-form ref="ruleForm" :layout="'inline'" :model="formState" class="form-padding">
                <a-form-item label="店铺：">
                    <a-select v-model:value="formState.account" style="width: 200px" :options="shopAccount">
                    </a-select>
                </a-form-item>
                <a-form-item label="活动名称：">
                    <a-input v-model:value="formState.title" placeholder="请输入活动名称" clearable></a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="onSubmit()">查询</a-button>
                    <a-button style="margin-left: 10px" @click="resetForm()">重置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card style="margin: 10px 0">
            <a-row style="margin: 10px">
                <a-col :span="1.5">
                    <a-button type="primary" @click="syncOrder" :loading="syncLoading"
                        v-has-permi="[`platform:ozon:activity:sync`]">同步全部活动</a-button>
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
                :total="paginations.total" show-quick-jumper v-model:current="paginations.pageNum"
                v-model:pageSize="paginations.pageSize" :defaultPageSize="50" :showSizeChanger="true" @change="getList"
                :pageSizeOptions="[50, 100, 200]"></a-pagination>
        </a-card>
    </div>
</template>

<script setup name='promotion'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { accountCache } from "../config/api/product";
import tableHead from "../config/tabColumns/promotion"
import { syncActivity, list } from "../config/api/promotion"
const formState = reactive({
    account: "",
    title: ""
})
const shopAccount = ref([])
const shortCode = ref("")
const tableData = ref([])
const columns = tableHead
const loading = ref(false)
const syncLoading = ref(false)
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
})

// 获取店铺列表
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            shopAccount.value = res?.data.map(item => {
                return {
                    label: item.simpleName,
                    value: item.account
                }
            }) ?? [];
            formState.account = res?.data[0].account ?? "";
        }
    });
}
const onSubmit = () => { getList() }

const restForm = () => {
    formRef.value.resetFields();
    formState.account = shopAccount.value[0].account ?? "";
    getList();
}

const syncOrder = () => {

    //   dialogTableVisible.value = true;
    syncLoading.value = true;
    let params = {
        startDate: formState.startDate,
        endDate: formState.endDate,
    };
    syncActivity(params)
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
const getList = () => {
    loading.value = true;
    let params = {
        ...formState,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize,
    }
    list(params).then((res) => {
        tableData.value = res?.rows || [];
        paginations.total = res?.total || 0;
    }).finally(() => {
        loading.value = false;
    });
}
onMounted(() => {
    getAccount()
})
</script>
<style lang="less" scoped></style>