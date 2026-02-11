import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import api from '../api/axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

const DoctorSchedule = () => {
    const { user } = useAuth()
    const [schedules, setSchedules] = useState([])
    const [formData, setFormData] = useState({
        date: '',
        start_time: '',
        end_time: '',
        slot_limit: 10
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchSchedules()
    }, [])

    const fetchSchedules = async () => {
        try {
            const response = await api.get(`/schedules/doctor.php?doctor_id=${user.id}`)
            if (response.data.success) {
                setSchedules(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to load schedules')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await api.post('/schedules/create.php', formData)

            if (response.data.success) {
                toast.success('Schedule created successfully')
                setFormData({ date: '', start_time: '', end_time: '', slot_limit: 10 })
                fetchSchedules()
            } else {
                toast.error(response.data.message || 'Failed to create schedule')
            }
        } catch (error) {
            toast.error('Failed to create schedule')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (scheduleId) => {
        if (!confirm('Are you sure you want to delete this schedule?')) return

        try {
            const response = await api.post('/schedules/delete.php', { schedule_id: scheduleId })

            if (response.data.success) {
                toast.success('Schedule deleted successfully')
                fetchSchedules()
            }
        } catch (error) {
            toast.error('Failed to delete schedule')
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Schedule</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Create Schedule Form */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Schedule</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Slots
                                </label>
                                <input
                                    type="number"
                                    name="slot_limit"
                                    value={formData.slot_limit}
                                    onChange={handleChange}
                                    min="1"
                                    max="50"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? 'Creating...' : 'Create Schedule'}
                            </button>
                        </form>
                    </Card>

                    {/* Existing Schedules */}
                    <Card>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Schedules</h2>

                        {schedules.length > 0 ? (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto">
                                {schedules.map((schedule) => (
                                    <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-900">{schedule.date}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {schedule.start_time} - {schedule.end_time}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Slots: {schedule.booked_count || 0} / {schedule.slot_limit}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(schedule.id)}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No schedules created yet</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DoctorSchedule
