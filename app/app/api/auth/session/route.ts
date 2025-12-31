import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const cookieStore = await cookies()
    const session = cookieStore.get('customer_session')

    if (!session) {
        return NextResponse.json(null)
    }

    try {
        const sessionData = JSON.parse(session.value)

        // DB'den taze veriyi çek (Adres vs. için)
        const user = await prisma.customer.findUnique({
            where: { id: sessionData.id }
        })

        if (!user) return NextResponse.json(null)

        // Şifreyi çıkar
        const { password, ...safeUser } = user

        return NextResponse.json(safeUser)
    } catch (error) {
        console.error('Session error:', error)
        return NextResponse.json(null)
    }
}
