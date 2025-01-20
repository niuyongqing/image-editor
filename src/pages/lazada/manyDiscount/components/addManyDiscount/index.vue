<template>
    <div>
        <BaseModal @register="register" title="创建优惠券" @close="closeModal" @submit="submit" width="1000px"
            :submit-btn-loading="loading">
            <BaseInfo ref="baseInfoRef"></BaseInfo>
            <DiscountSetting :shortCode="shortCode" ref="discountSettingRef" style="margin-top: 10px"></DiscountSetting>
            <ProductSetting ref="productSettingRef" style="margin-top: 10px"></ProductSetting>
        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from '@/components/baseModal/BaseModal.vue';
import BaseInfo from './baseInfo.vue';
import DiscountSetting from './discountSetting.vue';
import ProductSetting from './productSetting.vue';
import { message } from 'ant-design-vue';
import { addLazadaFlexicomboProduct } from '@/pages/lazada/manyDiscount/api';

const { shortCode } = defineProps({
    shortCode: {
        type: String,
        default: ''
    }
})
const emits = defineEmits(['success'])
const baseInfoEl = useTemplateRef('baseInfoRef');
const discountSettingEl = useTemplateRef('discountSettingRef');
const productSettingEl = useTemplateRef('productSettingRef');
const loading = ref(false);
const modalMethods = ref({});
const register = (modal) => {
    modalMethods.value = modal;
}

const submit = async () => {
    let discountSetting = discountSettingEl.value.formData; //优惠设置 所有数据
    let baseInfo = baseInfoEl.value.formData;  //基本信息 所有数据
    let productSetting = productSettingEl.value.formData;  //产品设置  所有数据
    const baseInfoRes = baseInfoEl.value.baseValidate();
    if (!baseInfoRes) {
        return
    }
    const productSettingRes = await productSettingEl.value.baseValidate();
    if (!productSettingRes) {
        return
    }
    let data = {}
    //优惠设置 为 满减打折时
    if (discountSetting.Type === 'fullDiscount') {
        discountSettingEl.value.getDiscountConfigData()
        data.shortCode = shortCode //店铺code
        data.name = baseInfo.name //优惠券名称
        data.startTime = baseInfo.time[0].format('YYYY-MM-DD HH:mm:ss');  //开始时间
        data.endTime = baseInfo.time[1].format('YYYY-MM-DD HH:mm:ss');  //结束时间
        data.apply = productSetting.apply  //适用范围
        data.orderNumbers = productSetting.orderUsedNumbers  //订单总数
        data.discountType = discountSetting.discountData.discountType //优惠类型
        data.stackable = discountSetting.discountData.stackable //优惠尚不封顶
        data.criteriaType = discountSetting.discountData.criteriaType //优惠门槛
        let fullDiscountArr = discountSetting.fullDiscountArr
        let criteriaValue = []
        let discountValue = []
        fullDiscountArr.forEach(value => {
            criteriaValue.push(value.criteriaValue)
            discountValue.push(value.discountValue)
        })
        data.criteriaValue = criteriaValue
        data.discountValue = discountValue

        //当 apply = ENTIRE_STORE时，productSkuIdList = null
        //当 apply = SPECIFIC_PRODUCTS 时，productSkuIdList 有值
        if (productSetting.apply === 'ENTIRE_STORE') {
            data.productSkuIdList = null
        }
    }

    //优惠设置 为 小样/赠品时
    if (discountSetting.Type === 'sampleGiveaway') {
        discountSettingEl.value.getSampleGiveawayData()
        data.shortCode = shortCode //店铺code
        data.name = baseInfo.name //优惠券名称
        data.startTime = baseInfo.time[0].format('YYYY-MM-DD HH:mm:ss');  //开始时间
        data.endTime = baseInfo.time[1].format('YYYY-MM-DD HH:mm:ss');  //结束时间
        data.apply = productSetting.apply  //适用范围
        data.orderNumbers = productSetting.orderUsedNumbers  //订单总数
        data.discountType = discountSetting.discountData.discountType //优惠类型
        data.stackable = discountSetting.discountData.stackable //优惠尚不封顶
        data.criteriaType = discountSetting.discountData.criteriaType //优惠门槛
        let fullDiscountArr = discountSetting.fullDiscountArr;
        let criteriaValue = []
        let giftBuyLimitValue = []
        let sampleArr = []
        let giftSkus = []
        fullDiscountArr.forEach(value => {
            criteriaValue.push(value.criteriaValue.toString())
            giftBuyLimitValue.push(value.giftBuyLimitValue.toString())
            sampleArr.push(...value.sampleArr)
        })
        data.criteriaValue = criteriaValue
        data.giftBuyLimitValue = giftBuyLimitValue
        data.discountValue = []
        sampleArr.forEach((value, index) => {
            let obj = {}
            obj.productId = value.productId
            obj.skuId = value.skuId
            // obj.tier = index + 1
            giftSkus.push(obj)
        })
        // data.giftSkus = [{ productId: '2189761209', skuId: '12523940831' }, { productId: '2189761209', skuId: '12523940832' }];
        data.sampleSkus = sampleArr.map((item) => {
            return { productId: item.productId, skuId: item.skuId, tier: 1 }
        });
        data.giftSkus = sampleArr.map((item) => {
            return { productId: item.productId, skuId: item.skuId }
        })
        //当 apply = ENTIRE_STORE时，productSkuIdList = null
        //当 apply = SPECIFIC_PRODUCTS 时，productSkuIdList 有值
        if (productSetting.apply === 'ENTIRE_STORE') {
            data.productSkuIdList = null
        }
    }

    //组合优惠
    if (discountSetting.Type === 'comboDiscount') {
        discountSettingEl.value.getComboDiscountData()
        data.shortCode = shortCode //店铺code
        data.name = baseInfo.name //优惠券名称
        data.startTime = baseInfo.time[0].format('YYYY-MM-DD HH:mm:ss')  //开始时间
        data.endTime = baseInfo.time[1].format('YYYY-MM-DD HH:mm:ss')  //结束时间
        data.apply = productSetting.apply  //适用范围
        data.orderNumbers = productSetting.orderUsedNumbers  //订单总数
        data.discountType = discountSetting.discountData.discountType //优惠类型
        data.stackable = discountSetting.discountData.stackable //优惠尚不封顶
        data.criteriaType = discountSetting.discountData.criteriaType //优惠门槛
        let fullDiscountArr = discountSetting.fullDiscountArr
        let criteriaValue = [];
        let discountValue = []
        let giftBuyLimitValue = []
        let sampleArr = []
        let giftSkus = []
        fullDiscountArr.forEach(value => {
            console.log('value -->>', value);

            criteriaValue.push(value.criteriaValue.toString())
            discountValue.push(value.discountValue.toString())
            giftBuyLimitValue.push(value.giftBuyLimitValue.toString())
            sampleArr.push(...value.sampleArr)
        })
        data.criteriaValue = criteriaValue
        data.giftBuyLimitValue = giftBuyLimitValue
        data.discountValue = discountValue
        sampleArr.forEach((value, index) => {
            let obj = {}
            obj.productId = value.productId
            obj.skuId = value.skuId
            // obj.tier = index + 1
            giftSkus.push(obj)
        })
        data.giftSkus = giftSkus
        //当 apply = ENTIRE_STORE时，productSkuIdList = null
        //当 apply = SPECIFIC_PRODUCTS 时，productSkuIdList 有值
        if (productSetting.apply === 'ENTIRE_STORE') {
            data.productSkuIdList = null
        }
    }

    //一口价
    if (discountSetting.Type === 'fixedPrice') {
        discountSettingEl.value.getFixedPriceData()
        data.shortCode = shortCode //店铺code
        data.name = baseInfo.name //优惠券名称
        data.startTime = baseInfo.time[0]  //开始时间
        data.endTime = baseInfo.time[1]  //结束时间
        data.apply = productSetting.apply  //适用范围
        data.criteriaType = ''
        data.orderNumbers = productSetting.orderUsedNumbers  //订单总数
        data.discountType = discountSetting.discountData.discountType //优惠类型
        data.discountValue = [String(discountSetting.discountData.discountValue)]
        data.criteriaValue = [String(discountSetting.discountData.criteriaValue)]
    }
    console.log(data)
    loading.value = true
    addLazadaFlexicomboProduct(data).then(res => {
        if (res.code === 200) {
            //如果 选择的是部分商品  打开商品列表
            if (productSetting.apply !== 'ENTIRE_STORE') {
                close()
                emits('success', { shortCode: shortCode, voucherId: res.msg })            // 刷新
            }
            else {
                message.success('创建成功')
                emits('success')
                close()
            }
        }
        else {
            message.error(res.msg)
        }
    }).finally(() => {
        loading.value = false;
    })
}

const open = () => {
    modalMethods.value.openModal();
};

const close = () => {
    modalMethods.value.closeModal();
};

const closeModal = () => {
    baseInfoEl.value.clearValid();
    discountSettingEl.value.clear()
    discountSettingEl.value.reset();
}

defineExpose({
    open
})
</script>

<style lang="less" scoped></style>