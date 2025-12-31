import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numericId = Number(id)

    const product = await prisma.product.findUnique({
      where: { id: numericId },
      include: {
        category: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün getirilemedi' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numericId = Number(id)
    const body = await request.json()
    const { name, description, price, stock, minStock, image, categoryId } = body

    const product = await prisma.product.update({
      where: { id: numericId },
      data: {
        name,
        description,
        price,
        stock,
        minStock,
        image,
        categoryId
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const numericId = Number(id)

    await prisma.product.delete({
      where: { id: numericId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ürün silinirken hata:', error)
    return NextResponse.json(
      { error: 'Ürün silinemedi' },
      { status: 500 }
    )
  }
}