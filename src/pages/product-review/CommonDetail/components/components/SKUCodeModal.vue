<!-- SKUCode 弹窗 -->
<template>
  <a-modal
    :open="open"
    :mask-closable="false"
    title="SKU高级生成"
    width="45%"
    @cancel="cancel"
    @ok="ok"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane
        key="generate"
        tab="生成SKU"
      >
        <p class="font-bold">生成SKU前缀</p>
        <div class="flex">
          <a-form
            ref="generate_form"
            :model="generateForm"
            :label-col="{ style: { width: '60px' } }"
            class="basis-3/4"
          >
            <a-form-item
              label="前缀"
              name="prefix"
            >
              <a-input
                v-model:value="generateForm.prefix"
                :id="open ? 'autofocus_dom' : ''"
                placeholder="示例: GX"
              />
            </a-form-item>
            <a-form-item
              label="起始值"
              name="numStart"
            >
              <a-input-number
                v-model:value="generateForm.numStart"
                :controls="false"
                :min="0"
                :max="999"
                :precision="0"
                class="w-full"
                placeholder="示例: 1"
              />
            </a-form-item>
            <a-form-item
              label="位数"
              name="minNumLength"
            >
              <a-input-number
                v-model:value="generateForm.minNumLength"
                :controls="false"
                :min="0"
                :max="99"
                :precision="0"
                class="w-full"
                placeholder="示例: 6"
              />
            </a-form-item>
            <a-form-item
              label="后缀"
              name="suffix"
            >
              <a-input
                v-model:value="generateForm.suffix"
                placeholder="示例: A"
              />
            </a-form-item>
          </a-form>

          <!-- 示例 -->
          <div class="basis-1/4 ml-20">
            <template
              v-for="(item, i) in EXAMPLE"
              :key="i"
            >
              <div>{{ item.row1 }}</div>
              <div class="ml-12">{{ item.row2 }}</div>
            </template>
          </div>
        </div>

        <p class="font-bold mt-2">拼接变种属性</p>
        <div class="flex mb-4">
          <template
            v-for="(item, i) in variantList"
            :key="i"
          >
            <div class="px-2 py-1 bg-gray-100">{{ item }}</div>
            <span
              v-if="i < variantList.length - 1"
              class="mx-1"
              >——</span
            >
          </template>
        </div>
        <a-checkbox v-model:checked="attachVariant">添加变种属性</a-checkbox>
      </a-tab-pane>

      <a-tab-pane
        key="modify"
        tab="修改SKU"
        force-render
      >
        <a-form
          ref="modify_form"
          :model="modifyForm"
          :label-col="{ style: { width: '80px' } }"
        >
          <a-form-item
            label="开头添加"
            name="padStart"
          >
            <a-input v-model:value="modifyForm.padStart" />
          </a-form-item>
          <a-form-item
            label="结尾添加"
            name="padEnd"
          >
            <a-input v-model:value="modifyForm.padEnd" />
          </a-form-item>
          <div class="flex">
            <a-form-item
              label="SKU中的"
              class="flex-1"
              name="textOld"
            >
              <a-input v-model:value="modifyForm.textOld" />
            </a-form-item>
            <a-form-item
              label="替换为"
              class="flex-1"
              name="textNew"
            >
              <a-input v-model:value="modifyForm.textNew" />
            </a-form-item>
          </div>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
  import { message } from 'ant-design-vue'

  defineExpose({ submit })

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    joinedAspectNameList: {
      type: Array,
      default: () => []
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

  /** tabs */
  const activeKey = ref('generate') // generate-生成; modify-修改;

  /** 生成 */
  // 示例数据
  const EXAMPLE = [
    { row1: '示例：  前缀=GX,起始值=1', row2: '位数=6，后缀=A' },
    { row1: '产品1：GX000001A-XL-Black', row2: 'GX000002A-XL-Red' },
    { row1: '产品2：GX000003A-XS', row2: 'GX000004A-XL' }
  ]
  const generateFormRef = useTemplateRef('generate_form')
  const generateForm = reactive({
    prefix: '',
    numStart: null,
    minNumLength: null, // (最小)位数
    suffix: ''
  })
  const attachVariant = ref(false)
  // 变种属性 list
  const variantList = computed(() => {
    if (attachVariant.value) {
      return ['SKU前缀', '变种属性1', '变种属性2', '变种属性N']
    } else {
      return ['SKU前缀']
    }
  })

  // 生成数据
  function generate(tableData) {
    if (!generateForm.prefix && !generateForm.numStart && !generateForm.suffix) {
      message.warning('前缀、起始值和后缀至少要填一个')

      return
    }

    // 提取出计算方法
    let i = 0
    if (generateForm.numStart) {
      i += generateForm.numStart
    }
    tableData.forEach(record => {
      let str = ''
      let numStr = ''
      if (generateForm.prefix) {
        str += generateForm.prefix
      }

      numStr += i
      if (generateForm.minNumLength) {
        numStr = numStr.padStart(generateForm.minNumLength, '0')
      }

      str += numStr
      if (generateForm.suffix) {
        str += generateForm.suffix
      }

      record.skuCode = str

      i++

      // 勾选添加变种属性
      if (attachVariant.value) {
        const aspectStr = props.joinedAspectNameList
          .map(joinedAspectName =>
            joinedAspectName
              .split('&')
              .map(name => record[name])
              .filter(Boolean)
              .join(',')
          )
          .join('-')

        record.skuCode += aspectStr
      }
    })
  }

  /** 修改 */
  const modifyFormRef = useTemplateRef('modify_form')
  const modifyForm = reactive({
    padStart: '',
    padEnd: '',
    textOld: '', // 中的 textOld
    textNew: '' // 替换为 textNew
  })

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      if (modifyForm.padStart) {
        record.skuCode = modifyForm.padStart + record.skuCode
      }
      if (modifyForm.padEnd) {
        record.skuCode += modifyForm.padEnd
      }
      // 替换
      if (modifyForm.textOld && modifyForm.textNew) {
        record.skuCode = record.skuCode.replaceAll(modifyForm.textOld, modifyForm.textNew)
      }
    })
  }

  /** 根据 activeKey 的值来判断走哪个方法 */
  function submit(tableData) {
    if (activeKey.value === 'generate') {
      // 生成
      generate(tableData)
    } else {
      // 修改
      modify(tableData)
    }
  }

  /** 弹窗事件 */
  function cancel() {
    activeKey.value = 'generate'
    generateFormRef.value.resetFields()
    modifyFormRef.value.resetFields()

    emits('update:open', false)
  }

  function ok() {
    emits('ok')
    cancel()
  }
</script>
