<template>
  <div class="tool-group">
    <div class="tool-item" @click="handleRembg">
      <div class="left">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="margin-right: 8px"
        >
          <circle cx="6" cy="6" r="3" />
          <path d="M8.12 8.12 12 12" />
          <path d="M20 4 8.12 15.88" />
          <circle cx="6" cy="18" r="3" />
          <path d="M14.8 14.8 20 20" />
        </svg>
        <span>一键抠图</span>
      </div>

      <div class="right-icon">
        <svg
          v-if="loading"
          class="loading-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <svg
          v-else
          class="arrow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue"; // 确保引入 inject
import { aiApi } from "@/api/ai";
import { toast } from "@/utils/toast";
import { useEditorState } from "@/composables/useEditorState";

const canvasAPI = inject("canvasAPI");
const config = inject("editorConfig"); // 1. 获取全局配置
const loading = ref(false);

const { setLoading } = useEditorState();

const handleRembg = async () => {
  if (loading.value) return; // ✅ 防并发重复点击

  const activeObj = canvasAPI?.canvas.value?.getActiveObject();
  if (!activeObj || activeObj.type !== "image")
    return toast.warning("请先选中图片");

  loading.value = true;
  setLoading(true, "AI 正在抠图...");
  try {
    const src = activeObj.getSrc();

    // 调用 matting 接口（入参为 image_path）
    // 注意：如果 src 是 blob: URL，后端无法直接访问。需要你的后端支持读取/转存，或前端改走上传中转。
    // 当前实现按“接口定义”直接传地址，失败时给出明确提示。
    const newUrl = await aiApi.removeBackground(src, config?.aiBaseUrl);

    // 如果后端返回的是纯 base64，这里 aiApi 内部会转成 blobURL；
    // 如果后端返回的是 dataURL，这里会原样返回并可直接 setSrc 展示。

    canvasAPI.replaceActiveImage(newUrl);
    toast.success("抠图完成");
  } catch (e) {
    console.error(e);
    toast.error("抠图失败");
  } finally {
    loading.value = false;
    setLoading(false);
  }
};
</script>

<style scoped>
/* Loading 旋转动画 */
.loading-icon {
  animation: rotating 1s linear infinite;
  color: var(--ie-primary-color);
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 简单的 hover 动画 */
.tool-item:hover .arrow {
  transform: translateX(2px);
  transition: transform 0.2s;
}
</style>
