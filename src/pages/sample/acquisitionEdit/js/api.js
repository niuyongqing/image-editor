import request from '@/utils/request'
// get方法参数序列化
function getParamsFn(data) {
  let params = ''
  if (data) {
    let arr = []
    Object.keys(data).forEach(key => {
      let str = `${key}=${data[key]}`
      arr.push(str)
    })
    params = `?${arr.join('&')}`
  }
  return params
}

/**
 * // 产品信息明细查询接口
 * @param {*} data 
 * @returns 
 */
export function productDetail(data) {
  return request({
    url: '/platform-common/platform/common/collect/product/detail',
    method: 'post',
    data: data
  })
}
/**
 * // 本地视频上传
 * @param {*} data 
 * @returns 
 */
export function videoUpload(data) {
  return request({
    url: '/platform-common/platform/common/video/upload',
    method: 'post',
    data: data,
    headers: {  
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
 * // 网络视频上传
 * @param {*} data 
 * @returns 
 */
export function videoUrlUpload(data) {
  return request({
    url: '/platform-common/platform/common/video/upload-url',
    method: 'post',
    data: data,
    headers: {  
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
 * // 视频删除
 * @param {*} data 
 * @returns 
 */
export function videoDelete(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-common/platform/common/video/delete',
    method: 'delete',
    data: data,
    headers: {  
      'Content-Type': 'multipart/form-data'
    }
  })
}


/**
 * // 网络图片上传
 * @param {*} data 
 * @returns 
 */
export function imageUrlUpload(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-common/platform/common/file/uploadFromUrl' + params,
    method: 'post'
  })
}
/**
 * // 本地图片上传
 * @param {*} data 
 * @returns 
 */
export function imageUpload(data) {
  return request({
    url: '/platform-common/platform/common/file/uploadImage',
    method: 'post',
    data: data,
    headers: {  
      'Content-Type': 'multipart/form-data'
    }
  })
}
/**
 * // 图片全部导出
 * @param {*} data 
 * @returns 
 */
export function downloadAllImage(data) {
  return request({
    url: '/platform-common/platform/common/file/downloadAllImage',
    method: 'post',
    data: data,
  })
}

/**
 * // 图片base转地址
 * @param {*} data 
 * @returns 
 */
export function MtImageEBaseUrl(data) {
  return request({
    url: '/xinzhan-file/uploadBase64Img',
    method: 'post',
    data: data,
  })
}
/**
 * // 数据采集产品编辑接口
 * @param {*} data 
 * @returns 
 */
export function productUpdate(data) {
  return request({
    url: '/platform-common/platform/common/collect/product/update',
    method: 'post',
    data: data,
  })
}