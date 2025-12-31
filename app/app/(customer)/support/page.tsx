'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HeadphonesIcon, Plus, MessageSquare, Clock, CheckCircle2, ChevronDown, Sparkles, Send, LifeBuoy, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Ticket {
  id: number
  ticketNumber: string
  subject: string
  description: string
  status: string
  priority: string
  aiSuggestion: string | null
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  OPEN: { label: 'Açık', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Clock },
  IN_PROGRESS: { label: 'İşlemde', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: LoaderIcon },
  RESOLVED: { label: 'Çözüldü', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
  CLOSED: { label: 'Kapatıldı', color: 'bg-slate-50 text-slate-500 border-slate-100', icon: CheckCircle2 }
}

const priorityConfig: Record<string, string> = {
  LOW: '🔵 Düşük',
  MEDIUM: '🟢 Orta',
  HIGH: '🟠 Yüksek',
  URGENT: '🔴 Acil'
}

function LoaderIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}

export default function CustomerSupportPage() {
  const router = useRouter()
  const { customer, loading: authLoading } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null)

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')

  useEffect(() => {
    if (!authLoading && !customer) router.push('/login')
  }, [customer, authLoading, router])

  useEffect(() => {
    if (customer) fetchTickets()
  }, [customer])

  const fetchTickets = async () => {
    if (!customer) return
    try {
      const response = await fetch(`/api/tickets/customer?customerId=${customer.id}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data)
      }
    } catch (error) {
      toast.error('Destek talepleri yüklenirken bir sorun oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer) return
    setSubmitting(true)

    try {
      const response = await fetch('/api/tickets/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description, priority, customerId: customer.id })
      })

      if (response.ok) {
        setSubject('')
        setDescription('')
        setPriority('MEDIUM')
        setShowForm(false)
        fetchTickets()
        toast.success('Destek talebiniz başarıyla oluşturuldu')
      } else {
        toast.error('Talep oluşturulurken bir hata oluştu')
      }
    } catch (error) {
      toast.error('Bağlantı hatası oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!customer) return null

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 px-2">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em]">
            <LifeBuoy className="w-4 h-4" /> Yardım & Destek
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Size Nasıl Yardımcı Olabiliriz?</h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">
            Merhaba {customer.name.split(' ')[0]}, yaşadığınız sorunları hızlıca çözmek için buradayız.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="lg"
          className={cn(
            "h-16 px-8 rounded-2xl font-black transition-all shadow-xl active:scale-95",
            showForm
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200"
          )}
        >
          {showForm ? 'VAZGEÇ' : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              YENİ TALEP OLUŞTUR
            </>
          )}
        </Button>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div className="mb-16 animate-in slide-in-from-top-6 fade-in duration-500">
          <Card className="border-0 bg-white shadow-2xl shadow-indigo-500/10 rounded-[2.5rem] overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500" />
            <CardHeader className="p-10 pb-4">
              <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tight">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
                Talep Detayları
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium text-base">
                Sorununuzu ne kadar detaylı anlatırsanız, size o kadar hızlı çözüm sunabiliriz.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-4">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Konu Başlığı</label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Örn: Siparişim kargoya verilmedi"
                      required
                      className="h-14 bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Öncelik Durumu</label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100">
                        {Object.entries(priorityConfig).map(([val, label]) => (
                          <SelectItem key={val} value={val} className="font-bold py-3">{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Açıklama</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Lütfen sorununuzu tüm detaylarıyla buraya yazın..."
                    rows={6}
                    required
                    className="bg-slate-50 border-none rounded-[2rem] focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium p-6 resize-none"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto min-w-[200px] h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl"
                  >
                    {submitting ? (
                      <LoaderIcon className="w-5 h-5" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        TALEBİ GÖNDER
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tickets List Area */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-xl">
              <LifeBuoy className="w-5 h-5 text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Geçmiş Talepleriniz</h2>
            <Badge className="bg-indigo-50 text-indigo-600 border-0 font-black px-3 py-1 rounded-full">{tickets.length}</Badge>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
              <HeadphonesIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Henüz bir talebiniz yok</h3>
            <p className="text-slate-500 text-sm max-w-sm text-center leading-relaxed">
              Herhangi bir sorunuz olduğunda yeni bir talep oluşturarak bizimle iletişime geçebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket) => {
              const status = statusConfig[ticket.status] || statusConfig.OPEN
              const StatusIcon = status.icon
              const isExpanded = expandedTicketId === ticket.id

              return (
                <Card
                  key={ticket.id}
                  className={cn(
                    "transition-all duration-500 border-0 bg-white rounded-[2rem] overflow-hidden",
                    isExpanded ? "shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/10" : "shadow-sm hover:shadow-xl hover:shadow-slate-200/50"
                  )}
                >
                  <div
                    className="p-8 cursor-pointer group"
                    onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full tracking-widest border border-slate-100">
                            #{ticket.ticketNumber}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">
                            <Clock className="w-3 h-3" />
                            {formatDate(ticket.createdAt)}
                          </span>
                        </div>
                        <h3 className="font-black text-slate-800 text-xl tracking-tight group-hover:text-indigo-600 transition-colors">
                          {ticket.subject}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={cn("px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest gap-2 border shadow-sm", status.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </Badge>
                        <ChevronDown className={cn("w-5 h-5 text-slate-300 transition-transform duration-500", isExpanded && "rotate-180 text-indigo-600")} />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content Section */}
                  <div className={cn(
                    "grid transition-all duration-500 ease-in-out bg-slate-50/50",
                    isExpanded ? "grid-rows-[1fr] opacity-100 p-8 pt-0" : "grid-rows-[0fr] opacity-0"
                  )}>
                    <div className="overflow-hidden space-y-8">
                      <div className="pt-8 border-t border-slate-200/60">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-4 h-4 text-slate-400" />
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Müşteri Açıklaması</h4>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-slate-700 font-medium leading-relaxed">
                          {ticket.description}
                        </div>
                      </div>

                      {ticket.aiSuggestion ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-indigo-500" />
                            <h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest">Yapay Zeka Yanıtı</h4>
                            <Badge className="bg-indigo-600 text-[8px] font-black text-white px-2 rounded-sm border-0">BETA</Badge>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group/ai">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover/ai:bg-white/20 transition-all duration-700" />
                            <p className="relative z-10 font-medium leading-relaxed opacity-95 italic">
                              "{ticket.aiSuggestion}"
                            </p>
                            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-bold text-white/60">
                              <span>Bu bir yapay zeka tarafından oluşturulmuş hızlı yanıttır.</span>
                              <Sparkles className="w-3 h-3 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 bg-white/60 p-5 rounded-2xl border border-dashed border-slate-200">
                          <LoaderIcon className="w-5 h-5 text-indigo-600" />
                          <span className="uppercase tracking-widest">Uzman ekibimiz talebinizi önceliklendirdi, lütfen beklemede kalın.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Badge } from '@/components/ui/badge'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { HeadphonesIcon, Plus, MessageSquare, Clock, CheckCircle2, ChevronRight, ChevronDown, Sparkles, Send } from 'lucide-react'
// import { useAuth } from '@/lib/auth-context'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface Ticket {
//   id: number
//   ticketNumber: string
//   subject: string
//   description: string
//   status: string
//   priority: string
//   aiSuggestion: string | null
//   createdAt: string
// }

// const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
//   OPEN: { label: 'Açık', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
//   IN_PROGRESS: { label: 'İşlemde', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: LoaderIcon },
//   RESOLVED: { label: 'Çözüldü', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
//   CLOSED: { label: 'Kapatıldı', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: CheckCircle2 }
// }

// function LoaderIcon({ className }: { className?: string }) {
//   return (
//     <svg className={cn("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//     </svg>
//   )
// }

// export default function CustomerSupportPage() {
//   const router = useRouter()
//   const { customer, loading: authLoading } = useAuth()
//   const [tickets, setTickets] = useState<Ticket[]>([])
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [showForm, setShowForm] = useState(false)
//   const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null)

//   // Form state
//   const [subject, setSubject] = useState('')
//   const [description, setDescription] = useState('')
//   const [priority, setPriority] = useState('MEDIUM')

//   useEffect(() => {
//     if (!authLoading && !customer) {
//       router.push('/login')
//     }
//   }, [customer, authLoading, router])

//   useEffect(() => {
//     if (customer) {
//       fetchTickets()
//     }
//   }, [customer])

//   const fetchTickets = async () => {
//     if (!customer) return

//     try {
//       const response = await fetch(`/api/tickets/customer?customerId=${customer.id}`)
//       if (response.ok) {
//         const data = await response.json()
//         setTickets(data)
//       }
//     } catch (error) {
//       console.error('Ticketlar alınamadı:', error)
//       toast.error('Destek talepleri yüklenirken bir sorun oluştu')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!customer) return

//     setSubmitting(true)

//     try {
//       const response = await fetch('/api/tickets/customer', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           subject,
//           description,
//           priority,
//           customerId: customer.id
//         })
//       })

//       if (response.ok) {
//         setSubject('')
//         setDescription('')
//         setPriority('MEDIUM')
//         setShowForm(false)
//         fetchTickets()
//         toast.success('Destek talebiniz başarıyla oluşturuldu')
//       } else {
//         toast.error('Talep oluşturulurken bir hata oluştu')
//       }
//     } catch (error) {
//       console.error('Ticket oluşturma hatası:', error)
//       toast.error('Bağlantı hatası oluştu')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('tr-TR', {
//       day: 'numeric',
//       month: 'long',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   if (authLoading || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!customer) return null

//   return (
//     <div className="bg-gray-50/50 min-h-screen pb-12">
//       <div className="bg-white border-b border-gray-100 py-12 mb-8">
//         <div className="container max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Destek Merkezi</h1>
//             <p className="text-gray-500 mt-2 text-lg">Size nasıl yardımcı olabiliriz, {customer.name}?</p>
//           </div>
//           <Button
//             onClick={() => setShowForm(!showForm)}
//             size="lg"
//             className={cn("shadow-lg transition-all", showForm ? "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 shadow-red-100" : "hover:scale-105")}
//             variant={showForm ? "outline" : "default"}
//           >
//             {showForm ? 'Vazgeç' : (
//               <>
//                 <Plus className="w-5 h-5 mr-2" />
//                 Yeni Talep Oluştur
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       <div className="container max-w-4xl mx-auto px-4">
//         {/* Create Ticket Form */}
//         {showForm && (
//           <div className="mb-12 animate-in slide-in-from-top-4 fade-in duration-300">
//             <Card className="border-primary/20 shadow-xl overflow-hidden">
//               <div className="h-2 bg-gradient-to-r from-primary to-purple-600" />
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-xl">
//                   <MessageSquare className="w-5 h-5 text-primary" />
//                   Yeni Destek Talebi
//                 </CardTitle>
//                 <CardDescription>
//                   Sorununuzu detaylıca anlatın, yapay zeka asistanımız size anında yardımcı olmaya çalışsın.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Konu</label>
//                       <Input
//                         value={subject}
//                         onChange={(e) => setSubject(e.target.value)}
//                         placeholder="Örn: Siparişim kargoya verilmedi"
//                         required
//                         className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Öncelik</label>
//                       <Select value={priority} onValueChange={setPriority}>
//                         <SelectTrigger className="bg-gray-50 border-gray-200">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="LOW">🔵 Düşük</SelectItem>
//                           <SelectItem value="MEDIUM">🟢 Orta</SelectItem>
//                           <SelectItem value="HIGH">🟠 Yüksek</SelectItem>
//                           <SelectItem value="URGENT">🔴 Acil</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">Açıklama</label>
//                     <Textarea
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       placeholder="Sorununuzu buraya yazın..."
//                       rows={5}
//                       required
//                       className="bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none"
//                     />
//                   </div>

//                   <div className="flex justify-end pt-2">
//                     <Button type="submit" disabled={submitting} size="lg" className="w-full md:w-auto min-w-[150px]">
//                       {submitting ? (
//                         <>
//                           <LoaderIcon className="w-4 h-4 mr-2" />
//                           Gönderiliyor...
//                         </>
//                       ) : (
//                         <>
//                           <Send className="w-4 h-4 mr-2" />
//                           Talebi Gönder
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {/* Tickets List */}
//         <div className="space-y-6">
//           <div className="flex items-center gap-2 mb-4">
//             <HeadphonesIcon className="w-5 h-5 text-gray-400" />
//             <h2 className="text-xl font-semibold text-gray-800">Geçmiş Talepleriniz</h2>
//             <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">{tickets.length}</Badge>
//           </div>

//           {tickets.length === 0 ? (
//             <Card className="text-center py-16 border-dashed">
//               <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <HeadphonesIcon className="w-10 h-10 text-blue-200" />
//               </div>
//               <p className="text-xl font-medium text-gray-900">Henüz destek talebiniz yok</p>
//               <p className="text-gray-500 mt-2 max-w-sm mx-auto">Siparişleriniz veya ürünlerimiz hakkında sorularınız için yeni bir talep oluşturabilirsiniz.</p>
//             </Card>
//           ) : (
//             <div className="grid gap-4">
//               {tickets.map((ticket) => {
//                 const status = statusConfig[ticket.status] || statusConfig.OPEN
//                 const StatusIcon = status.icon
//                 const isExpanded = expandedTicketId === ticket.id

//                 return (
//                   <Card
//                     key={ticket.id}
//                     className={cn(
//                       "transition-all duration-200 cursor-pointer hover:shadow-md border-l-4",
//                       isExpanded ? "ring-2 ring-primary/5 border-l-primary" : "border-l-transparent hover:border-l-gray-300"
//                     )}
//                     onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
//                   >
//                     <div className="p-5">
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-3 mb-1">
//                             <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">#{ticket.ticketNumber}</span>
//                             <span className="text-xs text-gray-400 flex items-center gap-1">
//                               <Clock className="w-3 h-3" />
//                               {formatDate(ticket.createdAt)}
//                             </span>
//                           </div>
//                           <h3 className="font-semibold text-gray-900 text-lg truncate pr-4">{ticket.subject}</h3>
//                         </div>
//                         <Badge variant="outline" className={cn("flex-shrink-0 px-3 py-1 gap-1.5", status.color)}>
//                           <StatusIcon className="w-3.5 h-3.5" />
//                           {status.label}
//                         </Badge>
//                       </div>
//                     </div>

//                     {/* Expanded Content */}
//                     <div className={cn(
//                       "grid transition-all duration-300 ease-in-out bg-gray-50/50 border-t border-gray-100",
//                       isExpanded ? "grid-rows-[1fr] opacity-100 p-5" : "grid-rows-[0fr] opacity-0 p-0 overflow-hidden"
//                     )}>
//                       <div className="overflow-hidden space-y-6">
//                         <div>
//                           <h4 className="text-sm font-semibold text-gray-900 mb-2">Talep Detayı:</h4>
//                           <p className="text-gray-600 leading-relaxed bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
//                             {ticket.description}
//                           </p>
//                         </div>

//                         {ticket.aiSuggestion ? (
//                           <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
//                             <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                               <Sparkles className="w-4 h-4 text-purple-600" />
//                               Otomatik Yanıt (AI Asistan)
//                             </h4>
//                             <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100 text-gray-700 shadow-sm relative overflow-hidden">
//                               <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full opacity-50 -mr-8 -mt-8"></div>
//                               {ticket.aiSuggestion}
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-3 text-sm text-gray-500 bg-white p-3 rounded border border-gray-100">
//                             <LoaderIcon className="w-4 h-4 text-primary" />
//                             <span>Destek ekibimiz talebinizi inceliyor. En kısa sürede yanıt verilecektir.</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {!isExpanded && (
//                       <div className="border-t border-gray-50 bg-gray-50/30 py-1 flex justify-center">
//                         <ChevronDown className="w-4 h-4 text-gray-300" />
//                       </div>
//                     )}
//                   </Card>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }