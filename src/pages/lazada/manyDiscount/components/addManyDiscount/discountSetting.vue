<template>
  <div>
    <a-card bordered>
      <template #title>
        <div class="clearfix">
          <span>优惠设置</span>
          <span style="margin-left: 30px; color: #9e9f9e; font-size: 12px">
            带 <span style="color: red">*</span> 为必填项
          </span>
        </div>
      </template>
      <a-form :model="formData" ref="formRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="" name="name">
          <a-radio-group v-model:value="formData.Type">
            <a-radio value="fullDiscount" @change="changeType('fullDiscount')">满减/打折</a-radio>
            <a-radio value="sampleGiveaway" @change="changeType('sampleGiveaway')">小样赠品</a-radio>
            <a-radio value="comboDiscount" @change="changeType('comboDiscount')">组合折扣</a-radio>
            <a-radio value="fixedPrice" @change="changeType('fixedPrice')">一口价</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <full-discount v-if="formData.Type === 'fullDiscount'" ref="discountConfigRef"></full-discount>
      <sample-giveaway v-if="formData.Type === 'sampleGiveaway'" ref="discountConfigRef"
        :shortCode="shortCode"></sample-giveaway>
      <combo-discount v-if="formData.Type === 'comboDiscount'" ref="discountConfigRef"
        :shortCode="shortCode"></combo-discount>
      <fixed-price v-if="formData.Type === 'fixedPrice'" ref="discountConfigRef"></fixed-price>
    </a-card>
  </div>
</template>

<script setup>
import EventBus from "~/utils/event-bus";
import fullDiscount from './discountConfig/fullDiscount.vue';
import sampleGiveaway from './discountConfig/sampleGiveaway.vue';
import comboDiscount from './discountConfig/comboDiscount.vue';
import fixedPrice from './discountConfig/fixedPrice.vue';

defineProps({
  shortCode: {
    type: String,
    default: ''
  }
})

const { state: formData, reset } = useResetReactive({
  Type: 'fullDiscount',
  discountData: {},
  fullDiscountArr: [] // 梯度数据
});

const discountConfigEl = useTemplateRef('discountConfigRef')

const getDiscountConfigData = () => {
  formData.discountData = discountConfigEl.value.formData;
  formData.fullDiscountArr = discountConfigEl.value.fullDiscountArr;
};

const getSampleGiveawayData = () => {
  formData.discountData = discountConfigEl.value.formData;
  formData.fullDiscountArr = discountConfigEl.value.steepness;
};

const getComboDiscountData = () => {
  formData.discountData = discountConfigEl.value.formData;
  formData.fullDiscountArr = discountConfigEl.value.steepness;
};

const getFixedPriceData = () => {
  formData.discountData = discountConfigEl.value.formData;
};

const changeType = (type) => {
  if (type === 'fixedPrice') {
    EventBus.emit('changeType');
  } else {
    EventBus.emit('changeTypeFalse');
  }
};

const clear = () => {
  discountConfigEl.value.clearValidate()
};

defineExpose({
  formData,
  reset,
  clear,
  getDiscountConfigData,
  getSampleGiveawayData,
  getFixedPriceData,
  getComboDiscountData,
})

</script>

<style lang="scss" scoped></style>