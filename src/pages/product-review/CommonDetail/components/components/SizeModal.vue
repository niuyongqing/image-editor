<!-- 批量修改尺寸弹窗 -->
<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    title="批量修改尺寸"
    @cancel="cancel"
    @ok="ok"
  >
    <a-space>
      <span>直接修改为</span>
      <a-input-number
        v-model:value="length"
        :controls="false"
        :min="0"
        :max="99999"
        :precision="0"
        class="w-30"
        placeholder="长(mm)"
        :id="open ? 'autofocus_dom' : ''"
      />
      <a-input-number
        v-model:value="width"
        :controls="false"
        :min="0"
        :max="99999"
        :precision="0"
        class="w-30"
        placeholder="宽(mm)"
      />
      <a-input-number
        v-model:value="height"
        :controls="false"
        :min="0"
        :max="99999"
        :precision="0"
        class="w-30"
        placeholder="高(mm)"
      />
    </a-space>
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

  const length = ref(null)
  const width = ref(null)
  const height = ref(null)

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      record.length = length.value
      record.width = width.value
      record.height = height.value
    })
  }

  function cancel() {
    length.value = null
    width.value = null
    height.value = null

    emits('update:open', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }
</script>
