import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Tüm kategorileri getir
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Kategoriler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Kategoriler getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni kategori ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Kategori eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Kategori eklenemedi' },
      { status: 500 }
    )
  }
}