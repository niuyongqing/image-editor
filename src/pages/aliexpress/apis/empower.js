/** 店铺授权 */
// 禁售属性
export function forbidSaleApi() {
  return useGet('/commodity-manage/commodity/means-public/forbid-sale')
}

// 列表
export function shopListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/list', params)
}

// 编辑简称
export function editSimpleNameApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/edit/simple', params)
}

// 编辑别名
export function editAliasApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/edit/alias', params)
}

// 授权
export function empowerApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/empower', params)
}

// 仓储类别
export function meansKeepGrainApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/means-keep-grain', params)
}

// 导出
export function exportApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/export', params)
}

// 备注
export function remarkApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/remark', params)
}

// 前往授权
export function shopUrlApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/url', params)
}

// 修改品类
export function editClassifyApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/edit/classify', params)
}

// 修改禁售属性
export function editForbidSaleApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/edit/forbidSale', params)
}

// 修改是否自动刊登
export function editAutoPublishApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/shop/edit/autoPublish', params)
}
