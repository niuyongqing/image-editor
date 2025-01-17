// 订单列表
export function financeCheckList(params) {
  return usePost("/platform-lazada/platform/lazada/finance/check/list", params);
}

// 导出
export function exportFinanceCheckList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/finance/check/export",
    params
  );
}

// 同步
export function syncFinanceCheckList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/finance/check/sync/status",
    params
  );
}

// 日志
export function logFinanceCheckList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/finance/check/operation/log/list",
    params
  );
}

// 计算
export function computeFinanceCheckList(month) {
  return usePost(
    `/platform-lazada/platform/lazada/finance/check/compute?month=${month}`
  );
}
// 上传ZIP
export function uploadZip(params, headers) {
  return usePost(
    "/platform-lazada/platform/lazada/finance/check/data/import",
    params,
    {
      headers,
    }
  );
}
// 上传费用明细表
export function uploadFeeName(params, headers) {
  return usePost(
    "/platform-lazada/platform/lazada/finance/check/import/feeName/dim",
    params,
    {
      headers,
    }
  );
}
