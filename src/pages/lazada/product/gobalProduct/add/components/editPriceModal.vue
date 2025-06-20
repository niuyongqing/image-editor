<template>
    <div>
        <BaseModal title="修改价格" width="800px" @register="register" @close="handleClose" @submit="submit" showCancelBtn
            showSaveBtn>
            <a-table :columns="columns" :data-source="data" :pagination="false" bordered>
                <template #bodyCell="{ record, column }">
                    <template v-if="column.dataIndex === 'site'">
                        <div>
                            {{ record.site }}<span v-if="record.site === '默认'" class="required">*</span>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'salesPrice'">
                        <div>
                            <a-form-item-rest>
                                <a-input-number v-model:value="record.salesPrice" :controls="false" :precision="2" :min="0"
                                    :placeholder="type !== 'default' ? 'lazada自动转换' : ''" style="width: 80%;" />
                            </a-form-item-rest>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'retailPrice'">
                        <div>
                            <a-form-item-rest>
                                <a-input-number v-model:value="record.retailPrice" :precision="2" :min="0"
                                    :placeholder="type !== 'default' ? 'lazada自动转换' : ''" style="width: 80%;" />
                            </a-form-item-rest>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'postPrices'">
                        <div v-if="record.enSite === 'MY' || record.enSite === 'ID' || record.site === '默认'">
                            <a-form-item-rest>
                                <a-input-number v-model:value="record.postPrices" :precision="2" :min="0"
                                    :placeholder="type !== 'default' ? 'lazada自动转换' : ''" style="width: 80%;" />
                            </a-form-item-rest>
                        </div>
                        <div v-else>
                            --
                        </div>
                    </template>
                </template>
            </a-table>

            <div flex text-left pt-15px>
                <div>
                    <a-tag color="#108ee9"> 说明! </a-tag>
                </div>
                <div>
                    <span class="text-#999"> 1、价格币种可在Lazada后台【账号设置】设置 </span><br />
                    <span class="text-#999"> 2、各站点价格不填则按Lazada后台配置公式自动转换 </span>
                </div>
            </div>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import { message } from 'ant-design-vue';

const { checkedList } = defineProps({
    checkedList: {
        type: Array,
        default: () => [],
    },
});
const { state: lazadaAttrsState } = useLazadaGobalAttrs();
const emits = defineEmits(['success']);
const type = ref('default');

const columns = computed(() => {
    let postriceColumns = () => {
        return checkedList.length > 0 ? [
            {
                title: '不含邮价格',
                dataIndex: 'postPrices',
                align: 'center',
            },
        ] : []
    };
    return [
        {
            title: '地区',
            dataIndex: 'site',
            width: 300,
        },
        {
            title: '价格',
            dataIndex: 'retailPrice',
        },
        {
            title: '促销价',
            dataIndex: 'salesPrice',
        },
        ...postriceColumns(),
    ];
});

const dataSource = [
    {
        site: '印尼（IDR）',
        enSite: 'ID',
        salesPrice: undefined,
        retailPrice: undefined
    },

    {
        site: '菲律宾（PHP）',
        enSite: 'PH',
        salesPrice: undefined,
        retailPrice: undefined
    },

    {
        site: '泰国（THB）',
        enSite: 'TH',
        salesPrice: undefined,
        retailPrice: undefined
    },
    {
        site: '新加坡（SGD）',
        enSite: 'SG',
        salesPrice: undefined,
        retailPrice: undefined
    },
    {
        site: '越南（VND）',
        enSite: 'VN',
        salesPrice: undefined,
        retailPrice: undefined
    }
];

const data = ref([]);
const modelMethods = ref();

const register = (modal) => {
    modelMethods.value = modal;
};

const submit = () => {
    console.log('data', data.value);
    if (!data.value[0].retailPrice) {
        message.error('请填写价格');
        return
    };
    if (!data.value[0].salesPrice) {
        message.error('请填写促销价');
        return
    };
    if (checkedList.length > 0 && !data.value[0].postPrices) {
        message.error('请填写不含邮价格');
        return
    };
    if (checkedList.length > 0) {
        const dataFilter = data.value.filter((item, index) => {
            return [0, 1].includes(index)
        });
        // dataFilter中 站点价格、站点促销价和站点不含邮价格需同时填写或不填！
        let error = [];
        dataFilter.forEach((item) => {
            if (item.salesPrice && !item.retailPrice && !item.postPrices) {
                error.push(item)
            }
            if (item.salesPrice && item.retailPrice && !item.postPrices) {
                error.push(item)
            }
            if (item.salesPrice && !item.retailPrice && item.postPrices) {
                error.push(item)
            }

            if (!item.salesPrice && item.retailPrice && item.postPrices) {
                error.push(item)
            }
            if (!item.salesPrice && !item.retailPrice && item.postPrices) {
                error.push(item)
            }
            if (!item.salesPrice && !item.retailPrice && item.postPrices) {
                error.push(item)
            }
            return true
        });
        if (error.length > 0) {
            message.error('站点价格、站点促销价和站点不含邮价格需同时填写或不填！');
            return
        }
    }

    emits('success', data.value);
    modelMethods.value.closeModal();
};

const open = ({ record, checkedList }) => {
    console.log('record', record);

    const dataSourceFilter = dataSource.filter((item) => {
        return checkedList.includes(item.enSite)
    });
    const base = [
        {
            site: '默认',
            enSite: 'default',
            salesPrice: record.specialPrice,
            retailPrice: record.price,
            postPrices: record.postPrices
        },
        {
            site: '马来（MYR）',
            enSite: 'MY',
            salesPrice: record.my_sales_price,
            retailPrice: record.my_retail_price,
            postPrices: undefined
        },
    ];
    data.value = [...base, ...dataSourceFilter];
    modelMethods.value.openModal();
};
const handleClose = () => {

};

defineExpose({
    open,
})

</script>

<style lang="less" scoped>
.required {
    color: red;
    margin-left: 5px;
}
</style>