'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Customer {
  id: number
  name: string
  email: string
  phone?: string
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
    // Sayfa yüklendiğinde localStorage'dan email kontrol et
    const savedEmail = localStorage.getItem('customerEmail')
    if (savedEmail) {
      loginWithEmail(savedEmail)
    } else {
      setLoading(false)
    }
  }, [])

  const loginWithEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auth/customer?email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        setCustomer(data)
        localStorage.setItem('customerEmail', email)
        setLoading(false)
        return true
      } else {
        localStorage.removeItem('customerEmail')
        setCustomer(null)
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Login hatası:', error)
      setLoading(false)
      return false
    }
  }

  const login = async (email: string): Promise<boolean> => {
    setLoading(true)
    return loginWithEmail(email)
  }

  const logout = () => {
    localStorage.removeItem('customerEmail')
    setCustomer(null)
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