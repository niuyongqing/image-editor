import request from '@/utils/request'

// 获取仓库列表
export function warehouseList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/warehouse/query/warehouse/list`,
    method: 'post',
    data: data
  })
}

// 同步仓库列表
export function warehouse() {
  return request({
    url: `/platform-ozon//platform/ozon/warehouse/sync/warehouse`,
    method: 'get',
  })
}

// 仓库方式
export function deliveryList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/warehouse/query/delivery-method/list`,
    method: 'post',
    data
  })
}

// 同步仓库方式
export function syncDelivery() {
  return request({
    url: `/platform-ozon/platform/ozon/warehouse/sync/delivery-method`,
    method: 'get',
  })
}