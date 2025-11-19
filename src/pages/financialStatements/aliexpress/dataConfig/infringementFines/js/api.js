
export function userList(params) {
    return usePost('/xinzhan-system/user/by-dept-name', params)
}

export function infringementList(params) {
    return usePost('/finance-data/report/aliexpress/infringement/fine/list', params)
}
