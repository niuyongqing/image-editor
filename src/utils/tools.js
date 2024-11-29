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