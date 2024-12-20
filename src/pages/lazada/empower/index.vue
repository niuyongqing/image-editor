<template>
    <div>
        <Search :area="area" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="empowerList" :init-search-param="initSearchParam" search
            :row-selection="rowSelection">
            <template #leftBar>
                <a-button type="primary" @click="Reauthorization" v-has-permi="[`system:platform:lazada:accredit`]"
                    :loading="accreditLoading">
                    <template #icon>
                        <SettingOutlined />
                    </template>
                    授权</a-button>

                <a-popconfirm title="确定要全部刷新授权吗？" ok-text="是" cancel-text="否" @confirm="refreshToken">
                    <a-button type="primary" v-has-permi="[`system:platform:lazada:accredit`]">
                        <template #icon>
                            <ReloadOutlined />
                        </template>
                        刷新全部授权</a-button>
                </a-popconfirm>

                <a-button type="primary" @click="handleBatchName" v-has-permi="[`platform:lazada:accredit`]">
                    <template #icon>
                        <CloudUploadOutlined />
                    </template>
                    批量修改简称
                </a-button>
                <a-button type="primary" @click="handleBatchStore" v-has-permi="[`system:platform:lazada:accredit`]">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    批量修改仓库
                </a-button>
                <a-button type="primary" @click="handleExport" v-has-permi="[`system:platform:lazada:accredit`]">
                    <template #icon>
                        <DownloadOutlined />
                    </template>
                    导出
                </a-button>
            </template>
            <template #country="{ record }">
                <span> {{ countryMap(record.country) }} </span>
            </template>
            <template #store="{ record }">
                <a-select style="width: 100%;" :options="store" v-model:value="record.store"
                    @change="handleChangeStore(record)" :disabled="!accreditAuth"></a-select>
            </template>
            <template #simpleName="{ record }">
                <a-input v-if="isSimpleName" style="width: 100%;" v-model:value="record.simpleName"
                    @blur="handleChangeName(record)"></a-input>
                <span v-else> {{ record.simpleName }}</span>
            </template>
            <template #alias="{ record }">
                <a-input v-if="isAliasEdit" style="width: 100%;" v-model:value="record.alias"
                    @blur="handleChangeAlias(record)"></a-input>
                <span v-else> {{ record.alias }}</span>
            </template>

            <template #remark="{ record }">
                <a-input v-if="isRemark" style="width: 100%;" v-model:value="record.remark"
                    @blur="handleChangeRemark(record)"></a-input>
            </template>
        </BaseTable>

        <AddModal ref="addModalRef" @success="reload"></AddModal>
        <EditModal ref="editModalRef" @success="reload"></EditModal>
        <!-- 批量修改简称 -->
        <batchSimpleName ref="batchSimpleNameRef" @success="reload"></batchSimpleName>
        <!-- 批量修改仓库 -->
        <batchStore ref="batchStoreRef" @success="reload"></batchStore>
    </div>
</template>

<script setup>
import { SettingOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import { empowerList, editStore, simpleName, alias, remark, url, refreshAllToken, exportList } from './api';
import { findParentAndMerge } from './common';
import AddModal from './components/addModal.vue';
import EditModal from './components/editModal.vue';
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { Modal, message } from 'ant-design-vue';
import { checkPermi, checkRole } from '~@/utils/permission/component/permission';
import batchSimpleName from './components/batchSimpleName.vue';// 批量修改简称
import batchStore from './components/batchStore.vue';// 批量修改仓库
// import downLoad from '@/api/download';

const accreditLoading = ref(false); // 授权按钮 loading
const refreshLoading = ref(false); // 刷新按钮 loading
const accountUserLsit = ref([]);
const accountOptions = ref([]);
const depOptions = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const addModalEl = useTemplateRef('addModalRef');
const editModalEl = useTemplateRef('editModalRef');
const batchSimpleNameEl = useTemplateRef('batchSimpleNameRef');
const batchStoreEl = useTemplateRef('batchStoreRef');
const { singleDisabled, rowSelection, tableRow, clearSelection } = useTableSelection()
const initSearchParam = {
    prop: "create_time",
    order: "desc"
};
const area = [
    {
        label: "印度尼西亚",
        value: "id"
    },
    {
        label: "菲律宾",
        value: "ph"
    },
    {
        label: "越南",
        value: "vn"
    },
    {
        label: "泰国",
        value: "th"
    },
    {
        label: "马来西亚",
        value: "my"
    },
    {
        label: "新加坡",
        value: "sg"
    },
];

const store = [
    {
        "value": "0",
        "label": "总仓",
    },
    {
        "value": "1",
        "label": "馨拓靓仓(配饰,服饰类)",
    },
    {
        "value": "2",
        "label": "菲律宾本土仓",
    },
    {
        "value": "3",
        "label": "馨拓美仓(美妆类)",
    },
    {
        "value": "4",
        "label": "馨拓美仓(3C类)",
    },
    {
        "value": "5",
        "label": "馨拓美仓(汽摩配类)",
    },
    {
        "value": "6",
        "label": "泰国本土仓",
    },
];

const countryMap = (v) => {
    const value = area.find(item => {
        return item.value === v
    });
    return value ? value.label : '';
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

const handleChangeStore = (record) => {
    editStore({
        store: record.store,
        shortCode: record.shortCode
    }).then(res => {
        if (res.code === 200) {
            message.success(res.msg);
        }
    })
};
const handleChangeName = (record) => {
    simpleName(record).then((res) => {
        if (res.code === 200) {
            message.success(res.msg);
        }
    })
};

const handleChangeAlias = (record) => {
    alias(record).then((res) => {
        if (res.code === 200) {
            message.success(res.msg);
        }
    })
};

const handleChangeRemark = (record) => {
    remark(record).then((res) => {
        if (res.code === 200) {
            message.success(res.msg);
        }
    })
}

//  重新刷新
const reload = () => {
    baseTableEl.value.reload();
    clearSelection();
};
// 查询
const handleSearch = async (state) => {
    await baseTableEl.value.search(state);
};


// 重新授权
const Reauthorization = () => {
    // 获取授权链接
    accreditLoading.value = true;
    url().then(res => {
        window.location.href = res.msg;
    }).finally(() => {
        accreditLoading.value = false;
    });
};

// 刷新全部授权
const refreshToken = () => {
    refreshLoading.value = true;
    refreshAllToken().then(res => {
        message.success(res.msg);
        refreshLoading.value = false;
    })
};

const handleBatchName = () => {
    batchSimpleNameEl.value.open();
};


const handleBatchStore = () => {
    batchStoreEl.value.open();
};
const handleExport = () => {
    exportList().then(res => {
        console.log('res', res);
        // downLoad.name(res.msg, true);
    })
};

onMounted(() => {
})
</script>