import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api/axios'
import { toast } from 'react-toastify'

const DoctorDashboard = () => {
    const [stats, setStats] = useState({
        today: 0,
        upcoming: 0,
        completed: 0
    })
    const [todayAppointments, setTodayAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/appointments/doctor.php')
            if (response.data.success) {
                const apps = response.data.data

                const today = new Date().toISOString().split('T')[0]
                const todayApps = apps.filter(a => a.date === today)
                const completed = apps.filter(a => a.status === 'completed').length
                const upcoming = apps.filter(a => a.status === 'pending').length

                setStats({ today: todayApps.length, upcoming, completed })
                setTodayAppointments(todayApps)
            }
        } catch (error) {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (appointmentId, status) => {
        try {
            const response = await api.post('/appointments/update-status.php', {
                appointment_id: appointmentId,
                status
            })

            if (response.data.success) {
                toast.success('Status updated successfully')
                fetchDashboardData()
            }
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Appointments</h3>
                        <p className="text-4xl font-bold text-blue-600">{stats.today}</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming</h3>
                        <p className="text-4xl font-bold text-yellow-600">{stats.upcoming}</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
                        <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
                    </Card>
                </div>

                {/* Today's Appointments */}
                <Card>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Today's Appointments</h2>

                    {loading ? (
                        <Loader />
                    ) : todayAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {todayAppointments.map((appointment) => (
                                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div className="flex-grow">
                                            <div className="flex items-center mb-2">
                                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                                    <span className="text-lg font-bold text-primary-600">
                                                        {appointment.patient_name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">{appointment.patient_name}</h3>
                                                    <p className="text-sm text-gray-600">{appointment.patient_email}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                                <div>
                                                    <span className="text-sm text-gray-600 block">Time</span>
                                                    <span className="font-semibold text-gray-900">{appointment.time}</span>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-600 block">Patient Age</span>
                                                    <span className="font-semibold text-gray-900">{appointment.patient_age || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-600 block">Status</span>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {appointment.status === 'pending' && (
                                            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium"
                                                >
                                                    Mark Completed
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default DoctorDashboard
