/** 店铺授权 */
// 禁售属性
export function forbidSaleApi() {
  return useGet('/commodity-manage/commodity/means-public/forbid-sale')
}

// 列表
export function shopListApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/list', params)
}

// 编辑简称
export function editApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/edit', params)
}

// 授权
export function empowerApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/empower', params)
}

// 导出
export function exportApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/export', params)
}

// 导出密码模板
export function exportCodeTemplateApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/login/code/template', params)
}

// 前往授权
export function shopUrlApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/url', params)
}

// 刷新所有授权
export function refreshTokenApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/refresh-token', params)
}

// 登录校验
export function loginCheckApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/login/power/check', params)
}

// 登录校验
export function loginVerifyApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/login/power/verify', params)
}

// 登录密码查看
export function codeViewApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/login/code/view', params)
}

// 登录密码修改
export function codeEditApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/login/code/edit', params)
}

// 上传表格批量修改简称
export function editSimpleNameBatchApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/import-simple', params, { headers: { 'Content-Type': 'multipart/form-data' } })
}

// 上传表格批量修改仓库
export function editStoreBatchApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/shop/import-store', params, { headers: { 'Content-Type': 'multipart/form-data' } })
}
