
//用户列表
export function userList(params) {
    return usePost('/xinzhan-system/user/by-dept-name', params)
}

//列表接口
export function infringementList(params) {
    return usePost('/report-aliexpress/aliexpress/config/exchangeRate/list', params)
}

//店铺列表
export function dictList(params) {
    return useGet('/report-aliexpress/report/aliexpress/dict/item-list/dict_shop', params)
}

//导出文件
export function exportTemplate(params) {
    return usePost('/report-aliexpress/aliexpress/config/exchangeRate/downloadTemplate', params)
}

//导出列表数据
export function exportExchangeRate(params) {
    return usePost('/report-aliexpress/aliexpress/config/exchangeRate/export', params)
}
