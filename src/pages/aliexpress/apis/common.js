/** 速卖通公共接口 */
// 全量产品分组
export function getAllProductGroupsApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getAllProductGroups', params)
}

// 全量运费模版
export function getAllFreightTemplateApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/getFreightTemplateList', params)
}

// 店铺账号
export function accountCacheApi(isChoice) {
  return useGet(`/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/cache${isChoice ? '?isChoice=true' : ''}`)
}