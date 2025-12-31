'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Package, ShoppingBag, Truck, CheckCircle2, Clock, XCircle, ArrowRight, Calendar, SearchCode, MailCheck, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Order {
  id: number
  orderNumber: string
  status: string
  totalAmount: string | number
  createdAt: string
  items: {
    product: { name: string; image?: string }
    quantity: number
    price: string | number
  }[]
}

const statusConfig: Record<string, { label: string; color: string; icon: any; progress: number }> = {
  PENDING: { label: 'Hazırlanıyor', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock, progress: 25 },
  CONFIRMED: { label: 'Onaylandı', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: MailCheck, progress: 50 },
  SHIPPED: { label: 'Kargoda', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Truck, progress: 75 },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Package, progress: 100 },
  CANCELLED: { label: 'İptal Edildi', color: 'bg-red-50 text-red-600 border-red-100', icon: XCircle, progress: 0 }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders?scope=me')
        if (response.status === 401) {
          // Kullanıcı giriş yapmamış
          setLoading(false)
          return
        }

        if (!response.ok) throw new Error('API hatası')

        const data = await response.json()
        setOrders(data)
      } catch (error) {
        toast.error('Siparişler yüklenirken bir sorun oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Siparişleriniz yükleniyor...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-20 px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8">
            <ShoppingBag className="w-12 h-12 text-indigo-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Henüz Siparişiniz Yok</h2>
          <p className="text-slate-500 mb-10 max-w-sm font-medium leading-relaxed">
            Hesabınızda kayıtlı geçmiş bir sipariş bulunamadı. Hemen alışverişe başlayın!
          </p>
          <div className="flex gap-4">
            <Link href="/products">
              <Button className="h-12 px-8 rounded-xl bg-slate-900 text-white font-black tracking-widest uppercase hover:scale-105 transition-all">
                Alışverişe Başla
              </Button>
            </Link>
            {/* Eğer giriş yapılmamışsa gösterilebilir */}
            {/* <Link href="/login">
                        <Button variant="outline" className="h-12 px-8 rounded-xl font-black tracking-widest uppercase">
                            Giriş Yap
                        </Button>
                    </Link> */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20 pt-10 px-4">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Siparişlerim</h1>
          <p className="text-slate-500 font-medium mt-2">Geçmiş siparişlerinizin durumunu buradan takip edebilirsiniz.</p>
        </div>
        <div className="hidden md:block">
          <Badge variant="outline" className="px-4 py-2 rounded-full border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-xs">
            Toplam {orders.length} Sipariş
          </Badge>
        </div>
      </div>

      <div className="grid gap-10">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.PENDING
          const StatusIcon = status.icon

          return (
            <Card key={order.id} className="border-0 bg-white shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 rounded-[2.5rem] overflow-hidden group">
              <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-slate-900 text-white border-0 font-mono text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
                        #{order.orderNumber}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Toplam Ödenen</p>
                      <p className="text-xl font-black text-indigo-600 tracking-tight">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    <Badge variant="outline" className={cn("px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest gap-2 shadow-sm border", status.color)}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {/* Visual Progress Bar */}
                {order.status !== 'CANCELLED' && (
                  <div className="mb-12 max-w-3xl mx-auto">
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-1000 ease-out"
                        style={{ width: `${status.progress}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className={cn(status.progress >= 25 && "text-indigo-600")}>Hazırlanıyor</span>
                      <span className={cn("text-center", status.progress >= 75 && "text-indigo-600")}>Kargoda</span>
                      <span className={cn("text-right", status.progress >= 100 && "text-indigo-600")}>Teslim Edildi</span>
                    </div>
                  </div>
                )}

                <div className="grid gap-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 p-4 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 border border-transparent hover:border-slate-100">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm shrink-0 overflow-hidden">
                        {item.product.image ? (
                          <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt={item.product.name} />
                        ) : (
                          <Package className="w-8 h-8 text-slate-100" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{item.product.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.quantity} Adet x {formatCurrency(item.price)}</p>
                      </div>
                      <div className="font-black text-slate-900 text-right tracking-tight hidden sm:block">
                        {formatCurrency(Number(item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50/50 p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                  Siparişinizle ilgili yardıma mı ihtiyacınız var?
                  <Link href="/support" className="text-indigo-600 hover:underline uppercase tracking-widest font-black ml-1">Destek Alın</Link>
                </p>
                <div className="sm:hidden font-black text-indigo-600 text-xl">
                  {formatCurrency(order.totalAmount)}
                </div>
                <Button variant="ghost" className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                  Fatura Görüntüle <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}