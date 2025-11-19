export function versionList(params) {
    return usePost('/xinzhan-report-aliexpress/report/aliexpress/profit/rate/version/list', params)
}

export function userList(params) {
    return usePost('/xinzhan-system/user/by-dept-name', params)
}
