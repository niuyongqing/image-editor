
//用户列表
export function userList(params) {
    return usePost('/xinzhan-system/user/by-dept-name', params)
}

//列表接口
export function infringementList(params) {
    return usePost('/finance-data/report/aliexpress/infringement/fine/list', params)
}

//店铺列表
export function dictList(params) {
    return useGet('/report-aliexpress/report/aliexpress/dict/item-list/dict_shop', params)
}
