import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-posta ve şifre zorunludur' },
                { status: 400 }
            )
        }

        const customer = await prisma.customer.findUnique({
            where: { email }
        })

        if (!customer) {
            return NextResponse.json(
                { error: 'Müşteri bulunamadı' },
                { status: 401 }
            )
        }

        const isValid = await verifyPassword(password, customer.password)

        if (!isValid) {
            return NextResponse.json(
                { error: 'Hatalı şifre' },
                { status: 401 }
            )
        }

        // Başarılı giriş
        const response = NextResponse.json({
            success: true,
            user: {
                id: customer.id,
                name: customer.name,
                email: customer.email
            }
        })

        // Güvenli cookie set et
        response.cookies.set('customer_session', JSON.stringify({
            id: customer.id,
            email: customer.email,
            name: customer.name
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 1 hafta
        })

        return response

    } catch (error) {
        console.error('Giriş hatası:', error)
        return NextResponse.json(
            { error: 'Giriş yapılamadı' },
            { status: 500 }
        )
    }
}
