import { createApp } from 'vue'
import './style.css' // 确保这里引入了我们新写的通用 CSS (包含 .ie-btn 等样式)
import App from './App.vue'
import { applyTheme } from './config/theme.js';
// 1. 创建 Vue 实例
const app = createApp(App)

// 2. 应用主题
applyTheme();

// 在 main.js 中全局注册示例
app.directive('click-outside', {
  mounted(el, binding) {
    // 将处理函数挂载到 el 实例上，方便卸载时引用
    el.clickOutsideEvent = (event) => {
      // 逻辑：如果点击的目标不是元素本身，也不是其子元素
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    // 必须移除监听，否则会导致内存泄漏
    document.removeEventListener("click", el.clickOutsideEvent);
  },
});
// 3. 挂载
app.mount('#app')