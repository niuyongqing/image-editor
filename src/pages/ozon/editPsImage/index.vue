<template>
  <div class="editor-container">
    <div id="editorRef" class="image-editor"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
import MtImageEditor from "mt-image-editor-sdk";
import { decryptString } from '@/utils/tools';

// 编辑器配置常量
const EDITOR_CONFIG = {
  moduleName: "mt-image-editor-sdk",
  appKey: "GozRIm67Cr1Sn82v2tkkGikQCG6gZTUJ",
  title: "美图设计室Web版"
};

// 使用reactive管理图片信息，便于响应式更新
const imageInfo = reactive({
  url: '',
  id: '',
});

// 实例引用
let editorInstance = null;
let broadcastChannel = null;

// 解析URL参数，支持加密和解密
function parseUrlParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const encryptedData = searchParams.get("encryptedData");
  
  if (encryptedData) {
    try {
      // 解密数据
      const decryptedUrl = decryptString(encryptedData);
      // 解析解密后的URL参数
      let decryptedParams;
      // 如果解密后的URL是完整的URL格式（包含协议）
      if (decryptedUrl.startsWith('http://') || decryptedUrl.startsWith('https://')) {
        // new URL()将解密后的字符串转换为url对象，获取查询参数部分
        decryptedParams = new URLSearchParams(new URL(decryptedUrl).search);
      } else {
        // 如果解密后的URL不包含协议，直接解析查询参数部分
        // 查找URL中的查询参数开始位置
        const queryStartIndex = decryptedUrl.indexOf('?');
        if (queryStartIndex !== -1) {
          // 提取查询参数部分
          const queryString = decryptedUrl.substring(queryStartIndex + 1);
          decryptedParams = new URLSearchParams(queryString);
        } else {
          // 如果没有查询参数，创建空的URLSearchParams
          decryptedParams = new URLSearchParams();
        }
      }
      
      // 更新imageInfo对象
      updateImageInfo({
        url: decryptedParams.get("imageUrl") || '',
        id: decryptedParams.get("imageId") || '',
      });
      
      console.log('成功解析加密URL参数:', imageInfo);
    } catch (error) {
      console.error('解密URL参数失败:', error);
      // 解密失败时，尝试直接获取参数
      fallbackToDirectParams(searchParams);
    }
  } else {
    // 没有加密数据时，直接获取参数
    fallbackToDirectParams(searchParams);
  }
}

// 更新图片信息
function updateImageInfo(newInfo) {
  imageInfo.url = newInfo.url || '';
  imageInfo.id = newInfo.id || '';
}

// 直接从URL获取参数作为备选方案
function fallbackToDirectParams(searchParams) {
  updateImageInfo({
    url: searchParams.get("imageUrl") || '',
    id: searchParams.get("imageId") || '',
  });
  console.log('使用直接参数或解密失败后的备选方案:', imageInfo);
}

// 检查编辑器容器是否存在
function checkEditorContainer() {
  const editorElement = document.getElementById("editorRef");
  if (!editorElement) {
    throw new Error("编辑器容器元素未找到");
  }
  return editorElement;
}

// 初始化编辑器实例
function initializeEditor() {
  try {
    // 确保DOM元素已存在
    checkEditorContainer();
    
    // 准备编辑器配置
    const editorConfig = {
      ...EDITOR_CONFIG,
      el: "#editorRef"
    };
    
    const originalUrl = imageInfo.url;
    console.log('替换前的图片URL:', originalUrl);
    // http开头的不用替换并且确保图片URL不为空
    if (!imageInfo.url.startsWith('http') && imageInfo.url) {
        try {
          // 从开头到profile/upload/shopeeFile的内容替换为https://www.xzerp.com/file/wish/upload;
          imageInfo.url = imageInfo.url.replace(/.*\/profile\/upload\/shopeeFile/, 'https://www.xzerp.com/file/wish/upload');
        // 替换/profile/upload/开头的内容为https://www.xzerp.com/prod-api/profile/upload/
          imageInfo.url = imageInfo.url.replace(/.*\/profile\/upload/, 'https://www.xzerp.com/prod-api/profile/upload');
        } catch (error) {
          console.error('图片URL替换失败:', error);
        }
    }
    console.log('替换后的图片URL:', imageInfo.url);
    // 始终使用首次编辑模式 - 使用图片URL初始化
    editorInstance = MtImageEditor.init({
      ...editorConfig,
      imageSrc: imageInfo.url || "",
    });
    console.log('美图秀秀编辑器以链接访问模式初始化成功');
    
    return true;
  } catch (error) {
    console.error("美图秀秀编辑器初始化失败:", error);
    return false;
  }
}


// 初始化时解析参数
parseUrlParams();

// 初始化编辑器
onMounted(async () => {
  // 打印当前图片信息
  console.log('当前图片信息:', {
    imageUrl: imageInfo.url,
    imageId: imageInfo.id,
  });
  
  try {
    // 始终使用链接访问模式
    console.log('进入链接访问模式');
    
    // 初始化编辑器（始终使用图片URL初始化）
    const isInitialized = initializeEditor();
    
    if (isInitialized) {
      // 设置保存回调
      setupSaveCallback();
    }
  } catch (error) {
    console.error("编辑器初始化过程中发生未预期错误:", error);
    // 可在此处添加错误提示给用户
  }
});

// 设置保存回调函数
function setupSaveCallback() {
  try {
    MtImageEditor.saveImage((base64, type, savedRecordId) => {
      console.log("图片保存成功:", { base64, type, savedRecordId, imageId: imageInfo.id });

      // 创建BroadcastChannel并发送消息
      broadcastChannel = new BroadcastChannel("mtImageEditor");
      // 发送包含编辑记录ID的完整数据，便于二次编辑
      broadcastChannel.postMessage({
        base64,
        type,
        imageId: imageInfo.id,
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
