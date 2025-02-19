<template>
    <div id="OzonBaseInfoCont">
        <a-card title="基本信息" class="text-left">
            <a-form :label-col="{ span: 3 }" ref="ruleForm" :model="form" class="mt-5" :rules="rules">
                <a-form-item label="店铺：" name="shortCode">
                    <a-select v-model:value="form.shortCode" placeholder="请选择店铺" @change="getHistoryList"
                        style="width: 90%" allowClear showSearch optionFilterProp="label" :options="shopList">
                    </a-select>
                </a-form-item>
                <a-form-item label="商品标题：" name="name">
                    <a-input style="width: 90%" v-model:value="form.name" placeholder="请输入产品名称(用俄语或英语)" :maxlength="255"
                        showCount></a-input>
                    <!-- :autofocus="true" -->
                </a-form-item>
                <a-form-item label="VAT：" name="vat">
                    <a-select v-model:value="form.vat" allowClear style="width: 90%" :options="vatList">
                    </a-select>
                </a-form-item>
                <a-form-item label="分类：" name="categoryId">
                    <!-- :options="historyCategoryList" -->
                    <a-select v-model:value="form.categoryId" @change="selectAttributes" allowClear
                        :filter-option="searchOption" showSearch labelInValue placeholder="请选择" style="width: 200px;"
                        :options="historyCategoryList" :fieldNames="{
                            label: 'threeCategoryName', value: 'threeCategoryId',
                        }">
                    </a-select>
                    <a-button style="margin-left: 20px" :disabled="categoryTreeList.length == 0"
                        @click="selectVisible = true">选择分类</a-button>
                    <p v-if="hisAttrObj.length != 0" style="color: #933">
                        <span>{{ hisAttrObj[0].categoryName }}</span>/ <span>{{
                            hisAttrObj[0].secondCategoryName }}</span>/
                        <span>{{ hisAttrObj[0].threeCategoryName }}</span>
                    </p>
                </a-form-item>
                <a-form-item label="产品属性：">
                    <a-card shadow="never" v-loading="categoryAttributesLoading" style="
                    position: relative;
                    width: 90%;
                    height: 600px;
                    overflow-y: auto;
                    ">
                        <a-form ref="ruleForm2" :model="form.attributes" :label-col="{ span: 5 }" :rules="rules2"
                            style="margin-top: 25px">
                            <div v-for="(item, index) in loopAttributes" :key="index"
                                style="margin: 10px; flex: 0 0 auto">
                                <a-form-item :name="item.name" v-if="item.show">
                                    <template #label>
                                        <span class="mr-2.5 truncate">{{ item.label ? item.label : item.name }}</span>
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
                                            " :minlength="1000000"></a-input>
                                    <div v-if="
                                        item.type == 'String' &&
                                        item.isCollection &&
                                        item.selectType == 'multSelect'
                                    ">
                                        <div v-if="item.options && item.options.length > 25">
                                            <a-select optionFilterProp="label" show-search
                                                v-model:value="item.selectDate" allowClear style="width: 200px"
                                                placeholder="请输入内容" labelInValue>
                                                <!-- :options="item.options" @change="handlerChangeSelectDate"-->
                                                <a-select-option :value="v" :label="v.label"
                                                    v-for="(v, i) in item.options" :key="i">{{ v.label
                                                    }}</a-select-option>
                                            </a-select>
                                            <a-button style="margin-left: 10px" @click="addItemValues(item)"
                                                type="primary">添加</a-button>
                                        </div>
                                        <a-form-item-rest>
                                            <a-checkbox-group v-model:value="form.attributes[item.name]"
                                                style="width: 80%;" @change="changeRule(form.attributes, item.name)"
                                                :options="item.acquiesceList">
                                                <!--  :options="item.acquiesceList" v-model:checked="option.value" -->
                                                <!-- <a-checkbox v-for="option in item.acquiesceList" :key="option.value">
                                                    {{ option.label }}
                                                </a-checkbox> -->
                                            </a-checkbox-group>
                                        </a-form-item-rest>
                                        <!-- <a-checkbox v-for="i in item.acquiesceList" :label="i.value"
                                            :key="i.value">{{ i.value }}</a-checkbox> @change="handlerSelectDate"-->
                                    </div>
                                    <a-select optionFilterProp="label" show-search
                                        v-model:value="form.attributes[item.name]" v-if="item.selectType === 'select'"
                                        labelInValue :style="'width: 80%'" allowClear>
                                        <a-select-option v-if="item.name == '品牌(Бренд)'" :value="'无品牌'"
                                            :label="'无品牌'">无品牌</a-select-option>

                                        <a-select-option :value="v" :label="v.label" v-else
                                            v-for="(v, i) in item.options" :key="i">{{ v.label
                                            }}</a-select-option>
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

<script setup name='OzonBaseInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import {
    categoryTree,
    historyCategory,
    addHistoryCategory,
    historyAttribute,
} from "../../config/api/product";
import categoryDialog from "./categoryDialog.vue";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { useOzonProductStore } from '~@/stores/ozon-product'

const props = defineProps({
    categoryAttributesLoading: Boolean,
    shopList: Array,
});
const emit = defineEmits(["sendShortCode", "getAttributes"]);

const ruleForm = ref(null)
const ruleForm2 = ref(null)
const form = reactive({
    name: "",
    shortCode: "",
    categoryId: null,
    vat: "", //税
    attributes: {}, //产品属性
    storeHistoryCategoryId: "", //资料库分类ID
})
const selectVisible = ref(false)
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
}
const rules2 = ref({})
const loopAttributes = ref({})
const categoryTreeList = ref([])
const historyCategoryList = ref([])
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
]
const hisAttrObj = ref([]) //选中的三级

// 清除校验
const changeRule = (attributes, name) => {
    ruleForm2.value.clearValidate(name);
}
// 获取选择树
const getCategoryTree = () => {
    if (!form.shortCode) {
        return;
    }
    categoryTree({ account: form.shortCode }).then((res) => {
        let result = res?.data || [];
        categoryTreeList.value = filterEmptyChildren(result);
    });
}

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
        value: ids.value
    };
    console.log('form', form.categoryId);

    emit("getAttributes", form.shortCode, form.categoryId);
}
// 历史分类
const getHistoryList = (shortCode) => {
    if (!form.shortCode) {
        return;
    }
    emit("sendShortCode", shortCode);
    historyCategory({ account: form.shortCode })
        .then((res) => {
            historyCategoryList.value = res?.data || [];
            if (
                historyCategoryList.value.length != 0 &&
                JSON.stringify(form.categoryId) != "{}"
            ) {
                hisAttrObj.value = historyCategoryList.value.filter(
                    (item) =>
                        item.threeCategoryId ==
                        form?.categoryId?.threeCategoryId
                );
            }
        })
}
const searchOption = (input, option) => {
    return option.threeCategoryName.indexOf(input) >= 0;
}
// 选中的分类
const selectAttributes = (e) => {
    if (e) {
        if (historyCategoryList.value.length != 0) {
            hisAttrObj.value = historyCategoryList.value.filter(
                (item) =>
                    item.threeCategoryId ==
                    e.option.threeCategoryId
            );
        }
        form.categoryId = {
            threeCategoryId: e.option.threeCategoryId,
            threeCategoryName: "",
            secondCategoryId: e.option.secondCategoryId,
            label: e.option.threeCategoryName,
            value: e.option.threeCategoryId
        }
        emit("getAttributes", form.shortCode, e.option);
    }
}
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
}

const processAttributesCache = (attributesCache) => {
    return attributesCache.map((item) => {
        item.show = true;
        if (shouldHideItem(item)) {
            item.show = false;
        }
        return item;
    });
}
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
}

const getHistoryAttr = (historyCategoryId, account) => {
    historyAttribute({
        historyCategoryId,
        account,
    }).then((res) => {
        let resObj = (res?.data && JSON.parse(res?.data)) || {};
        // this.$set(this.form, "attributes", resObj);
        form.attributes = resObj
        // // this.form.attributes = res?.data
        // //   ? JSON.parse(res?.data)
        // //   : this.form.attributes;
        // // let a = this.assignValues(this.form.attributes, this.loopAttributes);
        // this.$refs.ruleForm2.clearValidate();
    });
}
// 此方法将历史缓存中的属性值进行重新赋值
const assignValues = (a, b) => {
    const result = {};
    // 根据b数组填充结果对象
    b.forEach((item) => {
        const name = item.name;
        const selectType = item.selectType;
        for (const key in a) {
            if (name == key) {
                if (selectType === "multSelect") {
                    let filteredItems =
                        item?.options &&
                        item?.options?.filter((item) =>
                            a[key].some((bItem) => item.value === bItem)
                        );
                    filteredItems.forEach((e) => {
                        if (!item?.acquiesceList?.some((bItem) => bItem.id === e.id)) {
                            item?.acquiesceList?.push(e);
                        }
                    });
                    result[name] = filteredItems.map((e) => e.value);
                } else if (selectType === "select") {
                    result[name] = name == "品牌(Бренд)" ? "无品牌" : a[key];
                } else {
                    result[name] = a[key];
                }
            }
        }
    });

    return result;
}

const addItemValues = (obj) => {
    const { attributes } = form;
    const isExist = obj.acquiesceList.some(
        (item) => item.value === obj.selectDate.value
    );
    //!  判断搜索出来的是否在初始的数组中显示
    if (isExist) {
        attributes[obj.name]?.push(obj.selectDate.value);
    } else {
        attributes[obj.name]?.push(obj.selectDate.value);
        obj.acquiesceList.push(obj.selectDate);
    }
    obj.selectDate = undefined
}

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
}

// 抛出数据和方法，可以让父级用ref获取
defineExpose({
    form,
    childForm
})

watch(() => form.shortCode, val => {
    if (val) {
        getCategoryTree()
        hisAttrObj.value = []
    }
})
// props.attributesCache,
watch(() => useOzonProductStore().attributes, (val) => {
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
                    a.attributeComplexId == "100001" ||
                    a.attributeComplexId == "100002"
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
                    value: ""
                };
                item.options = item?.options?.map(item => {
                    return {
                        ...item,
                        label: item.value,
                        value: item.id,
                    }
                })
                item.acquiesceList =
                    (item.options && item.options.slice(0, 25)) ?? [];
                attributes[item.name] = item.selectType === "multSelect" ? [] : undefined;
            });
            // console.log("filterAttributesCache", noThemeAttributesCache);

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
                rules2.value[noThemeAttributesCache[i].name] = obj
            }
            // this.$set(rules2.value, noThemeAttributesCache[i].name, obj);
            // console.log("rules2", rules2.value);
            // 获取自定义添加的属性数据（同步过滤属性）
            //!未同步属性
            form.attributes = attributes;
            loopAttributes.value = noThemeAttributesCache;

        }
        if (!form.shortCode || !form.categoryId) return;
        getHistoryAttr(
            form.categoryId.threeCategoryId,
            form.shortCode
        );
    }
})
</script>
<style lang="less" scoped></style>