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
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-primary-600">MediQueue</h1>
                    </div>

                    {user && (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Welcome, <span className="font-semibold">{user.name}</span>
                            </span>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                                {user.role.toUpperCase()}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
