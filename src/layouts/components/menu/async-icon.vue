<script setup>
import * as icons from '@ant-design/icons-vue'
import { isFunction } from '@v-c/utils'

const props = defineProps({
  icon: { type: [String, Function], required: true },
  size: { type: [String, Number], required: false,default: "12px" },
})
const Comp = computed(() => {
  if (isFunction(props.icon)) {
    const node = props.icon()
    if (node)
      return node
  }
  else {
    return icons[props.icon]
  }
  return void 0
})
</script>

<template>
  <component :is="Comp" v-if="icon" :style="{ fontSize: size }"/>
</template>
