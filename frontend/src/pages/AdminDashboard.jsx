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
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

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
            }
        } catch (error) {
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
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
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Patients</h3>
                                <p className="text-4xl font-bold text-blue-600">{stats.totalPatients}</p>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Doctors</h3>
                                <p className="text-4xl font-bold text-green-600">{stats.totalDoctors}</p>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Appointments</h3>
                                <p className="text-4xl font-bold text-purple-600">{stats.totalAppointments}</p>
                            </Card>

                            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
                                <p className="text-4xl font-bold text-yellow-600">{stats.pendingAppointments}</p>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="flex space-x-2 border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Appointments
                                </button>
                                <button
                                    onClick={() => setActiveTab('doctors')}
                                    className={`px-4 py-2 font-medium ${activeTab === 'doctors' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Doctors
                                </button>
                                <button
                                    onClick={() => setActiveTab('patients')}
                                    className={`px-4 py-2 font-medium ${activeTab === 'patients' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    Patients
                                </button>
                            </div>
                        </div>

                        {/* Appointments Tab */}
                        {activeTab === 'overview' && (
                            <Card>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">All Appointments</h2>
                                {appointments.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {appointments.map((appointment) => (
                                                    <tr key={appointment.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patient_name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctor_name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
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
                                    <p className="text-gray-500 text-center py-8">No appointments yet</p>
                                )}
                            </Card>
                        )}

                        {/* Doctors Tab */}
                        {activeTab === 'doctors' && (
                            <Card>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Doctors</h2>
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
            </div>
        </div>
    )
}

export default AdminDashboard
