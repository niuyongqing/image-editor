import mitt from "mitt";
// bus  兄弟传参
const EventBus = mitt()

// 设置抽屉组件引用
let settingDrawerInstance = null
// 跟踪抽屉状态
let isDrawerOpen = false

// 注册抽屉组件实例
export function registerSettingDrawer(instance) {
  settingDrawerInstance = instance
}

// 获取抽屉组件实例
export function getSettingDrawerInstance() {
  return settingDrawerInstance
}

// 更新抽屉状态
export function updateDrawerState(isOpen) {
  isDrawerOpen = isOpen
}

// 全局打开设置抽屉
export function openSettingDrawer() {
  if (settingDrawerInstance && settingDrawerInstance.handleVisible) {
    settingDrawerInstance.handleVisible(true)
    isDrawerOpen = true
  }
}

// 全局关闭设置抽屉
export function closeSettingDrawer() {
  if (settingDrawerInstance && settingDrawerInstance.handleVisible) {
    settingDrawerInstance.handleVisible(false)
    isDrawerOpen = false
  }
}

// 切换设置抽屉状态
export function toggleSettingDrawer() {
  if (settingDrawerInstance && settingDrawerInstance.handleVisible) {
    isDrawerOpen = !isDrawerOpen
    settingDrawerInstance.handleVisible(isDrawerOpen)
  }
}

export default EventBus