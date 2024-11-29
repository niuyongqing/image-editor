import {useUserStore} from '~/stores/user.js'

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && Array.isArray(value) && value.length > 0) {
    // 获取 Pinia store 实例
    const userStore = useUserStore()
    if(!userStore){
      return false
    }
    const permissions = userStore.userInfo.platformPermissions
    const permissionDatas = value
    const all_permission = "*:*:*"

    return permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })
  } else {
    return false
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && Array.isArray(value) && value.length > 0) {
    // 获取 Pinia store 实例
    const userStore = useUserStore()
    const roles = userStore.roles
    const permissionRoles = value
    const super_admin = "admin"

    return roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })
  } else {
    return false
  }
}
