<template>
    <div>
        <BaseModal title="Global Plus 商品升级" @register="register" @close="cancel" @submit="submit"
            :submitBtnLoading="submitBtnLoading" width="90%" style="top: 20px">
            <a-card :bordered="false" style="margin-right: 5px">
                <template #title>
                    <div style="display: flex">
                        <div style="display: flex">
                            <span style="font-weight: bold;width: 120px">升级国家:</span>
                        </div>
                        <a-checkbox-group v-model:value="checkedCities" @change="handleCheckedCitiesChange"
                            style="display: flex">
                            <a-checkbox v-for="city in cities" :key="city" :value="city">{{ city }}</a-checkbox>
                        </a-checkbox-group>
                        <a-button type="link" @click="restore">还原全部升级国家</a-button>
                    </div>
                </template>
                <a-table :scroll="{ y: 'calc(100vh - 300px)', virtual: true }" :columns="columns"
                    :dataSource="rowData.skus || []" :pagination="false">
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'sellerSku'">
                            <div>
                                <span> 商家SKU </span> <span class="required">*</span>
                            </div>
                        </template>

                        <template v-if="column.key === 'price'">
                            <div text-center>
                                <span> 原价 </span> <span class="required">*</span>
                            </div>

                        </template>

                        <template v-if="column.key === 'noFeePrice'">
                            <div text-center>
                                <span> 不含邮价格 </span> <span class="required">*</span>
                                <a-button @click="batchNoFeePrice" type="link" style="margin-left: 10px"> 批量 </a-button>
                            </div>

                        </template>


                        <template v-if="column.key === 'quantity'">
                            <div text-center>
                                <span> 库存 </span> <a-button @click="batchQuantity" type="link"
                                    style="margin-left: 10px"> 批量
                                </a-button>
                            </div>
                        </template>

                        <template v-if="column.key === 'packageWeight'">
                            <div text-center>
                                <span> 包装重量（Kg） </span> <span class="required">*</span>
                            </div>
                        </template>
                        <template v-if="column.key === 'package'">
                            <div text-center>
                                <span> 包装尺寸（cm） </span> <span class="required">*</span>
                            </div>
                        </template>
                    </template>


                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'sellerSku'">
                            <span>
                                {{ record.sellerSku }}
                            </span>
                        </template>
                        <template v-else-if="column.key === 'price'">
                            <div v-for="(item, index) in record.countryInfo" :key="index">
                                <div style="display: flex;gap: 10px; align-content: center;margin-top: 8px">
                                    <span
                                        style="font-weight: bold;margin-left: 8px;text-decoration: line-through">原价:</span><a-input-number
                                        :controls="false" v-model:value="item.price" disabled></a-input-number>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="column.key === 'noFeePrice'">
                            <div v-for="(item, index) in record.countryInfo" :key="index">
                                <div style="display: flex;gap: 10px;align-content: center;margin-top: 10px">
                                    <span style="font-weight: bold"></span><span>{{ item.currency }}</span>
                                    <span style="font-weight: bold;margin-left: 10px">价格:</span><a-input-number
                                        :controls="false" v-model="item.noFeePrice"></a-input-number>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="column.key === 'date'">
                            <div>
                                <a-input-number :controls="false" v-model:value="record.Plength" placeholder="长"
                                    style="width: 100px"></a-input-number> X
                                <a-input-number :controls="false" v-model:value="record.Pwidth" placeholder="宽"
                                    style="width: 100px"></a-input-number> X
                                <a-input-number :controls="false" v-model:value="record.Pheight" placeholder="高"
                                    style="width: 100px"></a-input-number> x
                                <a-input-number :controls="false" v-model:value="record.Pweight" placeholder="重量"
                                    style="width: 100px"></a-input-number> x
                                <a-input-number :controls="false" v-model:value="record.absNumber" placeholder="平均商品数量"
                                    style="width: 100px"></a-input-number>
                                <a-button type="link" @click="getNoFeePrice(record)">查询</a-button>
                            </div>
                            <div style="width: 100%;" v-loading="countryPriceType" element-loading-text="正在查询系统价格...">
                                <div v-for="(item, index) in record.countryPrice" :key="index">
                                    <div
                                        style="display: flex;justify-content: space-around;align-content: center;margin-top: 10px">
                                        <span style="font-weight: bold">国家:</span><span>{{ item.currency }}</span>
                                        <span style="font-weight: bold;margin-left: 10px">系统建议价格:</span><span>{{
                                            item.noFeePrice }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="column.key === 'quantity'">
                            <div v-for="(item, index) in record.countryInfo" :key="index">
                                <div
                                    style="display: flex;justify-content: space-around;align-content: center;margin-top: 10px">
                                    <span style="font-weight: bold">方向:</span><span>{{ item.market }}</span>
                                    <span style="font-weight: bold;margin-left: 10px">库存:</span><a-input-number
                                        :controls="false" v-model:value="item.quantity"></a-input-number>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="column.key === 'packageWeight'">
                            <a-input-number :controls="false" v-model:value="record.packageWeight"></a-input-number>
                        </template>
                        <template v-else-if="column.key === 'package'">
                            <div style="display: flex;justify-content: space-around;align-content: center">
                                <a-input-number :controls="false" v-model:value="record.packageLength" placeholder="长"
                                    style="width: 100px"></a-input-number>X
                                <a-input-number :controls="false" v-model:value="record.packageWidth" placeholder="宽"
                                    style="width: 100px"></a-input-number>X
                                <a-input-number :controls="false" v-model:value="record.packageHeight" placeholder="高"
                                    style="width: 100px"></a-input-number>
                            </div>
                        </template>
                    </template>

                </a-table>
            </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from "ant-design-vue";
import { getNoFeePriceApi, productUpgrade } from '@/pages/lazada/globalplus/api';
const columns = [
    {
        title: '商家SKU',
        dataIndex: 'sellerSku',
        key: 'sellerSku',
        align: 'center',
        width: 100
    },
    {
        title: '原价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        width: 200
    },
    {
        title: 'SKU不含邮价格',
        dataIndex: 'noFeePrice',
        key: 'noFeePrice',
        align: 'center'
    },
    {
        title: '系统建议商品不含邮价格',
        key: 'date',
        dataIndex: 'date',
        align: 'center',
        width: 700
    },
    {
        title: '库存',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'center',
        width: 400
    },
    {
        title: '包装重量',
        key: 'packageWeight',
        dataIndex: 'packageWeight',
        align: 'center',
        width: 200
    },
    {
        title: '包装尺寸',
        key: 'package',
        dataIndex: 'package',
        align: 'center'
    },
];

const rowData = ref({
    skus: []
});
const checkedCities = ref([])
const cities = ref([]) // 假设的城市列表
const countryPriceType = ref(false)
const modalMethods = ref();

const submitBtnLoading = ref(false);
const register = (methods) => {
    modalMethods.value = methods
};

// 不含邮价格批量
const batchNoFeePrice = () => { };
const batchQuantity = () => { };

const open = (row) => {
    rowData.value = row;
    cities.value = row.skus[0].countryInfo.map(item => item.currency);
    checkedCities.value = row.skus[0].countryInfo.map(item => item.currency);
    modalMethods.value.openModal();
};
const cancel = (data) => {
    submitBtnLoading.value = false;
};

const submit = async () => {
    submitBtnLoading.value = true;
    productUpgrade(data).then(res => {
        if (res.data === true) {
            message.success('升级成功');
            emits('success');
            modalMethods.value.closeModal();
        }
        else {
            message.success('升级失败');
        }
    }).finally(() => {
        submitBtnLoading.value = false;
    })
};

const getNoFeePrice = (row) => {
    let data = {
        id: row.id,
        abs: row.absNumber,
        skus: [
            {
                sellerSku: row.sellerSku,
                packageLength: row.Plength,
                packageWidth: row.Pwidth,
                packageHeight: row.Pheight,
                packageWeight: row.Pweight,
            }
        ]
    }
    countryPriceType.value = true
    getNoFeePriceApi(data).then(res => {
        if (res.code === 200) {
            // this.$set(row, 'countryPrice', res.data.skus[0].countryPrice)
        }
    }).finally(() => {
        countryPriceType.value = false
    })
};


function handleCheckedCitiesChange(value) {
    console.log(value);
}
function restore() {
    checkedCities.value = [];
}
function barchPrice(skuData) {
    console.log(skuData);
}
function barchStock(skuData) {
    console.log(skuData);
}

const emits = defineEmits(['success']);
defineExpose({
    open
})
</script>

<style lang="less" scoped>
.required {
    color: #f40;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>