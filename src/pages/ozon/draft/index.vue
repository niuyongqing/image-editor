<template>
    <div flex>
        <div w-210px>
            <draftSidebar />
        </div>
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
                                <a-input v-if="actives == 1" style="width: 400px;" v-model:value="formData.name"
                                    placeholder="请输入标题查询" clearable @clear="onSubmit"></a-input>
                                <a-input v-if="actives == 2" style="width: 400px;" v-model:value="formData.sku"
                                    clearable @clear="onSubmit" placeholder="请输入SKU查询,多个SKU间用逗号隔开，最多支持200个"></a-input>
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
                                    v-if="item.prop === active.prop && active.type == 'bottom'" />
                                <AsyncIcon icon="CaretDownOutlined"
                                    v-if="item.prop === active.prop && active.type == 'top'" />
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
                                <a-menu>
                                    <a-menu-item>
                                        批量编辑
                                    </a-menu-item>
                                    <a-menu-item>
                                        批量移入待发布
                                    </a-menu-item>
                                    <a-menu-item>
                                        批量发布
                                    </a-menu-item>
                                    <a-menu-item>
                                        批量加水印
                                    </a-menu-item>
                                    <a-menu-item>
                                        批量归档
                                    </a-menu-item>
                                    <a-menu-item>
                                        批量备注
                                    </a-menu-item>
                                    <a-menu-item>
                                        批量删除
                                    </a-menu-item>
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
                                    <a-input-search v-model:value="treeValue" style="margin-bottom: 8px"
                                        placeholder="搜索分类名称" @search="onSearch" />
                                    <a-tree show-line :tree-data="treeData" defaultExpandAll v-if="treeData.length"
                                        v-model:selected-keys="selectedKeys" @select="selectNode">
                                        <template #title="{ title }">
                                            <span>{{ title }}</span>
                                        </template>
                                    </a-tree>
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
                            <a-button type="primary" style="height: 32px;  ">
                                采集数据
                            </a-button>
                            <a-button type="primary" style="height: 32px;  ">
                                创建产品
                            </a-button>
                            <a-button type="primary" style="height: 32px;">
                                同步产品
                            </a-button>
                        </a-space>
                    </div>
                </div>
                <a-table :row-selection="rowSelection" rowKey="waitId" :data-source="tableData" bordered
                    :columns="columns" :pagination="false">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'image'">
                            <div class="flex items-center justify-center">
                                <a-image
                                    :src="record?.skuList[0]?.primaryImage && record?.skuList[0]?.primaryImage.length > 0 ? processImageSource(record?.skuList[0]?.primaryImage[0]) : processImageSource(record?.skuList[0]?.images[0])" />
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'name'">
                            <div class="flex text-left">
                                <div class="ml-2.5 block">
                                    <a-tooltip class="item" effect="dark" :title="record.name" placement="top"
                                        style="overflow-wrap: break-word">
                                        <div>{{ record.name }}</div>
                                    </a-tooltip>
                                    <div style="color: #999; float: left">
                                        店铺: {{ record.simpleName }}
                                    </div>
                                    <br />
                                    <div :style="{
                                        color: record.remarkColor ? 'green' : 'red',
                                        float: 'left',
                                    }"> 备注:{{ record.remark }}
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-if="column.dataIndex === 'sku'">
                            <div class="text-left">
                                <div v-for="(item, index) in displayedSkus(record)" :key="index">
                                    SKU： <span>{{ item.offerId }}</span>
                                    <a-tooltip style="margin-right: 10px" effect="dark" placement="top"
                                        v-if="item.warehouseList">
                                        <template #title>
                                            <div v-for="(el, ind) in item.warehouseList" :key="ind">
                                                <span>{{ el.warehouseName }}</span>:
                                                <span>{{ el.present ? el.present : 0 }}</span>
                                            </div>
                                        </template>
                                        <span style="color: #1677ff">{{ item.stock }}</span>
                                    </a-tooltip>
                                </div>
                                <div v-if="record.skuList && record.skuList.length > 3">
                                    <a-button type="text" @click="record.show = !record.show">
                                        共{{ record.skuList && record.skuList.length }}条SKU，{{ !record.show ? "展开" : "收起"
                                        }}
                                    </a-button>
                                </div>
                            </div>
                        </template>

                        <template v-if="column.dataIndex === 'price'">
                            <div class="flex items-start flex-col">
                                price
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <div class="flex items-start flex-col">
                                oldPrice
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'stock'">
                            <div class="flex items-start flex-col">
                                stock
                            </div>
                        </template>


                        <template v-if="column.dataIndex === 'createTime'">
                            <div class="flex items-start flex-col">
                                <div>
                                    创建时间：
                                    <span style="color: #9e9f9e">
                                        {{ record.createTime }}
                                    </span>
                                </div>
                                <div>
                                    更新时间：
                                    <span style="color: #9e9f9e">
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
                <a-pagination style="margin: 20px 0 10px 0; text-align: right" :show-total="(total) => `共 ${total} 条`"
                    v-model:current="paginations.pageNum" v-model:pageSize="paginations.pageSize"
                    :total="paginations.total" class="pages" :show-quick-jumper="true" @change="getList"
                    :showSizeChanger="true" :pageSizeOptions="[50, 100, 200]" />
                <template #cover></template>
            </a-card>
            <editRemark :remarkVisible="remarkVisible" :remarkId="remarkId" @backCloseRemark="backCloseRemark">
            </editRemark>
            <dataCrawli :editPriceVisible="editPriceVisible" @handleDataCrawliClose="editPriceVisible = false">
            </dataCrawli>
        </div>

        <!-- 备注 -->
        <editRemark :remarkVisible="remarkVisible" :remarkId="remarkId" @backCloseRemark="backCloseRemark"></editRemark>

        <!-- 店铺设置 -->
        <shopSetModal :shopSetVisible="shopSetVisible" :shopCurryList="shopCurryList"
            @handleShopSetClose="shopSetVisible = false" @refreshShopSet="getShopSet"></shopSetModal>

        <!--编辑提示 弹窗-->
        <EditPrompt ref="editPromptRef"></EditPrompt>
    </div>
</template>

<script setup name='draft'>
import { message } from 'ant-design-vue';
import { DownOutlined, SettingOutlined } from "@ant-design/icons-vue";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { accountCache } from "../config/api/product";
import { ozonProductList, ozonProductDel, ozonProductPublish } from "../config/api/waitProduct";
import tableHeard from "../config/tabColumns/draft"
import { processImageSource } from "~/pages/ozon/config/commJs/index"
import draftSidebar from './comm/draftSidebar.vue';
import editRemark from './comm/editRemark.vue';
import dataCrawli from './comm/dataCrawli.vue';
import shopSetModal from "@/pages/ozon/product/comm/shopSetModal.vue";
import { shopCurrency } from "../config/api/product"
import EditPrompt from './comm/editPrompt.vue';


const editPromptEl = useTemplateRef('editPromptRef');


const shopSetVisible = ref(false);
const shopCurryList = ref([]);

const treeValue = ref(''); // 待发布产品搜索
const treeData = ref([
    {
        title: '所有分类',
        key: '0-0',
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-0-0',
                    },
                    {
                        title: 'leaf',
                        key: '0-0-0-1',
                    },
                ],
            },
            {
                title: 'parent 1-1',
                key: '0-0-1',
                children: [
                    {
                        key: '0-0-1-0',
                        title: 'sss',
                    },
                ],
            },
        ],
    },
]);
const copyTreeData = ref([{
    title: '所有分类',
    key: '0-0',
    children: [
        {
            title: 'parent 1-0',
            key: '0-0-0',
            children: [
                {
                    title: 'leaf',
                    key: '0-0-0-0',
                },
                {
                    title: 'leaf',
                    key: '0-0-0-1',
                },
            ],
        },
        {
            title: 'parent 1-1',
            key: '0-0-1',
            children: [
                {
                    key: '0-0-1-0',
                    title: 'sss',
                },
            ],
        },
    ],
},]);
watch(treeValue, () => {
    onSearch();
});

function filterTreeWithParents(nodes, predicate) {
    return nodes
        .map(node => ({ ...node }))
        .filter(node => {
            if (node.children) {
                node.children = filterTreeWithParents(node.children, predicate);
            }
            return predicate(node) || (node.children && node.children.length > 0);
        });
};
// 待发布产品搜索
const onSearch = () => {
    if (treeValue.value) {
        const result = filterTreeWithParents(treeData.value, node =>
            node.title && node.title.includes(treeValue.value)
        );
        treeData.value = result;
    } else {
        treeData.value = copyTreeData.value;
    }
};

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
let columns = tableHeard
const deactivateLoading = ref(false)
const delLoading = ref(false)
const loading = ref(false)
const remarkVisible = ref(false);
const editPriceVisible = ref(false)
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
}); // 默认按创建时间查询
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
        value: "update_tiem",
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
const add = () => {
    window.open("productPublish", '_blank');
}

// 店铺设置
const shopSet = () => {
    shopSetVisible.value = true
    getShopSet()
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
}



const displayedSkus = (row) => {
    return row.show ? row?.skuList : row?.skuList?.slice(0, 3);
}


// 备注弹窗关闭
const backCloseRemark = () => {
    remarkVisible.value = false;
    selectedRowList.value = [];
    remarkId.value = [];
    getList();
}
const edit = (row = {}) => {
    let newRow = Object.keys(row).length != 0 ? row : selectedRowList.value[0];
    console.log('newRow', newRow);
    window.open("editWaitProduct" + `?id=${newRow.waitId}&account=${newRow.account}`, '_blank');

}
const getList = () => {
    loading.value = true;
    ozonProductList(formData)
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

//  店铺设置
const shopSetting = () => {

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
    remarkVisible.value = true;
    if (Object.keys(row).length == 0) {
        remarkId.value = selectedRowList.value;
    } else {
        let remarkObj = {
            account: row.account,
            waitIds: [row.waitId],
        };
        remarkId.value.push(remarkObj);
    }
};

// 单个或批量删除产品
const delProduct = (row = {}) => {
    loading.value = true;
    let waitIds = [];
    if (Object.keys(row).length != 0) {
        waitIds.push(row.waitId);
    } else {
        waitIds = selectedRowList.value.map((item) => item.waitId);
    }
    ozonProductDel({ waitIds })
        .then((res) => {
            message.success("操作成功");
            getList();
        })
        .finally(() => {
            loading.value = false;
        });
}


onMounted(() => {
    getAccount()
})

const show = ref(false);
</script>
<style lang="less" scoped>
:deep(.ant-space-item) {
    text-align: left;
}
</style>