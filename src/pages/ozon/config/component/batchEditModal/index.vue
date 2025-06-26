<template>
  <a-modal :open="batchOpen" :title="batchTitle" @cancel="cancel" @ok="handleOk" :width="'25%'">
    <div v-if="batchType === 'sku'">
      <a-input v-model:value="batchValue" style="width: 80%"></a-input>
    </div>
    <div v-if="batchType === 'price'">
      <a-radio-group v-model:value="priceValue" @change="handleChangeOldPrice" style="width: 100%;" name="radioGroup">
        <div class="flex">
          <a-radio :value="1">直接修改为：</a-radio><a-input type="number" style="width: 200px;" v-model:value="batchValue"
            :precision="2" :disabled="priceValue == 2" placeholder="示例：1.00"></a-input>
        </div>
        <div class="mt-2.5">
          <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="computeValue" :disabled="priceValue == 1"
            class="mr-2.5" style="width: 110px" :options="commList[0].option"></a-select><a-input type="number"
            class="mr-2.5" style="width: 150px;" :disabled="priceValue == 1" v-model:value="batchComputeValue"
            placeholder="请输原价格" :precision="2"></a-input><a-select v-model:value="roundValue" style="width: 140px"
            :options="commList[1].option" :disabled="priceValue == 1"></a-select>
        </div>
      </a-radio-group>
    </div>
    <div v-if="batchType === 'oldPrice'">
      <a-radio-group v-model:value="priceValue" @change="handleChangeOldPrice" style="width: 100%;" name="radioGroup">
        <div class="flex">
          <a-radio :value="1">直接修改为：</a-radio><a-input type="number" style="width: 200px;" v-model:value="batchValue"
            :precision="2" :disabled="priceValue == 2" placeholder="示例：1.00"></a-input>
        </div>
        <div class="mt-2.5">
          <a-radio :value="2">按现有原价：</a-radio><a-select v-model:value="computeValue" :disabled="priceValue == 1"
            class="mr-2.5" style="width: 110px" :options="commList[0].option"></a-select><a-input type="number"
            class="mr-2.5" style="width: 150px;" :disabled="priceValue == 1" v-model:value="batchComputeValue"
            placeholder="请输原价格" :precision="2"></a-input><a-select v-model:value="roundValue" style="width: 140px"
            :options="commList[1].option" :disabled="priceValue == 1"></a-select>
        </div>
      </a-radio-group>
    </div>
    <div v-if="batchType === 'packLength'">
      <div style="display: flex">
        长度：
        <a-input-number controls-position="right" :min="0" style="width: 80%" v-model:value="packageSize.packageLength"
          placeholder="长度">
          <template #addonAfter>mm</template>
        </a-input-number>
      </div>
      <div style="display: flex; margin-top: 5px">
        宽度：
        <a-input-number controls-position="right" :min="0" style="width: 80%" v-model:value="packageSize.packageWidth"
          placeholder="宽度">
          <template #addonAfter>mm</template>
        </a-input-number>
      </div>
      <div style="display: flex; margin-top: 5px">
        高度：
        <a-input-number controls-position="right" :min="0" style="width: 80%" v-model:value="packageSize.packageHeight"
          placeholder="高度">
          <template #addonAfter>mm</template>
        </a-input-number>
      </div>
      <div style="display: flex; margin-top: 5px">
        重量：
        <a-input-number controls-position="right" :min="0" style="width: 80%" v-model:value="packageSize.packageWeight"
          placeholder="重量">
          <template #addonAfter>g</template>
        </a-input-number>
      </div>
    </div>
  </a-modal>
</template>

<script setup name='batchEditModal'>
import { ref, reactive, onMounted, computed, watchPostEffect } from 'vue'
import { cloneDeep } from 'lodash'
import { deepClone } from '~@/utils';

const props = defineProps({
  batchOpen: Boolean,
  batchType: String,
  batchTitle: String,
});
const emit = defineEmits(["batchEditModalClose","backValue"]);
const batchValue = ref(null)
const priceValue = ref(1)
const computeValue = ref("add")
const roundValue = ref("keepTwo")
const batchComputeValue = ref(null)
const commList = [
  {
    option: [
      {
        label: '加',
        value: 'add'
      },
      {
        label: '减',
        value: 'reduction'
      },
      {
        label: '乘',
        value: 'take'
      },
      {
        label: '除',
        value: 'divide'
      },
      {
        label: '百分比加',
        value: 'percentAdd'
      },
      {
        label: '百分比减',
        value: 'percentReduction'
      }
    ]
  },
  {
    option: [
      {
        label: '保留两位小数',
        value: 'keepTwo'
      },
      {
        label: '四舍五入',
        value: 'roundUp'
      },
      {
        label: '进位(取整)',
        value: 'carry'
      }
    ]
  }
]
const packageSize = reactive({
  packageLength: undefined,
  packageWidth: undefined,
  packageHeight: undefined,
  packageWeight: undefined,
})
const handleChangeOldPrice = () => {
    priceValue.value === 2 ? batchValue.value = null : batchComputeValue.value = null
}
const cancel = () => {
  emit("batchEditModalClose")
  resetFormData()
}
const handleOk = () => {
  let batchFields = {
    packageSize: deepClone(packageSize),
    batchValue: batchValue.value,
    priceValue: priceValue.value,
    batchComputeValue: batchComputeValue.value,
    computeValue: computeValue.value,
    roundValue: roundValue.value
  }
  emit("backValue",batchFields)
  cancel()
}

// 封装重置表单数据的操作
const resetFormData = () => {
    batchValue.value = "";
    packageSize.packageLength = "";
    packageSize.packageWidth = "";
    packageSize.packageHeight = "";
    packageSize.packageWeight = "";
    batchComputeValue.value = null;
    priceValue.value = 1;
    computeValue.value = "add";
    roundValue.value = "keepTwo";
}
</script>
<style lang="less" scoped></style>