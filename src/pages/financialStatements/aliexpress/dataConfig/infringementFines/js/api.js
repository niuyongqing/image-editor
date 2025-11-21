//用户列表
export function userList(params) {
    return usePost('/xinzhan-system/user/by-dept-name', params)
}

//列表接口
export function eprList(params) {
    return usePost('/report-aliexpress/report/aliexpress/infringement/fine/list', params)
}

//导出文件
export function exportTemplate(params) {
    return useGet('/report-aliexpress/report/aliexpress/infringement/fine/download/template', params)
}

//批量删除
export function batchDelete(params) {
    return usePost('/report-aliexpress/report/aliexpress/infringement/fine/batch/del', params)
}

//导出列表数据
export function exportEprList(params) {
    return usePost('/report-aliexpress/report/aliexpress/infringement/fine/export', params)
}

//店铺列表
export function dictList(params) {
    return useGet('/report-aliexpress/report/aliexpress/dict/item-list/dict_shop', params)
}