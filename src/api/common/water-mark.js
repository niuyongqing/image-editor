/** 水印相关 */
// 水印列表
export function watermarkListApi() {
  return useGet('/platform-setting/platform/setting/template/watermark/list')
}

// 添加水印
export function watermarkApi(params) {
  return usePost('/platform-setting/platform/setting/image/handle/watermark', params)
}

// 修改图片尺寸
export function scaleApi(params) {
  return usePost('/platform-setting/platform/setting/image/handle/scale', params)
}
