'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail, User, Phone, ArrowRight, Sparkles, ShieldCheck, Lock } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        await login(email) // Context'i güncelle
        router.push('/')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Giriş yapılamadı')
      }
    } catch (err) {
      setError('Bir bağlantı hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      })

      if (response.ok) {
        // Otomatik giriş yap
        await handleLogin(e)
      } else {
        const data = await response.json()
        setError(data.error || 'Kayıt oluşturulamadı')
        setLoading(false)
      }
    } catch (err) {
      setError('Bir bağlantı hatası oluştu')
      setLoading(false)
    }
  }
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 overflow-hidden">
      {/* Dekoratif Arka Plan Parıltıları */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

      <Card className="w-full max-w-md border-0 bg-white shadow-2xl shadow-indigo-500/10 rounded-[2.5rem] overflow-hidden">
        <CardHeader className="pt-10 pb-6 text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <CardTitle className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium px-6">
            {mode === 'login'
              ? 'Siparişlerinizi takip etmek için hesabınıza giriş yapın.'
              : 'Yeni bir hesap oluşturarak ayrıcalıklardan yararlanın.'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10">
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-5">

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Ad Soyad
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ad Soyad"
                    className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all font-medium"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                E-posta Adresi
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Şifre
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Telefon Numarası
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="h-12 pl-11 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in zoom-in duration-300">
                <div className="w-1 h-1 bg-red-600 rounded-full shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>İşleniyor...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-xs font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
              >
                {mode === 'login'
                  ? 'Henüz hesabınız yok mu? Kayıt Olun'
                  : 'Zaten hesabınız var mı? Giriş Yapın'
                }
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Güvenli SSL Bağlantısı</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}