import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const numericId = Number(id)
        const body = await request.json()
        const { status } = body

        const order = await prisma.order.update({
            where: { id: numericId },
            data: { status }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error('Sipariş güncellenirken hata:', error)
        return NextResponse.json(
            { error: 'Sipariş güncellenemedi' },
            { status: 500 }
        )
    }
}
