<script setup>
import { ParentCompConsumer } from '@/layouts/basic-layout/parent-comp-consumer'

defineOptions({
  name: 'CustomRouteView',
})
const appStore = useAppStore()
const { layoutSetting } = storeToRefs(appStore)
const multiTabStore = useMultiTab()
const { cacheList } = storeToRefs(multiTabStore)
const { getComp } = useCompConsumer()
</script>

<template>
  <div class="flex flex-col h-full">
    <ParentCompConsumer>
      <RouterView>
        <template #default="{ Component, route }">
          <Transition appear :name="layoutSetting.animationName" mode="out-in">
            <div :key="route.fullPath">
              <KeepAlive v-if="layoutSetting.keepAlive" :include="[...cacheList]">
                <component :is="getComp(Component)" />
              </KeepAlive>
              <component :is="Component" v-else />
            </div>
          </Transition>
        </template>
      </RouterView>
    </ParentCompConsumer>
  </div>
</template>
