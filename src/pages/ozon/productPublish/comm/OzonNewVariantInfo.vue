<template>
    <div id="OzonNewVariantInfoCont">
        <a-card title="SKU信息" class="text-left" :loading="categoryAttributesLoading">
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
                                            <!-- <a-select-option v-for="items in record.details" :key="items.id"
                                                :label="items.label" :value="items">{{ items.label
                                                }}
                                            </a-select-option> -->
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
                                <!-- v-if="column.dataIndex === 'secondName'" -->
                                <template v-if="column.dataIndex === record[column.dataIndex]">
                                    <a-input v-model:value="record.secondModelValue" allowClear class="w-4/5"
                                        placeholder="请输入内容" @blur="pushValue(index, items)"></a-input>
                                </template>
                                <template v-if="column.dataIndex === 'options'">
                                    <div>
                                        <a-button class="mr-2.5" @click="addItem(record, items)">
                                            <AsyncIcon icon="PlusCircleOutlined"></AsyncIcon>
                                        </a-button>
                                        <a-button v-if="items.tableData.length != 1"
                                            @click="removeItem(record, index, items)">
                                            <AsyncIcon icon="MinusCircleOutlined"></AsyncIcon>
                                        </a-button>
                                    </div>
                                </template>
                            </template>
                        </a-table>
                    </a-card>

                </div>
            </a-card>
            <a-card title="变种信息" class="text-left mx-50 mt-5">
                <!-- 自定义变种信息 -->
                <div class="flex mb-2.5">
                    <a-checkbox-group v-model:value="addHeaderList" :options="plainOptions">
                    </a-checkbox-group>
                    <!-- <a-button :disabled="custAttr.length == 0" @click="attrVisible = true" type="primary"
                        style="margin-left: 10px"
                        v-if="requiredList.length !== 0 || themeBtns.length !== 0">添加自定义变种属性</a-button> -->
                </div>
                <a-table bordered :columns="filteredHeaderList" :data-source="tableData" :pagination="false">
                    <template #headerCell="{ column }">
                        <template v-if="column.dataIndex === 'sellerSKU'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span><a class="ml-1.25" @click="batchSKU">批量</a>
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span><a class="ml-1.25" @click="batchPrice">批量</a>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span><a class="ml-1.25" @click="batcholdPricebatchPrice">批量</a>
                        </template>
                        <template v-if="column.dataIndex === 'quantity'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}</span><a class="ml-1.25" @click="batchStock">批量</a>
                        </template>
                        <template v-if="column.dataIndex === 'packageLength'">
                            <span><span style="color: #ff0a37;">*</span>
                                {{ column.title }}(mm)</span><a class="ml-1.25" @click="batchPackLength">批量</a>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'colorImg'">
                            <span>{{ record }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'skuTitle'">
                            <span></span>
                        </template>
                        <template v-if="column.dataIndex === 'secondName'">
                            <span>{{ record.secondName }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'sellerSKU'">
                            <a-input v-model:value="record.sellerSKU"></a-input>
                        </template>
                        <template v-if="column.dataIndex === 'price'">
                            <a-input-number style="width: 80%" :min="0" v-model:value="record.price"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'oldPrice'">
                            <a-input-number style="width: 80%" :min="0"
                                v-model:value="record.oldPrice"></a-input-number>
                        </template>
                        <template v-if="column.dataIndex === 'quantity'">
                            <AsyncIcon icon="EditOutlined" @click="batchStock"></AsyncIcon>
                        </template>
                        <template v-if="column.dataIndex === 'packageLength'">
                            <div>
                                <div style="display: flex">
                                    长度：
                                    <a-input-number controls-position="right" :min="0" style="width: 80%"
                                        v-model:value="record.packageLength" placeholder="长度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    宽度：
                                    <a-input-number controls-position="right" :min="0" style="width: 80%"
                                        v-model:value="record.packageWidth" placeholder="宽度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    高度：
                                    <a-input-number controls-position="right" :min="0" style="width: 80%"
                                        v-model:value="record.packageHeight" placeholder="高度">
                                        <template #addonAfter>mm</template>
                                    </a-input-number>
                                </div>
                                <div style="display: flex; margin-top: 5px">
                                    重量：
                                    <a-input-number controls-position="right" :min="0" style="width: 80%"
                                        v-model:value="record.packageWeight" placeholder="重量"
                                        @blur="handleInput(record.packageWeight, record)">
                                        <template #addonAfter>g</template>
                                    </a-input-number>
                                </div>
                            </div>
                        </template>
                        <template v-if="column.dataIndex === 'options'">
                            <div>
                                <a-popconfirm title="确定要删除这个SKU吗？" @confirm="deleteVariable(record, $index)">
                                    <a-button v-if="tableData.length != 1" type="text" danger>删除</a-button>
                                </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </a-card>
            <a-card title="变种图片" class="text-left mx-50 mt-5">
                <template #extra>
                    <div style="padding: 3px 0;color: #99999a;" class="mr-2.5 float-right">
                        <a-select v-model:value="watermarkValue" class="w-50" placeholder="请选择水印"
                            @change="selectWaterMark">
                            <a-select-option v-for="wa in watermark" :key="wa.id" :label="wa.title" :value="wa.id">
                                <div>
                                    <span>{{ wa.title }} </span>
                                    <a-image v-if="wa.type === 1" :src="wa.content"
                                        style="width: 20px; height: 20px; margin-top: -10px"></a-image>
                                    <span v-else>{{ wa.content }}</span>
                                </div>
                            </a-select-option>
                        </a-select>
                    </div>
                    <span style="padding: 3px 0;color: #99999a;" class="mr-5 float-right">
                        <a-input-number v-model:value="cropWidth" placeholder="宽" controls-position="right"
                            :controls="false"></a-input-number>
                        X
                        <a-input-number v-model:value="cropHeight" placeholder="高" controls-position="right"
                            :controls="false"></a-input-number>
                        <a-button @click="crop" class="ml-2.5">裁剪</a-button>
                    </span>
                </template>
                <div>
                    <a-tag color="warning">！说明</a-tag>
                    <span style="color: #9fa0a2">
                        第一张图片默认为主图，点击图片拖动，即可调整图片顺序！
                        单张不超过2M，只支持jpg、.png、.jpeg格式；普通分类图片尺寸为200*200-4320*7680，服装、鞋靴和饰品类目-最低分辨率为900*1200，建议纵横比为3：4；服装、鞋靴和配饰类目，背景应为灰色(#f2f3f5)</span>
                </div>
                <div class="mt-5">
                    <div v-for="item in tableData" :key="item.id">
                        <div v-if="tableData.length > 0">
                            <a-card class="mb-2.5 ml-2.5">
                                <div v-if="imgHeaderList.length > 0">
                                    <div v-for="(e, i) in imgHeaderList" :key="i">
                                        <div>
                                            <span>{{ e.title }}:</span><span>{{ item[e.title] }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="item && item.detail">
                                    {{ item.detail.attr }}
                                </div>
                                <span v-if="item.imageUrl">
                                    {{ item.imageUrl.length }}/15</span>
                                <!-- <drag-file-upload :qiniuUploadForm="{ type: 0 }" :limitation="15" @checkImg="(images) => {
                                        checkImg(images, item);
                                    }
                                    " @allList="imageUpload($event, item)" :allList="item.imageUrl" ref="imageList"
                                    :is-check="true" accept=".jpg,.jpeg,.png"
                                    :upload-url="uploadUrl"></drag-file-upload> -->
                                <!-- <dragUpload></dragUpload> -->
                            </a-card>
                        </div>
                    </div>
                </div>
            </a-card>
        </a-card>
        <EditProdQuantity :editQuantityVis="editQuantityVis"></EditProdQuantity>
    </div>
</template>

<script setup name='OzonNewVariantInfo'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { message } from "ant-design-vue";
import EditProdQuantity from './EditProdQuantity.vue';
import dragUpload from './dragUpload.vue';
const props = defineProps({
    categoryAttributesLoading: Boolean,
    storeOption: Array,
    attributes: Array,
    product: Object,
    editData: Object,
});
const themeList = ref([]) //主题数据
const themeBtns = ref([]) //主题按钮
const requiredList = ref([]) //必填变种主题 
const attributeList = ref([]) //变种主题卡片
const colorAttributeList = ref([]) //带颜色名称的变种主题卡片
const tableData = ref([])
const watermark = ref([])
const watermarkValue = ref("")
const cropWidth = ref(800)
const cropHeight = ref(800)
const editQuantityVis = ref(false)
const headerList = ref([
    {
        dataIndex: 'sellerSKU',
        title: 'SKU',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'price',
        title: '售价',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'oldPrice',
        title: '原价',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'quantity',
        title: '库存',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'packageLength',
        title: '尺寸',
        show: true,
        align: 'center'
    },
    {
        dataIndex: 'options',
        title: '操作',
        show: true,
        align: 'center'
    }
]) //动态表头
const imgHeaderList = ref([])
const addHeaderList = ref([])
const requireColumns = ref([])

const plainOptions = [
    {
        label: '颜色样本',
        value: 'colorImg',
    },
    {
        label: '设置SKU标题',
        value: 'skuTitle',
    },
]
const filteredHeaderList = computed(() => {
    return headerList.value.filter((item) => item.show === true);
})

const isConform = ref(false)
// 处理数据格式
const processDataFormat = (list = []) => {
    console.log('list', list, isConform.value);
    let newHeaderList = []
    const isHave = checkData(list);
    console.log('isHave', isHave);

    if (isHave) {
        const prodColor = list.find(item => item.id === 10096)
        const newList = list.filter(
            (obj) => !(obj.id === 10097)
        );
        console.log('newList', newList);

        newHeaderList = newList.map(item => {
            return {
                title: item.name,
                tableColumns: item.id === 10096 ? [
                    {
                        selectType: item.selectType,
                        dataIndex: item.name,
                        title: item.name,
                        type: 2,
                        id: item.id,
                        show: true,
                        align: 'center',
                        width: 900
                    },
                    {
                        dataIndex: '颜色名称(Название цвета)',
                        title: '颜色名称(Название цвета)',
                        selectType: "input",
                        show: true,
                        type: 2,
                        align: 'center',
                        id: 10097
                    },
                    {
                        dataIndex: 'options',
                        title: '操作',
                        fixed: 'right',
                        width: 200
                    }
                ] : [
                    {
                        selectType: item.selectType,
                        dataIndex: item.name,
                        title: item.name,
                        type: 2,
                        id: item.id,
                        show: true,
                        align: 'center',
                        width: 900
                    },
                    {
                        dataIndex: 'options',
                        title: '操作',
                        fixed: 'right',
                        width: 200
                    }
                ],
                isRequired: item.isRequired,
                id: item.id,
                name: item.name,
                isRequired: item.isRequired,
                categoryDependent: item.categoryDependent,
                isCollection: item.isCollection,
                selectType: item.selectType,
                details: item.options,
                tableData: item.id === 10096 ? [
                    {
                        details: item.options?.map(item => {
                            return {
                                ...item,
                                label: item.value,
                                value: item.id
                            }
                        }),
                        isRequired: item.isRequired,
                        categoryDependent: item.categoryDependent,
                        isCollection: item.isCollection,
                        id: item.id,
                        name: item.name,
                        selectType: item.selectType,
                        modelValue: item.selectType === "input"
                            ? ""
                            : item.selectType === "multSelect"
                                ? []
                                : undefined,
                        secondName: '颜色名称(Название цвета)',
                        '颜色名称(Название цвета)': '颜色名称(Название цвета)',
                        secondId: 10097,
                        secondModelValue: ""
                    }
                ] : [
                    {
                        details: item.options?.map(item => {
                            return {
                                ...item,
                                label: item.value,
                                value: item.id
                            }
                        }),
                        isRequired: item.isRequired,
                        categoryDependent: item.categoryDependent,
                        isCollection: item.isCollection,
                        id: item.id,
                        name: item.name,
                        selectType: item.selectType,
                        modelValue: item.selectType === "input"
                            ? ""
                            : item.selectType === "multSelect"
                                ? []
                                : undefined,
                    }
                ]
            }
        })
    } else {
        newHeaderList = list.map(item => {
            return {
                title: item.name,
                tableColumns: [
                    {
                        selectType: item.selectType,
                        dataIndex: item.name,
                        title: item.name,
                        type: 2,
                        id: item.id,
                        show: true,
                        align: 'center',
                        width: 900
                    },
                    {
                        dataIndex: 'options',
                        title: '操作',
                        fixed: 'right',
                        width: 200
                    }
                ],
                isRequired: item.isRequired,
                id: item.id,
                name: item.name,
                isRequired: item.isRequired,
                categoryDependent: item.categoryDependent,
                isCollection: item.isCollection,
                selectType: item.selectType,
                details: item.options,
                tableData: [
                    {
                        details: item.options?.map(item => {
                            return {
                                ...item,
                                label: item.value,
                                value: item.id
                            }
                        }),
                        isRequired: item.isRequired,
                        categoryDependent: item.categoryDependent,
                        isCollection: item.isCollection,
                        id: item.id,
                        name: item.name,
                        selectType: item.selectType,
                        modelValue: item.selectType === "input"
                            ? ""
                            : item.selectType === "multSelect"
                                ? []
                                : undefined,
                    }
                ]
            }
        })
    }
    console.log('headerList1', headerList.value);
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
        imgHeaderList.value.push({
            title: list[i].name
        })
    }

    console.log('headerList2', headerList.value, tableData.value);

    attributeList.value = [...attributeList.value, ...newHeaderList]
    // 检查数组中对象的 id 属性是否存在 10096
    // const indexOfColor = headerList.value.findIndex(item => item.id === 10096);
    // console.log('/*', indexOfColor !== -1 && isConform.value);
    // const indexOfColorName = headerList.value.findIndex(item => item.id === 10097);
    // if (indexOfColor !== -1 && isConform.value && indexOfColorName !== -1) {
    //     headerList.value.splice(indexOfColor + 1, 0, {
    //         dataIndex: "颜色名称(Название цвета)",
    //         id: 10097,
    //         selectType: "input",
    //         show: true,
    //         title: "颜色名称(Название цвета)",
    //         align: 'center'
    //     });

    // }
    console.log('attributeList', attributeList.value, headerList.value);


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
    // arr.push(item);
    // isConform.value = false
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
    console.log('///', item);

    attributeList.value.splice(index, 1);
    imgHeaderList.value.splice(index, 1);
    // 循环删除表格内容数据
    for (let i = 0; i < tableData.value.length; i++) {
        if (item.name == tableData.value[i][item.name]) {
            let newObj = { ...tableData.value[i] };
            delete newObj[item.name];
            // this.$set(tableData.value, i, newObj);
        }
    }
    // 表头删除
    // headerList.value.splice(index, 1); !(item.prop == item.name && item.label == item.name)
    headerList.value = headerList.value.filter(
        (e) => !(e.title == item.title)
    );
    themeBtns.value.unshift(item);
}
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
    } else {
        ele = {
            id: Date.now(),
            name: item.name,
            modelValue: item.selectType === 'multSelect' ? [] : undefined,
            selectType: item.selectType,
            details: item.details
        };
    }
    // this.$set(item.inputList, item.inputList.length, ele);
    row.tableData.push(ele)
}

// 移除多个属性操作
const removeItem = (item, index, row) => {
    console.log('removeItem', item, row);
    if (item.id === 10096) {
        row.tableData.splice(index, 1);
    } else {
        row.tableData = row.tableData.filter(el => el.id !== item.id);
    }
    tableData.value.splice(index, 1);
}

// 将根据主题中选择的数据进行添加到表格中
const pushValue = (index, item) => {
    console.log("ele", index, item);

    // 处理表格数据
    let cartesianProducts = cartesianProduct(attributeList.value);

    let newTableData = processResult(cartesianProducts);
    let minLength = Math.min(newTableData.length, tableData.value.length);
    console.log("newTableData", newTableData, headerList.value, minLength);
    for (let i = 0; i < minLength; i++) {
        // 将b数组中对应下标的数据赋值到a数组中
        newTableData[i].skuTitle = tableData.value[i].skuTitle;
        newTableData[i].sellerSKU = tableData.value[i].sellerSKU;
        newTableData[i].price = tableData.value[i].price;
        newTableData[i].oldPrice = tableData.value[i].oldPrice;
        newTableData[i].colorImg = tableData.value[i].colorImg;
        newTableData[i].quantity = tableData.value[i].quantity;
        newTableData[i].warehouseName = tableData.value[i].warehouseName;
        newTableData[i].warehouseId = tableData.value[i].warehouseId;
        newTableData[i].packageHeight = tableData.value[i].packageHeight;
        newTableData[i].packageLength = tableData.value[i].packageLength;
        newTableData[i].packageWidth = tableData.value[i].packageWidth;
        newTableData[i].packageWeight = tableData.value[i].packageWeight;
    }
    tableData.value = newTableData
}

// 笛卡尔算法步骤1
const cartesianProduct = (data) => {
    return combine([], data);
}
// 笛卡尔算法步骤1
const combine = (current, remaining) => {
    if (remaining.length === 0) {
        return [current];
    }
    let first = remaining[0];
    let rest = remaining.slice(1);
    let result = [];
    for (let item of first.tableData) {
        for (let subResult of combine([...current, item], rest)) {
            result.push(subResult);
        }
    }

    return result;
}
// 笛卡尔算法步骤1 初始写法
const processResult = (productList) => {
    return productList.map((product) => {
        let output = {
            skuTitle: "",
            sellerSKU: "",
            price: "",
            oldPrice: "",
            quantity: undefined,
            warehouseId: undefined,
            warehouseName: "",
            packageLength: undefined,
            packageWidth: undefined,
            packageHeight: undefined,
            packageWeight: undefined,
            imageUrl: [],
            colorImg: [],
            id: Math.random().toString(36).substring(2, 10),
        };
        product.forEach((item) => {

            let values =
                item.selectType === "multSelect"
                    ? item?.modelValue?.map((val) => val.label).join(",")
                    : item.selectType === "select" ? item.modelValue.value : item.modelValue;
            output[item.name] = values;
            output['secondName'] = item?.secondModelValue;
            output[item.secondName] = item?.secondModelValue;
        });
        return output;
    });
}


const checkFieldsIn = (arr) => {
    for (const item of arr) {
        if (
            !item.hasOwnProperty("商品颜色") ||
            !item.hasOwnProperty("颜色名称")
        ) {
            return false;
        }
    }
    return true;
}
const checkDuplicateColorAndName = (data) => {
    let flag = false;
    const combinationCount = {};
    data.forEach((item) => {
        const combination = `${item.商品颜色}-${item.颜色名称}`;
        if (combinationCount[combination]) {
            combinationCount[combination] += 1;
        } else {
            combinationCount[combination] = 1;
        }
    }); // 找出重复的组合
    const duplicates = Object.keys(combinationCount).filter(
        (combination) => combinationCount[combination] > 1
    ); // 输出重复项
    const duplicatesData = data.filter((item) =>
        duplicates.includes(`${item.商品颜色}-${item.颜色名称}`)
    );
    if (duplicatesData.length > 0) {
        flag = true;
    }
    return flag; // 没有违反规则
}
const checkData = (data) => {
    const hasColorName = data.some((item) => item.id === 10097);
    const hasProductColor = data.some(
        (item) => item.id === 10096
    );
    return hasColorName && hasProductColor;
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
                // this.$set(headerList.value, headerList.value.length, obj);
            }
        }
    });
}

const handleInput = (packageWeight, row) => {
    console.log('111', packageWeight);

    row.packageWeight = packageWeight.split(".")[0];
}

// 批量修改售价
const batchPrice = () => {
    if (tableData.value.length == 0) {
        this.$message.warning("请先添加sku！");
        return;
    }
    this.$prompt("", "批量修改售价", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d+(.\d{1,2})?$/,
        inputErrorMessage: "价格只能是数字",
    }).then(({ value }) => {
        tableData.value.forEach((value1) => {
            value1.price = value;
            ++this.refreshKey;
        });
        this.$forceUpdate();
    });
}
// 批量修改SKU
const batchSKU = () => {
    if (tableData.value.length == 0) {
        this.$message.warning("请先添加sku！");
        return;
    }
    this.$prompt("", "批量修改SKU", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // inputPattern: /^\d+(.\d{1,2})?$/,
        inputErrorMessage: "",
    }).then(({ value }) => {
        tableData.value.forEach((value1) => {
            value1.sellerSKU = value;
            ++this.refreshKey;
        });
        this.$forceUpdate();
    });
}
// 批量修改库存
const batchStock = (row = {}) => {
    if (tableData.value.length == 0) {
        this.$message.warning("请先添加sku！");
        return;
    }
    this.quantityRow = row;
    this.dialogVisible = true;
}
//批量修改原价
const batcholdPricebatchPrice = () => {
    if (tableData.value.length == 0) {
        this.$message.warning("请先添加sku！");
        return;
    }
    this.$prompt("", "批量修改原价", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d+(.\d{1,2})?$/,
        inputErrorMessage: "价格只能是数字",
    }).then(({ value }) => {
        tableData.value.forEach((value1) => {
            value1.oldPrice = value;
            ++this.refreshKey;
        });
    });
}
const batchPackLength = () => {
    if (tableData.value.length == 0) {
        this.$message.warning("请先添加sku！");
        return;
    }
    this.batchVisible = true;
    this.$bus.$emit("OzonBatchLengthOpen", {});
    // ++this.refreshKey
}
// 抛出数据和方法，可以让父级用ref获取
defineExpose({
    tableData,
})
// 排序商品颜色
const reorderArray = (arr) => {
    const hasProdColor = arr.some(item => item.id === 10096);
    const hasColor = arr.some(item => item.id === 10097);
    if (hasProdColor && hasColor) {
        const item = arr.find(item => item.id === 10096);
        arr = arr.filter(item => item.id !== 10096);
        arr.unshift(item);
    }
    return arr;
}


// 选择水印
const selectWaterMark = () => {
    let res = [];
    for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableData[i].imageUrl.length; j++) {
            if (this.tableData[i].imageUrl[j].checkede) {
                res.push(this.tableData[i].imageUrl[j].url);
            }
        }
    }
    if (res.length === 0) {
        this.$alert("选择水印！", "错误提示", {
            confirmButtonText: "确定",
            message: "打水印前请选择需要打水印的文件！",
            type: "error",
        });
        return;
    }
    watermark({ id: this.watermarkValue, imagePathList: res })
        .then((res) => {
            res.data.forEach((value) => {
                for (let i = 0; i < this.tableData.length; i++) {
                    for (let j = 0; j < this.tableData[i].imageUrl.length; j++) {
                        if (
                            this.tableData[i].imageUrl[j].url === value.originalFilename
                        ) {
                            this.tableData[i].imageUrl[j].url = value.fileName;
                            this.tableData[i].imageUrl[j].name = value.newFileName;
                            this.tableData[i].imageUrl[j].checkede = false;
                        }
                    }
                }
            });
        })
        .finally(() => {
            this.watermarkValue = "";
            ++this.refreshKey;
        });
}
const crop = () => {
    let res = [];

    for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.tableData[i].imageUrl.length; j++) {
            if (this.tableData[i].imageUrl[j].checkede) {
                res.push(this.tableData[i].imageUrl[j].url);
            }
        }
    }
    if (res.length === 0) {
        this.$alert("选择水印！", "错误提示", {
            confirmButtonText: "确定",
            message: "打水印前请选择需要打水印的文件！",
            type: "error",
        });
        return;
    }
    cropImg({
        newWidth: this.cropWidth,
        newHeight: this.cropHeight,
        imagePathList: res,
    })
        .then((res) => {
            res.data.forEach((value) => {
                for (let i = 0; i < this.tableData.length; i++) {
                    for (let j = 0; j < this.tableData[i].imageUrl.length; j++) {
                        if (
                            this.tableData[i].imageUrl[j].url === value.originalFilename
                        ) {
                            this.tableData[i].imageUrl[j].url = value.fileName;
                            this.tableData[i].imageUrl[j].name = value.newFileName;
                            this.tableData[i].imageUrl[j].checkede = false;
                            this.tableData[i].imageUrl[j].width = this.cropWidth;
                            this.tableData[i].imageUrl[j].height = this.cropHeight;
                        }
                    }
                }
            });
        })
        .finally(() => {
            this.watermarkValue = "";
            ++this.refreshKey;
        });
}


// 获取水印列表
const getWatermark = () => {
    watermarkList().then((res) => {
        watermark.value = res.data;
    });
}

watch(() => props.attributes, val => {
    if (val) {
        themeBtns.value = [];
        requiredList.value = [];
        attributeList.value = [];
        tableData.value = [];
        headerList.value = [
            {
                dataIndex: 'sellerSKU',
                title: 'SKU',
                show: true,
                align: 'center'
            },
            {
                dataIndex: 'price',
                title: '售价',
                show: true,
                align: 'center'
            },
            {
                dataIndex: 'oldPrice',
                title: '原价',
                show: true,
                align: 'center'
            },
            {
                dataIndex: 'quantity',
                title: '库存',
                show: true,
                align: 'center'
            },
            {
                dataIndex: 'packageLength',
                title: '尺寸',
                show: true,
                align: 'center'
            },
            {
                dataIndex: 'options',
                title: '操作',
                show: true,
                align: 'center'
            }
        ]
        // 提取变种主题
        let arr = props.attributes.filter((obj) => obj.isAspect);
        isConform.value = checkData(arr);
        console.log("arr", arr, isConform.value);
        const requiredItem = arr.some(item => item.isRequired === true);
        console.log('requiredItem', requiredItem);

        if (requiredItem) {
            if (isConform.value) {
                requiredList.value = arr.filter(
                    (obj) => obj.isRequired || obj.id == 10097
                );
                themeBtns.value = arr.filter(
                    (obj) => !(obj.isRequired || obj.id === 10097)
                )
                requiredList.value = reorderArray(requiredList.value)
            } else {
                requiredList.value = arr.filter((obj) => obj.isRequired);
            }
        } else {
            if (isConform.value) {
                themeBtns.value = arr.filter(
                    (obj) => !(obj.isRequired || obj.id === 10097)
                )

            } else {
                themeBtns.value = arr.filter((obj) => !obj.isRequired)
            }
        }


        // themeBtns.value = arr.filter(
        //     (obj) => !(obj.isRequired || obj.id === 10097)
        // )
        // // 过滤必填项的变种主题
        // requiredList.value = arr.filter(
        //     (obj) => obj.isRequired && obj.isCollection
        // )

        console.log('themeBtns', themeBtns.value);
        console.log('requiredList', requiredList.value);

        if (requiredList.value.length != 0) {
            processDataFormat(requiredList.value);
        }
        // if (requiredList.value.length == 0 && themeBtns.value.length == 0) {
        //     tableData.value.push({
        //         skuTitle: "",
        //         sellerSKU: "",
        //         price: "",
        //         oldPrice: "",
        //         quantity: undefined,
        //         warehouseId: undefined,
        //         warehouseName: "",
        //         packageLength: undefined,
        //         packageWidth: undefined,
        //         packageHeight: undefined,
        //         packageWeight: undefined,
        //         colorImg: [],
        //         id: Math.random().toString(36).substring(2, 10),
        //     });
        // }
        tableData.value.push({
            skuTitle: "",
            sellerSKU: "",
            price: "",
            oldPrice: "",
            quantity: undefined,
            warehouseId: undefined,
            warehouseName: "",
            packageLength: undefined,
            packageWidth: undefined,
            packageHeight: undefined,
            packageWeight: undefined,
            imageUrl: [],
            colorImg: [],
            id: Math.random().toString(36).substring(2, 10),
        });
    }

})
onMounted(() => {
    // getWatermark()
})
</script>
<style lang="less" scoped></style>