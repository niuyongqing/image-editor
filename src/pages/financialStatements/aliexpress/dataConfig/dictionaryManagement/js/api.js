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
 * // 字典类型列表
 * @param {*} data
 * @returns
 */
export function typeList(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/dict/type-list',
    method: 'post',
  })
}
/**
 * // 字典列表
 * @param {*} data
 * @returns
 */
export function itemList(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/dict/item-list',
    method: 'post',
    data: data,
  })
}
/**
 * // 字典保存
 * @param {*} data
 * @returns
 */
export function itemSave(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/dict/item-save',
    method: 'post',
    data: data
  })
}
/**
 * // 字典状态更新
 * @param {*} data
 * @returns
 */
export function itemStatus(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/dict/item-status',
    method: 'post',
    data: data
  })
}
/**
 * // 字典模板下载
 * @param {*} data
 * @returns
 */
export function itemTempExport(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/dict/item-temp-export',
    method: 'post',
    data: data
  })
}
/**
 * // 字典导入
 * @param {*} data
 * @returns
 */
export function itemImport(data) {
  return request({
    url: '/report-aliexpress/report/aliexpress/dict/item-import',
    method: 'post',
    data: data,
    headers: {  
      'Content-Type': 'multipart/form-data'
    }
  })
}