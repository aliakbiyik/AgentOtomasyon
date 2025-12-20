'use client'

import Link from 'next/link'
import { ShoppingCart, Home, Package, User, HeadphonesIcon, LogOut, LogIn, Briefcase } from 'lucide-react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

function NavBar() {
  const { customer, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <span className="text-xl font-bold text-gray-800">TechStore</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Package className="w-4 h-4" />
              Ürünler
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              Sepet
            </Link>
            <Link
              href="/career"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Kariyer
            </Link>
            
            {customer ? (
              <>
                <Link
                  href="/orders"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Siparişlerim
                </Link>
                <Link
                  href="/support"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  Destek
                </Link>
                <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                  <span className="text-sm text-gray-600">
                    Merhaba, <strong>{customer.name.split(' ')[0]}</strong>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Giriş Yap
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <NavBar />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500">
              <p>© 2025 TechStore. Tüm hakları saklıdır.</p>
              <p className="text-sm mt-2">Agent Otomasyon Bitirme Projesi</p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}