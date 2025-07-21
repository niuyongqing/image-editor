<!-- 产品标题弹窗 -->
<template>
  <a-modal
    :open="open"
    title="批量修改产品标题"
    width="45%"
    @cancel="cancel"
    @ok="ok"
  >
    <a-form
      ref="form"
      :model="titleForm"
      :label-col="{ style: { width: '72px' } }"
    >
      <a-form-item
        label="开头添加"
        name="padStart"
      >
        <a-input v-model:value="titleForm.padStart" />
      </a-form-item>
      <a-form-item
        label="结尾添加"
        name="padEnd"
      >
        <a-input v-model:value="titleForm.padEnd" />
      </a-form-item>
      <div class="flex">
        <a-form-item
          label="标题中的"
          class="flex-1"
          name="textOld"
        >
          <a-input v-model:value="titleForm.textOld" />
        </a-form-item>
        <a-form-item
          label="替换为"
          class="flex-1"
          name="textNew"
        >
          <a-input v-model:value="titleForm.textNew" />
        </a-form-item>
      </div>
      <a-form-item
        label="标题字母"
        name="capitalCase"
      >
        <a-checkbox v-model:checked="titleForm.capitalCase">首字母大写</a-checkbox>
      </a-form-item>
    </a-form>
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

  const formRef = useTemplateRef('form')
  const titleForm = reactive({
    padStart: '',
    padEnd: '',
    textOld: '', // 标题中的 textOld
    textNew: '', // 替换为 textNew
    capitalCase: false // 首字母大写
  })

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      if (titleForm.padStart) {
        record.title = titleForm.padStart + record.title
      }
      if (titleForm.padEnd) {
        record.title += titleForm.padEnd
      }
      // 替换
      if (titleForm.textOld && titleForm.textNew) {
        record.title = record.title.replaceAll(titleForm.textOld, titleForm.textNew)
      }
      if (titleForm.capitalCase) {
        record.title = record.title.slice(0, 1).toUpperCase() + record.title.slice(1)
      }
    })
  }

  function cancel() {
    formRef.value.resetFields()
    emits('update:open', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }
</script>
