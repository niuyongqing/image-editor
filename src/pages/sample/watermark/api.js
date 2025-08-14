/** 水印管理 */

// 列表
export function watermarkListApi() {
  return useGet('/platform-setting/platform/setting/template/watermark/list')
}

// 详情
export function watermarkDetailApi(id) {
  return useGet(`/platform-setting/platform/setting/template/watermark/detail?id=${id}`)
}

// 新增
export function watermarkAddApi(params) {
  return usePost('/platform-setting/platform/setting/template/watermark/add', params)
}

// 编辑
export function watermarkEditApi(params) {
  return usePost('/platform-setting/platform/setting/template/watermark/edit', params)
}

// 删除
export function watermarkDelApi(id) {
  return usePost('/platform-setting/platform/setting/template/watermark/del', { id })
}