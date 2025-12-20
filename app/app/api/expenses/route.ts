import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Tüm giderleri getir
export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Giderler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Giderler getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni gider ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, amount, category, date } = body

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        date: date ? new Date(date) : new Date()
      }
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Gider eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Gider eklenemedi' },
      { status: 500 }
    )
  }
}