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
                            <a-input-number v-model:value="record.salesPrice" :controls="false" :precision="2" :min="0"
                                :placeholder="type !== 'default' ? 'lazada自动转换' : ''" style="width: 80%;" />
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'retailPrice'">
                        <div>
                            <a-input-number v-model:value="record.retailPrice" :precision="2" :min="0"
                                :placeholder="type !== 'default' ? 'lazada自动转换' : ''" style="width: 80%;" />
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

const { state: lazadaAttrsState } = useLazadaGobalAttrs();
const emits = defineEmits(['success']);
const type = ref('default');
const columns = [
    {
        title: '地区',
        dataIndex: 'site',
        width: 300,
    },
    {
        title: '优惠卷',
        dataIndex: 'salesPrice',
    },
    {
        title: '销售价',
        dataIndex: 'retailPrice',
    }
];

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
            salesPrice: record.price,
            retailPrice: record.specialPrice
        },
        {
            site: '马来（MYR）',
            enSite: 'MY',
            salesPrice: undefined,
            retailPrice: undefined
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