import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, rehydrate the session from a stored token/user pair.
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (payload) => {
    const { data } = await authApi.register(payload)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
