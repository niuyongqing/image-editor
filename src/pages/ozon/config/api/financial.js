import request from '@/utils/request'

// 获取财务列表
export function transactionList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/finance/transaction/list`,
    method: 'post',
    data: data
  })
}

// 同步财务数据
export function syncTransaction(data) {
  return request({
    url: `/platform-ozon/platform/ozon/finance/sync/transaction`,
    method: 'post',
    data: data
  })
}

// 导出财务数据
export function exportTransaction(data) {
  return request({
    url: `/platform-ozon/platform/ozon/finance/export/transaction`,
    method: 'post',
    data: data
  })
}


// 商品销售
export function sellList(data) {
  return request({
    url: `/platform-ozon/platform/ozon/finance/product/sell/list`,
    method: 'post',
    data: data
  })
}

// 同步商品销售数据
export function syncProductSell(data) {
  return request({
    url: `/platform-ozon/platform/ozon/finance/sync/product/sell`,
    method: 'post',
    data: data
  })
}

// 导出商品销售数据
export function exportProductSell(data) {
  return request({
    url: `/platform-ozon/platform/ozon/finance/export/product/sell`,
    method: 'post',
    data: data
  })
}