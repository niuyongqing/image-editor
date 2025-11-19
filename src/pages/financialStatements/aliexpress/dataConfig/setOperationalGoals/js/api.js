import request from '@/utils/request'

/**
 * 字典表数据
 * @param {*} dictType
 * @returns
 */
export function dictList(dictType) {
  return request({
    url: `/report-aliexpress/report/aliexpress/dict/item-list/${dictType}`,
    method: 'get',
  })
}

/**
 * 查询指定年月的流水号
 * @param {*} data
 * @returns
 */
export function versionList(data) {
  return request({
    url: `/report-aliexpress/report/aliexpress/report-version/list-by-year-month`,
    method: 'post',
    data
  })
}

/**
 * 运营目标列表
 * @param {*} data
 * @returns
 */
export function operationalGoalsList(data) {
  return request({
    url: `/report-aliexpress/aliexpress/operation/configItem/list`,
    method: 'post',
    data
  })
}

/**
 * 新增运营目标
 * @param {*} data
 * @returns
 */
export function add(data) {
  return request({
    url: `/report-aliexpress/aliexpress/operation/configItem/add`,
    method: 'post',
    data
  })
}

/**
 * 新增运营目标
 * @param {*} data
 * @returns
 */
export function checkUnique(data) {
  return request({
    url: `/report-aliexpress/aliexpress/operation/configItem/checkUnique?dataYear=${data.dataYear}&dataMonth=${data.dataMonth}&userName=${data.userName}`,
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
    url: `/report-aliexpress/aliexpress/operation/configItem/downloadTemplate`,
    method: 'get',
  })
}

/**
 * 下载新增运营目标模板
 * @param {*} data
 * @returns
 */
export function detail(id) {
  return request({
    url: `/report-aliexpress/aliexpress/operation/configItem/detail?id=${id}`,
    method: 'get',
  })
}

/**
 * 下载新增运营目标模板
 * @param {*} data
 * @returns
 */
export function updateItem(data) {
  return request({
    url: `/report-aliexpress/aliexpress/operation/configItem/update`,
    method: 'post',
    data
  })
}