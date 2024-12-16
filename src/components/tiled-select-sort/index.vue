<!-- 平铺选择的排序 -->
<template>
  <a-space wrap>
    <a-button
      v-for="(item, i) in props.options"
      :key="i"
      :type="i === curIndex ? 'primary' : 'text'"
      :disabled="item.disabled"
      @click="change(i)"
    >
      {{ item[props.fieldNames.label] }}
      <template v-if="i === curIndex">
        <CaretDownOutlined v-if="sortType === 'desc'" />
        <CaretUpOutlined v-else />
      </template>
    </a-button>
  </a-space>
</template>

<script setup lang="js">
  import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'

  defineOptions({ name: 'TiledSelectSort' })
  components: { CaretDownOutlined, CaretUpOutlined }

  const props = defineProps({
    // 选项数据; 必传
    options: {
      type: Array,
      required: true
    },
    // 自定义节点 label, value 的字段
    fieldNames: {
      type: Object,
      default: () => ({ label: 'label', value: 'value' })
    }
  })
  const emits = defineEmits(['update:value', 'update:sortType'])

  const curIndex = ref(0)
  const sortType = ref('desc')

  function change(i) {
    if (i === curIndex.value) {
      sortType.value = sortType.value === 'desc' ? 'asc' : 'desc'
    } else {
      sortType.value = 'desc'
      curIndex.value = i
    }
    emits('update:value', props.options[i][props.fieldNames.value])
    emits('update:sortType', sortType.value)
  }
</script>
