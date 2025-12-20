'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Loader2 } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  price: string | number
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length === 0) {
      router.push('/cart')
      return
    }
    setCartItems(cart)
    setLoading(false)
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(num)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      return total + price * item.quantity
    }, 0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // 1. Müşteri oluştur veya bul
      const customerRes = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        })
      })

      let customer
      if (customerRes.status === 201) {
        customer = await customerRes.json()
      } else {
        // Müşteri zaten varsa, email ile bul
        const customersRes = await fetch('/api/customers')
        const customers = await customersRes.json()
        customer = customers.find((c: any) => c.email === formData.email)
      }

      if (!customer) {
        throw new Error('Müşteri oluşturulamadı')
      }

      // 2. Sipariş oluştur
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
          }))
        })
      })

      if (!orderRes.ok) {
        const error = await orderRes.json()
        throw new Error(error.error || 'Sipariş oluşturulamadı')
      }

      const order = await orderRes.json()
      setOrderNumber(order.orderNumber)
      setSuccess(true)

      // Sepeti temizle
      localStorage.removeItem('cart')

    } catch (error) {
      console.error('Sipariş hatası:', error)
      alert(error instanceof Error ? error.message : 'Sipariş oluşturulurken bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Siparişiniz Alındı!</h2>
        <p className="text-gray-500 mb-2">Sipariş Numaranız:</p>
        <p className="text-xl font-mono font-bold text-blue-600 mb-6">{orderNumber}</p>
        <p className="text-gray-500 mb-6">Siparişiniz en kısa sürede hazırlanacaktır.</p>
        <Button onClick={() => router.push('/orders')}>
          Siparişlerimi Görüntüle
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sipariş Tamamla</h1>
        <p className="text-gray-500">Teslimat bilgilerinizi girin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Teslimat Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ahmet Yılmaz"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="ahmet@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="05XX XXX XX XX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Teslimat adresinizi girin"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    `Siparişi Onayla (${formatCurrency(getCartTotal())})`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    {formatCurrency(
                      (typeof item.price === 'string' ? parseFloat(item.price) : item.price) *
                        item.quantity
                    )}
                  </span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ara Toplam</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kargo</span>
                  <span className="text-green-600">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2">
                  <span>Toplam</span>
                  <span className="text-blue-600">{formatCurrency(getCartTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}