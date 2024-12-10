export function getEliminateListApi() {
    return useGet('/platform-setting/platform/setting/template/ps/eliminate/list')
}


export function addEliminateApi(data) {
    return usePost('/platform-setting/platform/setting/template/ps/eliminate/add',data)
}


export function delEliminateApi(data) {
    return usePost('/platform-setting/platform/setting/template/ps/eliminate/del',data)
}