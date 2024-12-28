<template>
    <div id="addPromotionModalCont">
        <a-modal :width="'40%'" title="管理活动" :open="editnameType" :keyboard="false" :maskClosable="false"
            @ok="handelCancel" @cancel="handelCancel">
            <a-card title="活动信息">
                <a-descriptions class="margin-top" :column="2">
                    <a-descriptions-item label="活动名称">{{
                        activeInfo.title
                    }}</a-descriptions-item>
                    <a-descriptions-item label="店铺名称">{{
                        activeInfo.sellerId
                    }}</a-descriptions-item>
                    <a-descriptions-item label="促销活动时间">{{
                        activeInfo.dateStart
                    }}</a-descriptions-item>
                    <a-descriptions-item label="报名截止时间"> </a-descriptions-item>
                </a-descriptions>
            </a-card>
            <a-card title="促销产品" style="margin-top: 20px;">
                <addProduct></addProduct>
            </a-card>
        </a-modal>
    </div>
</template>

<script setup name='addPromotionModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import {
    detail,
    candidates,
    addProducts,
} from "../../config/api/promotion";
import addProduct from './addProduct.vue';
const props = defineProps({
    editnameType: Boolean,
    activeRow: Object
});
const emit = defineEmits(["handelClose"]);
const formData = ref({})
const activeData = ref([])
const addProdLoading = ref(false)
const shopId = ref("")
const activityId = ref(null)
const paginations = reactive({
    total: 0,
    pageNum: 1,
    pageSize: 50,
})
const activeInfo = reactive({
    title: "",
    sellerId: "",
    dateStart: "",
    shopName: "",
})
const handelCancel = () => {
    emit("handelClose")
}

const getPromotionProdList = () => {
    const { productId, productName, sku, skuId } = formData.value;
    let params = {
        id: props.activeRow.id,
        productId,
        productName,
        sku,
        skuId,
        account: props.activeRow.sellerId,
        ...paginations,
    };
    addProdLoading.value = true;
    detail(params)
        .then((res) => {
            const { title, sellerId, dateStart } = res?.data || {};
            activeData.value =
                res?.data?.activityResps?.map((item) => {
                    item.discount = (
                        ((item.salePrice - item.discountPrice) / item.salePrice) *
                        100
                    ).toFixed(2);
                    return item;
                }) || [];
            activeInfo = { ...activeInfo, title, sellerId, dateStart };
            paginations.total = res?.data?.total || 0;
            this.shopId = res?.data.sellerId || "";
            this.activityId = res?.data.id;
        })
        .finally(() => {
            addProdLoading.value = false;
        });
}
</script>
<style lang="less" scoped></style>