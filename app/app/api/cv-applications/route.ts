import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Tüm CV başvurularını getir
export async function GET() {
  try {
    const applications = await prisma.cVApplication.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(applications)
  } catch (error) {
    console.error('CV başvuruları getirilirken hata:', error)
    return NextResponse.json(
      { error: 'CV başvuruları getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni CV başvurusu ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, position, cvFile, cvText } = body

    const application = await prisma.cVApplication.create({
      data: {
        name,
        email,
        phone,
        position,
        cvFile,
        cvText
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('CV başvurusu eklenirken hata:', error)
    return NextResponse.json(
      { error: 'CV başvurusu eklenemedi' },
      { status: 500 }
    )
  }
}