// 多件多折列表
export function lazadaFlexicomboList(params) {
  return usePost("/platform-lazada/platform/lazada/flexi-combo/list", params);
}

// 多件多折 获取自己权限下的店铺列表 默认是第一个店铺
export function lazadaSellerVoucherUserAccount() {
  return useGet(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/cache"
  );
}

// 新增常规优惠券
export function addLazadaFlexicomboProduct(params) {
  return usePost("/platform-lazada/platform/lazada/flexi-combo/create", params);
}

// 可选择的商品列表
export function lazadaProductList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/product/voucher/select/product/list",
    params
  );
}

// 同步选中的优惠券
export function syncLazadaVoucher(params) {
  return usePost(
    "/platform-lazada/platform/lazada/seller/voucher/selected/sync",
    params
  );
}

// 同步店铺优惠券
export function syncLazadaShopFlexiVoucher(params) {
  return usePost(
    "/platform-lazada/platform/lazada/flexi-combo/one/seller/sync",
    params
  );
}

// 新增新增优惠券 部分商品上传 往优惠券里面添加商品
export function addLazadaProductVoucherFlexicombo(params) {
  return usePost(
    "/platform-lazada/platform/lazada/flexi-combo/add/products",
    params
  );
}

// 激活优惠活动
export function flexiComboActivateVoucher(params) {
  return usePost(
    "/platform-lazada/platform/lazada/flexi-combo/activate",
    params
  );
}

// 暂停优惠活动
export function flexiComboDeactivateVoucher(params) {
  return usePost(
    "/platform-lazada/platform/lazada/flexi-combo/deactivate",
    params
  );
}

// 编辑优惠活动 （基本信息）
export function updateLazadaProduct(params) {
  return usePost(
    "/platform-lazada/platform/lazada/seller/voucher/update",
    params
  );
}

// 优惠券中的商品列表
export function selectedProductList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/seller/voucher/product/list",
    params
  );
}

// 优惠活动赠品列表
export function giftList(params) {
  return usePost(
    "/platform-lazada/platform/lazada/flexi-combo/gift/list",
    params
  );
}
export function accountCache() {
  return useGet(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/cache"
  );
}
