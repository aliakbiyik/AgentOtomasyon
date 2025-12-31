'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users, Package, ShoppingCart, TrendingUp, AlertTriangle, HeadphonesIcon, FileUser, Sparkles, Loader2,
  BarChart3, ArrowUpRight, DollarSign, Calendar, Clock, ChevronRight, Zap,
  Link
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

  useEffect(() => { fetchDashboard() }, [])

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        setData(await response.json())
      } else {
        // Fallback Mock Data
        setData({
          customers: { total: 124 },
          products: { total: 48, criticalStock: 3 },
          orders: { total: 156, today: 12, pending: 5 },
          sales: { today: 45000, total: 1250000 },
          tickets: { open: 4 },
          employees: { total: 12 },
          cvApplications: { pending: 8 },
          invoices: { pending: 15 }
        })
      }
    } catch (error) {
      toast.error('Dashboard verisi alınamadı, demo moduna geçiliyor.')
    } finally {
      setLoading(false)
    }
  }

  const handleForecast = async () => {
    setForecastLoading(true)
    // Simüle edilmiş AI tahmini (n8n bağlantın için hazır yapı)
    setTimeout(() => {
      setForecast('Gelecek hafta satışlarında %15 artış bekleniyor. Özellikle elektronik kategorisinde talep yoğunlaşabilir.');
      toast.success('AI Analizi Tamamlandı');
      setForecastLoading(false)
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!data) return null;

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(num)
  }

  const stats = [
    { title: 'Toplam Ciro', value: formatCurrency(data.sales.total), trend: '+12%', icon: DollarSign, color: 'indigo' },
    { title: 'Siparişler', value: data.orders.total, trend: `+${data.orders.today} bugün`, icon: ShoppingCart, color: 'blue' },
    { title: 'Müşteri Kitlesi', value: data.customers.total, trend: '+4 yeni', icon: Users, color: 'purple' },
    { title: 'Kritik Stok', value: data.products.criticalStock, trend: 'Acil Müdahale', icon: AlertTriangle, color: 'red' },
  ]

  const salesByDay = [
    { day: 'Pzt', amount: 12500 }, { day: 'Sal', amount: 18200 }, { day: 'Çar', amount: 15800 },
    { day: 'Per', amount: 22100 }, { day: 'Cum', amount: 28500 }, { day: 'Cmt', amount: 35200 }, { day: 'Paz', amount: 19800 }
  ]
  const maxSales = Math.max(...salesByDay.map(d => d.amount))

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Kontrol Paneli</h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" /> Son güncelleme: Bugün, 12:45
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest h-11">Rapor İndir</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest h-11 shadow-lg shadow-indigo-200">
            <Zap className="w-4 h-4 mr-2 fill-current" /> Hızlı Satış
          </Button>
        </div>
      </div>

      {/* Stats Grid - Enhanced with Glows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-20", `bg-${stat.color}-600`)} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className={cn("font-black text-[10px] uppercase border-0 rounded-full px-3 py-1", `bg-${stat.color}-50 text-${stat.color}-700`)}>
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Performance Chart */}
        <Card className="lg:col-span-2 border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Satış Performansı</CardTitle>
                <CardDescription className="font-medium text-slate-400">Son 7 günün finansal analizi</CardDescription>
              </div>
              <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase rounded-lg bg-white shadow-sm">HAFTALIK</Button>
                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase rounded-lg text-slate-400">AYLIK</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            <div className="flex items-end justify-between h-64 gap-3">
              {salesByDay.map((day, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                  <div className="relative w-full flex flex-col items-center gap-2 group">
                    <div
                      className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md transition-all scale-75 group-hover:scale-100 z-10"
                    >
                      {formatCurrency(day.amount)}
                    </div>
                    <div
                      className="w-full max-w-[48px] bg-slate-100 rounded-2xl transition-all duration-500 group-hover:bg-indigo-600 group-hover:shadow-2xl group-hover:shadow-indigo-500/40"
                      style={{ height: `${(day.amount / maxSales) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">{day.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI & Side Information */}
        <div className="space-y-6">
          {/* AI Forecast Card - High-end Glassmorphism */}
          <Card className="relative overflow-hidden border-0 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-all" />
            <CardHeader className="p-8">
              <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Satış Asistanı</span>
              </div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">Haftalık Öngörü</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-sm text-slate-300 leading-relaxed font-medium mb-8 italic">
                {forecast || "Verileriniz analiz edilerek gelecek hafta için özel bir satış stratejisi oluşturabilirim."}
              </p>
              <Button
                onClick={handleForecast}
                disabled={forecastLoading}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                {forecastLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>ANALİZİ BAŞLAT <ArrowUpRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Category Summary */}
          <Card className="border-0 bg-white shadow-sm rounded-[2.5rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest">Kategori Gücü</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-5">
              {[
                { name: 'Telefon', count: 45, color: 'bg-indigo-500', val: 75 },
                { name: 'Bilgisayar', count: 28, color: 'bg-blue-500', val: 55 },
                { name: 'Aksesuar', count: 18, color: 'bg-purple-500', val: 40 }
              ].map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-slate-600 tracking-widest">{cat.name}</span>
                    <span className="text-slate-900">{cat.count} Ürün</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={cn(cat.color, "h-full rounded-full transition-all duration-1000")} style={{ width: `${cat.val}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modern Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { title: "Destek Talebi", sub: `${data.tickets.open} Açık Talep`, icon: HeadphonesIcon, color: "blue", href: "/admin/support" },
          { title: "Kritik Envanter", sub: `${data.products.criticalStock} Ürün`, icon: Package, color: "red", href: "/admin/inventory" },
          { title: "Yeni Başvurular", sub: `${data.cvApplications.pending} CV Bekliyor`, icon: FileUser, color: "purple", href: "/admin/cv-applications" },
          { title: "Personel Kaydı", sub: `${data.employees.total} Aktif Kişi`, icon: Users, color: "indigo", href: "/admin/hr" }
        ].map((item, idx) => (
          <Link href={item.href} key={idx}>
            <div className="group p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 shadow-lg", `bg-${item.color}-50 text-${item.color}-600 shadow-${item.color}-100`)}>
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import {
//   Users, Package, ShoppingCart, TrendingUp, AlertTriangle, HeadphonesIcon, FileUser, Sparkles, Loader2,
//   BarChart3, PieChart, ArrowUpRight, DollarSign, Calendar
// } from 'lucide-react'
// import { toast } from 'sonner'

// interface DashboardData {
//   customers: { total: number }
//   products: { total: number; criticalStock: number }
//   orders: { total: number; today: number; pending: number }
//   sales: { today: string | number; total: string | number }
//   tickets: { open: number }
//   employees: { total: number }
//   cvApplications: { pending: number }
//   invoices: { pending: number }
//   recentOrders?: { date: string; total: number }[]
//   categoryStats?: { name: string; count: number }[]
// }

// export default function AdminDashboard() {
//   const [data, setData] = useState<DashboardData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [forecastLoading, setForecastLoading] = useState(false)
//   const [forecast, setForecast] = useState<string | null>(null)

//   useEffect(() => { fetchDashboard() }, [])

//   const fetchDashboard = async () => {
//     try {
//       // Mocking data for development/preview if API fails or is empty
//       const response = await fetch('/api/dashboard')
//       if (response.ok) {
//         const result = await response.json()
//         setData(result)
//       } else {
//         // Fallback mock data
//         setData({
//           customers: { total: 124 },
//           products: { total: 48, criticalStock: 3 },
//           orders: { total: 156, today: 12, pending: 5 },
//           sales: { today: 45000, total: 1250000 },
//           tickets: { open: 4 },
//           employees: { total: 12 },
//           cvApplications: { pending: 8 },
//           invoices: { pending: 15 }
//         })
//       }
//     } catch (error) {
//       console.error('Dashboard verisi alınamadı:', error)
//       toast.error('Veri yükleme hatası, mock veri gösteriliyor.')
//       // Fallback mock data
//       setData({
//         customers: { total: 124 },
//         products: { total: 48, criticalStock: 3 },
//         orders: { total: 156, today: 12, pending: 5 },
//         sales: { today: 45000, total: 1250000 },
//         tickets: { open: 4 },
//         employees: { total: 12 },
//         cvApplications: { pending: 8 },
//         invoices: { pending: 15 }
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleForecast = async () => {
//     setForecastLoading(true)
//     try {
//       const salesData = `Bugünkü satış: ${data?.sales.today} TL, Toplam satış: ${data?.sales.total} TL, Bugünkü sipariş: ${data?.orders.today}, Toplam sipariş: ${data?.orders.total}`

//       // Simulate API call for now if n8n is not reachable
//       const response = await fetch('http://localhost:5678/webhook/sales-forecast', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ salesData })
//       })

//       if (response.ok) {
//         const result = await response.json()
//         setForecast(result.output || 'Gelecek hafta satışlarında %15 artış bekleniyor. Özellikle elektronik kategorisinde talep yoğunlaşabilir.')
//         toast.success('AI tahmini oluşturuldu')
//       } else {
//         // Simulate success for demo
//         setTimeout(() => {
//           setForecast('Gelecek hafta satışlarında %15 artış bekleniyor. Özellikle elektronik kategorisinde talep yoğunlaşabilir.');
//           toast.success('AI tahmini oluşturuldu (Demo)');
//         }, 1500)
//       }
//     } catch (error) {
//       console.error('Satış tahmini hatası:', error)
//       // Simulate success for demo
//       setTimeout(() => {
//         setForecast('Gelecek hafta satışlarında %15 artış bekleniyor. Özellikle elektronik kategorisinde talep yoğunlaşabilir.');
//         toast.success('AI tahmini oluşturuldu (Demo)');
//       }, 1500)
//     } finally {
//       setForecastLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-100px)]">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-10 h-10 animate-spin text-primary" />
//           <p className="text-gray-500 font-medium">Dashboard yükleniyor...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!data) return null;

//   const formatCurrency = (value: string | number) => {
//     const num = typeof value === 'string' ? parseFloat(value) : value
//     return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(num)
//   }

//   const stats = [
//     { title: 'Toplam Satış', value: formatCurrency(data.sales.total), trend: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
//     { title: 'Siparişler', value: data.orders.total, trend: `+${data.orders.today} bugün`, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
//     { title: 'Müşteriler', value: data.customers.total, trend: '+4 yeni', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
//     { title: 'Kritik Stok', value: data.products.criticalStock, trend: 'Acil', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
//   ]

//   // Basit bar chart için veri & color logic
//   const salesByDay = [
//     { day: 'Pzt', amount: 12500 },
//     { day: 'Sal', amount: 18200 },
//     { day: 'Çar', amount: 15800 },
//     { day: 'Per', amount: 22100 },
//     { day: 'Cum', amount: 28500 },
//     { day: 'Cmt', amount: 35200 },
//     { day: 'Paz', amount: 19800 },
//   ]
//   const maxSales = Math.max(...salesByDay.map(d => d.amount))

//   const categoryData = [
//     { name: 'Telefonlar', count: 45, color: 'bg-blue-500' },
//     { name: 'Bilgisayarlar', count: 28, color: 'bg-indigo-500' },
//     { name: 'Aksesuarlar', count: 18, color: 'bg-orange-500' },
//     { name: 'Tabletler', count: 9, color: 'bg-purple-500' },
//   ]
//   const totalCategory = categoryData.reduce((a, b) => a + b.count, 0)

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
//         <p className="text-gray-500 mt-1">İşletmenizin genel durumunu ve performansını izleyin.</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <Card key={index} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`p-3 rounded-xl ${stat.bg}`}>
//                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
//                 </div>
//                 <Badge variant="outline" className="font-normal bg-white">
//                   {stat.trend}
//                 </Badge>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
//                 <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Chart */}
//         <Card className="lg:col-span-2 border-gray-100 shadow-sm">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 text-lg">
//               <BarChart3 className="w-5 h-5 text-gray-500" />
//               Haftalık Satış Performansı
//             </CardTitle>
//             <CardDescription>Son 7 günün satış verileri</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-end justify-between h-64 gap-4 mt-4">
//               {salesByDay.map((day, i) => (
//                 <div key={i} className="flex flex-col items-center flex-1 group">
//                   <div className="relative w-full h-full flex items-end justify-center">
//                     <div
//                       className="w-full max-w-[40px] bg-primary/80 rounded-t-lg transition-all group-hover:bg-primary group-hover:shadow-lg hover:first-letter:h-[105%]"
//                       style={{ height: `${(day.amount / maxSales) * 100}%` }}
//                     >
//                       <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity">
//                         {(day.amount / 1000).toFixed(1)}k ₺
//                       </div>
//                     </div>
//                   </div>
//                   <span className="text-sm font-medium text-gray-600 mt-3">{day.day}</span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Side Cards */}
//         <div className="space-y-6">
//           {/* AI Forecast */}
//           <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm overflow-hidden">
//             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full opacity-50 -mr-8 -mt-8"></div>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 text-purple-700">
//                 <Sparkles className="w-5 h-5" />
//                 AI Satış Asistanı
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm text-gray-600 mb-6 min-h-[4rem]">
//                 {forecast || "Satış verilerinizi analiz ederek gelecek hafta için öngörülerde bulunabilirim."}
//               </p>
//               <Button onClick={handleForecast} disabled={forecastLoading} className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200">
//                 {forecastLoading ? (<><Loader2 className="w-4 h-4 animate-spin mr-2" />Analiz Yapılıyor...</>) : (<>Analizi Başlat <ArrowUpRight className="w-4 h-4 ml-2" /></>)}
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Category Stats */}
//           <Card className="border-gray-100 shadow-sm">
//             <CardHeader>
//               <CardTitle className="text-lg">Kategori Dağılımı</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {categoryData.map((cat, i) => (
//                 <div key={i} className="space-y-1">
//                   <div className="flex justify-between text-sm">
//                     <span className="font-medium text-gray-700">{cat.name}</span>
//                     <span className="text-gray-500">%{((cat.count / totalCategory) * 100).toFixed(0)}</span>
//                   </div>
//                   <div className="w-full bg-gray-100 rounded-full h-2">
//                     <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${(cat.count / totalCategory) * 100}%` }} />
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Actions Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer group">
//           <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-blue-600">
//             <HeadphonesIcon className="w-5 h-5 text-blue-600" />
//           </div>
//           <h4 className="font-semibold text-gray-900">Destek Talepleri</h4>
//           <p className="text-sm text-gray-500 mt-1">{data.tickets.open} açık talep var</p>
//         </div>

//         <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-orange-100 hover:bg-orange-50 transition-colors cursor-pointer group">
//           <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-orange-600">
//             <Package className="w-5 h-5 text-orange-600" />
//           </div>
//           <h4 className="font-semibold text-gray-900">Stok Durumu</h4>
//           <p className="text-sm text-gray-500 mt-1">{data.products.criticalStock} kritik ürün</p>
//         </div>

//         <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-pink-100 hover:bg-pink-50 transition-colors cursor-pointer group">
//           <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-pink-600">
//             <FileUser className="w-5 h-5 text-pink-600" />
//           </div>
//           <h4 className="font-semibold text-gray-900">CV Havuzu</h4>
//           <p className="text-sm text-gray-500 mt-1">{data.cvApplications.pending} yeni başvuru</p>
//         </div>

//         <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-green-100 hover:bg-green-50 transition-colors cursor-pointer group">
//           <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-green-600">
//             <Calendar className="w-5 h-5 text-green-600" />
//           </div>
//           <h4 className="font-semibold text-gray-900">Takvim</h4>
//           <p className="text-sm text-gray-500 mt-1"> 3 toplantı var</p>
//         </div>
//       </div>
//     </div>
//   )
// }