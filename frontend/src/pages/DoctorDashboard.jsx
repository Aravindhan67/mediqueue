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
    const [upcomingAppointments, setUpcomingAppointments] = useState([])
    const [completedAppointments, setCompletedAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('today')

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/appointments/doctor.php')
            if (response.data.success) {
                const apps = response.data.data

                const todayStr = new Date().toISOString().split('T')[0]
                const todayApps = apps.filter(a => a.date === todayStr && a.status === 'pending')
                const completedApps = apps.filter(a => a.status === 'completed' || a.status === 'cancelled')
                const upcomingApps = apps.filter(a => a.date > todayStr && a.status === 'pending')

                setStats({
                    today: todayApps.length,
                    upcoming: upcomingApps.length,
                    completed: completedApps.length
                })
                setTodayAppointments(todayApps)
                setUpcomingAppointments(upcomingApps)
                setCompletedAppointments(completedApps)
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
        <div className="min-h-screen bg-[#F0FDF4]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white border-b-4 border-[#16A34A] shadow-lg shadow-[#16A34A]/5 hover-lift">
                        <h3 className="text-xs font-black text-[#16A34A] uppercase tracking-widest mb-2 opacity-70">Today's Appointments</h3>
                        <p className="text-4xl font-black text-[#111827]">{stats.today}</p>
                    </Card>

                    <Card className="bg-white border-b-4 border-yellow-400 shadow-lg shadow-yellow-400/5 hover-lift">
                        <h3 className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2 opacity-70">Upcoming</h3>
                        <p className="text-4xl font-black text-[#111827]">{stats.upcoming}</p>
                    </Card>

                    <Card className="bg-white border-b-4 border-[#86EFAC] shadow-lg shadow-[#86EFAC]/5 hover-lift">
                        <h3 className="text-xs font-black text-[#16A34A] uppercase tracking-widest mb-2 opacity-70">Completed</h3>
                        <p className="text-4xl font-black text-[#111827]">{stats.completed}</p>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('today')}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'today' ? 'border-b-2 border-[#16A34A] text-[#16A34A]' : 'text-gray-400 hover:text-[#111827]'}`}
                    >
                        Today ({stats.today})
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'border-b-2 border-[#16A34A] text-[#16A34A]' : 'text-gray-400 hover:text-[#111827]'}`}
                    >
                        Upcoming ({stats.upcoming})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'border-b-2 border-[#16A34A] text-[#16A34A]' : 'text-gray-400 hover:text-[#111827]'}`}
                    >
                        History ({stats.completed})
                    </button>
                </div>

                {/* Appointments List */}
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 capitalize">
                            {activeTab === 'today' ? "Today's" : activeTab} Appointments
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(activeTab === 'today' ? todayAppointments :
                                activeTab === 'upcoming' ? upcomingAppointments :
                                    completedAppointments).length > 0 ? (
                                (activeTab === 'today' ? todayAppointments :
                                    activeTab === 'upcoming' ? upcomingAppointments :
                                        completedAppointments).map((appointment) => (
                                            <div key={appointment.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-white group">
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                                    <div className="flex-grow">
                                                        <div className="flex items-center mb-4">
                                                            <div className="w-14 h-14 bg-[#16A34A]/10 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-[#16A34A] transition-colors group-hover:rotate-6">
                                                                <span className="text-xl font-black text-[#16A34A] group-hover:text-white">
                                                                    {appointment.patient_name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{appointment.patient_name}</h3>
                                                                <p className="text-sm text-gray-500">{appointment.patient_email}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
                                                            <div>
                                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Schedule</span>
                                                                <span className="font-semibold text-gray-900">{appointment.date}</span>
                                                                <span className="text-sm text-primary-600 block">{appointment.time}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Patient Info</span>
                                                                <span className="font-semibold text-gray-900">{appointment.age} yrs, {appointment.gender}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Contact</span>
                                                                <span className="font-semibold text-gray-900">{appointment.phone || 'N/A'}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Status</span>
                                                                <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-tighter ${appointment.status === 'completed' ? 'bg-green-100 text-green-500' :
                                                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-500' :
                                                                        'bg-yellow-100 text-yellow-500'
                                                                    }`}>
                                                                    {appointment.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {appointment.status === 'pending' && (
                                                        <div className="flex flex-row md:flex-col gap-2 min-w-[140px]">
                                                            <button
                                                                onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                                                className="flex-1 px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803d] transition-all shadow-lg shadow-[#16A34A]/10 text-[10px] font-black uppercase tracking-widest active:scale-95"
                                                            >
                                                                Complete
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                                                className="flex-1 px-4 py-2 bg-white text-red-600 border border-red-100 rounded-xl hover:bg-red-50 transition-all text-[10px] font-black uppercase tracking-widest active:scale-95"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 font-medium">No appointments found in this category</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default DoctorDashboard
