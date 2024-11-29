export function getRoleMenusApi() {
  return useGet('/system/platform/router/role')
}


export function getMenusListApi(parameter) {
  return usePost("/system/platform/router/list",parameter)
}

export function addMenuApi(parameter) {
  return usePost("/system/platform/router/add",parameter)
}

export function updateMenuApi(parameter) {
  return usePost("/system/platform/router/edit",parameter)
}

export function delMenuApi(parameter) {
  return usePost("/system/platform/router/del",parameter)
}

export function selectById(parameter) {
  return usePost("/system/platform/router/selectById",parameter)
}

export function selectMenuClassify() {
  return useGet("/system/platform/router/selectMenuClassify")
}

export function addMenuClassify(parameter) {
  return usePost("/system/platform/router/addMenuClassify",parameter)
}

export function editCommonUseMenu(parameter) {
  return usePost("/system/platform/router/common/use",parameter)
}

