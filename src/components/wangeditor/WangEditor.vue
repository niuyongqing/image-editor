<!--
 * @Description: 
   更多详细配置看 https://www.wangeditor.com/v5/menu-config.html#%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87
-->

<template>
    <div class="wangeditor">
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode"
            style="border-bottom: 1px solid #ccc" />
        <Editor v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
            :style="{ height: height + 'px', overflowY: 'scroll' }" @onCreated="handleCreated" />
    </div>
</template>
<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { onBeforeUnmount, ref, shallowRef, onMounted, watchEffect, unref, watch } from "vue";
const props = defineProps({
    // 工具栏配置
    toolbarConfig: {
        type: Object,
        default: () => ({
            excludeKeys: "fullScreen",
            toolbarKeys: [
                "blockquote",
                "header1",
                "header2",
                "header3",
                "bgColor",
                "clearStyle",
                "insertLink",
                // "insertImage", 
                "uploadImage",  // 图片上传解开
                // "insertTable",  
                "codeBlock",
                "todo",
                "color",
                "undo",
                "underline",
                "bold",
                "bulletedList",
                "italic",
                "fullScreen",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "numberedList",
                "redo",
                "through",
                "|"
            ],
            insertKeys: {
                index: 10,
                keys: ["fontSize", "fontFamily", "justifyJustify"]
            },

        })
    },
    editorConfig: {
        type: Object,
        default: () => ({
            placeholder: "请输入内容...",
            // 上传图片的fn 图片上传解开
            // uploadImgShowBase64: true, // 使用 base64 保存图片
            // MENU_CONF: {
            //   uploadImage: {
            //     server: 'uploadFile.url',
            //     headers: '{ Authorization: uploadFile.Authorization }',
            //     "tenant-id": "1",
            //     allowedFileTypes: ["image/png", "image/jpg", "image/jpeg"], // 文件类型限制
            //     fieldName: "file",
            //     // customInsert(res, insertFn) {
            //     //   if (res.code == 0) {
            //     //     insertFn(res.data, null, res.data);
            //     //   }
            //     // },
            //   },
            // }
        })
    },
    mode: {
        type: String,
        default: "default" // or 'simple' 默认模式/简洁模式
    },
    // 编辑器高度
    height: {
        type: Number,
        default: 300
    },
    // 禁用编辑器
    disable: {
        type: Boolean,
        default: false
    },


    // HTML 默认内容
    defaultValueHtml: {
        type: String,
        default: '',
    },

});

const editorRef = shallowRef(); // 编辑器实例(页面多编辑下,需要处理，仅适用于单编辑)
const valueHtml = defineModel();//  HTML内容
// 判断内容是否为空
const isEmptyEditor = () => {
    return editorRef.value.isEmpty();
};

// 设置编辑器内容
const setValueHtml = (acceptHtml) => {
    nextTick(() => {
        editorRef.value.setHtml(unref(acceptHtml));
    })
}

// 设置编辑器内容(非 wangEditor 生成的内容)
const setDangerousHtml = dangerousHtml => {
  editorRef.value.dangerouslyInsertHtml(dangerousHtml)
}

// 获取编辑器内容
const getValueHtml = () => {
    return editorRef.value.getHtml();
}

// 清空编辑器内容
const cleatEditorValue = () => {
    editorRef.value.clear();
}
// 禁用编辑器
const disableEditor = () => {
    editorRef.value.disable();
};
// 取消禁用编辑器
const unDisableEditor = () => {
    editorRef.value.enable();
}

defineExpose({
    isEmptyEditor,
    setValueHtml,
    setDangerousHtml,
    getValueHtml,
    cleatEditorValue,
    disableEditor,
});

watch(() => props.disable, (newValue) => {
    if (newValue) {
        disableEditor();
    } else {
        unDisableEditor()
    }
});

const handleCreated = (editor) => {
    editorRef.value = editor;
};

// 组件销毁时,销毁编辑器!
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});
</script>
<style lang="less" scoped>
.wangeditor {
    border: 1px solid #ccc;
}

:deep(.w-e-scroll) {
    text-align: left !important;
}

.w-e-text-container {
    text-align: left !important;
}

:deep(.w-e-text-placeholder) {
    text-align: left !important;
}

// 全屏样式
.w-e-full-screen-container {
  z-index: 10;
  background-color: #f0f2f5;
  padding: 0 24% !important;
}
</style>