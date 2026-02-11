import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
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
                        <div className="flex items-center space-x-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold text-[#111827]">
                                    {user.name}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#16A34A]">
                                    {user.role} Account
                                </span>
                            </div>
                            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-[#EF4444] rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
