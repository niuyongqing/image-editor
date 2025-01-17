<template>
  <div>
    <a-form :model="formData" ref="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
      <a-form-item label="" name=" discountType">
        <a-radio-group v-model:value="formData.discountType">
          <a-radio value="freeGift">赠品</a-radio>
          <a-radio value="freeSample" disabled>样品</a-radio>
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
        <a-tooltip title="当买家达到订单件数门槛，即可享受优惠">
          <a-radio value="QUANTITY" v-model:value="formData.criteriaType">满件</a-radio>
        </a-tooltip>
        <a-tooltip title="当买家达到订单金额门槛，即可享受优惠">
          <a-radio value="AMOUNT" v-model:value="formData.criteriaType">订单金额达到门槛</a-radio>
        </a-tooltip>
      </a-form-item>

      <!-- 订单金额达到门槛时 梯度 -->
      <div v-for="(item, i) in steepness" :key="i">
        <a-card bordered>
          <template #title>
            <div style="display: flex; justify-content: space-between">
              <span>梯度 {{ i + 1 }}</span>
              <a-button type="danger" icon="delete" @click="delGradient(i)" v-if="steepness.length > 1"></a-button>
            </div>
          </template>

          <div>
            <a-form-item label="当订单金额大于等于:" name="criteriaValue" v-if="formData.criteriaType === 'AMOUNT'">
              <a-input-number v-model:value="item.criteriaValue" :min="0.1" :max="15000" />
              <span style="color: gray">S$</span>
            </a-form-item>
            <a-form-item label="当购买数量大于等于:" name="criteriaValue" v-if="formData.criteriaType === 'QUANTITY'">
              <a-input-number v-model:value="item.criteriaValue" :min="1" :max="5" />
            </a-form-item>
            <a-form-item>
              <template #label><span>赠品/样品</span></template>
              <span style="color: gray; font-size: 13px">卖家将负责礼品和样品的邮费</span>
              <a-button type="primary" style="margin-left: 10px" @click="addGift(index)">增加赠品/样品</a-button>
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
                    <a-button type="primary" danger @click="delSampleArrRow(i, index)"
                      :disabled="item.disable"></a-button>
                  </template>
                </template>
              </a-table>
            </a-form-item>

            <a-form-item>
              <span>帮助卖家选择</span>
              <a-input-number v-model:value="item.giftBuyLimitValue" :min="1" :max="item.sampleArr.length"
                style="margin-left: 10px" />
              <span style="margin-left: 10px">从</span>
              <span>{{ item.sampleArr.length }}</span>
              <span style="margin-left: 10px">赠品</span>
            </a-form-item>
          </div>
        </a-card>
        <br />
      </div>
    </a-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EventBus from "~/utils/event-bus";

const formData = ref({
  discountType: 'freeGift',
  stackable: true,
  criteriaType: 'QUANTITY',
});

const steepness = ref([{ criteriaValue: '1', giftBuyLimitValue: '1', sampleArr: [] }]);
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
  dataIndex: 'Stock',
  title: 'Stock',
  align: 'center'
},
{
  dataIndex: 'Include',
  title: 'Include',
  align: 'center'
}]
onMounted(() => {
  // 选择完赠品列表 的数据
  EventBus.on('selectionGift', (e) => {
    if (e) {
      steepness.value[e.index].sampleArr = e.selectionGiftData;
    }
  });
});

const addGift = (index) => {
  EventBus.emit('GiftList', steepness.value[index].sampleArr, index);
};

const addGiftCard = () => {
  steepness.value.push({ criteriaValue: '1', giftBuyLimitValue: '1', sampleArr: [] });
};

// 删除 梯度中的 赠品/样品列表
const delSampleArrRow = (cardIndex, index) => {
  steepness.value[cardIndex].sampleArr.splice(index, 1);
};

// 删除梯度
const delGradient = (index) => {
  steepness.value.pop();
};
</script>

<style lang="scss" scoped></style>