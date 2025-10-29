<!-- 售卖单位 弹窗 -->
<template>
  <a-modal
    :open="open"
    title="批量修改售卖单位"
    @cancel="cancel"
    @ok="ok"
  >
    <a-input
      v-model:value="unit"
      allow-clear
      placeholder="请输入售卖单位"
      :id="open ? 'autofocus_dom' : ''"
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

  const unit = ref('')

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      record.unit = unit.value
    })
  }

  function cancel() {
    unit.value = ''
    emits('update:open', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }
</script>
