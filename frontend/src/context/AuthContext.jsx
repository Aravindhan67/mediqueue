import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        if (token && userData) {
            setUser(JSON.parse(userData))
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login.php', { email, password })

            if (response.data.success) {
                const { token, user } = response.data.data
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                setUser(user)
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                return { success: true }
            }
            return { success: false, message: response.data.message }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const register = async (userData) => {
        try {
            console.log('Sending registration data:', userData)
            const response = await api.post('/auth/register.php', userData)
            console.log('Registration response:', response.data)

            if (response.data.success) {
                return { success: true, message: response.data.message }
            }
            return { success: false, message: response.data.message }
        } catch (error) {
            console.error('Registration error:', error)
            console.error('Error response:', error.response)
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        delete api.defaults.headers.common['Authorization']
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
