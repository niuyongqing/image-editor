import { ref, nextTick, onUnmounted } from 'vue';
import { debounce } from 'lodash-es';

/**
 * 计算表格高度的公共方法
 * @param {Object} options 配置选项
 * @param {string} options.elementId 要获取高度的元素ID
 * @param {Object} options.elementRef Vue ref引用的元素
 * @param {boolean} options.isHandleResize 是否在窗口 resize 时自动计算高度，默认为 true
 * @param {number} options.offsetHeight 计算表格高度时的偏移量，默认为200
 * @param {number} options.minHeight 表格最小高度，默认为300
 * @param {number} options.defaultHeight 当无法获取元素高度时使用的默认高度，默认为150
 * @param {number} options.delay 延迟执行时间，默认为300ms
 * @param {number} options.debounceDelay 防抖延迟时间，默认为200ms
 * @returns {Object} 返回包含表格高度ref和计算方法的对象
 */
export function useTableHeight(options = {}) {
  const {
    elementId,
    elementRef,
    isHandleResize = true,
    offsetHeight = 200,
    minHeight = 300,
    defaultHeight = 150,
    delay = 300,
    debounceDelay = 300
  } = options;

  const tableHeight = ref(0);
  const loading = ref(false);

  // 缓存变量
  let lastWindowHeight = window.innerHeight;
  let lastElementHeight = 0;
  let cachedElement = null;
  let resizeHandler = null;

  /**
   * 获取元素高度
   * @returns {number} 元素高度
   */
  const getElementHeight = () => {
    let elementHeight = 0;

    // 方法1: 使用ref获取元素
    if (elementRef?.value && elementRef.value.$el) {
      elementHeight = elementRef.value.$el.offsetHeight ||
        elementRef.value.$el.clientHeight || 0;
      console.log("通过ref获取的高度:", elementHeight);
    }

    // 方法2: 如果ref不可用，尝试通过ID获取
    if (elementHeight === 0 && elementId) {
      // 使用缓存的元素引用
      if (!cachedElement) {
        cachedElement = document.getElementById(elementId);
      }

      if (cachedElement) {
        elementHeight = cachedElement.offsetHeight || cachedElement.clientHeight || 0;
      }
      console.log("通过ID获取的高度:", elementHeight);
    }

    // 方法3: 如果前两种方法都失败，使用默认高度
    if (elementHeight === 0) {
      elementHeight = defaultHeight;
    }

    return elementHeight;
  };

  /**
   * 计算表格高度
   * @param {Function} callback 可选的回调函数，在高度计算完成后执行
   * @param {boolean} force 是否强制重新计算，默认为false
   */
  const calculateTableHeight = async (callback, force = false) => {
    try {
      loading.value = true;

      // 使用 nextTick 确保DOM已更新
      await nextTick();

      // 添加延迟检查，确保在组件完全渲染后获取正确高度
      setTimeout(() => {
        try {
          const currentWindowHeight = window.innerHeight;
          const elementHeight = getElementHeight();

          // 如果窗口高度和元素高度都没有变化，且不是强制计算，则使用缓存值
          if (!force &&
            currentWindowHeight === lastWindowHeight &&
            elementHeight === lastElementHeight &&
            tableHeight.value > 0) {
            if (typeof callback === 'function') {
              callback(tableHeight.value);
            }
            loading.value = false;
            return;
          }

          // 更新缓存
          lastWindowHeight = currentWindowHeight;
          lastElementHeight = elementHeight;

          // 计算表格高度
          const calculatedHeight = currentWindowHeight - elementHeight - offsetHeight;
          tableHeight.value = Math.max(calculatedHeight, minHeight);

          // 执行回调函数（如果提供）
          if (typeof callback === 'function') {
            callback(tableHeight.value);
          }
        } catch (error) {
          // 设置默认高度作为后备方案
          tableHeight.value = Math.max(window.innerHeight - defaultHeight - offsetHeight, minHeight);
        } finally {
          // 无论成功与否，都确保关闭loading状态
          loading.value = false;
        }
      }, delay);
    } catch (error) {
      loading.value = false;
    }
  };

  // 创建防抖处理函数
  if (isHandleResize) {
    resizeHandler = debounce(calculateTableHeight, debounceDelay);
    window.addEventListener('resize', resizeHandler);
  }

  // 组件卸载时清理资源
  onUnmounted(() => {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
    }
    cachedElement = null;
  });

  return {
    tableHeight,
    loading,
    calculateTableHeight,
  };
}