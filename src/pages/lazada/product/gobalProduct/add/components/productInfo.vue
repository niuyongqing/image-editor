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
                <a-form-item label="分类:" name="primaryCategory" :rules="[{ required: true, message: '请选择分类' }]">
                    <a-form-item-rest>
                        <a-cascader :showSearch="showSearchConfig" class="flex w-full justify-start"
                            v-model:value="state.primaryCategory" :options="primaryCategoryOptions" placeholder="请先选择店铺"
                            allowClear :fieldNames="{ label: 'name', value: 'categoryId', children: 'children' }"
                            @change="changePrimaryCategory">
                            <template #notFoundContent>
                                <div w-full h-300px flex items-center justify-center m-auto>
                                    <a-spin :spinning="true" tip="正在加载中..." m-auto>
                                    </a-spin>
                                </div>
                            </template>
                        </a-cascader>
                    </a-form-item-rest>
                    <div v-show="lazadaAttrsState.productName && suggestion.length > 0">
                        <a-form-item-rest>
                            <a-card style="width: 50%;margin: 10px 0;text-align: left;" title="分类建议">
                                <div v-for="(item, index) in suggestion" :key="index" style="margin-bottom: 10px">
                                    <a-form-item-rest>
                                        <a-cascader :showSearch="showSearchConfig"
                                            style="background-color: #ffffff;width: 80%;" filterable
                                            v-model:value="item.categoryIds" :options="primaryCategoryOptions"
                                            @change="changePrimaryCategory"
                                            :fieldNames="{ label: 'name', value: 'categoryId', children: 'children' }"></a-cascader>
                                    </a-form-item-rest>
                                    <a-button @click="fillCategory(item.categoryIds)">自动填充</a-button>
                                </div>
                            </a-card>
                        </a-form-item-rest>
                    </div>
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
                            <a-form-item>
                                <div flex items-center gap-8px ml-20px>
                                    <a-switch v-model:checked="disableAttributeAutoFill" checked-children="开"
                                        un-checked-children="关" />
                                    <span style="color: #9fa0a2">自动填充</span>
                                </div>
                            </a-form-item>

                            <a-form-item v-for="item in sortAttrs(lazadaAttrsState.productClassifyAtrrs)"
                                :key="item.name" :name="item.name" :rules="itemRules(item)" :label="item.label"
                                :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
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
                                    <a-input v-if="item.input_type === 'img'" v-model:value="item.value" placeholder=""
                                        allowClear @change="changeValue(item)"></a-input>

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
import { accountCache, categoryTree, getBrandList, hasValueAttributes,categorySuggestion,categoryAttributesApi } from '@/pages/lazada/product/api';
import EventBus from "~/utils/event-bus";
import { debounce } from "lodash-es";
import { message } from "ant-design-vue";
import { findParentIds } from '../../../common/index'
const { state: lazadaAttrsState, setLazadaAttrs, setLoading, setPrimaryCategory } = useLazadaGobalAttrs();
const disableAttributeAutoFill = ref(true); // 自动填充
const isExpand = ref(false); // 展开收起
const attributesLoading = ref(false);
const shortCode = ref('');
const shortCodes = ref([]); // 店铺列表
const primaryCategoryLoading = ref(false);
const attributes = ref([]); // 分类 属性列表
const suggestion = ref([]); // 根据标题推荐分类
const formEl = useTemplateRef('formRef');
const attrsFormEl = useTemplateRef('attrsFormRef');
const primaryCategoryOptions = ref([]); // 分类列表
const { state } = useResetReactive({
    title: lazadaAttrsState.productName,
    brandId: undefined,
    warranty_type: undefined,
    warranty: undefined,
    primaryCategory: [],
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

const showSearchConfig = {
    filter: (inputValue, path) => {
        return path.some(option => option.name.toLowerCase().includes(inputValue.toLowerCase()));
    }
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


async function getCategorys() {
    primaryCategoryLoading.value = true;
    const categoryTreeRes = await categoryTree({ shortCode: lazadaAttrsState.shortCode });
    if (categoryTreeRes.code === 200) {
        primaryCategoryLoading.value = false;
        const data = categoryTreeRes.data || [];
        function treeToArr(arr) {
            arr.forEach(item => {
                item.name = item.name + ' ( ' + item.translateName + ' )' 
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
    categoryAttributesApi({
        shortCode: lazadaAttrsState.shortCode,
        primaryCategoryId: state.primaryCategory[state.primaryCategory.length - 1]
    }).then((res) => {
        if (res.code === 200) {
            attributes.value = res.data || [];
            setLazadaAttrs(attributes.value);
            EventBus.emit('gobalAddAttrsEmit');
        }
    })
};

const changePrimaryCategory = (value) => {
    console.log("value222",value);
    
    setPrimaryCategory(value);
    getAttributes(value)
};

const fillCategory = (value) => {
    console.log("value333",value);
    state.primaryCategory = value
    setPrimaryCategory(state.primaryCategory);
}

const getCategorySuggestion = debounce(() => {
    categorySuggestion({ shortCode: lazadaAttrsState.shortCode, name: lazadaAttrsState.productName }).then(res => {
        if (res.data) {
            suggestion.value = res.data.categorySuggestions.map(item => {
                return {
                    ...item,
                    categoryIds: findParentIds(primaryCategoryOptions.value, item.categoryId),
                }
            })
        } else {
            suggestion.value = []
        }
        console.log("suggestion",suggestion.value);
        
    })
}, 300)

watch(() => state.title, (newValue) => {
    if (newValue && lazadaAttrsState.shortCode) {
        getCategorySuggestion();
    }
}, { deep: true })

watch(() => lazadaAttrsState.loading, (newValue) => {
    clearValidate();
})

//  产品资料库回显
watch(() => lazadaAttrsState.product, (newValue) => {
    if (newValue && JSON.stringify(newValue) !== '{}') {
        clearValidate();
        state.title = newValue.tradeName; // 产品标题
        //lazada 资料库数据回显
        if (!disableAttributeAutoFill.value) return;
        hasValueAttributes({
            "shortCode": shortCode.value,
            "primaryCategoryId": lazadaAttrsState.primaryCategory[lazadaAttrsState.primaryCategory.length - 1],
        }).then(res => {
            if (res.code === 200) {
                const obj = res.data || {};
                lazadaAttrsState.productClassifyAtrrs.forEach((item) => {
                    for (let key in obj) {
                        if (item.name === key) {
                            // 多选数据转为数组
                            if (item.input_type.includes('multi')) {
                                item.value = obj[key] ? obj[key].split(',') : [];
                            } else {
                                item.value = obj[key]
                            }
                        }
                    }
                })
            }
        });
    }
});


watch(() => state.title, (newValue) => {
    if(newValue) {
        lazadaAttrsState.productName = newValue;
    }
})

watch(() => lazadaAttrsState.shortCode, (newValue) => {
    if(newValue) {
        getCategorys();
        setLazadaAttrs([])
        state.primaryCategory = undefined;
    }
},{deep: true})


watch(() => state.primaryCategory, (newValue) => {
    if(newValue) {
        getAttributes()
    }
})


defineExpose({
    state,
    validateForm
});

onMounted(() => {
    EventBus.on('gobalAddShortCodeEmit', (code) => {
        shortCode.value = code;
        brandIdSelction.brandId = undefined;
        getBrandList({ brandName: '', shortCode: code }).then(res => {
            if (res.code === 200) {
                brandIdSelction.data = res.data || [];
                //  品牌设置默认 No Brand
                const brandItem = brandIdSelction.data.find((item) => {
                    return item.nameEn === 'No Brand'
                });
                brandIdSelction.brandId = brandItem ? brandItem.brandId : undefined;
                state.brandId = brandIdSelction.brandId;
            }
        }).finally(() => {
            brandIdSelction.searchLoading = false;
        });
    });

    EventBus.on('gobalAddAttrsEmit', () => {
        console.log("primaryCategory",lazadaAttrsState.primaryCategory);
        
        //  根据分类回显属性
        if (!disableAttributeAutoFill.value) return;
        hasValueAttributes({
            "shortCode": shortCode.value,
            "primaryCategoryId": lazadaAttrsState.primaryCategory[lazadaAttrsState.primaryCategory.length - 1],
        }).then(res => {
            if (res.code === 200) {
                const obj = res.data || {};
                lazadaAttrsState.productClassifyAtrrs.forEach((item) => {
                    for (let key in obj) {
                        if (item.name === key) {
                            // 多选数据转为数组
                            if (item.input_type.includes('multi')) {
                                item.value = obj[key] ? obj[key].split(',') : [];
                            } else {
                                item.value = obj[key]
                            }
                        }
                    }
                })
            }
        });
    });

});
onBeforeUnmount(() => {
    EventBus.off('gobalAddShortCodeEmit');
    EventBus.off('gobalAddAttrsEmit');
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