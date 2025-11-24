<!-- 批量添加变种属性(行 hang) 弹窗 -->
<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    title="批量设置变种属性"
    @cancel="cancel"
    @ok="ok"
  >
    <a-input
      v-if="columnData.selectType === 'input'"
      v-model:value="newAspectData"
      allow-clear
      placeholder="请输入, 多个值请用英文逗号分割"
      :id="open ? 'autofocus_dom' : ''"
    />

    <a-select
      v-else
      v-model:value="newAspectData"
      allow-clear
      :options="options"
      mode="multiple"
      :field-names="{ label: 'value', value: 'id' }"
      option-filter-prop="value"
      label-in-value
      show-search
      placeholder="请选择, 支持多选"
      class="w-4/5"
      :id="open ? 'autofocus_dom' : ''"
    />
  </a-modal>
</template>

<script setup>
  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    columnData: {
      type: Object,
      default: () => ({})
    },
    aspectData: {
      type: Object,
      default: () => []
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  watch(
    () => props.open,
    open => {
      if (open) {
        nextTick(() => {
          document.getElementById('autofocus_dom')?.focus()
        })
      }
    }
  )

  const options = computed(() => {
    if (props.columnData.selectType === 'String' || !props.columnData.options) return []

    // 已选过的值
    const usedValues = props.aspectData.flatMap(record => getValue(record[props.columnData.name]))

    return props.columnData.options.filter(item => !usedValues.includes(item.id))
  })

  // 根据数据类型获取值
  function getValue(val) {
    const type = Object.prototype.toString.call(val).slice(8, -1)
    switch (type) {
      case 'Array':
        return val.map(item => item.value)
      case 'Object':
        return val.value
      case 'String':
      default:
        return val
    }
  }

  const newAspectData = ref(undefined)

  function cancel() {
    newAspectData.value = undefined
    emits('update:open', false)
  }

  function ok() {
    emits('ok', typeof newAspectData.value === 'string' ? newAspectData.value.split(',') : newAspectData.value)
    cancel()
  }
</script>
