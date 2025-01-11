<template>
  <div>
    <a-form :model="formData" ref="ruleForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="" name="discountType">
        <a-radio-group v-model:value="formData.discountType" @change="changeDiscountType">
          <a-radio value="money">减钱</a-radio>
          <a-radio value="discount">折扣</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="优惠上不封顶" name="stackable" v-if="formData.discountType === 'money'">
        <a-radio-group v-model:value="formData.stackable" @change="changeStackable">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="优惠门槛" name="criteriaType">
        <a-radio-group v-model:value="formData.criteriaType" @change="changeStackable">
          <a-tooltip title="当买家达到订单件数门槛，即可享受优惠">
            <a-radio value="QUANTITY">满件</a-radio>
          </a-tooltip>
          <a-tooltip title="当买家达到订单金额门槛，即可享受优惠">
            <a-radio value="AMOUNT">订单金额达到门槛</a-radio>
          </a-tooltip>
        </a-radio-group>
      </a-form-item>

      <!-- 满件 减钱 -->
      <div v-if="formData.discountType === 'money'">
        <a-form-item v-for="(item, index) in fullDiscountArr" :key="index">
          <a-card bordered>
            <template #title>
              <div style="display: flex; justify-content: space-between">
                <span>梯度 {{ index + 1 }}</span>
                <a-button type="primary" danger @click="delGradient(index)"
                  v-if="fullDiscountArr.length > 1 && fullDiscountArr">
                  <DeleteOutlined />
                </a-button>
              </div>
            </template>

            <div style="display: flex;">
              <a-form-item label="当购买数量大于等于:" name="criteriaValue" v-if="formData.criteriaType === 'QUANTITY'">
                <a-input-number v-model:value="item.criteriaValue" :min="1" :max="10" :disabled="item.disable" />
              </a-form-item>

              <a-form-item label="当订单金额大于等于:" name="criteriaValue" v-if="formData.criteriaType === 'AMOUNT'">
                <a-input-number v-model:value="item.criteriaValue" :min="0.1" :max="100000" :disabled="item.disable" />
                <span style="color: gray; margin-left: 10px">RM</span>
              </a-form-item>

              <a-form-item label="优惠为:" name="discountValue" style="margin-left: 30px">
                <a-input-number v-model:value="item.discountValue" :min="1" :max="100000" :disabled="item.disable" />
                <span style="color: gray; margin-left: 10px">RM</span>
              </a-form-item>
            </div>
          </a-card>
        </a-form-item>
      </div>
      <!-- 满件 折扣 -->
      <div v-if="formData.discountType === 'discount'">
        <a-form-item v-for="(item, index) in fullDiscountArr" :key="index">
          <a-card bordered>
            <template #title>
              <div style="display: flex; justify-content: space-between">
                <span>梯度 {{ index + 1 }}</span>
                <a-button type="danger" icon="delete" @click="delGradient(index)"
                  v-if="fullDiscountArr.length > 1 && fullDiscountArr"></a-button>
              </div>
            </template>

            <div style="display: flex;">
              <a-form-item label="当购买数量大于等于:" name="criteriaValue" v-if="formData.criteriaType === 'QUANTITY'">
                <a-input-number v-model:value="item.criteriaValue" :min="1" :max="10" :disabled="item.disable" />
              </a-form-item>
              <a-form-item label="优惠为:" name="discountValue" style="margin-left: 30px"
                v-if="formData.criteriaType === 'QUANTITY'">
                <a-input-number v-model:value="item.discountValue" :min="1" :max="99" :disabled="item.disable" />
                <span style="color: gray; margin-left: 10px">% OFF</span>
              </a-form-item>

              <a-form-item label="当订单金额大于等于:" name="criteriaValue" v-if="formData.criteriaType === 'AMOUNT'">
                <a-input-number v-model:value="item.criteriaValue" :min="0.1" :max="100000" :disabled="item.disable" />
                <span style="color: gray; margin-left: 10px">RM</span>
              </a-form-item>
              <a-form-item label="优惠为:" name="discountValue" style="margin-left: 30px"
                v-if="formData.criteriaType === 'AMOUNT'">
                <a-input-number v-model:value="item.discountValue" :min="1" :max="99" :disabled="item.disable" />
                <span style="color: gray; margin-left: 10px">% OFF</span>
              </a-form-item>
            </div>
          </a-card>
        </a-form-item>
      </div>
      <a-button type="primary" @click="addGradient"
        v-if="(formData.discountType === 'money' && !formData.stackable && fullDiscountArr.length < 3) || (formData.discountType === 'discount' && fullDiscountArr.length < 3)">增加梯度</a-button>
    </a-form>
  </div>
</template>

<script setup>

import {
  DeleteOutlined
} from '@ant-design/icons-vue';
const formData = ref({
  discountType: 'money',
  stackable: true,
  criteriaType: 'QUANTITY',
});

const fullDiscountArr = ref([{ criteriaValue: '1', discountValue: '2', disable: false }]);

const changeStackable = () => {
  if (formData.value.stackable) {
    fullDiscountArr.value.splice(1, fullDiscountArr.value.length - 1);
    fullDiscountArr.value[0].disable = false;
  }
};

const changeDiscountType = () => {
  if (formData.value.discountType === 'money') {
    fullDiscountArr.value.splice(1, fullDiscountArr.value.length - 1);
    fullDiscountArr.value[0].disable = false;
    formData.value.stackable = true;
  }
};

// 增加梯度 并且把第一梯度输入框禁用
const addGradient = () => {
  fullDiscountArr.value.push({ criteriaValue: '1', discountValue: '2', disable: false });
  fullDiscountArr.value[0].disable = true;
};

// 删除梯度 并且把第一梯度输入框禁用放开
const delGradient = (index) => {
  fullDiscountArr.value.pop();
  if (fullDiscountArr.value.length === 1) {
    fullDiscountArr.value[0].disable = false;
  }
};
</script>

<style lang="less" scoped></style>