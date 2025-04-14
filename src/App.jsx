/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'
import NotFound from './pages/NotFound'
import RbacRoute from './components/core/RbacRoute' // Changed from rbacRoute to RbacRoute
import { permissions } from './config/rbacConfig'

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  return <Outlet />
}
const UnauthorizedRoutes = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user) {
    return <Navigate to="/dashboard" replace={true} />
  }
  return <Outlet />
}
function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate to="/login" replace={true} />
      } />
      <Route element={<UnauthorizedRoutes />}>
        <Route path='/login' element={<Login />} />

      </Route>

      <Route element={<ProtectedRoute />}>

        <Route element={<RbacRoute requiredPermissions={permissions.VIEW_DASHBOARD} />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermissions={permissions.VIEW_SUPPORT} />}>
          <Route path='/support' element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermissions={permissions.VIEW_MESSAGE} />}>
          <Route path='/message' element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermissions={permissions.VIEW_REVENUE} />}>
          <Route path='/revenue' element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermissions={permissions.VIEW_ADMIN_TOOLS} />}>
          <Route path='/admin-tools' element={<Dashboard />} />
        </Route>
        {/* <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/support' element={<Dashboard />} />
        <Route path='/message' element={<Dashboard />} />
        <Route path='/revenue' element={<Dashboard />} />
        <Route path='/admin-tools' element={<Dashboard />} /> */}
      </Route>

      <Route path='/access-denied' element={<div>access denied</div>} />
      <Route path='*' element={<NotFound/>}/>

    </Routes>
  )
}

export default App
