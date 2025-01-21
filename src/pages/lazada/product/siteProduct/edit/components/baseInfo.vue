<template>
    <div class="mt-10px">
        <!-- 基本信息 -->
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 基本信息 </div>
            </template>
            <a-form :model="state" :label-col="{ style: { width: '80px' } }" style="margin-left: 100px;" ref="formRef"
                scrollToFirstError>
                <a-form-item label="店铺: " name="shortCode"
                    :rules="[{ required: true, message: '请选择店铺', trigger: ['change'] }]">
                    <a-select class="flex w-full justify-start" v-model:value="state.shortCode" placeholder="请选择店铺"
                        @change="changeShortCode" allowClear :options="shortCodes"
                        :fieldNames="{ label: 'simpleName', value: 'shortCode' }" style="width: 250px;"
                        :disabled="state.shortCode ? true : false">
                    </a-select>
                </a-form-item>
                <a-form-item label="分类:" name="primaryCategory" :rules="[{ required: true, message: '请选择分类' }]"
                    v-loading="loading">
                    <a-cascader :showSearch="showSearchConfig" class="flex w-full justify-start"
                        v-model:value="state.primaryCategory" :options="primaryCategoryOptions" placeholder="请先选择店铺"
                        allowClear :fieldNames="{ label: 'name2', value: 'categoryId', children: 'children' }"
                        @change="changePrimaryCategory" :disabled="state.primaryCategory ? true : false">
                        <template #notFoundContent>
                            <div v-if="primaryCategoryOptions.length === 0">
                                暂无数据
                            </div>
                            <div w-full h-300px flex items-center justify-center m-auto v-else>
                                <a-spin :spinning="true" tip="正在加载中..." m-auto>
                                </a-spin>
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
import { useLadazaAttrs } from "@/stores/lazadaAttrs";
import { findCategoryPath } from '@/pages/lazada/product/common';
import { unique } from '@/pages/lazada/product/common';

const { detailData } = defineProps({
    detailData: {
        type: Object,
        default: () => ({})
    }
});
const {
    state: lazadaAttrsState, setShortCode, setPrimaryCategory,
    setLazadaAttrs, setLoading, setProductClassifyAtrrs,
    setSelectTheme
} = useLadazaAttrs();

const loading = ref(false);
const shortCodes = ref([]); // 店铺列表
const formEl = useTemplateRef('formRef');
const primaryCategoryLoading = ref(false);
const primaryCategoryOptions = ref([]); // 分类列表
const attributes = ref([]); // 分类 属性列表
const { state } = useResetReactive({
    shortCode: undefined,
    primaryCategory: undefined,
});
const showSearchConfig = {
    filter: (inputValue, path) => {
        return path.some(option => option.name2.toLowerCase().includes(inputValue.toLowerCase()));
    }
};
//  编辑回显
watch(() => {
    return detailData
}, async (newVal) => {
    loading.value = true;
    state.shortCode = newVal.shortCode;
    EventBus.emit('siteEditShortCodeEmit', state.shortCode);
    setShortCode(state.shortCode);
    await getCategorys();
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
    const selectThemeList = lazadaAttrsState.skuAttrs.filter((item) => {
        return keys.includes(item.name)
    });
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
        const findItem = selectThemeList.find(item => item.name === key);
        let options = [];
        if (findItem) {
            let itemOptions = findItem?.options ?? [];

            const has = itemOptions.find((option) => {
                return formattedResult[key] === option.en_name
            });
            if (!has) {
                findItem.options = itemOptions.concat(formattedResult[key].map((keyItem) => ({ name: keyItem, en_name: keyItem })));
                itemOptions = findItem.options;
                options = itemOptions;
            } else {
                options = itemOptions;
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
    setSelectTheme(resultData)
    EventBus.emit('siteEditSelectThemeEmit', resultData);
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
    };
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
        setLazadaAttrs(attributes.value);
    };
};

const changeShortCode = (value) => {
    getCategorys();
    setShortCode(value);
    state.primaryCategory = undefined;
    setLazadaAttrs([])
    EventBus.emit('siteEditShortCodeEmit', value);
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