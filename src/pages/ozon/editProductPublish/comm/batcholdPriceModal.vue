<template>
    <div id="batcholdPriceModalCont">
        <a-modal :open="batchOldPriceVis" :maskClosable="false" @cancel="handleCancel" :width="'30%'" :keyboard="false"
            title="修改原价">
            <a-form :model="form" :layout="'vertical'" ref="ruleForm" style="margin-top: 20px;">
                <a-form-item>
                    <a-radio-group v-model:value="optionForm.radioValue" @change="changeGroup" style="width: 100%;" name="radioGroup">
                        <div class="flex">
                            <a-radio :value="1">直接修改为：</a-radio><a-input type="number" style="width: 200px;"
                                v-model:value="optionForm.pirceValue" :disabled="optionForm.radioValue == 2"
                                placeholder="示例：1.00"></a-input>
                        </div>
                        <div class="mt-2.5">
                            <a-radio :value="2">按现有价格：</a-radio>
                            <a-select v-model:value="optionForm.optionSymbol" :disabled="optionForm.radioValue == 1"
                                class="mr-2.5" style="width: 110px" :options="commList[0].option"></a-select>
                            <a-input type="number" class="mr-2.5" style="width: 150px;"
                                :disabled="optionForm.radioValue == 1" v-model:value="optionForm.pirceValue2"></a-input>
                            <a-select v-model:value="optionForm.optionPart" style="width: 130px"
                                :options="commList[1].option" :disabled="optionForm.radioValue == 1"></a-select>
                        </div>
                    </a-radio-group>
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
            </template>
        </a-modal>

    </div>
</template>

<script setup name='batcholdPriceModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { message } from "ant-design-vue";

const props = defineProps({
    batchOldPriceVis: Boolean,
    rowOldPrice: String,
});
const emit = defineEmits(["handleBatcholdPriceModalClose","backOldPrice"]);
const optionForm = reactive({
    radioValue: 1,
    optionSymbol: "add",
    optionPart: "1",
    pirceValue: "",
    pirceValue2: "",
})
const loading = ref(false)
const form = reactive({
    price: ""
})
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
                value: '1'
            },
            {
                label: '四舍五入',
                value: '2'
            },
            {
                label: '进位(取整)',
                value: '3'
            }
        ]
    },

]

const handleCancel = () => {
    emit("handleBatcholdPriceModalClose")
    optionForm.pirceValue = ""
    optionForm.pirceValue2 = ""
}


const onSubmit = () => {
    form.price =  optionForm.radioValue === 1 ? optionForm.pirceValue :  calculateResult.value
    console.log('form', form.price);
    console.log('计算结果:', props.rowOldPrice, calculateResult.value);
    emit("backOldPrice",form.price)
    handleCancel()
}

const changeGroup = () => {
    optionForm.radioValue === 1 ? optionForm.pirceValue2 = "" : optionForm.pirceValue = ""
}
const calculateResult = computed(() => {
    if (optionForm.radioValue === 2) {
        console.log('rowOldPrice', props.rowOldPrice);
        const oldPrice = parseFloat(props.rowOldPrice);
        const value2 = parseFloat(optionForm.pirceValue2);
        if (!isNaN(oldPrice) && !isNaN(value2)) {
            let result;
            switch (optionForm.optionSymbol) {
                case "add":
                    result = oldPrice + value2;
                    break;
                case "reduction":
                    result = oldPrice - value2;
                    break;
                case "take":
                    result = oldPrice * value2;
                    break;
                case "divide":
                    if (value2 !== 0) {
                        result = oldPrice / value2;
                    } else {
                        message.error("除数不能为 0");
                        return NaN;
                    }
                    break;
                case "percentAdd":
                    result = oldPrice * (1 + value2 / 100);
                    break;
                case "percentReduction":
                    result = oldPrice * (1 - value2 / 100);
                    break;
                default:
                    return NaN;
            }

            // 根据 optionForm.optionPart 进行处理
            switch (optionForm.optionPart) {
                case "1":
                    // 保留两位小数
                    return parseFloat(result.toFixed(2));
                case "2":
                    // 四舍五入
                    return Math.round(result);
                case "3":
                    // 进位(取整)
                    return Math.ceil(result);
                default:
                    return result;
            }
        } else {
            message.error("输入的价格数据格式不正确");
            return NaN;
        }
    }
    return NaN;
});

</script>
<style lang="less" scoped></style>