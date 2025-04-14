/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate, Outlet } from 'react-router'
import { usePermission } from '~/hooks/usePermission'
import { roles } from '~/config/rbacConfig'


function RbacRoute({
  requiredPermissions,
  redirectTo='/access-denied',
  children })
{
  const user = JSON.parse(localStorage.getItem('userInfo'))
  const userRole = user?.role || roles.CLIENT
  const { hasPermission } = usePermission(userRole)

  if (!hasPermission(requiredPermissions)) {
    return <Navigate to={redirectTo} replace={true} />
  }
  return children || <Outlet />
}
export default RbacRoute