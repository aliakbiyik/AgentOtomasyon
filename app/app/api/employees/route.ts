import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Tüm çalışanları getir
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        _count: {
          select: { leaves: true, tickets: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(employees)
  } catch (error) {
    console.error('Çalışanlar getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Çalışanlar getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni çalışan ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, department, position, salary } = body

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        phone,
        department,
        position,
        salary
      }
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error) {
    console.error('Çalışan eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Çalışan eklenemedi' },
      { status: 500 }
    )
  }
}