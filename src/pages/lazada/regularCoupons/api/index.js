export function accountCache() {
  return useGet(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/cache"
  );
}
export function getList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/seller/voucher/list",
    params
  );
}
