export function getRoleListApi(data) {
    return useGet('/system/platform/role/list',data)
}

export function getRoleByIdApi(data) {
    return useGet('/system/platform/role/id',data)
}

export function addRoleApi(data) {
    return usePost('/system/platform/role/add',data)
}

export function editRoleApi(data) {
    return usePost('/system/platform/role/edit',data)
}

export function editRoleEditUserApi(data) {
    return usePost('/system/platform/role/edit/user',data)
}


export function getRoleApi(data) {
    return useGet('/system/platform/role/menu',data)
}


export function changeStatusApi(data) {
    return usePost('/system/platform/role/changeStatus',data)
}

export function delRoleApi(data) {
    return usePost(`/system/platform/role/del`,data)
}

export function getRoleUserApi(data){
    return usePost(`/system/platform/role/user`,data)
}

export function delRoleUserApi(data){
    return usePost(`/system/platform/role/del/user`,data)
}

export function getUserListApi(data){
    return useGet(`/system/platform/role/user/list/${data}`)
}

export function getSearchRoleListApi(data) {
    return useGet(`/system/platform/role/search/list/${data}`)
}

export function copyPermission(data){
    return usePost(`/system/platform/role/copy`,data)
}