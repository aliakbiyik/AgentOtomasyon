'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Customer {
  id: number
  name: string
  email: string
  phone?: string | null
  address?: string | null
}

interface AuthContextType {
  customer: Customer | null
  loading: boolean
  login: (email: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const body = await response.json() // null or user object
        setCustomer(body)
      } else {
        setCustomer(null)
      }
    } catch (error) {
      console.error('Session check failed', error)
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  const loginWithEmail = async (email: string): Promise<boolean> => {
    // Deprecated method signature kept for compatibility, but logic updated
    // Ideally this should trigger a session re-check
    await checkSession()
    return true
  }

  const login = async (email: string): Promise<boolean> => {
    // Trigger session update after form submission logic (which happens elsewhere)
    await checkSession()
    return true
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setCustomer(null)
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <AuthContext.Provider value={{ customer, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}