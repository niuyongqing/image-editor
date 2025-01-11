/* 财务 订单 */

// 订单列表
export function orderList(params) {
  return usePost("/platform-lazada/platform/lazada/order/list", params);
}

// 导出订单
export function orderExport(params) {
  return usePost("/platform-lazada/platform/lazada/order/export", params);
}

// 同步订单
export function sync(params) {
  return usePost("/platform-lazada/platform/lazada/order/sync", params);
}

// 店铺列表
export function shopList() {
  return useGet("/platform-lazada/platform/lazada/order/shop");
}
