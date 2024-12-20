/** 图片、视频等媒体资源相关 */
// 获取图片银行信息, 总量/使用量
export function uploadImgFromNetApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/upload/image-url', params)
}

// 获取图片银行信息, 总量/使用量
export function videoQuotaApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/video/quota', params)
}

// 分组信息
export function listGroupApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/imageBank/listGroup', params)
}

// 图片银行列表
export function getImagePaginationApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/imageBank/getImagePagination', params)
}

// 同步图片银行列表
export function syncImagePaginationApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/imageBank/syncImagePagination', params)
}

// 视频列表
export function getVideoListApi(params) {
  return usePost('/platform-aliexpress/platform/aliexpress/file/listPage', params)
}
