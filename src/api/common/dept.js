export function deptListApi(params) {
  return useGet('/system/dept/list', params)
}

export function addDept(params) {
  return usePost('/system/dept', params)
}


export function editDept(params) {
  return usePut('/system/dept', params)
}

export function deleteDept(params) {
  return useDelete(`/system/dept/${params.deptId}`, )
}