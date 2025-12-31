import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { username, password } = body

        // Basit hardcoded kontrol (Prod ortamında DB'den kontrol edilmeli)
        if (username === 'admin' && password === 'admin123') {
            const response = NextResponse.json({ success: true })

            // HttpOnly cookie set et
            // Not: Secure true yaparsak localhost'ta çalışmayabilir (https gerekli), o yüzden development'ta false
            response.cookies.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 gün
            })

            return response
        }

        return NextResponse.json({ error: 'Giriş başarısız' }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
    }
}
