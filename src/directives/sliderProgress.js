/**
 * v-ie-slider-progress
 *
 * 为 <input type="range"> 自动计算并写入 CSS 变量：--ie-slider-percent
 * 用于在纯 CSS 中渲染“已滑过进度条”为主题色。
 *
 * 设计要点：
 * - 不依赖组件内 computed，降低重复代码
 * - 读取 input 的 min/max/value（兼容不同范围）
 * - 在 mounted/updated/input/change 时刷新
 */

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

const calcPercent = (el) => {
  const min = Number(el.min ?? 0);
  const max = Number(el.max ?? 100);
  const val = Number(el.value ?? min);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) return 0;
  return clamp(((val - min) / (max - min)) * 100, 0, 100);
};

const apply = (el) => {
  const pct = calcPercent(el);
  el.style.setProperty('--ie-slider-percent', `${pct}%`);
};

export const sliderProgressDirective = {
  mounted(el) {
    if (!el || el.tagName !== 'INPUT' || el.type !== 'range') return;

    // 初次写入
    apply(el);

    // 绑定事件（缓存引用用于卸载）
    el.__ieSliderProgressHandler = () => apply(el);
    el.addEventListener('input', el.__ieSliderProgressHandler);
    el.addEventListener('change', el.__ieSliderProgressHandler);
  },

  updated(el) {
    // v-model 更新时同步进度
    if (!el || el.tagName !== 'INPUT' || el.type !== 'range') return;
    apply(el);
  },

  unmounted(el) {
    if (!el?.__ieSliderProgressHandler) return;
    el.removeEventListener('input', el.__ieSliderProgressHandler);
    el.removeEventListener('change', el.__ieSliderProgressHandler);
    delete el.__ieSliderProgressHandler;
  }
};

