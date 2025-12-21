<template>
    <div v-if="state.isLoading" class="loading-overlay">
        <div class="loading-content">
            <div class="spinner"></div>
            <p class="loading-text">{{ state.loadingText }}</p>
        </div>
    </div>
</template>

<script setup>
import { useEditorState } from '@/composables/useEditorState';

// 直接连接全局状态
const { state } = useEditorState();
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    /* 半透明黑色背景 */
    z-index: 9999;
    /* 确保层级最高，遮挡所有操作 */
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
    /* 轻微模糊背景 */
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #ffffff;
    animation: spin 1s ease-in-out infinite;
}

.loading-text {
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>