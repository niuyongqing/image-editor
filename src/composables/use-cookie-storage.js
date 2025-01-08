import { ref, watch } from "vue";

/**
 * 自定义 useCookieStorage，用于将数据存储到 Cookie 中
 * @param {string} key 键名
 * @param {string} defaultValue 默认值
 * @param {object} options 配置选项
 * @param {number} options.expires Cookie 有效时间（秒），默认会话结束
 * @param {string} options.path Cookie 的路径（默认 "/"）
 * @returns {Ref<string>} 响应式变量
 */
export function useCookieStorage(key, defaultValue, options = {}) {
    const cookieValue = ref(getCookie(key) || defaultValue);

    // 监听 cookieValue 的变化，并更新到 Cookie
    watch(cookieValue, (newValue) => {
        setCookie(key, newValue, options);
    });

    return cookieValue;
}

/**
 * 获取 Cookie 的值
 * @param {string} key 键名
 * @returns {string|null} 返回 Cookie 的值
 */
function getCookie(key) {
    const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * 设置 Cookie 的值
 * @param {string} key 键名
 * @param {string} value 值
 * @param {object} options 配置选项
 */
function setCookie(key, value, options = {}) {
    let cookieString = `${key}=${encodeURIComponent(value)}`;
    if (options.expires) {
        cookieString += `; max-age=${options.expires}`; // 设置有效时间
    }
    cookieString += `; path=${options.path || "/"}`; // 设置路径
    document.cookie = cookieString;
}

/**
 * 删除指定的 Cookie
 * @param {string} key 键名
 */
export function removeCookie(key) {
    document.cookie = `${key}=; max-age=0; path=/`;
}
