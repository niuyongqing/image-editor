<template>
    <div class="mt-10px">
        <!-- 产品信息 -->
        <a-card :bordered="true" style="margin: 0 auto; border-radius: 0px">
            <template #title>
                <div text-left> 产品信息 </div>
            </template>
            <a-form :model="state" :label-col="{ style: { width: '80px' } }" style="margin-left: 100px;" ref="formRef"
                scrollToFirstError>
                <a-form-item label="产品标题: " name="title"
                    :rules="[{ required: true, message: '请选择产品标题', trigger: ['change'] }]">
                    <a-input show-count :maxlength="255" v-model:value="state.title" placeholder="请选择产品标题" allowClear
                        class="flex  justify-start">
                    </a-input>
                </a-form-item>
                <a-form-item label="品牌:" name="brandId"
                    :rules="[{ required: true, message: '请选择品牌', trigger: ['change'] }]">
                    <a-select allowClear show-search @search="search" :filter-option="false"
                        v-model:value="state.brandId" :fieldNames="{ label: 'nameEn', value: 'brandId' }"
                        :not-found-content="brandIdSelction.searchLoading ? undefined : null"
                        :options="brandIdSelction.data" placeholder="请输入品牌">
                        <template v-if="brandIdSelction.searchLoadingg" #notFoundContent>
                            <a-spin size="small" />
                        </template>
                    </a-select>
                    <!-- 说明  -->
                    <div text-left pt-5px>
                        <a-tag color="#108ee9"> 说明! </a-tag>
                        <span class="text-#999"> 请选择下拉提示框品牌或者填写Lazada后台已有品牌，如无品牌则填写OEM。 </span>
                    </div>
                </a-form-item>
                <a-form-item label="型号: " name="model" v-show="lazadaAttrsState.attributes.length > 0"
                    :rules="[{ required: true, message: '请输入型号', trigger: ['change'] }]">
                    <a-input v-model:value="state.model" placeholder="" allowClear class="flex  justify-start">
                    </a-input>
                </a-form-item>
                <a-form-item label="质保类型: " name="warranty_type" v-show="lazadaAttrsState.attributes.length > 0"
                    :rules="[{ required: true, message: '请选择质保类型', trigger: ['change'] }]">
                    <a-select v-model:value="state.warranty_type" placeholder="" allowClear class="flex justify-start"
                        :options="lazadaAttrsState.warrantyTypeList"
                        :field-names="{ label: 'en_name', value: 'en_name' }">
                    </a-select>
                </a-form-item>
                <a-form-item label="质保时长: " name="warranty" v-show="lazadaAttrsState.attributes.length > 0">
                    <a-select v-model:value="state.warranty" placeholder="" allowClear class="flex justify-start"
                        :options="lazadaAttrsState.warrantyList" :field-names="{ label: 'en_name', value: 'en_name' }">
                    </a-select>
                </a-form-item>

                <a-form-item label="属性: " v-show="lazadaAttrsState.attributes.length > 0">
                    <a-card v-loading="lazadaAttrsState.loading" class="attrs-card">
                        <a-form :model="productAtrrsform" ref="attrsFormRef" scrollToFirstError>
                            <a-form-item v-for="item in sortAttrs(lazadaAttrsState.productClassifyAtrrs)"
                                :key="item.name" :name="item.name" :rules="itemRules(item)" :label="item.label"
                                :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
                                <!-- is_key_prop： 1 时，表示当前属性是项目的 key 属性 -->
                                <div flex>
                                    <a-tag color="#6288F4" v-if="item.advanced && item.advanced.is_key_prop === 1">
                                        KEY
                                    </a-tag>

                                    <a-input v-if="item.input_type === 'text'" v-model:value="item.value" placeholder=""
                                        allowClear></a-input>

                                    <!--  enuminput： 单选和可自定义输入; -->
                                    <a-select v-if="item.input_type === 'enumInput'" v-model:value="item.value"
                                        :field-names="{ label: 'en_name', value: 'en_name' }" placeholder="请选择"
                                        :options="item.options || []" allowClear @change="changeValue(item)"></a-select>

                                    <!-- 仅支持数字输入 -->
                                    <a-input-number v-if="item.input_type === 'numeric'" v-model:value="item.value"
                                        allowClear style="width: 100%" placeholder=""
                                        @change="changeValue(item)"></a-input-number>

                                    <!-- singleselect 单选不可自定义 -->
                                    <a-select v-if="item.input_type === 'singleSelect'" v-model:value="item.value"
                                        :field-names="{ label: 'en_name', value: 'en_name' }" placeholder="请选择"
                                        :options="item.options || []" allowClear @change="changeValue(item)"></a-select>

                                    <!-- 多选：多选不可自定义（逗号用于分隔多个选项）; -->
                                    <a-select v-if="item.input_type === 'multiSelect' && item.name != 'Hazmat'"
                                        v-model:value="item.value" mode="multiple" placeholder="请选择"
                                        :options="item.options || []"
                                        :field-names="{ label: 'en_name', value: 'en_name' }" allowClear
                                        @change="changeValue(item)"></a-select>

                                    <!-- date 仅支持日期输入-->
                                    <a-date-picker v-if="item.input_type === 'date'" v-model:value="item.value"
                                        allowClear />

                                    <!-- multiEnumInput -->
                                    <a-select v-if="item.input_type === 'multiEnumInput' && item.name != 'Hazmat'"
                                        v-model:value="item.value" mode="multiple" placeholder="请选择"
                                        :options="item.options || []"
                                        :field-names="{ label: 'en_name', value: 'en_name' }" allowClear
                                        @change="changeValue(item)"></a-select>

                                    <!-- richText 富文本-->
                                    <div v-if="item.input_type === 'richText'"> 富文本 </div>

                                    <!-- img 仅支持输入 Lazada 图片链接-->
                                    <a-input v-if="item.input_type === 'imgimg'" v-model:value="item.value"
                                        placeholder="" allowClear @change="changeValue(item)"></a-input>

                                    <!-- 危险品 -->
                                    <a-checkbox-group v-if="item.name === 'Hazmat'" v-model:value="item.value"
                                        style="display: flex;" mode="multiple" :options="hazmat(item.options) || []"
                                        @change="changeValue(item)"></a-checkbox-group>
                                </div>
                            </a-form-item>
                        </a-form>

                        <!-- 展开收起 -->
                        <div w-full flex justify-end>
                            <a-button class="flex justify-end" type="link" @click="isExpand = !isExpand"> {{ isExpand
                                ?
                                '- 收起'
                                : '+ 展开'
                                }}</a-button>
                        </div>

                    </a-card>
                </a-form-item>

            </a-form>
        </a-card>
    </div>
</template>

<script setup>
import { DownOutlined } from "@ant-design/icons-vue";
import { useResetReactive } from '@/composables/reset';
import { accountCache, categoryTree, getBrandList } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { debounce } from "lodash-es";
import { message } from "ant-design-vue";

const { state: lazadaAttrsState, } = useLazadaGobalAttrs();

const isExpand = ref(false); // 展开收起
const attributesLoading = ref(false);
const shortCode = ref('');
const shortCodes = ref([]); // 店铺列表
const formEl = useTemplateRef('formRef');
const attrsFormEl = useTemplateRef('attrsFormRef');
const primaryCategoryOptions = ref([]); // 分类列表
const { state } = useResetReactive({
    title: undefined,
    brandId: undefined,
    warranty_type: undefined,
    warranty: undefined,
});
const brandIdSelction = reactive({
    data: [],
    searchLoading: false
});
//  产品属性表单
const productAtrrsform = reactive({});
const itemRules = (item) => {
    return [{ required: item.is_mandatory === 1, trigger: ['change'], message: item.is_mandatory === 1 ? '必填项，请填写' : '' }]
};

const changeValue = (item) => {
    productAtrrsform[item.name] = item.value; // 更新表单数据
};

const search = debounce((value) => {
    if (!value) return;
    if (!shortCode.value) {
        message.error('请先选择店铺');
        return
    };
    brandIdSelction.data = [];
    brandIdSelction.searchLoading = true;
    getBrandList({ brandName: value, shortCode: shortCode.value }).then(res => {
        if (res.code === 200) {
            brandIdSelction.data = res.data || [];
        }
    }).finally(() => {
        brandIdSelction.searchLoading = false;
    });

}, 200);

const sortAttrs = (attrs) => {
    const attrsFilter = attrs.filter(item => {
        return item.label
    });
    const list = attrsFilter.sort((a, b) => {
        if (a.is_mandatory !== 0 && b.is_mandatory === 0) return -1;
        if (b.is_mandatory !== 0 && a.is_mandatory === 0) return 1;
        if (a.advanced.is_key_prop === 1 && b.advanced.is_key_prop === 0) return -1;
        return 0;
    });
    // 如果是展开
    if (isExpand.value) {
        return list
    } else {
        return list.filter(item => {
            return item.is_mandatory === 1 || item.advanced.is_key_prop === 1
        })
    }
};
const hazmat = (options) => {
    const list = options.map((item) => {
        return item.name;
    });
    return list;
};
// 校验
const validateForm = async () => {
    return new Promise((resolve, reject) => {
        formEl.value.validate().then(() => {
            attrsFormEl.value.validate().then(() => {
                resolve(true);
            }).catch(() => {
                document.querySelector('.ant-form-item-has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                reject(false);
            })
        }).catch(() => {
            document.querySelector('.ant-form-item-has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            reject(false);
        })
    });
};

// 清除校验
const clearValidate = () => {
    formEl.value.clearValidate();
    attrsFormEl.value.clearValidate();
};

watch(() => lazadaAttrsState.loading, (newValue) => {
    clearValidate();
})

//  产品资料库回显
watch(() => lazadaAttrsState.product, (newValue) => {
    if (newValue && JSON.stringify(newValue) !== '{}') {
        console.log('newValue', newValue);
        clearValidate();
        state.title = newValue.tradeName; // 产品标题
        //lazada 资料库数据回显 to do ...
    }
});

defineExpose({
    state,
    validateForm
});

onMounted(() => {
    EventBus.on('gobalAddShortCodeEmit', (code) => {
        console.log('接受到的shortCode -->>', code);
        shortCode.value = code;
        brandIdSelction.brandId = undefined;
        getBrandList({ brandName: '', shortCode: code }).then(res => {
            if (res.code === 200) {
                brandIdSelction.data = res.data || [];
                //  品牌设置默认 No Brand
                const brandItem = brandIdSelction.data.find((item) => {
                    return item.nameEn === 'OEM'
                });
                brandIdSelction.brandId = brandItem ? brandItem.brandId : undefined;
                state.brandId = brandIdSelction.brandId;
            }
        }).finally(() => {
            brandIdSelction.searchLoading = false;
        });

    });
});
onBeforeUnmount(() => {
    EventBus.off('gobalAddShortCodeEmit')
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item-explain-error) {
    text-align: left;
}

:deep(.ant-select-selector) {
    text-align: left;
}

.attrs-card {
    max-height: 600px;
    overflow-y: auto;
}
</style>