import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
        setIsMenuOpen(false)
    }

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#16A34A]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center shadow-lg shadow-[#16A34A]/20 transform hover:rotate-12 transition-transform cursor-pointer" onClick={() => navigate('/')}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black text-[#111827] tracking-tight cursor-pointer" onClick={() => navigate('/')}>MediQueue</h1>
                    </div>

                    {user && (
                        <>
                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center space-x-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-[#111827]">
                                        {user.name}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#16A34A]">
                                        {user.role} Account
                                    </span>
                                </div>
                                <div className="h-8 w-[1px] bg-gray-200"></div>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-[#EF4444] rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                                >
                                    Sign Out
                                </button>
                            </div>

                            {/* Mobile Hamburger Toggle */}
                            <div className="md:hidden flex items-center">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 text-[#111827] focus:outline-none"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Content */}
            {user && isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-4 pb-6 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-[#F0FDF4] rounded-2xl">
                            <div className="w-12 h-12 bg-[#16A34A] rounded-xl flex items-center justify-center font-black text-white text-xl">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#111827]">{user.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#16A34A]">{user.role} Account</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 text-sm font-black uppercase tracking-widest text-white bg-[#EF4444] rounded-2xl shadow-lg shadow-red-500/20 active:scale-[0.98] transition-all"
                        >
                            Sign Out Account
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
