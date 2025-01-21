<template>
    <div class="mt-10px">
        <!-- 基本信息 -->
        <a-tag color="orange" style="width: 100%;">
            <div class="tag-title"> 6合1发布功能——特别说明： </div>
            <div pt-5px>
                <p class="tag-content">
                    1、6合1发布功能，只有通过选择马来站的店铺，才支持6合1发布；
                </p>
                <p class="tag-content">
                    2、6合1发布不保证全部站点发布成功，可能错误的原因：发布属性缺失、部分站点货币转换错误、对应站点有必填属性导致发布失败；
                </p>
            </div>
            <div>
                <p class="tag-bottom">
                    目前Lazada官方只提供了现有接口，发布过程中如遇任何问题，请联系Lazada官方服务人员。最终解释权归Lazada官方所有！
                </p>
            </div>
        </a-tag>
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px; margin-top: 10px;">
            <template #title>
                <div text-left> 基本信息 </div>
            </template>
            <a-form :model="state" :label-col="{ style: { width: '80px' } }" style="margin-left: 100px;" ref="formRef"
                scrollToFirstError>
                <a-form-item label="店铺: " name="shortCode"
                    :rules="[{ required: true, message: '请选择店铺', trigger: ['change'] }]">
                    <div flex>
                        <a-select class="flex w-full justify-start" v-model:value="state.shortCode" placeholder="请选择店铺"
                            @change="changeShortCode" allowClear :options="shortCodes"
                            :fieldNames="{ label: 'simpleName', value: 'shortCode' }" style="width: 250px;">
                        </a-select>
                        <div flex ml-10px>
                            <span> 同步发布到其他站点： </span>
                            <a-checkbox style="margin-right: 10px" v-model:checked="checkAll"
                                @change="handleCheckAllChange">
                                全部
                            </a-checkbox>
                            <a-checkbox-group v-model:value="state.ventures" @change="checkedCitiesChange">
                                <a-checkbox v-for="item in globalArea" :value="item.value" :key="item.value">
                                    {{ item.label }}
                                </a-checkbox>
                            </a-checkbox-group>
                        </div>
                    </div>
                </a-form-item>
                <a-form-item label="分类:" name="primaryCategory" :rules="[{ required: true, message: '请选择分类' }]"
                    v-loading="loading">
                    <a-cascader :showSearch="showSearchConfig" class="flex w-full justify-start"
                        v-model:value="state.primaryCategory" :options="primaryCategoryOptions" placeholder="请先选择店铺"
                        allowClear :fieldNames="{ label: 'name2', value: 'categoryId', children: 'children' }"
                        @change="changePrimaryCategory">
                        <template #notFoundContent>
                            <div w-full h-300px flex items-center justify-center m-auto>
                                <a-spin :spinning="true" tip="正在加载中..." m-auto />
                            </div>
                        </template>
                    </a-cascader>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { useResetReactive } from '@/composables/reset';
import { accountCache, categoryTree, categoryAttributesApi } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { useLazadaWaitPublish } from "@/stores/lazadaWaitPublish";
import { unique, findCategoryPath } from '@/pages/lazada/product/common';

const { detailData } = defineProps({
    detailData: {
        type: Object,
        default: () => ({})
    }
});

const checkAll = ref(false);
const globalArea = [{
    label: "印度尼西亚",
    value: "ID"
},
{
    label: "菲律宾",
    value: "PH"
},
{
    label: "新加坡",
    value: "SG"
},
{
    label: "泰国",
    value: "TH"
},
{
    label: "越南",
    value: "VN"
},

{
    label: "马来西亚",
    value: "MY"
}];

const { state: lazadaAttrsState, setShortCode,
    setPrimaryCategory, setLazadaAttrs, setLoading,
    setProductClassifyAtrrs, setSelectTheme
} = useLazadaWaitPublish();
const loading = ref(false);
const shortCodes = ref([]); // 店铺列表
const formEl = useTemplateRef('formRef');
const primaryCategoryLoading = ref(false);
const primaryCategoryOptions = ref([]); // 分类列表
const attributes = ref([]); // 分类 属性列表
const { state } = useResetReactive({
    shortCode: undefined,
    primaryCategory: undefined,
    ventures: [],
});
const showSearchConfig = {
    filter: (inputValue, path) => {
        return path.some(option => option.name2.toLowerCase().includes(inputValue.toLowerCase()));
    }
};

const handleCheckAllChange = (value) => {
    if (checkAll.value) {
        state.ventures = globalArea.map(v => v.value)
    } else {
        state.ventures = []
    }
};

const checkedCitiesChange = (value) => {
    if (value.length === globalArea.length) {
        checkAll.value = true
    } else {
        checkAll.value = false
    }
};

//  编辑回显
watch(() => {
    return detailData
}, async (newVal) => {
    console.log('newVal ->>', newVal);

    // loading.value = true;
    state.shortCode = newVal.shortCode;
    state.ventures = newVal.ventures.venture || [];
    checkAll.value = state.ventures.length === globalArea.length;
    EventBus.emit('waitPublishShortCodeEmit', state.shortCode);
    setShortCode(state.shortCode);
    await getCategorys();
    console.log('primaryCategoryOptions.value ->>>>>>>', primaryCategoryOptions.value);
    const data = findCategoryPath(primaryCategoryOptions.value, newVal.primaryCategory);
    state.primaryCategory = data || [];
    validateCodeRule();
    setPrimaryCategory(state.primaryCategory);
    loading.value = false;
    await getAttributes();
    setProductClassifyAtrrs(newVal.attributes); // 回显详情的分类属性值
    const skus = newVal.skus || [];
    const keys = Object.keys(skus[0].saleProp);
    let values = [];
    skus.forEach((item) => {
        const vals = Object.values(item.saleProp);
        values.push(...vals);
    });

    const saleProps = skus.map((item) => {
        return item.saleProp;
    });
    console.log('lazadaAttrsState.skuAttrs', lazadaAttrsState.skuAttrs);

    const selectThemeList = lazadaAttrsState.skuAttrs.filter((item) => {
        return keys.includes(item.name)
    });
    console.log('selectThemeList', selectThemeList);

    const result = saleProps.reduce((acc, item) => {
        Object.keys(item).forEach(key => {
            if (!acc[key]) {
                acc[key] = new Set();
            }
            acc[key].add(item[key]);
        });
        return acc;
    }, {});

    const formattedResult = Object.keys(result).reduce((acc, key) => {
        acc[key] = Array.from(result[key]);
        return acc;
    }, {});
    const resultData = keys.map(key => {
        console.log('keys', keys);

        const findItem = selectThemeList.find(item => item.name === key);
        let options = [];
        if (findItem) {
            const has = findItem.options.find((option) => {
                return formattedResult[key] === option.en_name
            });
            if (!has) {
                findItem.options = findItem.options.concat(formattedResult[key].map((keyItem) => ({ name: keyItem, en_name: keyItem })));
                options = findItem.options;
            } else {
                options = findItem.options
            }
        } else {
            options = (formattedResult[key].map((keyItem) => ({ name: keyItem, en_name: keyItem })) || [])
        }

        const optionsUnique = unique('en_name', options); // 去重
        return {
            name: findItem ? findItem.name : key,
            label: findItem ? findItem.label : key,
            is_mandatory: findItem ? findItem.is_mandatory : 0,
            input_type: findItem ? findItem.input_type : 'multiEnumInput',
            checkedList: formattedResult[key] || [],
            attribute_type: findItem ? findItem.attribute_type : 'sku',
            options: optionsUnique,
            skuOptions: optionsUnique
        }
    });
    console.log('resultData', resultData);
    setSelectTheme(resultData)
    EventBus.emit('waitEditSelectThemeEmit', resultData);
}, {
    deep: true
});


async function getShortCodes() {
    const accountCacheRes = await accountCache();
    if (accountCacheRes.code === 200) {
        let codes = [];
        for (const resKey in accountCacheRes.data.accountDetail) {
            codes.push(...accountCacheRes.data.accountDetail[resKey])
        };
        shortCodes.value = codes
    };
};

async function getCategorys() {
    primaryCategoryLoading.value = true;
    const categoryTreeRes = await categoryTree({ shortCode: state.shortCode });
    if (categoryTreeRes.code === 200) {
        primaryCategoryLoading.value = false;
        const data = categoryTreeRes.data || [];
        function treeToArr(arr) {
            arr.forEach(item => {
                item.name2 = item.name + ' ( ' + item.translateName + ' )'
                if (item.children && item.children.length > 0) {
                    treeToArr(item.children)
                }
                if (!item.children || item.children.length === 0) {
                    delete item.children
                }
            })
            return arr
        };
        primaryCategoryOptions.value = treeToArr(data)
    } else {
        loading.value = false;
    }
};

// 获取分类属性
async function getAttributes() {
    if (!state.primaryCategory.length) return;
    setLoading(true);
    const res = await categoryAttributesApi({
        shortCode: state.shortCode,
        primaryCategoryId: state.primaryCategory[state.primaryCategory.length - 1]
    });
    if (res.code === 200) {
        attributes.value = res.data || [];
        console.log('attributes', attributes.value);

        setLazadaAttrs(attributes.value);
    };
};

const changeShortCode = (value) => {
    getCategorys();
    setShortCode(value);
    state.primaryCategory = undefined;
    setLazadaAttrs([])
    EventBus.emit('waitPublishShortCodeEmit', value);
};

const changePrimaryCategory = (value) => {
    setPrimaryCategory(value);
    getAttributes(value)
};

// 分类校验
async function validateCodeRule() {
    return await formEl.value.validateFields(['primaryCategory']);
};

// 表单校验
async function validateForm() {
    return new Promise((resolve, reject) => {
        formEl.value.validate().then(() => {
            resolve(true);
        }).catch(() => {
            document.querySelector('.ant-form-item-has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            reject(false);
        })
    })
}

defineExpose({
    state,
    validateForm
});

onMounted(() => {
    getShortCodes();
    validateCodeRule();
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-explain-error) {
    text-align: left;
}

:deep(.ant-select-selector) {
    text-align: left;
}
</style>