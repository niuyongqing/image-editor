<template>
    <div id="empowerCont">
        <a-card>
            <a-form :model="formState" layout="inline" ref="formRef">
                <a-form-item label="账号：" name="account">
                    <a-input v-model:value="formState.account" />
                </a-form-item>
                <a-form-item label="别名：" name="alias">
                    <a-input v-model:value="formState.alias" />
                </a-form-item>
                <a-form-item label="简称：" name="simpleName">
                    <a-input v-model:value="formState.simpleName" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="onSearch">查询</a-button>
                    <a-button style="margin-left: 10px" @click="restForm">重置</a-button>
                </a-form-item>
            </a-form>
        </a-card>
        <a-card style="margin-top: 20px">
            <div>
                <a-row>
                    <a-col :span="1.5" style="margin: 0 5px"><a-button type="primary" @click="dialogTableVisible = true"
                            v-has-permi="[`system:platform:ozon:shop:add`]">新增店铺</a-button></a-col>
                    <a-col :span="1.5" style="margin: 0 5px"><a-button @click="editnameType = true" type="primary"
                            v-has-permi="[`system:platform:ozon:shop:update`]">批量修改简称</a-button></a-col>
                    <a-col :span="1.5" style="margin: 0 5px">
                        <a-button type="primary" @click="editWarehouseVisible = true"
                            v-has-permi="[`system:platform:ozon:shop:update`]">批量修改仓库</a-button>
                    </a-col>
                    <a-col :span="1.5" style="margin: 0 5px">
                        <a-button type="primary" @click="exportInfo"
                            v-has-permi="[`system:platform:ozon:shop:export`]">导出</a-button>
                    </a-col>
                </a-row>
            </div>
            <div style="margin-top: 20px">
                <a-table :row-selection="rowSelection" :columns="columns" :data-source="tableData"
                    :rowKey="(row) => row" bordered :pagination="false">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'classify'">
                            <a-select v-model:value="record.classify" style="width: 150px" :options="classifyList"
                                @change="editSimpleName(record)"></a-select>
                        </template>
                        <template v-if="column.dataIndex === 'forbidSale'">
                            <a-select v-model:value="record.forbidSale" style="width: 180px" mode="multiple"
                                :options="forbidSaleList" @change="editSimpleName(record)"
                                :max-tag-count="1"></a-select>
                        </template>
                        <template v-if="column.dataIndex === 'autoPublish'">
                            <a-switch v-model:checked="record.autoPublish" :checkedValue="1" :unCheckedValue="0"
                                checked-children="是" un-checked-children="否" @change="editSimpleName(record)" />
                        </template>

                        <template v-if="column.dataIndex === 'alias'">
                            <a-input v-model:value="record.alias" @blur.stop="editSimpleName(record)"></a-input>
                        </template>
                        <template v-if="column.dataIndex === 'store'">
                            <a-select v-model:value="record.store" style="width: 200px" :options="warehouse"
                                placeholder="目标仓储类别" @change="(e) => editMeansKeepGrain(e, record)"
                                :disabled="hasPermi"></a-select>
                            <!-- :disabled="checkPermiDisabled()" -->
                        </template>
                        <template v-if="column.dataIndex === 'simpleName'">
                            <a-input v-model:value="record.simpleName" @blur.stop="editSimpleName(record)"></a-input>
                        </template>
                        <template v-if="column.dataIndex === 'remark'">
                            <a-input v-model:value="record.remark" @blur.stop="editSimpleName(record)"></a-input>
                        </template>

                    </template>
                </a-table>
                <a-pagination style="margin-top: 20px;text-align: right;" :show-total="(total) => `共 ${total} 条`"
                    v-model:current="pages.pageNum" v-model:pageSize="pages.pageSize" :total="pages.total" class="pages"
                    :defaultPageSize="50" :showSizeChanger="true" :pageSizeOptions="[50, 100, 200]" @change="getList" />
            </div>
        </a-card>
        <a-modal title="新增店铺" :open="dialogTableVisible" :keyboard="false" :maskClosable="false" @ok="submitForm"
            @cancel="resetForm">
            <a-form :model="ruleForm" :rules="rules" ref="ruleFm" :labelAlign="'right'" :label-col="{
                style: {
                    width: '80px',
                },
            }">
                <a-form-item label="店铺账号:" name="account">
                    <a-input v-model:value="ruleForm.account" placeholder="请输入店铺账号"></a-input>
                </a-form-item>
                <a-form-item label="店铺ID:" name="clientId">
                    <a-input v-model:value="ruleForm.clientId" placeholder="请输入店铺ID"></a-input>
                </a-form-item>
                <a-form-item label="店铺秘钥:" name="apiKey">
                    <a-input v-model:value="ruleForm.apiKey" placeholder="请输入店铺秘钥"></a-input>
                    <span style="color: #a9a9a9">请参考格式：cf289f4b-c7fe-4b0f-9880-916848418afb</span>
                </a-form-item>
                <a-form-item label="店铺简称:" name="simpleName">
                    <a-input v-model:value="ruleForm.simpleName" placeholder="请输入店铺简称"></a-input>
                </a-form-item>
                <a-form-item label="店铺别名:" name="alias">
                    <a-input v-model:value="ruleForm.alias" placeholder="请输入店铺别名"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
        
        <simpleNameModal :editnameType="editnameType" @handelClose="handelClose"></simpleNameModal>

        <!--    批量修改仓库弹框-->
        <a-modal title="批量修改仓库" :width="'30%'" :open="editWarehouseVisible" @ok="uploadWarehouse"
            @cancel="editWarehouseVisible = false" :keyboard="false" :maskClosable="false">
            <a-descriptions :column="1">
                <a-descriptions-item label="示例">
                    <a-table :data-source="editWarehouseTypeTableData" style="width: 100%" bordered :pagination="false"
                        :columns="editWarehouseColumns">
                    </a-table>
                </a-descriptions-item>
                <a-descriptions-item label="上传">
                    <a-upload style="display: inline-block; margin-left: 10px" :action="uploadFileUrl2"
                        @change="handleUploadSuccess" ref="fileUploadWarehouseType" :headers="headers"
                        accept=".xlsx, .xlsm, .xls" :limit="1" :file-list="fileList" :auto-upload="false">
                        <a-button type="primary">选择EXCEL</a-button>
                    </a-upload>
                </a-descriptions-item>
            </a-descriptions>
        </a-modal>
    </div>
</template>

<script setup name='empower'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { list, meansAttribute, simpleNames, exportList, add } from "../config/api/empower";
import { message } from 'ant-design-vue';
import { checkPermi, checkRole } from "~/utils/permission/component/permission";
import tableHead from "../config/tabColumns/empower";
import commodityType from "../config/commDic/commodityType";
import download from "~/api/common/download";
import simpleNameModal from './comm/simpleNameModal.vue';

const formRef = ref(null)
const ruleFm = ref(null)
const upload = ref(null)
const formState = reactive({
    alias: "",
    simpleName: "",
    account: "",
});
const pages = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0
});
const warehouse = [
    {
        value: "0",
        label: "总仓",
    },
    {
        value: "1",
        label: "馨拓靓仓(配饰,服饰类)",
    },
    {
        value: "2",
        label: "菲律宾本土仓",
    },
    {
        value: "3",
        label: "馨拓美仓(美妆类)",
    },
    {
        value: "4",
        label: "馨拓美仓(3C类)",
    },
    {
        value: "5",
        label: "馨拓美仓(汽摩配类)",
    },
    {
        value: "6",
        label: "泰国本土仓",
    },
]
const ruleForm = reactive({
    account: "",
    clientId: "",
    apiKey: "",
    simpleName: "",
    alias: ""
})
const selectedRowKeys = ref([]);
const columns = tableHead;
const tableData = ref([]);
const classifyList = ref([]);
const forbidSaleList = ref([]);
const fileList = ref([]);
const dialogTableVisible = ref(false);
const editnameType = ref(false);
const editWarehouseVisible = ref(false);
const headers = {
    Authorization: "Bearer " + useAuthorization().value,
}
const uploadFileUrl = import.meta.env.VITE_APP_BASE_API + "/platform-ozon/platform/ozon/shop/import/simplename"
const uploadFileUrl2 =
    import.meta.env.VITE_APP_BASE_API +
    "/platform-ozon/platform/ozon/shop/import/store"


const editWarehouseColumns = [
    {
        title: '账号Code',
        dataIndex: 'id',
        key: 'id',
        align: "center"
    },
    {
        title: '仓库',
        dataIndex: 'type',
        key: 'type',
        align: "center"
    }
]
const rules = {
    account: [
        { required: true, message: "请输入店铺账号", trigger: "blur" },
    ],
    clientId: [
        { required: true, message: "请输入店铺ID", trigger: "blur" },
        {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
        },
    ],
    apiKey: [
        { required: true, message: "请输入店铺秘钥D", trigger: "blur" },
    ],
    simpleName: [
        { required: true, message: "请输入店铺简称", trigger: "blur" },
    ],
}
const rowSelection = {
    onChange: (selectedRow) => {
        selectedRowKeys.value = selectedRow;
    },
};
const hasPermi = computed(() => checkPermi(["system:platform:ozon:shop:update"]) || checkRole("admin"))
const getList = () => {
    const { alias, simpleName, account } = formState;
    let params = {
        pageNum: pages.pageNum,
        pageSize: pages.pageSize,
        prop: "create_time",
        order: "desc",
        alias,
        simpleName,
        account,
    }
    list(params).then(res => {
        tableData.value = res?.rows?.map(item => {
            item.forbidSale = item.forbidSale ? item.forbidSale.split(',').map((value) => { return Number(value) }) : []
            return item
        }) ?? [];
        pages.total = res?.total ?? 0;
    })
}
const handelClose = () => {
    editnameType.value = false
}
const onSearch = () => {
    getList();
}
const restForm = () => {
    formRef.value.resetFields();
    getList();
}
// 获取品类
const getMeansAttribute = () => {
    meansAttribute().then((res) => {
        forbidSaleList.value = res?.data.map((item) => ({
            value: item.id,
            label: item.attributes,
        })) ?? [];
    });
}

// 修改简称、别名、备注
const editSimpleName = (row) => {
    if (
        row.simpleName || row.alias || row.remark || row.store ||
        row.classify || row.forbidSale || row.autoPublish
    ) {
        const {
            id, store, simpleName, alias, remark,
            account, classify, forbidSale, autoPublish,
        } = row;
        const params = {
            id,
            store,
            simpleName,
            alias,
            remark,
            account,
            classify,
            forbidSale: forbidSale ? forbidSale.join(',') : '',
            autoPublish,
        };
        simpleNames(params).then((res) => {
            message.success(res.msg);
        }).finally(() => {
            getList();
        });
    }
}
const submitForm = () => {
    ruleFm.value
        .validate()
        .then(() => {
            add(ruleForm).then((res) => {
                message.success(res.msg);
                getList();
            }).finally(() => {
                dialogTableVisible.value = false;
                ruleFm.value.resetFields();
            });
        })
};
const resetForm = () => {
    dialogTableVisible.value = false;
    ruleFm.value.resetFields();
    getList();
}
const exportInfo = () => {
    exportList().then(res => {
        download.name(res.msg);
        message.success("下载任务已开始！请耐心等待完成");
    })
}



const uploadWarehouse = () => {

}

const beforeUpload = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

// 上传修改简称
const handleUploadShortCodeSuccess = (res, file) => {
    console.log('s',res, file);
    editnameType.value = false;
    if (res.file.status === 'done') {
        message.success(`${res.file.name} file uploaded successfully`);
    } else if (res.file.status === 'error') {
        message.error(`${res.file.name} file upload failed.`);
    }
    
    // if (res.code === 200) {
    //     message.success("操作成功！");
    // } else {
    //     message.error("操作失败！");
    // }
    getList();
    editnameType.value = false;
    upload.value.handleRemove(file);
}

onMounted(() => {
    getList();
    getMeansAttribute();
    classifyList.value = commodityType.map((item) => ({
        value: item.value,
        label: item.label,
    }));
})
</script>
<style lang="less" scoped></style>