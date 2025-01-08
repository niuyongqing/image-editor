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

//新增优惠活动 （基本信息）
export function addLazadaProductVoucher(data) {
  return usePost(
    `/platform-lazada/platform/lazada/seller/voucher/add/products`,
    data
  );
}

//编辑优惠活动 （基本信息）
export function updateLazadaProduct(data) {
  return usePost(
    `/platform-lazada/platform/lazada/seller/voucher/update`,
    data
  );
}

//同步店铺优惠券
export function syncLazadaShopVoucher(data) {
  return usePost(
    `/platform-lazada/platform/lazada/seller/voucher/one/seller/sync`,
    data
  );
}
//激活优惠活动
export function activateVoucher(data) {
  return usePost(
    `/platform-lazada/platform/lazada/seller/voucher/activate`,
    data
  );
}
//暂停优惠活动
export function deactivateVoucher(data) {
  return usePost(
    `/platform-lazada/platform/lazada/seller/voucher/deactivat`,
    data
  );
}
//优惠券中的商品列表
export function selectedProductList(data) {
  return usePost(
    `/platform-lazada/platform/lazada/seller/voucher/product/list`,
    data
  );
}
