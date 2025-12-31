'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Loader2,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  User,
  Plus,
  ChevronRight,
  Send,
  MessageSquare,
  History,
  UserPlus
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Ticket {
  id: number
  ticketNumber: string
  subject: string
  description: string
  status: string
  priority: string
  aiSuggestion: string | null
  createdAt: string
  customer: {
    name: string
    email: string
  }
}

interface Customer {
  id: number
  name: string
  email: string
}

const priorityConfig: Record<string, { label: string, color: string }> = {
  LOW: { label: 'Düşük', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  MEDIUM: { label: 'Orta', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  HIGH: { label: 'Yüksek', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  URGENT: { label: 'Acil', color: 'bg-red-50 text-red-600 border-red-100' }
}

const statusConfig: Record<string, { label: string, icon: any, color: string }> = {
  OPEN: { label: 'Açık', icon: AlertCircle, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  IN_PROGRESS: { label: 'İşlemde', icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100' },
  RESOLVED: { label: 'Çözüldü', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  CLOSED: { label: 'Kapatıldı', icon: CheckCircle, color: 'bg-slate-100 text-slate-500 border-slate-200' }
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [solvingId, setSolvingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const [newTicket, setNewTicket] = useState({
    customerId: '',
    subject: '',
    description: '',
    priority: 'MEDIUM'
  })

  useEffect(() => {
    fetchTickets()
    fetchCustomers()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      if (response.ok) setTickets(await response.json())
    } catch (error) {
      toast.error('Talepler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/tickets');
      if (response.ok) {
        const data: Ticket[] = await response.json();
        const unique = Array.from(new Map(data.map(item => [item.customer.email, { id: 1, name: item.customer.name, email: item.customer.email }])).values());
        setCustomers([{ id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com' }, ...unique.map((c, i) => ({ ...c, id: i + 2 }))])
      }
    } catch (e) { }
  }

  const handleSolve = async (ticket: Ticket) => {
    if (ticket.aiSuggestion) {
      setSelectedTicket(ticket); setIsDetailOpen(true); return;
    }
    setSolvingId(ticket.id)
    try {
      const response = await fetch('/api/n8n/ticket-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticket.id, subject: ticket.subject, description: ticket.description })
      })

      if (response.ok) {
        toast.success('AI Analizi başlatıldı, lütfen bekleyin...')
        setTimeout(async () => {
          await fetchTickets()
          setSolvingId(null)
          toast.success('Analiz tamamlandı!')
          // Açık olan modalı güncelle
          const res = await fetch('/api/tickets')
          const newData = await res.json()
          const updated = newData.find((t: Ticket) => t.id === ticket.id)
          if (updated) { setSelectedTicket(updated); setIsDetailOpen(true); }
        }, 4000)
      }
    } catch (error) { setSolvingId(null) }
  }

  const handleResolveTicket = async () => {
    if (!selectedTicket) return;
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      if (response.ok) {
        toast.success('Talep çözüldü ve yanıt gönderildi');
        setIsDetailOpen(false); fetchTickets();
      }
    } catch (e) { toast.error('Hata oluştu') }
  }

  const handleCreateTicket = async () => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTicket, customerId: 1 }) // Demo için 1 sabitlendi
      });
      if (response.ok) {
        toast.success('Yeni talep açıldı');
        setIsCreateOpen(false);
        setNewTicket({ customerId: '', subject: '', description: '', priority: 'MEDIUM' });
        fetchTickets();
      }
    } catch (e) { toast.error('Oluşturulamadı') }
  }

  const filteredTickets = tickets.filter(t => {
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'open' && t.status === 'OPEN') ||
      (activeTab === 'progress' && t.status === 'IN_PROGRESS') ||
      (activeTab === 'resolved' && (t.status === 'RESOLVED' || t.status === 'CLOSED'))
    const s = searchTerm.toLowerCase()
    return matchesTab && (t.subject.toLowerCase().includes(s) || t.customer.name.toLowerCase().includes(s) || t.ticketNumber.toLowerCase().includes(s))
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Destek Yönetimi</h1>
          <p className="text-slate-500 font-medium">AI destekli çözüm merkezi ve müşteri talepleri.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-black text-xs uppercase tracking-widest h-11" onClick={() => toast.info('Filtreleme yakında')}>
            <Filter className="w-4 h-4 mr-2" /> Filtrele
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest h-11 shadow-lg shadow-indigo-200" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Manuel Talep Aç
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Bekleyenler', val: tickets.filter(t => t.status === 'OPEN').length, icon: AlertCircle, color: 'blue' },
          { label: 'İşlemdekiler', val: tickets.filter(t => t.status === 'IN_PROGRESS').length, icon: Clock, color: 'amber' },
          { label: 'Tamamlanan', val: tickets.filter(t => t.status === 'RESOLVED').length, icon: CheckCircle, color: 'emerald' },
          { label: 'AI Hazır', val: tickets.filter(t => t.aiSuggestion).length, icon: Sparkles, color: 'indigo' }
        ].map((s, i) => (
          <Card key={i} className="border-0 bg-white shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
            <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-20", `bg-${s.color}-600`)} />
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{s.val}</h3>
              </div>
              <div className={cn("p-3 rounded-2xl", `bg-${s.color}-50 text-${s.color}-600`)}>
                <s.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Table */}
      <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
              <TabsList className="bg-slate-50 p-1 rounded-xl h-11">
                {['all', 'open', 'progress', 'resolved'].map(t => (
                  <TabsTrigger key={t} value={t} className="rounded-lg text-[10px] font-black uppercase px-6">
                    {t === 'all' ? 'Tümü' : t === 'open' ? 'Açık' : t === 'progress' ? 'İşlemde' : 'Çözüldü'}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
              <Input
                placeholder="Talep no veya müşteri ara..."
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
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">No / Konu</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Müşteri</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Öncelik</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Durum</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">AI Analizi</TableHead>
                <TableHead className="w-20 pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => {
                const status = statusConfig[ticket.status] || statusConfig['OPEN']
                const priority = priorityConfig[ticket.priority] || priorityConfig['MEDIUM']
                return (
                  <TableRow key={ticket.id} className="group border-slate-50 hover:bg-slate-50/40 transition-colors cursor-pointer" onClick={() => { setSelectedTicket(ticket); setIsDetailOpen(true); }}>
                    <TableCell className="pl-8 py-5">
                      <div className="flex flex-col max-w-[280px]">
                        <span className="font-mono text-[10px] font-black text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded mb-1.5 uppercase">#{ticket.ticketNumber}</span>
                        <span className="font-bold text-slate-900 tracking-tight truncate">{ticket.subject}</span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">{ticket.description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-200">
                          <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-black">{ticket.customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{ticket.customer.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{ticket.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-black text-[9px] uppercase border-0 shadow-sm", priority.color)}>
                        {priority.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={cn("flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest", status.color.split(' ')[1])}>
                        <status.icon className="w-3.5 h-3.5" /> {status.label}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); handleSolve(ticket); }}
                        disabled={solvingId === ticket.id}
                        className={cn(
                          "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          ticket.aiSuggestion
                            ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            : "text-slate-400 hover:bg-slate-100 border border-dashed border-slate-200"
                        )}
                      >
                        {solvingId === ticket.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                          ticket.aiSuggestion ? <><Sparkles className="w-3 h-3 mr-2" /> Öneriyi Gör</> : 'AI Analiz'}
                      </Button>
                    </TableCell>
                    <TableCell className="pr-8">
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 transition-all ml-auto" />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] border-0 shadow-2xl p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-10 bg-white border-b border-slate-100">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Destek Talebi Detayı</p>
              <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedTicket?.subject}</DialogTitle>
              <DialogDescription className="font-medium text-slate-400">
                {selectedTicket?.customer.name} • {selectedTicket && new Date(selectedTicket.createdAt).toLocaleString('tr-TR')}
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="p-10 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Müşteri Mesajı
              </h4>
              <p className="text-slate-700 font-medium leading-relaxed">{selectedTicket?.description}</p>
            </div>
            {selectedTicket?.aiSuggestion && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Yapay Zeka Çözüm Önerisi
                </h4>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2rem] text-white shadow-xl">
                  <p className="font-medium leading-relaxed opacity-95 italic">"{selectedTicket.aiSuggestion}"</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="bg-white p-8 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsDetailOpen(false)} className="font-bold text-slate-400 uppercase text-[10px]">Kapat</Button>
            {selectedTicket?.aiSuggestion && selectedTicket.status !== 'RESOLVED' && (
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black px-8 h-12 transition-all uppercase text-[10px]" onClick={handleResolveTicket}>
                <Send className="w-4 h-4 mr-2" /> YANITI ONAYLA VE GÖNDER
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-0 shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-10 pb-0">
            <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Yeni Kayıt Oluştur</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium pt-2">Sisteme manuel olarak müşteri destek talebi ekleyin.</DialogDescription>
          </DialogHeader>
          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Müşteri Seçimi</Label>
              <Select onValueChange={(v) => setNewTicket({ ...newTicket, customerId: v })}>
                <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue placeholder="Bir müşteri seçin" /></SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  {customers.map(c => <SelectItem key={c.id} value={c.id.toString()} className="font-bold py-3">{c.name} ({c.email})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Konu Başlığı</Label>
                <Input placeholder="Örn: İade talebi" value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} className="h-12 bg-slate-50 border-none rounded-xl font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Öncelik</Label>
                <Select value={newTicket.priority} onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}>
                  <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    {Object.entries(priorityConfig).map(([val, cfg]) => <SelectItem key={val} value={val} className="font-bold py-2">{cfg.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detaylı Açıklama</Label>
              <Textarea placeholder="Müşteri şikayetini buraya yazın..." rows={4} value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} className="bg-slate-50 border-none rounded-2xl p-4 resize-none" />
            </div>
          </div>
          <DialogFooter className="bg-slate-50 p-8 pt-4">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="font-bold text-slate-400 uppercase text-[10px]">İptal Et</Button>
            <Button onClick={handleCreateTicket} className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-black px-10 h-12 uppercase text-[10px] shadow-xl">KAYDI OLUŞTUR</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   HeadphonesIcon,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   Sparkles,
//   Loader2,
//   Search,
//   Filter,
//   MoreHorizontal,
//   Mail,
//   User,
//   X,
//   Plus
// } from 'lucide-react'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { Input } from '@/components/ui/input'
// import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// interface Ticket {
//   id: number
//   ticketNumber: string
//   subject: string
//   description: string
//   status: string
//   priority: string
//   aiSuggestion: string | null
//   createdAt: string
//   customer: {
//     name: string
//     email: string
//   }
//   assignedTo: {
//     name: string
//   } | null
// }

// interface Customer {
//   id: number
//   name: string
//   email: string
// }

// const priorityConfig: Record<string, { label: string, color: string, badge: string }> = {
//   LOW: { label: 'Düşük', color: 'text-gray-600', badge: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
//   MEDIUM: { label: 'Orta', color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
//   HIGH: { label: 'Yüksek', color: 'text-orange-600', badge: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
//   URGENT: { label: 'Acil', color: 'text-red-600', badge: 'bg-red-100 text-red-700 hover:bg-red-200' }
// }

// const statusConfig: Record<string, { label: string, icon: any, color: string, bg: string }> = {
//   OPEN: { label: 'Açık', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
//   IN_PROGRESS: { label: 'İşlemde', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
//   RESOLVED: { label: 'Çözüldü', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
//   CLOSED: { label: 'Kapatıldı', icon: CheckCircle, color: 'text-gray-600', bg: 'bg-gray-50' }
// }

// export default function SupportPage() {
//   const [tickets, setTickets] = useState<Ticket[]>([])
//   const [loading, setLoading] = useState(true)
//   const [solvingId, setSolvingId] = useState<number | null>(null)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [activeTab, setActiveTab] = useState('all')
//   const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
//   const [isDetailOpen, setIsDetailOpen] = useState(false)
//   const [isCreateOpen, setIsCreateOpen] = useState(false)

//   // Data for Create Modal
//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [newTicket, setNewTicket] = useState({
//     customerId: '',
//     subject: '',
//     description: '',
//     priority: 'MEDIUM'
//   })

//   useEffect(() => {
//     fetchTickets()
//     fetchCustomers() // Get customers for dropdown
//   }, [])

//   const fetchTickets = async () => {
//     try {
//       const response = await fetch('/api/tickets')
//       if (response.ok) {
//         const data = await response.json()
//         setTickets(data)
//       } else {
//         toast.error('Ticketlar yüklenirken hata oluştu')
//       }
//     } catch (error) {
//       console.error('Ticketlar alınamadı:', error)
//       toast.error('Bağlantı hatası')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchCustomers = async () => {
//     // Temporary mock fetch if API doesn't exist yet, but assuming we can get from tickets for unique list
//     // ideally /api/customers
//     // For now let's just create a quick mock list for UX demo + extract from tickets
//     try {
//       // Fallback: extract from tickets logic or fetch
//       const response = await fetch('/api/tickets'); // Using tickets to get unique customers as quick hack if no endpoint
//       if (response.ok) {
//         const data: Ticket[] = await response.json();
//         const uniqueCustomers = Array.from(new Map(data.map(item => [item.customer.email, { id: 1, name: item.customer.name, email: item.customer.email }])).values());
//         // Note: Real app needs proper ID. For demo, we might need a real /api/customers
//         // Let's create a dummy list for "Demo Customer"
//         setCustomers([
//           { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com' },
//           { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com' },
//           ...uniqueCustomers.map((c, i) => ({ ...c, id: i + 3 }))
//         ])
//       }
//     } catch (e) { }
//   }

//   const handleSolve = async (ticket: Ticket) => {
//     if (ticket.aiSuggestion) {
//       setSelectedTicket(ticket)
//       setIsDetailOpen(true)
//       return
//     }

//     setSolvingId(ticket.id)
//     try {
//       const response = await fetch('/api/n8n/ticket-solve', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: ticket.id,
//           subject: ticket.subject,
//           description: ticket.description
//         })
//       })

//       if (response.ok) {
//         toast.success('AI Analizi başlatıldı, lütfen bekleyin...')
//         setTimeout(async () => {
//           await fetchTickets()
//           toast.success('Analiz tamamlandı!')
//           setSolvingId(null)

//           const res = await fetch('/api/tickets')
//           const newData = await res.json()
//           const updatedTicket = newData.find((t: Ticket) => t.id === ticket.id)
//           if (updatedTicket) {
//             setSelectedTicket(updatedTicket)
//             setIsDetailOpen(true)
//           }
//         }, 4000)
//       } else {
//         toast.error('n8n bağlantı hatası')
//         setSolvingId(null)
//       }
//     } catch (error) {
//       console.error('Hata:', error)
//       toast.error('Bir hata oluştu')
//       setSolvingId(null)
//     }
//   }

//   const handleResolveTicket = async () => {
//     if (!selectedTicket) return;
//     try {
//       const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'RESOLVED' })
//       });

//       if (response.ok) {
//         toast.success('Talep çözüldü olarak işaretlendi ve yanıt gönderildi.');
//         setIsDetailOpen(false);
//         fetchTickets();
//       } else {
//         toast.error('Güncellenemedi');
//       }
//     } catch (e) {
//       toast.error('Bağlantı hatası');
//     }
//   }

//   const handleCreateTicket = async () => {
//     // For demo, we need to map the selected customer ID to database ID.
//     // Since we mocked customers, this might fail on backend if those IDs don't exist.
//     // Ideally we need to create a customer first or use existing.
//     // For this PRODUCTION FIX: I will ensure we use a valid ID or create one.
//     // Let's assume we pick "1" which is usually seeded.

//     try {
//       const response = await fetch('/api/tickets', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...newTicket,
//           customerId: 1 // Hardcoded for safety in demo if dropdown is mock
//           // In real app: Number(newTicket.customerId)
//         })
//       });

//       if (response.ok) {
//         toast.success('Talep başarıyla oluşturuldu');
//         setIsCreateOpen(false);
//         setNewTicket({ customerId: '', subject: '', description: '', priority: 'MEDIUM' });
//         fetchTickets();
//       } else {
//         toast.error('Oluşturulamadı');
//       }
//     } catch (e) {
//       toast.error('Hata');
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('tr-TR', {
//       day: 'numeric',
//       month: 'short',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   const openTicketDetail = (ticket: Ticket) => {
//     setSelectedTicket(ticket)
//     setIsDetailOpen(true)
//   }

//   const filteredTickets = tickets.filter(t => {
//     if (activeTab === 'open' && t.status !== 'OPEN') return false
//     if (activeTab === 'resolved' && (t.status !== 'RESOLVED' && t.status !== 'CLOSED')) return false
//     if (activeTab === 'progress' && t.status !== 'IN_PROGRESS') return false

//     const searchLower = searchTerm.toLowerCase()
//     return (
//       t.subject.toLowerCase().includes(searchLower) ||
//       t.ticketNumber.toLowerCase().includes(searchLower) ||
//       t.customer.name.toLowerCase().includes(searchLower)
//     )
//   })

//   const openTickets = tickets.filter(t => t.status === 'OPEN').length
//   const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length
//   const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-200px)]">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Destek Merkezi</h1>
//           <p className="text-gray-500">Müşteri taleplerini ve AI çözüm önerilerini yönetin.</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" className="gap-2" onClick={() => toast.info('Filtre özellikleri yakında eklenecek')}>
//             <Filter className="w-4 h-4" />
//             Filtrele
//           </Button>
//           <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setIsCreateOpen(true)}>
//             <Plus className="w-4 h-4" />
//             Manuel Talep Oluştur
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         {/* Cards same as before... */}
//         <Card className="border-gray-100 shadow-sm bg-blue-50/50">
//           <CardContent className="p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-blue-600 mb-1">Açık Talepler</p>
//               <h3 className="text-3xl font-bold text-gray-900">{openTickets}</h3>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-xl">
//               <AlertCircle className="w-6 h-6 text-blue-600" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="border-gray-100 shadow-sm bg-yellow-50/50">
//           <CardContent className="p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-yellow-600 mb-1">İşlemdekiler</p>
//               <h3 className="text-3xl font-bold text-gray-900">{inProgressTickets}</h3>
//             </div>
//             <div className="p-3 bg-yellow-100 rounded-xl">
//               <Clock className="w-6 h-6 text-yellow-600" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="border-gray-100 shadow-sm bg-green-50/50">
//           <CardContent className="p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-green-600 mb-1">Çözülenler</p>
//               <h3 className="text-3xl font-bold text-gray-900">{resolvedTickets}</h3>
//             </div>
//             <div className="p-3 bg-green-100 rounded-xl">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="border-gray-100 shadow-sm bg-purple-50/50">
//           <CardContent className="p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-purple-600 mb-1">AI Çözümleri</p>
//               <h3 className="text-3xl font-bold text-gray-900">{tickets.filter(t => t.aiSuggestion).length}</h3>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-xl">
//               <Sparkles className="w-6 h-6 text-purple-600" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="border-gray-100 shadow-sm">
//         <CardHeader className="pb-0 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
//               <TabsList>
//                 <TabsTrigger value="all">Tümü</TabsTrigger>
//                 <TabsTrigger value="open">Açık</TabsTrigger>
//                 <TabsTrigger value="progress">İşlemde</TabsTrigger>
//                 <TabsTrigger value="resolved">Çözüldü</TabsTrigger>
//               </TabsList>
//             </Tabs>
//             <div className="relative w-full sm:w-72">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Talep ara..."
//                 className="pl-9 bg-gray-50 border-gray-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-xl border border-gray-100 overflow-hidden">
//             <Table>
//               <TableHeader className="bg-gray-50/50">
//                 <TableRow>
//                   <TableHead>Talep Detayı</TableHead>
//                   <TableHead>Müşteri</TableHead>
//                   <TableHead>Öncelik</TableHead>
//                   <TableHead>Durum</TableHead>
//                   <TableHead>Son Güncelleme</TableHead>
//                   <TableHead>AI Asistan</TableHead>
//                   <TableHead className="w-[50px]"></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredTickets.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="h-32 text-center text-gray-500">
//                       Kriterlere uygun talep bulunamadı.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredTickets.map((ticket) => {
//                     const status = statusConfig[ticket.status] || statusConfig['OPEN']
//                     const priority = priorityConfig[ticket.priority] || priorityConfig['LOW']
//                     const StatusIcon = status.icon

//                     return (
//                       <TableRow
//                         key={ticket.id}
//                         className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
//                         onClick={() => openTicketDetail(ticket)}
//                       >
//                         <TableCell>
//                           <div className="max-w-[250px]">
//                             <div className="flex items-center gap-2 mb-1">
//                               <span className="font-mono text-xs text-gray-500">#{ticket.ticketNumber}</span>
//                               {ticket.aiSuggestion && (
//                                 <Badge variant="outline" className="h-5 text-[10px] px-1.5 border-purple-200 text-purple-600 bg-purple-50">
//                                   <Sparkles className="w-3 h-3 mr-1" />
//                                   AI Önerisi
//                                 </Badge>
//                               )}
//                             </div>
//                             <p className="font-medium text-gray-900 truncate" title={ticket.subject}>{ticket.subject}</p>
//                             <p className="text-xs text-gray-500 truncate">{ticket.description}</p>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-3">
//                             <Avatar className="h-8 w-8">
//                               <AvatarFallback className="bg-blue-50 text-blue-600 text-xs">
//                                 {ticket.customer.name.substring(0, 2).toUpperCase()}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <p className="font-medium text-sm text-gray-900">{ticket.customer.name}</p>
//                               <p className="text-xs text-gray-500">{ticket.customer.email}</p>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="secondary" className={`font-normal ${priority.badge} border-0`}>
//                             {priority.label}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <div className={`flex items-center gap-1.5 text-sm font-medium ${status.color}`}>
//                             <StatusIcon className="w-4 h-4" />
//                             {status.label}
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-sm text-gray-500">
//                           {formatDate(ticket.createdAt)}
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             size="sm"
//                             variant={ticket.aiSuggestion ? "secondary" : "outline"}
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleSolve(ticket)
//                             }}
//                             disabled={solvingId === ticket.id}
//                             className={cn("h-8 text-xs font-medium w-full", ticket.aiSuggestion && "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100")}
//                           >
//                             {solvingId === ticket.id ? (
//                               <>
//                                 <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
//                                 Analiz...
//                               </>
//                             ) : (
//                               <>
//                                 <Sparkles className="w-3 h-3 mr-1.5" />
//                                 {ticket.aiSuggestion ? 'Öneriyi Gör' : 'AI Analizi'}
//                               </>
//                             )}
//                           </Button>
//                         </TableCell>
//                         <TableCell>
//                           <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 group-hover:text-gray-900">
//                             <MoreHorizontal className="w-4 h-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     )
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Detail Dialog */}
//       <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               {selectedTicket?.subject}
//               <Badge variant="outline">{selectedTicket?.ticketNumber}</Badge>
//             </DialogTitle>
//             <DialogDescription>
//               Müşteri: {selectedTicket?.customer.name}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="p-4 bg-gray-50 rounded-lg text-sm border">
//               {selectedTicket?.description}
//             </div>
//             {selectedTicket?.aiSuggestion && (
//               <div className="p-4 bg-purple-50 rounded-lg text-sm border border-purple-100">
//                 <h4 className="flex items-center gap-2 font-semibold text-purple-700 mb-2">
//                   <Sparkles className="w-4 h-4" /> AI Çözüm Önerisi
//                 </h4>
//                 {selectedTicket.aiSuggestion}
//               </div>
//             )}
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Kapat</Button>
//             {selectedTicket?.status !== 'RESOLVED' && selectedTicket?.aiSuggestion && (
//               <Button className="bg-green-600 hover:bg-green-700" onClick={handleResolveTicket}>
//                 <CheckCircle className="w-4 h-4 mr-2" />
//                 Yanıtı Onayla & Gönder
//               </Button>
//             )}
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Create Dialog */}
//       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Yeni Destek Talebi Oluştur</DialogTitle>
//             <DialogDescription>
//               Müşteri adına manuel olarak sistemde bir kayıt açın.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label>Müşteri</Label>
//               <Select onValueChange={(v) => setNewTicket({ ...newTicket, customerId: v })}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Müşteri seçin" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="1">Ahmet Yılmaz (Demo)</SelectItem>
//                   {/* Real customer list would map here */}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Konu</Label>
//               <Input
//                 placeholder="Örn: Siparişim gelmedi"
//                 value={newTicket.subject}
//                 onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Öncelik</Label>
//               <Select onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })} defaultValue="MEDIUM">
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="LOW">Düşük</SelectItem>
//                   <SelectItem value="MEDIUM">Orta</SelectItem>
//                   <SelectItem value="HIGH">Yüksek</SelectItem>
//                   <SelectItem value="URGENT">Acil</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Açıklama</Label>
//               <Textarea
//                 placeholder="Talep detayları..."
//                 value={newTicket.description}
//                 onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsCreateOpen(false)}>İptal</Button>
//             <Button onClick={handleCreateTicket}>Oluştur</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }