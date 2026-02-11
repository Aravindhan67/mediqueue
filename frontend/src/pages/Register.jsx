import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        // Patient specific
        age: '',
        gender: '',
        phone: '',
        // Doctor specific
        specialization: '',
        experience: ''
    })
    const [loading, setLoading] = useState(false)

    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long!')
            return
        }

        setLoading(true)

        const result = await register(formData)

        if (result.success) {
            toast.success('Registration successful! Please login.')
            navigate('/login')
        } else {
            toast.error(result.message || 'Registration failed')
        }

        setLoading(false)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[#F0FDF4]">
            {/* Left Side: Illustration & Info (Hidden on mobile) */}
            <div className="hidden md:flex md:w-5/12 bg-[#86EFAC]/20 items-center justify-center p-12 relative overflow-hidden">
                {/* Medical Particle Background Effect */}
                <div className="absolute inset-0 z-0">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="medical-particle opacity-20"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 10}s`,
                                animationDuration: `${20 + Math.random() * 10}s`
                            }}
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                {i % 2 === 0 ? (
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                ) : (
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                )}
                            </svg>
                        </div>
                    ))}
                </div>

                <div className="absolute top-0 left-0 w-64 h-64 bg-[#16A34A]/10 rounded-full -ml-32 -mt-32 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#3B82F6]/10 rounded-full -mr-32 -mb-32 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                <div className="max-w-md w-full relative z-10">
                    <div className="glass-panel p-8 rounded-[3rem] shadow-2xl shadow-[#16A34A]/10 border border-[#16A34A]/5 animate-float">
                        <div className="w-16 h-16 bg-[#16A34A] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#16A34A]/20 transform hover:rotate-12 transition-transform">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-black text-[#111827] mb-4 tracking-tight leading-tight">Join Our <br /><span className="text-[#16A34A]">Healthcare Community</span></h3>
                        <p className="text-gray-500 font-semibold leading-relaxed mb-8">
                            Experience a new standard of medical appointment management. Fast, secure, and designed for you.
                        </p>

                        <div className="space-y-5">
                            {[
                                { text: 'Quick Online Booking', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                { text: 'Verified Doctors Only', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                                { text: 'Digital Prescriptions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group transition-all hover:translate-x-2">
                                    <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-all shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-black text-[#111827] opacity-70 group-hover:opacity-100 transition-opacity tracking-tight">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-7/12 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                <div className="max-w-xl w-full py-8 space-y-8 animate-in fade-in slide-in-from-right duration-700">
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-4 md:hidden">
                            <div className="w-8 h-8 bg-[#16A34A] rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-xl font-black text-[#111827]">MediQueue</span>
                        </div>
                        <h2 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">Create Account</h2>
                        <p className="text-gray-500 font-medium">Start your journey to better health management today.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111827] ml-1 uppercase tracking-widest opacity-60">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all shadow-sm group-hover:border-[#16A34A]/30"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111827] ml-1 uppercase tracking-widest opacity-60">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all shadow-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111827] ml-1 uppercase tracking-widest opacity-60">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111827] ml-1 uppercase tracking-widest opacity-60">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all shadow-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111827] ml-1 uppercase tracking-widest opacity-60">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111827] ml-1 uppercase tracking-widest opacity-60">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none shadow-sm cursor-pointer"
                                >
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-[#111827] ml-1 uppercase tracking-widest opacity-60">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none shadow-sm"
                                    placeholder="1234567890"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#16A34A] text-white py-4 px-6 rounded-2xl hover:bg-[#15803d] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-widest shadow-xl shadow-[#16A34A]/10 hover:shadow-[#16A34A]/30 active:scale-[0.98] transform animate-medical-pulse"
                            >
                                {loading ? 'Securing Profile...' : 'Create My Healthcare Profile'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center pb-8">
                        <p className="text-gray-600 font-bold">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#16A34A] hover:text-[#15803d] underline underline-offset-4 decoration-2">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
