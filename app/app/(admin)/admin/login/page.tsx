'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Lock, User, Loader2, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Suspense fallback={<LoginFallback />}>
                <LoginForm />
            </Suspense>
        </div>
    )
}

function LoginFallback() {
    return (
        <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    )
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/admin'

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            if (response.ok) {
                toast.success('Giriş başarılı, yönlendiriliyor...')
                router.push(callbackUrl)
                router.refresh()
            } else {
                toast.error('Hatalı kullanıcı adı veya şifre')
            }
        } catch (error) {
            toast.error('Bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Card className="w-full max-w-md shadow-xl border-0">
                <CardHeader className="space-y-1 text-center bg-gray-50/50 pb-8 pt-8 border-b border-gray-100">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Admin Girişi</CardTitle>
                    <CardDescription>
                        Yönetim paneline erişmek için kimliğinizi doğrulayın
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8 px-8 pb-8">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Kullanıcı Adı</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 font-medium text-base mt-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Giriş Yapılıyor...
                                </>
                            ) : (
                                <>
                                    Giriş Yap <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="absolute bottom-4 text-center text-xs text-gray-400">
                &copy; 2024 TechStore Admin Panel v1.0
            </div>
        </>
    )
}
