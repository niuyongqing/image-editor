<template>
  <div>
    <a-form :model="formData" ref="formRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="" name="discountType">
        <a-radio-group v-model:value="formData.discountType">
          <a-radio value="discountWithGift">折扣 & 赠品</a-radio>
          <a-radio value="moneyWithGift">减钱 & 赠品</a-radio>
          <a-radio value="discountWithSample">折扣 & 样品</a-radio>
          <a-radio value="moneyWithSample">减钱优惠 & 样品</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item>
        <span style="color: #00000073; font-size: 12px">邮费全部由卖家承担。</span>
      </a-form-item>

      <a-form-item label="优惠上不封顶" name="stackable">
        <a-radio-group v-model:value="formData.stackable">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="优惠门槛" name="criteriaType">
        <a-radio-group v-model:value="formData.criteriaType">
          <a-tooltip title="当买家达到订单件数门槛，即可享受优惠">
            <a-radio value="QUANTITY">满件</a-radio>
          </a-tooltip>
          <a-tooltip title="当买家达到订单金额门槛，即可享受优惠">
            <a-radio value="AMOUNT">订单金额达到门槛</a-radio>
          </a-tooltip>
        </a-radio-group>
      </a-form-item>

      <div v-for="(item, i) in steepness" :key="i">
        <a-card bordered>
          <template #title>
            <div style="display: flex; justify-content: space-between">
              <span>梯度 {{ i + 1 }}</span>
              <a-button type="danger" @click="delGradient(i)" v-if="steepness.length > 1">
                <DeleteOutlined></DeleteOutlined>
              </a-button>
            </div>
          </template>

          <div>
            <div style="display: flex">
              <a-form-item label="当购买数量大于等于:" v-if="formData.criteriaType === 'QUANTITY'" name="criteriaValue">
                <a-input-number v-model:value="item.criteriaValue" :min="1" :max="10" :disabled="item.disable" />
              </a-form-item>
              <a-form-item label="当订单金额大于等于:" v-if="formData.criteriaType === 'AMOUNT'" name="criteriaValue">
                <a-input-number v-model:value="item.criteriaValue" :min="0.1" :max="15000" :disabled="item.disable" />
                <span style="color: gray">RM</span>
              </a-form-item>
              <a-form-item label="优惠为:" style="margin-left: 30px" name="giftBuyLimitValue">
                <a-input-number v-model:value="item.giftBuyLimitValue" :min="1" :max="100000"
                  :disabled="item.disable" />
                <span style="color: gray; margin-left: 10px">%OFF</span>
              </a-form-item>
            </div>
            <a-form-item>
              <template #label><span>赠品/样品</span></template>
              <span style="color: gray; font-size: 13px">卖家将负责礼品和样品的邮费</span>
              <a-button type="primary" style="margin-left: 10px" @click="addGift(i)"
                :disabled="item.disable">增加赠品/样品</a-button>
            </a-form-item>
            <a-form-item>
              <a-alert type="warning" message="在活动过程中删除赠品/样品会导致买家下单失败，请谨慎操作" show-icon />
            </a-form-item>
            <a-form-item>
              <a-alert type="warning" message="请给free gift设置合理的价格，避免造成高额的海关税费" show-icon />
            </a-form-item>
            <a-form-item>
              <a-table :dataSource="item.sampleArr" rowKey="itemId" :pagination="false" :columns="columns">
                <template #bodyCell="{ column, index }">
                  <template v-if="column.dataIndex === 'Include'">
                    <a-button type="primary" danger @click="delSampleArrRow(i, index)" :disabled="item.disable">
                      <DeleteOutlined></DeleteOutlined>
                    </a-button>
                  </template>
                </template>
              </a-table>
            </a-form-item>
            <a-form-item>
              <span>帮助卖家选择</span>
              <a-input-number v-model:value="item.giftBuyLimitValue" :min="1" :max="item.sampleArr.length"
                :disabled="item.disable" style="margin-left: 10px" />
              <span style="margin-left: 10px">从</span>
              <span>{{ item.sampleArr.length }}</span>
              <span style="margin-left: 10px">赠品</span>
            </a-form-item>
          </div>
        </a-card>
      </div>
    </a-form>
    <a-button type="primary" v-if="!formData.stackable && steepness.length !== 3" @click="addGiftCard"
      style="margin-top: 10px">增加梯度</a-button>
    <GiftList ref="giftListRef" :short-code="shortCode"></GiftList>
  </div>
</template>

<script setup>
import EventBus from "~/utils/event-bus";
import { useResetReactive } from '@/composables/reset';
import GiftList from '@/pages/lazada/manyDiscount/components/addManyDiscount/giftList.vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
defineProps({
  shortCode: {
    type: String,
    default: ''
  },
});

const columns = [{
  dataIndex: 'sellerSku',
  title: 'Sku Info',
  key: 'sellerSku',
  align: 'center'
}, {
  dataIndex: 'retailPrice',
  title: 'Retail Price',
  key: 'retailPrice',
  align: 'center'
}, {
  dataIndex: 'salePrice',
  title: 'Sale Price',
  key: 'salePrice',
  align: 'center'
}, {
  dataIndex: 'stock',
  title: 'Stock',
  align: 'center'
},
{
  dataIndex: 'Include',
  title: 'Include',
  align: 'center'
}]

const { state: formData, reset } = useResetReactive({
  discountType: 'discountWithGift',
  stackable: true,
  criteriaType: 'QUANTITY',
});

const steepness = ref([{ criteriaValue: '1', giftBuyLimitValue: '1', disable: false, sampleArr: [] }]);
const addGift = (index) => {
  console.log('index ->>>>>>', index, steepness.value[index]);
  EventBus.emit('GiftList', {
    sampleArr: steepness.value[index].sampleArr,
    index: index,
  });
};

const delSampleArrRow = (cardIndex, index) => {
  steepness.value[cardIndex].sampleArr.splice(index, 1);
};

const addGiftCard = () => {
  steepness.value.push({ criteriaValue: '1', giftBuyLimitValue: '1', disable: false, sampleArr: [] });
  steepness.value[steepness.value.length - 2].disable = true;
};

const delGradient = (index) => {
  steepness.value.pop();
};


const clearValidate = () => {
  formData.value = {
    discountType: 'discountWithGift',
    stackable: true,
    criteriaType: 'QUANTITY',
  };
  steepness.value = [{ criteriaValue: '1', giftBuyLimitValue: '1', disable: false, sampleArr: [] }];
}

defineExpose({
  formData,
  steepness,
  clearValidate,
  reset
})

onMounted(() => {
  // 选择完赠品列表 的数据
  EventBus.on('selectionGift', (e) => {
    if (e) {
      steepness.value[e.index].sampleArr = e.selectionGiftData;
    }
  });
});
</script>

<style lang="scss" scoped></style>