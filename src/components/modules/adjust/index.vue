<template>
  <div class="panel-adjust">
    <div class="tool-list">

      <AdjustCrop :is-expanded="activeCollapse === 'crop'" @toggle="toggle('crop')" />

      <AdjustResize :is-expanded="activeCollapse === 'resize'" @toggle="toggle('resize')" />

      <AdjustInpaint :is-expanded="activeCollapse === 'inpaint'" @toggle="toggle('inpaint')" />

      <AdjustRembg :is-expanded="activeCollapse === 'rembg'" @toggle="toggle('rembg')" />

      <AdjustRuler :is-expanded="activeCollapse === 'ruler'" @toggle="toggle('ruler')" />

      <AdjustWhite :is-expanded="activeCollapse === 'white'" @toggle="toggle('white')" />

      <AdjustColor :is-expanded="activeCollapse === 'color'" @toggle="toggle('color')" />

      <AdjustColorOverlay :is-expanded="activeCollapse === 'overlay'" @toggle="toggle('overlay')" />

      <AdjustFilters :is-expanded="activeCollapse === 'filters'" @toggle="toggle('filters')" />

      <AdjustMosaic :is-expanded="activeCollapse === 'mosaic'" @toggle="toggle('mosaic')" />

    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent, watch } from 'vue';
import { toast } from '@/utils/toast';
import { useEditorState } from '@/composables/useEditorState'; // 假设与当前文件同级，如果在 composables 请修改路径

// 异步组件引入
const AdjustCrop = defineAsyncComponent(() => import('./AdjustCrop.vue'));
const AdjustResize = defineAsyncComponent(() => import('./AdjustResize.vue'));
const AdjustInpaint = defineAsyncComponent(() => import('./AdjustInpaint.vue'));
const AdjustRembg = defineAsyncComponent(() => import('./AdjustRembg.vue'));
const AdjustWhite = defineAsyncComponent(() => import('./AdjustWhite.vue'));
const AdjustColor = defineAsyncComponent(() => import('./AdjustColor.vue'));
const AdjustFilters = defineAsyncComponent(() => import('./AdjustFilters.vue'));
const AdjustColorOverlay = defineAsyncComponent(() => import('./AdjustColorOverlay.vue'));
const AdjustMosaic = defineAsyncComponent(() => import('./AdjustMosaic.vue'));
const AdjustRuler = defineAsyncComponent(() => import('./AdjustRuler.vue'));

const activeCollapse = ref('');
// ✨ 获取全局状态
const { state } = useEditorState();

// ✨✨✨ 核心链路修复：监听路由变化 ✨✨✨
// 当 state.activeTab 变为 'ruler' 时，自动展开 'ruler' 面板
watch(
  () => state.activeTab,
  (newTab) => {
    // 这里做一个简单的白名单匹配，防止非 Adjust 面板的 Tab 干扰
    // 这里的 'ruler' 对应 template 中 toggle('ruler') 的 id
    const validTabs = ['crop', 'resize', 'inpaint', 'rembg', 'ruler', 'white', 'color', 'overlay', 'filters', 'mosaic'];
    
    if (newTab && validTabs.includes(newTab)) {
      console.log('[AdjustPanel] Auto expanding:', newTab);
      activeCollapse.value = newTab;
    }
  },
  { immediate: true }
);
const toggle = (id) => {
  activeCollapse.value = activeCollapse.value === id ? '' : id;
};

const notImplemented = () => {
  toast.info('功能开发中');
};
</script>

<style scoped>
.panel-adjust {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  box-sizing: border-box;
}
</style>