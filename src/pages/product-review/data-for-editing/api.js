// 资料待编辑列表(初审列表同一个接口)
export function getListApi(params) {
  return usePost('/platform-ozon/platform/ozon/commodity/list', params)
}

// 提交人列表
export function getUserListApi() {
  return useGet('/platform-ozon/platform/ozon/commodity/find/user')
}

// 添加备注(支持批量)
export function addRemarkApi(params) {
  return usePost('/platform-ozon/platform/ozon/commodity/add/remark', params)
}

// 日志列表
export function getLogListApi(params) {
  return usePost('/platform-ozon/intelligent/publish/log/list', params)
}
