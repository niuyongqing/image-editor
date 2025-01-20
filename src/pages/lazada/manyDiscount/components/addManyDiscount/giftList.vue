<template>
    <div>
        <BaseModal @register="register" title="赠品列表" @submit="okTable" width="1200px">
            <a-alert message="1.请确保所选赠品/样品有充足库存，保证买家能够下单成功。" type="warning" showIcon :closable="false" />
            <a-alert message="2. Digital Goods 不能作为赠品/样品送出。" type="warning" showIcon :closable="false" />
            <a-alert message="3.此外，请确保主商品和赠品/样品在同一个仓库，否则优惠不生效。" type="warning" showIcon :closable="false" />
            <a-alert message="4. 卖家将默认承担赠品/样品的邮费" type="warning" showIcon :closable="false" />

            <a-card title="赠品列表" class="mt-10px">
                <template #extra>
                    <div style="float: right; margin-right: 10px;">
                        <a-input-group compact style="width: 650px;">
                            <a-select v-model:value="searchForm.selectionValue" placeholder="请选择" style="width: 120px;">
                                <a-select-option value="itemName">产品名称</a-select-option>
                                <a-select-option value="itemId">产品ID</a-select-option>
                            </a-select>
                            <a-input v-model:value="searchForm.inputValue" placeholder="请输入内容" style="width: 400px;" />
                            <a-button @click="searchTable">
                                <SearchOutlined />
                            </a-button>
                            <a-button @click="refrechTable" type="primary">
                                <ReloadOutlined></ReloadOutlined>
                            </a-button>
                        </a-input-group>
                    </div>
                </template>
                <a-table v-loading="loading" ref="mainTable"
                    :dataSource="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" rowKey="itemId"
                    bordered>
                    <template #expandedRowRender="{ record }">
                        <div pt-10px pb-10px pr-10px>
                            <a-table :columns="columns" :dataSource="record.skus" rowKey="skuId" bordered
                                :pagination="false">
                                <template #bodyCell="{ column, record: row }">
                                    <template v-if="column.dataIndex === 'checkbox'">
                                        <a-checkbox v-model:checked="row.select"></a-checkbox>
                                    </template>
                                    <template v-if="column.dataIndex === 'Include'">
                                        <a-switch v-model:checked="row.isSelect"></a-switch>
                                    </template>
                                </template>
                            </a-table>
                        </div>
                    </template>
                    <a-table-column title="产品名称" align="center">
                        <template #default="{ record }">
                            <div style="display: flex;">
                                <a-popover placement="right" trigger="hover">
                                    <template #content>
                                        <img :src="JSON.parse(record.images)" style="height: 400px; width: 400px;" />
                                    </template>
                                    <a-image style="width: 56px; height: 56px; border: 1px solid #ccc;"
                                        :src="JSON.parse(record.images)[0]"
                                        :preview-src-list="JSON.parse(record.images)">
                                        <template #placeholder>
                                            <div class="image-slot">加载中<span class="dot">...</span></div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot"><i class="anticon anticon-picture"></i></div>
                                        </template>
                                    </a-image>
                                </a-popover>
                                <div style="margin-left: 10px;">{{ record.itemName }}</div>
                            </div>
                        </template>
                    </a-table-column>
                    <a-table-column title="零售价格" align="center">
                        <template #default="{ record }">
                            <div>RM{{ record.minRetailPrice }} ~ RM{{ record.maxRetailPrice }}</div>
                        </template>
                    </a-table-column>
                    <a-table-column title="当前销售价" align="center">
                        <template #default="{ record }">
                            <div>RM{{ record.minPrice }} ~ RM{{ record.maxPrice }}</div>
                        </template>
                    </a-table-column>
                    <a-table-column title="当前库存" align="center">
                        <template #default="{ record }">
                            <div>{{ record.totalStock }}</div>
                        </template>
                    </a-table-column>
                </a-table>
            </a-card>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import EventBus from "~/utils/event-bus";
import { lazadaProductList } from '@/pages/lazada/regularCoupons/api';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { message } from 'ant-design-vue';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';

const modalMethods = ref({});
const columns = [
    {
        title: '',
        dataIndex: 'checkbox',
    },
    {
        title: 'sellerSku',
        dataIndex: 'sellerSku',
    }, {
        title: 'retailPrice',
        dataIndex: 'retailPrice',
    },
    {
        title: 'salePrice',
        dataIndex: 'salePrice',
    }, {
        title: 'stock',
        dataIndex: 'stock',
    }, {
        title: 'Include',
        dataIndex: 'Include',
    },
];
const props = defineProps({
    notInItemIdList: {
        type: Array,
        default: () => null,
    },
    shortCode: {
        type: String,
        default: '',
    },
    resetSetMenu: {
        type: String,
        default: '',
    },
});

const index = ref(null);
const heightX = ref(`${window.innerHeight - 600}px`);
const loading = ref(true);
const dialogVisible = ref(false);
const fullscreen = ref(true);
const currentPage = ref(1);
const pageSize = ref(50);
const total = ref(0);
const tableData = ref([]);
const oldTableData = ref([]);
const selectTable = ref([]);
const searchForm = ref({
    inputValue: '',
    selectionValue: 'itemName',
});
const { rowSelection } = useTableSelection();
onMounted(() => {

    EventBus.on('GiftList', (evt) => {
        console.log('---');
        const sampleArr = evt.sampleArr;
        const idx = evt.index;
        index.value = idx;
        selectTable.value = sampleArr;
        loading.value = true;
        getLazadaProductList();
        modalMethods.value.openModal();
        // dialogVisible.value = true;
    });
});

const searchTable = () => {
    if (searchForm.value.selectionValue === 'itemName') {
        tableData.value = oldTableData.value.filter((v) => v.itemName === searchForm.value.inputValue);
    }
    if (searchForm.value.selectionValue === 'itemId') {
        tableData.value = oldTableData.value.filter((v) => v.itemId === searchForm.value.inputValue);
    }
};
const refrechTable = () => {
    searchForm.value.inputValue = '';
    searchForm.value.selectionValue = 'itemName';
    getLazadaProductList([]);
};

const handleSizeChange = (val) => {
    pageSize.value = val;
};

const handleCurrentChange = (val) => {
    currentPage.value = val;
};

const getLazadaProductList = () => {
    const data = {
        shortCode: props.shortCode,
        notInItemIdList: [],
    };
    lazadaProductList(data).then((res) => {
        if (res.code === 200) {
            tableData.value = res.rows;
            oldTableData.value = res.rows;
            tableData.value.forEach((value) => {
                value.skus.forEach((s) => {
                    selectTable.value.forEach((v) => {
                        if (s.skuId === v.skuId) {
                            s.select = v.select;
                        }
                    });
                });
            });
            total.value = res.total;
            loading.value = false;
        }
    });
};
const okTable = () => {
    const data = [];
    tableData.value.forEach((value) => {
        value.skus.forEach((v) => {
            if (v.select) {
                v.productId = value.itemId;
                data.push(v);
            }
        });
    });
    if (data.length === 0) {
        message.error('请至少选择一个SKU');
        return false;
    } else if (data.length > 5) {
        message.error('已选择的SKU数量过多，最多不可超过五个！');
        return false;
    };
    console.log('data ->>', data, index.value);
    EventBus.emit('selectionGift', { selectionGiftData: data, index: index.value });
    // window.$bus.$emit('selectionGift', { selectionGiftData: data, index: index.value });
    modalMethods.value.closeModal();
};

const handleClose = () => {
    tableData.value = [];
    oldTableData.value = [];
    searchForm.value.selectionValue = 'itemName';
    searchForm.value.inputValue = '';
};

const register = (modal) => {
    modalMethods.value = modal;
}

const open = () => {
    modalMethods.value.openModal();
};

defineExpose({
    open
})
</script>