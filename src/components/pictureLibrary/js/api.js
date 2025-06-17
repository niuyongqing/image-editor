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
 * // 图片空间列表
 * @param {*} data 
 * @returns 
 */
export function imageSpaceList(data) {
  return request({
    url: '/platform-common/platform/common/imageSpace/list',
    method: 'post',
    data: data
  })
}
/**
 * // 本地图片上传
 * @param {*} data 
 * @returns 
 */
export function imageUpload(data) {
  return request({
    url: '/platform-common/platform/common/imageSpace/upload',
    method: 'post',
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
export function urlUpload(data) {
  return request({
    url: '/platform-common/platform/common/imageSpace/uploadFromUrl',
    method: 'post',
    data: data,
  })
}
/**
 * // 图片删除
 * @param {*} data 
 * @returns 
 */
export function deleteImage(data) {
  let params = getParamsFn(data)
  return request({
    url: '/platform-common/platform/common/imageSpace/deleteImage' + params,
    method: 'post',
  })
}