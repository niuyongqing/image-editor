<template>
<div id="EditProdQuantityCont">
    <a-modal title="批量修改库存" :open="editQuantityVis" :maskClosable="false" @cancel="handleCancel" :width="'35%'"
      :keyboard="false">
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
                                        style="width: 80%; display: block; margin: 0 auto" v-model="it.stock"
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

<script setup name='EditProdQuantity'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { message } from "ant-design-vue";

const props = defineProps({
    editQuantityVis: Boolean,
    selectOzonId: Array,
    editStockList: Array
})
const loading = ref(false)
const emit = defineEmits(["backCloseQuantity"]);
const handleCancel = () => {
    emit("backCloseQuantity")
}
const onSubmit = () => {

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