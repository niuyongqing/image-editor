<template>
  <template v-if="item.children && item.children.length > 0 && !item.hideChildrenInMenu">
    <a-sub-menu
      :key="item.path"
    >
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template #title>
        <span>
          {{ renderTitle(item.title) }}
        </span>
      </template>
      <template v-for="menu in item.children">
        <template v-if="!menu.hideInMenu">
          <recursive-menu
            :key="menu.path"
            :item="menu"
            :link="link"
          />
        </template>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item
      :key="item.path"
    >
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template v-if="!isUrl(item.path)">
        <RouterLink v-if="link" :to="item.path">
          {{ renderTitle(item.title) }}
        </RouterLink>
        <template v-else>
          {{ renderTitle(item.title) }}
        </template>
      </template>
      <template v-else>
        <a :href="item.path" :target="item.target ?? '_blank'">
          {{ renderTitle(item.title) }}
        </a>
      </template>
    </a-menu-item>
  </template>
</template>

<script setup>
import { isFunction, isUrl } from '@v-c/utils'
import AsyncIcon from './async-icon.vue'
import { ref, computed } from 'vue'

// 定义组件属性
const props = defineProps({
  item: {
    type: Object,
    required: true
  },

  link: {
    type: Boolean,
    default: true
  }
})


// 渲染菜单标题
function renderTitle(title) {
  if (isFunction(title)) return title()
  return title
}
</script>

<style scoped lang="less">

</style>

