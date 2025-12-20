'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  AlertTriangle,
  HeadphonesIcon,
  FileUser,
  FileText,
  Sparkles,
  Loader2
} from 'lucide-react'

interface DashboardData {
  customers: { total: number }
  products: { total: number; criticalStock: number }
  orders: { total: number; today: number; pending: number }
  sales: { today: string | number; total: string | number }
  tickets: { open: number }
  employees: { total: number }
  cvApplications: { pending: number }
  invoices: { pending: number }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecast, setForecast] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Dashboard verisi alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleForecast = async () => {
    setForecastLoading(true)
    try {
      // Satış verilerini hazırla
      const salesData = `Bugünkü satış: ${data?.sales.today} TL, Toplam satış: ${data?.sales.total} TL, Bugünkü sipariş: ${data?.orders.today}, Toplam sipariş: ${data?.orders.total}`
      
      // n8n webhook'una istek gönder
      const response = await fetch('http://localhost:5678/webhook/sales-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salesData: salesData
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setForecast(result.output || 'Tahmin oluşturuldu')
      } else {
        alert('n8n workflow hatası!')
      }
    } catch (error) {
      console.error('Satış tahmini hatası:', error)
      alert('Satış tahmini alınırken bir hata oluştu')
    } finally {
      setForecastLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Veri yüklenemedi</p>
      </div>
    )
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(num)
  }

  const stats = [
    {
      title: 'Bugünkü Satış',
      value: formatCurrency(data.sales.today),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Toplam Sipariş',
      value: data.orders.total,
      subtitle: `${data.orders.pending} beklemede`,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Toplam Müşteri',
      value: data.customers.total,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Toplam Ürün',
      value: data.products.total,
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Kritik Stok',
      value: data.products.criticalStock,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Açık Ticketlar',
      value: data.tickets.open,
      icon: HeadphonesIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Çalışanlar',
      value: data.employees.total,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Bekleyen CV',
      value: data.cvApplications.pending,
      icon: FileUser,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">TechStore yönetim paneline hoş geldiniz</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toplam Satış Kartı */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Toplam Satış</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-600">
            {formatCurrency(data.sales.total)}
          </p>
          <p className="text-gray-500 mt-2">
            Bugün {data.orders.today} sipariş alındı
          </p>
        </CardContent>
      </Card>

      {/* AI Satış Tahmini Kartı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Satış Tahmini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleForecast}
            disabled={forecastLoading}
            className="mb-4"
          >
            {forecastLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                n8n çalışıyor...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Satış Tahmini Oluştur
              </>
            )}
          </Button>
          
          {forecast && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700">{forecast}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}