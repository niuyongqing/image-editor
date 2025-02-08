<template>
    <div>
        <Search @search="handleSearch" :shop="shop" ref="searchRef"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="orderList" :immediate="true"
            :init-search-param="initSearchParam" :scrollX="3000">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" v-has-permi="['platform:lazada:order:sync']" @click="syncLazada">
                        <SyncOutlined />
                        同步数据
                    </a-button>
                    <a-button type="primary" v-has-permi="['platform:lazada:order:export']" @click="orderDownload"
                        :loading="orderDownloadLoading">
                        <CloudDownloadOutlined /> 导出
                    </a-button>
                </a-space>
            </template>
            <template #orderItemId="{ record }">
                {{ record.orderItem.orderItemId }}
            </template>
            <template #taxAmount="{ record }">
                {{ record.orderItem.taxAmount }}
            </template>
            <template #voucherSeller="{ record }">
                {{ record.orderItem.voucherSeller }}
            </template>
            <template #paidPrice="{ record }">
                {{ record.orderItem.paidPrice }}
            </template>
            <template #supplyPrice="{ record }">
                {{ record.orderItem.supplyPrice }}
            </template>
            <template #voucherSellerLpi="{ record }">
                {{ record.orderItem.voucherSellerLpi }}
            </template>
            <!-- <template #shippingFeeDiscountPlatform="{ record }">
                {{ record.orderItem.shippingFeeDiscountPlatform }}
            </template> -->
            <template #walletCredits="{ record }">
                {{ record.orderItem.walletCredits }}
            </template>
            <template #currency="{ record }">
                {{ record.orderItem.currency }}
            </template>
            <template #shippingProviderType="{ record }">
                {{ record.orderItem.shippingProviderType }}
            </template>
            <template #voucherPlatformLpi="{ record }">
                {{ record.orderItem.voucherPlatformLpi }}
            </template>
            <template #shippingFeeOriginal="{ record }">
                {{ record.orderItem.shippingFeeOriginal }}
            </template>
            <template #itemPrice="{ record }">
                {{ record.orderItem.itemPrice }}
            </template>
            <template #isDigital="{ record }">
                {{ record.orderItem.isDigital }}
            </template>
            <template #shippingFeeDiscountSeller="{ record }">
                {{ record.orderItem.shippingFeeDiscountSeller }}
            </template>
            <template #shippingAmount="{ record }">
                {{ record.orderItem.shippingAmount }}
            </template>

            <template #returnStatus="{ record }">
                {{ record.orderItem.returnStatus }}
            </template>
            <template #semiManaged="{ record }">
                {{ record.orderItem.semiManaged }}
            </template>
            <template #voucherAmount="{ record }">
                {{ record.orderItem.voucherAmount }}
            </template>
            <template #supplyPriceCurrency="{ record }">
                {{ record.orderItem.supplyPriceCurrency }}
            </template>
            <template #shippingFeeDiscountPlatform="{ record }">
                {{ record.orderItem.shippingFeeDiscountPlatform }}
            </template>
            <template #paymentMethod="{ record }">
                {{ record.orderItem.paymentMethod }}
            </template>
            <template #status="{ record }">
                {{ record.orderItem.status }}
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
import { orderList, shopList, orderExport } from './api';
import Sync from './components/sync.vue';
import { message } from 'ant-design-vue';
import download from '@/api/common/download';

const tableHeight = ref(0); // 表格高度
const initSearchParam = {
    order: 'desc',
    prop: "created_at"
};
const orderDownloadLoading = ref(false);
const baseTableEl = useTemplateRef('baseTableRef');
const syncEl = useTemplateRef('syncRef');
const searchEl = useTemplateRef('searchRef');

const handleSearch = (param) => {
    baseTableEl.value.search(param);
};
const shop = ref([]);
const getShop = () => {
    shopList().then(res => {
        shop.value = res.data || []
    })
};

const syncLazada = () => {
    syncEl.value.open()
};

const orderDownload = () => {
    const searchData = searchEl.value.formData;
    if (!searchData.time.length) {
        message.error("下单时间不能为空");
        return
    };
    if (!searchData.county) {
        message.error("站点不能为空");
        return
    };
    orderDownloadLoading.value = true;
    let data = {
        simpleName: searchData.simpleName,
        county: searchData.county,
        sellerId: searchData.sellerId,
        orderId: searchData.orderId,
        status: searchData.status,
        createTimeStart: searchData.time[0].format("YYYY-MM-DD HH:mm:ss"),
        createTimeEnd: searchData.time[1].format("YYYY-MM-DD HH:mm:ss")
    }
    orderExport(data).then(res => {
        message.success("执行下载成功，请等待文件下载完成！勿重复操作");
        download.name(res.msg)
    }).finally(() => {
        orderDownloadLoading.value = false
    })
};

onMounted(() => {
    getShop()
});

</script>

<style scoped></style>