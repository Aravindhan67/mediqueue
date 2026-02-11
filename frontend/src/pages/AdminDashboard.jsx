import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api/axios'
import { toast } from 'react-toastify'

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        pendingAppointments: 0
    })
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [statusFilter, setStatusFilter] = useState('all')
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [showAddDoctorModal, setShowAddDoctorModal] = useState(false)
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        experience: ''
    })

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [appsRes, docsRes, patsRes] = await Promise.all([
                api.get('/admin/appointments.php'),
                api.get('/admin/doctors.php'),
                api.get('/admin/patients.php')
            ])

            if (appsRes.data.success && docsRes.data.success && patsRes.data.success) {
                const apps = appsRes.data.data
                const docs = docsRes.data.data
                const pats = patsRes.data.data

                setAppointments(apps)
                setDoctors(docs)
                setPatients(pats)

                setStats({
                    totalPatients: pats.length,
                    totalDoctors: docs.length,
                    totalAppointments: apps.length,
                    pendingAppointments: apps.filter(a => a.status === 'pending').length
                })

                setFilteredAppointments(apps)
            }
        } catch (error) {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredAppointments(appointments)
        } else {
            setFilteredAppointments(appointments.filter(a => a.status === statusFilter))
        }
    }, [statusFilter, appointments])

    const handleDeleteDoctor = async (doctorId) => {
        if (!confirm('Are you sure you want to delete this doctor?')) return

        try {
            const response = await api.post('/admin/delete-doctor.php', { doctor_id: doctorId })

            if (response.data.success) {
                toast.success('Doctor deleted successfully')
                fetchDashboardData()
            }
        } catch (error) {
            toast.error('Failed to delete doctor')
        }
    }

    const handleAddDoctor = async (e) => {
        e.preventDefault()
        try {
            const response = await api.post('/admin/add-doctor.php', newDoctor)
            if (response.data.success) {
                toast.success('Doctor added successfully')
                setShowAddDoctorModal(false)
                setNewDoctor({ name: '', email: '', password: '', specialization: '', experience: '' })
                fetchDashboardData()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add doctor')
        }
    }

    const exportToCSV = () => {
        const csvContent = [
            ['Date', 'Patient', 'Doctor', 'Status', 'Time'],
            ...appointments.map(a => [a.date, a.patient_name, a.doctor_name, a.status, a.time])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        toast.success('Report exported successfully')
    }

    return (
        <div className="min-h-screen bg-[#F0FDF4]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={exportToCSV}
                        className="px-6 py-2.5 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803d] transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-[#16A34A]/20 active:scale-95 animate-medical-pulse"
                    >
                        Export Report (CSV)
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-white border-b-4 border-[#16A34A] shadow-lg shadow-[#16A34A]/5 hover-lift">
                                <h3 className="text-xs font-black text-[#16A34A] uppercase tracking-widest mb-2 opacity-70">Total Patients</h3>
                                <p className="text-4xl font-black text-[#111827]">{stats.totalPatients}</p>
                            </Card>

                            <Card className="bg-white border-b-4 border-[#86EFAC] shadow-lg shadow-[#86EFAC]/5 hover-lift">
                                <h3 className="text-xs font-black text-[#16A34A] uppercase tracking-widest mb-2 opacity-70">Total Doctors</h3>
                                <p className="text-4xl font-black text-[#111827]">{stats.totalDoctors}</p>
                            </Card>

                            <Card className="bg-white border-b-4 border-[#3B82F6] shadow-lg shadow-[#3B82F6]/5 hover-lift">
                                <h3 className="text-xs font-black text-[#3B82F6] uppercase tracking-widest mb-2 opacity-70">Total Appts</h3>
                                <p className="text-4xl font-black text-[#111827]">{stats.totalAppointments}</p>
                            </Card>

                            <Card className="bg-white border-b-4 border-yellow-400 shadow-lg shadow-yellow-400/5 hover-lift">
                                <h3 className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-2 opacity-70">Pending</h3>
                                <p className="text-4xl font-black text-[#111827]">{stats.pendingAppointments}</p>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="flex space-x-2 border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'border-b-2 border-[#16A34A] text-[#16A34A]' : 'text-gray-400 hover:text-[#111827]'}`}
                                >
                                    Appointments
                                </button>
                                <button
                                    onClick={() => setActiveTab('doctors')}
                                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'doctors' ? 'border-b-2 border-[#16A34A] text-[#16A34A]' : 'text-gray-400 hover:text-[#111827]'}`}
                                >
                                    Doctors
                                </button>
                                <button
                                    onClick={() => setActiveTab('patients')}
                                    className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'patients' ? 'border-b-2 border-[#16A34A] text-[#16A34A]' : 'text-gray-400 hover:text-[#111827]'}`}
                                >
                                    Patients
                                </button>
                            </div>
                        </div>

                        {/* Appointments Tab */}
                        {activeTab === 'overview' && (
                            <Card>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                    <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${statusFilter === status
                                                    ? 'bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/20'
                                                    : 'text-gray-400 hover:text-[#111827]'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {filteredAppointments.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredAppointments.map((appointment) => (
                                                    <tr key={appointment.id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{appointment.patient_name}</div>
                                                            <div className="text-xs text-gray-500">{appointment.patient_email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{appointment.age} yrs, {appointment.gender}</div>
                                                            <div className="text-xs text-gray-500">{appointment.phone}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div>{appointment.doctor_name}</div>
                                                            <div className="text-xs font-bold text-[#16A34A] uppercase tracking-tighter">{appointment.specialization}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div>{appointment.date}</div>
                                                            <div className="text-xs font-medium">{appointment.time}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'completed' ? 'bg-green-100 text-green-500' :
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
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No appointments found for this status</p>
                                )}
                            </Card>
                        )}

                        {/* Doctors Tab */}
                        {activeTab === 'doctors' && (
                            <Card>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Manage Doctors</h2>
                                    <button
                                        onClick={() => setShowAddDoctorModal(true)}
                                        className="px-6 py-2.5 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803d] transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#16A34A]/20 flex items-center gap-2 active:scale-95"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add New Doctor
                                    </button>
                                </div>
                                {doctors.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {doctors.map((doctor) => (
                                                    <tr key={doctor.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialization}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.experience} years</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <button
                                                                onClick={() => handleDeleteDoctor(doctor.id)}
                                                                className="text-red-600 hover:text-red-900 font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No doctors registered yet</p>
                                )}
                            </Card>
                        )}

                        {/* Patients Tab */}
                        {/* Patients Tab */}
                        {activeTab === 'patients' && (
                            <Card>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">All Patients</h2>
                                {patients.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {patients.map((patient) => (
                                                    <tr key={patient.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.email}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No patients registered yet</p>
                                )}
                            </Card>
                        )}
                    </>
                )}

                {/* Add Doctor Modal */}
                {showAddDoctorModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop with blur */}
                        <div
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowAddDoctorModal(false)}
                        ></div>

                        {/* Modal Container */}
                        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20 transform transition-all animate-in fade-in zoom-in duration-300">
                            {/* Header Gradient */}
                            <div className="bg-gradient-to-r from-[#16A34A] to-[#86EFAC] px-8 py-8">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Add New Doctor</h2>
                                <p className="text-[#115e59] text-xs font-bold uppercase tracking-widest opacity-80 mt-1">Medical Staff Onboarding</p>
                            </div>

                            <form onSubmit={handleAddDoctor} className="p-8 space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Dr. John Doe"
                                                className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                                value={newDoctor.name}
                                                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="doctor@mediqueue.com"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                                value={newDoctor.email}
                                                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                                value={newDoctor.password}
                                                onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Cardiology"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                                value={newDoctor.specialization}
                                                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Exp (Years)</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                placeholder="5"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                                value={newDoctor.experience}
                                                onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddDoctorModal(false)}
                                        className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-[#16A34A] text-white text-[10px] font-black rounded-xl hover:shadow-xl hover:shadow-[#16A34A]/30 transform hover:-translate-y-0.5 transition-all outline-none uppercase tracking-widest active:scale-95"
                                    >
                                        Create Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
