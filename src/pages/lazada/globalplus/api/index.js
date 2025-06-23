export function GlobalpPlusList(params) {
  return usePost("/platform-lazada/platform/lazada/gp/product/page", params);
}
export function getNoFeePriceApi(params) {
  return usePost(
    "platform-lazada/platform/lazada/gp/product/getNoFeePrice",
    params
  );
}
//升级
export function productUpgrade(params) {
  return usePost(
    `/platform-lazada/platform/lazada/gp/product/product/upgrade`,
    params
  );
}

//导出可以升级的商品Excel
export function exportExcelGP(params) {
  return usePost(
    `/platform-lazada/platform/lazada/gp/product/exportExcel`,
    params
  );
}
//上传excel 日志表格
export function GPPage(params) {
  return usePost(`/platform-lazada/lazada/task/page`, params);
}
//上传excel 日志表格 详情
export function logGPPage(params) {
  return usePost(`/platform-lazada/platform/lazada/log/page`, params);
}
//上传excel 日志表格 详情
export function syncProductGPPropress(data) {
  return useGet(`/platform-lazada/progress/redis/progress/${data}`);
}

//同步指定店铺的可升级GP的商品数据
export function syncProductGP(shortCode, type) {
  return useGet(
    `/platform-lazada/platform/lazada/gp/product/syncProduct/${shortCode}/${type}`
  );
}

