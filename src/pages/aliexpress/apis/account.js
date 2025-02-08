// 获取账号列表
export function accountListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/list', params)
}

// 获取平台
export function aliexpressAccountApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/aliexpress-account', params)
}

// 获取部门
export function userDepApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/dep', params)
}

// 获取用户
export function userListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/user', params)
}

// 新增
export function addAccountApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/add', params)
}

// 修改
export function editAccountApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/edit', params)
}

// 删除
export function delAccountApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/setting/account/relevance/user/del', params)
}
