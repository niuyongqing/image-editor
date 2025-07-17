<!-- 产品描述弹窗 -->
<template>
  <a-modal
    :open="open"
    title="批量修改产品描述"
    width="45%"
    @cancel="cancel"
    @ok="ok"
  >
    <a-form
      ref="form"
      :model="descForm"
      :label-col="{ style: { width: '72px' } }"
    >
      <a-form-item
        label="开头添加"
        name="padStart"
      >
        <a-textarea v-model:value="descForm.padStart" />
      </a-form-item>
      <a-form-item
        label="结尾添加"
        name="padEnd"
      >
        <a-textarea v-model:value="descForm.padEnd" />
      </a-form-item>
      <div class="flex">
        <a-form-item
          label="描述中的"
          class="flex-1"
          name="textOld"
        >
          <a-textarea v-model:value="descForm.textOld" />
        </a-form-item>
        <a-form-item
          label="替换为"
          class="flex-1"
          name="textNew"
        >
          <a-textarea v-model:value="descForm.textNew" />
        </a-form-item>
      </div>
      <a-form-item
        label="描述字母"
        name="capitalCase"
      >
        <a-checkbox v-model:checked="descForm.capitalCase">首字母大写</a-checkbox>
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
  const descForm = reactive({
    padStart: '',
    padEnd: '',
    textOld: '', // 描述中的 textOld
    textNew: '', // 替换为 textNew
    capitalCase: false // 首字母大写
  })

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      if (descForm.padStart) {
        record.detailDesc = descForm.padStart + record.detailDesc
      }
      if (descForm.padEnd) {
        record.detailDesc += descForm.padEnd
      }
      // 替换
      if (descForm.textOld && descForm.textNew) {
        record.detailDesc = record.detailDesc.replaceAll(descForm.textOld, descForm.textNew)
      }
      if (descForm.capitalCase) {
        record.detailDesc = record.detailDesc.slice(0, 1).toUpperCase() + record.detailDesc.slice(1)
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
