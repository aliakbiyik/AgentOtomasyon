'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, Loader2, ArrowLeft, ShieldCheck, Truck, CreditCard, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

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

  const { customer } = useAuth()

  useEffect(() => {
    loadCart()
  }, [])

  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || ''
      }))
    }
  }, [customer])

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length === 0 && !success) {
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
      currency: 'TRY',
      minimumFractionDigits: 0,
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
      const customerRes = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      let customer
      if (customerRes.status === 201) {
        customer = await customerRes.json()
      } else {
        const customersRes = await fetch('/api/customers')
        const customers = await customersRes.json()
        customer = customers.find((c: any) => c.email === formData.email)
      }

      if (!customer) throw new Error('Müşteri oluşturulamadı')

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

      if (!orderRes.ok) throw new Error('Sipariş oluşturulamadı')

      const order = await orderRes.json()
      setOrderNumber(order.orderNumber)
      setSuccess(true)
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cart-updated'))

    } catch (error) {
      alert(error instanceof Error ? error.message : 'Sipariş oluşturulurken bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Siparişiniz Alındı!</h2>
        <p className="text-slate-500 mb-8 max-w-sm font-medium leading-relaxed">
          Harika bir tercih yaptınız. Siparişiniz sisteme kaydedildi ve hazırlık süreci başladı.
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-10 w-full max-w-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sipariş Kodunuz</p>
          <p className="text-3xl font-black text-indigo-600 font-mono tracking-widest">{orderNumber}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button onClick={() => router.push('/orders')} className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all">
            SİPARİŞLERİM
          </Button>
          <Button onClick={() => router.push('/')} variant="ghost" className="flex-1 h-14 text-slate-400 font-bold hover:text-slate-900">
            ANASAYFAYA DÖN
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col gap-2 mb-10 px-2">
        <Link href="/cart" className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-[10px] uppercase tracking-widest mb-2">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Sepete Geri Dön
        </Link>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Siparişi Tamamla</h1>
        <p className="text-slate-500 text-sm font-medium">Lütfen teslimat ve iletişim bilgilerinizi doğrulayın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Checkout Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <Truck className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Teslimat Bilgileri</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Ad Soyad</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ahmet Yılmaz"
                      className="h-12 bg-slate-50 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">E-posta</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="ahmet@email.com"
                      className="h-12 bg-slate-50 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="05XX XXX XX XX"
                    className="h-12 bg-slate-50 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Teslimat Adresi</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Mahalle, sokak, no ve daire bilgilerini detaylıca giriniz..."
                    rows={4}
                    className="bg-slate-50 border-none rounded-[1.5rem] font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20 resize-none"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-900/10"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `SİPARİŞİ ONAYLA (${formatCurrency(getCartTotal())})`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">256-bit SSL Güvenli Ödeme Sistemi</p>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <CreditCard className="w-6 h-6 text-indigo-500" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Tüm Kredi Kartları ile Taksit İmkanı</p>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <Card className="sticky top-24 border-0 bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Özet</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 line-clamp-1">{item.name}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Adet: {item.quantity}</span>
                    </div>
                    <span className="font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm font-bold text-slate-400">
                  <span className="uppercase tracking-widest">Ara Toplam</span>
                  <span className="text-slate-900">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-400">
                  <span className="uppercase tracking-widest">Kargo</span>
                  <span className="text-emerald-500 uppercase">Ücretsiz</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ödenecek Tutar</span>
                  <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                    {formatCurrency(getCartTotal())}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { CheckCircle, Loader2 } from 'lucide-react'

// interface CartItem {
//   id: number
//   name: string
//   price: string | number
//   quantity: number
// }

// export default function CheckoutPage() {
//   const router = useRouter()
//   const [cartItems, setCartItems] = useState<CartItem[]>([])
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [orderNumber, setOrderNumber] = useState('')

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: ''
//   })

//   useEffect(() => {
//     loadCart()
//   }, [])

//   const loadCart = () => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]')
//     if (cart.length === 0) {
//       router.push('/cart')
//       return
//     }
//     setCartItems(cart)
//     setLoading(false)
//   }

//   const formatCurrency = (value: string | number) => {
//     const num = typeof value === 'string' ? parseFloat(value) : value
//     return new Intl.NumberFormat('tr-TR', {
//       style: 'currency',
//       currency: 'TRY'
//     }).format(num)
//   }

//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => {
//       const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
//       return total + price * item.quantity
//     }, 0)
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSubmitting(true)

//     try {
//       // 1. Müşteri oluştur veya bul
//       const customerRes = await fetch('/api/customers', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address
//         })
//       })

//       let customer
//       if (customerRes.status === 201) {
//         customer = await customerRes.json()
//       } else {
//         // Müşteri zaten varsa, email ile bul
//         const customersRes = await fetch('/api/customers')
//         const customers = await customersRes.json()
//         customer = customers.find((c: any) => c.email === formData.email)
//       }

//       if (!customer) {
//         throw new Error('Müşteri oluşturulamadı')
//       }

//       // 2. Sipariş oluştur
//       const orderRes = await fetch('/api/orders', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           customerId: customer.id,
//           items: cartItems.map((item) => ({
//             productId: item.id,
//             quantity: item.quantity,
//             price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
//           }))
//         })
//       })

//       if (!orderRes.ok) {
//         const error = await orderRes.json()
//         throw new Error(error.error || 'Sipariş oluşturulamadı')
//       }

//       const order = await orderRes.json()
//       setOrderNumber(order.orderNumber)
//       setSuccess(true)

//       // Sepeti temizle
//       localStorage.removeItem('cart')

//     } catch (error) {
//       console.error('Sipariş hatası:', error)
//       alert(error instanceof Error ? error.message : 'Sipariş oluşturulurken bir hata oluştu')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <p className="text-gray-500">Yükleniyor...</p>
//       </div>
//     )
//   }

//   if (success) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Siparişiniz Alındı!</h2>
//         <p className="text-gray-500 mb-2">Sipariş Numaranız:</p>
//         <p className="text-xl font-mono font-bold text-blue-600 mb-6">{orderNumber}</p>
//         <p className="text-gray-500 mb-6">Siparişiniz en kısa sürede hazırlanacaktır.</p>
//         <Button onClick={() => router.push('/orders')}>
//           Siparişlerimi Görüntüle
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Sipariş Tamamla</h1>
//         <p className="text-gray-500">Teslimat bilgilerinizi girin</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Checkout Form */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle>Teslimat Bilgileri</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Ad Soyad *</Label>
//                     <Input
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="Ahmet Yılmaz"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">E-posta *</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="ahmet@email.com"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Telefon *</Label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="05XX XXX XX XX"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="address">Adres *</Label>
//                   <Textarea
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Teslimat adresinizi girin"
//                     rows={3}
//                   />
//                 </div>

//                 <Button type="submit" className="w-full" size="lg" disabled={submitting}>
//                   {submitting ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       İşleniyor...
//                     </>
//                   ) : (
//                     `Siparişi Onayla (${formatCurrency(getCartTotal())})`
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Order Summary */}
//         <div>
//           <Card className="sticky top-24">
//             <CardHeader>
//               <CardTitle>Sipariş Özeti</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="flex justify-between text-sm">
//                   <span className="text-gray-600">
//                     {item.name} x {item.quantity}
//                   </span>
//                   <span>
//                     {formatCurrency(
//                       (typeof item.price === 'string' ? parseFloat(item.price) : item.price) *
//                         item.quantity
//                     )}
//                   </span>
//                 </div>
//               ))}
//               <div className="border-t pt-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Ara Toplam</span>
//                   <span>{formatCurrency(getCartTotal())}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Kargo</span>
//                   <span className="text-green-600">Ücretsiz</span>
//                 </div>
//                 <div className="flex justify-between text-lg font-bold mt-2">
//                   <span>Toplam</span>
//                   <span className="text-blue-600">{formatCurrency(getCartTotal())}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }