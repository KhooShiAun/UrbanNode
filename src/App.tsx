import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ResidentLayout } from './components/layouts/ResidentLayout'
import { WorkerLayout } from './components/layouts/WorkerLayout'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
import { Styleguide } from './pages/Styleguide'
import { Home } from './pages/resident/Home'
import { MyReports } from './pages/resident/MyReports'
import { ReportNew } from './pages/resident/ReportNew'
import { ReportDetail } from './pages/resident/ReportDetail'
import { Community } from './pages/resident/Community'
import { Notifications } from './pages/resident/Notifications'
import { Profile } from './pages/resident/Profile'
import { Dashboard } from './pages/worker/Dashboard'
import { Kanban } from './pages/worker/Kanban'
import { AllReports } from './pages/worker/AllReports'
import { Uncategorised } from './pages/worker/Uncategorised'
import { WorkerNotifications } from './pages/worker/Notifications'
import { WorkerProfile } from './pages/worker/Profile'
import { TicketDetail } from './pages/worker/TicketDetail'
import FAQ from './pages/resident/FAQ'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/styleguide" element={<Styleguide />} />

      <Route
        element={
          <ProtectedRoute requiredRole="resident">
            <ResidentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/reports/new" element={<ReportNew />} />
        <Route path="/reports/:id" element={<ReportDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<FAQ />} />
      </Route>

      <Route
        element={
          <ProtectedRoute requiredRole="worker">
            <WorkerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/worker/dashboard" element={<Dashboard />} />
        <Route path="/worker/kanban" element={<Kanban />} />
        <Route path="/worker/all-reports" element={<AllReports />} />
        <Route path="/worker/uncategorised" element={<Uncategorised />} />
        <Route path="/worker/notifications" element={<WorkerNotifications />} />
        <Route path="/worker/profile" element={<WorkerProfile />} />
        <Route path="/worker/tickets/:id" element={<TicketDetail />} />
      </Route>
    </Routes>
  )
}

export default App
