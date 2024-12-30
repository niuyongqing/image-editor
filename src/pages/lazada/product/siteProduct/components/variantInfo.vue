<template>
    <div class="mt-10px" v-show="lazadaAttrsState.skuAttrs.length > 0">
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 变种信息 </div>
            </template>
            <a-table :columns="columns" :data-source="tableData" bordered :pagination="false">
                <template #headerCell="{ title, column }">
                    <template v-if="column.dataIndex === 'sellerSKU'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="generateSKU(column)"> 一键生成 </a-button> ) </div>
                    </template>
                    <!-- 主题1 -->
                    <template v-for="item in selectTheme" :key="item.name">
                        <div v-if="item.name === column.dataIndex">
                            {{ title }}
                        </div>
                    </template>
                    <!-- 主题2 -->
                    <template v-if="column.dataIndex === 'stock'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="generateSKU(column)"> 批量 </a-button> ) </div>
                    </template>

                    <template v-if="column.dataIndex === 'price'">
                        <div> <span class="required"> * </span> {{ title }} </div>
                        <div> ( <a-button type="link" @click="generateSKU(column)"> 批量 </a-button> ) </div>
                    </template>
                    <template v-if="column.dataIndex === 'specialPrice'">
                        <div> {{ title }} </div>
                        <div> ( <a-button type="link" @click="generateSKU(column)"> 批量 </a-button> ) </div>
                    </template>
                    <template v-if="column.dataIndex === 'specialDate'">
                        <div> {{ title }} </div>
                        <div> ( <a-button type="link" @click="generateSKU(column)"> 批量 </a-button> ) </div>
                    </template>

                    <template v-if="column.dataIndex === 'name'">
                        <div> {{ title }} </div>
                    </template>
                </template>


                <template #bodyCell="{ record, index, column }">
                    <!-- {{ text }} -{{ record }}- {{ index }} -{{ column }} -->
                    <template v-if="column.dataIndex === 'sellerSKU'">
                        <div> sellerSKU {{ record.sellerSKU }}
                            <a-input v-model:value="record.sellerSKU" placeholder="请输入SKU" />
                        </div>
                    </template>

                    <template v-if="column.dataIndex === 'stock'">
                        <div> stock: {{ record.stock }} </div>
                        <a-input-number :controls="false" :precision="0" v-model:value="record.stock"
                            placeholder="请输入库存" style="width: 80%;" />
                    </template>

                    <template v-if="column.dataIndex === 'price'">
                        <div> price: {{ record.price }} </div>
                        <a-input-number :controls="false" :precision="0" v-model:value="record.price"
                            placeholder="请输入价格" style="width: 80%;" />
                    </template>

                    <template v-if="column.dataIndex === 'specialPrice'">
                        <div> specialPrice: {{ record.specialPrice }} </div>
                        <a-input-number :controls="false" :precision="0" v-model:value="record.specialPrice"
                            placeholder="请输入促销价" style="width: 80%;" />
                    </template>

                    <template v-if="column.dataIndex === 'specialDate'">
                        <div> specialDate: {{ record.specialDate }} </div>
                        <a-range-picker v-model:value="record.specialDate" style="width: 80%;" />
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
    </div>
</template>

<script setup>
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from 'ant-design-vue';
import EventBus from "~/utils/event-bus";

const { state: lazadaAttrsState, setSkuTable } = useLadazaAttrs();

const theme = reactive({
    themeOne: [],
    themeTwo: [],
}); // 主题
const tableData = ref([]);
const { selectTheme, skuAttrs, } = toRefs(lazadaAttrsState);
const columns = computed(() => {
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
            return baseColumns = [
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
        }
    };
    getColumns();
    return [
        ...baseColumns,
    ];
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
                ...tableData.value[index],
                fileList: [],
                ...item,
            }
        })
    }
};
watch(() => lazadaAttrsState.shortCode, () => {
    tableData.value = [];
}, { deep: true });
watch(() => tableData.value, (newVal) => {
    setSkuTable(newVal);
}, { deep: true });

// 一键生成
const generateSKU = (column) => {

};
//  批量
// 移除SKU
const delRow = (index) => {
    tableData.value.splice(index, 1);
    EventBus.emit('delRow', tableData.value);
};

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
