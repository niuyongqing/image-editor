import request from '@/utils/request'

//获取店铺
export function queryShop() {
    return request({
        url: `/platform-amazon/platform/amazon/finances/query/shop`,
        method: 'post',
    })
}
// 获取店铺对应站点数据
export function queryAreaName(data) {
    return request({
        url: `/platform-amazon/platform/amazon/finances/query/area_name`,
        method: 'post',
        data
    })
}

// 获取财务数据列表
export function getFinancesList(data) {
    return request({
        url: `/platform-amazon/platform/amazon/finances/list`,
        method: 'post',
        data
    })
}

// 获取财务数据列表
export function getFinancesExport(data) {
    return request({
        url: `/platform-amazon/platform/amazon/finances/export`,
        method: 'post',
        data
    })
}