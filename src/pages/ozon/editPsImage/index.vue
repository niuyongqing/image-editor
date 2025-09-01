<template>
  <div class="editor-container">
    <div id="editorRef" class="image-editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import MtImageEditor from "mt-image-editor-sdk";


let editorInstance = null;
let imageUrl = new URLSearchParams(window.location.search).get("imageUrl");
let imageId = new URLSearchParams(window.location.search).get("imageId");

onMounted(() => {
// 初始化
  MTImageEditor.init({
    appKey: "GozRIm67Cr1Sn82v2tkkGikQCG6gZTUJ", // 必填
    el: '#editorRef', // 必填
    title: "美图秀秀Web版",
    imageSrc:imageUrl || '' // 初始化指定传入图片时使用
  });
});

// 保存回调
MTImageEditor.saveImage((base64,type,id)=>{
  console.log(base64,type,id);
  // 这里可以处理保存后的图片数据，例如上传到服务器或下载
  const channel = new BroadcastChannel("mtImageEditor")
  channel.postMessage({ base64, type, id ,imageId});//发送消息
})

// 组件卸载时销毁编辑器实例
onBeforeUnmount(() => {
  if (editorInstance && typeof editorInstance.destroy === "function") {
    editorInstance.destroy();
    editorInstance = null;
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
}
</style>