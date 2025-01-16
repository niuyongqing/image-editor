<!-- 搜索内容的输入框 -->
<template>
  <div class="relative">
    <a-input
      v-model:value="content"
      v-if="isFold"
      class="w-[400px]"
      :placeholder="placeholder"
      allow-clear
      @blur="blur"
      @keyup.enter="enter"
    >
      <template #prefix v-if="!hideControl">
        <DownSquareOutlined class="color-[--pro-ant-color-primary-text]" @click="isFold = !isFold" />
      </template>
    </a-input>
    <template v-else>
      <a-textarea
        v-model:value="content"
        placeholder="多个搜索请用回车换行(无需英文逗号结尾)"
        :auto-size="{ minRows: 5, maxRows: 8 }"
        class="w-[400px] pl-6"
        @blur="blur"
      />
      <UpSquareOutlined
        class="absolute left-2 top-1.2 color-[--pro-ant-color-primary-text]"
        @click="isFold = !isFold"
      />
    </template>
  </div>
</template>

<script setup lang="js">
  import { UpSquareOutlined, DownSquareOutlined } from '@ant-design/icons-vue'

  defineOptions({ name: 'SearchContentInput' })

  const props = defineProps({
    // 隐藏 展开/折叠 控件; 默认不隐藏
    hideControl: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  })
  const emits = defineEmits(['update:value', 'enter'])

  const isFold = ref(true)
  const content = ref('')

  watch(() => props.hideControl, (val) => {
    if (val) {
      isFold.value = true
    }
  })
  watch(isFold, (val) => {
    if (val) {
      // 折叠; 用逗号分隔
      content.value = content.value.trim().replaceAll('\n', ',')
    } else {
      // 展开; 用回车分隔
      content.value = content.value.trim().replaceAll(',', '\n')
    }
    blur()
  })

  function blur() {
    // 统一以逗号分隔的形式返回值
    const value = isFold.value ? content.value : content.value.replaceAll('\n', ',')
    emits('update:value', value)
  }

  // 回车键触发
  function enter() {
    blur()
    emits('enter')
  }
</script>
