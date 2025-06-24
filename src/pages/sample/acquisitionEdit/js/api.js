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