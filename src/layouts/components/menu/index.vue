<script setup>
import {message} from "ant-design-vue";
import {editCommonUseMenu} from "~/api/common/menu.js";
import AsyncIcon from "~/layouts/components/menu/async-icon.vue";
import { useLayoutState } from '../../basic-layout/context.js'
import { useRoute, useRouter } from 'vue-router';
import { isFunction } from '@v-c/utils'
import { ref, reactive, computed } from 'vue';
const { theme, collapsed, layout, isMobile, selectedMenus, selectedKeys, openKeys, handleOpenKeys, handleSelectedKeys, handleMenuSelect } = useLayoutState()
const open2 = ref(false);
const menuTheme = computed(() => {
  if (theme.value === 'inverted')
    return 'dark'
  return theme.value
})

const placement = ref('left');
const open = ref(false);
const data = ref({});
const hoverStates = reactive({}); // 保存每个菜单项的悬停状态
const isHovered = ref(false);
const settingMenu = ref(false);
const isChildren = ref(false);
const router = useRouter()
const route = useRoute()
const showMenu = ref(true)

const showDrawer = (item) => {
  open.value = true;
  data.value = item;
};

const onClose = () => {
  open.value = false;

  // 重置所有菜单项的悬停状态
  Object.keys(hoverStates).forEach(key => {
    hoverStates[key] = false;
  });
};


function renderTitle(title) {
  if (isFunction(title))
    return title()
  return title
}

function startSettingMenu() {
  open2.value = true
  settingMenu.value = !settingMenu.value
}

/**
 * 定住
 */
function commonUseFixed(item){
  commonUseFunc(item.commonUse === 1? 0:1,item)
}

/**
 * 取消定住
 */
function commonUse(item){
  commonUseFunc(0,item)
}

function commonUseFunc(type,item){
  editCommonUseMenu({commonUse:type,menuId:item.id}).then((res)=>{
    if(res.code === 200){
      data.value.children.filter((v)=> v.id === item.id).map((v)=> v.commonUse = type)
      message.success(res.msg)
    }else{
      message.error(res.msg)
    }
  })
}

// 点击菜单跳转
function selectMenu(item) {
  router.push({path: item.path,name: item.name})
  onClose()
}

onMounted(() => {
  // 监听全局点击事件
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  // 移除全局点击事件监听器
  document.removeEventListener('click', handleOutsideClick);
});

const handleOutsideClick = (event) => {
  const drawerElement = document.querySelector('.ant-drawer-content-wrapper');
  const menuElement = document.querySelector('.ant-pro-sider-menu');
  const antDrawerWrapperBody = document.querySelector('.ant-drawer-wrapper-body');
  const showMenu = document.querySelector(".anticon-left-circle")
  const showMenu2 = document.querySelector(".anticon-right-circle")
  // 如果点击的不是抽屉或菜单内部元素，并且抽屉是打开的，则关闭抽屉
  if (open.value
      &&
      (!drawerElement || !drawerElement.contains(event.target))
      &&
      (!menuElement || !menuElement.contains(event.target))
      &&
      (!antDrawerWrapperBody || !antDrawerWrapperBody.contains(event.target))
      &&
      (!showMenu  || !showMenu.contains(event.target))
      &&
      (!showMenu2  || !showMenu2.contains(event.target)))
  {
    onClose();
    data.value = {}
  }
};

function mouseEnter(item) {
  // 重置所有菜单项的悬停状态
  Object.keys(hoverStates).forEach(key => {
    hoverStates[key] = false;
  });

  // 设置当前菜单项为悬停状态
  hoverStates[item.title] = true;

  showDrawer(item)
}
const showMenu2 = ref(false)
function showMenuFunc() {
  showMenu.value = !showMenu.value;

  setTimeout(()=>{
    showMenu2.value = !showMenu2.value
  },200)


}
</script>

<style scoped lang="less">
.menu {
  width: 48px;
  height: auto;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  color: #ffffff;
  margin: 0 auto; /*居中*/
  transition: background-color 0.3s;
}
.menu.hovered {
  background-color: #1677FF;
}
.setting{
  color: rgba(12, 12, 12, 0.87);
}

.setting.hovered{
  color: #1677FF;
}
.sub-menu{
  font-size: 15px;
}
.sub-menu:hover{
  color: #1677FF;
  background-color: #f3f2f2;
  border-radius: 8px;
}

</style>

<template>
<!--  todo 菜单-->
  <div style="display: flex">
    <a-menu
        :selected-keys="selectedKeys"
        :open-keys="collapsed ? [] : openKeys"
        :mode="(layout === 'top' && !isMobile) ? 'horizontal' : 'inline'"
        :theme="menuTheme"
        :collapsed="collapsed"
        class="ant-pro-sider-menu"
        @update:open-keys="handleOpenKeys"
        @update:selected-keys="handleSelectedKeys"
        @select="handleMenuSelect"
    >
      <template v-for="item in selectedMenus">
          <div v-if="!item.hideInMenu">
            <div :class="['menu', { hovered: data.id? item.id === data.id:false }]" @mouseenter="() => mouseEnter(item)">
              <AsyncIcon :icon="item.icon" style="height: 45px;display: flex;justify-content: center;align-items: center;" size="20px"/>
              <div style="width: 100%;height: 20px;display: flex;align-items: flex-start;justify-content: center;">{{ renderTitle(item.title) }}</div>
            </div>
          </div>
      </template>
    </a-menu>
    <a-drawer style="margin-left: 50px;" :width="!showMenu?513:213" :body-style="{ padding: '0px', }" :closable="false"   :placement="placement" :open="open" :mask="false" :style="{ backgroundColor: !showMenu?'#f4f4f6':'rgba(244,244,246,0)' }"  @close="onClose" >
      <div style="display: flex;height: 100vh;overflow: hidden">
        <div>
          <a-card title="常用" style="height: 100%;width: 200px;position: relative">
            <template #extra>
              <AsyncIcon  type="text" icon="SettingOutlined" style="cursor: pointer" :class="['setting', { hovered: isHovered }]"  @mouseover="isHovered = true" @mouseleave="isHovered = false" size="15px" @click="startSettingMenu" />
            </template>
            <div v-for="(item,index) in data.children" :key="index">
              <div  v-if="item.commonUse !== 0 && !item.hideInMenu"   style="cursor: pointer;width: 100%;height: 35px;line-height: 35px;padding: 0 10px" :class="['sub-menu', { hovered: isChildren }]" @mouseover="isChildren = true" @mouseleave="isChildren = false"  :key="item.id" @click.stop="selectMenu(item)">
                <div style="display: flex;align-items: center;justify-content: space-between" :id="item.id">
                  <div style="display: flex;align-items: center;">
                    <div><AsyncIcon :icon="item.icon" size="15px"/></div>
                    <div style="margin-left: 10px">{{item.name}}</div>
                  </div>
                  <div><AsyncIcon v-if="settingMenu"  @click.stop="commonUse(item)" :style="{color: '#1677FF'}"  id="commonUse" icon="PushpinOutlined" size="15px" style="text-align: right;transform:rotate(-40deg)"/></div>
                </div>
              </div>
            </div>
            <div style="margin-top: 50%;margin-bottom: 50%;display: flex;justify-content: center;position: absolute;top: 40%;right: -12px" >
              <AsyncIcon icon="LeftCircleTwoTone" v-show="!showMenu" @click="showMenuFunc" size="25px" id="showMenu"/>
              <AsyncIcon icon="RightCircleTwoTone" v-show="showMenu" @click="showMenuFunc" size="25px" id="showMenu2"/>
            </div>
          </a-card>
        </div>

        <div v-if="showMenu2">
        <a-card style="width: 300px;height: 100vh;left: 16px">
          <div v-for="(item,index) in data.children" :key="index">
            <div  v-if="!item.hideInMenu"  style="cursor: pointer;width: 100%;height: 35px;line-height: 35px;padding: 0 10px" :class="['sub-menu', { hovered: isChildren }]" @mouseover="isChildren = true" @mouseleave="isChildren = false"  :key="item.id" @click.stop="selectMenu(item)">
              <div style="display: flex;align-items: center;justify-content: space-between" :id="item.id">
                <div style="display: flex;align-items: center;">
                  <div><AsyncIcon :icon="item.icon" size="15px"/></div>
                  <div style="margin-left: 10px">{{item.name}}</div>
                </div>
                <div><AsyncIcon   @click.stop="commonUseFixed(item)" :style="{color: item.commonUse !== 0?'#1677FF':'#a7a7a8'}"  id="commonUse" icon="PushpinOutlined" size="15px" style="text-align: right;transform:rotate(-40deg)"/></div>
              </div>
            </div>
          </div>
        </a-card>
        </div>

      </div>
    </a-drawer>

  </div>
</template>
