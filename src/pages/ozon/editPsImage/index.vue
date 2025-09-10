<template>
  <div class="editor-container">
    <div id="editorRef" class="image-editor"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import MtImageEditor from "mt-image-editor-sdk";

// 从URL获取图片信息
const imageUrl = new URLSearchParams(window.location.search).get("imageUrl");
const imageId = new URLSearchParams(window.location.search).get("imageId");
let editorInstance = null;
let broadcastChannel = null;

// 初始化编辑器
onMounted(() => {
  try {
    // 确保DOM元素已存在
    const editorElement = document.getElementById("editorRef");
    if (!editorElement) {
      console.error("编辑器容器元素未找到");
      return;
    }
    // 初始化编辑器并保存实例
    editorInstance = MtImageEditor.init({
      moduleName: "mt-image-editor-sdk",
      appKey: "GozRIm67Cr1Sn82v2tkkGikQCG6gZTUJ", // 必填
      el: "#editorRef", // 必填
      title: "美图秀秀Web版",
      imageSrc: imageUrl || "", // 初始化指定传入图片时使用
    });

    // 从URL参数获取可能的编辑记录ID用于二次编辑
    const recordId = new URLSearchParams(window.location.search).get(
      "recordId"
    );
    if (recordId) {
      try {
        // 打开之前的编辑记录（如果有）
        MtImageEditor.openRecord(recordId);
        console.log("成功打开编辑记录:", recordId);
      } catch (error) {
        console.error("打开编辑记录失败:", error);
        // 即使打开失败，也继续使用原始图片
      }
    }
    // 设置保存回调
    setupSaveCallback();
  } catch (error) {
    console.error("美图秀秀编辑器初始化失败:", error);
  }
});

// 设置保存回调函数
function setupSaveCallback() {
  try {
    MtImageEditor.saveImage((base64, type, recordId) => {
      console.log("图片保存成功:", { base64, type, recordId, imageId });

      // 创建BroadcastChannel并发送消息
      broadcastChannel = new BroadcastChannel("mtImageEditor");
      // 发送包含编辑记录ID的完整数据，便于二次编辑
      broadcastChannel.postMessage({
        base64,
        type,
        recordId, // 重命名为更清晰的recordId
        imageId,
        timestamp: Date.now(), // 添加时间戳便于缓存控制
      });

      // 发送后关闭通道以避免内存泄漏
      setTimeout(() => {
        if (broadcastChannel) {
          broadcastChannel.close();
          broadcastChannel = null;
          window.close()
        }
      }, 1000);
    });
  } catch (error) {
    console.error("设置保存回调失败:", error);
  }
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  // 销毁编辑器实例
  if (editorInstance && typeof editorInstance.destroy === "function") {
    editorInstance.destroy();
    editorInstance = null;
  }

  // 关闭BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.close();
    broadcastChannel = null;
  }
});
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-editor {
  width: 100%;
  height: 95vh;
  border: 1px solid #eee;
  background: #fafafa;
  transition: border-color 0.3s ease;
}

.image-editor:hover {
  border-color: #1890ff;
}
</style>
