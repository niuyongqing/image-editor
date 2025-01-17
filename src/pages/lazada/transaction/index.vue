<template>
    <div>
        <Search @search="handleSearch" ref="searchRef"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="myIncomeList" :immediate="false"
            :init-search-param="initSearchParam">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" @click="syncLazada">
                        <SyncOutlined />
                        同步数据
                    </a-button>
                    <a-button type="primary" @click="downloadTable" :loading="myIncomeDownloadLoading">
                        <CloudDownloadOutlined /> 导出
                    </a-button>
                </a-space>
            </template>
        </BaseTable>

        <Sync ref="syncRef"></Sync>
    </div>
</template>

<script setup>
import { SyncOutlined, CloudDownloadOutlined } from '@ant-design/icons-vue';
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { columns } from './columns';
import { myIncomeList, shopList, myIncomeDownload } from './api';
import Sync from './components/sync.vue';
import { message } from "ant-design-vue";

const myIncomeDownloadLoading = ref(false);
const initSearchParam = {
    order: "desc",
    prop: "create_time",
};
const shop = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const searchEl = useTemplateRef('searchRef');
const syncEl = useTemplateRef('syncRef');

//  同步数据
const syncLazada = () => {
    syncEl.value.open();
};

const downloadTable = () => {
    const searchData = searchEl.value.formData;
    if (!searchData.time.length) {
        message.error("时间不能为空");
        return
    };
    if (!searchData.county) {
        message.error("站点不能为空");
        return
    };
    myIncomeDownloadLoading.value = true;
    let data = {
        "simpleName": searchData.simpleName,
        "county": searchData.county,
        sellerSkus: searchData.sellerSkus,
        "sellerId": searchData.sellerId,
        orderNo: searchData.orderNo,
        transactionNumber: searchData.transactionNumber,
        startTime: searchData.time[0].format("YYYY-MM-DD HH:mm:ss"),
        endTime: searchData.time[1].format("YYYY-MM-DD HH:mm:ss")
    }
    myIncomeDownload(data).then(res => {
        message.success("执行下载成功，请等待文件下载完成！勿重复操作");
        download.name(res.msg)
    }).finally(() => {
        myIncomeDownloadLoading.value = false
    })

};

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