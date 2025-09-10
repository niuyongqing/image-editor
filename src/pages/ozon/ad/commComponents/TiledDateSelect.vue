<!-- 平铺的日期选择组件 -->
<template>
  <a-space wrap>
    <a-button
      v-for="item in options"
      :key="item.value"
      :type="item.value === active ? 'primary' : 'text'"
      :disabled="item.disabled"
      @click="btnChange(item.value)"
      >{{ item.label }}</a-button
    >

    <a-range-picker
      v-model:value="dateRange"
      :disabled-date="cur => cur && cur > Date.now()"
      @change="pickerChange"
    />
  </a-space>
</template>

<script setup>
  import dayjs from 'dayjs'

  defineOptions({ name: 'TiledDateSelect' })

  const emits = defineEmits(['update:value'])

  const options = [
    { label: '昨天', value: 1 },
    { label: '7天内', value: 7 },
    { label: '30天内', value: 30 }
  ]
  const active = ref(7)
  const dateRange = ref([dayjs().subtract(7, 'day'), dayjs()])

  function btnChange(val) {
    if (val === active.value) return

    active.value = val
    if (val === 1) {
      dateRange.value = [dayjs().subtract(val, 'day'), dayjs().subtract(val, 'day')]
    } else {
      dateRange.value = [dayjs().subtract(val, 'day'), dayjs()]
    }

    emits('update:value', dateRange)
  }

  function pickerChange() {
    emits('update:value', dateRange)

    active.value = null

    // 联动到左侧快捷日期按钮
    if (dateRange.value !== null) {
      const today = dayjs().format('YYYY-MM-DD')
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      const dateStart = dayjs(dateRange.value[0]).format('YYYY-MM-DD')
      const dateEnd = dayjs(dateRange.value[1]).format('YYYY-MM-DD')

      // 判断结束日期是否是今天
      if (dateEnd === today) {
        switch (dateStart) {
          case dayjs().subtract(7, 'day').format('YYYY-MM-DD'):
            active.value = 7
            break

          case dayjs().subtract(30, 'day').format('YYYY-MM-DD'):
            active.value = 30
            break

          default:
            break
        }
        // 判断是否为昨天
      } else if (dateEnd === yesterday && dateStart === yesterday) {
        active.value = 1
      }
    }
  }
</script>
