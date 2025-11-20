
//用户列表
export function userList(params) {
    return usePost('/xinzhan-system/user/by-dept-name', params)
}

//列表接口
export function infringementList(params) {
    return usePost('/report-aliexpress/aliexpress/config/exchangeRate/list', params)
}

//导出文件
export function exportTemplate(params) {
    return usePost('/report-aliexpress/aliexpress/config/exchangeRate/downloadTemplate', params)
}

//导出列表数据
export function exportExchangeRate(params) {
    return usePost('/report-aliexpress/aliexpress/config/exchangeRate/export', params)
}

//批量删除
export function batchDelete(params) {
    return usePost('/report-aliexpress/aliexpress/config/exchangeRate/batchDelete', params)
}
