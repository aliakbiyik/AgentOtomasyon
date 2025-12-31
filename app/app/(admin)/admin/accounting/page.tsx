'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Wallet, 
  ReceiptText, 
  Download, 
  Plus, 
  Calendar,
  DollarSign,
  PieChart,
  ChevronRight,
  History,
  ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Invoice {
  id: number
  invoiceNumber: string
  amount: string | number
  taxAmount: string | number
  totalAmount: string | number
  status: string
  createdAt: string
  paidAt: string | null
  order: {
    orderNumber: string
    customer: {
      name: string
    }
  }
}

interface Expense {
  id: number
  description: string
  amount: string | number
  category: string
  date: string
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Beklemede', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  PAID: { label: 'Ödendi', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  CANCELLED: { label: 'İptal', color: 'bg-rose-50 text-rose-600 border-rose-100' }
}

export default function AccountingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [invoicesRes, expensesRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/expenses')
      ])
      
      const invoicesData = await invoicesRes.json()
      const expensesData = await expensesRes.json()
      
      setInvoices(invoicesData)
      setExpenses(Array.isArray(expensesData) ? expensesData : [])
    } catch (error) {
      console.error('Veriler alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

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
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalIncome = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => {
      const amount = typeof i.totalAmount === 'string' ? parseFloat(i.totalAmount) : i.totalAmount
      return sum + amount
    }, 0)

  const totalExpenses = expenses.reduce((sum, e) => {
    const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount
    return sum + amount
  }, 0)

  const profit = totalIncome - totalExpenses

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Finansal Yönetim</h1>
          <p className="text-slate-500 font-medium">Gelir, gider dengesini ve faturalandırma süreçlerini izleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-black text-xs uppercase tracking-widest h-11">
            <Download className="w-4 h-4 mr-2" /> Mali Rapor
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest h-11 shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4 mr-2" /> Gider Kaydet
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Brüt Gelir', val: totalIncome, icon: TrendingUp, color: 'emerald', sub: 'Tahsil Edilen' },
          { label: 'Toplam Gider', val: totalExpenses, icon: TrendingDown, color: 'rose', sub: 'Operasyonel' },
          { label: 'Net Kar', val: profit, icon: Wallet, color: profit >= 0 ? 'indigo' : 'rose', sub: 'Mevcut Durum' },
          { label: 'Bekleyen Fatura', val: invoices.filter(i => i.status === 'PENDING').length, icon: ReceiptText, color: 'amber', sub: 'Tahsilat Bekleyen', isUnit: true }
        ].map((s, i) => (
          <Card key={i} className="border-0 bg-white shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
            <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-20", `bg-${s.color}-600`)} />
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h3 className={cn("text-2xl font-black tracking-tight", `text-${s.color}-600`)}>
                  {s.isUnit ? s.val : formatCurrency(s.val)}
                </h3>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{s.sub}</p>
              </div>
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", `bg-${s.color}-50 text-${s.color}-600`)}>
                <s.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Faturalar Tablosu */}
        <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Faturalar</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-[10px] uppercase">Tümünü Gör</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Fatura No</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Müşteri</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Tutar</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center pr-8">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                   <TableRow><TableCell colSpan={4} className="h-40 text-center text-slate-300 uppercase text-xs font-bold tracking-widest">Kayıt Bulunamadı</TableCell></TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="group border-slate-50 hover:bg-slate-50/40 transition-colors">
                      <TableCell className="pl-8 py-5">
                        <span className="font-mono font-black text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                          {invoice.invoiceNumber}
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-700 text-sm">{invoice.order.customer.name}</TableCell>
                      <TableCell className="text-right font-black text-slate-900 tracking-tight">{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell className="text-center pr-8">
                        <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border-0 shadow-sm", statusConfig[invoice.status]?.color)}>
                          {statusConfig[invoice.status]?.label || invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Giderler Tablosu */}
        <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden flex flex-col">
          <CardHeader className="p-8 border-b border-slate-50">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                    <History className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Giderler</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-rose-600 font-bold text-[10px] uppercase">Raporla</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Açıklama</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Kategori</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Tutar</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center pr-8">Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-40 text-center text-slate-300 uppercase text-xs font-bold tracking-widest">Gider Kaydı Yok</TableCell></TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense.id} className="group border-slate-50 hover:bg-slate-50/40 transition-colors">
                      <TableCell className="pl-8 py-5">
                        <span className="font-bold text-slate-800 tracking-tight">{expense.description}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold text-[9px] border-0 px-2 py-0.5 uppercase tracking-widest">
                          {expense.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-rose-600 tracking-tight">
                        -{formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="text-center pr-8">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400">
                          <Calendar className="w-3 h-3" /> {formatDate(expense.date)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
// 'use client'

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { TrendingUp, TrendingDown, FileText } from 'lucide-react'

// interface Invoice {
//   id: number
//   invoiceNumber: string
//   amount: string | number
//   taxAmount: string | number
//   totalAmount: string | number
//   status: string
//   createdAt: string
//   paidAt: string | null
//   order: {
//     orderNumber: string
//     customer: {
//       name: string
//     }
//   }
// }

// interface Expense {
//   id: number
//   description: string
//   amount: string | number
//   category: string
//   date: string
// }

// const statusColors: Record<string, string> = {
//   PENDING: 'bg-yellow-100 text-yellow-800',
//   PAID: 'bg-green-100 text-green-800',
//   CANCELLED: 'bg-red-100 text-red-800'
// }

// const statusLabels: Record<string, string> = {
//   PENDING: 'Beklemede',
//   PAID: 'Ödendi',
//   CANCELLED: 'İptal'
// }

// export default function AccountingPage() {
//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [expenses, setExpenses] = useState<Expense[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [invoicesRes, expensesRes] = await Promise.all([
//         fetch('/api/invoices'),
//         fetch('/api/expenses')
//       ])
      
//       const invoicesData = await invoicesRes.json()
//       const expensesData = await expensesRes.json()
      
//       setInvoices(invoicesData)
//       setExpenses(Array.isArray(expensesData) ? expensesData : [])
//     } catch (error) {
//       console.error('Veriler alınamadı:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatCurrency = (value: string | number) => {
//     const num = typeof value === 'string' ? parseFloat(value) : value
//     return new Intl.NumberFormat('tr-TR', {
//       style: 'currency',
//       currency: 'TRY'
//     }).format(num)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('tr-TR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p className="text-gray-500">Yükleniyor...</p>
//       </div>
//     )
//   }

//   const totalIncome = invoices
//     .filter(i => i.status === 'PAID')
//     .reduce((sum, i) => {
//       const amount = typeof i.totalAmount === 'string' ? parseFloat(i.totalAmount) : i.totalAmount
//       return sum + amount
//     }, 0)

//   const totalExpenses = expenses.reduce((sum, e) => {
//     const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount
//     return sum + amount
//   }, 0)

//   const profit = totalIncome - totalExpenses

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">Muhasebe</h1>
//         <p className="text-gray-500">Gelir, gider ve faturaları yönetin</p>
//       </div>

//       {/* Özet Kartları */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
//               <TrendingUp className="w-4 h-4 text-green-600" />
//               Toplam Gelir
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-green-600">
//               {formatCurrency(totalIncome)}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
//               <TrendingDown className="w-4 h-4 text-red-600" />
//               Toplam Gider
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-red-600">
//               {formatCurrency(totalExpenses)}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">
//               Net Kar
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {formatCurrency(profit)}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">
//               Bekleyen Fatura
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-yellow-600">
//               {invoices.filter(i => i.status === 'PENDING').length}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Faturalar */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="w-5 h-5" />
//               Faturalar
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Fatura No</TableHead>
//                   <TableHead>Müşteri</TableHead>
//                   <TableHead>Tutar</TableHead>
//                   <TableHead>Durum</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {invoices.map((invoice) => (
//                   <TableRow key={invoice.id}>
//                     <TableCell className="font-medium">
//                       {invoice.invoiceNumber}
//                     </TableCell>
//                     <TableCell>{invoice.order.customer.name}</TableCell>
//                     <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
//                     <TableCell>
//                       <Badge className={statusColors[invoice.status]}>
//                         {statusLabels[invoice.status]}
//                       </Badge>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {/* Giderler */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingDown className="w-5 h-5" />
//               Giderler
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Açıklama</TableHead>
//                   <TableHead>Kategori</TableHead>
//                   <TableHead>Tutar</TableHead>
//                   <TableHead>Tarih</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {expenses.map((expense) => (
//                   <TableRow key={expense.id}>
//                     <TableCell className="font-medium">
//                       {expense.description}
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline">{expense.category}</Badge>
//                     </TableCell>
//                     <TableCell className="text-red-600">
//                       {formatCurrency(expense.amount)}
//                     </TableCell>
//                     <TableCell className="text-gray-500">
//                       {formatDate(expense.date)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }