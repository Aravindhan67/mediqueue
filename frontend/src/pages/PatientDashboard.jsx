import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api/axios'
import { toast } from 'react-toastify'

const PatientDashboard = () => {
    const [stats, setStats] = useState({
        upcoming: 0,
        completed: 0,
        cancelled: 0
    })
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/appointments/patient.php')
            if (response.data.success) {
                const apps = response.data.data
                setAppointments(apps.slice(0, 5)) // Show only recent 5

                // Calculate stats
                const upcoming = apps.filter(a => a.status === 'pending').length
                const completed = apps.filter(a => a.status === 'completed').length
                const cancelled = apps.filter(a => a.status === 'cancelled').length

                setStats({ upcoming, completed, cancelled })
            }
        } catch (error) {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upcoming</h3>
                        <p className="text-4xl font-bold text-blue-600">{stats.upcoming}</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
                        <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Cancelled</h3>
                        <p className="text-4xl font-bold text-red-600">{stats.cancelled}</p>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link to="/patient/doctors">
                        <Card className="hover:shadow-lg transition cursor-pointer bg-primary-50 border-2 border-primary-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-primary-600 rounded-full p-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
                                    <p className="text-gray-600">Find and book a doctor</p>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link to="/patient/appointments">
                        <Card className="hover:shadow-lg transition cursor-pointer bg-green-50 border-2 border-green-200">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-600 rounded-full p-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">My Appointments</h3>
                                    <p className="text-gray-600">View appointment history</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Recent Appointments */}
                <Card>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Appointments</h2>

                    {loading ? (
                        <Loader />
                    ) : appointments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((appointment) => (
                                        <tr key={appointment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{appointment.doctor_name}</div>
                                                <div className="text-sm text-gray-500">{appointment.specialization}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No appointments yet. Book your first appointment!</p>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default PatientDashboard
