//常规优惠券  获取自己权限下的店铺列表    默认是第一个店铺
export function lazadaSellerVoucherUserAccount() {
  return useGet(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/cache"
  );
}
// 常规优惠券列表
export function getList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/seller/voucher/list",
    params
  );
}

//新增常规优惠券
export function addLazadaProduct(params) {
  return usePost("/platform-lazada/platform/lazada/seller/voucher/add", params);
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

//同步选中的优惠券
export function syncLazadaVoucherApi(data) {
  return usePost(
    `/platform-lazada/platform/lazada/seller/voucher/selected/sync`,
    data
  );
}

//同步店铺优惠券
export function syncLazadaShopVoucherApi(data) {
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
    `/platform-lazada/platform/lazada/seller/voucher/deactivate`,
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
