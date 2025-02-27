//  获取用户
export function getAccountUser(params) {
  return usePost(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/user",
    params
  );
}
//  获取部门
export function getUserDep() {
  return usePost(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/dep"
  );
}
//  获取账号列表
export function getAccountlist(params) {
  return usePost(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/list",
    params
  );
}

// 获取平台
export function lazadaAccount(params) {
  return usePost(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/lazada-account",
    params
  );
}
// 列表
export function empowerList(params) {
  return usePost("/platform-lazada/platform/lazada/empower/list", params);
}
export function simpleName(params) {
  return usePost("/platform-lazada/platform/lazada/empower/simpleName", params);
}
export function alias(params) {
  return usePost("/platform-lazada/platform/lazada/empower/alias", params);
}
export function accredit(params) {
  return usePost("/platform-lazada/platform/lazada/empower/accredit", params);
}

export function refreshAllToken(params) {
  return usePost(
    "/platform-lazada/platform/lazada/empower/refreshAllToken",
    params
  );
}
export function editStore(params) {
  return usePost("/platform-lazada/platform/lazada/empower/store", params);
}
export function exportList() {
  return usePost("/platform-lazada/platform/lazada/empower/export");
}
export function remark(params) {
  return usePost("/platform-lazada/platform/lazada/empower/remark", params);
}
export function url(params) {
  return usePost("/platform-lazada/platform/lazada/empower/url", params);
}
export function loginCheck(params) {
  return usePost(
    "/platform-lazada/platform/lazada/empower/login/power/check",
    params
  );
}

export function loginPowerVerify(params) {
  return usePost(
    "/platform-lazada/platform/lazada/empower/login/power/verify",
    params
  );
}
export function lazadaLoginView(data) {
  return usePost(
    "/platform-lazada/platform/lazada/empower/login/code/view",
    data
  );
}
export function lazadaLoginEdit(data) {
  return usePost(
    "/platform-lazada/platform/lazada/empower/login/code/edit",
    data
  );
}
// 上传修改店铺密码excel
export function uploadBatchPasswordExcel(data, headers) {
  return usePost(
    "/platform-lazada/platform/lazada/empower/login/code/batch/edit",
    data,
    {
      headers,
    }
  );
}
// 修改品类, 禁用属性, 自动刊登
export function updateShop(data) {
  return usePost("/platform-lazada/platform/lazada/empower/update/shop", data);
}
// //禁售属性
export function meansAttribute() {
  return useGet("/commodity-manage/commodity/means-public/forbid-sale");
}
export function lazadaExport(data) {
  return usePost(
    "/platform-lazada/platform/lazada/empower/login/code/template",
    data
  );
}
