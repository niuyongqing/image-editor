<template>
    <div>
        <!--   批量分类 -->
        <a-modal v-model:open="dialogVisible" title="提示" width="1000px" @cancel="cancel" :footer="null"
            :maskClosable="false" :style="{ top: '30px' }">
            <div flex justify-between mb-15px>
                <div>
                    <a-breadcrumb separator=">">
                        <a-breadcrumb-item>Ozon</a-breadcrumb-item>
                        <a-breadcrumb-item>采集箱</a-breadcrumb-item>
                        <a-breadcrumb-item> 批量编辑 </a-breadcrumb-item>
                    </a-breadcrumb>
                </div>
                <div>
                    <a-space>
                        <a-button type="primary" @click="editCategory"
                            style="height: 32px;  background-color: #E97234;">保存，下一步</a-button>
                        <a-button @click="skip" style="height: 32px; background-color: #F5F5F5;">关闭</a-button>
                    </a-space>
                </div>
            </div>
            <div>
                <a-button type="primary" @click="showCategoryModal"> 批量修改分类 </a-button>
                <a-card mt-12px>
                    筛选来源：
                    <a-select v-model:value="platformSource" allowClear placeholder="请选择" style="width: 300px;"
                        :options="sourceOptions" @change="selectSource">
                    </a-select>
                </a-card>
            </div>

            <div h-900px overflow-y-scroll>
                <a-table v-for="item in acceptParams" :key="item.gatherProductId" :columns="columns"
                    :row-selection="rowSelection" :data-source="item.tableData" bordered :pagination="false"
                    style="margin-top: 12px;">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'primaryImage'">
                            <div class="flex">
                                <div w-80px>
                                    <a-image :src="primaryImage(record.primaryImage)" class="imgCss" />
                                </div>
                                <div class="flex-1 ml-5px">
                                    <div class="font-bold">{{ record.name }}</div>
                                    <div class="text-gray-500"> 「{{ accountName(record.account) }}」 </div>
                                    <div class="text-gray-500">来源: {{ platformName(record.gatherPlatformName) }}
                                    </div>
                                </div>

                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'category'">
                            >>
                        </template>
                        <template v-if="column.dataIndex === 'ozonCategory'">
                            <a-select v-model:value="item.typeId" allowClear showSearch placeholder="请选择"
                                style="width: 300px;" :options="historyCategoryList"
                                @change="selectAttributes(item, $event)" :fieldNames="{
                                    label: 'threeCategoryName', value: 'threeCategoryId',
                                }" :filter-option="filterOption">
                            </a-select>
                            <a-button type="link" @click="changeCategory(item)">更换分类</a-button>
                            <p>
                                {{ getHistoryPath(item.typeId) }}
                            </p>
                            <a-table :columns="innerColumns" :data-source="item.innerTableData" bordered
                                :pagination="false" style="margin-top: 10px;">
                                <template #bodyCell="{ column, record }">
                                    <template v-if="column.dataIndex === 'catTheme'">
                                        {{ record.catTheme }}
                                    </template>
                                    <template v-if="column.dataIndex === 'ozonTheme'">
                                        <div>
                                            <a-select v-model:value="record.ozonTheme" allowClear placeholder="请选择"
                                                style="width: 180px;" :options="item.filterAttrOptions">
                                                <template #notFoundContent>
                                                    <div v-if="item.optionsLoading" w-180px h-150px flex justify-center
                                                        items-center>
                                                        <a-spin />
                                                    </div>
                                                    <div v-else flex justify-center items-center>
                                                        <a-empty />
                                                    </div>
                                                </template>
                                            </a-select>
                                        </div>
                                    </template>
                                </template>
                            </a-table>
                        </template>
                    </template>
                </a-table>
            </div>
        </a-modal>

        <!--  account ??? to do -->
        <CategoryModal ref="categoryModalRef" :account="account" @select="handleSelect"></CategoryModal>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import CategoryModal from "../comm/categoryModal.vue";
import {
    categoryTree,
    historyCategory,
    addHistoryCategory,
    categoryAttributes,

} from "@/pages/ozon/config/api/product.js";
import { batchSave, batchRelationDetail } from "@/pages/ozon/config/api/draft.js";
import { cloneDeep } from 'lodash';

const { shopAccount, account } = defineProps({
    shopAccount: {
        type: Array,
        default: () => []
    },
    account: {
        type: String,
        default: ''
    }
});

const platNames = {
    Ozon: 'Ozon',
    Tmall: '天猫',
    AliExpress: '速卖通',
};
const baseApi = import.meta.env.VITE_APP_BASE_API;
const platformSource = ref(''); // 平台来源
const dialogVisible = ref(false);
const acceptParams = ref([]);
const copyAcceptParams = ref([]);

// const resData = ref(null);
// const relationDetail = ref({});
const columns = [
    {
        title: '产品信息',
        dataIndex: 'primaryImage',
        key: 'primaryImage',
        width: 300

    },
    {
        title: '分类对应',
        dataIndex: 'category',
        key: 'category',
        width: 100
    },
    {
        title: 'OZON分类',
        dataIndex: 'ozonCategory',
        key: 'ozonCategory',
        width: 400
    },
];

const selectedRowList = ref([]); // 选中的行数据
const selectedRowKeys = ref([]);
const rowSelection = {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (rowKeys, rows) => {
        selectedRowKeys.value = rowKeys;
        selectedRowList.value = rows;
    },
};
// const isClear = ref(false); // 是否清空对应的变种主题
const innerColumns = computed(() => {
    return [
        {
            title: '变种主题',
            dataIndex: 'catTheme',
            key: 'catTheme',
            width: 150
        },
        {
            title: '对应Ozon变种主题',
            dataIndex: 'ozonTheme',
            key: 'ozonTheme',
            width: 150
        }]
});

//  筛选来源-列表
const sourceOptions = computed(() => {
    const list = copyAcceptParams.value.map((item) => {
        return {
            label: item.gatherPlatformName,
            value: item.gatherPlatformName
        }
    });
    const platformSourceList = [{
        label: '全部',
        value: ''
    }, ...list];
    const uniquePlatformSourceList = platformSourceList.filter((item, index) => {
        return platformSourceList.findIndex((i) => i.value === item.value) === index;
    });
    return uniquePlatformSourceList;
});

// 筛选来源
const selectSource = (value) => {
    if (!value) {
        acceptParams.value = copyAcceptParams.value;
    } else {
        acceptParams.value = copyAcceptParams.value.filter((item) => item.gatherPlatformName === value);
    }
};

const categoryModalEl = useTemplateRef('categoryModalRef');
const historyCategoryList = ref([]);
// const hisAttrObj = ref({}) //选中的三级
const secondCategoryId = ref(undefined);
const attributes = ref([]);
const filterAttrOptions = ref([]); // 过滤后的属性
const optionsLoading = ref(false); // 下拉框loading
// const tableData = ref([
//     {
//         primaryImage: '',
//         category: '',
//         ozonCategory: '',
//         gatherPlatformName: '',
//         account: ''
//     }
// ]);
// const innerTableData = ref([]);

// const form = reactive({
//     name: "",
//     shortCode: "",
//     categoryId: null,
// })

function filterOption(input, option) {
    return option.threeCategoryName.indexOf(input) >= 0;
};

const primaryImage = (primaryImage) => {
    if (primaryImage.includes('https')) {
        return primaryImage
    }
    return baseApi + primaryImage
};
function getFilterAttrs() {
    acceptParams.value.forEach((item) => {
        item.filterAttrOptions = item.attributes.filter((attrItem) => {
            return attrItem.isAspect
        }).map((attrItem) => {
            return {
                label: attrItem.name.replace(/\(.*\)/, ""), // 去掉（）里面的
                value: attrItem.id,
                attrLabel: attrItem.name,
            }
        });
    });
};


// 选择历史分类
const selectAttributes = async (item, value) => {
    item.optionsLoading = true;
    item.filterAttrOptions = [];
    item.innerTableData.forEach(innerItem => {
        innerItem.ozonTheme = undefined;
        innerItem.attrLabel = undefined;
    });
    const findItem = historyCategoryList.value.find((item) => {
        return item.threeCategoryId === value
    });
    const res = await categoryAttributes({
        account: item.account,
        descriptionCategoryId: findItem.secondCategoryId,  // bug to do
        typeId: value,
    })
    const data = res.data.filter((item) => {
        return item.isAspect
    }).map((item) => {
        return {
            label: item.name.replace(/\(.*\)/, ""), // 去掉（）里面的
            value: item.id,
            attrLabel: item.name,
        }
    })
    item.filterAttrOptions = data;
    item.optionsLoading = false;
};

// 更换分类
const changeCategory = (item) => {
    nextTick(() => {
        categoryModalEl.value.open(item.typeId);
    })
};

const handleSelect = async (data) => {
    dialogVisible.value = true;
    acceptParams.value.forEach(item => {
        console.log('item', item);

        item.typeId = data.value;
        item.filterAttrOptions = [];
        item.innerTableData.forEach(innerItem => {
            innerItem.ozonTheme = undefined;
            innerItem.attrLabel = undefined;
        });
    });

    //  如果选择不在历史分类里面，则添加到历史里面
    const findItem = historyCategoryList.value.find((item) => {
        return item.threeCategoryId === data.value
    });
    if (!findItem) {
        let params = {
            account,
            secondCategoryId: data.ids[1],
            threeCategoryId: data.ids[2],
        };
        await addHistoryCategory(params);
        const res = await historyCategory({ account })
        if (res.code === 200) {
            historyCategoryList.value = res.data || [];
        };
        // 获取属性
        const res2 = await categoryAttributes({
            account,
            descriptionCategoryId: data.ids[2],
            typeId: data.value,
        });
        if (res2.code === 200) {
            acceptParams.value.forEach((paramsItem) => {
                if (item.typeId === paramsItem.typeId) {
                    const filterAttr = res2.data.filter((attrItem) => {
                        return attrItem.isAspect
                    });
                    paramsItem.filterAttrOptions = filterAttr.map((attrItem) => {
                        return {
                            label: attrItem.name.replace(/\(.*\)/, ""), // 去掉（）里面的
                            value: attrItem.id,
                            attrLabel: attrItem.name,
                        }
                    });

                }
            })
        }
    } else {
        // 获取属性
        acceptParams.value.forEach((paramsItem) => {
            paramsItem.optionsLoading = true;
        })

        const res = await categoryAttributes({
            account,
            descriptionCategoryId: data.ids[1],
            typeId: data.value,
        });
        if (res.code === 200) {
            acceptParams.value.forEach((paramsItem) => {
                const filterAttr = res.data.filter((attrItem) => {
                    return attrItem.isAspect
                });
                paramsItem.filterAttrOptions = filterAttr.map((attrItem) => {
                    return {
                        label: attrItem.name.replace(/\(.*\)/, ""), // 去掉（）里面的
                        value: attrItem.id,
                        attrLabel: attrItem.name,
                    }
                });
                paramsItem.optionsLoading = false;
            })
        }
    }
};

const accountName = (account) => {
    return shopAccount.find(item => item.account === account)?.simpleName
};

// 批量修改分类
const showCategoryModal = () => {
    categoryModalEl.value.open(''); // to do
}

//  获取路劲
const getHistoryPath = (typeId) => {
    const findItem = historyCategoryList.value.find((item) => {
        return item.threeCategoryId === typeId
    });
    return findItem ? `${findItem.categoryName} > ${findItem.secondCategoryName} > ${findItem.threeCategoryName}` : '';

}

//  获取历史分类列表
const getHistoryList = async () => {
    console.log('acceptParams', acceptParams.value);
    const res = await historyCategory({ account });
    if (res.code === 200) {
        historyCategoryList.value = res.data || [];
    };
    const paramsList = acceptParams.value.filter((paramItem) => paramItem.typeId);
    //  去重
    const uniqueParamsList = paramsList.filter((item, index) => {
        return paramsList.findIndex((i) => i.typeId === item.typeId) === index;
    });
    uniqueParamsList.forEach((item) => {
        categoryAttributes({
            account,
            descriptionCategoryId: item.categoryId,
            typeId: item.typeId,
        }).then((res) => {
            if (res.code === 200) {
                acceptParams.value.forEach((paramsItem) => {
                    if (item.typeId === paramsItem.typeId) {
                        const filterAttr = res.data.filter((attrItem) => {
                            return attrItem.isAspect
                        });
                        paramsItem.filterAttrOptions = filterAttr.map((attrItem) => {
                            return {
                                label: attrItem.name.replace(/\(.*\)/, ""), // 去掉（）里面的
                                value: attrItem.id,
                                attrLabel: attrItem.name,
                            }
                        });

                    }
                })
            }
        })
    })
};

// 批量查询变种关联关系
const getVariantRelationList = async () => {
    const relationReqList = acceptParams.value.map(item => {
        return {
            productCollectId: item.gatherProductId,
            platformName: 'ozon'
        }
    })
    const res = await batchRelationDetail({
        "relationReqList": relationReqList
    })
    if (res.code === 200) {
        acceptParams.value.forEach((item) => {
            const findItem = res.data.find((relationItem) => {
                return relationItem.productCollectId === item.gatherProductId
            });
            if (findItem) {
                item.variantAttr = findItem.detailData || {};
                item.optionsLoading = true;
                item.innerTableData.forEach((innerItem) => {
                    const findVariantItem = findItem.variantRelationList.find((relationItem) => {
                        return relationItem.originalVariantName === innerItem.catTheme
                    })
                    if (findVariantItem) {
                        innerItem.ozonTheme = findVariantItem.attributeId
                        innerItem.attrLabel = findVariantItem.platformVariantName
                    }
                })
                item.optionsLoading = false;
            }
        })
    }
}


const open = async (data = []) => {
    acceptParams.value = data.map((item) => {
        let innerTableData = [];
        Object.keys(item.variantAttr).forEach((key) => {
            innerTableData.push({
                catTheme: key,
                ozonTheme: undefined,
                attrLabel: undefined,
            })
        });
        return {
            ...item,
            hisAttrObj: {},
            tableData: [{
                primaryImage: item.primaryImage,
                name: item.name,
                category: item.typeId,
                gatherPlatformName: item.gatherPlatformName,
                account: item.account,
            }],
            filterAttrOptions: [],
            innerTableData: innerTableData
        }
    });
    copyAcceptParams.value = cloneDeep(acceptParams.value);
    dialogVisible.value = true;
    // 批量查询变种关联关系
    await getVariantRelationList();
    // 获取历史分类
    await getHistoryList()

    // isClear.value = false;
    // acceptParams.value = data;
    // dialogVisible.value = true;
    // ozonRelationDetail({
    //     platformName: 'ozon',
    //     productCollectId: data.gatherProductId,
    // }).then((res) => {
    //     if (res.code === 200) {
    //         resData.value = res.data;
    //         relationDetail.value = res.data || {};
    //         if (JSON.stringify(relationDetail.value) != '{}') {
    //             tableData.value = [{
    //                 primaryImage: data.primaryImage,
    //                 name: data.name,
    //                 category: relationDetail.value.typeId,
    //                 gatherPlatformName: data.gatherPlatformName,
    //                 account: data.account,
    //             }];

    //             form.shortCode = data.account;
    //             form.categoryId = relationDetail.value.typeId;
    //             getHistoryList(data.account, relationDetail.value.typeId, relationDetail.value.categoryId);
    //         } else {

    //             tableData.value = [{
    //                 primaryImage: data.primaryImage,
    //                 name: data.name,
    //                 category: data.categoryId,
    //                 gatherPlatformName: data.gatherPlatformName,
    //                 account: data.account,
    //             }];

    //             form.shortCode = data.account;
    //             form.categoryId = data.typeId;
    //             getHistoryList(data.account, data.typeId, data.categoryId);
    //         }
    //     }
    // })
};

const cancel = () => {
    dialogVisible.value = false;
};
const platformName = (platform) => {
    return platNames[platform] ?? platform
};

// 从filterAttrOptions中找到attrLabel
const getAttrLabel = (value) => {
    return filterAttrOptions.value.find(item => item.value === value)?.attrLabel
}

// 编辑分类
const editCategory = () => {
    // let variantRelationList = innerTableData.value.map(item => {
    //     return {
    //         "originalVariantName": item.catTheme,
    //         "platformVariantName": getAttrLabel(item.ozonTheme),
    //         "attributeId": item.ozonTheme
    //     }
    // });
    // const params = {
    //     typeId: form.categoryId,
    //     "productCollectId": acceptParams.value.gatherProductId, //数据采集产品id或者采集箱产品id
    //     "platformName": "ozon",//所属平台
    //     "categoryId": hisAttrObj.value.secondCategoryId, // 二级分类id
    //     "variantRelationList": variantRelationList
    // };

    // // 对应Ozon变种主题 选择不能有一样的
    // const attributeIdList = variantRelationList.map(item => item.attributeId).filter(Boolean);

    // if (attributeIdList.every(item => item === undefined)) {
    //     message.error('请选择变种主题选择属性');
    //     return;
    // }
    // const hasRepeat = attributeIdList.some((item, index) => attributeIdList.indexOf(item) !== index);
    // if (hasRepeat) {
    //     message.error('对应Ozon变种主题，选择不能有重复');
    //     return;
    // }
    // ozonRelationSave(params).then((res) => {
    //     if (res.code === 200) {
    //         message.success('保存成功');
    //         emits('edit');
    //         cancel();
    //         window.open(`/platform/ozon/editDraftProduct?account=${acceptParams.value.account}&id=${acceptParams.value.gatherProductId}`, '_blank')
    //     }
    // })
};

//  跳过
const skip = () => {
    emits('skip');
    cancel();
};
const emits = defineEmits(['cancel', 'edit', 'skip', "sendShortCode", "getAttributes"]);
defineExpose({
    open
});
</script>
<style scoped>
.card {
    background-color: #f9f9f9;
}

.imgCss {
    width: 80px;
    height: 80px;
}

.info {
    color: #999;

    p {
        margin: 0;
    }
}

.tooltip-text {
    color: #a0a3a6;
    padding-top: 5px;
}
</style>