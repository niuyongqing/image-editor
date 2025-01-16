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
