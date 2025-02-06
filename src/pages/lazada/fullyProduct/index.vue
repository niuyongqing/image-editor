<template>
    <div>
        <Search :shortCodes="shortCodes" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam"
            :row-selection="rowSelection" show-right-pagination rowKey="itemId" resultField="rows[0].productList">
            <template #leftBar>
                <div class="flex">
                    <div v-for="btn in buttons" :key="btn.id" class="ml-10px"
                        :class="[active === btn.id ? 'active' : '']">
                        <a-button type="link" :color="active === btn.status ? '#428bca' : '#737679'"
                            @click="handleBtnClick(btn)">{{
                                `${btnName(btn.name)}(${btn.count})`
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
                <div flex>
                    <p style="color: rgb(153, 153, 153)"> 「{{ shopSimpleName(record) }}」 </p>
                    <div class="isGobal" v-if="record.bizSupplement && record.bizSupplement.globalPlusProductStatus">
                        <a-tooltip placement="top">
                            <template #title>
                                <span>已升级Plus升级产品</span>
                            </template>
                            <a-tag>Plus</a-tag>
                        </a-tooltip>
                    </div>
                </div>
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
                        <div class="sku-price">
                            <span>{{ item.price ? item.price : '-' }} </span>
                        </div>
                    </div>
                </div>
            </template>

            <template #special_price="{ record }">
                <div class="pb-30px">
                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                        <span> {{ item.special_price ? item.special_price : '-' }} </span>
                    </div>
                </div>
            </template>

            <template #quantity="{ record }">
                <div class="relative pb-30px">
                    <div class="record-sku-container">
                        <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                            <span> {{ item.quantity ? item.quantity : '-' }} </span>
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
                    <p class="date"> 创建: <span text-black> {{ timestampToDateTime(record.createdTime) }} </span> </p>
                    <p class="date"> 更新: <span text-black> {{ timestampToDateTime(record.updatedTime) }} </span> </p>
                    <p class="date"> 同步: <span text-black> {{ timestampToDateTime(record.syncTime) }} </span> </p>
                </div>
            </template>
            <template #action="{ record }">
                <div> <a-button type="link" @click="handleSync(record)"> 同步 </a-button> </div>
            </template>
        </BaseTable>
    </div>
</template>

<script setup>
import { SettingOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined, DownOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import { getList, accountCache, syncOne, deactivate } from './api';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { message, Modal } from 'ant-design-vue';
import { checkPermi, checkRole } from '~@/utils/permission/component/permission';
import { useClipboard } from '@v-c/utils';
import { timestampToDateTime } from './common';
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';

const { copy } = useClipboard();
const active = ref('ALL')
const searchFormState = ref({});
const tableData = ref([]);
const shortCodes = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const { singleDisabled, rowSelection, tableRow, selectedRows, clearSelection } = useTableSelection()
const initSearchParam = {
    prop: "created_time",
    order: "desc",
    productType: 2,
};
const nameMap = {
    'ALL': '全部',
    'Active': '在线',
    'InActive': '平台下架',
    'Suspended': '暂停',
    'Deleted': '删除',
}
const buttons = computed(() => {
    const resdata = baseTableEl.value?.resData ?? {};
    let state = [];
    if (resdata.rows) {
        state = resdata.rows[0].state ?? [];
    }
    const list = state.map((item, index) => {
        return {
            id: index,
            status: item.status,
            name: item.status,
            count: item.count,
        }
    });
    const sortedList = list.sort((a, b) => {
        const order = Object.keys(nameMap);
        return order.indexOf(a.status) - order.indexOf(b.status);
    });
    return sortedList;
});
const btnName = (name) => {
    return nameMap[name] || name;
};
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
//  编辑
const handleEdit = (record) => {
    const { itemId, productType } = record;
    window.open(`/platform/lazada/siteProduct/edit?itemId=${itemId}&productType=${productType}`, '_blank');
};
const handleReset = () => {
    baseTableEl.value.reset();
};
const handleBtnClick = (btn) => {
    active.value = btn.status;
    handleSearch({ ...initSearchParam, ...searchFormState.value, status: btn.status === 'ALL' ? '' : btn.status });
};
//  同步
const handleSync = (record) => {
    baseTableEl.value.setLoading(true);
    syncOne({ shortCode: record.shortCode, itemId: record.itemId })
        .then((res) => {
            if (res.code === 200) {
                message.success('同步成功');
                reload();
            } else {
                message.error(res.msg);
                baseTableEl.value.setLoading(false);
            }
        })
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
    margin-bottom: 4px;
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