<template>
    <div>
        <div flex gap-20px>
            <SideBar v-model:activeId="activeId" @search="getList" />
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
                                    <a-input style="width: 400px;" v-model:value="formData.name" allowClear
                                        placeholder="请输入模板名称"></a-input>
                                </div>
                                <a-button type="primary" class="ml-[10px]" @click="onSubmit()">查询</a-button>
                            </div>
                        </a-form-item>
                    </a-form>
                </a-card>

                <div flex justify-between>
                    <a-button type="primary" @click="handleDelete"
                        :disabled="selectedRowList.length === 0">批量删除</a-button>
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
                            <template v-if="column.dataIndex === 'state'">
                                <a-switch :checked="record.state === 1" disabled></a-switch>
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
import { templateList, templateDelete } from "../config/api/userTemplate";
import { Modal, message } from 'ant-design-vue';


const shopObj = {
    fieldKey: "account",
    fieldLabel: "simpleName",
};
const selectedRowKeys = ref([]);
const selectedRowList = ref([]);
const rowSelection = computed(() => {
    return {
        selectedRowKeys: selectedRowKeys.value,
        onChange: (rowKeys, rows) => {
            selectedRowKeys.value = rowKeys; //只接收ID
            selectedRowList.value = rows; //接收每一行
        },
    };
});
const columns = computed(() => {
    return [
        {
            title: '模板名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '时间',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
        },
        {
            title: '开启和关闭',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ]
});


const shopAccount = ref([])
const formData = reactive({
    account: '',
    name: '',
});
const tableData = ref([])
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0,
});
const loading = ref(false)
const activeId = ref(1);

const selectItem = (e) => {
    formData.account = e;
    getList();
};

const getList = () => {
    console.log(tableData.value, paginations, loading.value);
    loading.value = true;
    templateList({
        ...formData,
        type: activeId.value,
        pageNum: paginations.pageNum,
        pageSize: paginations.pageSize
    })
        .then((res) => {
            tableData.value =
                res?.rows.map((item) => {
                    item.show = false;
                    return item;
                }) || [];
            paginations.total = res?.total || 0;
        })
        .finally(() => {
            loading.value = false;
        });
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
    if (activeId.value === 4) {
        // window.open(`/platform/ozon/editTemplate?type=${activeId.value}&id=${record.id}`, '_blank');
        return;
    }
    window.open(`/platform/ozon/editTemplate?type=${activeId.value}&id=${record.id}`, '_blank');
    console.log(record);
}

const handleCopy = (record) => {
    console.log(record);
}

const handleDelete = (record) => {
    Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: () => {
            const params = record ? [record.id] : selectedRowList.value.map(item => item.id);
            templateDelete(params).then(() => {
                message.success('删除成功');
                getList();
            })
        },
        onCancel: () => {
            console.log('cancel');
        },
    });
};

const navToCreateTemplate = () => {
    if (activeId.value === 4) { // 富文本模板创建
        // window.open(`/platform/ozon/productPublish`, '_blank');
        return;
    }
    window.open(`/platform/ozon/addTemplate?type=${activeId.value}`, '_blank');
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