import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing        from '@/pages/Landing'
import Signup         from '@/pages/Signup'
import CourseRep      from '@/pages/CourseRep'
import AdminLogin     from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'

function PrivateAdminRoute({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('admin_token')
    ? <>{children}</>
    : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                 element={<Landing />}      />
        <Route path="/join"             element={<Signup />}       />
        <Route path="/course-rep"       element={<CourseRep />}    />
        <Route path="/admin"            element={<AdminLogin />}   />
        <Route path="/admin/dashboard"  element={
          <PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
