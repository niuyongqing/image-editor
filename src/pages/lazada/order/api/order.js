
import request from '@/utils/request'

// 同步订单
export function asyncOrder(data) {
    return request({
        url: '/platform-amazon/platform/amazon/order/sync/market/order',
        method: 'post',
        data: data,
    })
}

// 查询店铺
export function queryShop(data) {
    return request({
        url: '/platform-amazon/platform/amazon/order/query/shop',
        method: 'post',
        data: data,
    })
}

// 通过店铺查站点
export function queryAreaName(data) {
    return request({
        url: '/platform-amazon/platform/amazon/order/query/area_name',
        method: 'post',
        data: data,
    })
}

// 查询订单
export function orderList(data) {
    return request({
        url: '/platform-amazon/platform/amazon/order/market/order/list',
        method: 'post',
        data: data,
    })
}

// 查询订单
export function historyOrderList(data) {
    return request({
        url: '/platform-amazon/platform/amazon/order/market/history/order/list',
        method: 'post',
        data: data,
    })
}

// 订单导出
export function orderExport(data) {
    return request({
        url: '/platform-amazon/platform/amazon/order/market/order/export',
        method: 'post',
        data: data,
    })
}
