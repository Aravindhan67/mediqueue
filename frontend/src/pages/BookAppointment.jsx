import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api/axios'
import { toast } from 'react-toastify'

const BookAppointment = () => {
    const { doctorId } = useParams()
    const navigate = useNavigate()

    const [doctor, setDoctor] = useState(null)
    const [schedules, setSchedules] = useState([])
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState(false)

    useEffect(() => {
        fetchDoctorDetails()
        fetchSchedules()
    }, [doctorId])

    const fetchDoctorDetails = async () => {
        try {
            const response = await api.get(`/doctors/details.php?id=${doctorId}`)
            if (response.data.success) {
                setDoctor(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to load doctor details')
        }
    }

    const fetchSchedules = async () => {
        try {
            const response = await api.get(`/schedules/doctor.php?doctor_id=${doctorId}`)
            if (response.data.success) {
                setSchedules(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to load schedules')
        } finally {
            setLoading(false)
        }
    }

    const handleBooking = async (e) => {
        e.preventDefault()

        if (!selectedDate || !selectedTime) {
            toast.error('Please select date and time')
            return
        }

        setBooking(true)

        try {
            const response = await api.post('/appointments/book.php', {
                doctor_id: doctorId,
                date: selectedDate,
                time: selectedTime
            })

            if (response.data.success) {
                toast.success('Appointment booked successfully!')
                navigate('/patient/appointments')
            } else {
                toast.error(response.data.message || 'Booking failed')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed')
        } finally {
            setBooking(false)
        }
    }

    const availableDates = [...new Set(schedules.map(s => s.date))].sort()

    const availableTimes = []
    const schedule = schedules.find(s => s.date === selectedDate)

    if (schedule) {
        // Backend now returns pre-calculated slots
        if (schedule.slots) {
            schedule.slots.forEach(slot => {
                availableTimes.push({
                    start: slot.time,     // Display time (09:00 AM)
                    value: slot.value,    // Value to send (09:00:00)
                    available: slot.available
                })
            })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Appointment</h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Doctor Info */}
                        <Card>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Doctor Information</h2>
                            {doctor && (
                                <div>
                                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-3xl font-bold text-primary-600">
                                            {doctor.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
                                    <p className="text-primary-600 font-medium mb-4">{doctor.specialization}</p>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-semibold">Experience:</span> {doctor.experience} years</p>
                                        <p><span className="font-semibold">Email:</span> {doctor.email}</p>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Booking Form */}
                        <Card>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Date & Time</h2>
                            <form onSubmit={handleBooking} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Date
                                    </label>
                                    <select
                                        value={selectedDate}
                                        onChange={(e) => {
                                            setSelectedDate(e.target.value)
                                            setSelectedTime('')
                                        }}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    >
                                        <option value="">Choose a date</option>
                                        {availableDates.map(date => (
                                            <option key={date} value={date}>{date}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedDate && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Time Slot
                                        </label>
                                        {availableTimes.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {availableTimes.map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => setSelectedTime(slot.value)}
                                                        disabled={!slot.available}
                                                        className={`py-2 px-4 rounded-md font-medium transition ${selectedTime === slot.value
                                                            ? 'bg-primary-600 text-white'
                                                            : slot.available
                                                                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {slot.start}
                                                        {!slot.available && <span className="block text-xs">Full</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No slots available for this date</p>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={booking || !selectedDate || !selectedTime}
                                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {booking ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </form>
                        </Card>
                    </div>
                )}

                {!loading && schedules.length === 0 && (
                    <Card className="mt-6">
                        <p className="text-gray-500 text-center py-8">
                            No schedules available for this doctor yet. Please check back later.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default BookAppointment
