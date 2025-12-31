import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, phone } = body

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'E-posta, şifre ve isim zorunludur' },
                { status: 400 }
            )
        }

        // E-posta kontrolü
        const existingCustomer = await prisma.customer.findUnique({
            where: { email }
        })

        if (existingCustomer) {
            return NextResponse.json(
                { error: 'Bu e-posta adresi zaten kayıtlı' },
                { status: 400 }
            )
        }

        // Şifre hashleme
        const hashedPassword = await hashPassword(password)

        // Müşteri oluşturma
        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone
            }
        })

        // Parolayı response'dan çıkar
        const { password: _, ...customerWithoutPassword } = customer

        return NextResponse.json(customerWithoutPassword, { status: 201 })
    } catch (error) {
        console.error('Kayıt hatası:', error)
        return NextResponse.json(
            { error: 'Kayıt oluşturulurken bir hata oluştu' },
            { status: 500 }
        )
    }
}
