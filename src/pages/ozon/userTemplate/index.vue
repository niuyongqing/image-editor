<template>
    <div>
        <div flex gap-20px>
            <SideBar v-model:activeId="activeId" />
            <div w-full flex flex-col gap-12px pr-50px>
                <a-breadcrumb separator=">">
                    <a-breadcrumb-item>Ozon产品</a-breadcrumb-item>
                    <a-breadcrumb-item>富内容模板</a-breadcrumb-item>
                </a-breadcrumb>
                <a-card>
                    <a-form ref="ruleForm" :model="formData">
                        <a-form-item label="店铺账号" v-if="activeId !== 3">
                            <selectComm :options="shopAccount" :fieldObj="shopObj" @backSelectAll="selectAll"
                                @backSelectItem="selectItem"></selectComm>
                        </a-form-item>

                        <a-form-item label="搜索类型:">
                            <div class="fBox flex align-start gap-10px">
                                <a-button type="primary"> 模板名称 </a-button>
                            </div>
                        </a-form-item>
                        <a-form-item label="搜索内容：">
                            <div class="flex">
                                <div class="flex align-start">
                                    <a-input style="width: 400px;" v-model:value="formData.content"
                                        placeholder="请输入模板名称" clearable></a-input>
                                </div>
                                <a-button type="primary" class="ml-[10px]" @click="onSubmit()">查询</a-button>
                            </div>
                        </a-form-item>
                    </a-form>
                </a-card>

                <div flex justify-between>
                    <a-button type="primary" @click="handleDelete">批量删除</a-button>
                    <a-button type="primary" @click="navToCreateTemplate">创建模板</a-button>
                </div>

                <a-card>
                    <div flex justify-between items-center>
                        <div flex text-left pb-10px>
                            <div> <a-tag color="success"> 说明! </a-tag> </div>
                            <div>
                                <span class="text-#999"> 1、修改/删除模板不会对现有产品产生影响 </span><br />
                                <span class="text-#999"> 2、只能引用已开启状态的模板 </span>
                            </div>
                        </div>
                        <a-pagination size="small" v-model:current="paginations.pageNum"
                            v-model:pageSize="paginations.pageSize" :total="paginations.total" show-size-changer
                            show-quick-jumper :show-total="(total, range) => `第${range[0]}-${range[1]}条, 共${total}条`"
                            @change="handleChangePagination" />

                    </div>

                    <a-table :columns="columns" :data-source="tableData" rowKey="id" :loading="loading"
                        @change="handleChange" :pagination="{
                            current: paginations.pageNum,
                            pageSize: paginations.pageSize,
                            total: paginations.total,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            showTotal: (total, range) => `第${range[0]}-${range[1]}条, 共${total}条`
                        }" :row-selection="rowSelection">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'openAndClose'">
                                <a-switch :checked="record.openAndClose"
                                    @change="handleOpenAndClose(record)"></a-switch>
                            </template>
                            <template v-if="column.dataIndex === 'action'">
                                <a-button type="link" @click="handleEdit(record)">编辑</a-button>
                                <a-button type="link" @click="handleCopy(record)">复制</a-button>
                                <a-button type="link" @click="handleDelete(record)">删除</a-button>
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SideBar from './components/sideBar.vue';
import { accountCache } from "../config/api/product";
import { Modal } from 'ant-design-vue';

const columns = computed(() => {
    if (activeId.value === 3) {
        return [
            {
                title: '模板名称',
                dataIndex: 'templateName',
                key: 'templateName',
            },
            {
                title: '时间',
                dataIndex: 'createTime',
                key: 'createTime',
            },
            {
                title: '开启和关闭',
                dataIndex: 'openAndClose',
                key: 'openAndClose',
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
            },
        ]
    }
    return [
        {
            title: '模板名称',
            dataIndex: 'templateName',
            key: 'templateName',
        },

        {
            title: '引用模块',
            dataIndex: 'module',
            key: 'module',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ]
})

const selectedRowList = ref([]);
const rowSelection = {
    onChange: (_selectedRowKeys, selectedRows) => {
        selectedRowList.value = selectedRows;
    },
};

const shopObj = {
    fieldKey: "account",
    fieldLabel: "simpleName",
};
const sortObj = reactive({
    sortField: "created_time",
    sortType: "desc"
});

const shopAccount = ref([])
const formData = reactive({
    account: '',
    content: '',
});
const tableData = ref([])
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0,
});
const loading = ref(false)
const activeId = ref(1);

const selectItem = () => {
    console.log('selectItem');
};

const handleOpenAndClose = (record) => {
    console.log(record);
}

const getList = () => {
    console.log(tableData.value, sortObj, paginations, loading.value);
    // loading.value = true;
    // ozonDraftList({
    //     ...formData,
    //     ...sortObj,
    //     pageNum: paginations.pageNum,
    //     pageSize: paginations.pageSize
    // })
    //     .then((res) => {
    //         tableData.value =
    //             res?.rows.map((item) => {
    //                 item.show = false;
    //                 return item;
    //             }) || [];
    //         paginations.total = res?.total || 0;
    //     })
    //     .finally(() => {
    //         loading.value = false;
    //     });
};

const selectAll = () => {
    console.log('selectAll');
    formData.account = ""
    getList();
};

const handleChange = (pagination) => {
    loading.value = true;
    paginations.pageNum = pagination.current;
    paginations.pageSize = pagination.pageSize;
    getList();
};

const handleChangePagination = (page, pageSize) => {
    paginations.pageNum = page;
    paginations.pageSize = pageSize;
    getList();
};

const handleEdit = (record) => {
    console.log(record);
}

const handleCopy = (record) => {
    console.log(record);
}

const handleDelete = (record) => {
    console.log(record);
    Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',

        onOk: () => {
            console.log('ok');
        },
        onCancel: () => {
            console.log('cancel');
        },
    });
};

const navToCreateTemplate = () => {
    window.open('/platform/ozon/addTemplate')
};

// 表单搜索
const onSubmit = () => { getList() };

// 店铺数据
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            shopAccount.value = res?.data ?? [];
            getList();
        }
    });
};

onMounted(() => {
    getAccount()
})
</script>
<style lang="less" scoped></style>