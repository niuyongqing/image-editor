<template>
    <div>
        <Task v-model:current="currentTask"></Task>
        <Search :shortCodes="shortCodes" @search="handleSearch"></Search>
        <TableAction @success="syncSuccess"></TableAction>

        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam" search
            :row-selection="rowSelection" show-right-pagination rowKey="itemId">
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
                        <span @click="copyText(record.itemId)"> {{ record.itemId }} </span>
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
                            <a-tooltip placement="top">
                                <template #title>
                                    <span>复制</span>
                                </template>
                                <span @click="copyText(item.price)"> {{ item.price }} </span>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </template>

            <template #special_price="{ record }">
                <div class="pb-30px">
                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                        <div>
                            <span @click="copyText(item.special_price)"> {{ item.special_price }} </span>
                        </div>
                    </div>
                </div>
            </template>

            <template #quantity="{ record }">
                <div class="relative pb-30px">
                    <div class="record-sku-container">
                        <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                            <div>
                                <span @click="copyText(item.quantity)"> {{ item.quantity }} </span>
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
                        {{ timestampToDateTime(record.createdTime) }}
                    </p>
                    <p class="date"> 更新: </p>
                    <p>
                        {{ timestampToDateTime(record.updatedTime) }}
                    </p>
                </div>
            </template>
            <template #action="{ record }">
                <div>
                    <div> <a-button type="link" @click="handleClaim(record)"> 认领 </a-button> </div>
                </div>
            </template>
        </BaseTable>
        <ClaimModal ref="claimModalRef" :account="account"></ClaimModal>
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
import Task from './components/task.vue';
import Search from './components/search.vue';
import TableAction from './components/tableAction.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import ClaimModal from './components/claimModal.vue';

const { copy } = useClipboard();
const currentTask = ref(0);
const searchFormState = ref({});
const tableData = ref([]);
const account = ref([]);
const shortCodes = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const claimModalEl = useTemplateRef('claimModalRef');
const { singleDisabled, rowSelection, tableRow, clearSelection } = useTableSelection()
const initSearchParam = {
    prop: "created_time",
    order: "desc",
    shortCode: 'TH1JHXJEGO'
};
const buttons = ref([{
    id: 1,
    name: '全部',
    count: 0,
},
{
    id: 2,
    name: '认领',
    count: 0,
}, {
    id: 3,
    name: '已认领',
    count: 0,
}]);
const active = ref(1);

const imageSrc = (record) => {
    if (record.images) {
        return JSON.parse(record.images)[0];
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
//  认领
const handleClaim = () => {
    claimModalEl.value.open();
};
// const handleReset = () => {
//     baseTableEl.value.reset();
// };

const handleBtnClick = (btn) => {
    active.value = btn.id;
};
//  同步
const syncSuccess = (record) => {
    reload();
};

// const 
onMounted(async () => {
    const accountCacheRes = await accountCache();
    if (accountCacheRes.code === 200) {
        let codes = [];
        for (const resKey in accountCacheRes.data.accountDetail) {
            codes.push(...accountCacheRes.data.accountDetail[resKey])
        };
        account.value = codes;
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