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
        <div className="min-h-screen bg-[#F0FDF4]">
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
                                    <div className="w-20 h-20 bg-[#16A34A]/10 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#16A34A]/5">
                                        <span className="text-3xl font-black text-[#16A34A]">
                                            {doctor.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-[#111827] mb-2 tracking-tight">{doctor.name}</h3>
                                    <p className="text-[#16A34A] font-black uppercase tracking-widest text-[10px] mb-6">{doctor.specialization}</p>
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
                                        disabled={availableDates.length === 0}
                                        className={`w-full px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all shadow-sm ${availableDates.length === 0 ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
                                    >
                                        {availableDates.length === 0 ? (
                                            <option value="">No dates available</option>
                                        ) : (
                                            <>
                                                <option value="">Choose a date</option>
                                                {availableDates.map(date => (
                                                    <option key={date} value={date}>{date}</option>
                                                ))}
                                            </>
                                        )}
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
                                                        className={`py-3 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${selectedTime === slot.value
                                                            ? 'bg-[#16A34A] text-white shadow-lg shadow-[#16A34A]/20 scale-[0.98]'
                                                            : slot.available
                                                                ? 'bg-white border border-gray-100 text-[#111827] hover:border-[#16A34A] hover:bg-gray-50'
                                                                : 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
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
                                    className="w-full bg-[#16A34A] text-white py-4 px-6 rounded-2xl hover:bg-[#15803d] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-widest shadow-xl shadow-[#16A34A]/10 active:scale-[0.98] transform mt-6"
                                >
                                    {booking ? 'Processing...' : 'Confirm Appointment'}
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
