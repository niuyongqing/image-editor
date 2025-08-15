<!-- 产品批量添加水印弹窗 -->
<template>
  <a-modal
    :open="open"
    title="批量加水印"
    :width="700"
    @cancel="cancel"
    @ok="ok"
  >
    <div class="mb-2">
      <span>选择水印模板: </span>
      <a-select v-model:value="form.templateId" class="w-65 mr-3">
        <a-select-option
          v-for="watermark in watermarkOptions"
          :key="watermark.id"
          :value="watermark.id"
        >
          <div>
            <span>{{ watermark.title }} </span>
            <a-image
              v-if="watermark.type === 1"
              :src="watermark.content"
              :width="20"
              :height="20"
              class="ml-1"
            />
            <span
              v-else
              class="ml-1"
              >({{ watermark.content }})</span
            >
          </div>
        </a-select-option>
      </a-select>
      <a-checkbox v-model:checked="form.isPrimaryImage">只在首图上加水印</a-checkbox>
    </div>
    <span><a-tag color="cyan">说明!</a-tag>批量加水印针对所有变种图添加，请谨慎操作</span>
  </a-modal>
</template>

<script setup>
  import { watermarkListApi } from '@/pages/sample/watermark/api'
  import { message } from 'ant-design-vue'

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  const form = reactive({
    templateId: '',
    isPrimaryImage: false
  })

  const watermarkOptions = ref([])
  getList()
  function getList() {
    // 没分页, 没入参
    watermarkListApi().then(res => {
      watermarkOptions.value = res.data || []
    })
  }

  function cancel() {
    form.templateId = ''
    form.isPrimaryImage = false

    emits('update:open', false)
  }

  function ok() {
    if (!form.templateId) {
      message.warning('请选择水印模版')

      return
    }
    emits('ok', form)
    cancel()
  }
</script>
