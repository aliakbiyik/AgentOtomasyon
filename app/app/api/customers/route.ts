import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Tüm müşterileri getir
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: { orders: true, tickets: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Müşteriler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Müşteriler getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni müşteri ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Müşteri eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Müşteri eklenemedi' },
      { status: 500 }
    )
  }
}