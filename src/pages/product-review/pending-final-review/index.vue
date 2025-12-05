<template>
    <initialReviewPublication Source="pendingFinalReview" />
</template>
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
// 动态加载组件，实现懒加载优化
const initialReviewPublication = defineAsyncComponent(() => import("~@/pages/product-review/initial-review-publication/index.vue"));
</script>