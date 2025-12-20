'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Package, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: number
  orderNumber: string
  status: string
  totalAmount: string | number
  createdAt: string
  customer: {
    name: string
    email: string
  }
  items: {
    product: { name: string }
    quantity: number
    price: string | number
  }[]
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusLabels: Record<string, string> = {
  PENDING: 'Beklemede',
  CONFIRMED: 'Onaylandı',
  SHIPPED: 'Kargoda',
  DELIVERED: 'Teslim Edildi',
  CANCELLED: 'İptal Edildi'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState('')
  const [searched, setSearched] = useState(false)

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const searchOrders = async () => {
    if (!searchEmail) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch('/api/orders')
      const allOrders = await response.json()
      const filteredOrders = allOrders.filter(
        (order: Order) => order.customer.email.toLowerCase() === searchEmail.toLowerCase()
      )
      setOrders(filteredOrders)
    } catch (error) {
      console.error('Siparişler alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchOrders()
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Siparişlerim</h1>
        <p className="text-gray-500">E-posta adresinizle siparişlerinizi sorgulayın</p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="E-posta adresinizi girin..."
                value={searchEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={searchOrders}>
              <Search className="w-4 h-4 mr-2" />
              Sorgula
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {!searched ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Siparişlerinizi Görüntüleyin
          </h2>
          <p className="text-gray-500">
            E-posta adresinizi girerek siparişlerinizi sorgulayabilirsiniz.
          </p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Sipariş Bulunamadı
          </h2>
          <p className="text-gray-500 mb-6">
            Bu e-posta adresine ait sipariş bulunmamaktadır.
          </p>
          <Link href="/products">
            <Button>Alışverişe Başla</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {order.orderNumber}
                  </CardTitle>
                  <Badge className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>
                        {formatCurrency(
                          (typeof item.price === 'string'
                            ? parseFloat(item.price)
                            : item.price) * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Toplam</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}