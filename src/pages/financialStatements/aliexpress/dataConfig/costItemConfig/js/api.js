
//用户列表
export function userList(params) {
    return usePost('/xinzhan-system/user/by-dept-name', params)
}

//列表接口
export function costItemList(params) {
    return usePost('/report-aliexpress/aliexpress/config/costItem/list', params)
}

//详情
export function detailCostItem(id,params) {
    return useGet(`/report-aliexpress/aliexpress/config/costItem/detail?id=${id}`, params)
}

//编辑
export function editCostItem(params) {
    return usePost(`/report-aliexpress/aliexpress/config/costItem/update`, params)
}
