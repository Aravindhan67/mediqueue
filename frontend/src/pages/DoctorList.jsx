import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Loader from '../components/Loader'
import api from '../api/axios'
import { toast } from 'react-toastify'

const DoctorList = () => {
    const [doctors, setDoctors] = useState([])
    const [filteredDoctors, setFilteredDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterSpecialization, setFilterSpecialization] = useState('')

    useEffect(() => {
        fetchDoctors()
    }, [])

    useEffect(() => {
        filterDoctorsList()
    }, [searchTerm, filterSpecialization, doctors])

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors/list.php')
            if (response.data.success) {
                setDoctors(response.data.data)
                setFilteredDoctors(response.data.data)
            }
        } catch (error) {
            toast.error('Failed to load doctors')
        } finally {
            setLoading(false)
        }
    }

    const filterDoctorsList = () => {
        let filtered = doctors

        if (searchTerm) {
            filtered = filtered.filter(doctor =>
                doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (filterSpecialization) {
            filtered = filtered.filter(doctor =>
                doctor.specialization.toLowerCase() === filterSpecialization.toLowerCase()
            )
        }

        setFilteredDoctors(filtered)
    }

    const specializations = [...new Set(doctors.map(d => d.specialization))]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h1>

                {/* Search and Filter */}
                <Card className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Search by name or specialization"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                            <select
                                value={filterSpecialization}
                                onChange={(e) => setFilterSpecialization(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            >
                                <option value="">All Specializations</option>
                                {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Doctors Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader />
                    </div>
                ) : filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <Card key={doctor.id} className="hover:shadow-lg transition">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center mb-4">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-primary-600">
                                                {doctor.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                                            <p className="text-sm text-primary-600 font-medium">{doctor.specialization}</p>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="mb-2">
                                            <span className="text-sm text-gray-600">Experience:</span>
                                            <span className="ml-2 text-sm font-semibold text-gray-900">{doctor.experience} years</span>
                                        </div>
                                        <div className="mb-4">
                                            <span className="text-sm text-gray-600">Email:</span>
                                            <span className="ml-2 text-sm text-gray-900">{doctor.email}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/patient/book/${doctor.id}`}
                                        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition text-center font-medium"
                                    >
                                        Book Appointment
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <p className="text-gray-500 text-center py-8">No doctors found matching your criteria</p>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default DoctorList
