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
 * // 获取分类树
 * @param {*} data 
 * @returns 
 */
export function getClassList(data) {
  return request({
    url: '/platform-common/platform/common/imageClass/list-tree',
    method: 'post',
    data: data
  })
}
/**
 * // 分类详情
 * @param {*} data 
 * @returns 
 */
export function detailClass(data) {
  return request({
    url: '/platform-common/platform/common/imageClass/detail/' + data,
    method: 'post',
  })
}
/**
 * // 新增分类
 * @param {*} data 
 * @returns 
 */
export function addClass(data) {
  return request({
    url: '/platform-common/platform/common/imageClass/add',
    method: 'post',
    data: data
  })
}
/**
 * // 修改分类
 * @param {*} data 
 * @returns 
 */
export function editClass(data) {
  return request({
    url: '/platform-common/platform/common/imageClass/edit',
    method: 'post',
    data: data,
  })
}
/**
 * // 删除分类
 * @param {*} data 
 * @returns 
 */
export function delClass(data) {
  return request({
    url: '/platform-common/platform/common/imageClass/del/' + data,
    method: 'post',
  })
}