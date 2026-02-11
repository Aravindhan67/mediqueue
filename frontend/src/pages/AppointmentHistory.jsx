import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api/axios'
import { toast } from 'react-toastify'

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [uploadingFor, setUploadingFor] = useState(null)

    useEffect(() => {
        fetchAppointments()
    }, [])

    useEffect(() => {
        filterAppointmentsList()
    }, [filterStatus, appointments])

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
        if (filterStatus === 'all') {
            setFilteredAppointments(appointments)
        } else {
            setFilteredAppointments(appointments.filter(a => a.status === filterStatus))
        }
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
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Appointment History</h1>

                {/* Filter */}
                <Card className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-md font-medium transition ${filterStatus === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus('pending')}
                            className={`px-4 py-2 rounded-md font-medium transition ${filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilterStatus('completed')}
                            className={`px-4 py-2 rounded-md font-medium transition ${filterStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilterStatus('cancelled')}
                            className={`px-4 py-2 rounded-md font-medium transition ${filterStatus === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Cancelled
                        </button>
                    </div>
                </Card>

                {/* Appointments List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : filteredAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <Card key={appointment.id}>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-grow">
                                        <div className="flex items-center mb-2">
                                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                                                <span className="text-lg font-bold text-primary-600">
                                                    {appointment.doctor_name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{appointment.doctor_name}</h3>
                                                <p className="text-sm text-gray-600">{appointment.specialization}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            <div>
                                                <span className="text-sm text-gray-600 block">Date</span>
                                                <span className="font-semibold text-gray-900">{appointment.date}</span>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600 block">Time</span>
                                                <span className="font-semibold text-gray-900">{appointment.time}</span>
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
                                            <div>
                                                <span className="text-sm text-gray-600 block">Prescription</span>
                                                <span className="font-semibold text-gray-900">
                                                    {appointment.prescription_file ? 'Uploaded' : 'Not uploaded'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col space-y-2">
                                        {appointment.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancel(appointment.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        )}

                                        {!appointment.prescription_file && (
                                            <label className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition text-sm font-medium text-center cursor-pointer">
                                                {uploadingFor === appointment.id ? 'Uploading...' : 'Upload Prescription'}
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
                                                href={`http://localhost:8080/uploads/${appointment.prescription_file}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm font-medium text-center"
                                            >
                                                View Prescription
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-500 text-center py-8">No appointments found</p>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default AppointmentHistory
