<!-- 改造过的 wangEditor, 速卖通用 -->
<template>
  <div class="wangeditor">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="valueHtml"
      :default-config="editorConfig"
      :mode="mode"
      :style="{ height: height + 'px' }"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { Boot } from '@wangeditor/editor'

  class MyButtonMenu {
    constructor() {
      this.title = '批量修改图片尺寸'
      this.tag = 'button'
    }

    // 获取菜单执行时的 value, 用不到则返回空字符串或 false
    getValue(editor) {
      return false
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor) {
      return false
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor) {
      return false
    }

    // 点击菜单时触发的函数
    exec(editor, value) {
      editor.emit('editImageSize')
    }
  }

  const menu1Config = {
    key: 'myBtn1',
    factory() {
      return new MyButtonMenu()
    }
  }

  Boot.registerMenu(menu1Config)

  const props = defineProps({
    // 工具栏配置
    toolbarConfig: {
      type: Object,
      default: () => ({
        insertKeys: {
          index: 30,
          keys: ['myBtn1']
        }
      })
    },
    editorConfig: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: 'default' // or 'simple' 默认模式/简洁模式
    },
    // 编辑器高度
    height: {
      type: Number,
      default: 500
    },
    // 禁用编辑器
    disable: {
      type: Boolean,
      default: false
    }
  })

  const emits = defineEmits(['editImageSize'])

  const editorRef = shallowRef() // 编辑器实例(页面多编辑下,需要处理，仅适用于单编辑)
  const valueHtml = defineModel() //  HTML内容
  // 判断内容是否为空
  const isEmptyEditor = () => {
    return editorRef.value.isEmpty()
  }

  // 设置编辑器内容
  const setValueHtml = acceptHtml => {
    nextTick(() => {
      editorRef.value.setHtml(unref(acceptHtml))
    })
  }

  // 设置编辑器内容(非 wangEditor 生成的内容)
  const setDangerousHtml = dangerousHtml => {
    editorRef.value.dangerouslyInsertHtml(dangerousHtml)
  }

  // 获取编辑器内容
  const getValueHtml = () => {
    return editorRef.value.getHtml()
  }

  // 清空编辑器内容
  const cleatEditorValue = () => {
    editorRef.value.clear()
  }
  // 禁用编辑器
  const disableEditor = () => {
    editorRef.value.disable()
  }
  // 取消禁用编辑器
  const unDisableEditor = () => {
    editorRef.value.enable()
  }

  defineExpose({
    isEmptyEditor,
    setValueHtml,
    setDangerousHtml,
    getValueHtml,
    cleatEditorValue,
    disableEditor
  })

  watch(
    () => props.disable,
    newValue => {
      if (newValue) {
        disableEditor()
      } else {
        unDisableEditor()
      }
    }
  )

  const handleCreated = editor => {
    editorRef.value = editor
    editor.on('editImageSize', val => {
      emits('editImageSize')
    })
  }

  // 组件销毁时,销毁编辑器!
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
</script>

<style lang="less" scoped>
  .wangeditor {
    border: 1px solid #ccc;
  }

  // 全屏样式
  .w-e-full-screen-container {
    z-index: 10;
    background-color: #f0f2f5;
    padding: 0 24% !important;
  }
</style>
