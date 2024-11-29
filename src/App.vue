<script setup>
import { useLayoutMenuProvide } from '~/components/page-container/context'
import { ConfigProvider } from 'ant-design-vue';
import { defineComponent } from 'vue';
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)
const { antd } = useI18nLocale()
const layoutMenu = useLayoutMenu()
const componentSize = 'small'; // 设置全局组件大小为 small

defineComponent({
  components: {
    AConfigProvider: ConfigProvider,
  },
});
useLayoutMenuProvide(layoutMenu, appStore)
</script>

<template>
<!-- todo 全局大小设置-->
  <a-config-provider :theme="theme" :locale="antd" :component-size="componentSize">
    <a-app class="h-full font-chinese antialiased">
      <TokenProvider>
        <RouterView />
      </TokenProvider>
    </a-app>
  </a-config-provider>
</template>
<style lang="less">
// 弹出框报错解决
.ant-modal div[aria-hidden="true"] {
  display: none !important
}
</style>