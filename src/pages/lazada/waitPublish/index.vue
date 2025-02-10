<template>
    <div>
        <Search :shortCodes="shortCodes" @search="handleSearch"></Search>
        <TableAction @success="reload" :selectedRows="selectedRows"></TableAction>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam"
            :row-selection="rowSelection" show-right-pagination rowKey="id">
            <template #leftBar>
                <div class="flex">
                    <div v-for="btn in buttons" :key="btn.id" class="ml-10px"
                        :class="[active === btn.id ? 'active' : '']">
                        <a-button type="link" :color="active === btn.id ? '#428bca' : '#737679'"
                            @click="handleBtnClick(btn)">{{
                                `${btn.name}(${btn.count})`
                            }}</a-button>
                    </div>
                </div>
            </template>
            <template #Images="{ record }">
                <a-image v-if="imageSrc(record)" :src="imageSrc(record)" :width="70"></a-image>
            </template>
            <template #attrs="{ record }">
                <p> {{ record.attributes.name }} </p>
                <p style="color: rgb(35, 82, 124); cursor: pointer;">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>复制</span>
                        </template>
                        <span @click="copyText(record.id)"> {{ record.id }} </span>
                    </a-tooltip>
                </p>
                <p style="color: rgb(153, 153, 153)"> 「{{ shopSimpleName(record) }}」 </p>
            </template>

            <template #skus="{ record }">
                <div class="record-sku-container pb-30px">
                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                        <div>
                            <a-tooltip placement="top">
                                <template #title>
                                    <span>复制</span>
                                </template>
                                <span @click="copyText(item.SellerSku)"> {{ item.SellerSku }} </span>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </template>

            <template #price="{ record }">
                <div class="pb-30px">
                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                        <div>
                            <span> {{ item.retail_price ? item.retail_price : '-' }} </span>
                        </div>
                    </div>
                </div>
            </template>

            <template #special_price="{ record }">
                <div class="pb-30px">
                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                        <div>
                            <span> {{ item.sales_price ? item.sales_price : '-' }} </span>
                        </div>
                    </div>
                </div>
            </template>

            <template #quantity="{ record }">
                <div class="relative pb-30px">
                    <div class="record-sku-container">
                        <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                            <div>
                                <span> {{ item.quantity ? item.quantity : '-' }} </span>
                            </div>
                        </div>
                    </div>
                    <div v-if="record.skus.length > 5" class="w-full flex flex-end flex-end more">
                        <a-button type="link" @click="record.show = !record.show">{{ !record.show ? '展开' : '收起' }}
                        </a-button>
                    </div>
                </div>
            </template>
            <template #date="{ record }">
                <div>
                    <p class="date"> 创建： </p>
                    <p>
                        {{ timestampToDateTime(record.createTime) }}
                    </p>
                    <p class="date"> 更新: </p>
                    <p>
                        {{ timestampToDateTime(record.updateTime) }}
                    </p>
                </div>
            </template>
            <template #action="{ record }">
                <div>
                    <div> <a-button type="link" @click="handleEdit(record)"> 编辑 </a-button> </div>
                    <div> <a-button type="link" @click="handlePublish(record)"> 发布 </a-button> </div>
                    <div class="pl-2">
                        <a-dropdown>
                            <a class="ant-dropdown-link">
                                更多
                                <DownOutlined />
                            </a>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item @click="handleRemark(record)">
                                        添加备注
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </div>
            </template>
        </BaseTable>
        <RemarkModal ref="remarkModalRef"></RemarkModal>
    </div>
</template>

<script setup>
import { SettingOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import { getList, accountCache } from './api';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { message } from 'ant-design-vue';
import { checkPermi, checkRole } from '~@/utils/permission/component/permission';
import { useClipboard } from '@v-c/utils';
import { timestampToDateTime } from './common';
import Search from './components/search.vue';
import TableAction from './components/tableAction.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import RemarkModal from './components/remarkModal.vue';

const route = useRoute();
const { copy } = useClipboard();
const type = ref(false); // 是否是全球商品
const searchFormState = ref({});
const tableData = ref([]);
const shortCodes = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const remarkModalEl = useTemplateRef('remarkModalRef');
const { singleDisabled, rowSelection, tableRow, selectedRows, clearSelection } = useTableSelection()
const initSearchParam = {
    prop: "created_time",
    order: "desc",
    shortCodes: [],
    name: '',
    sku: ''
};
const buttons = ref([{
    id: 1,
    name: '在线',
    count: 0,
},
{
    id: 2,
    name: '已下架',
    count: 0,
}, {
    id: 3,
    name: '审核中',
    count: 0,
}, {
    id: 4,
    name: '平台下架',
    count: 0,
}, {
    id: 5,
    name: '删除',
    count: 0,
}]);
const active = ref(1)
const more = ref(true); // 是否显示全部
const accreditAuth = computed(() => {
    return checkPermi(['system:platform:lazada:accredit']) || checkRole('admin');
});
const isSimpleName = computed(() => {
    return checkPermi(['system:platform:lazada:simpleName']);
});
const isAliasEdit = computed(() => {
    return checkPermi(['system:platform:lazada:alias']);
});
const isRemark = computed(() => {
    return checkPermi(['system:platform:lazada:remark']);
});

const imageSrc = (record) => {
    if (record.images) {
        return JSON.parse(record.images).image[0];
    };
    return ''
};

const shopSimpleName = (record) => {
    const findItem = shortCodes.value.find((item) => {
        return item.shortCode === record.shortCode
    });
    return findItem ? findItem.simpleName : ''
};
// 复制
const copyText = (text) => {
    copy(text);
    message.success(`复制成功：${text}`);
};
const displayedSkus = (record) => {
    return record.show ? record.skus : record.skus.slice(0, 5);
};

//  重新刷新
const reload = () => {
    baseTableEl.value.reload();
    clearSelection();
};
// 查询
const handleSearch = async (state) => {
    searchFormState.value = state;
    await baseTableEl.value.search(state);
};
//  编辑
const handleEdit = (record) => {
    const { id, type } = record;
    window.open(`/platform/lazada/waitPublish/edit?id=${id}&type=${type === 'global' ? 'global' : 'site'}`, '_blank');
};

// 发布
const handlePublish = (record) => {
    window.open(`/platform/lazada/waitPublish/publish?id=${record.id}`, '_blank');
};

const handleReset = () => {
    baseTableEl.value.reset();
};

const handleBtnClick = (btn) => {
    active.value = btn.id;
    // handleSearch({ ...initSearchParam, ... searchFormState.value, status: btn.id });
};

//   复制为“六合一产品”
const handleProduct = (record) => {
    console.log('record', record);
};
//    复制为“站点产品”
const handleCopyProduct = (record) => {
    console.log('record', record);
};
//   添加备注
const handleRemark = (record) => {
    console.log('record', record, remarkModalEl.value);
    remarkModalEl.value.open(record);
};

onMounted(async () => {
    const accountCacheRes = await accountCache();
    if (accountCacheRes.code === 200) {
        let codes = [];
        for (const resKey in accountCacheRes.data.accountDetail) {
            codes.push(...accountCacheRes.data.accountDetail[resKey])
        };
        shortCodes.value = [
            {
                "shortCode": "",
                "simpleName": "全部",
            },
            ...codes
        ]
    };

});
</script>
<style scoped lang="less">
.record-sku-container {
    width: 100%;
}

.record-sku {
    color: rgb(35, 82, 124);
    cursor: pointer;
    border-bottom: 1px dashed #e8e8e8;
    padding-bottom: 6px;
}

.date {
    color: #999;
}

.more {
    position: absolute;
    height: 30px;
    bottom: 0px;
    display: flex;
    justify-content: end;
}

.active {
    color: #1890ff;
    padding-bottom: 8px;
    border-bottom: 2px solid #1890ff;
}
</style>