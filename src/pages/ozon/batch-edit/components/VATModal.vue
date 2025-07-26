<!-- VAT 弹窗 -->
<template>
  <a-modal
    :open="open"
    title="批量修改 VAT"
    @cancel="cancel"
    @ok="ok"
  >
    <a-select
      v-model:value="VAT"
      :options="VAT_OPTIONS"
      placeholder="请选择 VAT"
      class="w-3/4"
    />
  </a-modal>
</template>

<script setup>
  defineExpose({ modify })

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  const VAT_OPTIONS = [
    { label: '免税', value: '0' },
    { label: '10%', value: '0.1' },
    { label: '20%', value: '0.2' }
  ]
  const VAT = ref(null)

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      record.VAT = VAT.value
    })
  }

  function cancel() {
    VAT.value = null
    emits('update:open', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }
</script>
