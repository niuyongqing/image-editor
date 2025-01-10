<template>
    <div>
        <Search :account="account" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam"
            :row-selection="rowSelection" :show-right-pagination="false" rowKey="id" :immediate="false">
            <template #leftBar>
                <a-space>
                    <a-button type="primary" @click="handleAdd">
                        <PlusCircleOutlined /> 新增
                    </a-button>
                    <a-button type="primary" @click="handleEdit" :disabled="singleDisabled">
                        <EditOutlined /> 编辑
                    </a-button>
                    <a-button type="primary" @click="handleView" :disabled="singleDisabled">
                        <EyeOutlined /> 查看
                    </a-button>
                    <a-button type="primary" @click="settingProduct" :disabled="singleDisabled"
                        :loading="selectedProductListLoading">
                        <SettingOutlined /> 管理商品
                    </a-button>

                    <a-button type="primary" @click="activate" :disabled="multipleDisabled" :loading="activateLoading">
                        <CheckOutlined /> 激活
                    </a-button>

                    <a-button type="primary" @click="deactivate" :disabled="multipleDisabled"
                        :loading="deactivateVoucherLoading">
                        <StopOutlined />
                        暂停
                    </a-button>
                    <a-button type="primary" @click="syncLazadaVoucher" :disabled="multipleDisabled"
                        :loading="syncLoading">
                        <ReloadOutlined /> 同步优惠卷
                    </a-button>
                    <a-button type="primary" @click="syncLazadaShopVoucher" :loading="syncLazadaShopLoading">
                        <CloudSyncOutlined /> 同步店铺优惠卷
                    </a-button>
                </a-space>
            </template>
            <template #periodStartTime="{ record }">
                <div>
                    <div>从 {{ Timedata(parseFloat(record.periodStartTime)) }}</div>
                    <div>到 {{ Timedata(parseFloat(record.periodEndTime)) }}</div>
                </div>
            </template>
            <template #status="{ record }">
                <a-tag v-if="record.status == 'NOT_START'" color="blue">未开始</a-tag>
                <a-tag v-if="record.status == 'ONGOING'" color="green">进行中</a-tag>
                <a-tag v-if="record.status == 'SUSPEND'" color="red">暂停</a-tag>
                <a-tag v-if="record.status == 'FINISH'" color="orange">已过期</a-tag>
            </template>
            <template #syncTime="{ record }">
                <div>{{ Timedata(parseFloat(record.syncTime) * 1000) }}</div>
            </template>
        </BaseTable>
        <AddVoucher ref="addVoucherRef" @success="reload" :shortCode="shortCode" />
        <EditVoucher ref="editVoucherRef" @success="reload" :shortCode="shortCode" />
        <ViewVoucher ref="viewVoucherRef" @success="reload" />
        <ManageProduct ref="manageProductRef" @success="reload" :shortCode="shortCode" />
    </div>
</template>

<script setup>
import { PlusCircleOutlined, EditOutlined, EyeOutlined, SettingOutlined, CheckOutlined, StopOutlined, ReloadOutlined, CloudSyncOutlined } from '@ant-design/icons-vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { getList, activateVoucher, syncLazadaShopVoucherApi, syncLazadaVoucherApi, lazadaSellerVoucherUserAccount, deactivateVoucher, selectedProductListApi } from './api';
import { columns } from './columns';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import Search from './components/search.vue';
import { Timedata } from '~@/pages/lazada/regularCoupons/common/util.js';
import AddVoucher from './components/addVoucher.vue';
import EditVoucher from './components/editVoucher.vue';
import ViewVoucher from './components/viewVoucher.vue';
import ManageProduct from './components/manageProduct.vue';
import { message, Modal } from 'ant-design-vue';

const initSearchParam = {
    prop: "create_time",
    order: "desc"
};
const { singleDisabled, multipleDisabled, rowSelection, selectedRowKeys, selectedRows, tableRow, clearSelection } = useTableSelection();
const baseTableEl = useTemplateRef('baseTableRef');
const addVoucherEl = useTemplateRef('addVoucherRef');
const editVoucherEl = useTemplateRef('editVoucherRef');
const viewVoucherEl = useTemplateRef('viewVoucherRef');
const manageProductEl = useTemplateRef('manageProductRef');

const syncLoading = ref(false);// 同步 loading
const activateLoading = ref(false);// 激活loading
const deactivateVoucherLoading = ref(false);// 暂停loading
const syncLazadaShopLoading = ref(false);// 同步店铺loading
const selectedProductListLoading = ref(false);// 管理商品loading

const shortCode = ref('');
const account = ref([]);
const searchData = ref({});
// 查询
const handleSearch = async (state) => {
    searchData.value = state;
    await baseTableEl.value.search(state);
};

const reload = async (state) => {
    await baseTableEl.value.reload();
};

// 新增
const handleAdd = () => {
    addVoucherEl.value.open();
};

// 编辑
const handleEdit = () => {
    const row = selectedRows.value[0] || {};
    editVoucherEl.value.open(row);
};

// 查看
const handleView = () => {
    const row = selectedRows.value[0] || {};
    viewVoucherEl.value.open(row);
};

//优惠券中的商品列表
const selectedProductList = (shortCode, voucherId) => {
    let data = {
        shortCode: shortCode,
        voucherId: voucherId,
    }
    selectedProductListApi(data).then(res => {
        if (res.code === 200) {
            console.log('{ shortCode: shortCode, voucherId: voucherId, selectionProductList: res.rows }', {
                "shortCode": "PH7S3OFG2Z",
                "voucherId": "900000043940069",
                selectionProductList: [
                    {
                        "shortCode": "PH7S3OFG2Z",
                        "itemId": "3594728915",
                        "itemName": "Universal Car SRS Airbag Simulator Fault Codes Diagnostic Tools Auto Simulator Emulator Resistor Car Safety Accessories",
                        "images": "[\"https://my-live-02.slatic.net/p/c2924a4eb577a76bb8d6a45ffd03e765.jpg\",\"https://my-live-02.slatic.net/p/948ee26f13dc462efb16202802bdd75d.jpg\",\"https://my-live-02.slatic.net/p/176e55e4054bd18d1d99f00f46260d69.jpg\",\"https://my-live-02.slatic.net/p/a49655061a2f722e48c4119a8177ccc2.jpg\",\"https://my-live-02.slatic.net/p/691e84d0ed0158c1247b505a8a57c19c.jpg\",\"https://my-live-02.slatic.net/p/a9faf35ef16621ca5f3376b145748a0f.jpg\",\"https://my-live-02.slatic.net/p/bbee2bde93b3a9e35e379d76da50adec.jpg\",\"https://my-live-02.slatic.net/p/4702fee46262af536891dedd311669f6.jpg\"]",
                        "minRetailPrice": 99,
                        "maxRetailPrice": 432,
                        "minPrice": 57,
                        "maxPrice": 250,
                        "totalStock": 29868,
                        "skus": [
                            {
                                "skuId": "18621662845",
                                "sellerSku": "K6577*10",
                                "retailPrice": 432,
                                "salePrice": 250,
                                "stock": 9929,
                                "isSelect": true
                            },
                            {
                                "skuId": "18621662844",
                                "sellerSku": "K6577*5",
                                "retailPrice": 238,
                                "salePrice": 138,
                                "stock": 9954,
                                "isSelect": true
                            },
                            {
                                "skuId": "18621662843",
                                "sellerSku": "K6577/",
                                "retailPrice": 99,
                                "salePrice": 57,
                                "stock": 9985,
                                "isSelect": true
                            }
                        ]
                    },
                    {
                        "shortCode": "PH7S3OFG2Z",
                        "itemId": "4721858481",
                        "itemName": "10pcs/pack Car Glass Cleaning Wipes Car Window Windshield Rearview Mirror Degreasing Wipes Car Interior Cleaning Tools",
                        "images": "[\"https://my-live-01.slatic.net/p/d52467f4d7544922ea01a39325a3d60b.jpg\",\"https://my-live-01.slatic.net/p/b0d1d586feab7b487a1db3849f7f7e23.jpg\",\"https://my-live-01.slatic.net/p/b7aca841995d957b17fed42582e553cc.jpg\",\"https://my-live-01.slatic.net/p/4a3047c4bcaf5fe6b2eb469979a32c99.jpg\",\"https://my-live-01.slatic.net/p/6c140e4d1dc24aa92c524df19f3d52a2.jpg\",\"https://my-live-01.slatic.net/p/cab22537598d2a0f5d58dd5a370871a5.jpg\",\"https://my-live-01.slatic.net/p/03124050d1be947e2b4a02944c123156.jpg\",\"https://my-live-01.slatic.net/p/04911c1e0ceb0df98159ceff886f1ed8.jpg\"]",
                        "minRetailPrice": 75,
                        "maxRetailPrice": 140,
                        "minPrice": 39,
                        "maxPrice": 77,
                        "totalStock": 19944,
                        "skus": [
                            {
                                "skuId": "27313599782",
                                "sellerSku": "T0156A0//",
                                "retailPrice": 75,
                                "salePrice": 39,
                                "stock": 9961,
                                "isSelect": true
                            },
                            {
                                "skuId": "27313599783",
                                "sellerSku": "T0156A0*2",
                                "retailPrice": 140,
                                "salePrice": 77,
                                "stock": 9983,
                                "isSelect": true
                            }
                        ]
                    }
                ]
            });

            manageProductEl.value.open({ shortCode: shortCode, voucherId: voucherId, selectionProductList: res.rows });
        }
        else {
            message.error(res.msg);
        }
    }).finally(() => {
        selectedProductListLoading.value = false;
    })
};

//  管理商品
const settingProduct = () => {
    selectedProductListLoading.value = true
    if ((selectedRows.value[0].status === 'NOT_START' && selectedRows.value[0].apply === 'SPECIFIC_PRODUCTS') || (selectedRows.value[0].status === 'ONGOING' && selectedRows.value[0].apply === 'SPECIFIC_PRODUCTS')) {
        selectedProductList(selectedRows.value[0].shortCode, selectedRows.value[0].id)
    }
    else {
        message.error('该优惠券状态不可管理商品！');
        selectedProductListLoading.value = false
    }
};

// 激活
const activate = () => {
    const activateVoucherList = selectedRows.value.map((item) => {
        return {
            voucherId: item.id,
            voucherType: item.voucherType
        }
    })
    let data = {
        shortCode: searchData.value.shortCode,
        activateVoucherList: activateVoucherList
    }
    activateLoading.value = true
    activateVoucher(data).then(res => {
        if (res.code === 200) {
            message.success('激活成功');
            clearSelection();
            baseTableEl.value.reload();
        }
        else {
            message.error('激活失败');
        }
    }).finally(() => {
        clearSelection();
        activateLoading.value = false
    })
};

// 暂停
const deactivate = () => {
    const activateVoucherList = selectedRows.value.map((item) => {
        return {
            voucherId: item.id,
            voucherType: item.voucherType
        }
    })

    let data = {
        shortCode: searchData.value.shortCode,
        activateVoucherList: activateVoucherList
    }
    deactivateVoucherLoading.value = true
    deactivateVoucher(data).then(res => {
        if (res.code === 200) {
            message.success('暂停成功');
        }
        else {
            message.error('暂停成功');
        }
    }).finally(() => {
        clearSelection();
        deactivateVoucherLoading.value = false;
        baseTableEl.value.reload();
    })

};

// 同步优惠卷
const syncLazadaVoucher = () => {
    const ids = selectedRows.value.map((item) => {
        return item.id
    })
    syncLoading.value = true
    let data = {
        shortCode: searchData.value.shortCode,
        voucherIds: ids.join(',')
    }
    syncLazadaVoucherApi(data).then(res => {
        if (res.code === 200) {
            message.success('同步成功');
            clearSelection();
            baseTableEl.value.reload();
        }
        else {
            message.error('同步失败');
        }
    }).finally(() => {
        syncLoading.value = false;

    })
};

// 同步店铺优惠卷
const syncLazadaShopVoucher = () => {
    baseTableEl.value.setLoading(true);
    let data = {
        shortCode: searchData.value.shortCode,
    }
    syncLazadaShopVoucherApi(data).then(res => {
        if (res.code === 200) {
            message.success('同步成功');
        }
        else {
            message.success('同步失败');
        }
    }).finally(() => {
        baseTableEl.value.reload();
    })
};


onMounted(async () => {

    manageProductEl.value.open({
        "shortCode": "PH7S3OFG2Z",
        "voucherId": "900000043940069"
    });

    const accountCacheRes = await lazadaSellerVoucherUserAccount();
    if (accountCacheRes.code === 200) {
        let codes = [];
        for (const resKey in accountCacheRes.data.accountDetail) {
            codes.push(...accountCacheRes.data.accountDetail[resKey])
        };
        account.value = codes;
        shortCode.value = codes[0].shortCode || '';
    };



});

</script>

<style lang="less" scoped></style>