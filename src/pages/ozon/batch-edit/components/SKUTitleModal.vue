<!-- SKU 标题弹窗 -->
<template>
  <a-modal
    :open="open"
    title="SKU标题高级生成"
    width="45%"
    @cancel="cancel"
    @ok="ok"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane
        key="generate"
        tab="生成SKU标题"
      >
        <a-form
          ref="generate_form"
          :model="generateForm"
          :label-col="{ style: { width: '80px' } }"
        >
          <a-form-item
            label="自定义标题"
            name="title"
          >
            <div>
              <a-input
                v-model:value="generateForm.title"
                :maxlength="255"
                show-count
              >
                <template #suffix>
                  <a-tooltip title="将每个单词首字母转为大写">
                    <span
                      class="text-blue cursor-pointer"
                      @click="capitalCaseAll"
                      >Aa</span
                    >
                  </a-tooltip>
                </template>
              </a-input>
              <div v-if="variantList.length">
                <span>标题变量: </span>
                <span
                  v-for="attr in variantList"
                  :key="attr"
                  class="text-blue ml-2 cursor-pointer"
                  @click="pushAttr(attr)"
                  >{{ attr }}</span
                >
              </div>
            </div>
          </a-form-item>
          <a-form-item
            label="标题字母"
            name="capitalCase"
          >
            <a-checkbox v-model:checked="generateForm.capitalCase">首字母大写</a-checkbox>
          </a-form-item>
          <a-form-item label="标题截取">
            <a-checkbox v-model:checked="generateForm.cutOverflow">超出255个字符时自动移除</a-checkbox>
          </a-form-item>
        </a-form>
      </a-tab-pane>

      <a-tab-pane
        key="modify"
        tab="修改SKU标题"
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
              label="标题中的"
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
          <a-form-item label="标题移除">
            <a-input v-model:value="modifyForm.textRemove"></a-input>
          </a-form-item>
          <a-form-item
            label="标题字母"
            name="capitalCase"
          >
            <a-checkbox v-model:checked="modifyForm.capitalCase">首字母大写</a-checkbox>
          </a-form-item>
          <a-form-item label="标题截取">
            <a-checkbox v-model:checked="modifyForm.cutOverflow">超出255个字符时自动移除</a-checkbox>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
  defineExpose({ submit })

  const props = defineProps({
    open: {
      type: Boolean,
      default: false
    },
    attrCountMaxLength: {
      type: Number,
      default: 0
    }
  })
  const emits = defineEmits(['update:open', 'ok'])

  /** tabs */
  const activeKey = ref('generate') // generate-生成; modify-修改;

  /** 生成 */
  const generateFormRef = useTemplateRef('generate_form')
  const generateForm = reactive({
    title: '',
    capitalCase: false, // 首字母大写
    cutOverflow: false // 超出 255 字时自动移除
  })
  // 标题变量
  const variantList = computed(() => {
    if (props.attrCountMaxLength > 0) {
      const list = []
      for (let i = 0; i < props.attrCountMaxLength; i++) {
        list.push(`变种主题${i + 1}`)
      }
      return list
    }
    return []
  })

  // 将每个单词首字母转为大写
  function capitalCaseAll() {
    generateForm.title = generateForm.title
      .split(' ')
      .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // 塞入标题变量
  function pushAttr(attr) {
    generateForm.title += `#${attr}#`
  }

  // 正则匹配变种主题
  function extractNumbers(str) {
    const regex = /#变种主题(\d+)#/g
    const numbers = []
    let match

    while ((match = regex.exec(str)) !== null) {
      // match[1] 是第一个捕获组（即数字部分）
      numbers.push(Number(match[1]))
    }

    return numbers
  }

  // 生成数据
  function generate(tableData) {
    tableData.forEach(record => {
      record.skuList.forEach(item => {
        item.SKUTitle = generateForm.title

        // 如果标题没有填内容的话, 下面的流程也就不用走了
        if (!generateForm.title) return

        const numberList = extractNumbers(generateForm.title)
        if (numberList.length) {
          // 有 #变种主题n#
          numberList.forEach(number => {
            const val = item.cookedAttrValueList[number - 1] ?? ''
            item.SKUTitle = item.SKUTitle.replace(`#变种主题${number}#`, val)
          })
        }

        if (generateForm.capitalCase) {
          item.SKUTitle = item.SKUTitle.slice(0, 1).toUpperCase() + item.SKUTitle.slice(1)
        }
        if (generateForm.cutOverflow) {
          item.SKUTitle = item.SKUTitle.slice(0, 255)
        }
      })
    })
  }

  /** 修改 */
  const modifyFormRef = useTemplateRef('modify_form')
  const modifyForm = reactive({
    padStart: '',
    padEnd: '',
    textOld: '', // 标题中的 textOld
    textNew: '', // 替换为 textNew
    textRemove: '',
    capitalCase: false, // 首字母大写
    cutOverflow: false // 超出 255 字时自动移除
  })

  // 修改数据
  function modify(tableData) {
    tableData.forEach(record => {
      record.skuList.forEach(item => {
        if (modifyForm.padStart) {
          item.SKUTitle = modifyForm.padStart + item.SKUTitle
        }
        if (modifyForm.padEnd) {
          item.SKUTitle += modifyForm.padEnd
        }
        // 替换
        if (modifyForm.textOld && modifyForm.textNew) {
          item.SKUTitle = item.SKUTitle.replaceAll(modifyForm.textOld, modifyForm.textNew)
        }
        if (modifyForm.textRemove) {
          item.SKUTitle = item.SKUTitle.replaceAll(modifyForm.textRemove, '')
        }
        if (modifyForm.capitalCase) {
          item.SKUTitle = item.SKUTitle.slice(0, 1).toUpperCase() + item.SKUTitle.slice(1)
        }
        if (modifyForm.cutOverflow) {
          item.SKUTitle = item.SKUTitle.slice(0, 255)
        }
      })
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
