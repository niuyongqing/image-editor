<template>
    <div class="mt-10px" v-show="lazadaAttrsState.skuAttrs.length > 0">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种信息 </div>
            </template>
            <div text-left mb-10px>
                升级为Global Plus：
                <a-checkbox v-model:checked="checkState.checkAll" @change="onChangeCheckAll"> 全部 </a-checkbox>
                <a-checkbox-group v-model:value="checkState.checkedList" :options="checkState.options"
                    @change="onChangeCheck">
                    <template #label="{ label }">
                        {{ label }}
                    </template>
                </a-checkbox-group>
            </div>
            <!-- {{ tableData }} -->
            <a-table :columns="columns" :data-source="tableData" bordered :pagination="false" id="tableId">
                <template #headerCell="{ title, column }">
                    <template v-if="column.dataIndex === 'sellerSKU'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="generateSKU()"> 一键生成 </a-button> ) </div>
                    </template>
                    <template v-for="item in selectTheme" :key="item.name">
                        <div v-if="item.name === column.dataIndex">
                            {{ title }}
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'stock'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchStock()"> 批量 </a-button> ) </div>
                    </template>

                    <template v-if="column.dataIndex === 'price'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                    </template>
                    <template v-if="column.dataIndex === 'specialPrice'">
                        <div> {{ title }} </div>
                    </template>

                    <!-- 不含邮价格 -->
                    <template v-if="column.dataIndex === 'postPrices'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                    </template>

                    <template v-if="column.dataIndex === 'specialDate'">
                        <div> {{ title }} </div>
                        <div> ( <a-button type="link" @click="batchSpecialDate()"> 批量 </a-button> ) </div>
                    </template>
                    <template v-if="column.dataIndex === 'package_weight'">
                        <div> <span v-if="weightRequired" class="required"> * </span> {{ title }} </div>
                    </template>
                    <template v-if="column.dataIndex === 'package'">
                        <div> <span v-if="packageRequired" class="required"> * </span> {{ title }} </div>
                    </template>
                </template>
                <template #bodyCell="{ record, index, column }">
                    <template v-if="column.dataIndex === 'sellerSKU'">
                        <div>
                            <a-input v-model:value="record.sellerSKU" placeholder="请输入SKU" />
                        </div>
                    </template>

                    <template v-if="column.dataIndex === 'stock'">
                        <a-input-number :controls="false" :precision="0" :min="0" v-model:value="record.stock"
                            placeholder="请输入库存" style="width: 80%;" />
                    </template>

                    <template v-if="column.dataIndex === 'price'">
                        <a-input-number :controls="false" :precision="2" :min="0.01" v-model:value="record.price"
                            placeholder="请输入价格" style="width: 50%;" />
                        <a-tooltip placement="top" v-if="lazadaAttrsState.ventures.length > 0">
                            <template #title>
                                <span>点击设置各个站点价格</span>
                            </template>
                            <a-button type="primary" @click="settingPrice(record, index)" style="margin-left: 10px;">
                                <SettingOutlined />
                            </a-button>
                        </a-tooltip>
                    </template>

                    <template v-if="column.dataIndex === 'specialPrice'">
                        <a-input-number :controls="false" :precision="0" v-model:value="record.specialPrice" :min="0.01"
                            :max="record.price" placeholder="请输入促销价" style="width: 50%;" />
                        <a-tooltip placement="top" v-if="lazadaAttrsState.ventures.length > 0">
                            <template #title>
                                <span>点击设置各个站点价格</span>
                            </template>
                            <a-button type="primary" @click="settingPrice(record, index)" style="margin-left: 10px;">
                                <SettingOutlined />
                            </a-button>
                        </a-tooltip>
                    </template>

                    <!-- 不含邮价格 -->
                    <template v-if="column.dataIndex === 'postPrices'">
                        <div> <a-input-number :controls="false" :precision="0" v-model:value="record.postPrices"
                                :min="0.01" placeholder="请输入不含邮价格" style="width: 50%;" />
                            <a-tooltip placement="top">
                                <template #title>
                                    <span>点击设置各个站点价格</span>
                                </template>
                                <a-button type="primary" @click="settingPrice(record, index)"
                                    style="margin-left: 10px;">
                                    <SettingOutlined />
                                </a-button>
                            </a-tooltip>
                        </div>
                    </template>

                    <template v-if="column.dataIndex === 'specialDate'">
                        <a-range-picker v-model:value="record.specialDate" format="YYYY-MM-DD" style="width: 80%;" />
                    </template>
                    <template v-if="column.dataIndex === 'package_weight'">
                        <a-input-number :controls="false" :precision="0" v-model:value="record.packageWeight"
                            :min="0.001" :max="20" placeholder="请输入重量" style="width: 80%;" />
                    </template>

                    <template v-if="column.dataIndex === 'package'">
                        <a-input-number v-model:value="record.packageLength" :min="0.01" :max="110" :precision="2"
                            placeholder="长"></a-input-number>
                        <a-input-number v-model:value="record.packageWidth" :min="0.01" :max="110" :precision="2"
                            placeholder="宽"></a-input-number>
                        <a-input-number v-model:value="record.packageHeight" :min="0.01" :max="110" :precision="2"
                            placeholder="高"></a-input-number>
                    </template>

                    <template v-if="column.dataIndex === 'action'">
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
        <EditPriceModal ref="editPriceModalRef" @success="editPriceSuccess" :checkedList="checkState.checkedList">
        </EditPriceModal>
    </div>
</template>

<script setup>
import { SettingOutlined } from '@ant-design/icons-vue';
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
import EditPriceModal from './editPriceModal.vue';
const { state: lazadaAttrsState, setSkuTable } = useLazadaGobalAttrs();
const skus = ref([]); // 属性中所有的 SKU
const { state: checkState, reset } = useResetReactive({
    checkAll: false,
    checkedList: [],
    options: computed(() => {
        return [
            {
                label: "马来",
                value: "MY",
                disabled: false
            }, {
                label: "印度尼西亚",
                value: "ID",
                disabled: !lazadaAttrsState.ventures.includes('ID')
            },
            {
                label: "菲律宾",
                value: "PH",
                disabled: !lazadaAttrsState.ventures.includes('PH')
            },
            {
                label: "新加坡",
                value: "SG",
                disabled: !lazadaAttrsState.ventures.includes('SG')
            },
            {
                label: "泰国",
                value: "TH",
                disabled: !lazadaAttrsState.ventures.includes('TH')
            },
            {
                label: "越南",
                value: "VN",
                disabled: !lazadaAttrsState.ventures.includes('VN')
            },
        ]
    })

});

const theme = reactive({
    themeOne: [],
    themeTwo: [],
});
// const themeOne = ref('');// 主题一
// const themeTwo = ref(''); // 主题二
const currentIndex = ref(0);
const generateModalEl = useTemplateRef('generateModalRef'); // 批量生成弹窗
const stockModalEl = useTemplateRef('stockModalRef'); // 批量库存弹窗
const priceModalEl = useTemplateRef('priceModalRef');
const specialPriceModalEl = useTemplateRef('specialPriceModalRef'); // 批量促销价格弹窗
const specialDateModalEl = useTemplateRef('specialDateModalRef');
const weightModalEl = useTemplateRef('weightModalRef');
const packageModalEl = useTemplateRef('packageModalRef');
const editPriceModalEl = useTemplateRef('editPriceModalRef');

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
    {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: '120px'
    },
];

const onChangeCheckAll = (e) => {
    const selectOptions = checkState.options.map(item => item.value);
    checkState.checkedList = e.target.checked ? selectOptions : [];
};
const onChangeCheck = (checkedList) => {
    checkState.checkAll = checkedList.length === checkState.options.length;
};

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
    const postPricesColoumns = () => {
        return checkState.checkedList.length ? [
            {
                title: '不含邮价格',
                dataIndex: 'postPrices',
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
                ...postPricesColoumns(),
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
                {
                    title: '操作',
                    dataIndex: 'action',
                    align: 'center',
                    width: '120px'
                },
            ];
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


const settingPrice = (record, index) => {
    console.log('index', index);
    // themeOne.value = record[lazadaAttrsState.selectTheme[0].name];
    // if (lazadaAttrsState.selectTheme.length === 2) {
    //     themeTwo.value = record[lazadaAttrsState.selectTheme[1].name];
    // }
    currentIndex.value = index;
    editPriceModalEl.value.open({ record: record, checkedList: checkState.checkedList });
};

const priceSuccess = (evt) => {
    const setRuleNum = evt.setRuleNum ?? 0;

    tableData.value.forEach((item) => {
        if (evt.radio === 1) {
            item.price = evt.setNum;
        } else if (evt.radio === 2) {
            const currentPrice = Number(item.price ?? 0);
            switch (evt.stockRule) {
                case 1:
                    item.price = currentPrice + setRuleNum;
                    break;
                case 2:
                    item.price = currentPrice - setRuleNum;
                    break;
                case 3:
                    item.price = currentPrice * setRuleNum;
                    break;
                case 4:
                    item.price = currentPrice / setRuleNum;
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
// 修改价格
const editPriceSuccess = (evt) => {
    // my-site
    const defaultSite = evt.find((item) => item.enSite === 'default') // 默认
    const mySite = evt.find((item) => item.enSite === 'MY') // 马来
    const idSite = evt.find((item) => item.enSite === 'ID') // 印尼
    const phSite = evt.find((item) => item.enSite === 'PH') // 菲律宾
    const thSite = evt.find((item) => item.enSite === 'TH') // 泰国
    const sgSite = evt.find((item) => item.enSite === 'SG') // 新加坡
    const vnSite = evt.find((item) => item.enSite === 'VN') // 越南
    tableData.value[currentIndex.value].price = defaultSite.retailPrice;
    tableData.value[currentIndex.value].specialPrice = defaultSite.salesPrice;
    if (checkState.checkedList.length > 0) {
        tableData.value[currentIndex.value].postPrices = evt.postPrices;
    }

    tableData.value.forEach((item, index) => {
        if (currentIndex.value === index) {
            item.my_retail_price = mySite?.retailPrice ?? undefined;// 销售价 
            item.my_sales_price = mySite?.salesPrice ?? undefined; // 促销价
        };

        if (checkState.checkedList.includes('ID') && (currentIndex.value === index)) {
            item.id_retail_price = idSite?.retailPrice ?? undefined;// 销售价 
            item.id_sales_price = idSite?.salesPrice ?? undefined; // 促销价
        };
        if (checkState.checkedList.includes('PH') && (currentIndex.value === index)) {
            item.ph_retail_price = phSite?.retailPrice ?? undefined;// 销售价 
            item.ph_sales_price = phSite?.salesPrice ?? undefined; // 促销价
        };
        if (checkState.checkedList.includes('TH') && (currentIndex.value === index)) {
            item.th_retail_price = phSite?.retailPrice ?? undefined;// 销售价 
            item.th_sales_price = phSite?.salesPrice ?? undefined; // 促销价
        }

        if (checkState.checkedList.includes('SG') && (currentIndex.value === index)) {
            item.sg_retail_price = sgSite?.retailPrice ?? undefined;// 销售价 
            item.sg_sales_price = sgSite?.salesPrice ?? undefined; // 促销价
        }
        if (checkState.checkedList.includes('VN') && (currentIndex.value === index)) {
            item.vn_retail_price = vnSite?.retailPrice ?? undefined;// 销售价 
            item.vn_sales_price = vnSite?.salesPrice ?? undefined; // 促销价
        }
        // if (checkState.checkedList.length && (currentIndex.value === index)) {
        //     // item.postPrices = vnSite?.retailPrice ?? undefined;// 销售价 
        // }
    });
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
            emits('valid', false);
            return
        };
        for (let index = 0; index < tableData.value.length; index++) {
            const item = tableData.value[index];
            if (!item.sellerSKU) {
                message.warning(`第${index + 1}行SKU不能为空`);
                document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false);
                emits('valid', false);
                return false;
            };
            if (!item.stock) {
                message.warning(`第${index + 1}行库存不能为空`);
                document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false);
                emits('valid', false);
                return false;
            };
            if (!item.price) {
                message.warning(`第${index + 1}行价格不能为空`);
                document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false);
                emits('valid', false);
                return false;
            };
            if (checkState.checkedList.length) {
                if (!item.postPrices) {
                    message.warning(`第${index + 1}行不含邮价格不能为空`);
                    document.querySelector('#tableId')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    reject(false);
                    emits('valid', false);
                    return false;
                };
            }

            resolve(true);
            emits('valid', true);
        }
    })
};
const emits = defineEmits(['valid']);
defineExpose({
    tableData,
    checkState,
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
