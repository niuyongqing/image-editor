<template>
    <div flex>
        <div w-300px>
            <draftSidebar @updateClass="updateClass" />
        </div>
        <div v-if="showDraftTable" w-full>
            <div id="draft" w-full ml-15px>
                <a-card>
                    <a-form ref="ruleForm2" :model="formData">
                        <a-form-item label="店铺账号：">
                            <selectComm :options="shopAccount" :fieldObj="shopObj" @backSelectAll="selectAll"
                                @backSelectItem="selectItem"></selectComm>
                        </a-form-item>
                        <a-form-item label="搜索类型:">
                            <div class="fBox flex align-start gap-10px">
                                <a-button @click="selectTypes(item.prop)" :type="item.prop === actives ? 'primary' : ''"
                                    v-for="(item, index) in searchType" :key="index">{{ item.label }}</a-button>
                            </div>
                        </a-form-item>
                        <a-form-item label="搜索内容：">
                            <div class="flex">
                                <div class="flex align-start">
                                    <a-input v-if="actives === 1" style="width: 400px;" v-model:value="formData.name"
                                        placeholder="请输入标题查询" clearable @clear="onSubmit"></a-input>
                                    <a-input v-if="actives === 2" style="width: 400px;" v-model:value="formData.sku"
                                        clearable @clear="onSubmit"
                                        placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"></a-input>
                                </div>
                                <a-button type="primary" class="ml-[10px]" @click="onSubmit()">查询</a-button>
                            </div>
                        </a-form-item>
                        <a-form-item label="排序方式：">
                            <div class="flex align-start gap-10px">
                                <a-button v-for="item in strList" :key="item.prop"
                                    :type="item.prop === active.prop ? 'primary' : ''" @click="storChange(item)">
                                    <span>{{ item.label }}</span>
                                    <AsyncIcon icon="CaretUpOutlined"
                                        v-if="item.prop === active.prop && active.type === 'bottom'" />
                                    <AsyncIcon icon="CaretDownOutlined"
                                        v-if="item.prop === active.prop && active.type === 'top'" />
                                </a-button>
                            </div>
                        </a-form-item>
                    </a-form>
                </a-card>
                <a-card class="my-2.5">
                    <div class="w-full flex justify-between items-center mb-10px">
                        <div class="flex">
                            <a-dropdown>
                                <a-button type="primary" style="height: 32px;">
                                    批量操作
                                    <DownOutlined />
                                </a-button>
                                <template #overlay>
                                    <a-menu @click="handleMenuClick">
                                        <a-menu-item :key="0">批量编辑</a-menu-item>
                                        <a-menu-item :key="1">批量移入待发布</a-menu-item>
                                        <a-menu-item :key="2">批量发布</a-menu-item>
                                        <a-menu-item :key="3">批量加水印</a-menu-item>
                                        <a-menu-item :key="4">批量归档</a-menu-item>
                                        <a-menu-item :key="5">批量备注</a-menu-item>
                                        <a-menu-item :key="6">批量删除</a-menu-item>
                                        <a-menu-item :key="7" disabled> 快捷操作 </a-menu-item>
                                        <a-menu-item :key="8"> 批量修改售价 </a-menu-item>
                                        <a-menu-item :key="9"> 批量修改原价 </a-menu-item>
                                        <a-menu-item :key="10"> 批量修改库存 </a-menu-item>
                                        <a-menu-item :key="11"> 全属性修改 </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>

                            <a-dropdown trigger="click">
                                <a-button type="primary" style="height: 32px;  margin-left: 10px;">
                                    分类管理
                                    <DownOutlined />
                                </a-button>
                                <template #overlay>
                                    <a-menu>
                                        <typeTree v-model:current-class="currentClass" v-model:node-path="nodePath"
                                            platform="ozon" @update:currentClass="updateCurrentClass" ref="typeTreeRef">
                                        </typeTree>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                        <div>
                            <a-space>
                                <a-button type="link" style="height: 32px;" @click="shopSet">
                                    <SettingOutlined />
                                    店铺设置
                                </a-button>
                                <a-button type="primary" style="height: 32px;">
                                    采集数据
                                </a-button>
                                <a-button type="primary" style="height: 32px;" @click="createProduct">
                                    创建产品
                                </a-button>
                                <a-tooltip>
                                    <template #title>
                                        <p mb-0>【 同步产品 】按钮：</p>
                                        <p mb-0 text-gray-400>
                                            仅从平台后台同步产品，产品的信息将会被更新至最新
                                        </p>
                                    </template>
                                    <a-button type="primary" style="height: 32px;">
                                        同步产品
                                        <QuestionCircleOutlined />
                                    </a-button>
                                </a-tooltip>

                            </a-space>
                        </div>
                    </div>
                    <a-table :row-selection="rowSelection" rowKey="gatherProductId" :data-source="tableData" bordered
                        :columns="columns" :pagination="false" :loading="loading">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'image'">
                                <div class="">
                                    <a-image :src="primaryImage(record.primaryImage)" />
                                    <p class="platform-name" @click="visitUrl(record.sourceUrlList)">
                                        {{ platformName(record.gatherPlatformName) }}</p>
                                </div>
                            </template>
                            <template v-if="column.dataIndex === 'name'">
                                <div class="flex text-left">
                                    <div class="ml-2.5 block">
                                        <a-tooltip class="item" effect="dark" :title="record.name" placement="top"
                                            style="overflow-wrap: break-word">
                                            <div>{{ record.name }}</div>
                                        </a-tooltip>
                                        <div class="account">
                                            「{{ accountName(record.account) }}」
                                        </div>
                                        <br />
                                        <div :style="{
                                            color: record.remarkColor ? 'green' : 'red',
                                        }"> {{ record.remark }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="column.dataIndex === 'sku'">
                                <div class="record-sku-container pb-30px">
                                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                                        <div text-left>
                                            <a-tooltip placement="top">
                                                <template #title>
                                                    <span>复制</span>
                                                </template>
                                                <span @click="copyText(item.offerId)"> {{ item.offerId }} </span>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="column.dataIndex === 'price'">
                                <div class="pb-30px">
                                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                                        <div class="sku-price">
                                            <span pr-5px>{{ record.currencyCode }} </span>
                                            <span>
                                                {{ item.price ? item.price : '-' }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="column.dataIndex === 'oldPrice'">
                                <div class="pb-30px">
                                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                                        <div class="sku-price">
                                            <span pr-5px>{{ record.currencyCode }} </span>
                                            <span>{{ item.oldPrice ? item.oldPrice : '-' }} </span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="column.dataIndex === 'stock'">
                                <div class="pb-30px">
                                    <div class="record-sku" v-for="(item, index) in displayedSkus(record)" :key="index">
                                        <div class="sku-price">
                                            <a-tooltip placement="top">
                                                <template #title>
                                                    <span>{{ warehouseName(item.offerId, item.warehouseList) }}: {{
                                                        item.stock }}</span>
                                                </template>
                                                <span> {{ item.stock }} </span>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="record.skuList.length > 5"
                                    class="w-full flex flex-end flex-end more pr-15px pb-10px">
                                    <a-button type="link" @click="record.show = !record.show">
                                        {{ !record.show ? '+ 展开' : '- 收起' }}
                                    </a-button>
                                </div>
                            </template>
                            <template v-if="column.dataIndex === 'createTime'">
                                <div class="flex items-start flex-col">
                                    <div>
                                        <span style="color: #9e9f9e"> 创建：</span>
                                        <span>
                                            {{ record.createTime }}
                                        </span>
                                    </div>
                                    <div>
                                        <span style="color: #9e9f9e"> 更新：</span>
                                        <span>
                                            {{ record.updateTime }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                            <template v-if="column.dataIndex === 'option'">
                                <a-space direction="vertical">
                                    <a-button type="link" @click="moveToPending(record)"> 移入待发布 </a-button>
                                    <a-button type="link" @click="editProduct(record)"> 编辑 </a-button>
                                    <a-button type="link" @click="publishProduct(record)"> 发布 </a-button>
                                    <a-dropdown>
                                        <a-button type="link">
                                            更多
                                            <DownOutlined />
                                        </a-button>
                                        <template #overlay>
                                            <a-menu>
                                                <a-menu-item @click="addRemark(record)">
                                                    添加备注
                                                </a-menu-item>
                                                <a-menu-item @click="delProduct(record)">
                                                    删除产品
                                                </a-menu-item>
                                            </a-menu>
                                        </template>
                                    </a-dropdown>
                                </a-space>
                            </template>
                        </template>
                    </a-table>
                    <a-pagination style="margin: 20px 0 10px 0; text-align: right"
                        :show-total="(total) => `共 ${total} 条`" v-model:current="paginations.pageNum"
                        v-model:pageSize="paginations.pageSize" :total="paginations.total" class="pages"
                        :show-quick-jumper="true" @change="getList" :showSizeChanger="true"
                        :pageSizeOptions="[50, 100, 200]" />
                </a-card>
            </div>
        </div>

        <div v-else w-full ml-15px>
            <OzonProduct></OzonProduct>
        </div>

        <!-- 店铺设置 -->
        <ShopSetModal :shopSetVisible="shopSetVisible" :shopCurryList="shopCurryList"
            @handleShopSetClose="handleShopSetClose" @refreshShopSet="getShopSet"></ShopSetModal>

        <!--编辑提示 弹窗-->
        <EditPrompt ref="editPromptRef" :shopAccount="shopAccount"></EditPrompt>

        <!-- 批量编辑 -->
        <BatchEdit ref="batchEditRef"></BatchEdit>

        <!-- 批量备注 -->
        <RemarkModal ref="remarkModalRef"></RemarkModal>

        <!-- 批量加水印 -->
        <BatchWatermark ref="batchWatermarkRef"></BatchWatermark>

        <!-- 全属性修改 -->
        <BatchAttribute ref="batchAttributeRef"></BatchAttribute>
    </div>
</template>

<script setup name='draft'>
import { Divider, message, Modal } from 'ant-design-vue';
import { DownOutlined, SettingOutlined, SyncOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import { accountCache, shopCurrency } from "../config/api/product";
import { ozonDraftList } from "../config/api/draft";
import tableHeard from "../config/tabColumns/draft"
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import draftSidebar from './comm/draftSidebar.vue';
import ShopSetModal from "@/pages/ozon/product/comm/shopSetModal.vue";
import typeTree from '@/components/classificationTree/typeTree.vue';
import EditPrompt from './comm/editPrompt.vue';
import BatchEdit from './batchComponent/batchEdit.vue';
import RemarkModal from './batchComponent/remarkModal.vue';
import BatchWatermark from './batchComponent/batchWatermark.vue';
import OzonProduct from '@/pages/ozon/product/index.vue';
import BatchAttribute from './batchComponent/batchAttribute.vue';

let columns = tableHeard;
const showDraftTable = ref(true);

const baseApi = import.meta.env.VITE_APP_BASE_API;
const { copy } = useClipboard();
const editPromptEl = useTemplateRef('editPromptRef');
const batchEditEl = useTemplateRef('batchEditRef'); // 批量编辑-弹窗
const remarkModalEl = useTemplateRef('remarkModalRef'); // 批量备注-弹窗
const batchWatermarkEl = useTemplateRef('batchWatermarkRef'); // 批量加水印-弹窗
const batchAttributeEl = useTemplateRef('batchAttributeRef'); // 批量属性-弹窗

const typeTreeEl = useTemplateRef('typeTreeRef');
const currentClass = ref(0);
const nodePath = ref('');
const typeManageOpen = ref(false);

const shopSetVisible = ref(false);
const shopCurryList = ref([]);

const formData = reactive({
    offerId: "",
    account: "",
    sku: "",
    name: "",
    prop: "created_time",
    order: "desc",
    state: ""
})
const paginations = reactive({
    pageNum: 1,
    pageSize: 50,
    total: 0,
});
const shopAccount = ref([])
const actives = ref(1);
const selectedRowList = ref([]);
const tableData = ref([])
const deactivateLoading = ref(false)
const delLoading = ref(false)
const loading = ref(false)
const remarkVisible = ref(false);

const remarkId = ref([]);
const state = {
    wait_publish: "待发布",
    published: "已发布",
    publish_failed: "发布失败",
}
const shopObj = {
    fieldKey: "account",
    fieldLabel: "simpleName",
}
const sortObj = reactive({
    sortField: "created_time",
    sortType: "desc"
})
const searchType = [
    {
        label: "标题",
        prop: 1,
    },
    {
        label: "SKU",
        prop: 2,
    }
]
const active = ref({
    label: "按创建时间",
    value: "created_time",
    type: "top",
    prop: 1,
    isDefault: true,
});
// 默认按创建时间查询
const strList = ref([
    {
        label: "按创建时间",
        value: "created_time",
        type: "top",
        prop: 1,
        isDefault: true,
    },
    {
        label: "按更新时间",
        type: "bottom",
        value: "update_time",
        prop: 2,
        isDefault: false,
    },
    {
        label: "按售价",
        value: "old_price",
        type: "top",
        prop: 3,
        isDefault: false,
    },
    {
        label: "按总库存量",
        value: "stock",
        type: "top",
        prop: 4,
        isDefault: false,
    },
]);

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        selectedRowList.value = selectedRows;
    },
};
const accountName = (account) => {
    return shopAccount.value.find(item => item.account === account)?.simpleName
};


const primaryImage = (primaryImage) => {
    return baseApi + primaryImage
};

const platformName = (platform) => {
    const platNames = {
        Ozon: 'Ozon',
        Tmall: '天猫',
        AliExpress: '速卖通',
    };
    return platNames[platform] ?? platform
};

const visitUrl = (sourceUrlList) => {
    if (sourceUrlList && sourceUrlList.length > 0) {
        window.open(sourceUrlList[0])
    }
};

// 复制
const copyText = (text) => {
    copy(text);
    message.success(`复制成功：${text}`);
};
const warehouseName = (offerId, warehouseList) => {
    return warehouseList.find(item => item.offerId === offerId)?.warehouseName
}

// 店铺设置
const shopSet = () => {
    shopSetVisible.value = true;
    getShopSet();
};
const getShopSet = () => {
    shopCurrency().then(res => {
        shopCurryList.value = res?.data ?? []
    })
};

// 店铺单选多选
const selectAll = () => {
    formData.account = ""
    getList();
}
const selectItem = (val) => {
    formData.account = val
    getList();
}

// 搜索内容
const selectTypes = (index) => {
    actives.value = index;
    switch (index) {
        case 1:
            formData.sku = "";
            formData.offerId = "";
            break;
        case 2:
            formData.name = "";
            formData.offerId = "";
            break;
        case 3:
            formData.sku = "";
            formData.name = "";
            break;
        default:
            break;
    }
}

// 排序方式
const storChange = (item) => {
    item.type = item.type === "top" ? "bottom" : "top";
    active.value = item;
    sortObj.sortField = item.value
    sortObj.sortType = item.type === "top" ? "desc" : "asc"
    formData.order = item.type === "top" ? "desc" : "asc"
    formData.prop = item.value
    getList();
};

// 表单搜索
const onSubmit = () => { getList() }

// 店铺数据
const getAccount = () => {
    accountCache().then((res) => {
        if (res.data) {
            shopAccount.value = res?.data ?? [];
            getList();
        }
    });
};


const displayedSkus = (row) => {
    0
    return row.show ? row?.skuList : row?.skuList?.slice(0, 3);
};

const getList = () => {
    loading.value = true;
    ozonDraftList({
        ...formData,
        ...sortObj,
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

const updateClass = (value) => {
    showDraftTable.value = false;
}



//  移入待发布
const moveToPending = (row = {}) => {

};

//  编辑
const editProduct = (row) => {
    editPromptEl.value.open(row);
};

// 发布
const publishProduct = (row = {}) => {

};

// 备注
const addRemark = (row = {}) => {
    remarkModalEl.value.open(row, false);
};

// 单个或批量删除产品
const delProduct = (row = {}) => {
    Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        onOk: async () => {
            // loading.value = true;
            // let waitIds = [];
            // if (Object.keys(row).length != 0) {
            //     waitIds.push(row.waitId);
            // } else {
            //     waitIds = selectedRowList.value.map((item) => item.waitId);
            // }
            // ozonProductDel({ waitIds })
            //     .then((res) => {
            //         message.success("操作成功");
            //         getList();
            //     })
            //     .finally(() => {
            //         loading.value = false;
            //     });
        }
    })

};

const handleShopSetClose = () => {
    shopSetVisible.value = false;
    getList();
};

// 创建产品
const createProduct = () => {
    window.open("/platform/ozon/productPublish", '_blank');
};

const updateCurrentClass = (value) => {
    console.log(value);
};


//  批量操作
const handleMenuClick = (e) => {
    console.log(e, selectedRowList.value);
    if (!selectedRowList.value.length) {
        message.warning("请至少选择一条数据");
        return;
    }
    switch (e.key) {
        case 0:
            console.log('批量编辑');
            batchEditEl.value.open(selectedRowList.value);
            break;
        case 1:
            Modal.confirm({
                title: '提示',
                content: '确定要批量移入待发布吗？',
                confirmLoading: true,
                onOk: async () => {
                    // baseTableEl.value.setLoading(true);
                    // const res = await moveToPending({ itemId: record.itemId });
                    // if (res.code === 200) {
                    //     message.success('移入待发布成功');
                    //     getList();
                    // } else {
                    //     message.error(res.msg);
                    //     baseTableEl.value.setLoading(false);
                    // }
                }
            });
            break;
        case 2:
            console.log('批量发布');
            break;
        case 3:
            batchWatermarkEl.value.open(selectedRowList.value);
            console.log('批量加水印');
            break;
        case 4:
            Modal.confirm({
                title: '提示',
                content: '确定要批量归档吗？',
                confirmLoading: true,
                onOk: async () => {
                    // baseTableEl.value.setLoading(true);
                    // const res = await moveToPending({ itemId: record.itemId });
                    // if (res.code === 200) {
                    //     message.success('归档成功');
                    //     getList();
                    // } else {
                    //     message.error(res.msg);
                    //     baseTableEl.value.setLoading(false);
                    // }
                }
            })
            console.log('批量归档');
            break;
        case 5:
            remarkModalEl.value.open(selectedRowList.value, true);
            console.log('批量备注');
            break;
        case 6:
            Modal.confirm({
                title: '提示',
                content: '确定要批量删除吗？',
                confirmLoading: true,
                onOk: async () => {
                    // baseTableEl.value.setLoading(true);
                    // const res = await moveToPending({ itemId: record.itemId });
                    // if (res.code === 200) {
                    //     message.success('删除成功');
                    //     getList();
                    // } else {
                    //     message.error(res.msg);
                    //     baseTableEl.value.setLoading(false);
                    // }
                }
            })
            console.log('批量删除');
            break;
        case 8:
            console.log('批量修改售价');
            break;
        case 9:
            console.log('批量修改原价');
            break;
        case 10:
            console.log('批量修改库存');
            break;
        case 11:
            batchAttributeEl.value.open({ title: '批量修改属性', data: selectedRowList.value });
            console.log('批量修改全属性');
            break;
        default:
            break;
    }
};

onMounted(() => {
    getAccount()
})

const show = ref(false);
</script>
<style lang="less" scoped>
:deep(.ant-space-item) {
    text-align: left;
}

.record-sku-container {
    width: 100%;
}

.record-sku {
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

.platform-name {
    padding-top: 5px;
    color: #428bca;
}

.account {
    color: #999;
    margin-top: 5px;
}
</style>