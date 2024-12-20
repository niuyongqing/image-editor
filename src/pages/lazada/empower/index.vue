<template>
    <div>
        <Search :area="area" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="empowerList" :init-search-param="initSearchParam" search
            :row-selection="rowSelection">
            <template #leftBar>
                <a-button type="primary" @click="handleAdd">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    授权</a-button>
                <a-button type="primary" @click="handleEdit">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    修改
                </a-button>
                <a-button type="primary" @click="handleDel">
                    <template #icon>
                        <ReloadOutlined />
                    </template>
                    刷新全部授权</a-button>
                <a-button type="primary" @click="handleDel">
                    <template #icon>
                        <CloudUploadOutlined />
                    </template>
                    批量修改简称
                </a-button>
                <a-button type="primary" @click="handleDel">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    批量修改仓库
                </a-button>
                <a-button type="primary" @click="handleDel">
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
                    @change="handleChangeStore(record)" :disabled="checkPermiDisabled()"></a-select>
            </template>
            <template #simpleName="{ record }">
                <a-input style="width: 100%;" v-model:value="record.simpleName"
                    @blur="handleChangeName(record)"></a-input>
            </template>
            <template #alias="{ record }">
                <a-input style="width: 100%;" v-model:value="record.alias" @blur="handleChangeAlias(record)"></a-input>
            </template>

            <template #remark="{ record }">
                <a-input style="width: 100%;" v-model:value="record.remark"
                    @blur="handleChangeRemark(record)"></a-input>
            </template>


        </BaseTable>

        <AddModal ref="addModalRef" @success="reload"></AddModal>
        <EditModal ref="editModalRef" @success="reload"></EditModal>
    </div>
</template>

<script setup>
import { PlusOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import {
    empowerList,
    editStore,
    simpleName,
    alias,
    remark
} from './api';
import { findParentAndMerge } from './common';
import AddModal from './components/addModal.vue';
import EditModal from './components/editModal.vue';
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { Modal, message } from 'ant-design-vue';

const searchLoading = ref(false);
const accountUserLsit = ref([]);
const accountOptions = ref([]);
const depOptions = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const addModalEl = useTemplateRef('addModalRef');
const editModalEl = useTemplateRef('editModalRef');
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
    searchLoading.value = false;
};

// 新增
const handleAdd = () => {
    nextTick(() => {
        addModalEl.value.open();
    })
};
// 编辑
const handleEdit = () => {
    nextTick(() => {
        editModalEl.value.open(tableRow.value);
    })
};
// 删除
const handleDel = () => {
    Modal.confirm({
        title: '提示',
        content: '确定删除吗？',
        onOk: () => {
            return new Promise((resolve, reject) => {
                delAccount({
                    id: tableRow.value.id
                },).then((res) => {
                    if (res.code === 200) {
                        reload();
                        resolve();
                        message.success(res.msg);
                    }
                }).catch(() => {
                    reject();
                });
            });
        }
    });

};

onMounted(() => {

})
</script>