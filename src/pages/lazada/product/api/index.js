export function getList(params) {
  return usePost("/platform-lazada/platform/lazada/product/list", params);
}

export function accountCache() {
  return useGet(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/cache"
  );
}
export function categoryTree(params) {
  return usePost(
    "/platform-lazada/platform/lazada/attribute/category/tree",
    params
  );
}
