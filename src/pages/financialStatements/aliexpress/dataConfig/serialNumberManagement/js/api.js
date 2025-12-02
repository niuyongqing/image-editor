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
 * // 流水号列表
 * @param {*} data
 * @returns
 */
export function versionList(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/report-version/list',
    method: 'post',
    data: data,
  })
}
/**
 * // 生成流水号
 * @param {*} data
 * @returns
 */
export function generateVersion(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/report-version/generate',
    method: 'post',
    data: data,
  })
}
/**
 * // 采用流水号
 * @param {*} data
 * @returns
 */
export function acceptVersion(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/report-version/accept',
    method: 'post',
    data: data,
  })
}
/**
 * // ERP用户信息查询
 * @param {*} data
 * @returns
 */
export function userList(data) {
  return request({
    url: '/xinzhan-system/user/by-dept-name',
    method: 'post',
    data: data
  })
}