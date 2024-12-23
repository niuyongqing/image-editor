<template>
    <div>
        <Search :shortCodes="shortCodes" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getList" :init-search-param="initSearchParam" search
            :row-selection="rowSelection" show-right-pagination>
            <template #leftBar>
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
                <div>
                    <div style="color: rgb(35, 82, 124); cursor: pointer;  " v-for="(item, index) in record.skus"
                        :key="index">
                        <div v-show="more ? index <= 4 : index">
                            <a-tooltip placement="top">
                                <template #title>
                                    <span>复制</span>
                                </template>
                                <span @click="copyText(item.SellerSku)"> {{ item.SellerSku }} </span>
                            </a-tooltip>
                        </div>
                    </div>
                    <div v-if="record.skus.length > 5" class="w-full flex flex-end">
                        <a-button type="link" @click="showMore(record)">展开 </a-button>
                    </div>
                </div>
            </template>

        </BaseTable>
    </div>
</template>

<script setup>
import { SettingOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import { getList, accountCache } from './api';
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { message } from 'ant-design-vue';
import { checkPermi, checkRole } from '~@/utils/permission/component/permission';
import { useClipboard } from '@v-c/utils'
const { copy } = useClipboard()
const tableData = ref([]);
const shortCodes = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const { singleDisabled, rowSelection, tableRow, clearSelection } = useTableSelection()
const initSearchParam = {
    prop: "created_time",
    order: "desc",
    shortCode: 'TH1JHXJEGO'
};

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
        return JSON.parse(record.images)[0];
    };
    return ''
};

const shopSimpleName = (record) => {
    const findItem = shortCodes.value.find((item) => {
        return item.shortCode === record.shortCode
    })
    return findItem.simpleName
};
// 复制
const copyText = (text) => {
    copy(text);
    message.success(`复制成功：${text}`);
};

const showMore = (record) => {
    more.value = !more.value;
};

//  重新刷新
const reload = () => {
    baseTableEl.value.reload();
    clearSelection();
};
// 查询
const handleSearch = async (state) => {
    await baseTableEl.value.search(state);
};

// const 
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