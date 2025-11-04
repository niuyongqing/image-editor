export async function getListApi(params) {
  return usePost("/list/crud-table", params);
}

export async function settingList(params) {
  return usePost("/system/system-setting/list", params);
}

export async function settingTableEdit(params) {
  return usePost("/system/system-setting/edit-table", params);
}