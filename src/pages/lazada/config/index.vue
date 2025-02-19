<template>
    <div>
        <Search :depOptions="depOptions" @search="handleSearch" v-model:modelValue="searchLoading" pageField="current">
        </Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="getAccountlist" :init-search-param="initSearchParam"
            :row-selection="rowSelection">
            <template #leftBar>
                <a-button type="primary" @click="handleAdd">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    新增</a-button>
                <a-button type="primary" @click="handleEdit" :disabled="singleDisabled" style="margin-left: 10px;">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    修改
                </a-button>
                <a-button type="primary" danger @click="handleDel" :disabled="singleDisabled"
                    style="margin-left: 10px;">
                    <template #icon>
                        <DeleteOutlined />
                    </template>
                    删除</a-button>
            </template>
            <template #userId="{ record }">
                {{ hideUser(record.userId) }}
            </template>
            <template #account="{ record }">
                <div class="flex flex-wrap">
                    <div v-for="(item, index) in accountRow(record.account)" :key="index">
                        <a-tag color="#108ee9" style="margin-right: 5px; margin-top: 5px;" v-if="getsimpleName(item)">{{
                            getsimpleName(item) }}
                        </a-tag>
                    </div>
                </div>
            </template>
            <template #depId="{ record }">
                <a-cascader :value="findParentAndMerge(record.depId, depOptions)" :options="depOptions" :disabled="true"
                    :fieldNames="{ label: 'deptName', value: 'deptId' }" :allowClear="true">
                </a-cascader>
            </template>
        </BaseTable>

        <AddModal ref="addModalRef" @success="reload"></AddModal>
        <EditModal ref="editModalRef" @success="reload"></EditModal>
    </div>
</template>

<script setup>
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import { getAccountlist, getAccountUser, lazadaAccount, getUserDep, delAccount } from './api';
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
    platform: 'Lazada',
};
function hideUser(id) {
    let msg = []
    if (id.indexOf(',') !== -1) {
        id.split(',').forEach(value => {
            accountUserLsit.value.forEach(s => {
                if (value == s.userId) {
                    msg.push(s.userName)
                }
            })
        })
    } else {
        accountUserLsit.value.forEach(s => {
            if (id == s.userId) {
                msg.push(s.userName)
            }
        })
    }
    return msg.join()
};

const accountRow = (account) => {
    if (!account) return [];
    return account.split(',').filter(Boolean)
};
const getsimpleName = (v) => {
    let msg = '';
    accountOptions.value.forEach(value => {
        if (v == value.shortCode) {
            msg = value.simpleName
        }
    });
    return msg
};
async function getAccountUserList() {
    const res = await getAccountUser({
        userName: ''
    });
    if (res.code === 200) {
        accountUserLsit.value = res.data || [];
    }
};
async function gerLazadaAccount() {
    lazadaAccount({ userName: '' }).then(res => {
        accountOptions.value = res.data;
    })
};
//部门列表
function getUserDepList() {
    getUserDep().then(res => {
        if (res.code === 200) {
            depOptions.value = res.data || [];
        }
    })
};

//  重新刷新
const reload = () => {
    baseTableEl.value.reload();
    clearSelection();
};
// 查询
const handleSearch = async (state) => {
    await baseTableEl.value.search({
        userId: state.userId,
        depId: state.depId && state.depId[state.depId.length - 1],
    });
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
    getAccountUserList();
    gerLazadaAccount();
    getUserDepList();
})
</script>