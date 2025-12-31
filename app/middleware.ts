import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Sadece /admin ile başlayan yolları kontrol et
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Login sayfasına gidiyorsa ve zaten giriş yapmışsa dashboard'a yönlendir
        if (request.nextUrl.pathname === '/admin/login') {
            const authCookie = request.cookies.get('admin_session')
            if (authCookie?.value === 'authenticated') {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return NextResponse.next()
        }

        // Diğer admin sayfalarında cookie kontrolü yap
        const authCookie = request.cookies.get('admin_session')

        if (!authCookie || authCookie.value !== 'authenticated') {
            const url = new URL('/admin/login', request.url)
            // Geri dönüş URL'ini query parametresi olarak ekle (opsiyonel)
            url.searchParams.set('callbackUrl', request.nextUrl.pathname)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
