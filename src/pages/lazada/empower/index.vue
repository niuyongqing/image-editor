<template>
    <div>
        <Search :area="area" @search="handleSearch"></Search>
        <BaseTable ref="baseTableRef" :columns="columns" :api="empowerList" :init-search-param="initSearchParam"
            :row-selection="rowSelection" row-key="userId" :scroll="{ y: '100%', x: '2000px' }">
            <template #leftBar>
                <a-button type="primary" @click="Reauthorization" v-has-permi="[`system:platform:lazada:accredit`]"
                    :loading="accreditLoading">
                    <template #icon>
                        <SettingOutlined />
                    </template>
                    授权</a-button>
                <a-popconfirm title="确定要全部刷新授权吗？" ok-text="是" cancel-text="否" @confirm="refreshToken">
                    <a-button type="primary" v-has-permi="[`system:platform:lazada:accredit`]" :loading="refreshLoading"
                        style="margin-left: 10px;">
                        <template #icon>
                            <ReloadOutlined />
                        </template>
                        刷新全部授权</a-button>
                </a-popconfirm>
                <a-button type="primary" @click="handleBatchName" v-has-permi="[`platform:lazada:accredit`]"
                    style="margin-left: 10px;">
                    <template #icon>
                        <CloudUploadOutlined />
                    </template>
                    批量修改简称
                </a-button>
                <a-button type="primary" @click="handleBatchStore" v-has-permi="[`system:platform:lazada:accredit`]"
                    style="margin-left: 10px;">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    批量修改仓库
                </a-button>
                <a-button type="primary" :loading="exportLoading" @click="handleExport"
                    v-has-permi="[`system:platform:lazada:accredit`]" style="margin-left: 10px;">
                    <template #icon>
                        <DownloadOutlined />
                    </template>
                    导出
                </a-button>
                <a-button type="primary" @click="lookLazadaInfo" :disabled="singleDisabled"
                    v-has-permi="[`system:platform:lazada:login:edit`]" style="margin-left: 10px;">
                    <template #icon>
                        <EyeOutlined />
                    </template>
                    查看店铺登录密码
                </a-button>
                <a-button type="primary" @click="handleEdit" :disabled="singleDisabled"
                    v-has-permi="[`system:platform:lazada:login:edit`]" style="margin-left: 10px;">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    修改店铺登录密码
                </a-button>
                <a-button type="primary" @click="handleBatchEdit" :disabled="multipleDisabled"
                    v-has-permi="[`system:platform:lazada:login:edit`]" style="margin-left: 10px;">
                    <template #icon>
                        <EditOutlined />
                    </template>
                    批量修改店铺密码
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
            <template #isFillPassword="{ record }">
                <div flex justify-center items-center>
                    <a-tag v-if="record.isFillPassword == 0" color="warning">未填充</a-tag>
                    <a-tag v-if="record.isFillPassword == 1" color="success">已填充</a-tag>
                </div>
            </template>
            <template #remark="{ record }">
                <a-input v-if="isRemark" style="width: 100%;" v-model:value="record.remark"
                    @blur="handleChangeRemark(record)"></a-input>
            </template>
            <template #classify="{ record }">
                <a-select v-model:value="record.classify" v-if="accreditAuth" allow-clear class="w-full"
                    placeholder="请选择品类" :options="classifyOptions" @change="classifyChange(record)"></a-select>
                <span v-else>{{ record.classify }}</span>
            </template>
            <template #forbidSale="{ record }">
                <a-select :value="recordForbidSale(record.forbidSale)" v-if="accreditAuth" class="w-full" allow-clear
                    mode="multiple" placeholder="请选择禁售属性" :options="forbidSaleOptions"
                    :field-names="{ label: 'attributes', value: 'id' }"
                    :filter-option="(input, option) => option.attributes.toLowerCase().indexOf(input.toLowerCase()) >= 0"
                    @change="forbidSaleChange(record, $event)"></a-select>
                <span v-else>{{text && text.map(id => forbidSaleOptions.find(item => item.id ===
                    id)?.attributes).join()}}</span>
            </template>

            <template #isPushStock="{ record }">
                <!-- @change="editStockPush(record)" -->
                <a-switch v-model:checked="record.isPushStock" :checked-value="1" :un-checked-value="0" />
            </template>

            <template #stockPushRatio="{ record }">
                <!-- @blur="editStockPush(record)"  -->
                <a-input-number v-model:value="record.stockPushRatio" :precision="0" :min="1" :max="100"
                    :controls="false" placeholder="1 ~ 100" :disabled="record.isPushStock !== '1'" />
                <!-- <span v-else>{{ text || '--' }}</span> -->
            </template>



            <template #autoPublish="{ record }">
                <div flex justify-center items-center>
                    <a-switch v-model:checked="record.autoPublish" :disabled="!accreditAuth" checked-value="1"
                        un-checked-value="2" @change="autoPublishChange(record)" />
                </div>
            </template>
        </BaseTable>
        <!-- 批量修改简称 -->
        <batchSimpleName ref="batchSimpleNameRef" @success="reload"></batchSimpleName>
        <!-- 批量修改仓库 -->
        <batchStore ref="batchStoreRef" @success="reload"></batchStore>
        <ErpValidModal ref="erpValidModalRef" @success="erpValidSuccess"></ErpValidModal>
        <ViewLazadaInfo ref="viewLazadaInfoRef" @success="reload"></ViewLazadaInfo>
        <EditLazadaInfo ref="editLazadaInfoRef" @success="reload"></EditLazadaInfo>
        <BatchEditLazadaInfo ref="bacthLazadaInfoRef" @success="reload"></BatchEditLazadaInfo>
    </div>
</template>

<script setup>
import { SettingOutlined, EditOutlined, ReloadOutlined, CloudUploadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons-vue';
import { columns } from './columns';
import { empowerList, editStore, simpleName, alias, remark, url, refreshAllToken, exportList, accredit, meansAttribute } from './api';
import { loginCheck, updateShop } from '@/pages/lazada/empower/api/index.js';
import { findParentAndMerge } from './common';
import Search from './components/search.vue';
import BaseTable from '@/components/baseTable/BaseTable.vue';
import { useTableSelection } from '@/components/baseTable/useTableSelection';
import { Modal, message } from 'ant-design-vue';
import { checkPermi, checkRole } from '~@/utils/permission/component/permission';
import ErpValidModal from './components/erpValidModal.vue';
import downLoad from '@/api/common/download';
import ViewLazadaInfo from './components/viewLazadaInfo.vue';
import EditLazadaInfo from './components/editLazadaInfo.vue';
import BatchEditLazadaInfo from './components/batchEditLazadaInfo.vue';
import batchSimpleName from './components/batchSimpleName.vue';// 批量修改简称
import batchStore from './components/batchStore.vue';// 批量修改仓库

const route = useRoute()
const router = useRouter();
const code = route.query.code;

const accreditLoading = ref(false); // 授权按钮 loading
const refreshLoading = ref(false); // 刷新按钮 loading
const exportLoading = ref(false); // 导出按钮 loading

const forbidSaleOptions = ref([]); // 禁售属性
const accountUserLsit = ref([]);
const accountOptions = ref([]);
const depOptions = ref([]);
const baseTableEl = useTemplateRef('baseTableRef');
const batchSimpleNameEl = useTemplateRef('batchSimpleNameRef');
const batchStoreEl = useTemplateRef('batchStoreRef');
const erpValidModalEl = useTemplateRef('erpValidModalRef');
const viewLazadaInfoEl = useTemplateRef('viewLazadaInfoRef');
const editLazadaInfoEl = useTemplateRef('editLazadaInfoRef');
const bacthLazadaInfoEl = useTemplateRef('bacthLazadaInfoRef');

const { singleDisabled, multipleDisabled, rowSelection, tableRow, selectedRowKeys, selectedRows, clearSelection } = useTableSelection()
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
const classifyOptions = [
    { value: '01', label: '饰品配件' },
    { value: '02', label: '服饰配饰' },
    { value: '03', label: '家居' },
    { value: '04', label: '3C' },
    { value: '05', label: '文具办公' },
    { value: '06', label: '美妆个护' },
    { value: '07', label: '汽摩配' },
    { value: '08', label: '户外运动' },
    { value: '09', label: '母婴玩具' },
    { value: '10', label: '宠物' },
    { value: '99', label: '其他' }
];
//  授权
if (code) {
    accredit({
        code: code,
        country: area[0].value
    })
        .then(res => {
            message.success('授权成功')
            reload()
            router.push({ query: {} })
        })
        .catch(() => {
            message.error('授权失败')
        })
};

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
};
//  品类
const classifyChange = (record) => {
    console.log('record -》》》', record);
    updateShop({
        shortCode: record.shortCode,
        classify: record.classify
    }).then((res) => {
        if (res.code === 200) {
            message.success('修改成功')
        }
    })
};
const recordForbidSale = (value) => {
    return value ? value.split(',').map((item) => Number(item)) : [];
};


const forbidSaleChange = (record, val) => {
    updateShop({
        shortCode: record.shortCode,
        forbidSale: val && val.length ? val.filter(Boolean).join(',') : ''
    }).then((res) => {
        if (res.code === 200) {
            message.success('修改成功');
            reload()
        }
    })
};
const autoPublishChange = (record) => {
    updateShop({
        shortCode: record.shortCode,
        autoPublish: record.autoPublish
    }).then((res) => {
        if (res.code === 200) {
            message.success('修改成功')
        }
    })
};

// 修改推送库存
const editStockPush = (record) => {
    const params = {
        account: record.account,
        sellerId: record.userId,
        isPushStock: record.isPushStock,
        stockPushRatio: record.stockPushRatio
    }
    // editStockPushApi(params)
    //     .then(res => {
    //         message.success('修改成功')
    //     })
    //     .catch(err => {
    //         message.warning(err)
    //         getList()
    //     })
}


//查看账号密码邮箱
const lookLazadaInfo = async () => {
    let loginCheckRes = await loginCheck();
    if (loginCheckRes.data === false) {
        erpValidModalEl.value.open();
        return false;
    } else {
        const flag = erpValidSuccess();
        const shortCode = selectedRows.value[0].shortCode;
        viewLazadaInfoEl.value.open(shortCode);
    }
};
const handleEdit = async () => {
    let loginCheckRes = await loginCheck();
    if (loginCheckRes.data === false) {
        erpValidModalEl.value.open();
        return false;
    } else {
        const flag = erpValidSuccess();
        if (flag) {
            const shortCode = selectedRows.value[0].shortCode;
            editLazadaInfoEl.value.open(shortCode);
        }
    }
};

const erpValidSuccess = () => {
    if (selectedRowKeys.value.length !== 1) {
        message.error('请选择一个店铺查看');
        return false
    }
    return true;
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
// 重新授权
const Reauthorization = () => {
    // 获取授权链接
    // if()
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
// 导出
const handleExport = () => {
    exportLoading.value = true;
    exportList().then(res => {
        message.success('下载任务已开始！请耐心等待完成')
        downLoad.name(res.msg, true);
    }).finally(() => {
        exportLoading.value = false;
    })
};

// 批量修改店铺密码
const handleBatchEdit = async () => {
    let loginCheckRes = await loginCheck();
    if (loginCheckRes.data === false) {
        erpValidModalEl.value.open();
        return false;
    } else {
        const flag = erpValidSuccess();
        if (flag) {
            bacthLazadaInfoEl.value.open();
        }
    }
};

// 获取品类
function getMeansAttribute() {
    meansAttribute().then((res) => {
        const data = res?.data || [];
        const list = data.map((item) => {
            return {
                "id": item.id,
                "attributes": item.attributes,
                "example": item.example,
                "site": item.site,
                "sort": item.sort,
                "key": item.key,
            }
        })
        forbidSaleOptions.value = list;
    });
};
onMounted(() => {
    getMeansAttribute();
})
</script>