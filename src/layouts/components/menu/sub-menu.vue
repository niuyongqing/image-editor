<script setup>
import { isFunction, isUrl } from '@v-c/utils'
import AsyncIcon from './async-icon.vue'

defineProps({
  item: { type: Object, required: true },
  link: { type: Boolean, required: false, default: true },
})
import { ref } from 'vue';
const placement = ref('left');
const open = ref(false);
const showDrawer = () => {
  open.value = true;
};
const onClose = () => {
  open.value = false;
};
function renderTitle(title) {
  if (isFunction(title))
    return title()
  return title
}
</script>
<style scoped>
.menu{
  width: 48px;
  height: auto;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  color: #ffffff;
  margin: 0 auto; /*居中*/
}
.menu:hover{
  background-color: #1677FF;
}
</style>
<template>
  <template v-if="item.children && !item.hideChildrenInMenu">
    <div class="menu" @click="open = !open">
      <AsyncIcon :icon="item.icon" style="height: 45px;display: flex;justify-content: center;align-items: center;" size="20px"/>
      <div style="width: 100%;height: 20px;display: flex;align-items: flex-start;justify-content: center">{{ renderTitle(item.title) }}</div>
    </div>
    <a-drawer :width="500" title="Basic Drawer" :placement="placement" :open="open" @close="onClose" :mask="false" style="position: absolute;left: 10%">
      <template #extra>
        <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
        <a-button type="primary" @click="onClose">Submit</a-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
    <a-sub-menu :key="item.path">
      <template v-if="item.icon" #icon>
        <AsyncIcon :icon="item.icon" />
      </template>
      <template #title>
        {{ renderTitle(item.title) }}
      </template>
      <template v-for="menu in item.children">
        <template v-if="!menu.hideInMenu">
          <template v-if="menu.children">
            <sub-menu :key="menu.path" :item="menu" />
          </template>
          <template v-else>
            <a-menu-item :key="menu.path">
              <template v-if="menu.icon" #icon>
                <AsyncIcon :icon="menu.icon" />
              </template>
              <template v-if="!isUrl(menu.path)">
                <RouterLink v-if="link" :to="menu.path">
                  {{ renderTitle(menu.title) }}
                </RouterLink>
                <template v-else>
                  {{ renderTitle(menu.title) }}
                </template>
              </template>
              <template v-else>
                <a :href="menu.path" :target="menu.target ?? '_blank'">
                  {{ renderTitle(menu.title) }}
                </a>
              </template>
            </a-menu-item>
          </template>
        </template>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="item.path">
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
