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
                        :fieldNames="{ label: 'simpleName', value: 'shortCode' }" style="width: 250px;">
                    </a-select>
                </a-form-item>
                <a-form-item label="分类:" name="primaryCategory" :rules="[{ required: true, message: '请选择分类' }]">
                    <a-cascader class="flex w-full justify-start" v-model:value="state.primaryCategory"
                        :options="primaryCategoryOptions" placeholder="请先选择店铺" allowClear
                        :fieldNames="{ label: 'name', value: 'category_id', children: 'children' }"
                        @change="changePrimaryCategory" />
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { useReseReactive } from '@/composables/reset';
import { accountCache, categoryTree, categoryAttributesApi } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { useLadazaAttrs } from "@/stores/lazadaAttrs";

const { state: lazadaAttrsState, setShortCode, setLazadaAttrs, setLoading } = useLadazaAttrs();
const shortCodes = ref([]); // 店铺列表
const formEl = useTemplateRef('formRef');
const primaryCategoryOptions = ref([]); // 分类列表
const attributes = ref([]); // 分类 属性列表
const { state } = useReseReactive({
    shortCode: undefined,
    primaryCategory: undefined,
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
    const categoryTreeRes = await categoryTree({ shortCode: state.shortCode });
    if (categoryTreeRes.code === 200) {
        primaryCategoryOptions.value = categoryTreeRes.data || [];
    };
};

// 获取分类属性
async function getAttributes() {
    console.log('getAttributes', state.primaryCategory.length);
    if (!state.primaryCategory.length) return;
    setLoading(true);
    categoryAttributesApi({
        shortCode: state.shortCode,
        primaryCategoryId: state.primaryCategory[state.primaryCategory.length - 1]
    }).then((res) => {
        if (res.code === 200) {
            attributes.value = res.data || [];
            setLazadaAttrs(attributes.value);
        }
    })
};

const changeShortCode = (value) => {
    getCategorys();
    setShortCode(value);
    state.primaryCategory = undefined;
    setLazadaAttrs([])
    EventBus.emit('shortCodeEmit', value);
};

const changePrimaryCategory = (value) => {
    console.log('changePrimaryCategory', value);
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