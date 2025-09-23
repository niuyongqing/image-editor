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
/**
 * // 查询ozon分类
 * @param {*} data
 * @returns
 */
export function categoryTree(data) {
  return request({
    url: '/platform-ozon/platform/ozon/attribute/new/category/tree',
    method: 'post',
  })
}
/**
 * // 列表查询
 * @param {*} data
 * @returns
 */
export function getList(data) {
  return request({
    url: '/platform-ozon/intelligent/product-store/list',
    method: 'post',
    data: data
  })
}