<template>
    <div id="editPriceModalCont">
        <a-modal :open="editPriceVisible" :maskClosable="false" @cancel="handleCancel" :width="'40%'" :keyboard="false"
            title="修改属性" destroy-on-close>
            <a-row>
                <a-col :flex="2">
                    <div class="flex flex-col">
                        <div class="flex flex-col mb-2.5" v-for="(item, index) in leftList" :key="index">
                            <a-checkbox v-model:checked="item.checkAll" :indeterminate="item.indeterminate"
                                @change="(e) => onProductAllChange(e, item)">
                                {{ item.title }}
                            </a-checkbox>
                            <a-checkbox-group class="flex w-full ml-12 mt-2.5" v-model:value="item.checkedList"
                                :options="item.option" />
                        </div>
                    </div>
                </a-col>
                <a-col :flex="4" style="max-height: 600px;overflow-y: auto;">
                    <a-form :model="form" :layout="'vertical'" ref="ruleForm" style="margin-top: 20px;">
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;overflow-y: auto;"
                            v-if="checkedListAll.includes('oldPrice')">
                            <a-form-item label="原价：">
                                <a-radio-group v-model:value="form.oldPriceValue" style="width: 100%;"
                                    name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input-number style="width: 200px;"
                                            v-model:value="form.oldPrice" :disabled="form.oldPriceValue == 2"
                                            :precision="2" placeholder="示例：1.00" :min="0"></a-input-number>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="form.oldSelect1"
                                            :disabled="form.oldPriceValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input-number class="mr-2.5"
                                            style="width: 150px;" :disabled="form.oldPriceValue == 1"
                                            v-model:value="form.toOldPrice" placeholder="请输原价格" :precision="2"
                                            :min="0"></a-input-number><a-select v-model:value="form.oldSelect2"
                                            style="width: 120px" :options="commList[1].option"
                                            :disabled="form.oldPriceValue == 1"></a-select>
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('price')">
                            <a-form-item label="售价：">
                                <a-radio-group v-model:value="form.priceValue" style="width: 100%;" name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input-number style="width: 200px;"
                                            v-model:value="form.price" :disabled="form.priceValue == 2" :precision="2"
                                            placeholder="示例：1.00" :min="0"></a-input-number>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="form.priceSelect1"
                                            :disabled="form.priceValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input-number class="mr-2.5"
                                            style="width: 150px;" :disabled="form.priceValue == 1"
                                            v-model:value="form.toPrice" placeholder="请输原价格" :precision="2"
                                            :min="0"></a-input-number><a-select v-model:value="form.priceSelect2"
                                            style="width: 120px" :options="commList[1].option"
                                            :disabled="form.priceValue == 1"></a-select>
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>

                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('minPrice')">
                            <a-form-item label="最低价：">
                                <a-radio-group v-model:value="form.minValue" style="width: 100%;" name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input-number style="width: 200px;"
                                            v-model:value="form.minPrice" :disabled="form.minValue == 2" :precision="2"
                                            placeholder="示例：1.00" :min="0"></a-input-number>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="form.minSelct1"
                                            :disabled="form.minValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input-number class="mr-2.5"
                                            style="width: 150px;" :disabled="form.minValue == 1"
                                            v-model:value="form.toMinPrice" placeholder="请输原价格" :precision="2"
                                            :min="0"></a-input-number><a-select v-model:value="form.minSelct2"
                                            style="width: 120px" :options="commList[1].option"
                                            :disabled="form.minValue == 1"></a-select>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="3">按现有售价：</a-radio><a-select v-model:value="form.minSelct3"
                                            :disabled="form.minValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input-number class="mr-2.5"
                                            style="width: 150px;" :disabled="form.minValue == 1"
                                            v-model:value="form.toMinPrice2" placeholder="请输原价格" :precision="2"
                                            :min="0"></a-input-number><a-select v-model:value="form.minSelct4"
                                            style="width: 120px" :options="commList[1].option"
                                            :disabled="form.minValue == 1"></a-select>
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('stock')">
                            <a-form-item label="库存：">
                                <div>
                                    <div class="titles">
                                        <span>店铺账号</span><span>仓库</span><span>库存</span><span>总库存</span>
                                    </div>
                                    <div class="stockList">
                                        <div class="items" v-for="(item, index) in editStockList" :key="index">
                                            <div class="simpleName">{{ item.simpleName }}</div>
                                            <div class="children">
                                                <div class="childrenItem" v-for="(it, ind) in item.children" :key="ind">
                                                    <div class="childrenItemName">{{ it.name }}</div>
                                                    <div style="width: 50%">
                                                        <a-input-number :precision="0" :min="0"
                                                            style="width: 80%; display: block; margin: 0 auto"
                                                            v-model:value="it.stock"
                                                            @change="changeInputNumber(item)"></a-input-number>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="allStock">{{ item.allStock ? item.allStock : 0 }}</div>
                                        </div>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('weight')">
                            <a-form-item label="重量：">
                                <a-radio-group v-model:value="form.weightValue" style="width: 100%;" name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input-number style="width: 200px;"
                                            v-model:value="form.packageWeight" :disabled="form.weightValue == 2"
                                            :precision="0" placeholder="示例：1" :min="0"></a-input-number>g
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有重量：</a-radio><a-select v-model:value="form.weightSelect"
                                            :disabled="form.weightValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[2].option"></a-select><a-input-number class="mr-2.5"
                                            style="width: 150px;" :disabled="form.weightValue == 1"
                                            v-model:value="form.weight" :precision="0" :min="0"></a-input-number>g
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('size')">
                            <a-form-item label="尺寸：">
                                <div class="flex">
                                    <div class="mr-2.5">
                                        <a-input-number style="width: 100px;" v-model:value="form.packageLength"
                                            placeholder="长" :precision="0" :min="0"></a-input-number>
                                        <span>mm</span>
                                    </div>
                                    <div class="mr-2.5">
                                        <a-input-number style="width: 100px;" v-model:value="form.packageWidth"
                                            placeholder="宽" :precision="0" :min="0"></a-input-number>
                                        <span>mm</span>
                                    </div>
                                    <div>
                                        <a-input-number style="width: 100px;" v-model:value="form.packageHeight"
                                            placeholder="高" :precision="0" :min="0"></a-input-number>
                                        <span>mm</span>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('vat')">
                            <a-form-item label="VAT：">
                                <div class="flex">
                                    <a-select v-model:value="form.vat" class="mr-2.5" style="width: 200px"
                                        :options="commList[3].option"></a-select>
                                </div>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('title')">
                            <a-form-item label="产品标题：">
                                <div class="flex flex-col">
                                    <div class="mb-2.5 flex">
                                        <span>开头添加:</span>
                                        <a-input style="width: 465px;margin-left: 10px;"
                                            v-model:value="form.padStart"></a-input>
                                    </div>
                                    <div class="mb-2.5 flex">
                                        <span>结尾添加:</span>
                                        <a-input style="width: 465px;margin-left: 10px;"
                                            v-model:value="form.padEnd"></a-input>
                                    </div>
                                    <div class="mb-2.5 flex">
                                        <span>标题中的:</span>
                                        <a-input style="width: 200px;margin-left: 10px;"
                                            v-model:value="form.textOld"></a-input>
                                        <span class="ml-2.5">替换为</span>
                                        <a-input style="width: 203px;margin-left: 10px;"
                                            v-model:value="form.textNew"></a-input>
                                    </div>
                                    <div class="mb-2.5 flex">
                                        <span>标题移除:</span>
                                        <a-input style="width: 465px;margin-left: 10px;"
                                            v-model:value="form.textRemove"></a-input>
                                    </div>
                                    <div>
                                        <span>标题字母:</span>
                                        <a-checkbox style="margin-left: 10px;"
                                            v-model:checked="form.capitalCase">首字母大写</a-checkbox>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="checkedListAll.includes('all')">
                            <a-form-item label="合并属性：">
                                <a-form-item label="品牌：">
                                    <div class="flex">
                                        <a-select v-model:value="form.attr" class="mr-2.5" style="width: 200px"
                                            :options="commList[4].option"></a-select>
                                    </div>
                                </a-form-item>
                            </a-form-item>
                        </div>
                    </a-form>
                </a-col>
            </a-row>
            <div><a-tag color="green">说明</a-tag><span>已归档的产品不支持修改产品相关信息！</span></div>

            <template #footer>
                <a-button :loading="loading" @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup name='editPriceModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { waitBathUpdate } from "../../config/api/waitProduct";
import { message } from "ant-design-vue";
import { cloneDeep } from 'lodash'

const props = defineProps({
    editPriceVisible: Boolean,
    selectedRows: Array,
    editStockList: Array,
    defType: Array,
    brandList: Array
});
const emit = defineEmits(["handleEditPriceClose"]);
const loading = ref(false)
const ruleForm = ref();
const attrList = ref([])
// 提取初始表单数据工厂函数
const getInitialFormData = () => ({
    oldPriceValue: 1,
    oldPrice: "",
    toOldPrice: "",
    oldSelect1: "add",
    oldSelect2: "keepTwo",
    priceValue: 1,
    price: "",
    priceSelect1: "add",
    priceSelect2: "keepTwo",
    toPrice: "",
    minPrice: "",
    minValue: 1,
    toMinPrice: "",
    toMinPrice2: "",
    minSelect1: "",
    minSelect2: "",
    minSelect3: "",
    minSelect4: "",
    weightValue: 1,
    weightSelect: "",
    weight: null,
    padStart: "",
    padEnd: "",
    textOld: "",
    textNew: "",
    textRemove: "",
    capitalCase: false,
    vat: "",
    attr: "",
    packageLength: null,
    packageWidth: null,
    packageHeight: null,
    packageWeight: null
})
const form = reactive(getInitialFormData())
const state = reactive({
    indeterminate: false,
    checkAll: false,
    checkedList: [],
    sizeIndeterminate: false,
    sizeCheckAll: false,
    sizeCheckedList: [],
    productCheckAll: false,
    productIndeterminate: false,
    productCheckedList: []
});


const commList = [
    {
        option: [
            {
                label: '加',
                value: 'add'
            },
            {
                label: '减',
                value: 'reduction'
            },
            {
                label: '乘',
                value: 'take'
            },
            {
                label: '除',
                value: 'divide'
            },
            {
                label: '百分比增加',
                value: 'percentAdd'
            },
            {
                label: '百分比减少',
                value: 'percentReduction'
            }
        ]
    },
    {
        option: [
            {
                label: '保留两位小数',
                value: 'keepTwo'
            },
            {
                label: '四舍五入',
                value: 'roundUp'
            },
            {
                label: '进位(取整)',
                value: 'carry'
            }
        ]
    },
    {
        option: [
            {
                label: '加',
                value: 'add'
            },
            {
                label: '减',
                value: 'reduction'
            },
            {
                label: '乘',
                value: 'take'
            }
        ]
    },
    {
        option: [
            {
                label: '豁免',
                value: '0'
            },
            {
                label: '10%',
                value: '0.1'
            },
            {
                label: '20%',
                value: '0.2'
            }
        ]
    },
    {
        option: [
            {
                label: '无品牌',
                value: '无品牌'
            }
        ]
    }
]
const leftList = reactive([
    {
        title: "产品信息",
        option: [
            {
                label: '产品标题',
                value: 'title'
            },
            {
                label: 'VAT',
                value: 'vat'
            },
            {
                label: '合并属性',
                value: 'all'
            }
        ],
        indeterminate: false,
        checkAll: false,
        checkedList: [],
    },
    {
        title: "价格与库存",
        option: [
            {
                label: '售价',
                value: 'price'
            },
            {
                label: '原价',
                value: 'oldPrice'
            },
            {
                label: '库存',
                value: 'stock'
            },
            // {
            //     label: '最低价',
            //     value: 'minPrice'
            // }
        ],
        indeterminate: false,
        checkAll: false,
        checkedList: [],
    },
    {
        title: "重量和尺寸",
        option: [
            {
                label: '重量',
                value: 'weight'
            },
            {
                label: '尺寸',
                value: 'size'
            }
        ],
        indeterminate: false,
        checkAll: false,
        checkedList: [],
    }
])

const onProductAllChange = (e, item) => {
    item.checkedList = e.target.checked ? item.option.map(item => item.value) : []
}

const checkedListAll = computed(() => {
    const list = []
    leftList.forEach(item => {
        list.push(...item.checkedList)
    })

    return list
})

watch(
    () => leftList,
    val => {
        val.forEach(item => {
            item.indeterminate = !!item.checkedList.length && item.checkedList.length < item.option.length;
            item.checkAll = item.checkedList.length === item.option.length;
        })
    }, { deep: true }
);

watch(() => props.defType, val => {
    const item = leftList.find(item => {
        return item.option.some(option => val.includes(option.value));
    })
    item.checkAll = true
    item.indeterminate = false
    item.checkedList = val
})

watch(() => props.brandList, val => {
    if (val.length > 1) {
        attrList.value = processData(val);
    }else{
        attrList.value = val.map(item => {
            return {
                ...item,
                repeatCount: 1
            }
        })
    }
})
// 去重数据
function processData(originalData) {
  const temp = {};
  
  originalData.forEach(item => {
    const key = item.threeCategoryId;
    if (temp[key]) {
      temp[key].repeatCount += 1;
    } else {
      temp[key] = { ...item, repeatCount: 1 };
    }
  });

  return Object.values(temp);
}

const handleCancel = () => {
    emit("handleEditPriceClose")
    ruleForm.value.resetFields();
    leftList.forEach(item => {
        item.checkedList = []
    })
    // 重置表单数据
    const initialData = getInitialFormData()
    Object.keys(initialData).forEach(key => {
        form[key] = initialData[key]
    })
}
const changeInputNumber = (item) => {
    let count = 0;

    item.children.forEach((child) => {
        count = count + child.stock;
    });
    // quantities.value = count
    item.allStock = count;
}

// 提取更新价格的公共逻辑
const updatePrice = (items, priceKey, batchFields) => {
    items.forEach((item) => {
        if (batchFields.priceValue === 1) {
            item[priceKey] = batchFields.batchValue;
        } else {
            item[priceKey] = endResult(
                Number(item[priceKey]),
                Number(batchFields.batchComputeValue),
                batchFields.computeValue,
                batchFields.roundValue
            );
        }
    });
};
//
const endResult = (oldPrice, batchComputeValue, computeValue, roundValue) => {
    // 处理数组类型的oldPrice
    if (Array.isArray(oldPrice)) {
        return oldPrice.map(price =>
            computeSingleValue(price, batchComputeValue, computeValue, roundValue)
        );
    }
    return computeSingleValue(oldPrice, batchComputeValue, computeValue, roundValue);
};

// 新增辅助函数处理单个价格
const computeSingleValue = (price, batchValue, computeType, roundType) => {
    const computeFunc = computeFunctions[computeType];
    const roundFunc = roundFunctions[roundType];

    if (!computeFunc) return 0;

    console.log("singlePrice", price);
    console.log("batchValue", batchValue);

    const computed = computeFunc(Number(price), Number(batchValue));
    console.log("computedResult", computed);

    return roundFunc(computed);
};


// 定义取整函数对象，包含保留两位小数、四舍五入、向上取整操作
const roundFunctions = {
    keepTwo: (value) => value.toFixed(2),
    roundUp: Math.round,
    carry: Math.ceil,
};
// 定义计算函数对象，包含加、减、乘、除、百分比加、百分比减操作
const computeFunctions = {
    add: (oldPrice, batchComputeValue) => oldPrice + batchComputeValue,
    reduction: (oldPrice, batchComputeValue) => oldPrice - batchComputeValue,
    take: (oldPrice, batchComputeValue) => oldPrice * batchComputeValue,
    divide: (oldPrice, batchComputeValue) => oldPrice / batchComputeValue,
    percentAdd: (oldPrice, batchComputeValue) =>
        oldPrice * ((batchComputeValue + 100) / 100),
    percentReduction: (oldPrice, batchComputeValue) =>
        oldPrice * ((100 - batchComputeValue) / 100),
};



const onSubmit = () => {
    if (props.selectedRows.length == 0) return;
    // loading.value = true;
    console.log("selectedRows", props.selectedRows);

    // 标题数据处理
    let arr = props.selectedRows.map((item) => {
        return {
            waitId: item.waitId,
            // name: item.name,
            // vat: item.vat,
            skuList: item.skuList.map(e => {
                return {
                    price: e.price,
                    oldPrice: e.oldPrice,
                    offerId: e.offerId,
                    warehouseList: null
                }
            }),
            account: item.account
        };
    });
    let priceList = cloneDeep(arr)
    // 遍历 checkedListAll 中的每个字段，调用对应的处理函数
    checkedListAll.value.forEach((field) => {
        if (fieldHandlers[field]) {
            priceList = priceList.map((row) => fieldHandlers[field](row, form));
        }
        // 对于尺寸处理，单独判断，因为逻辑复用了 weight 的判断条件
        // if (field === 'weight') {
        //     priceList = priceList.map((row) => fieldHandlers.dimensions(row, form));
        // }
        if (field === 'stock') {
            console.log("editStockList", props.editStockList);
            // 遍历数组 a
            priceList.forEach(itemA => {
                // 查找 b 数组中 account 匹配的元素
                const matchingItemB = props.editStockList.find(itemB => itemB.account === itemA.account);
                console.log("matchingItemB", matchingItemB);

                if (matchingItemB) {
                    // 过滤掉 children 中 stock 为空的元素
                    const validChildren = matchingItemB.children.filter(child => child.stock !== null && child.stock !== '');
                    console.log("validChildren", validChildren);

                    // 生成新数组，包含 name、warehouseId 和 stock
                    const newStockArray = validChildren.map(child => ({
                        warehouseName: child.name,
                        warehouseId: child.warehouseId,
                        present: child.stock,
                        // offerId: itemA.offerId
                    }));
                    console.log("newStockArray");

                    // 将新数组赋值给 a 数组中对应元素的 stock 属性
                    itemA.skuList.forEach(e => {
                        e.warehouseList = newStockArray
                    });
                } else {
                    itemA.skuList.forEach(e => {
                        e.warehouseList = null
                    });
                }
            });
            console.log('priceList', priceList);
        }
    });

    const fieldsToCompare = ['price', 'oldPrice']; //'minPrice'
    priceList.forEach(itemA => {
        itemA.skuList.forEach(e => {
            if (!form.oldPrice && !form.toOldPrice) {
                e.oldPrice = null
            }
            if(!form.price && !form.toPrice) {
                e.price = null
            }
        })
    });

    console.log('priceList--', priceList);
    waitBathUpdate(priceList).then(res => {
        message.success(res.msg)
    }).finally(() => {
        emit("handleEditPriceClose")
        loading.value = false;
        // 重置表单数据
        const initialData = getInitialFormData()
        Object.keys(initialData).forEach(key => {
            form[key] = initialData[key]
        })
    })
}

// 封装处理标题的函数
const handleTitle = (row, form) => {
    if (form.padStart) {
        row.name = form.padStart + row.name;
    }
    if (form.padEnd) {
        row.name += form.padEnd;
    }
    if (form.textOld && form.textNew) {
        row.name = row.name.replaceAll(form.textOld, form.textNew);
    }
    if (form.textRemove) {
        row.name = row.name.replaceAll(form.textRemove, '');
    }
    if (form.capitalCase) {
        row.name = row.name.slice(0, 1).toUpperCase() + row.name.slice(1);
    }
    if (form.cutOverflow) {
        row.name = row.name.slice(0, 128);
    }
    return row;
};

// 封装处理 VAT 的函数
const handleVat = (row, form) => {
    if (form.vat) {
        row.vat = form.vat;
    }
    return row;
};

// 封装处理价格的函数
const handlePrice = (row, form) => {
    console.log("form.toPrice", form.toPrice);
    if (form.priceValue === 1) {
        // 直接修改每个SKU的价格
        row.skuList.forEach(sku => {
            sku.price = form.price.toString();
        });
    } else {
        // 批量计算每个SKU的价格
        row.skuList.forEach(sku => {
            sku.price = endResult(
                sku.price,
                Number(form.toPrice),
                form.priceSelect1,
                form.priceSelect2
            ).toString();
        });
    }
    return row;
};

// 封装处理原价的函数
const handleOldPrice = (row, form) => {
    console.log("form.toOldPrice", form.toOldPrice);
    if (form.oldPriceValue === 1) {
        // 直接修改每个SKU的原价
        row.skuList.forEach(sku => {
            sku.oldPrice = form.oldPrice.toString();
        });
    } else {
        // 批量计算每个SKU的原价
        row.skuList.forEach(sku => {
            sku.oldPrice = endResult(
                sku.oldPrice,
                Number(form.toOldPrice),
                form.oldSelect1,
                form.oldSelect2
            ).toString();
        });
    }
    return row;
};

// 封装处理最低价格的函数
const handleMinPrice = (row, form) => {
    switch (form.minValue) {
        case 1:
            row.minPrice = form.minPrice;
            break;
        case 2:
            row.minPrice = endResult(Number(row.minPrice), Number(form.toMinPrice), form.minSelct1, form.minSelct2);
            break;
        case 3:
            row.minPrice = endResult(Number(row.minPrice), Number(form.toMinPrice2), form.minSelct3, form.minSelct4);
            break;
        default:
            break;
    }

    return row;
};

// 封装处理重量的函数
const handleWeight = (row, form) => {
    if (form.weightValue === 1) {
        row.packageWeight = form.packageWeight;
    } else {
        switch (form.weightSelect) {
            case 'add':
                row.packageWeight = Number(row.packageWeight) + Number(form.weight);
                break;
            case 'reduction':
                row.packageWeight = Number(row.packageWeight) - Number(form.weight);
                break;
            case 'take':
                row.packageWeight = Number(row.packageWeight) * Number(form.weight);
                break;
            default:
                break;
        }
    }
    return row;
};

// 封装处理尺寸的函数
const handleDimensions = (row, form) => {
    row.packageWidth = form.packageWidth;
    row.packageHeight = form.packageHeight;
    row.packageLength = form.packageLength;
    return row;
};

// 定义一个映射对象，将字段名映射到对应的处理函数
const fieldHandlers = {
    title: handleTitle,
    vat: handleVat,
    price: handlePrice,
    oldPrice: handleOldPrice,
    minPrice: handleMinPrice,
    weight: handleWeight,
    dimensions: handleDimensions
};




</script>
<style lang="less" scoped>
.titles {
    display: flex;
    justify-content: space-between;

    span {
        width: 100%;
        text-align: center;
        border: 1px solid #ccc;
    }
}

.stockList {
    border: 1px solid #ccc;

    .items {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;

        .simpleName {
            flex: 1;
            text-align: center;
        }

        .children {
            display: flex;
            flex: 2;
            flex-direction: column;

            .childrenItem {
                display: flex;
                align-items: center;
                border: 1px solid #ccc;
                border-bottom: none;
                box-sizing: border-box;

                .childrenItemName {
                    flex: 1;
                    text-align: center;
                    border-right: 1px solid #ccc;
                    padding: 10px 0;
                }
            }
        }

        .allStock {
            flex: 1;
            text-align: center;
        }
    }
}
</style>