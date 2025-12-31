import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  try {
    // Cookie'den kullanıcıyı al
    const sessionCookie = request.cookies.get('customer_session')
    const adminCookie = request.cookies.get('admin_session')

    // URL scope kontrolü
    const { searchParams } = new URL(request.url)
    const scope = searchParams.get('scope')

    // Eğer scope='me' ise veya admin cookie yoksa, önce müşteri kontrolü yap
    if (scope === 'me' || !adminCookie) {
      if (sessionCookie) {
        try {
          const user = JSON.parse(sessionCookie.value)
          const orders = await prisma.order.findMany({
            where: { customerId: user.id },
            include: { customer: true, items: { include: { product: true } }, invoice: true },
            orderBy: { createdAt: 'desc' }
          })
          return NextResponse.json(orders)
        } catch (e) {
          console.error('Session parse error', e)
        }
      }
    }

    // Admin ise hepsini görebilir
    if (adminCookie?.value === 'authenticated') {
      const orders = await prisma.order.findMany({
        include: { customer: true, items: { include: { product: true } }, invoice: true },
        orderBy: { createdAt: 'desc' }
      })
      return NextResponse.json(orders)
    }

    if (sessionCookie) {
      const user = JSON.parse(sessionCookie.value)
      console.log('Orders API Debug - User from cookie:', user)
      console.log('Orders API Debug - Customer ID for query:', user.id)

      const orders = await prisma.order.findMany({
        where: { customerId: user.id },
        include: { customer: true, items: { include: { product: true } }, invoice: true },
        orderBy: { createdAt: 'desc' }
      })
      console.log('Orders API Debug - Found orders count:', orders.length)
      return NextResponse.json(orders)
    }

    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })

  } catch (error) {
    console.error('Siparişler getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Siparişler getirilemedi' },
      { status: 500 }
    )
  }
}

// Yeni sipariş oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, items } = body

    // Sipariş numarası oluştur
    const orderNumber = `ORD-${Date.now()}`

    // Toplam tutarı hesapla ve stok kontrolü yap
    let totalAmount = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: Number(item.productId) }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Ürün bulunamadı: ${item.productId}` },
          { status: 400 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Yetersiz stok: ${product.name}` },
          { status: 400 }
        )
      }

      totalAmount += Number(product.price) * item.quantity
    }

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        totalAmount,
        items: {
          create: items.map((item: { productId: number; quantity: number; price: number }) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price)
          }))
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Stokları düş
    for (const item of items) {
      await prisma.product.update({
        where: { id: Number(item.productId) },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    // n8n Webhook tetikle
    try {
      await axios.post('http://localhost:5678/webhook/order-created', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        totalAmount: order.totalAmount
      })
    } catch (error) {
      console.log('n8n webhook hatası (kritik değil):', error)
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Sipariş oluşturulurken hata:', error)
    return NextResponse.json(
      { error: 'Sipariş oluşturulamadı' },
      { status: 500 }
    )
  }
}