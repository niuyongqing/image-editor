import { uploadFile } from "~/utils/upload.js";
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

// 新增
export function addAccount(params) {
  return usePost(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/add",
    params
  );
}

// 编辑
export function editAccount(params) {
  return usePost(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/edit",
    params
  );
}

// 删除
export function delAccount(params) {
  return usePost(
    "/platform-lazada/platform/lazada/setting/account/relevance/user/del",
    params
  );
}

/**
 * ------------------------------------------------------------------------------------------------
 */
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
// 上传 简称文件
export function uploadSmallName(params) {
  return uploadFile(
    params,
    "/platform-lazada/platform/lazada/empower/import-simple"
  );
}
// 上传 仓库文件
export function uploadStore(params) {
  return uploadFile(
    params,
    "/platform-lazada/platform/lazada/empower/import-store"
  );
}
