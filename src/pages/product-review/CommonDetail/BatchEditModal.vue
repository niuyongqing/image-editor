<!-- 批量编辑弹窗组件 -->
<template>
  <a-modal
    :open="batchOpen"
    :title="batchTitle"
    :width="'25%'"
    @cancel="cancel"
    @ok="handleOk"
  >
    <div v-if="batchType === 'sku'">
      <a-input
        v-model:value.trim="batchValue"
        style="width: 80%"
      ></a-input>
    </div>
    <div v-else-if="['costPrice', 'stock'].includes(batchType)">
      <a-radio-group
        v-model:value="priceValue"
        style="width: 100%"
        name="radioGroup"
        @change="handleChangeNumber"
      >
        <div class="flex">
          <a-radio :value="1">直接修改为：</a-radio
          ><a-input-number
            v-model:value="batchValue"
            :controls="false"
            style="width: 200px"
            :precision="2"
            :disabled="priceValue == 2"
            placeholder="示例：1.00"
          />
        </div>
        <div class="mt-2.5">
          <a-radio :value="2">按现有数值：</a-radio
          ><a-select
            v-model:value="computeValue"
            :disabled="priceValue == 1"
            class="mr-2.5"
            style="width: 110px"
            :options="commList[0].option"
          ></a-select
          ><a-input-number
            v-model:value="batchComputeValue"
            :controls="false"
            class="mr-2.5"
            style="width: 150px"
            :disabled="priceValue == 1"
            :precision="2"
          />
          <a-select
            v-model:value="roundValue"
            style="width: 140px"
            :options="commList[1].option"
            :disabled="priceValue == 1"
          ></a-select>
        </div>
      </a-radio-group>
    </div>
    <div v-else-if="batchType === 'packLength'">
      <div style="display: flex">
        长度：
        <a-input-number
          controls-position="right"
          :min="0"
          style="width: 80%"
          v-model:value="packageSize.packageLength"
          placeholder="长度"
        >
          <template #addonAfter>mm</template>
        </a-input-number>
      </div>
      <div style="display: flex; margin-top: 5px">
        宽度：
        <a-input-number
          controls-position="right"
          :min="0"
          style="width: 80%"
          v-model:value="packageSize.packageWidth"
          placeholder="宽度"
        >
          <template #addonAfter>mm</template>
        </a-input-number>
      </div>
      <div style="display: flex; margin-top: 5px">
        高度：
        <a-input-number
          controls-position="right"
          :min="0"
          style="width: 80%"
          v-model:value="packageSize.packageHeight"
          placeholder="高度"
        >
          <template #addonAfter>mm</template>
        </a-input-number>
      </div>
      <div style="display: flex; margin-top: 5px">
        重量：
        <a-input-number
          controls-position="right"
          :min="0"
          style="width: 80%"
          v-model:value="packageSize.packageWeight"
          placeholder="重量"
        >
          <template #addonAfter>g</template>
        </a-input-number>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
  import { cloneDeep } from 'lodash'

  const props = defineProps({
    batchOpen: Boolean,
    batchType: String,
    batchTitle: String
  })
  const emit = defineEmits(['batchEditModalClose', 'backValue'])

  const batchValue = ref(null)
  const priceValue = ref(1) // 修改类型(直接修改, 按现有数值调整)
  const computeValue = ref('add')
  const roundValue = ref('keepTwo')
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
    packageWeight: undefined
  })
  const handleChangeNumber = () => {
    priceValue.value === 2 ? (batchValue.value = null) : (batchComputeValue.value = null)
  }
  const cancel = () => {
    emit('batchEditModalClose')
    resetFormData()
  }
  const handleOk = () => {
    let batchFields = {
      packageSize: cloneDeep(packageSize),
      batchValue: batchValue.value,
      priceValue: priceValue.value,
      batchComputeValue: batchComputeValue.value,
      computeValue: computeValue.value,
      roundValue: roundValue.value
    }
    emit('backValue', batchFields)
    cancel()
  }

  // 封装重置表单数据的操作
  const resetFormData = () => {
    batchValue.value = ''
    packageSize.packageLength = ''
    packageSize.packageWidth = ''
    packageSize.packageHeight = ''
    packageSize.packageWeight = ''
    batchComputeValue.value = null
    priceValue.value = 1
    computeValue.value = 'add'
    roundValue.value = 'keepTwo'
  }
</script>
