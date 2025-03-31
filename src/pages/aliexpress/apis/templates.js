// 模版列表
export function templateListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/findByTemplateNameOrSellerId', params)
}

// 模版-新增
export function templateAddApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/add', params)
}

// 模版-编辑
export function templateUpdateApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/update', params)
}

// 模版-删除
export function templateDelApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/del', params)
}

// 模版-批量删除
export function templateBatchDelApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/batchDelete', params)
}

// 模版-修改状态
export function templateUpdateStateApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/template/updateTemplateState', params)
}
