<template>
    <div id="storeManagementCont">
        <a-card style="margin-top: 10px">
            <a-form ref="ruleForm" :label-col="labelCol" :model="formData" class="form-padding">
                <a-form-item name="account" label="店铺：">
                    <!-- <a-select v-model:value="formData.account" style="width: 200px" :options="shopAccount">
                    </a-select> -->
                    <selectComm :options="shopAccount" style="margin-left: 10px" :fieldObj="shopObj" @backSelectAll="shopSelectAll"
                        @backSelectItem="shopSelectItem"></selectComm>
                </a-form-item>
                <a-form-item name="name" label="仓库名称：">
                    <a-input v-model:value="formData.name" placeholder="仓库名称"
                        style="width: 200px;display: flex;margin-left: 10px;"></a-input>
                </a-form-item>
                <a-form-item name="status" label="仓库状态：">
                    <!-- <a-select v-model:value="formData.status" style="width: 200px" :options="storeOptions"
                        placeholder="请选择">
                    </a-select> -->
                    <selectComm style="margin-left: 10px" :options="storeOptions" :fieldObj="statusObj"
                        @backSelectAll="statusSelectAll" @backSelectItem="statusSelectItem"></selectComm>
                </a-form-item>
                <a-form-item>
                    <div style="width: 200px;display: flex;margin-left: 80px;">
                        <a-button type="primary" @click="onSubmit()">查询</a-button>
                        <a-button style="margin-left: 10px;" @click="resetForm('ruleForm')">重置</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card style="margin: 10px 0">
            <a-row style="margin: 10px">
                <a-col :span="1.5">
                    <a-button type="primary" @click="syncOrder" :loading="syncLoading">同步仓库数据</a-button>
                </a-col>
                <a-col :span="1.5">
                    <a-button type="primary" style="margin-left: 10px" @click="syncStore"
                        :loading="exportLoading">同步仓库方式信息</a-button>
                </a-col>
            </a-row>

            <a-table :pagination="false" class="pages" :loading="loading" :data-source="tableData" bordered
                :columns="columns">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'status'">
                        <span>{{ getChineseLabelByValue(record.status) }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'option'">
                        <a-button @click="edit(record)">查看物流方式</a-button>
                    </template>
                </template>
            </a-table>
            <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
                :total="paginations.total" v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize"
                :defaultPageSize="50" :showSizeChanger="true" @change="getList"
                :pageSizeOptions="[50, 100, 200]"></a-pagination>
        </a-card>
        <showModal :showOpen="showOpen" :tabRow="tabRow" @backClose="backClose"></showModal>
    </div>
</template>

<script setup name='storeManagement'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { accountCache } from "../config/api/product";
import { warehouseList, warehouse, syncDelivery } from "../config/api/storeManagement";
import tableHead from "../config/tabColumns/storeManagement"
import showModal from './comm/showModal.vue';
import { message } from "ant-design-vue";
import { storeStatus } from "../config/commDic/defDic"
const ruleForm = ref(null)
const formData = reactive({
    name: "",
    status: "",
    account: "",
})
const labelCol = {
    style: {
        width: '70px',
    },
};
const shopAccount = ref([])
const storeOptions = storeStatus
const loading = ref(false)
const syncLoading = ref(false)
const exportLoading = ref(false)
const showOpen = ref(false)
const tableData = ref([])
const tabRow = ref({})
const columns = tableHead
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
})
const shopObj = {
    fieldKey: "value",
    fieldLabel: "label",
}
const statusObj = {
    fieldKey: "value",
    fieldLabel: "label",
}
const edit = (row) => {
    showOpen.value = true
    tabRow.value = row
}
const backClose = () => {
    showOpen.value = false
}
const getChineseLabelByValue = (targetValue) => {
    return storeOptions.find(item => item.value === targetValue)?.label || "";
}

const shopSelectAll = () => {
    formData.account = ""
    getList();
}
const shopSelectItem = (val) => {
    formData.account = val
    getList();
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
            formData.account = res?.data[0].account ?? "";
            getList()
        }
    });
}
const onSubmit = () => { getList() }

const resetForm = () => {
    ruleForm.value.resetFields();
    formData.account = shopAccount.value[0].value
    getList();
}

const syncOrder = () => {
    syncLoading.value = true;
    warehouse().then((res) => {
        message.success(res.msg);
        getList();
    }).finally(() => {
        syncLoading.value = false;
    });
}

const syncStore = () => {
    exportLoading.value = true
    syncDelivery().then(res => {
        message.success(res.msg);
        getList()
    }).finally(() => {
        exportLoading.value = false;
    })
}

const getList = () => {
    loading.value = true;
    let params = {
        ...formData,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize,
    }
    warehouseList(params)
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