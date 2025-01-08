// 待发布
export function getList(params) {
  return usePost("/platform-lazada/platform/lazada/wait/product/list", params);
}

export function accountCache() {
  return useGet(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/cache"
  );
}
