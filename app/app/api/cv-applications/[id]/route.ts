
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const numericId = Number(id)
        const { status } = await request.json()

        const application = await prisma.cVApplication.update({
            where: { id: numericId },
            data: { status }
        })

        return NextResponse.json(application)
    } catch (error) {
        console.error('CV güncelleme hatası:', error)
        return NextResponse.json(
            { error: 'CV güncellenemedi' },
            { status: 500 }
        )
    }
}
