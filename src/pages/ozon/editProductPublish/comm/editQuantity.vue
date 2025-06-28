<template>
    <div id="editQuantityCont">
        <a-modal :open="editQuantityVis" @cancel="handleCancel" :maskClosable="false" :width="'40%'" :keyboard="false"
            title="修改库存">
            <div>
                <div class="titles">
                    <span>店铺账号</span><span>仓库</span><span>库存</span><span>总库存</span>
                </div>
                <div class="stockList">
                    <div class="items" v-for="(item, index) in copyList" :key="index">
                        <div class="simpleName">{{ item.simpleName }}</div>
                        <div class="children">
                            <div class="childrenItem" v-for="(it, ind) in item.children" :key="ind">
                                <div class="childrenItemName">{{ it.name }}</div>
                                <div style="width: 50%">
                                    <a-input-number :precision="0" :min="0"
                                        style="width: 80%; display: block; margin: 0 auto" v-model:value="it.stock"
                                        @change="changeInputNumber(item)"></a-input-number>
                                </div>
                            </div>
                        </div>
                        <div class="allStock">{{ item.allStock ? item.allStock : 0 }}</div>
                    </div>
                </div>
            </div>
            <template #footer>
                <a-button @click="handleCancel">取消</a-button>
                <a-button type="primary" :loading="loading" @click="onSubmit">确定</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup name='editQuantity'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'

import { message } from "ant-design-vue";
const props = defineProps({
    editQuantityVis: Boolean,
    quantityRow: Object,
    editStockList: Array
})
const loading = ref(false)
const copyList = ref([])
const emit = defineEmits(["backCloseQuantity", "backQuantity"]);
const quantities = ref(0)
const handleCancel = () => {
    emit("backCloseQuantity")
    quantities.value = 0
    copyList.value[0].allStock = 0;
    copyList.value[0].children = copyList.value[0].children.map(item => {
        item.stock = ""
        return {
            ...item,
        }
    })
}
const onSubmit = () => {
    emit("backQuantity", quantities.value,copyList.value)
    handleCancel()
}

const changeInputNumber = (item) => {
    let count = 0;
    item.children.forEach((child) => {
        quantities.value = child.stock
        count = count + child.stock;
    });
    item.allStock = count;
}

watch(() => props.editStockList, val => {
    if (val.length > 0) {
        copyList.value = val
    }
})
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