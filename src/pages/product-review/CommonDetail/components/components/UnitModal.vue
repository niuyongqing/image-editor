<!-- 售卖单位 弹窗 -->
<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    title="批量修改售卖单位"
    @cancel="cancel"
    @ok="ok"
  >
    <a-select
      v-model:value="saleUnit"
      :options="UNIT_OPTIONS"
      :field-names="{ value: 'ru' }"
      placeholder="请选择"
      class="w-full"
      :id="open ? 'autofocus_dom' : ''"
    />
  </a-modal>
</template>

<script setup>
  import { UNIT_OPTIONS } from '../config'

  defineExpose({ modify })

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  watch(
    () => props.open,
    open => {
      if (open) {
        nextTick(() => {
          document.getElementById('autofocus_dom').focus()
        })
      }
    }
  )

  const saleUnit = ref(undefined)

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      record.saleUnit = saleUnit.value
    })
  }

  function cancel() {
    saleUnit.value = undefined
    emits('update:open', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }
</script>
