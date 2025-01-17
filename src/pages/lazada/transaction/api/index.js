// 我的收入列表
export function myIncomeList(params) {
  return usePost("/platform-lazada/platform/lazada/transaction/list", params);
}

// 同步数据 (按日期同步数据)
export function myIncomeSync(params) {
  return usePost("/platform-lazada/platform/lazada/transaction/sync", params);
}

// 导出
export function myIncomeDownload(params) {
  return usePost(
    "/platform-lazada/platform/lazada/transaction/download",
    params
  );
}

// 店铺列表
export function shopList() {
  return useGet("/platform-lazada/platform/lazada/transaction/shop");
}
