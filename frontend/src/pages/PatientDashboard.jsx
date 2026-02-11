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
        <div className="min-h-screen bg-[#F0FDF4]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link to="/patient/appointments" className="block transform transition-transform">
                        <Card className="bg-white border-b-4 border-[#16A34A] shadow-lg shadow-[#16A34A]/5 hover-lift h-full">
                            <h3 className="text-xs font-black text-[#16A34A] uppercase tracking-widest mb-2 opacity-70">Upcoming</h3>
                            <p className="text-4xl font-black text-[#111827]">{stats.upcoming}</p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#16A34A] mt-4 block">View schedule &rarr;</span>
                        </Card>
                    </Link>

                    <Link to="/patient/appointments" className="block transform transition-transform">
                        <Card className="bg-white border-b-4 border-[#86EFAC] shadow-lg shadow-[#86EFAC]/5 hover-lift h-full">
                            <h3 className="text-xs font-black text-[#16A34A] uppercase tracking-widest mb-2 opacity-70">Completed</h3>
                            <p className="text-4xl font-black text-[#111827]">{stats.completed}</p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#16A34A] mt-4 block">View history &rarr;</span>
                        </Card>
                    </Link>

                    <Link to="/patient/appointments" className="block transform transition-transform">
                        <Card className="bg-white border-b-4 border-red-400 shadow-lg shadow-red-400/5 hover-lift h-full">
                            <h3 className="text-xs font-black text-red-600 uppercase tracking-widest mb-2 opacity-70">Cancelled</h3>
                            <p className="text-4xl font-black text-[#111827]">{stats.cancelled}</p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 mt-4 block">View details &rarr;</span>
                        </Card>
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Link to="/patient/doctors">
                        <Card className="hover-lift cursor-pointer bg-white border border-[#16A34A]/10 group">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-[#16A34A] rounded-2xl p-4 shadow-lg shadow-[#16A34A]/20 group-hover:rotate-6 transition-transform">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-xl font-black text-[#111827] tracking-tight">Book Appointment</h3>
                                    <p className="text-gray-500 font-medium text-sm">Find and book a verified doctor</p>
                                </div>
                            </div>
                        </Card>
                    </Link>

                    <Link to="/patient/appointments">
                        <Card className="hover-lift cursor-pointer bg-white border border-[#16A34A]/10 group">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-[#86EFAC] rounded-2xl p-4 shadow-lg shadow-[#86EFAC]/20 group-hover:-rotate-6 transition-transform">
                                    <svg className="w-8 h-8 text-[#115e59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-xl font-black text-[#111827] tracking-tight">My Appointments</h3>
                                    <p className="text-gray-500 font-medium text-sm">Manage your medical history</p>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>

                {/* Recent Appointments */}
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-[#111827] tracking-tight">Recent Activity</h2>
                        <Link to="/patient/appointments" className="text-[10px] font-black uppercase tracking-widest text-[#16A34A] hover:text-[#15803d] border-b-2 border-transparent hover:border-[#16A34A] transition-all">
                            See All history
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader />
                        </div>
                    ) : appointments.length > 0 ? (
                        <div className="overflow-x-auto -mx-6 px-6">
                            <div className="min-w-[600px] md:min-w-full">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 rounded-lg">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Doctor</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date & Time</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {appointments.map((appointment) => (
                                            <tr key={appointment.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-[#16A34A]/10 rounded-xl flex items-center justify-center mr-3 font-black text-[#16A34A]">
                                                            {appointment.doctor_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{appointment.doctor_name}</div>
                                                            <div className="text-xs text-gray-500">{appointment.specialization}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">{appointment.date}</div>
                                                    <div className="text-xs text-primary-600 font-medium">{appointment.time}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full 
                                                        ${appointment.status === 'completed' ? 'bg-green-100 text-green-500' :
                                                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-500' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">No appointments yet. Start by booking your first visit!</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default PatientDashboard
