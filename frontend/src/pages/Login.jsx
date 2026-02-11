import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        console.log('Attempting login with:', formData.email)
        const result = await login(formData.email, formData.password)
        console.log('Login result:', result)

        if (result.success) {
            toast.success('Login successful!')
            const userData = JSON.parse(localStorage.getItem('user'))
            console.log('User data:', userData)
            console.log('Navigating to:', `/${userData.role}/dashboard`)
            navigate(`/${userData.role}/dashboard`)
        } else {
            console.error('Login failed:', result.message)
            toast.error(result.message || 'Login failed')
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
            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
                <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-left duration-700">
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center shadow-lg shadow-[#16A34A]/20">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-black text-[#111827] tracking-tight">MediQueue</h1>
                        </div>
                        <h2 className="text-4xl font-black text-[#111827] mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to sign in to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#111827] ml-1 uppercase tracking-wider opacity-70">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#16A34A] text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all shadow-sm group-hover:border-[#16A34A]/30"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#111827] ml-1 uppercase tracking-wider opacity-70">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#16A34A] text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] focus:border-transparent outline-none transition-all shadow-sm group-hover:border-[#16A34A]/30"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#16A34A] text-white py-4 px-6 rounded-2xl hover:bg-[#15803d] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-black uppercase tracking-widest shadow-xl shadow-[#16A34A]/20 hover:shadow-[#16A34A]/40 active:scale-[0.98] transform animate-medical-pulse"
                        >
                            {loading ? 'Authenticating...' : 'Sign In To MediQueue'}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-gray-600 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#16A34A] hover:text-[#15803d] font-bold underline decoration-2 underline-offset-4 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Illustration & Branding */}
            <div className="hidden md:flex md:w-1/2 bg-[#86EFAC]/30 items-center justify-center p-16 relative overflow-hidden">
                {/* Medical Particle Background Effect */}
                <div className="absolute inset-0 z-0">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="medical-particle opacity-20"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 10}s`,
                                animationDuration: `${15 + Math.random() * 10}s`
                            }}
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                {i % 3 === 0 ? (
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                ) : i % 3 === 1 ? (
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                ) : (
                                    <path d="M10.5 13c.28 0 .5-.22.5-.5V10c0-.28-.22-.5-.5-.5h-2c-.28 0-.5.22-.5.5v2.5c0 .28.22.5.5.5h2zM15 13c.28 0 .5-.22.5-.5V10c0-.28-.22-.5-.5-.5h-2c-.28 0-.5.22-.5.5v2.5c0 .28.22.5.5.5h2z" />
                                )}
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Decorative Shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#16A34A]/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3B82F6]/10 rounded-full -ml-48 -mb-48 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="max-w-lg w-full relative z-10 text-center">
                    <div className="mb-12 inline-block p-8 glass-panel rounded-[3.5rem] shadow-2xl shadow-[#16A34A]/10 transform -rotate-3 animate-float-slow">
                        <div className="relative">
                            <svg className="w-40 h-40 text-[#16A34A] animate-dna" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2v20M8 5l8 4M8 15l8 4M16 5l-8 4M16 15l-8 4" />
                                <circle cx="8" cy="5" r="1.5" fill="currentColor" />
                                <circle cx="16" cy="9" r="1.5" fill="currentColor" />
                                <circle cx="8" cy="15" r="1.5" fill="currentColor" />
                                <circle cx="16" cy="19" r="1.5" fill="currentColor" />
                                <circle cx="16" cy="5" r="1.5" fill="currentColor" />
                                <circle cx="8" cy="9" r="1.5" fill="currentColor" />
                                <circle cx="16" cy="15" r="1.5" fill="currentColor" />
                                <circle cx="8" cy="19" r="1.5" fill="currentColor" />
                            </svg>
                            <div className="absolute inset-x-0 -bottom-4 bg-[#16A34A]/20 h-2 blur-xl rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <h3 className="text-5xl font-black text-[#111827] mb-6 tracking-tight leading-[1.1] animate-in slide-in-from-bottom duration-1000">
                        Modern Tech for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#14b8a6]">Elite Healthcare</span>
                    </h3>
                    <p className="text-lg text-[#111827]/60 font-semibold px-8 animate-in fade-in duration-1000 slide-in-from-bottom-[20px]">
                        Seamlessly connecting patients and providers through our priority queue system.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
