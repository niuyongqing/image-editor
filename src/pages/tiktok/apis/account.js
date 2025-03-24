// 获取账号列表
export function accountListApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/account/list', params)
}

// 获取平台
export function tiktokAccountApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/account/shop/list', params)
}

// 获取部门
export function userDepApi() {
  return useGet('/platform-tiktok/platform/tiktok/account/dep/list')
}

// 获取用户
export function userListApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/account/user', params)
}

// 新增
export function addAccountApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/account/add', params)
}

// 修改
export function editAccountApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/account/edit', params)
}

// 删除
export function delAccountApi(params) {
  return usePost('/platform-tiktok/platform/tiktok/account/del', params)
}
