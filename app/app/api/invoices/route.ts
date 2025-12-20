import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Tüm faturaları getir
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        order: {
          include: {
            customer: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Faturalar getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Faturalar getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni fatura oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    // Siparişi kontrol et
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { invoice: true }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    if (order.invoice) {
      return NextResponse.json(
        { error: 'Bu sipariş için zaten fatura kesilmiş' },
        { status: 400 }
      )
    }

    // Fatura numarası oluştur
    const invoiceNumber = `INV-${Date.now()}`

    // KDV hesapla (%18)
    const amount = Number(order.totalAmount)
    const taxAmount = amount * 0.18
    const totalAmount = amount + taxAmount

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        amount,
        taxAmount,
        totalAmount
      },
      include: {
        order: {
          include: {
            customer: true
          }
        }
      }
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Fatura oluşturulurken hata:', error)
    return NextResponse.json(
      { error: 'Fatura oluşturulamadı' },
      { status: 500 }
    )
  }
}