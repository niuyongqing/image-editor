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
                    <template v-if="column.dataIndex === 'state'">
                        <div>{{ statusObj[record.state] }}</div>
                    </template>
                    <template v-if="column.dataIndex === 'createdAt'">
                        <div>
                            <div><span>开始: </span>{{ record.dateStart }}</div>
                            <div><span>结束：</span>{{ record.dateEnd }}</div>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'option'">
                        <a-button v-if="record.state !== '2'" type="text" v-has-permi="[`platform:ozon:activity:list`]"
                            @click="mActivity(row)">管理活动</a-button>
                        <a-button @click.stop="syncOne(record)" type="text"
                            v-has-permi="[`platform:ozon:activity:sync:action:product`]"
                            style="color: #67c23a; margin-left: 10px" v-if="record.state !== '2'">同步</a-button>
                    </template>
                </template>
            </a-table>
            <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
                :total="paginations.total" show-quick-jumper v-model:current="paginations.pageNum"
                v-model:pageSize="paginations.pageSize" :defaultPageSize="50" :showSizeChanger="true" @change="getList"
                :pageSizeOptions="[50, 100, 200]"></a-pagination>
        </a-card>
        <addPromotionModal :editnameType="editnameType" :activeRow="activeRow" @handelClose="editnameType = false">
        </addPromotionModal>
    </div>
</template>

<script setup name='promotion'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { accountCache } from "../config/api/product";
import tableHead from "../config/tabColumns/promotion"
import { syncActivity, list, syncOneProduct } from "../config/api/promotion"
import addPromotionModal from './comm/addPromotionModal.vue';
import { message } from 'ant-design-vue';
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
const editnameType = ref(false)
const activeRow = ref({})
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
})
const statusObj = {
    0: "未开始",
    1: "进行中",
    2: "已结束",
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
            }) ?? [];
            formState.account = res?.data[0].account ?? "";
            getList();
        }
    });
}
const onSubmit = () => { getList() }

const restForm = () => {
    formRef.value.resetFields();
    formState.account = shopAccount.value[0].account ?? "";
    getList();
}

const mActivity = (row) => {
    editnameType.value = true
    activeRow.value = row
}

const syncOne = (row) => {
    syncOneProduct({
        account: row.sellerId,
        activityId: row.id,
    }).then((res) => {
        message.success("同步成功");
    });
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