import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Dashboard istatistiklerini getir
export async function GET() {
  try {
    // Bugünün başlangıcı
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Toplam müşteri sayısı
    const totalCustomers = await prisma.customer.count()

    // Toplam ürün sayısı
    const totalProducts = await prisma.product.count()

    // Kritik stok uyarısı (stok < minStock)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.minStock
        }
      }
    })
    
    // Basit kritik stok kontrolü
    const allProducts = await prisma.product.findMany()
    const criticalStock = allProducts.filter(p => p.stock <= p.minStock).length

    // Bugünkü siparişler
    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    })

    // Toplam sipariş sayısı
    const totalOrders = await prisma.order.count()

    // Bekleyen siparişler
    const pendingOrders = await prisma.order.count({
      where: {
        status: 'PENDING'
      }
    })

    // Bugünkü satış tutarı
    const todaySales = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: today
        }
      },
      _sum: {
        totalAmount: true
      }
    })

    // Toplam satış tutarı
    const totalSales = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    })

    // Açık ticket sayısı
    const openTickets = await prisma.ticket.count({
      where: {
        status: {
          in: ['OPEN', 'IN_PROGRESS']
        }
      }
    })

    // Toplam çalışan sayısı
    const totalEmployees = await prisma.employee.count({
      where: {
        status: 'ACTIVE'
      }
    })

    // Bekleyen CV başvuruları
    const pendingCVs = await prisma.cVApplication.count({
      where: {
        status: 'PENDING'
      }
    })

    // Bekleyen faturalar
    const pendingInvoices = await prisma.invoice.count({
      where: {
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      customers: {
        total: totalCustomers
      },
      products: {
        total: totalProducts,
        criticalStock
      },
      orders: {
        total: totalOrders,
        today: todayOrders,
        pending: pendingOrders
      },
      sales: {
        today: todaySales._sum.totalAmount || 0,
        total: totalSales._sum.totalAmount || 0
      },
      tickets: {
        open: openTickets
      },
      employees: {
        total: totalEmployees
      },
      cvApplications: {
        pending: pendingCVs
      },
      invoices: {
        pending: pendingInvoices
      }
    })
  } catch (error) {
    console.error('Dashboard verileri getirilirken hata:', error)
    return NextResponse.json(
      { error: 'Dashboard verileri getirilemedi' },
      { status: 500 }
    )
  }
}