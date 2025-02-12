<template>
    <div class="mt-10px">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种信息 </div>
            </template>
            <a-table :columns="columns" :data-source="tableData" bordered :pagination="false" id="tableId">
                <template #headerCell="{ title, column }">
                    <template v-if="column && column.dataIndex === 'sellerSKU'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                    </template>
                    <template v-for="item in selectTheme" :key="item.name">
                        <div v-if="item.name === column.dataIndex">
                            {{ title }}
                        </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'stock'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'supplyPrice'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'price'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'specialPrice'">
                        <div> {{ title }} </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'specialDate'">
                        <div> {{ title }} </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'package_weight'">
                        <div> <span v-if="weightRequired" class="required"> * </span> {{ title }} </div>
                    </template>
                    <template v-if="column && column.dataIndex === 'package'">
                        <div> <span v-if="packageRequired" class="required"> * </span> {{ title }} </div>
                    </template>
                </template>
                <template #bodyCell="{ record, column }">
                    <template v-if="column && column.dataIndex === 'sellerSKU'">
                        <div>
                            <a-input v-model:value="record.sellerSKU" placeholder="请输入SKU" style="width: 65%;" />
                        </div>
                    </template>

                    <template v-if="column && column.dataIndex === 'stock'">
                        <a-input-number :controls="false" :precision="0" :min="0" v-model:value="record.stock"
                            placeholder="请输入库存" style="width: 80%;" />
                    </template>
                    <template v-if="column && column.dataIndex === 'supplyPrice'">
                        <a-input-number :controls="false" :precision="0" :min="0" v-model:value="record.supplyPrice"
                            placeholder="请输入价格" style="width: 80%;" />
                    </template>
                    <template v-if="column && column.dataIndex === 'price'">
                        <a-input-number :controls="false" :precision="2" :min="0.01" v-model:value="record.price"
                            placeholder="请输入价格" style="width: 80%;" />
                    </template>
                    <!-- <template v-if="column && column.dataIndex === 'specialPrice'">
                        <a-input-number :controls="false" :precision="0" v-model:value="record.specialPrice" :min="0.01"
                            :max="record.price" placeholder="请输入促销价" style="width: 80%;" disabled />
                    </template> -->
                    <template v-if="column && column.dataIndex === 'specialDate'">
                        <a-range-picker v-model:value="record.specialDate" format="YYYY-MM-DD" style="width: 80%;" />
                    </template>
                    <template v-if="column && column.dataIndex === 'package_weight'">
                        <a-input-number :controls="false" :precision="2" v-model:value="record.packageWeight"
                            :min="0.001" :max="20" placeholder="请输入重量" style="width: 80%;" />
                    </template>
                    <template v-if="column && column.dataIndex === 'package'">
                        <a-input-number v-model:value="record.packageLength" :min="0.01" :max="110" :precision="2"
                            placeholder="长"></a-input-number>
                        <a-input-number v-model:value="record.packageWidth" :min="0.01" :max="110" :precision="2"
                            placeholder="宽"></a-input-number>
                        <a-input-number v-model:value="record.packageHeight" :min="0.01" :max="110" :precision="2"
                            placeholder="高"></a-input-number>
                    </template>
                </template>
            </a-table>

            <div flex color="#a0a3a6" mt-10px>
                <p> [共 <span color="#000"> {{ tableData.length }} </span> 个变种] </p>
            </div>
        </a-card>
    </div>
</template>

<script setup>
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from 'ant-design-vue';
import EventBus from "~/utils/event-bus";
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
                    // {
                    //     title: '促销价',
                    //     dataIndex: 'specialPrice',
                    //     align: 'center',
                    // },
                    {
                        title: '促销时间',
                        dataIndex: 'specialDate',
                        align: 'center',
                    },
                    ...weightColumns(),
                    ...packageColumns(),
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
                price: item.sku_supply_price,
                // specialPrice: item.special_price,
                specialDate: [dayjs(item.special_from_time), dayjs(item.special_to_time)],
                packageWeight: item.package_weight,
                packageHeight: item.package_weight,
                packageLength: item.package_length,
                packageWidth: item.package_width,
                fileList: images.map((img) => {
                    return {
                        fileName: img,
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

watch(() => tableData.value, (newVal) => {
    setSkuTable(newVal);
}, { deep: true });
defineExpose({
    tableData,
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
