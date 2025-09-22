import { get } from 'lodash-es'
  import router from '@/router'

export function getQueryParam(param, defaultVal = '') {
  const query = router.currentRoute.value?.query ?? {}
  const val = get(query, param) ?? defaultVal
  return decodeURIComponent(val)
}

export function sortBySortKey(routes) {
  // 如果 routes 不为空或未定义
  if (Array.isArray(routes)) {
    // 对当前层级根据 sort 键进行升序排序
    routes.sort((a, b) => a.sort - b.sort);

    // 对每个元素的 children 继续排序
    for (const route of routes) {
      if (route.children) {
        sortBySortKey(route.children);
      }
    }
  }
}

/**
 * 字符串加密函数
 * @param {string} str 需要加密的字符串
 * @returns {string} 加密后的字符串
 */
export function encryptString(str) {
  if (!str) return '';
  try {
    // 先进行 base64 编码
    let encoded = btoa(unescape(encodeURIComponent(str)));
    // 添加简单的混淆
    let obfuscated = '';
    for (let i = 0; i < encoded.length; i++) {
      obfuscated += String.fromCharCode(encoded.charCodeAt(i) + 1);
    }
    // 添加时间戳后缀，增加随机性
    const timestamp = Date.now();
    return obfuscated + '|' + timestamp;
  } catch (error) {
    console.error('加密失败:', error);
    return str;
  }
}

/**
 * 字符串解密函数
 * @param {string} str 需要解密的字符串
 * @returns {string} 解密后的字符串
 */
export function decryptString(str) {
  if (!str) return '';
  try {
    // 分离混淆字符串和时间戳
    const parts = str.split('|');
    if (parts.length !== 2) return str;
    
    let obfuscated = parts[0];
    // 还原混淆
    let encoded = '';
    for (let i = 0; i < obfuscated.length; i++) {
      encoded += String.fromCharCode(obfuscated.charCodeAt(i) - 1);
    }
    // 解码 base64
    return decodeURIComponent(escape(atob(encoded)));
  } catch (error) {
    console.error('解密失败:', error);
    return str;
  }
}
