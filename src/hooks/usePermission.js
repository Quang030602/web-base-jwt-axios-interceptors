import { rolePermissions } from '~/config/rbacConfig'

export const usePermission = (userRole) => {
  const hasPermission =(permission) => {
    const allowPermissions = rolePermissions[userRole] || []
    return allowPermissions.includes(permission)
  }
  return { hasPermission }
}