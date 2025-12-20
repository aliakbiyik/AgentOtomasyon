import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// n8n'den gelen webhook isteklerini işle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'create_invoice':
        return await createInvoice(data)
      
      case 'check_stock':
        return await checkStock()
      
      case 'create_notification':
        return await createNotification(data)
      
      case 'update_order_status':
        return await updateOrderStatus(data)
      
      default:
        return NextResponse.json(
          { error: 'Bilinmeyen action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Webhook hatası:', error)
    return NextResponse.json(
      { error: 'Webhook işlenemedi' },
      { status: 500 }
    )
  }
}

// Otomatik fatura oluştur
async function createInvoice(data: { orderId: number }) {
  const { orderId } = data

  // Sipariş kontrolü
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { invoice: true }
  })

  if (!order) {
    return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
  }

  if (order.invoice) {
    return NextResponse.json({ message: 'Fatura zaten mevcut', invoice: order.invoice })
  }

  // Fatura oluştur
  const invoiceNumber = `INV-${Date.now()}`
  const amount = Number(order.totalAmount)
  const taxAmount = amount * 0.18
  const totalAmount = amount + taxAmount

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      orderId: Number(orderId),
      amount,
      taxAmount,
      totalAmount
    }
  })

  return NextResponse.json({ message: 'Fatura oluşturuldu', invoice })
}

// Kritik stok kontrolü
async function checkStock() {
  const products = await prisma.product.findMany()
  
  const criticalProducts = products.filter(p => p.stock <= p.minStock)

  // Her kritik ürün için bildirim oluştur
  for (const product of criticalProducts) {
    await prisma.notification.create({
      data: {
        type: 'STOCK_ALERT',
        title: 'Kritik Stok Uyarısı',
        message: `${product.name} ürününün stoğu kritik seviyede! Mevcut: ${product.stock}, Minimum: ${product.minStock}`
      }
    })
  }

  return NextResponse.json({
    message: `${criticalProducts.length} ürün kritik stokta`,
    products: criticalProducts
  })
}

// Bildirim oluştur
async function createNotification(data: { type: string; title: string; message: string }) {
  const { type, title, message } = data

  const notification = await prisma.notification.create({
    data: {
      type,
      title,
      message
    }
  })

  return NextResponse.json({ message: 'Bildirim oluşturuldu', notification })
}

// Sipariş durumunu güncelle
// Sipariş durumunu güncelle
async function updateOrderStatus(data: { orderId: number; status: string }) {
  const { orderId, status } = data

  const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Geçersiz sipariş durumu' }, { status: 400 })
  }

  const order = await prisma.order.update({
    where: { id: Number(orderId) },
    data: { status: status as 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' }
  })

  return NextResponse.json({ message: 'Sipariş durumu güncellendi', order })
}

// GET - Test endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'n8n Webhook API aktif',
    actions: ['create_invoice', 'check_stock', 'create_notification', 'update_order_status']
  })
}