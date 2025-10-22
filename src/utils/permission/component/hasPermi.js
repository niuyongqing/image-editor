 /**
 * v-hasPermi 操作权限处理
 */

 import { useUserStore } from '~/stores/user.js'

 export default {
   mounted(el, binding) {
     const { value } = binding
     const all_permission = "*:*:*";
     const userStore = useUserStore()
     const permissions = userStore.userInfo.platformPermissions
     if (value && Array.isArray(value) && value.length > 0) {
       const permissionFlag = value

       const hasPermissions = permissions.some(permission => {
         return all_permission === permission || permissionFlag.includes(permission)
       })

       if (!hasPermissions) {
         el.parentNode && el.parentNode.removeChild(el)
       }
     } else {
       throw new Error(`请设置操作权限标签值`)
     }
   }
 }

