<template>
    <div id="OzonBaseInfoCont">
        <a-card title="基本信息" style="text-align: left">
            <a-form :label-col="{ span: 3 }" ref="ruleForm" :model="form" class="mt-5 shopForm" :rules="rules">
                <a-form-item label="店铺：" name="shortCode">
                    <a-select v-model:value="form.shortCode" size="middle" placeholder="请选择店铺" style="width: 90%"
                        allowClear showSearch optionFilterProp="label" :options="shopList" @change="getHistoryList">
                    </a-select>
                </a-form-item>
                <a-form-item label="商品标题：" name="name">
                    <a-input style="width: 90%" v-model:value="form.name" size="middle" placeholder="请输入产品名称(用俄语或英语)"
                        :maxlength="255" showCount></a-input>
                </a-form-item>
                <a-form-item label="VAT：" name="vat">
                    <a-select v-model:value="form.vat" allowClear style="width: 90%" size="middle" :options="vatList">
                    </a-select>
                </a-form-item>
                <a-form-item label="分类：" name="categoryId">
                    <a-select v-model:value="form.categoryId" allowClear showSearch size="middle" labelInValue
                        placeholder="请选择" style="width: 200px" :options="historyCategoryList" @change="selectAttributes"
                        :fieldNames="{
                            label: 'threeCategoryName',
                            value: 'threeCategoryId',
                        }">
                    </a-select>
                    <a-button style="margin-left: 20px" :disabled="categoryTreeList.length == 0"
                        @click="selectVisible = true" size="middle">选择分类</a-button>
                    <p v-if="hisAttrObj.length != 0" style="color: #933" class="text-16px">
                        <span>{{ hisAttrObj[0].categoryName }}</span>/ <span>{{ hisAttrObj[0].secondCategoryName
                            }}</span>/
                        <span>{{ hisAttrObj[0].threeCategoryName }}</span>
                    </p>
                </a-form-item>
                <a-form-item label="产品属性：">
                    <a-card shadow="never" :loading="categoryAttributesLoading" style="
              position: relative;
              width: 90%;
              max-height: 600px;
              overflow-y: auto;
            ">
                        <!-- 展开收起 -->
                        <div w-full sticky top-2 right-0 z-2 v-if="loopAttributes.length">
                            <a-button class="flex justify-end" type="link" @click="isExpand = !isExpand"> {{ isExpand
                                ?
                                '- 收起'
                                : '+ 展开'
                            }}</a-button>
                        </div>
                        <a-form ref="ruleForm2" :model="form.attributes" :label-col="{ span: 5 }" :rules="rules2"
                            style="margin-top: 25px">
                            <div v-for="(item, index) in sortAttrs(loopAttributes)" :key="index"
                                style="margin: 10px; flex: 0 0 auto">
                                <a-form-item :name="item.name" v-if="item.show">
                                    <template #label>
                                        <span class="mr-2.5 truncate">{{
                                            item.label ? item.label : item.name
                                            }}</span>
                                        <a-tooltip class="tooltipStyle" effect="dark" :title="item.description"
                                            popper-class="ozonTooltip" placement="top">
                                            <AsyncIcon icon="QuestionCircleOutlined"></AsyncIcon>
                                        </a-tooltip>
                                    </template>
                                    <a-input v-if="item.selectType === 'input'"
                                        v-model:value="form.attributes[item.name]" :style="'width: 80%'" allow-clear
                                        :maxlength="item.name == '海关编码' || item.name == 'IKP公司'
                                            ? 17
                                            : item.name == '海关编码'
                                                ? 9999999
                                                : 100
                                            " :minlength="1000000" size="middle"></a-input>
                                    <div v-if="
                                        item.type == 'String' &&
                                        item.isCollection &&
                                        item.selectType == 'multSelect'
                                    ">
                                        <div v-if="item.options && item.options.length > 25">
                                            <a-select optionFilterProp="label" show-search
                                                v-model:value="item.selectDate" allowClear size="middle"
                                                style="width: 200px; margin-bottom: 5px" placeholder="请输入内容"
                                                labelInValue>
                                                <!-- :options="item.options" @change="handlerChangeSelectDate"-->
                                                <a-select-option :value="v" :label="v.label"
                                                    v-for="(v, i) in item.options" :key="i">{{ v.label
                                                    }}</a-select-option>
                                            </a-select>
                                            <a-button style="margin-left: 10px" size="middle"
                                                @click="addItemValues(item)" type="primary">添加</a-button>
                                        </div>
                                        <a-form-item-rest>
                                            <a-checkbox-group v-model:value="form.attributes[item.name]"
                                                style="width: 80%" :options="item.acquiesceList" class="boxGroup">
                                                <template #label="{ label }">
                                                    <span :title="label">{{ label }}</span>
                                                </template>
                                            </a-checkbox-group>
                                        </a-form-item-rest>
                                    </div>
                                    <a-select optionFilterProp="label" show-search size="middle"
                                        v-model:value="form.attributes[item.name]" v-if="item.selectType === 'select'"
                                        labelInValue :style="'width: 80%'" allowClear>
                                        <a-select-option v-if="item.id == 85" :value="'无品牌'">无品牌</a-select-option>

                                        <a-select-option v-else :value="v" v-for="(v, i) in item.options" :key="i">
                                            {{ v.label }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </div>
                        </a-form>
                    </a-card>
                </a-form-item>
            </a-form>
        </a-card>
        <categoryDialog @getAttributesID="getAttributesID" :categoryTreeList="categoryTreeList"
            :selectVisible="selectVisible" @handleEditClose="selectVisible = false"></categoryDialog>
    </div>
</template>

<script setup name="OzonBaseInfo">
import { ref, reactive, onMounted, computed, watchPostEffect } from "vue";
import {
    categoryTree,
    historyCategory,
    addHistoryCategory,
    historyAttribute,
} from "../../config/api/product";
import categoryDialog from "../../productPublish/comm/categoryDialog.vue";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";

const props = defineProps({
    categoryAttributesLoading: Boolean,
    productDetail: Object,
    shopList: Array,
});
const emit = defineEmits(["sendShortCode", "getAttributes"]);

const ruleForm = ref(null);
const ruleForm2 = ref(null);
const form = reactive({
    name: "",
    shortCode: "",
    categoryId: null,
    vat: "", //税
    attributes: {}, //产品属性
    storeHistoryCategoryId: "", //资料库分类ID
});
const selectVisible = ref(false);
const rules = {
    shortCode: {
        required: true,
        message: "必填项，请填写",
        trigger: ["blur", "change"],
    },
    name: {
        required: true,
        message: "必填项，请填写",
        trigger: "blur",
    },
    vat: {
        required: true,
        message: "必填项，请填写",
        trigger: ["blur", "change"],
    },
    categoryId: {
        required: true,
        message: "必填项，请填写",
        trigger: ["blur", "change"],
    },
};
const rules2 = ref({});
const loopAttributes = ref([]);
const categoryTreeList = ref([]);
const historyCategoryList = ref([]);
const tempAttr = ref({});
const isExpand = ref(true)
const existAttr = ref([])
const vatList = [
    {
        label: "免税",
        value: "0",
    },
    {
        label: "10%",
        value: "0.1",
    },
    {
        label: "20%",
        value: "0.2",
    },
];
const hisAttrObj = ref([]); //选中的三级

// 注入父组件数据
const existProductData = inject('existProductData')

// 监听数据变化
watch(() => existProductData.value, (newVal) => {
    const { account, name, vat, typeId, descriptionCategoryId, attributes } = newVal;
    console.log("newVal",newVal);
    
    form.shortCode = account;
    form.name = name;
    form.vat = vat === "0.0" || vat === "0.00" ? "0" : vat;
    form.categoryId = {
        threeCategoryId: typeId,
        threeCategoryName: "",
        secondCategoryId: descriptionCategoryId,
        label: undefined,
        value: typeId,
    };
    const ozonStore = useOzonProductStore()
    ozonStore.$patch(state => {
        state.variant = {
            threeCategoryId: typeId,
            shopId: account
        }
    })
    emit("getAttributes", form.shortCode, form.categoryId);
    getHistoryList(account); // 用于下拉数据回显
    existAttr.value = attributes[0].attributes
}, { deep: true })

// 获取选择树
const getCategoryTree = () => {
    if (!form.shortCode) {
        return;
    }
    categoryTree({ account: form.shortCode }).then((res) => {
        let result = res?.data || [];
        categoryTreeList.value = filterEmptyChildren(result);
    });
};

const sortAttrs = (attrs) => {
    // 如果是展开
    if (isExpand.value) {
        return attrs || []
    } else {
        return attrs?.filter(item => item.isRequired) || []
    }
};

// 根据分类弹窗中选择的分类去查询属性
const getAttributesID = (ids) => {
    let params = {
        account: form.shortCode,
        secondCategoryId: ids.secondCategoryId,
        threeCategoryId: ids.value,
    };
    addHistoryCategory(params).then((res) => {
        getHistoryList(form.shortCode);
    });
    form.categoryId = {
        threeCategoryId: ids.value,
        threeCategoryName: "",
        secondCategoryId: ids.secondCategoryId,
        label: ids.label,
        value: ids.value,
    };
    console.log("form", form.categoryId);
    const ozonStore = useOzonProductStore()
    ozonStore.$patch(state => {
        state.variant = {
            threeCategoryId: typeId,
            shopId: form.shortCode
        }
    })
    emit("getAttributes", form.shortCode, form.categoryId);
};

// 历史分类
const getHistoryList = (account) => {
    if (!form.shortCode) {
        return;
    }
    emit("sendShortCode", form.shortCode);
    historyCategory({ account }).then((res) => {
        historyCategoryList.value = res?.data || [];
        if (
            historyCategoryList.value.length != 0 &&
            JSON.stringify(form.categoryId) != "{}"
        ) {
            hisAttrObj.value = historyCategoryList.value.filter(
                (item) => item.threeCategoryId == form?.categoryId?.threeCategoryId
            );
        }
    });
};

// 选中的分类
const selectAttributes = (e) => {
    if (e) {
        if (historyCategoryList.value.length != 0) {
            hisAttrObj.value = historyCategoryList.value.filter(
                (item) => item.threeCategoryId == e.option.threeCategoryId
            );
        }
        form.categoryId = {
            threeCategoryId: e.option.threeCategoryId,
            threeCategoryName: "",
            secondCategoryId: e.option.secondCategoryId,
            label: e.option.threeCategoryName,
            value: e.option.threeCategoryId,
        };
        emit("getAttributes", form.shortCode, e.option);
        const ozonStore = useOzonProductStore()
        ozonStore.$patch(state => {
            state.variant = {
                threeCategoryId: e.option.threeCategoryId,
                shopId: form.shortCode
            }
        })
    }
};

// 递归清除最后一级的空的Children
const filterEmptyChildren = (data) => {
    return data.map((item) => {
        if (item.children && item.children.length > 0) {
            // 递归处理子节点
            item.children = filterEmptyChildren(item.children);
            return item;
        } else {
            // 删除最后一级的children属性
            delete item.children;
            return item;
        }
    });
};

const processAttributesCache = (attributesCache) => {
    return attributesCache.map((item) => {
        item.show = true;
        if (shouldHideItem(item)) {
            item.show = false;
        }
        return item;
    });
};
const shouldHideItem = (item) => {
    return (
        item.id === 4080 ||
        item.id === 8229 ||
        item.id === 8789 ||
        item.id === 8790 ||
        item.id === 4180 ||
        item.id === 4191 ||
        item.id === 11254 ||
        item.id === 9024 ||
        item.attributeComplexId === "100001" ||
        item.attributeComplexId === "100002" ||
        (item.isAspect && !item.isRequired) ||
        (item.isAspect && item.isCollection)
    );
};

// 此方法将历史缓存中的属性值进行重新赋值
const assignValues = (a, b) => {
    let newRes = a.map((item) => {
        return {
            ...item,
            values: item.values.map((value) => {
                return {
                    ...value,
                    id: Number(value.dictionaryValueId),
                    info: "",
                    picture: "",
                    label: "",
                };
            }),
        };
    });
    const result = {};
    // 根据b数组填充结果对象
    b.forEach((item) => {
        const name = item.name;
        const selectType = item.selectType;
        newRes.forEach((resItem) => {
            const attributeId = resItem.id;
            const allValidItems = resItem.values.every((item) => item.value !== "");
            if (attributeId === item.id && allValidItems) {
                if (selectType === "multSelect") {
                    result[name] = resItem.values.map((item) => item.id);
                    item.acquiesceList = moveMatchedItemForward(
                        item.options,
                        resItem.values.map((item) => item.id)
                    );
                } else if (selectType === "select") {
                    result[name] = findMatchedOption(
                        attributeId,
                        resItem.values[0],
                        item.options
                    );
                } else {
                    result[name] = resItem.values[0].value;
                }
            }
        });
    });

    return result;
};

const templateAssign = (a, b) => {
    const result = {};
    // 遍历所有属性配置项
    b.forEach((item) => {
        const attrName = item.name;
        const attrValue = a[attrName];
        if (!attrValue) return;

        // 处理多选类型属性
        if (item.selectType === "multSelect") {
            result[attrName] = Array.isArray(attrValue)
                ? attrValue.map(v => Number(v))  // 处理数组值
                : [Number(attrValue)];  // 处理单选值转数组

            // 维护选项排序
            item.acquiesceList = moveMatchedItemForward(
                item.options,
                result[attrName]
            );
        }
        // 处理下拉选择类型属性
        else if (item.selectType === "select") {
            // 特殊处理品牌字段
            if (attrName === "品牌(Бренд)") {
                result[attrName] = {
                    label: "无品牌",
                    value: { label: '无品牌', value: '无品牌' }
                };
            }
            // 处理对象型值
            else if (typeof attrValue === 'object') {
                result[attrName] = findMatchedOption(
                    item.id,
                    { id: attrValue.value, value: attrValue.label },
                    item.options
                );
            }
            // 处理原始值
            else {
                result[attrName] = findMatchedOption(
                    item.id,
                    { id: attrValue, value: attrValue },
                    item.options
                );
            }
        }
        // 处理普通输入类型
        else {
            result[attrName] = typeof attrValue === 'object'
                ? attrValue.value  // 提取对象中的值
                : attrValue;       // 直接使用原始值
        }
    });
    return result;
}

const findMatchedOption = (attributeId, data, options) => {
    const matchedOption = options?.find((option) => option.id === data.id);
    if (attributeId == 9070) {
        return {
            label: JSON.parse(data.value) == true ? "是" : "否",
            value: JSON.parse(data.value),
        };
    } else if (attributeId == 85) {
        return {
            label: "无品牌",
            value: data.id,
        };
    } else if (matchedOption) {
        return {
            id: matchedOption.id,
            value: matchedOption.value,
            label: matchedOption.label,
        };
    }
    return null;
};
const moveMatchedItemForward = (data, arr) => {
    const newData = [];
    const remainingData = [];

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (arr.includes(item.id)) {
            newData.push(item);
        } else {
            remainingData.push(item);
        }
    }

    return newData.concat(remainingData).slice(0, 25);
};

const addItemValues = (obj) => {
    if (!obj.selectDate.value) return;
    const { attributes } = form;
    const isExist = obj.acquiesceList.some(
        (item) => item.value === obj.selectDate.value
    );
    //!  判断搜索出来的是否在初始的数组中显示
    if (isExist) {
        // attributes[obj.name].push(obj.selectDate.value);
        const attr = attributes[obj.name] || [];
        attr?.push(obj.selectDate.value);
        attributes[obj.name] = attr
    } else {
        // attributes[obj.name].push(obj.selectDate.value);
        attributes[obj.name] = attributes[obj.name] || []
        attributes[obj.name]?.push(obj.selectDate.value);
        obj.acquiesceList.push(obj.selectDate);
    }
    obj.selectDate = undefined;
};

const childForm = async () => {
    // 收集需要校验的表单引用
    const formRefs = [ruleForm, ruleForm2];

    // 循环遍历表单引用数组进行校验
    for (const formRef of formRefs) {
        try {
            // 如果表单引用不存在，跳过本次循环
            if (!formRef.value) continue;

            // 调用表单的 validate 方法进行校验
            await formRef.value.validate();
        } catch (error) {
            // 若校验失败，捕获错误并返回 false
            return false;
        }
    }
    // 所有表单都校验通过，返回 true
    return true;
};

// 抛出数据和方法，可以让父级用ref获取
defineExpose({
    form,
    childForm,
});

watch(
    () => form.shortCode,
    (val) => {
        if (val) {
            getCategoryTree();
            hisAttrObj.value = [];
        }
    }
);
watch(
    () => props.productDetail,
    (val) => {
        if (val) {
            const { name, account, skuList, vat, typeId, descriptionCategoryId } =
                val;
            // 修改响应式对象的属性
            form.shortCode = account;
            form.name = skuList && skuList[0].name || name;
            form.vat = vat === "0.0" || vat === "0.00" ? "0" : vat;
            form.categoryId = {
                threeCategoryId: typeId,
                threeCategoryName: "",
                secondCategoryId: descriptionCategoryId,
                label: undefined,
                value: typeId,
            };
            const ozonStore = useOzonProductStore()
            ozonStore.$patch(state => {
                state.variant = {
                    threeCategoryId: typeId,
                    shopId: account
                }
            })
            // emit("getAttributes", form.shortCode, form.categoryId);
            getHistoryList(account);
        }
    }
);

// 引用产品模板
watch(() => useOzonProductStore().productTemplate, (val) => {
    if (val) {
        const { account, content: {
            productTemplate: {
                categoryId: {
                    threeCategoryId,
                    secondCategoryId,
                    value
                },
                productAttr
            }
        } } = val;
        form.shortCode = val.account;
        form.categoryId = {
            threeCategoryId,
            threeCategoryName: "",
            secondCategoryId,
            label: undefined,
            value
        };
        tempAttr.value = productAttr;
        emit("getAttributes", form.shortCode, form.categoryId);
    }
})

watch(
    () => useOzonProductStore().attributes,
    (val) => {
        if (val) {
            /**
             *  "URL"  4080
             *  "类型" 8229
             *  "PDF文件名称" 8789
             *   PDF 文件  8790
             *  "名称" 4180
             *  "简介" 4191
             *  "JSON 丰富内容"  11254
             *  "卖家代码" 9024
             */
            const newAttributesCache = processAttributesCache(val);
            const custAttr = newAttributesCache.filter((a) => !a.isRequired);
            const filterAttributesCache = custAttr.filter(
                (a) =>
                    !(a.isAspect && !a.isRequired) &&
                    !(a.isAspect && a.isCollection) &&
                    !(
                        a.id === 4080 ||
                        a.id == 8229 ||
                        a.id == 8789 ||
                        a.id == 8790 ||
                        a.id == 4180 ||
                        a.id == 4191 ||
                        a.id == 11254 ||
                        a.id == 9024
                    ) &&
                    !(
                        a.attributeComplexId == "100001" || a.attributeComplexId == "100002"
                    )
            );

            let noThemeAttributesCache = newAttributesCache.filter(
                (a) => !a.isAspect
            );
            if (noThemeAttributesCache) {
                noThemeAttributesCache.sort((a, b) => {
                    if (a.isRequired && !b.isRequired) return -1;
                    if (!a.isRequired && b.isRequired) return 1;
                    return 0;
                });

                let data = noThemeAttributesCache.filter((a) => a.isRequired);
                // console.log("data", data);
                // console.log("rules2", this.rules2);
                rules2.value = {};
                let attributes = {};
                // 属性类型处理
                noThemeAttributesCache.forEach((item) => {
                    item.selectDate = {
                        label: "",
                        value: "",
                    };
                    item.options = item?.options?.map((item) => {
                        return {
                            ...item,
                            label:
                                item?.label == "否" || item?.label == "是"
                                    ? item.label
                                    : item.value,
                            value:
                                item?.label == "否" || item?.label == "是"
                                    ? JSON.parse(item.value)
                                    : item.id,
                        };
                    });
                    item.acquiesceList =
                        (item.options && item.options.slice(0, 25)) ?? [];
                    attributes[item.name] =
                        item.selectType === "multSelect" ? [] : undefined;
                    attributes["品牌(Бренд)"] = {
                        label: "无品牌",
                        value: { label: '无品牌', value: '无品牌' }
                    }
                });

                // 属性校验
                for (let i = 0; i < data.length; i++) {
                    let obj = {
                        required: true,
                        message: `${data[i].name} 为必填项，请填写`,
                        trigger:
                            noThemeAttributesCache[i].selectType == "input"
                                ? "blur"
                                : "change",
                    };
                    // Object.assign(rules2.value, { [noThemeAttributesCache[i].name]: obj })
                    rules2.value[noThemeAttributesCache[i].name] = obj;
                }
                // this.$set(rules2.value, noThemeAttributesCache[i].name, obj);
                // console.log("rules2", rules2.value);
                loopAttributes.value = noThemeAttributesCache;
                // 赋值
                const { attributes: oldAttributes } = props.productDetail?.skuList[0];

                // const groupedAttributes = props.productDetail?.skuList.reduce((acc, item) => {
                //     item.attributes.forEach(attr => {
                //         // 添加值序列化比较
                //         const valueHash = JSON.stringify(attr.values);
                //         const key = `${attr.id}_${attr.complexId}_${valueHash}`;
                //         (acc[key] || (acc[key] = [])).push(attr);
                //     });
                //     return acc;
                // }, {});

                // // 转换为二维数组并过滤唯一项
                // // result将重复属性值去重过后的最终结果
                // const result = Object.values(groupedAttributes)
                //     .filter(group => group.length > 1).flat()
                //     .filter((obj, index, self) =>
                //         index === self.findIndex(item =>
                //             JSON.stringify(item) === JSON.stringify(obj)
                //         )
                //     );

                // console.log('oldAttributes', oldAttributes);
                // console.log('loopAttributes',loopAttributes.value);
                const proceRes = assignValues(oldAttributes, loopAttributes.value); // 旧写法
                // const proceRes = assignValues(result, loopAttributes.value); //最新写法
                form.attributes = proceRes;
                // console.log('proceRes0', proceRes);
            }
            // 引用模板数据回显
            if (Object.keys(tempAttr.value).length > 0) {
                form.attributes = templateAssign(tempAttr.value, loopAttributes.value)
            } else if (existAttr.value.length > 0) {
                form.attributes = processMatchedAttributes(existAttr.value, loopAttributes.value);
            }
        }
    }
);
// 引用现有产品处理数据回显到属性
const processMatchedAttributes = (existAttrs, loopAttrs) => {
    const existMap = existAttrs.reduce((acc, item) => {
        acc[item.id] = item.values;
        return acc;
    }, {});

    return loopAttrs.reduce((result, attr) => {
        const existValues = existMap[attr.id];

        if (existValues) {
            // 处理多选类型属性
            if (attr.selectType === 'multSelect') {
                result[attr.name] = existValues.map(v => v.dictionaryValueId);
            }
            // 处理品牌特殊字段
            else if (attr.id === 85) {
                result[attr.name] = {
                    label: "无品牌",
                    value: existValues[0].dictionaryValueId
                };
            }
            // 处理普通选择类型
            else if (attr.selectType === 'select') {
                result[attr.name] = existValues[0].dictionaryValueId || existValues[0].value;
            }
            // 默认处理方式
            else {
                result[attr.name] = existValues[0].value;
            }
        }
        return result;
    }, {});
};
</script>
<style lang="less" scoped>
:deep(.ant-checkbox-group) {
    .ant-checkbox-wrapper {
        margin-bottom: 5px;

        span:nth-of-type(2) {
            white-space: nowrap;
            /* 确保文本在一行内显示 */
            overflow: hidden;
            /* 隐藏溢出的内容 */
            text-overflow: ellipsis;
            /* 使用省略号表示文本溢出 */
            width: 200px;
            /* 设置容器宽度 */
        }
    }
}

:deep(.shopForm) {
    .ant-form-item {
        .ant-row {
            .ant-form-item-label>label {
                font-size: 20px !important;
            }
        }
    }
}
</style>
