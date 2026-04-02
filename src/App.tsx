import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing          from '@/pages/Landing'
import Signup           from '@/pages/Signup'
import CourseRep        from '@/pages/CourseRep'
import SurveyWizard     from '@/pages/SurveyWizard'
import TakeSurveys      from '@/pages/TakeSurveys'
import AdminLogin       from '@/pages/admin/Login'
import AdminDashboard   from '@/pages/admin/Dashboard'
import AdminSurveys     from '@/pages/admin/Surveys'
import SurveyBuilder    from '@/pages/admin/SurveyBuilder'
import SurveyResponses  from '@/pages/admin/SurveyResponses'

function PrivateAdminRoute({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('admin_token')
    ? <>{children}</>
    : <Navigate to="/admin" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"          element={<Landing />}      />
        <Route path="/join"      element={<Signup />}       />
        <Route path="/course-rep" element={<CourseRep />}   />
        <Route path="/surveys"   element={<TakeSurveys />}  />
        <Route path="/s/:slug"   element={<SurveyWizard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>
        } />
        <Route path="/admin/surveys" element={
          <PrivateAdminRoute><AdminSurveys /></PrivateAdminRoute>
        } />
        <Route path="/admin/surveys/:id/edit" element={
          <PrivateAdminRoute><SurveyBuilder /></PrivateAdminRoute>
        } />
        <Route path="/admin/surveys/:id/responses" element={
          <PrivateAdminRoute><SurveyResponses /></PrivateAdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
