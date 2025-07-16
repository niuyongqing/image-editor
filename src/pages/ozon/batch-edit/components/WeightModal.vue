<!-- 重量 弹窗 -->
<template>
  <a-modal
    :open="open"
    title="批量修改重量"
    width="35%"
    @cancel="cancel"
    @ok="ok"
  >
    <a-radio-group v-model:value="radio">
      <div class="mb-3">
        <a-radio value="1">
          <span>直接修改为 </span>
          <a-input-number
            v-model:value="absoluteNum"
            :controls="false"
            :min="0"
            :max="999999"
            :precision="2"
            :disabled="radio !== '1'"
            placeholder="示例: 1.00"
            class="w-100"
          ></a-input-number>
        </a-radio>
      </div>

      <div>
        <a-radio value="2">
          <span>按现有重量 </span>
          <!-- antd 里的陈年遗害; 在 radio 中的 select 下拉框会自动收起, 需要阻止默认点击事件 -->
          <a-select
            v-model:value="addType"
            :disabled="radio !== '2'"
            :options="ADD_TYPE_OPTIONS"
            class="w-30"
            @click="e => e.preventDefault()"
          />
          <a-input-number
            v-model:value="relativeNum"
            :controls="false"
            :min="0"
            :max="999999"
            :precision="2"
            :disabled="radio !== '2'"
            placeholder="示例: 1.00"
            class="w-68 mx-2"
          />
        </a-radio>
      </div>
    </a-radio-group>
  </a-modal>
</template>

<script setup>
  import { message } from 'ant-design-vue'

  defineExpose({ modify })

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  const ADD_TYPE_OPTIONS = [
    { label: '加', value: '1' },
    { label: '减', value: '2' },
    { label: '乘', value: '3' },
    { label: '除', value: '4' },
    { label: '百分比加', value: '5' },
    { label: '百分比减', value: '6' }
  ]

  const radio = ref('1')
  const absoluteNum = ref(null)
  const addType = ref('1')
  const relativeNum = ref(null)

  // 判断并获取到修改的逻辑
  function getAddLogic() {
    if (radio.value === '1') {
      // 直接修改
      if (!absoluteNum.value) {
        message.warning('修改值不能为空或为 0')

        return
      }

      return function (item) {
        item.weight = absoluteNum.value
      }
    } else {
      // 相对 按数量或百分比增减
      if (!relativeNum.value) {
        message.warning('修改值不能为空或为 0')

        return
      }

      switch (addType.value) {
        case '1':
          return function (item) {
            item.weight += relativeNum.value
          }
        case '2':
          return function (item) {
            item.weight -= relativeNum.value
          }
        case '3':
          return function (item) {
            item.weight *= relativeNum.value
          }
        case '4':
          return function (item) {
            item.weight /= relativeNum.value
          }
        case '5':
          return function (item) {
            item.weight *= 1 + relativeNum.value / 100
          }
        case '6':
          return function (item) {
            item.weight *= 1 - relativeNum.value / 100
          }

        default:
          return
      }
    }
  }

  // 修改数据
  function modify(tableData) {
    const fn = getAddLogic()

    tableData.forEach(record => {
      record.skuList.forEach(item => {
        fn(item)
      })
    })
  }

  function cancel() {
    radio.value = '1'
    absoluteNum.value = null
    addType.value = '1'
    relativeNum.value = null

    emits('update:open', false)
  }

  function ok() {
    const fn = getAddLogic()
    if (!fn) return

    emits('ok')
    cancel()
  }
</script>
