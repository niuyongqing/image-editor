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
      @onFocus="isFocusedChage"
      @onBlur="isFocusedChage"
    />
    
    <!-- 图片空间 -->
    <pictureLibrary 
      :platform="props?.platform"
      v-model:modal-open="pictureLibraryModal.modalOpen"
      @imageListConfirm="imageListConfirm"
    ></pictureLibrary>
    <!-- 创建图片空间选项按钮插入到图片上传下拉框 -->
    <div id="pictureLibraryBtnRef" class="w-e-bar-item">
      <button 
        data-menu-key="uploadImage"
        @click="pictureLibraryUpolad"
        class="pictureLibrary-btn"
        :class="{'disabled': !pictureLibraryModal.btnDisabled}"
        :disabled="!pictureLibraryModal.btnDisabled"
      >
        <asyncIcon icon="FundOutlined" style="margin-right: 4px;"/>
        图片空间
      </button>
    </div>
  </div>
</template>

<script setup>
  import '@wangeditor/editor/dist/css/style.css'
  import pictureLibrary from '@/components/pictureLibrary/index.vue'
  import asyncIcon from '~@/layouts/components/menu/async-icon.vue'
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

  // 使用try-catch处理可能的菜单重复注册问题
  try {
    const menu1Config = {
      key: 'myBtn1',
      factory() {
        return new MyButtonMenu()
      }
    }
    Boot.registerMenu(menu1Config)
  } catch (error) {
    // 如果是重复注册错误，忽略它
    if (!error.message.includes('Duplicated key')) {
      console.error('注册自定义菜单失败:', error)
    }
  }

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
    },
    platform: {         // 当前平台的枚举 必传该参数
      type: String,
      default: '',     
    }
  })

  const emits = defineEmits(['editImageSize'])

  const editorRef = shallowRef() // 编辑器实例(页面多编辑下,需要处理，仅适用于单编辑)
  const valueHtml = defineModel(); //  HTML内容
  
  const pictureLibraryModal = reactive({
    modalOpen: false,
    btnDisabled: false,
  })
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
  // 判断是否失去了焦点
  function isFocusedChage(editor) {
    pictureLibraryModal.btnDisabled = editor.isFocused()
  }
  // 图片空间上传按钮点击
  function pictureLibraryUpolad() {
    pictureLibraryModal.modalOpen = !pictureLibraryModal.modalOpen
  }
  // 图片空间上传
  function imageListConfirm(val) {
    editorRef.value.focus()
    val.forEach(item => { 
      let imageHtml = `<img src="${item.src}" alt="" data-href="" style=""/>`
      // _this.$refs.webDetailRef.insertContent(imageHtml);
      editorRef.value.dangerouslyInsertHtml(imageHtml)
    })
  }

  defineExpose({
    isEmptyEditor,
    setValueHtml,
    setDangerousHtml,
    getValueHtml,
    cleatEditorValue,
    disableEditor,

    editorRef
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
    nextTick(() => {
      setPictureLibraryUpload()
    })
  }
  // 添加图片空间上传按钮
  function setPictureLibraryUpload() {
    let domList = [...document.querySelectorAll('.w-e-bar-item-menus-container')]
    let btnItem = null;
    let uploadBtn = document.getElementById('pictureLibraryBtnRef')
    let imageUpload = domList.find(item => {
      let btnList = [...item.querySelectorAll('button')]
      return btnList.some(i => {
        btnItem = i.parentNode
        return i.dataset.menuKey === 'uploadImage'
      })
    })
    btnItem.after(uploadBtn);
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
  .pictureLibrary-btn {
    display: flex; 
    align-items: center;
    &.disabled {
      cursor: no-drop;
      color: #999;
    }
  }
</style>
