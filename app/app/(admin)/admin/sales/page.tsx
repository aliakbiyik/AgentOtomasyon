'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Filter,
  Download,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Eye,
  X,
  DollarSign,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'

interface Order {
  id: number
  orderNumber: string
  customer: {
    name: string
    email: string
  }
  status: string
  totalAmount: string | number
  createdAt: string
  items: {
    product: { name: string }
    quantity: number
    price: string | number
  }[]
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  PENDING: { label: 'Hazırlanıyor', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  CONFIRMED: { label: 'Onaylandı', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle2 },
  SHIPPED: { label: 'Kargoda', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Truck },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Package },
  CANCELLED: { label: 'İptal Edildi', color: 'bg-red-50 text-red-600 border-red-100', icon: X }
}

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        setOrders(await response.json())
      }
    } catch (error) {
      toast.error('Bağlantı hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (orders.length === 0) return toast.warning('Dışa aktarılacak veri yok')
    const headers = ['Sipariş No', 'Müşteri', 'Email', 'Tutar', 'Durum', 'Tarih']
    const rows = orders.map(o => [
      o.orderNumber, o.customer.name, o.customer.email, o.totalAmount,
      statusConfig[o.status]?.label || o.status, new Date(o.createdAt).toLocaleDateString('tr-TR')
    ])
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n")
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `satis_raporu_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link); link.click(); document.body.removeChild(link)
    toast.success('Satış raporu (.csv) indirildi')
  }

  const updateStatus = async (newStatus: string) => {
    if (!selectedOrder) return
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        toast.success('Sipariş durumu güncellendi')
        fetchOrders()
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (e) { toast.error('Hata oluştu') }
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter

    const amount = Number(order.totalAmount)
    const matchesMin = minAmount === '' || amount >= Number(minAmount)
    const matchesMax = maxAmount === '' || amount <= Number(maxAmount)

    return matchesSearch && matchesStatus && matchesMin && matchesMax
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Satış Yönetimi</h1>
          <p className="text-slate-500 font-medium text-sm">Tüm ticari hareketleri ve sipariş süreçlerini buradan yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-black text-xs uppercase tracking-widest h-11" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Dışa Aktar
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest h-11 shadow-lg shadow-indigo-200">
                <Filter className="w-4 h-4 mr-2" /> Gelişmiş Filtre
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 rounded-2xl shadow-xl border-slate-100">
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">Filtreleme Seçenekleri</h4>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sipariş Durumu</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-100">
                      <SelectValue placeholder="Tümü" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tümü</SelectItem>
                      {Object.entries(statusConfig).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Min Tutar</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-10 rounded-xl bg-slate-50 border-slate-100 placeholder:text-slate-300"
                      value={minAmount}
                      onChange={e => setMinAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max Tutar</Label>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="h-10 rounded-xl bg-slate-50 border-slate-100 placeholder:text-slate-300"
                      value={maxAmount}
                      onChange={e => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
                {(statusFilter !== 'ALL' || minAmount || maxAmount) && (
                  <Button
                    variant="ghost"
                    className="w-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
                    onClick={() => {
                      setStatusFilter('ALL')
                      setMinAmount('')
                      setMaxAmount('')
                    }}
                  >
                    Filtreleri Temizle
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Toplam İşlem', val: orders.length, icon: CreditCard, color: 'indigo' },
          { label: 'Bekleyenler', val: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: 'amber' },
          { label: 'Kargodakiler', val: orders.filter(o => o.status === 'SHIPPED').length, icon: Truck, color: 'blue' },
          { label: 'Başarılı Teslimat', val: orders.filter(o => o.status === 'DELIVERED').length, icon: ShoppingBag, color: 'emerald' }
        ].map((s, i) => (
          <Card key={i} className="border-0 bg-white shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
            <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-20", `bg-${s.color}-600`)} />
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{s.val}</h3>
              </div>
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", `bg-${s.color}-50 text-${s.color}-600`)}>
                <s.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table Content */}
      <Card className="border-0 bg-white shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Sipariş Geçmişi</CardTitle>
              <CardDescription className="font-medium text-slate-400">Son gerçekleştirilen tüm satış kayıtları</CardDescription>
            </div>
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
              <Input
                placeholder="Sipariş no, isim veya e-posta..."
                className="h-12 pl-11 bg-slate-50 border-none rounded-2xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-8 h-12">No / Müşteri</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">İçerik</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Durum</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Tutar</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">Kayıt Bulunamadı</TableCell></TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig['PENDING']
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={order.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => { setSelectedOrder(order); setIsDetailOpen(true); }}>
                      <TableCell className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">#{order.orderNumber}</div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 tracking-tight">{order.customer.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{order.customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-xs font-bold text-slate-600">
                          {order.items.length > 0 ? (
                            <span>{order.items[0].product.name} {order.items.length > 1 && <Badge variant="outline" className="ml-1 border-0 bg-slate-100 text-slate-400 font-black text-[9px]">+{order.items.length - 1}</Badge>}</span>
                          ) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest gap-1.5 border shadow-sm", status.color)}>
                          <StatusIcon className="w-3 h-3" /> {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-900 pr-8 tracking-tighter text-lg">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell className="pr-8">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Order View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] border-0 shadow-2xl p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-10 bg-white border-b border-slate-100">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">İşlem Detayı</p>
                <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Sipariş #{selectedOrder?.orderNumber}</DialogTitle>
                <DialogDescription className="font-medium text-slate-400">
                  {selectedOrder?.customer.name} • {selectedOrder && formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl flex flex-col items-end">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Toplam Tahsilat</span>
                <span className="text-2xl font-black text-indigo-600 tracking-tighter">{selectedOrder && formatCurrency(selectedOrder.totalAmount)}</span>
              </div>
            </div>
          </DialogHeader>

          <div className="p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Süreç Yönetimi</Label>
                <Select value={selectedOrder?.status} onValueChange={updateStatus}>
                  <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl font-black text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20">
                    <SelectValue placeholder="Durum Güncelle" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                    {Object.entries(statusConfig).map(([val, cfg]) => (
                      <SelectItem key={val} value={val} className="font-bold py-3 uppercase text-[10px] tracking-widest">{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><CheckCircle2 className="w-4 h-4" /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ödeme Durumu</p>
                  <p className="text-xs font-bold text-slate-900">BAŞARILI (Online Ödeme)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest pl-6">Ürün</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Adet</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-6">Toplam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder?.items.map((item, idx) => (
                    <TableRow key={idx} className="border-slate-50">
                      <TableCell className="font-bold text-slate-800 pl-6 py-4">{item.product.name}</TableCell>
                      <TableCell className="text-center font-medium text-slate-500">x{item.quantity}</TableCell>
                      <TableCell className="text-right font-black text-slate-900 pr-6 tracking-tight">{formatCurrency(Number(item.price) * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="bg-white p-8 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsDetailOpen(false)} className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Pencereyi Kapat</Button>
            <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-black px-8 h-12 transition-all uppercase tracking-widest text-[10px]" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> FATURAYI YAZDIR (CSV)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

