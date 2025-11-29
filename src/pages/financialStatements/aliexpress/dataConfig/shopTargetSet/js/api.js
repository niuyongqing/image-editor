import request from '@/utils/request'


/**
 * 店铺目标列表
 * @param {*} data
 * @returns
 */
export function shopTargetSetList(data) {
  return request({
    url: `/report-aliexpress/aliexpress/shop/configItem/list`,
    method: 'post',
    data
  })
}

/**
 * 新增店铺目标列表
 * @param {*} data
 * @returns
 */
export function add(data) {
  return request({
    url: `/report-aliexpress/aliexpress/shop/configItem/add`,
    method: 'post',
    data
  })
}

/**
 * 新增店铺目标
 * @param {*} data
 * @returns
 */
export function checkUnique(data) {
  return request({
    url: `/report-aliexpress/aliexpress/shop/configItem/checkUnique`,
    method: 'post',
    data
  })
}

/**
 * 编辑店铺目标详情
 * @param {*} data
 * @returns
 */
export function detail(id) {
  return request({
    url: `/report-aliexpress/aliexpress/shop/configItem/detail?id=${id}`,
    method: 'get',
  })
}

/**
 * 编辑店铺目标
 * @param {*} data
 * @returns
 */
export function updateItem(data) {
  return request({
    url: `/report-aliexpress/aliexpress/shop/configItem/update`,
    method: 'post',
    data
  })
}

/**
 * 删除店铺目标
 * @param {*} data
 * @returns
 */
export function batchDelete(data) {
  return request({
    url: `/report-aliexpress/aliexpress/shop/configItem/batchDelete`,
    method: 'post',
    data
  })
}

/**
 * 日志列表
 * @param {*} data
 * @returns
 */
export function logList(data) {
  return request({
    url: `/report-aliexpress/report/aliexpress/log/list/${data}`,
    method: 'get',
  })
}

/**
 * 下载新增运营目标模板
 * @param {*} data
 * @returns
 */
export function downloadTemplate() {
  return request({
    url: `/report-aliexpress/aliexpress/shop/configItem/downloadTemplate`,
    method: 'post',
  })
}