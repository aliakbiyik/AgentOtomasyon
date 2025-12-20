import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Tüm ürünleri getir
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Ürünler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ürünler getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni ürün ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, stock, minStock, image, categoryId } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        minStock,
        image,
        categoryId
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Ürün eklenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün eklenemedi' },
      { status: 500 }
    )
  }
}