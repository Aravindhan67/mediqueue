import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api/axios'
import { toast } from 'react-toastify'

const AppointmentHistory = () => {
    const location = useLocation()
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [uploadingFor, setUploadingFor] = useState(null)

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const filter = params.get('filter')
        if (filter && ['pending', 'completed', 'cancelled'].includes(filter)) {
            setFilterStatus(filter)
        }
    }, [location.search])

    useEffect(() => {
        fetchAppointments()
    }, [])

    useEffect(() => {
        filterAppointmentsList()
    }, [filterStatus, searchQuery, appointments])

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments/patient.php')
            if (response.data.success) {
                setAppointments(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to load appointments')
        } finally {
            setLoading(false)
        }
    }

    const filterAppointmentsList = () => {
        let filtered = [...appointments]

        if (filterStatus !== 'all') {
            filtered = filtered.filter(a => a.status === filterStatus)
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(a =>
                a.doctor_name.toLowerCase().includes(query) ||
                a.specialization.toLowerCase().includes(query)
            )
        }

        setFilteredAppointments(filtered)
    }

    const handleCancel = async (appointmentId) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return

        try {
            const response = await api.post('/appointments/cancel.php', { appointment_id: appointmentId })

            if (response.data.success) {
                toast.success('Appointment cancelled successfully')
                fetchAppointments()
            }
        } catch (error) {
            toast.error('Failed to cancel appointment')
        }
    }

    const handleFileUpload = async (appointmentId, file) => {
        if (!file) return

        const formData = new FormData()
        formData.append('appointment_id', appointmentId)
        formData.append('prescription', file)

        setUploadingFor(appointmentId)

        try {
            const response = await api.post('/prescriptions/upload.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data.success) {
                toast.success('Prescription uploaded successfully')
                fetchAppointments()
            }
        } catch (error) {
            toast.error('Failed to upload prescription')
        } finally {
            setUploadingFor(null)
        }
    }

    return (
        <div className="min-h-screen bg-[#F0FDF4]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Appointment History</h1>

                {/* Filters & Search */}
                <Card className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-6 py-2 rounded-xl font-black transition-all uppercase tracking-widest text-[10px] ${filterStatus === status
                                        ? 'bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/20'
                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-[#16A34A]/30 transition-all'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Search by doctor or specialization..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#16A34A]/5 focus:border-[#16A34A] outline-none transition-all text-sm font-medium"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </Card>

                {/* Appointments List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : filteredAppointments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredAppointments.map((appointment) => (
                            <Card key={appointment.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex-grow">
                                        <div className="flex items-center mb-6">
                                            <div className="w-16 h-16 bg-[#16A34A] rounded-2xl flex items-center justify-center mr-5 shadow-lg shadow-[#16A34A]/20 group-hover:rotate-6 transition-transform">
                                                <span className="text-2xl font-black text-white">
                                                    {appointment.doctor_name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                                                    {appointment.doctor_name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#16A34A] text-[9px] font-black uppercase tracking-widest rounded border border-[#16A34A]/10">
                                                        {appointment.specialization}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-2">
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Schedule</span>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{appointment.date}</span>
                                                    <span className="text-xs text-primary-500 font-bold">{appointment.time}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Clinical Status</span>
                                                <span className={`inline-flex px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm mt-1 ${appointment.status === 'completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                    appointment.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                        'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                                    }`}>
                                                    {appointment.status}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Prescription</span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`w-2 h-2 rounded-full ${appointment.prescription_file ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {appointment.prescription_file ? 'Available' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Ref ID</span>
                                                <span className="text-xs font-mono text-gray-400 font-bold">#APP-{appointment.id.toString().padStart(4, '0')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 min-w-[200px] bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        {appointment.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(appointment.id)}
                                                className="w-full px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all text-xs font-black uppercase tracking-widest shadow-sm"
                                            >
                                                Cancel Visit
                                            </button>
                                        )}

                                        {!appointment.prescription_file && appointment.status === 'completed' && (
                                            <label className="w-full px-4 py-2.5 bg-[#16A34A] text-white rounded-xl hover:shadow-xl hover:shadow-[#16A34A]/20 transition-all text-[10px] font-black uppercase tracking-widest text-center cursor-pointer active:scale-95">
                                                {uploadingFor === appointment.id ? 'Processing...' : 'Upload Medical File'}
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => handleFileUpload(appointment.id, e.target.files[0])}
                                                    className="hidden"
                                                    disabled={uploadingFor === appointment.id}
                                                />
                                            </label>
                                        )}

                                        {appointment.prescription_file && (
                                            <a
                                                href={`/uploads/${appointment.prescription_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all text-xs font-black uppercase tracking-widest text-center shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View Clinical File
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No appointment records found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AppointmentHistory
