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