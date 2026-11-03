/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types'
import { useToast } from './ToastContext'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password?: string) => Promise<boolean>
  register: (name: string, email: string, password?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  loginAsDemoCustomer: () => void
  loginAsDemoAdmin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_USER: User = {
  name: 'Alex Morgan',
  email: 'alex@shopsphere.io',
  role: 'CUSTOMER',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
}

const ADMIN_USER: User = {
  name: 'Elena Rostova (Admin)',
  email: 'admin@shopsphere.com',
  role: 'ADMIN',
  phone: '+1 (555) 999-0011',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast()
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('shopsphere-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('shopsphere-token')
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('shopsphere-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('shopsphere-user')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('shopsphere-token', token)
    } else {
      localStorage.removeItem('shopsphere-token')
    }
  }, [token])

  const login = async (email: string): Promise<boolean> => {
    const normalized = email.trim().toLowerCase()
    const isAdmin = normalized.includes('admin')
    const loggedUser: User = {
      name: isAdmin ? 'Admin User' : 'Alex Morgan',
      email: normalized,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
      phone: '+1 (555) 234-5678',
      avatar: isAdmin ? ADMIN_USER.avatar : DEFAULT_USER.avatar,
    }
    const mockToken = `jwt-${Date.now()}-${isAdmin ? 'admin' : 'cust'}`
    setUser(loggedUser)
    setToken(mockToken)
    showToast(`Welcome back, ${loggedUser.name}!`, `Logged in as ${isAdmin ? 'Admin' : 'Customer'}`, 'success')
    return true
  }

  const register = async (name: string, email: string): Promise<boolean> => {
    const normalized = email.trim().toLowerCase()
    const isAdmin = normalized.includes('admin')
    const newUser: User = {
      name: name.trim() || 'New Collector',
      email: normalized,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
      phone: '+1 (555) 234-5678',
    }
    const mockToken = `jwt-${Date.now()}-${isAdmin ? 'admin' : 'cust'}`
    setUser(newUser)
    setToken(mockToken)
    showToast(`Welcome to ShopSphere, ${newUser.name}!`, 'Account created successfully', 'success')
    return true
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    showToast('Signed out', 'You have been logged out of your session', 'info')
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    showToast('Profile updated', 'Your account details have been saved', 'success')
  }

  const loginAsDemoCustomer = () => {
    setUser(DEFAULT_USER)
    setToken('jwt-demo-customer')
    showToast('Demo sign-in', 'Logged in as Demo Customer (Alex Morgan)', 'success')
  }

  const loginAsDemoAdmin = () => {
    setUser(ADMIN_USER)
    setToken('jwt-demo-admin')
    showToast('Admin sign-in', 'Logged in with Full Administrator Privileges', 'success')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
        updateProfile,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
