import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import DoctorList from './pages/DoctorList'
import BookAppointment from './pages/BookAppointment'
import AppointmentHistory from './pages/AppointmentHistory'
import DoctorSchedule from './pages/DoctorSchedule'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/patient/dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
                <Route path="/patient/doctors" element={<ProtectedRoute role="patient"><DoctorList /></ProtectedRoute>} />
                <Route path="/patient/book/:doctorId" element={<ProtectedRoute role="patient"><BookAppointment /></ProtectedRoute>} />
                <Route path="/patient/appointments" element={<ProtectedRoute role="patient"><AppointmentHistory /></ProtectedRoute>} />

                <Route path="/doctor/dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
                <Route path="/doctor/schedule" element={<ProtectedRoute role="doctor"><DoctorSchedule /></ProtectedRoute>} />

                <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    )
}

// Protected Route Component
function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (role && user.role !== role) {
        return <Navigate to={`/${user.role}/dashboard`} replace />
    }

    return children
}

export default App
