<template>
    <div>
        <!-- 创建优惠券 -->
        <BaseModal @register="register" title="创建优惠券" @submit="submit" width="1100px" :submit-btn-loading="loading"
            @close="close">
            <a-card bordered>
                <template #title>
                    <div class="clearfix">
                        <span>基本信息</span>
                        <span style="margin-left: 30px; color: #9e9f9e; font-size: 12px">
                            带 <span style="color: red">*</span> 为必填项
                        </span>
                    </div>
                </template>
                <div>
                    <a-form :model="formData" ref="ruleFormRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                        <a-form-item label="活动名称：" name="voucherName"
                            :rules="[{ required: true, message: '请输入活动名称', trigger: 'blur' }]">
                            <a-input v-model:value="formData.voucherName" allowClear placeholder="请输入活动名称" />
                        </a-form-item>

                        <a-form-item label="优惠券使用时间：" name="periodStartTime" showTime
                            :rules="[{ required: true, message: '请选择时间', trigger: 'change' }]">
                            <a-range-picker style="width: 80%" v-model:value="formData.periodStartTime"
                                format="YYYY-MM-DD HH:mm:ss" />
                        </a-form-item>

                        <a-form-item label="券领取开始时间：" name="collectStart">
                            <a-date-picker style="width: 80%" v-model:value="formData.collectStart"
                                format="YYYY-MM-DD HH:mm:ss" showTime placeholder="券领取开始时间" />
                        </a-form-item>

                        <a-form-item label="优惠券适用于：" name="apply"
                            :rules="[{ required: true, message: '请选择', trigger: 'change' }]">
                            <a-radio-group v-model:value="formData.apply">
                                <a-radio value="ENTIRE_STORE">全店商品</a-radio>
                                <a-radio value="SPECIFIC_PRODUCTS">部分商品</a-radio>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item label="优惠设置：" name="voucherDiscountType">
                            <a-radio-group v-model:value="formData.voucherDiscountType">
                                <a-radio value="MONEY_VALUE_OFF" @change="radioChange(1)">减钱</a-radio>
                                <a-radio value="PERCENTAGE_DISCOUNT_OFF" @change="radioChange(2)">折扣</a-radio>
                            </a-radio-group>
                        </a-form-item>

                        <!-- 减钱 -->
                        <a-form-item label="当订单金额大于等于：" name="orderPrice"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
                            v-if="formData.voucherDiscountType === 'MONEY_VALUE_OFF'">
                            <a-input-number v-model:value="formData.orderPrice" style="width: 80%" />
                        </a-form-item>

                        <a-form-item label="优惠为：" name="orderPreferential"
                            v-if="formData.voucherDiscountType === 'MONEY_VALUE_OFF'"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                            <a-input-number v-model:value="formData.orderPreferential" style="width: 80%"
                                @change="changeOrderPreferential" />
                            <span style="color: orange; margin-left: 10px; font-style: oblique">{{ formData.orderMessage
                                }}</span>
                        </a-form-item>

                        <a-form-item label="优惠券发放总张数：" name="orderCouponCount"
                            v-if="formData.voucherDiscountType === 'MONEY_VALUE_OFF'"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                            <a-input-number v-model:value="formData.orderCouponCount" style="width: 80%" />
                        </a-form-item>

                        <a-form-item label="单个买家领取张数限制：" name="orderNumberLimit"
                            v-if="formData.voucherDiscountType === 'MONEY_VALUE_OFF'"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                            <a-input-number v-model:value="formData.orderNumberLimit" :min="1" :max="50"
                                style="width: 50%" />
                        </a-form-item>

                        <!-- 折扣 -->
                        <a-form-item label="当订单金额大于等于：" name="discountPrice"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]"
                            v-if="formData.voucherDiscountType === 'PERCENTAGE_DISCOUNT_OFF'">
                            <a-input-number v-model:value="formData.discountPrice" style="width: 80%" />
                        </a-form-item>

                        <a-form-item label="优惠为：" name="discountPreferential"
                            v-if="formData.voucherDiscountType === 'PERCENTAGE_DISCOUNT_OFF'"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                            <a-input-number v-model:value="formData.discountPreferential" :min="1" :max="50"
                                style="width: 80%" @change="changeDiscountPreferential" />
                            <span style="color: #9e9f9e; margin-left: 10px">% OFF</span>
                            <span style="color: orange; font-style: oblique">{{ formData.discountMessage }}</span>
                        </a-form-item>

                        <a-form-item label="单笔订单优惠上限：" name="discountUpperLimit"
                            v-if="formData.voucherDiscountType === 'PERCENTAGE_DISCOUNT_OFF'">
                            <a-input-number v-model:value="formData.discountUpperLimit" style="width: 80%"
                                @change="changeDiscountUpperLimit" />
                            <span style="color: orange; font-style: oblique; margin-left: 10px">{{
                                formData.discountUpperLimitMessage
                            }}</span>
                        </a-form-item>

                        <a-form-item label="优惠券发放总张数：" name="discountCouponCount"
                            v-if="formData.voucherDiscountType === 'PERCENTAGE_DISCOUNT_OFF'"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                            <a-input-number v-model:value="formData.discountCouponCount" style="width: 80%" />
                        </a-form-item>

                        <a-form-item label="单个买家领取张数限制：" name="discountNumberLimit"
                            v-if="formData.voucherDiscountType === 'PERCENTAGE_DISCOUNT_OFF'"
                            :rules="[{ required: true, message: '请输入', trigger: 'blur' }]">
                            <a-input-number v-model:value="formData.discountNumberLimit" :min="1" :max="50"
                                style="width: 80%" />
                        </a-form-item>
                    </a-form>
                </div>
                <template #cover></template>
            </a-card>

        </BaseModal>
    </div>
</template>

<script setup>
import BaseModal from "@/components/baseModal/BaseModal.vue";
import { DownOutlined } from '@ant-design/icons-vue';
import { useResetReactive } from '@/composables/reset';
import { message } from "ant-design-vue";
import { addLazadaProduct } from '@/pages/lazada/regularCoupons/api';

const { shortCode } = defineProps({
    shortCode: {
        type: String,
        default: ''
    }
});

const loading = ref(false);
const { state: formData, reset } = useResetReactive({
    voucherName: '',
    periodStartTime: [],
    collectStart: '', //券领取开始时间
    apply: 'ENTIRE_STORE',//优惠券适用于
    voucherDiscountType: 'MONEY_VALUE_OFF',//优惠设置

    // 满减字段
    orderPrice: undefined,//订单金额
    orderPreferential: undefined,//优惠金额
    orderCouponCount: undefined,//优惠券发放总张数
    orderNumberLimit: undefined,//张数限制

    //折扣字段
    discountPrice: undefined,//订单金额
    discountPreferential: undefined,//优惠金额
    discountUpperLimit: undefined,//单笔优惠最高
    discountCouponCount: undefined,//优惠总张数
    discountNumberLimit: undefined,//张数限制

    //规则提示语
    orderMessage: '',
    discountMessage: '',
    discountUpperLimitMessage: '',

});
const ruleFormEl = useTemplateRef('ruleFormRef');
const modalMethods = ref();
const register = (methods) => {
    modalMethods.value = methods;
};

//折扣  单笔订单优惠上限规则
const changeDiscountUpperLimit = (e) => {
    let max = formData.discountPrice * (formData.discountPreferential / 100)
    if (e < max) {
        formData.discountUpperLimitMessage = '最大折扣应大于或等于最小门槛乘以百分比折扣'
    }
    else {
        formData.discountUpperLimitMessage = ''
    }
};

//折扣 优惠规则
const changeDiscountPreferential = (e) => {
    let max = (formData.discountPrice * 0.3) / 10
    if (e > max) {
        formData.discountMessage = '当前折扣已超过7折，请确认优惠设置是否正确'
    }
    else {
        formData.discountMessage = ''
    }
};

// 满减 优惠鬼规则
const changeOrderPreferential = (e) => {
    // 优惠价格不能低于订单价格的1%，要大于等于订单金额的70%
    let mix = formData.orderPrice * 0.01
    let max = formData.orderPrice - (formData.orderPrice * 0.7)
    if (e > 0 && e < mix) {
        formData.orderMessage = '当前的折扣低于 1%，请提高折扣'
    }
    if (e >= mix && e <= max || e == 0 || e == '' || e == undefined) {
        formData.orderMessage = ''
    }
    if (e > max) {
        formData.orderMessage = '当前折扣已超过7折，请确认优惠设置是否正确'
    }
};

//优惠设置 按钮
const radioChange = (type) => {
    if (type == 1) {
        formData.discountPrice = undefined
        formData.discountPreferential = undefined
        formData.discountUpperLimit = undefined
        formData.discountCouponCount = undefined
        formData.discountNumberLimit = undefined
        formData.discountMessage = ''
    }
    if (type == 2) {
        formData.orderPrice = undefined
        formData.orderPreferential = undefined
        formData.orderCouponCount = undefined
        formData.orderNumberLimit = undefined
        formData.orderMessage = ''
    }
};

//判断券领取时间应该在使用时间之前
const dateTimeStr = (date1Str, date2Str) => {
    let date1Strs = date1Str
    let date2Strs = date2Str

    let date1 = new Date(date1Strs);
    let date2 = new Date(date2Strs);

    if (date1 < date2) {
        return true
    } else {
        return false
    }
};

// 打开
const open = () => {
    reset();
    modalMethods.value.openModal();
};
// 关闭
const close = () => {
    reset();
    ruleFormEl.value.resetFields();
};

// 提交
const submit = () => {
    ruleFormEl.value.validate().then(() => {
        if (!dateTimeStr(formData.collectStart, formData.periodStartTime[0])) {
            message.error('券领取时间应该在使用时间之前')
            return false
        }
        let data = {};
        //满减
        if (formData.voucherDiscountType == 'MONEY_VALUE_OFF') {
            data.voucherType = 'COLLECTIBLE_VOUCHER'
            data.displayArea = 'REGULAR_CHANNEL'
            data.shortCode = shortCode
            data.voucherName = formData.voucherName
            data.collectStart = formData.collectStart.format('YYYY-MM-DD HH:mm:ss')
            data.periodStartTime = formData.periodStartTime[0].format('YYYY-MM-DD HH:mm:ss')
            data.periodEndTime = formData.periodStartTime[1].format('YYYY-MM-DD HH:mm:ss')
            data.apply = formData.apply
            data.voucherDiscountType = formData.voucherDiscountType
            data.criteriaOverMoney = formData.orderPrice.toString()
            data.offeringMoneyValueOff = formData.orderPreferential.toString()
            data.issued = formData.orderCouponCount.toString()
            data.limit = formData.orderNumberLimit.toString()
        }
        //折扣
        if (formData.voucherDiscountType == 'PERCENTAGE_DISCOUNT_OFF') {
            data.voucherType = 'COLLECTIBLE_VOUCHER'
            data.displayArea = 'REGULAR_CHANNEL'
            data.shortCode = shortCode
            data.voucherName = formData.voucherName
            data.collectStart = formData.collectStart.format('YYYY-MM-DD HH:mm:ss')
            data.periodStartTime = formData.periodStartTime[0].format('YYYY-MM-DD HH:mm:ss')
            data.periodEndTime = formData.periodStartTime[1].format('YYYY-MM-DD HH:mm:ss')
            data.apply = formData.apply
            data.voucherDiscountType = formData.voucherDiscountType
            data.criteriaOverMoney = formData.discountPrice.toString()
            data.offeringPercentageDiscountOff = formData.discountPreferential
            data.maxDiscountOfferingMoneyValue = formData.discountUpperLimit.toString()
            data.issued = formData.discountCouponCount.toString()
            data.limit = formData.discountNumberLimit.toString()
        }
        loading.value = true;
        addLazadaProduct(data).then(res => {
            if (res.code === 200) {
                //如果 选择的是部分商品  打开商品列表
                if (formData.apply !== 'ENTIRE_STORE') {
                    close()
                    //  刷新
                    emits('success')
                }
                else {
                    message.success('添加成功');
                    emits('success')
                    close()
                }
            }
            else {
                message.success('添加失败')
            }

        }).finally(() => {
            loading.value = false
        })

    })

};
const emits = defineEmits(['success']);

defineExpose({
    open,
})


</script>

<style scoped></style>