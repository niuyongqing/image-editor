<template>
    <a-modal v-model:open="dialogVisible" title="修改促销价" width="620px" @cancel="cancel">
        <div>
            <a-radio-group v-model:value="radio" class="radio-group">
                <a-radio :value="1">
                    直接修改为
                    <a-input-number :precision="2" :controls="false" style="width: 250px;" :disabled="radio !== 1"
                        v-model:value="setNum" placeholder="示例：1.00"></a-input-number>
                </a-radio>
                <!-- <a-radio style="margin-top: 30px;" :value="2">
                    按现有价格
                    <a-select v-model:value="stockRule" placeholder="请选择" style="width: 150px; margin-left: 10px;"
                        :disabled="radio !== 2">
                        <a-select-option v-for="item in stockRuleList" :key="item.value" :value="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
                    <a-input-number :precision="2" :controls="false" style="width: 150px; margin-left: 10px;"
                        :disabled="radio !== 2" v-model:value="setRuleNum" placeholder="示例：1.00"></a-input-number>
                </a-radio> -->
            </a-radio-group>
        </div>
        <p class="pull-left p-top8 f-red f13">注：所有SKU信息将同步更改</p>
        <p class="pull-left f-red f13">促销价大于价格，批量修改则不生效</p>
        <template #footer>
            <a-button :loading="loading" @click="cancel">取 消</a-button>
            <a-button :loading="loading" type="primary" @click="save">确定</a-button>
        </template>
    </a-modal>
</template>

<script setup>
import { batchPrice } from '@/pages/lazada/product/api';
import { message } from 'ant-design-vue';

const acceptParams = ref({});
const skuItem = ref({});
const isBatch = ref(false);
const dialogVisible = ref(false);
const loading = ref(false);
const radio = ref(1);
const setNum = ref(null);
const stockRule = ref(null);
const setRuleNum = ref(null);

// const stockRuleList = [
//     { value: 1, label: '加' },
//     { value: 2, label: '减' },
//     { value: 3, label: '乘' },
//     { value: 4, label: '除' },
// ];

const open = (record, item = {}, batch = false) => {
    acceptParams.value = record;
    skuItem.value = item
    isBatch.value = batch;
    dialogVisible.value = true;
};

const cancel = () => {
    radio.value = 1;
    setNum.value = null;
    stockRule.value = null;
    setRuleNum.value = null;
    dialogVisible.value = false;
    emit('cancel');
};

const save = () => {
    loading.value = true;
    const requestParams = isBatch.value
        ? acceptParams.value.flatMap(item =>
            item.skus.map(sku => ({
                shortCode: item.shortCode,
                itemId: item.itemId,
                skuId: sku.SkuId,
                price: null,
                specialPrice: setNum.value
            }))
        )
        : [{
            shortCode: acceptParams.value.shortCode,
            itemId: acceptParams.value.itemId,
            skuId: skuItem.value.SkuId,
            price: null,
            specialPrice: setNum.value,
        }];

    batchPrice(requestParams)
        .then((res) => {
            if (res.code === 200) {
                message.success('操作成功');
                emit('success');
                cancel();
            }
        }).finally(() => {
            loading.value = false
        });
};

const emit = defineEmits(['cancel', 'success']);

defineExpose({
    open
})

</script>

<style scoped lang="less">
.radio-group {
    display: flex;
    flex-direction: column;
}

.p-top8 {
    padding-top: 20px !important;
}

.f13 {
    font-size: 13px !important;
}

.f-red {
    color: #ec4339 !important;
}
</style>