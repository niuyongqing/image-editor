<template>
  <div>
    <!-- 编辑器容器 -->
    <div ref="editorContainer" style="width: 100%; height: 700px;"></div>
    <!-- 示例操作按钮 -->
    <div style="margin-top: 20px;">
      <button @click="addText">添加文本</button>
      <button @click="applyFilter">应用滤镜</button>
      <button @click="downloadImage">下载图片</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

export default defineComponent({
  name: 'TuiImageEditorManual',
  props: {
    imageSrc: {
      type: String,
      required: true, // 接收图片路径
    },
  },
  setup(props) {
    const editorContainer = ref(null); // 用于挂载编辑器的 DOM 容器
    let editor = null; // 保存编辑器实例

    onMounted(() => {
      // 初始化 TUI Image Editor
      editor = new ImageEditor(editorContainer.value, {
        includeUI: {
          loadImage: {
            path: props.imageSrc, // 加载的图片路径
            name: 'SampleImage',
          },
          theme: {}, // 使用默认主题
          menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'], // 功能菜单
          initMenu: 'filter', // 初始化显示的菜单
          uiSize: {
            width: '1000px',
            height: '700px',
          },
          menuBarPosition: 'bottom', // 菜单栏位置
        },
        cssMaxWidth: 700,
        cssMaxHeight: 500,
        usageStatistics: false, // 关闭统计数据
      });

      console.log('TUI Image Editor 初始化完成:', editor);
    });

    const addText = () => {
      if (editor) {
        editor.addText('Hello World', {
          styles: {
            fill: '#000000',
            fontSize: 20,
          },
          position: {
            x: 100,
            y: 100,
          },
        });
      }
    };

    const applyFilter = () => {
      if (editor) {
        editor.applyFilter('grayscale'); // 应用灰度滤镜
      }
    };

    const downloadImage = () => {
      if (editor) {
        const dataURL = editor.toDataURL(); // 获取编辑后的图片数据
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'edited-image.png';
        link.click();
      }
    };

    return {
      editorContainer,
      addText,
      applyFilter,
      downloadImage,
    };
  },
});
</script>
