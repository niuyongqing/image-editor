 /**
 * v-hasRole 角色权限处理
 */

 import { useUserStore } from '~/stores/user.js'

 export default {
   mounted(el, binding) {
     const { value } = binding
     const super_admin = "admin";

     // 获取 Pinia store 实例
     const userStore = useUserStore()
     const roles = userStore.roles

     if (value && Array.isArray(value) && value.length > 0) {
       const roleFlag = value

       const hasRole = roles.some(role => {
         return super_admin === role || roleFlag.includes(role)
       })

       if (!hasRole) {
         el.parentNode && el.parentNode.removeChild(el)
       }
     } else {
       throw new Error(`请设置角色权限标签值`)
     }
   }
 }
