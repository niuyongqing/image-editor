export function getUserInfoApi() {
  return useGet('/auth/getInfo')
}

export function uploadAvatar(data) {
  return usePost('/system/user/profile/avatar',data)
}


export function getUserListApi(data) {
  return useGet('/system/user/list',data)
}


export function changeStatusApi(data) {
  return usePut('/system/user/changeStatus',data)
}

export function delUserApi(data) {
  return useDelete(`/system/user/${data.userId}`)
}

export function getUserApi(userId) {
  return useGet(`/system/user/${userId}`)
}

export function getInfoApi() {
  return useGet(`/system/user/`)
}


export function editUserApi(data) {
  return usePut('/system/user/platform',data)
}

export function addUserApi(data) {
  return usePost('/system/user/platform',data)
}


export function deptTreeSelect() {
  return useGet('/system/user/deptTree')
}


export function updatePwd(data) {
  return usePut(`/system/user/profile/updatePwd?oldPassword=${data.oldPassword}&newPassword=${data.newPassword}`,data)
}

export function updateProfile(data) {
  return usePut(`/system/user/profile`,data)
}
