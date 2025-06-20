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
 * // 产品信息列表查询接口
 * @param {*} data 
 * @returns 
 */
export function collectProductList(data) {
  return request({
    url: '/platform-common/platform/common/collect/product/list',
    method: 'post',
    data: data
  })
}
/**
 * // 产品信息列表统计接口
 * @param {*} data 
 * @returns 
 */
export function productStatCount(data) {
  return request({
    url: '/platform-common/platform/common/collect/product/stat',
    method: 'get',
  })
}
/**
 * // 添加备注
 * @param {*} data 
 * @returns 
 */
export function addRemark(data) {
  return request({
    url: '/platform-common/remote/platform/common/collect/product/addRemark',
    method: 'post',
    data: data
  })
}
/**
 * // 删除商品
 * @param {*} data 
 * @returns 
 */
export function deleteProduct(data) {
  return request({
    url: '/platform-common/platform/common/collect/product/delete',
    method: 'post',
    data: data
  })
}