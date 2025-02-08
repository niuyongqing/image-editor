<template>
    <div id="editPriceModalCont">
        <a-modal :open="editPriceVisible" :maskClosable="false" @cancel="handleCancel" :width="'40%'" :keyboard="false"
            title="修改价格">
            <a-row>
                <a-col :flex="2">
                    <div class="flex flex-col">
                        <div class="flex flex-col mb-2.5">
                            <a-checkbox v-model:checked="state.productCheckAll"
                                :indeterminate="state.productIndeterminate" @change="onProductAllChange">
                                产品信息
                            </a-checkbox>
                            <a-checkbox-group class="flex w-full ml-12 mt-2.5" v-model:value="state.productCheckedList"
                                :options="productMsgOptions" />
                        </div>
                        <div class="flex flex-col mb-2.5">
                            <a-checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate"
                                @change="onCheckAllChange">
                                价格与库存
                            </a-checkbox>
                            <a-checkbox-group class="flex w-full ml-12 mt-2.5" v-model:value="state.checkedList"
                                :options="priceOptions" />
                        </div>
                        <div class="flex flex-col mb-2.5">
                            <a-checkbox v-model:checked="state.sizeCheckAll" :indeterminate="state.sizeIndeterminate"
                                @change="onSizeAllChange">
                                重量和尺寸
                            </a-checkbox>
                            <a-checkbox-group class="flex w-full ml-12 mt-2.5" v-model:value="state.sizeCheckedList"
                                :options="sizeOptions" />
                        </div>
                    </div>
                </a-col>
                <a-col :flex="4">
                    <a-form :model="form" :layout="'vertical'" ref="ruleForm" style="margin-top: 20px;">
                        <!-- height: 400px;overflow-y: auto; -->
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;height: 400px;overflow-y: auto;"
                            v-if="state.checkedList.includes('oldPrice')">
                            <a-form-item label="原价：">
                                <a-radio-group v-model:value="priceValue" style="width: 100%;" name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input type="number" style="width: 200px;"
                                            v-model:value="form.oldPrice" :disabled="priceValue == 2"
                                            placeholder="示例：1.00"></a-input>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="value1"
                                            :disabled="priceValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input type="number"
                                            class="mr-2.5" style="width: 150px;" :disabled="priceValue == 1"
                                            v-model:value="form.oldPrice" placeholder="请输原价格"></a-input><a-select
                                            v-model:value="value1" style="width: 120px" :options="commList[1].option"
                                            :disabled="priceValue == 1"></a-select>
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="state.checkedList.includes('price')">
                            <a-form-item label="售价：">
                                <a-radio-group v-model:value="priceValue" style="width: 100%;" name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input type="number" style="width: 200px;"
                                            v-model:value="form.price" :disabled="priceValue == 2"
                                            placeholder="示例：1.00"></a-input>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="value1"
                                            :disabled="priceValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input type="number"
                                            class="mr-2.5" style="width: 150px;" :disabled="priceValue == 1"
                                            v-model:value="form.price" placeholder="请输原价格"></a-input><a-select
                                            v-model:value="value1" style="width: 120px" :options="commList[1].option"
                                            :disabled="priceValue == 1"></a-select>
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>

                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="state.checkedList.includes('minPrice')">
                            <a-form-item label="最低价：">
                                <a-radio-group v-model:value="priceValue" style="width: 100%;" name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input type="number" style="width: 200px;"
                                            v-model:value="form.minPrice" :disabled="priceValue == 2"
                                            placeholder="示例：1.00"></a-input>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="value1"
                                            :disabled="priceValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input type="number"
                                            class="mr-2.5" style="width: 150px;" :disabled="priceValue == 1"
                                            v-model:value="form.minPrice" placeholder="请输原价格"></a-input><a-select
                                            v-model:value="value1" style="width: 120px" :options="commList[1].option"
                                            :disabled="priceValue == 1"></a-select>
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="3">按现有售价：</a-radio><a-select v-model:value="value1"
                                            :disabled="priceValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[0].option"></a-select><a-input type="number"
                                            class="mr-2.5" style="width: 150px;" :disabled="priceValue == 1"
                                            v-model:value="form.minPrice" placeholder="请输原价格"></a-input><a-select
                                            v-model:value="value1" style="width: 120px" :options="commList[1].option"
                                            :disabled="priceValue == 1"></a-select>
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="state.checkedList.includes('stock')">
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
                                                            v-model="it.stock"
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
                            v-if="state.sizeCheckedList.includes('weight')">
                            <a-form-item label="重量：">
                                <a-radio-group v-model:value="priceValue" style="width: 100%;" name="radioGroup">
                                    <div class="flex">
                                        <a-radio :value="1">直接修改为：</a-radio><a-input type="number" style="width: 200px;"
                                            v-model:value="form.weight" :disabled="priceValue == 2"
                                            placeholder="示例：1"></a-input>g
                                    </div>
                                    <div class="mt-2.5">
                                        <a-radio :value="2">按现有重量：</a-radio><a-select v-model:value="value1"
                                            :disabled="priceValue == 1" class="mr-2.5" style="width: 110px"
                                            :options="commList[2].option"></a-select><a-input type="number"
                                            class="mr-2.5" style="width: 150px;" :disabled="priceValue == 1"
                                            v-model:value="form.weight"></a-input>g
                                    </div>
                                </a-radio-group>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="state.sizeCheckedList.includes('size')">
                            <a-form-item label="尺寸：">
                                <div class="flex">
                                    <div class="mr-2.5">
                                        <a-input type="number" style="width: 100px;" v-model:value="form.size"
                                            placeholder="长"></a-input>
                                        <span>mm</span>
                                    </div>
                                    <div class="mr-2.5">
                                        <a-input type="number" style="width: 100px;" v-model:value="form.size"
                                            placeholder="宽"></a-input>
                                        <span>mm</span>
                                    </div>
                                    <div>
                                        <a-input type="number" style="width: 100px;" v-model:value="form.size"
                                            placeholder="高"></a-input>
                                        <span>mm</span>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="state.productCheckedList.includes('vat')">
                            <a-form-item label="VAT：">
                                <div class="flex">
                                    <a-select v-model:value="value1" class="mr-2.5" style="width: 200px"
                                        :options="commList[3].option"></a-select>
                                </div>
                            </a-form-item>
                        </div>
                        <div class="rounded-md p-2.5 mb-2.5" style="border: 1px solid #ccc;"
                            v-if="state.productCheckedList.includes('title')">
                            <a-form-item label="产品标题：">
                                <div class="flex flex-col">
                                    <div class="mb-2.5 flex">
                                        <span>开头添加:</span>
                                        <a-input style="width: 465px;margin-left: 10px;" v-model="form.padStart"></a-input>
                                    </div>
                                    <div class="mb-2.5 flex">
                                        <span>结尾添加:</span>
                                        <a-input style="width: 465px;margin-left: 10px;" v-model="form.padEnd"></a-input>
                                    </div>
                                    <div class="mb-2.5 flex">
                                        <span>标题中的:</span>
                                        <a-input style="width: 200px;margin-left: 10px;" v-model="form.textOld"></a-input>
                                        <span class="ml-2.5">替换为</span>
                                        <a-input style="width: 203px;margin-left: 10px;" v-model="form.textNew"></a-input>
                                    </div>
                                    <div class="mb-2.5 flex">
                                        <span>标题移除:</span>
                                        <a-input style="width: 465px;margin-left: 10px;" v-model="form.textRemove"></a-input>
                                    </div>
                                    <div>
                                        <span>标题字母:</span>
                                        <a-checkbox style="margin-left: 10px;" v-model="form.capitalCase">首字母大写</a-checkbox>
                                    </div>
                                </div>
                            </a-form-item>
                        </div>
                    </a-form>
                </a-col>
            </a-row>

            <template #footer>
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup name='editPriceModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { updatePrices } from "../../config/api/product";
import { productBatchPrice } from "../../config/commDic/defDic"
import { message } from "ant-design-vue";
const props = defineProps({
    editPriceVisible: Boolean,
    selectOzonId: Array,
    editStockList: Array,
    defType: Array
});
const emit = defineEmits(["handleEditPriceClose"]);
const loading = ref(false)
const priceValue = ref(1)
const ruleForm = ref()
const form = reactive({
    price: "",
    oldPrice: "",
    padStart:"",
    padEnd:"",
    textOld:"",
    textNew:"",
    textRemove:"",
    capitalCase:""
})
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
                value: 'percentReduction'
            },
            {
                label: '四舍五入',
                value: 'percentReduction'
            },
            {
                label: '进位(取整)',
                value: 'percentReduction'
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
    }
]
const priceOptions = [
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
    {
        label: '最低价',
        value: 'minPrice'
    }
]
const sizeOptions = [
    {
        label: '重量',
        value: 'weight'
    },
    {
        label: '尺寸',
        value: 'size'
    }
]
const productMsgOptions = [
    {
        label: '产品标题',
        value: 'title'
    },
    {
        label: 'VAT',
        value: 'vat'
    }
]
const onCheckAllChange = (e) => {
    Object.assign(state, {
        checkedList: e.target.checked ? priceOptions.map(item => item.value) : [],
        indeterminate: false,
    });
}

const onSizeAllChange = (e) => {
    Object.assign(state, {
        sizeCheckedList: e.target.checked ? sizeOptions.map(item => item.value) : [],
        sizeIndeterminate: false,
    });
}

const onProductAllChange = (e) => {
    Object.assign(state, {
        productCheckAll: e.target.checked ? productMsgOptions.map(item => item.value) : [],
        productIndeterminate: false,
    });
}

watch(
    () => state.checkedList,
    val => {
        state.indeterminate = !!val.length && val.length < priceOptions.length;
        state.checkAll = val.length === priceOptions.length;
    },
);
watch(
    () => state.sizeCheckedList,
    val => {
        state.sizeIndeterminate = !!val.length && val.length < sizeOptions.length;
        state.sizeCheckAll = val.length === sizeOptions.length;
    },
);
watch(
    () => state.productCheckedList,
    val => {
        state.productIndeterminate = !!val.length && val.length < productMsgOptions.length;
        state.productCheckAll = val.length === productMsgOptions.length;
    },
);
watch(() => props.defType, val => {
    let sizeArr = ['weight', 'size']
    let productArr = ['title', 'vat']
    if (props.defType.some(value => sizeArr.includes(value))) {
        state.sizeCheckedList = props.defType
    } else if (props.defType.some(value => productArr.includes(value))) {
        state.productCheckedList = props.defType
    } else {
        state.checkedList = props.defType
    }


})
const handleCancel = () => {
    emit("handleEditPriceClose")
    ruleForm.value.resetFields();
}
const onSubmit = () => {
    // 标题数据处理
    if (this.checkedListAll.includes('title')) {
          this.rows.forEach(row => {
            const target = row.subjectList.find(item => item.locale === row.locale)
            if (this.titleForm.padStart) {
              target.value = this.titleForm.padStart + target.value
            }
            if (this.titleForm.padEnd) {
              target.value += this.titleForm.padEnd
            }
            // 替换
            if (this.titleForm.textOld && this.titleForm.textNew) {
              target.value = target.value.replaceAll(this.titleForm.textOld, this.titleForm.textNew)
            }
            if (this.titleForm.textRemove) {
              target.value = target.value.replaceAll(this.titleForm.textRemove, '')
            }
            if (this.titleForm.capitalCase) {
              target.value = target.value.slice(0, 1).toUpperCase() + target.value.slice(1)
            }
            if (this.titleForm.cutOverflow) {
              target.value = target.value.slice(0, 128)
            }
          })
        }
    if (props.selectOzonId.length == 0) return;
    loading.value = true;
    let priceList = props.selectOzonId.map((item) => {
        return {
            offerIds: item.offerIds,
            oldPrice: form.oldPrice,
            price: form.price,
            productIds: item.productIds,
            account: item.account
        };
    });
    let params = {
        prices: priceList,
    };
    console.log(params, "params");

    // updatePrices(params)
    //     .then((res) => {
    //         message.success(res.msg);
    //     })
    //     .finally(() => {
    //         handleCancel()
    //         loading.value = false;
    //     });
}
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