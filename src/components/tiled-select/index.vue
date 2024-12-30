<!-- 平铺选择 -->
<template>
  <a-space wrap>
    <a-button
      v-for="(item, i) in optionList"
      :key="i"
      :type="i === curIndex ? 'primary' : 'text'"
      :disabled="item.disabled"
      @click="change(i)"
      >{{ item[props.fieldNames.label] }}</a-button
    >
  </a-space>
</template>

<script setup lang="js">
  defineOptions({ name: 'TiledSelect' })

  const props = defineProps({
    // 选项数据; 必传
    options: {
      type: Array,
      required: true
    },
    // 是否在选项中添加[全部]; 默认 是
    appendAll: {
      type: Boolean,
      default: true
    },
    // 自定义节点 label, value 的字段
    fieldNames: {
      type: Object,
      default: () => ({ label: 'label', value: 'value' })
    }
  })
  const emits = defineEmits(['update:value'])

  // 渲染的选项数据
  const optionList = computed(() => props.appendAll ? [{ [props.fieldNames.label]: '全部', [props.fieldNames.value]: undefined }, ...props.options] : props.options)

  const curIndex = ref(0)

  function change(i) {
    curIndex.value = i
    emits('update:value', optionList.value[i][props.fieldNames.value])
  }
</script>
