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
                        <a-form-item-rest>
                            <a-select class="flex w-full justify-start" v-model:value="state.shortCode"
                                placeholder="请选择店铺" @change="changeShortCode" allowClear :options="shortCodes"
                                :fieldNames="{ label: 'simpleName', value: 'shortCode' }" style="width: 250px;">
                            </a-select>
                        </a-form-item-rest>
                        <div flex ml-10px>
                            <span> 同步发布到其他站点： </span>
                            <a-form-item-rest>
                                <a-checkbox style="margin-right: 10px" v-model:checked="checkAll"
                                    @change="handleCheckAllChange">
                                    全部
                                </a-checkbox>
                            </a-form-item-rest>
                            <a-form-item-rest>
                                <a-checkbox-group v-model:value="state.ventures" @change="checkedCitiesChange">
                                    <a-checkbox v-for="item in globalArea" :value="item.value" :key="item.value">{{
                                        item.label
                                        }}</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item-rest>
                        </div>
                    </div>
                </a-form-item>
                <a-form-item label="Global Plus：" name="gpList">
                    <div text-left ml-1>
                        <a-form-item-rest>
                            <a-checkbox style="margin-right: 10px" v-model:checked="checkSkuVAll"
                                @change="onChangeCheckAll">
                                全部
                            </a-checkbox>
                        </a-form-item-rest>
                        <a-form-item-rest>
                            <a-checkbox-group v-model:value="state.skuVentures" @change="onChangeCheck">
                                <a-checkbox v-for="item in globalArea" :value="item.value" :key="item.value">{{
                                    item.label
                                    }}</a-checkbox>
                            </a-checkbox-group>
                        </a-form-item-rest>
                    </div>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { useResetReactive } from '@/composables/reset';
import { accountCache, categoryTree } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { useLazadaGobalAttrs } from "~@/stores/lazadaGobalAttrs";
import { debounce } from "lodash-es";

const { state: lazadaAttrsState, setShortCode, setVentures } = useLazadaGobalAttrs();

const checkAll = ref(true);
const checkSkuVAll = ref(true);
const globalArea = [
    {
        label: "马来西亚",
        value: "MY"
    },
    {
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
    }
];
const shortCodes = ref([]); // 店铺列表
const formEl = useTemplateRef('formRef');
const { state } = useResetReactive({
    shortCode: undefined,
    primaryCategory: [],
    ventures: ["MY", "ID", "PH", "SG", "TH", "VN"],
    skuVentures: ["MY", "ID", "PH", "SG", "TH", "VN"]
});

const onChangeCheckAll = (e) => {
    const selectOptions = globalArea.map(item => item.value);
    state.skuVentures = e.target.checked ? selectOptions : [];
    setVentures(state.skuVentures);
};
const onChangeCheck = (checkedList) => {
    checkSkuVAll.value = checkedList.length === globalArea.length;
    setVentures(checkedList);
};

const handleCheckAllChange = (value) => {
    if (checkAll.value) {
        state.ventures = globalArea.map(v => v.value)
        state.skuVentures = globalArea.map(v => v.value)
    } else {
        state.ventures = []
        state.skuVentures = []
    };
    setVentures(state.skuVentures);
};

const checkedCitiesChange = (value) => {
    if (value.length === globalArea.length) {
        checkAll.value = true
    } else {
        checkAll.value = false
    };
    state.skuVentures = value;
    setVentures(state.skuVentures);
};

async function getShortCodes() {
    const accountCacheRes = await accountCache();
    if (accountCacheRes.code === 200) {
        let codes = [];
        for (const resKey in accountCacheRes.data.accountDetail) {
            codes.push(...accountCacheRes.data.accountDetail[resKey])
        };
        shortCodes.value = codes.filter(v => v.country === 'my')
    };
};



const changeShortCode = (value) => {
    setShortCode(value);
    EventBus.emit('gobalAddShortCodeEmit', value);
};

// 表单校验
async function validateForm() {
    return new Promise((resolve, reject) => {
        formEl.value.validate().then(() => {
            resolve(true);
            emits('valid', true)
        }).catch(() => {
            document.querySelector('.ant-form-item-has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            reject(false);
            emits('valid', false)
        })
    })
}




const emits = defineEmits(['valid']);
defineExpose({
    state,
    validateForm
});

onMounted(() => {
    getShortCodes();
});
</script>

<style lang="less" scoped>
.tag-title {
    color: #434649;
    font-weight: 600;
    font-size: 14px;
    padding-top: 10px;
}

.tag-content {
    color: #434649;
    font-weight: 400;
    font-size: 13px;
}

.tag-bottom {
    color: #ec4339;
    font-size: 14px;
}

:deep(.ant-form-item-explain-error) {
    text-align: left;
}

:deep(.ant-select-selector) {
    text-align: left;
}
</style>