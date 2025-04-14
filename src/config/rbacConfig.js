export const roles = {
  CLIENT: 'client',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}
export const permissions = {
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_SUPPORT: 'view_support',
  VIEW_MESSAGE: 'view_message',
  VIEW_REVENUE: 'view_revenue',
  VIEW_ADMIN_TOOLS: 'view_admin_tools'
}

export const rolePermissions = {
  [roles.CLIENT]: [
    permissions.VIEW_DASHBOARD,
    permissions.VIEW_SUPPORT
  ],
  [roles.MODERATOR]: [
    permissions.VIEW_DASHBOARD,
    permissions.VIEW_SUPPORT,
    permissions.VIEW_MESSAGE
  ],
  [roles.ADMIN]: Object.values(permissions)
}