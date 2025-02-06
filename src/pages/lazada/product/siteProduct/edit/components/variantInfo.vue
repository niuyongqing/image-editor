<template>
    <!-- v-show="lazadaAttrsState.skuAttrs.length > 0" -->
    <div class="mt-10px">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种信息 </div>
            </template>
            <a-table :columns="columns" :data-source="tableData" bordered :pagination="false" id="tableId">
                <template #headerCell="{ title, column }">

                    <template v-if="column && column.dataIndex === 'sellerSKU'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="generateSKU()"> 一键生成 </a-button> ) </div>
                    </template>

                    <template v-for="item in selectTheme" :key="item.name">
                        <div v-if="item.name === column.dataIndex">
                            {{ title }}
                        </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'stock'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchStock()"> 批量 </a-button> ) </div>
                    </template>

                    <template v-if="column && column.dataIndex === 'supplyPrice'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchPrice()"> 批量 </a-button> ) </div>
                    </template>

                    <template v-if="column && column.dataIndex === 'price'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchPrice()"> 批量 </a-button> ) </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'specialPrice'">
                        <div> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchSpecialPrice()"> 批量 </a-button> ) </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'specialDate'">
                        <div> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchSpecialDate()"> 批量 </a-button> ) </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'package_weight'">
                        <div> <span v-if="weightRequired" class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchWeight()"> 批量 </a-button> ) </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'package'">
                        <div> <span v-if="packageRequired" class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchPackage()"> 批量 </a-button> ) </div>
                    </template>
                </template>
                <template #bodyCell="{ record, index, column }">
                    <template v-if="column && column.dataIndex === 'sellerSKU'">
                        <div>
                            <a-input v-model:value="record.sellerSKU" placeholder="请输入SKU" style="width: 65%;" />
                        </div>
                    </template>

                    <template v-if="column && column.dataIndex === 'stock'">
                        <div> stock: {{ record.stock }} </div>
                        <a-input-number :controls="false" :precision="0" :min="0" v-model:value="record.stock"
                            placeholder="请输入库存" style="width: 80%;" />
                    </template>
                    <template v-if="column && column.dataIndex === 'supplyPrice'">
                        <div> supplyPrice: {{ record.supplyPrice }} </div>
                        <a-input-number :controls="false" :precision="0" :min="0" v-model:value="record.supplyPrice"
                            placeholder="请输入价格" style="width: 80%;" />
                    </template>
                    <template v-if="column && column.dataIndex === 'price'">
                        <div> price: {{ record.price }} </div>
                        <a-input-number :controls="false" :precision="2" :min="0.01" v-model:value="record.price"
                            placeholder="请输入价格" style="width: 80%;" />
                    </template>

                    <template v-if="column && column.dataIndex === 'specialPrice'">
                        <div> specialPrice: {{ record.specialPrice }} </div>
                        <a-input-number :controls="false" :precision="0" v-model:value="record.specialPrice" :min="0.01"
                            :max="record.price" placeholder="请输入促销价" style="width: 80%;" disabled />
                    </template>

                    <template v-if="column && column.dataIndex === 'specialDate'">
                        <div> specialDate: {{ record.specialDate }} </div>
                        <a-range-picker v-model:value="record.specialDate" format="YYYY-MM-DD" style="width: 80%;" />
                    </template>
                    <template v-if="column && column.dataIndex === 'package_weight'">
                        <div> package_weight: {{ record.packageWeight }} </div>
                        <a-input-number :controls="false" :precision="2" v-model:value="record.packageWeight"
                            :min="0.001" :max="20" placeholder="请输入重量" style="width: 80%;" />
                    </template>

                    <template v-if="column && column.dataIndex === 'package'">
                        <div> package: </div>
                        <a-input-number v-model:value="record.packageLength" :min="0.01" :max="110" :precision="2"
                            placeholder="长"></a-input-number>
                        <a-input-number v-model:value="record.packageWidth" :min="0.01" :max="110" :precision="2"
                            placeholder="宽"></a-input-number>
                        <a-input-number v-model:value="record.packageHeight" :min="0.01" :max="110" :precision="2"
                            placeholder="高"></a-input-number>
                    </template>

                    <template v-if="column && column.dataIndex === 'action'">
                        <div> <a-button type="link" @click="delRow(index)"> 移除 </a-button> </div>
                    </template>
                </template>
            </a-table>

            <div flex color="#a0a3a6" mt-10px>
                <p> [共 <span color="#000"> {{ tableData.length }} </span> 个变种] </p>
            </div>
        </a-card>

        <GenerateModal ref="generateModalRef" @success="success"></GenerateModal>
        <StockModal ref="stockModalRef" @success="stockSuccess"></StockModal>
        <PriceModal ref="priceModalRef" @success="priceSuccess"></PriceModal>
        <SpecialPriceModal ref="specialPriceModalRef" @success="specialPriceSuccess"></SpecialPriceModal>
        <SpecialDateModal ref="specialDateModalRef" @success="specialDateSuccess"></SpecialDateModal>
        <WeightModal ref="weightModalRef" @success="weightSuccess"></WeightModal>
        <PackageModal ref="packageModalRef" @success="packageSuccess"></PackageModal>

    </div>
</template>

<script setup>
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from 'ant-design-vue';
import EventBus from "~/utils/event-bus";
import GenerateModal from '../../batchModal/generateModal.vue';
import StockModal from '../../batchModal/stockModal.vue';
import PriceModal from '../../batchModal/priceModal.vue';
import SpecialPriceModal from '../../batchModal/specialPriceModal.vue';
import SpecialDateModal from '../../batchModal/specialDateModal.vue';
import WeightModal from '../../batchModal/weightModal.vue';
import PackageModal from "../../batchModal/packageModal.vue";
import dayjs from 'dayjs';

const { detailData, isHalfway } = defineProps({
    detailData: {
        type: Object,
        default: () => ({})
    },
    isHalfway: {
        type: Boolean,
        default: false,
    },
});

const { state: lazadaAttrsState, setSkuTable } = useLadazaAttrs();
const skus = ref([]); // 属性中所有的 SKU

const theme = reactive({
    themeOne: [],
    themeTwo: [],
});
const generateModalEl = useTemplateRef('generateModalRef'); // 批量生成弹窗
const stockModalEl = useTemplateRef('stockModalRef'); // 批量库存弹窗
const priceModalEl = useTemplateRef('priceModalRef');
const specialPriceModalEl = useTemplateRef('specialPriceModalRef'); // 批量促销价格弹窗
const specialDateModalEl = useTemplateRef('specialDateModalRef');
const weightModalEl = useTemplateRef('weightModalRef');
const packageModalEl = useTemplateRef('packageModalRef');

const tableData = ref([]);
const { selectTheme, skuAttrs, attributes } = toRefs(lazadaAttrsState);

let baseColumns = [
    {
        title: 'SKU',
        dataIndex: 'sellerSKU',
        align: 'center',
    },
    {
        title: '库存',
        dataIndex: 'stock',
        align: 'center',
    },
    {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: '120px'
    },
];

const columns = computed(() => {
    const names = selectTheme.value.map((item) => {
        return item.name
    });

    // 是否包含重量 包装重量范围需在0.001-20之间 ---  包装尺寸范围需在0.01-110之间
    const isWeight = attributes.value.some(item => item.name === 'package_weight');
    const isHeight = attributes.value.some(item => item.name === 'package_height');
    const isWidth = attributes.value.some(item => item.name === 'package_width');
    const isLength = attributes.value.some(item => item.name === 'package_length');

    const skusType = attributes.value.filter(item => item.attribute_type === 'sku');
    skus.value = skusType;
    const weightColumns = () => {
        return isWeight ? [
            {
                title: '重量（kg）',
                dataIndex: 'package_weight',
                align: 'center',
            },
        ] : []
    };

    const packageColumns = () => {
        return isHeight && isWidth && isLength ? [
            {
                title: '尺寸（cm）',
                dataIndex: 'package',
                align: 'center',
            },
        ] : []
    };

    const themeColumns = selectTheme.value.map((item) => {
        return {
            title: item.label,
            dataIndex: item.name,
            width: '150px',
            align: 'center',
        }
    });
    let baseColumns = [];
    function getColumns() {
        if (selectTheme.value.length > 0) {
            if (isHalfway) {
                return baseColumns = [
                    {
                        title: 'SKU',
                        dataIndex: 'sellerSKU',
                        align: 'center',
                    },
                    ...themeColumns,

                    {
                        title: '价格',
                        dataIndex: 'supplyPrice',
                        align: 'center',
                    },
                    {
                        title: '库存',
                        dataIndex: 'stock',
                        align: 'center',
                    },
                    ...weightColumns(),
                    ...packageColumns(),
                    {
                        title: '操作',
                        dataIndex: 'action',
                        align: 'center',
                        width: '120px'
                    },
                ];
            } else {
                return baseColumns = [
                    {
                        title: 'SKU',
                        dataIndex: 'sellerSKU',
                        align: 'center',
                    },
                    ...themeColumns,
                    {
                        title: '库存',
                        dataIndex: 'stock',
                        align: 'center',
                    },
                    {
                        title: '价格',
                        dataIndex: 'price',
                        align: 'center',
                    },
                    {
                        title: '促销价',
                        dataIndex: 'specialPrice',
                        align: 'center',
                    },
                    {
                        title: '促销时间',
                        dataIndex: 'specialDate',
                        align: 'center',
                    },
                    ...weightColumns(),
                    ...packageColumns(),
                    {
                        title: '操作',
                        dataIndex: 'action',
                        align: 'center',
                        width: '120px'
                    },
                ];
            }
        } else {
            return baseColumns
        }
    };
    getColumns();
    return [
        ...baseColumns,
    ];
});

const weightRequired = computed(() => {
    return attributes.value.some(item => item.name === 'package_weight')
});
const packageRequired = computed(() => {
    const isHeight = attributes.value.some(item => item.name === 'package_height');
    const isWidth = attributes.value.some(item => item.name === 'package_width');
    const isLength = attributes.value.some(item => item.name === 'package_length');
    return isHeight && isWidth && isLength
});

const generateTable = () => {
    // 一种变体组合
    if (selectTheme.value.length === 1 || !selectTheme.value[1]?.name) {
        const list = theme.themeOne
        const name = selectTheme.value[0].name;
        let transData = list.map((item) => {
            return {
                [name]: item,
            }
        });
        tableData.value = transData.map((item, index) => {
            return {
                ...item,
                fileList: [],
                ...tableData.value[index]
            }
        })
        return
    }

    // 两种变体组合
    if (selectTheme.value.length === 2) {
        const nameOne = selectTheme.value[0].name;
        const nameTwo = selectTheme.value[1].name;
        const list = theme.themeTwo.flatMap(Two =>
            theme.themeOne.map(One => ({
                [nameOne]: One,
                [nameTwo]: Two
            }))
        );
        tableData.value = list.map((item, index) => {
            return {
                fileList: [],
                ...tableData.value[index],
                ...item,
            }
        })
    }
};
//  编辑回显
watch(() => {
    return detailData
}, async (newVal) => {
    const skus = newVal.skus || [];
    if (isHalfway) {
        tableData.value = skus.map((item) => {
            const images = item.Images || [];
            return {
                ...item,
                sellerSKU: item.SellerSku,
                stock: item.quantity,
                supplyPrice: item.supply_price,
                packageWeight: item.package_weight,
                packageHeight: item.package_weight,
                packageLength: item.package_length,
                packageWidth: item.package_width,
                fileList: images.map((img) => {
                    return {
                        "fileName": img,
                        url: img,
                        originalFilename: img,
                        name: img,
                    }
                })
            }
        });
    } else {
        tableData.value = skus.map((item) => {
            const images = item.Images || [];
            return {
                ...item,
                sellerSKU: item.SellerSku,
                stock: item.quantity,
                price: item.price,
                specialPrice: item.special_price,
                specialDate: [dayjs(item.special_from_time), dayjs(item.special_to_time)],
                packageWeight: item.package_weight,
                packageHeight: item.package_weight,
                packageLength: item.package_length,
                packageWidth: item.package_width,
                fileList: images.map((img) => {
                    return {
                        "fileName": img,
                        url: img,
                        originalFilename: img,
                        name: img,
                    }
                })
            }
        });
    }

}, {
    deep: true
});

watch(() => lazadaAttrsState.shortCode, () => {
    tableData.value = [];
}, { deep: true });

//  产品资料库回显
watch(() => lazadaAttrsState.productSkus, (newValue) => {
    const artSkuImage = lazadaAttrsState.product.artSkuImage ? JSON.parse(lazadaAttrsState.product.artSkuImage) : [];
    tableData.value = newValue.map((item, index) => {
        return {
            sellerSKU: item.skuNumber,
            stock: item.puYuanNumber ? parseInt(item.puYuanNumber) : 0,
            price: item.detail.cost ? parseFloat(item.detail.cost) : 0,
            specialPrice: undefined,
            specialDate: undefined,
            packageLength: '',
            packageWidth: '',
            packageHeight: '',
            packageWeight: item.detail.weight,
            fileList: artSkuImage[index] ? [artSkuImage[index]] : [],
            [selectTheme.value[0].name]: item.detail.attr,
        }
    });

}, {
    deep: true
});

watch(() => tableData.value, (newVal) => {
    setSkuTable(newVal);
}, { deep: true });


// 一键生成
const generateSKU = (column) => {
    generateModalEl.value.open()
};
//  批量
const success = (formData) => {
    const nameOne = lazadaAttrsState.selectTheme[0].name;
    let nameTwo = '';
    if (lazadaAttrsState.selectTheme.length === 2) {
        nameTwo = lazadaAttrsState.selectTheme[1].name ?? '';
    }
    tableData.value.forEach((item) => {
        item.sellerSKU = formData.prefix + '-' + item[nameOne] + '-' + `${nameTwo ? item[nameTwo] : ''}` + '-' + formData.suffix;
    })
};
//  批量修改库存
const batchStock = () => {
    stockModalEl.value.open()
};

const stockSuccess = (evt) => {
    const setRuleNum = evt.setRuleNum ?? 0;
    tableData.value.forEach((item) => {
        if (evt.radio === 1) {
            item.stock = evt.setNum;
        } else if (evt.radio === 2) {
            const currentStock = Number(item.stock ?? 0);
            switch (evt.stockRule) {
                case 1:
                    item.stock = currentStock + setRuleNum;
                    break;
                case 2:
                    item.stock = currentStock - setRuleNum;
                    break;
                case 3:
                    item.stock = currentStock * setRuleNum;
                    break;
                default:
                    break;
            }
        }
    });
};
//  批量修改价格
const batchPrice = (evt) => {
    priceModalEl.value.open()
};

const priceSuccess = (evt) => {
    const setRuleNum = evt.setRuleNum ?? 0;

    tableData.value.forEach((item) => {
        if (evt.radio === 1) {
            item[isHalfway ? 'supplyPrice' : 'price'] = evt.setNum;
        } else if (evt.radio === 2) {
            const currentPrice = Number(item[isHalfway ? 'supplyPrice' : 'price'] ?? 0);
            switch (evt.stockRule) {
                case 1:
                    item[isHalfway ? 'supplyPrice' : 'price'] = currentPrice + setRuleNum;
                    break;
                case 2:
                    item[isHalfway ? 'supplyPrice' : 'price'] = currentPrice - setRuleNum;
                    break;
                case 3:
                    item[isHalfway ? 'supplyPrice' : 'price'] = currentPrice * setRuleNum;
                    break;
                case 4:
                    item[isHalfway ? 'supplyPrice' : 'price'] = currentPrice / setRuleNum;
                    break;
                default:
                    break;
            }
        }
    });
};
// 批量修改促销价
const batchSpecialPrice = () => {
    specialPriceModalEl.value.open();
};
const specialPriceSuccess = (evt) => {
    const setRuleNum = evt.setRuleNum ?? 0;

    tableData.value.forEach((item) => {
        if (evt.radio === 1) {
            item.specialPrice = evt.setNum;
        } else if (evt.radio === 2) {
            const currentPrice = Number(item.specialPrice ?? 0);
            switch (evt.stockRule) {
                case 1:
                    item.specialPrice = currentPrice + setRuleNum;
                    break;
                case 2:
                    item.specialPrice = currentPrice - setRuleNum;
                    break;
                case 3:
                    item.specialPrice = currentPrice * setRuleNum;
                    break;
                case 4:
                    item.specialPrice = currentPrice / setRuleNum;
                    break;
                default:
                    break;
            }
        }
    });
};

// 批量修改促销时间
const batchSpecialDate = () => {
    specialDateModalEl.value.open();
}

// 批量重修过尺寸
const specialDateSuccess = (evt) => {
    tableData.value.forEach((item) => {
        item.specialDate = evt
    })
};

const batchWeight = () => {
    weightModalEl.value.open();
};

const weightSuccess = (evt) => {
    const setRuleNum = evt.setRuleNum ?? 0;
    tableData.value.forEach((item) => {
        if (evt.radio === 1) {
            item.packageWeight = evt.setNum;
        } else if (evt.radio === 2) {
            const currentWeight = Number(item.packageWeight ?? 0);
            switch (evt.stockRule) {
                case 1:
                    item.packageWeight = currentWeight + setRuleNum;
                    break;
                case 2:
                    item.packageWeight = currentWeight - setRuleNum;
                    break;
                case 3:
                    item.packageWeight = currentWeight * setRuleNum;
                    break;
                case 4:
                    item.packageWeight = currentWeight / setRuleNum;
                    break;
                default:
                    break;
            }
        }
    });
};

const batchPackage = () => {
    packageModalEl.value.open();
};
const packageSuccess = (evt) => {
    tableData.value.forEach((item) => {
        item.packageLength = evt.packageLength;
        item.packageWidth = evt.packageWidth;
        item.packageHeight = evt.packageHeight;
    })
};

// 移除SKU
const delRow = (index) => {
    tableData.value.splice(index, 1);
    EventBus.emit('delRow', tableData.value);
};

const validateForm = () => {
    return new Promise((resolve, reject) => {
        if (tableData.value.length === 0) {
            message.warning('变种参数不能为空');
            document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            reject(false);
            return
        };
        for (let index = 0; index < tableData.value.length; index++) {
            const item = tableData.value[index];
            if (!item.sellerSKU) {
                message.warning(`第${index + 1}行SKU不能为空`);
                document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false)
                return false;
            };
            if (!item.stock) {
                message.warning(`第${index + 1}行库存不能为空`);
                document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false)
                return false;
            };
            if (isHalfway) {
                if (!item.supplyPrice) {
                    message.warning(`第${index + 1}行价格不能为空`);
                    document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    reject(false)
                    return false;
                };
            } else {
                if (!item.price) {
                    message.warning(`第${index + 1}行价格不能为空`);
                    document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    reject(false)
                    return false;
                };
            }

            if (weightRequired.value && !item.packageWeight) {
                message.warning(`第${index + 1}行重量不能为空`);
                document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false)
                return false;
            };
            if (packageRequired.value && (!item.packageLength || !item.packageWidth || !item.packageHeight)) {
                message.warning(`第${index + 1}行包装尺寸不能为空`);
                document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false);
                return false;
            }
            resolve(true)
        }
    })
};

defineExpose({
    tableData,
    validateForm
});

onMounted(() => {
    EventBus.on('changeCheckedList', () => {
        if (!lazadaAttrsState.selectTheme.length) return;
        theme.themeOne = lazadaAttrsState.selectTheme[0].checkedList || [];
        if (lazadaAttrsState.selectTheme.length > 1) {
            theme.themeTwo = lazadaAttrsState.selectTheme[1].checkedList || [];
        };
        generateTable();
    });
});
onUnmounted(() => {
    EventBus.off('changeCheckedList');
});
</script>

<style lang="less" scoped>
.required {
    color: #ff4d4f;
}
</style>
