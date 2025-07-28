<template>
    <div id="OzonNewVariantInfoCont">
        <a-card title="SKU信息" class="text-left" v-loading="categoryAttributesLoading">
            <a-card title="变种属性" class="text-left mx-50">
                <div>
                    <span>变种主题：</span>
                    <a-button type="primary" v-for="(item, index) in themeBtns" class="mr-2.5"
                        :key="'add' + index + item.name" @click="enterVariantType(item)">
                        <AsyncIcon icon="PlusCircleOutlined"></AsyncIcon>
                        {{ item.name }}
                    </a-button>
                    <a-card v-for="(items, index) in attributeList" :key="items.id" style="margin-top: 10px">
                        <template #title>
                            <span style="font-weight: bolder">变种主题{{ index + 1 }}：
                                <i v-if="items.isRequired" style="color: red; margin-right: 2px">*</i>
                                <span>{{ items.name }}</span>
                            </span>
                            <a-popconfirm icon-color="red" title="确定要删除这个变种主题吗？"
                                @confirm="removeVariantType(items, index)">
                                <a-button type="text" danger v-if="!items.isRequired" style="float: right">移除</a-button>
                            </a-popconfirm>
                        </template>
                        <a-table :columns="items.tableColumns" :data-source="items.tableData" :pagination="false">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.dataIndex === record.name">
                                    <!-- 单选 -->
                                    <div v-if="record.selectType == 'select'" class="w-4/5">
                                        <a-select v-model:value="record.modelValue" class="w-full"
                                            optionFilterProp="label" labelInValue allowClear placeholder="请选择"
                                            @change="pushValue(index, items)">
                                            <a-select-option v-for="items in record.details" :key="items.id"
                                                :label="items.label" :value="items">{{ items.label
                                                }}
                                            </a-select-option>
                                        </a-select>
                                    </div>
                                    <!-- 多选 -->
                                    <div v-if="record.selectType == 'multSelect'" class="w-4/5">
                                        <a-select v-model:value="record.modelValue" class="w-full"
                                            optionFilterProp="label" allowClear mode="multiple" placeholder="请选择"
                                            labelInValue @change="pushValue(index, items)" :options="record.details">
                                        </a-select>
                                    </div>
                                    <!-- 输入框 -->
                                    <div v-if="record.selectType == 'input'" class="w-4/5">
                                        <a-input-number v-if="record.type == 'Integer'" allowClear
                                            v-model:value="record.modelValue" @blur="(index, items)" placeholder="请输入内容"
                                            class="w-full"></a-input-number>
                                        <a-input v-model:value="record.modelValue" allowClear v-else class="w-full"
                                            placeholder="请输入内容" @blur="pushValue(index, items)"></a-input>
                                    </div>
                                </template>
                                <template v-if="column.dataIndex === record[column.dataIndex]">
                                    <a-input v-model:value="record.secondModelValue" allowClear class="w-4/5"
                                        placeholder="请输入内容" @blur="pushValue(index, items)"></a-input>
                                </template>
                                <template v-if="column.dataIndex === 'options'">
                                    <div>
                                        <a-button class="mr-2.5" @click="addItem(record, items)">
                                            <AsyncIcon icon="PlusCircleOutlined"></AsyncIcon>
                                        </a-button>
                                        <a-button v-if="items.tableData.length != 1" @click="removeItem(record, items)">
                                            <AsyncIcon icon="MinusCircleOutlined"></AsyncIcon>
                                        </a-button>
                                    </div>
                                </template>
                            </template>
                        </a-table>
                        <template #tabBarExtraContent></template>
                    </a-card>
                </div>
            </a-card>
        </a-card>

    </div>
</template>

<script setup name='OzonNewVariantInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message, Modal } from "ant-design-vue";
import EditProdQuantity from '../../productPublish/comm/EditProdQuantity.vue';
import dragUpload from '../../productPublish/comm/dragUpload.vue';
import { scaleApi, watermarkListApi, watermarkApi } from "~/api/common/water-mark";
import { productWarehouse } from "../../config/api/product"
import SelectAttr from '../../productPublish/comm/SelectAttr.vue';
import { useOzonProductStore } from '~@/stores/ozon-product'
import batchEditModal from "~/pages/ozon/config/component/batchEditModal/index.vue"
import {
    updatePrice, endResult, processAttributesCache,
    reorderArray, cartesianProduct, processResult,
    processData, checkSellerSKU, hasDuplicateModelValues,
    checkData, rearrangeColorFields, handleTheme, processImageSource
} from "../../config/commJs/index"
import { publishHead } from '../../config/tabColumns/skuHead';
import { cloneDeep, debounce } from "lodash";
import { uploadImage } from '@/pages/ozon/config/api/draft';
import { DownOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { downloadAllImage } from '@/pages/sample/acquisitionEdit/js/api.js';
import { imageUrlUpload } from '@/pages/sample/acquisitionEdit/js/api.js'
import download from '~@/api/common/download';

const props = defineProps({
    categoryAttributesLoading: Boolean,
    shopCode: String,
    productDetail: Object,
    attributesCache: Object
});

const themeBtns = ref([]) //主题按钮
const requiredList = ref([]) //必填变种主题 
const attributeList = ref([]) //变种主题卡片
const tableData = ref([])
const headerList = ref([]) //动态表头
const addHeaderList = ref([])
const setColorOption = ref([]);
const custAttr = ref([]) //可控制属性

const isConform = ref(false)

const handleColorCancel = () => {
    setValueVis.value = false;
    setColorOption.value = [];
};

// 此方法用于处理属性批量添加到主题中
const procTableData = (newData, newItems) => {

    // 深拷贝原始数据避免污染
    const processedData = cloneDeep(newData)
    const usedIds = new Set()

    // 第一阶段：填充空值项
    let itemIndex = 0
    for (const item of processedData) {
        if (item.modelValue.length === 0 && newItems[itemIndex]) {
            item.modelValue = [cloneDeep(newItems[itemIndex])]
            usedIds.add(newItems[itemIndex].id)
            itemIndex++
        }
    }

    // 第二阶段：创建新条目
    const remainingItems = newItems.filter(item => !usedIds.has(item.id))
    const baseTemplate = processedData[0] ? cloneDeep(processedData[0]) : {}
    delete baseTemplate.uniqueId // 清除可能存在的临时ID

    remainingItems.forEach(item => {
        processedData.push({
            ...baseTemplate,
            modelValue: [cloneDeep(item)],
            uniqueId: Date.now() + Math.random().toString(36).slice(2)
        })
    })

    return processedData.filter(item =>
        item.modelValue.length > 0 ||
        item.uniqueId // 保留新创建的空条目
    )
}

// 批量设置属性
const confirm = (selectedValues) => {
    // 解构只需要用到的details属性
    const { details } = colorRow.value.tableData[0] || {};
    const result = details?.filter(item => new Set(selectedValues).has(item.id)) || [];

    // 获取已存在的属性并去重
    const existingAttributes = colorRow.value.tableData
        .flatMap(item => item?.modelValue?.map(v => v) || [])
        .filter(Boolean);

    // 根据是否存在已有属性进行过滤
    const filteredResult = existingAttributes.length > 0
        ? result.filter(item => !new Set(existingAttributes.map(a => a.id)).has(item.id))
        : result;

    // 统一处理表格更新
    colorRow.value.tableData = procTableData(colorRow.value.tableData, filteredResult);
    tableData.value = commProceData();
}

const filteredHeaderList = computed(() => {
    return headerList.value.filter((item) => item.show === true);
})

// 处理数据格式
const processDataFormat = (list = []) => {
    let newHeaderList = handleTheme(list);
    const insertIndex = headerList.value.length - 6;
    for (let i = list.length - 1; i >= 0; i--) {
        // reversedArray.push(originalArray[i]);
        headerList.value.splice(insertIndex, 0, {
            dataIndex: list[i].name,
            id: list[i].id,
            title: list[i].name,
            show: true,
            align: 'center'
        });
        // imgHeaderList.value.push({
        //     title: list[i].name
        // })
    }
    attributeList.value = [...attributeList.value, ...newHeaderList]
}

// 手动添加多个变种主题
const enterVariantType = (item) => {
    let arr = [];
    if (isConform.value && item.id === 10096) {
        arr = [
            {
                ...item
            },
            {
                selectType: "input",
                id: 10097,
                isAspect: true,
                isCollection: false,
                isRequired: false,
                name: "颜色名称(Название цвета)",
                isAspect: true,
                isCollection: false,
                isRequired: false,
            }
        ]
    } else {
        arr.push(item);
    }
    processDataFormat(arr);
    for (let i = 0; i < themeBtns.value.length; i++) {
        if (themeBtns.value[i].id === item.id) {
            themeBtns.value.splice(i, 1);
            break;
        }
    }
}
// 移除主题操作
const removeVariantType = (item, index) => {
    attributeList.value.splice(index, 1);
    // imgHeaderList.value.splice(index, 1);
    let name = item.tableData[0].name
    let secondName = item.tableData[0].secondName
    // 表头删除
    // headerList.value.splice(index, 1); !(item.prop == item.name && item.label == item.name)
    headerList.value = headerList.value.filter((e) => e.title != item.title);
    if (secondName) {
        headerList.value = headerList.value.filter((e) => e.title != secondName);
    }

    let newThem = {
        options: item.details,
        show: false,
        selectType: item.selectType,
        id: item.id,
        isRequired: item.isRequired,
        categoryDependent: item.categoryDependent,
        isCollection: item.isCollection,
        name: item.name,
        isAspect: item.isAspect,
    }
    themeBtns.value.unshift(newThem);

    /** 移除变种主题后需要重新生成变种信息 table 数据 */
    let cartesianProducts = cartesianProduct(attributeList.value);
    let newTableData = processResult(cartesianProducts);
    tableData.value = newTableData;
};
// 添加多个属性操作
const addItem = (item, row) => {
    let ele = {}
    if (isConform.value && item.id === 10096) {
        ele = {
            id: item.id,
            name: item.name,
            modelValue: item.selectType === 'multSelect' ? [] : undefined,
            selectType: item.selectType,
            details: item.details,
            secondName: '颜色名称(Название цвета)',
            '颜色名称(Название цвета)': '颜色名称(Название цвета)',
            secondId: 10097,
            secondModelValue: ""
        };
    } else if (isConform.value && item.id === 4295) {
        ele = {
            id: item.id,
            name: item.name,
            modelValue: item.selectType === 'multSelect' ? [] : undefined,
            selectType: item.selectType,
            details: item.details,
            secondName: '制造商尺码(Размер производителя)',
            '制造商尺码(Размер производителя)': '制造商尺码(Размер производителя)',
            secondId: 9533,
            secondModelValue: ""
        };
    } else {
        ele = {
            id: Date.now(),
            name: item.name,
            modelValue: item.selectType === 'multSelect' ? [] : undefined,
            selectType: item.selectType,
            details: item.details
        };
    }
    row.tableData.push(ele)
}
const removeItem = (item, row) => {
    let ind = row.tableData.indexOf(item);
    if (item.id === 10096 || item.name == "商品颜色(Цвет товара)") {
        row.tableData.splice(ind, 1);
    } else if (item.id === 4295 || item.name == "俄罗斯尺码") {
        row.tableData.splice(ind, 1);
    } else {
        if (item.selectType === "select") {
            row.tableData = row.tableData.filter(tableItem => {
                // 检查当前项的modelValue是否包含排除ID
                return tableItem.modelValue?.value != item.modelValue?.value;
            });
        } else if (item.selectType === "input") {  // 新增input类型处理
            row.tableData = row.tableData.filter(tableItem =>
                tableItem.modelValue !== item.modelValue
            );
        } else {
            // 获取需要排除的ID集合
            const excludeIds = item.modelValue.map(mv => mv.id); // [971918068]
            // 过滤掉包含这些ID的项
            row.tableData = row.tableData.filter(tableItem => {
                // 检查当前项的modelValue是否包含排除ID
                return !tableItem.modelValue.some(mv => excludeIds.includes(mv.id));
            });
        }
    }


    let newData = tableData.value.filter(row => {
        // 获取所有需要删除的标签
        const deletedLabels = item.selectType === 'multSelect'
            ? item.modelValue.map(v => v.label)
            : [];

        // 检查行数据是否包含要删除的属性值
        return !Object.values(row).some(value => {
            if (item.selectType === 'multSelect') {
                // 统一处理数组和字符串类型的值
                const currentValues = Array.isArray(value)
                    ? value.map(v => v?.label || '')
                    : String(value || '').split(',');
                return currentValues.some(v => deletedLabels.includes(v));
            }
            return item.selectType === 'input' ? value === item.modelValue
                : item.selectType === 'select' ? value === item?.modelValue?.label
                    : false;
        });
    });
    console.log('removeItem', newData);

    tableData.value = newData;
};
// 将根据主题中选择的数据进行添加到表格中
const pushValue = (index, item, key, record) => {
    let flog = hasDuplicateModelValues(attributeList.value)
    if (flog) {
        message.error("变种属性值不能有相同的，请修改")
        return
    }

    // 处理表格数据
    let cartesianProducts = cartesianProduct(attributeList.value);
    let newTableData = processResult(cartesianProducts);
    let minLength = Math.min(newTableData.length, tableData.value.length);
    for (let i = 0; i < minLength; i++) {
        // 将b数组中对应下标的数据赋值到a数组中
        newTableData[i].skuTitle = tableData.value[i].skuTitle;
        newTableData[i].sellerSKU = tableData.value[i].sellerSKU;
        newTableData[i].price = tableData.value[i].price;
        newTableData[i].oldPrice = tableData.value[i].oldPrice;
        newTableData[i].colorImg = tableData.value[i].colorImg;
        newTableData[i].imageUrl = tableData.value[i].imageUrl;
        newTableData[i].quantity = tableData.value[i].quantity;
        newTableData[i].warehouseList = tableData.value[i].warehouseList;
        newTableData[i].packageHeight = tableData.value[i].packageHeight;
        newTableData[i].packageLength = tableData.value[i].packageLength;
        newTableData[i].packageWidth = tableData.value[i].packageWidth;
        newTableData[i].packageWeight = tableData.value[i].packageWeight;
    }
    tableData.value = newTableData;

}

// 动态添加表头数据
const changeHeade = () => {
    //  删除重复元素
    headerList.value = headerList.value.filter(
        (item) =>
            item.type !== 1 ||
            (item.type == 1 && addHeaderList.value.includes(item.dataIndex))
    );
    let obj = {};
    // 再添加新的不重复元素
    addHeaderList.value.forEach((item) => {
        if (!headerList.value.find((obj) => obj.dataIndex === item)) {
            obj = {
                dataIndex: item,
                title: item == "colorImg" ? "颜色样本" : "SKU标题",
                selectType: item == "colorImg" ? "url" : "input",
                type: 1,
                options: null,
                show: true,
                align: 'center'
            };
            if (item == "colorImg") {
                headerList.value.unshift(obj);
            } else if (item == "skuTitle") {
                let skuIndex = headerList.value.findIndex(item => item.title === 'SKU');
                headerList.value.splice(skuIndex + 1, 0, obj);
            }
            else {
                headerList.value.push(obj)
            }
        }
    });

    const ozonStore = useOzonProductStore()
    ozonStore.$patch(state => {
        state.addHeaderList = addHeaderList.value
    })
}

// 删除表格数据
const deleteVariable = (row, index) => {
    tableData.value.splice(index, 1);
    attributeList.value = processData(attributeList.value, tableData.value)
}

// 变种主题中是组合在一起的主题
const dependencyMap = new Map([
    [10096, 10097],  // 商品颜色和颜色名称
    [4295, 9533]    // 俄罗斯尺码和制造商尺码
]);

watch(() => useOzonProductStore().attributes, val => {
    if (val) {
        const { content: {
            variantTemplate: {
                variantAttr
            }
        } } = props.productDetail;
        let arr = val.filter((obj) => obj.isAspect);
        isConform.value = checkData(arr);
        const requiredItem = arr.some((item) => item.isRequired === true);
        let sortArr = rearrangeColorFields(arr);
        //判断主题中是否有颜色名称，且商品颜色是不是必填项
        if (requiredItem) {
            if (isConform.value) {
                requiredList.value = arr.filter((obj) => obj.isRequired);
                // 将arr转换为ID索引对象，提高查找效率
                const arrById = arr.reduce((acc, item) => {
                    acc[item.id] = item;
                    return acc;
                }, {});
                // 检查并添加依赖项
                dependencyMap.forEach((addId, targetId) => {
                    // 检查目标ID是否存在
                    if (requiredList.value.some((item) => item.id === targetId)) {
                        // 获取要添加的对象
                        const itemToAdd = arrById[addId];
                        // 检查是否已存在且对象存在
                        if (
                            itemToAdd &&
                            !requiredList.value.some((item) => item.id === addId)
                        ) {
                            requiredList.value.push(itemToAdd);
                        }
                    }
                });
                // if (requiredList.value.some(item => (item.id === 10096))) {
                //     requiredList.value.push(arr.find(obj => obj.id === 10097))
                // }
                themeBtns.value = arr.filter(
                    (obj) => !(obj.isRequired || obj.id === 10097 || obj.id === 9533) //obj.id === 9533
                );
                requiredList.value = reorderArray(requiredList.value);
            } else {
                themeBtns.value = arr.filter((obj) => !obj.isRequired);
                requiredList.value = arr.filter((obj) => obj.isRequired);
            }
        } else {
            if (isConform.value) {
                themeBtns.value = arr.filter(
                    (obj) => !(obj.isRequired || obj.id === 10097)
                );
            } else {
                themeBtns.value = arr.filter((obj) => !obj.isRequired);
            }
        }
        let result = [];
        let attrHeaderList = [];
        // 遍历b中的skuList
        variantAttr.forEach((sku) => {
            let newItem = {
                oldPrice: "",
                price: "",
                quantity: "",
                packageHeight: "",
                packageLength: "",
                packageWeight: "",
                packageWidth: "",
                colorImg: [],
                warehouseList: [],
                sellerSKU: "",
                imageUrl: [],
            };

            // 遍历a数组
            sortArr.forEach((attr) => {
                // 遍历sku的attributes中的每个attributes
                sku.attributes.forEach((subAttr) => {
                    if (subAttr.id == attr.id) {
                        if (attr.selectType === "multSelect" && attr.options) {
                            let values = subAttr.values.map((val) => {
                                let option = attr.options.find(
                                    (opt) => opt.id == val.dictionaryValueId
                                );
                                return option ? option.value : val.value;
                            });
                            newItem[attr.name] = values.join(", ");
                        } else if (attr.selectType === "select" && attr.options) {
                            console.log("subAttr--", subAttr);
                            console.log("attr--", attr);
                            let values = subAttr.values.map((val) => {
                                let option = attr.options.find(
                                    (opt) => opt.id == val.dictionaryValueId
                                );
                                console.log("option", option);
                                
                                return option ? option.value : val.value;
                            });
                            console.log(values,"values");
                            
                            newItem[attr.name] = values.join(", ");
                        } else {
                            newItem[attr.name] = subAttr.values[0].value;
                        }
                        attrHeaderList.push({
                            title: attr.name,
                            dataIndex: attr.name,
                            id: attr.id,
                            show: true,
                            align: "center",
                        });
                    }
                });
            });

            // console.log("newItem", newItem);

            result.push(newItem);
        });
        // 处理数据回显到表格
        attrHeaderList = [
            ...new Map(
                attrHeaderList.map((item) => [item.dataIndex, item])
            ).values(),
        ];
        const uniqueArr = [];
        const titleSet = new Set();
        console.log('attrHeaderList',attrHeaderList);
        console.log('headerList',headerList.value);
        [...attrHeaderList, ...headerList.value].forEach((item) => {
            if (!titleSet.has(item.title)) {
                titleSet.add(item.title);
                uniqueArr.push(item);
            }
        });
        // console.log('uniqueArr',uniqueArr);

        headerList.value = uniqueArr; //表格主题标题赋值
        tableData.value = result;
        // 将不匹配的主题过滤掉
        let comAttrList = [10096, 4295];
        let comAttrs = [10096, 10097];
        // 从数组 a 中提取所有的 id
        const idsInA = sortArr.map((item) => item.id);
        // 使用 every 方法检查 comAttrList 中的每个元素是否都在 idsInA 中
        const isAllMatched = comAttrList.every((id) => idsInA.includes(id)); //双组合主题
        const isAllMatche = comAttrs.some((id) => idsInA.includes(id)); //单组合主题
        let filteredB = sortArr.filter((itemB) =>
            uniqueArr.some((itemA) => itemA.id === itemB.id)
        );
        console.log('uniqueArr',uniqueArr);
        console.log('filteredB', filteredB);
        let echoThemeList = [];
        let isModelValueList = [];
        // 判断sortArr中是否有组合数据
        if (isAllMatched) {
            echoThemeList = handleTheme(sortArr); //handleTheme方法可以将属性转换成主题数据格式
        } else if (isAllMatche) {
            echoThemeList = handleTheme(filteredB);
        } else {
            isModelValueList = filterModelValues(sortArr, variantAttr);
            echoThemeList = handleTheme(isModelValueList);
        }
        console.log('echoThemeList',echoThemeList);

        // 处理到数据回显到主题
        const aIds = echoThemeList.map((item) => item.id);
        // console.log('aIds', echoThemeList);
        // 过滤 有数据的主题
        themeBtns.value = themeBtns.value.filter(
            (item) => !aIds.includes(item.id)
        );
        attributeList.value = matchAndAssignValues(echoThemeList, variantAttr);
    }
})

const filterModelValues = (a, b) => {
    const allAttributeIds = b.flatMap(item => item.attributes.map(attr => attr.id));
    // 过滤 sortArr 中匹配不上的项
    const filteredSortArr = a.filter(item => allAttributeIds.includes(item.id));
    return filteredSortArr
}

const matchAndAssignValues = (a, b) => {
    // 遍历 a 数组的每个配置项
    return a.map(aItem => {
        const isThemeData = checkThemeData(aItem.tableData);
        const newTableData = b.map(bItem => {
            const tableDataTemplate = JSON.parse(JSON.stringify(aItem.tableData[0]));
            const attributeId = tableDataTemplate.id;
            const matchedAttribute = bItem.attributes.find(
                attr => attr.id === attributeId
            );
            const secondAttr = bItem.attributes.find(
                attr => attr.id === tableDataTemplate?.secondId
            );
            return processTableDataItem(tableDataTemplate, matchedAttribute, secondAttr, isThemeData);
        });
        aItem.tableData = deduplicateTableData(newTableData, isThemeData);
        return aItem;
    });
}

// 对数组中的对象按指定属性去重
const removeDuplicatesByProperty = (arr, property) => {
    return arr.filter((value, index, self) =>
        index === self.findIndex(t => t[property] === value[property])
    );
};

// 检查两个数组是否内容相同
const isArrayContentEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
};

// 处理单个 tableData 项
const processTableDataItem = (tableDataTemplate, matchedAttribute, secondAttr, isThemeData) => {
    if (isThemeData) {
        if (matchedAttribute) {
            tableDataTemplate.modelValue = tableDataTemplate.details.filter(itemA => {
                return matchedAttribute.values.some(itemB => {
                    return itemA.id === itemB.dictionaryValueId;
                });
            });
            tableDataTemplate.modelValue = removeDuplicatesByProperty(tableDataTemplate.modelValue, 'id');
        }
        if (secondAttr) {
            tableDataTemplate.secondModelValue = secondAttr.values[0].value;
        }
    } else {
        if (tableDataTemplate.selectType === 'input') {
            if (matchedAttribute) {
                tableDataTemplate.modelValue = matchedAttribute.values[0].value;
            }
        } else {
            if (matchedAttribute) {
                let themIds = matchedAttribute.values.map(item => item.dictionaryValueId)
                const matchedValues = tableDataTemplate.details.filter(item => themIds.includes(item.id));
                const uniqueMatchedValues = removeDuplicatesByProperty(matchedValues, 'value');
                tableDataTemplate.modelValue = uniqueMatchedValues;
            }
        }
    }
    return tableDataTemplate;
};

// 对 tableData 进行去重
const deduplicateTableData = (tableData, isThemeData) => {
    if (isThemeData) {
        return tableData.filter((item, index, self) => {
            return !self.some((uniqueItem, uniqueIndex) => {
                return uniqueIndex < index &&
                    uniqueItem.secondModelValue === item.secondModelValue &&
                    isArrayContentEqual(uniqueItem.modelValue, item.modelValue);
            });
        });
    } else {
        const valueMap = new Map();
        return tableData.filter(item => {
            const key = JSON.stringify(item.modelValue);
            if (!valueMap.has(key)) {
                valueMap.set(key, true);
                return true;
            }
            return false;
        });
    }
};

const checkThemeData = (data) => {
    const hasColorName = data.some((item) => item.secondId === 10097);
    const hasProductColor = data.some(
        (item) => item.id === 10096
    );
    const hasName = data.some((item) => item.secondId === 9533);
    const hasColor = data.some(
        (item) => item.id === 4295
    );
    return hasColorName && hasProductColor || hasName && hasColor;
}
// 判断是否有俄罗斯尺码和制造商尺码
const checkOtherData = (data) => {
    const hasColorName = data.some((item) => item.secondId === 9533);
    const hasProductColor = data.some(
        (item) => item.id === 4295
    );

    return hasColorName && hasProductColor;
}

const submitForm = () => {
    for (let i = 0; i < attributeList.value.length; i++) {
        for (let j = 0; j < attributeList.value[i].tableData.length; j++) {
            const row = attributeList.value[i].tableData[j];
            if (!validateRow(row)) {
                message.error("请填写变体主题！");
                return false;
            }
        }
    }
    return true;
}

function validateRow(row) {
    if (row.isRequired && row.selectType === "select") {
        return Object.keys(row.modelValue).length > 0;
    } else if (row.isRequired && row.selectType === "multSelect") {
        return row.modelValue && row.modelValue.length > 0;
    } else if (row.selectType === "select") {
        return Object.keys(row.modelValue).length > 0;
    } else {
        return (row.modelValue && row.modelValue.length > 0) || (row.secondModelValue && row.secondModelValue.length > 0);
    }
}

// 抛出数据和方法，可以让父级用ref获取
defineExpose({
    tableData,
    submitForm,
    attributeList
})
onMounted(() => { });
</script>
<style lang="less" scoped>
.headerImg {
    :deep(.ant-upload) {
        width: 80px !important;
        height: 80px !important;
    }
}
</style>