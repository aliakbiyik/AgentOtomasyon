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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  FileUser,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Loader2,
  Eye,
  ThumbsUp,
  Mail,
  Phone,
  ChevronRight,
  Search,
  UserCheck,
  BrainCircuit,
  ClipboardList
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface CVApplication {
  id: number
  name: string
  email: string
  phone: string
  position: string
  cvText: string | null
  aiScore: number | null
  aiAnalysis: string | null
  status: string
  createdAt: string
}

const statusConfig: Record<string, { label: string, color: string }> = {
  PENDING: { label: 'Beklemede', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  REVIEWED: { label: 'İncelendi', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  SHORTLISTED: { label: 'Ön Eleme', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  REJECTED: { label: 'Reddedildi', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  HIRED: { label: 'İşe Alındı', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
}

export default function CVApplicationsPage() {
  const [applications, setApplications] = useState<CVApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [evaluatingId, setEvaluatingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedApp, setSelectedApp] = useState<CVApplication | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/cv-applications')
      if (response.ok) setApplications(await response.json())
    } catch (error) { toast.error('Veriler yüklenemedi') }
    finally { setLoading(false) }
  }

  const handleEvaluate = async (app: CVApplication) => {
    setEvaluatingId(app.id)
    try {
      const response = await fetch('http://localhost:5678/webhook/cv-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: app.id, name: app.name, position: app.position, cvText: app.cvText })
      })

      if (response.ok) {
        toast.success('AI analizi başlatıldı...')
        setTimeout(async () => {
          await fetchApplications()
          setEvaluatingId(null)
          toast.success('Analiz tamamlandı!')

          const res = await fetch('/api/cv-applications')
          const newData = await res.json()
          const updated = newData.find((a: CVApplication) => a.id === app.id)
          if (updated) { setSelectedApp(updated); setIsDetailOpen(true); }
        }, 4000)
      } else {
        toast.error('n8n bağlantı hatası')
        setEvaluatingId(null)
      }
    } catch (error) { setEvaluatingId(null) }
  }

  const updateStatus = async (status: string) => {
    if (!selectedApp) return
    try {
      const res = await fetch(`/api/cv-applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        toast.success('Durum güncellendi')
        setIsDetailOpen(false)
        fetchApplications()
      }
    } catch (e) { toast.error('Hata oluştu') }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-slate-300'
    if (score >= 80) return 'text-emerald-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-rose-500'
  }

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Yetenek Havuzu</h1>
          <p className="text-slate-500 font-medium">Başvuruları AI skorlarıyla analiz edin ve ekibinizi büyütün.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
          <Input
            placeholder="Aday veya pozisyon ara..."
            className="h-12 pl-11 bg-white border-none rounded-2xl text-sm font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Başvuru', val: applications.length, icon: FileUser, color: 'indigo' },
          { label: 'Değerlendirme', val: applications.filter(a => a.status === 'PENDING').length, icon: Clock, color: 'amber' },
          { label: 'Yüksek Eşleşme', val: applications.filter(a => (a.aiScore || 0) >= 80).length, icon: Star, color: 'emerald' },
          { label: 'AI Analizleri', val: applications.filter(a => a.aiAnalysis).length, icon: BrainCircuit, color: 'purple' }
        ].map((s, i) => (
          <Card key={i} className="border-0 bg-white shadow-sm overflow-hidden relative group">
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

      {/* Main List */}
      <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Başvuru Listesi</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Aday Bilgisi</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Hedef Pozisyon</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">AI Uyumluluk</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Süreç Durumu</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8">Başvuru Tarihi</TableHead>
                <TableHead className="w-20 pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id} className="group border-slate-50 hover:bg-slate-50/40 transition-colors cursor-pointer" onClick={() => { setSelectedApp(app); setIsDetailOpen(true); }}>
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-black">{app.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 tracking-tight">{app.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{app.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-slate-50 text-slate-500 font-bold text-[10px] border-0 px-3 py-1 uppercase">
                      {app.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {app.aiScore !== null ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full animate-pulse", getScoreColor(app.aiScore).replace('text', 'bg'))} />
                        <span className={cn("font-black text-sm tracking-tighter", getScoreColor(app.aiScore))}>%{app.aiScore}</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                        onClick={(e) => { e.stopPropagation(); handleEvaluate(app); }}
                        disabled={evaluatingId === app.id}
                      >
                        {evaluatingId === app.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><BrainCircuit className="w-3 h-3 mr-1.5" /> Analiz Et</>}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border shadow-sm", statusConfig[app.status]?.color)}>
                      {statusConfig[app.status]?.label || app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8 text-[10px] font-bold text-slate-400 uppercase">
                    {new Date(app.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  </TableCell>
                  <TableCell className="pr-8">
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 transition-all ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Candidate Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-5xl rounded-[2.5rem] border-0 shadow-2xl p-0 overflow-hidden bg-slate-50">
          <DialogHeader className="p-10 bg-white border-b border-slate-100">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Aday Detay Dosyası</p>
                <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedApp?.name}</DialogTitle>
                <DialogDescription className="font-medium text-slate-400 flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedApp?.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedApp?.phone}</span>
                </DialogDescription>
              </div>
              <Badge className="bg-indigo-600 text-white border-0 font-black px-4 py-2 rounded-xl text-xs uppercase tracking-widest">
                {selectedApp?.position}
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[60vh]">
            {/* Left: CV Content Viewer */}
            <div className="p-10 overflow-y-auto border-r border-slate-100 custom-scrollbar bg-white">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <ClipboardList className="w-4 h-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">CV Metin İçeriği (Parsed)</h4>
              </div>
              <div className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap text-sm bg-slate-50 p-8 rounded-[2rem] border border-slate-100 font-mono">
                {selectedApp?.cvText || "Metin içeriği bulunamadı."}
              </div>
            </div>

            {/* Right: AI Intelligence & Actions */}
            <div className="p-10 overflow-y-auto space-y-8">
              {/* AI Score Section */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Değerlendirme Skoru</h4>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
                {selectedApp?.aiScore ? (
                  <div className="flex items-end gap-3">
                    <span className={cn("text-6xl font-black tracking-tighter leading-none", getScoreColor(selectedApp.aiScore))}>
                      {selectedApp.aiScore}
                    </span>
                    <span className="text-slate-300 font-bold text-xl mb-1">/ 100</span>
                  </div>
                ) : (
                  <Button
                    className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
                    onClick={() => selectedApp && handleEvaluate(selectedApp)}
                    disabled={evaluatingId === selectedApp?.id}
                  >
                    {evaluatingId === selectedApp?.id ? <Loader2 className="w-5 h-5 animate-spin" /> : "ŞİMDİ ANALİZ ET"}
                  </Button>
                )}
              </div>

              {/* AI Analysis Text */}
              {selectedApp?.aiAnalysis && (
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2rem] text-white shadow-xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4" /> AI Analiz Özeti
                  </h4>
                  <p className="text-sm font-medium leading-relaxed opacity-95 italic">"{selectedApp.aiAnalysis}"</p>
                </div>
              )}

              {/* Status Management */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Başvuru Aksiyonları</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => updateStatus('HIRED')} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-12 text-xs uppercase">
                    <UserCheck className="w-4 h-4 mr-2" /> İŞE AL
                  </Button>
                  <Button onClick={() => updateStatus('SHORTLISTED')} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-12 text-xs uppercase">
                    <ThumbsUp className="w-4 h-4 mr-2" /> ÖN ELEME
                  </Button>
                  <Button onClick={() => updateStatus('REJECTED')} variant="destructive" className="col-span-2 rounded-xl font-bold h-12 text-xs uppercase">
                    <XCircle className="w-4 h-4 mr-2" /> BAŞVURUYU REDDET
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-white p-8 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsDetailOpen(false)} className="font-bold text-slate-400 uppercase text-[10px]">Pencereyi Kapat</Button>
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
// import { ScrollArea } from "@/components/ui/scroll-area" // Assuming ScrollArea exists or use div
// import { FileUser, Star, Clock, CheckCircle, XCircle, Sparkles, Loader2, Eye, ThumbsUp, ThumbsDown } from 'lucide-react'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface CVApplication {
//   id: number
//   name: string
//   email: string
//   phone: string
//   position: string
//   cvText: string | null
//   aiScore: number | null
//   aiAnalysis: string | null
//   status: string
//   createdAt: string
// }

// const statusColors: Record<string, string> = {
//   PENDING: 'bg-yellow-100 text-yellow-800',
//   REVIEWED: 'bg-blue-100 text-blue-800',
//   SHORTLISTED: 'bg-purple-100 text-purple-800',
//   REJECTED: 'bg-red-100 text-red-800',
//   HIRED: 'bg-green-100 text-green-800'
// }

// const statusLabels: Record<string, string> = {
//   PENDING: 'Beklemede',
//   REVIEWED: 'İncelendi',
//   SHORTLISTED: 'Ön Eleme Geçti',
//   REJECTED: 'Reddedildi',
//   HIRED: 'İşe Alındı'
// }

// export default function CVApplicationsPage() {
//   const [applications, setApplications] = useState<CVApplication[]>([])
//   const [loading, setLoading] = useState(true)
//   const [evaluatingId, setEvaluatingId] = useState<number | null>(null)

//   // Detail Modal
//   const [selectedApp, setSelectedApp] = useState<CVApplication | null>(null)
//   const [isDetailOpen, setIsDetailOpen] = useState(false)

//   useEffect(() => {
//     fetchApplications()
//   }, [])

//   const fetchApplications = async () => {
//     try {
//       const response = await fetch('/api/cv-applications')
//       const data = await response.json()
//       setApplications(data)
//     } catch (error) {
//       console.error('CV başvuruları alınamadı:', error)
//       toast.error('Veriler yüklenemedi')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleEvaluate = async (app: CVApplication) => {
//     setEvaluatingId(app.id)
//     try {
//       const response = await fetch('http://localhost:5678/webhook/cv-evaluate', { // Changed to host.docker.internal for consistency or keep localhost if user confirmed
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: app.id,
//           name: app.name,
//           position: app.position,
//           cvText: app.cvText
//         })
//       })

//       if (response.ok) {
//         toast.success('n8n analizi başlatıldı...')
//         // 3 saniye bekle
//         setTimeout(async () => {
//           await fetchApplications()
//           toast.success('Analiz güncellendi')
//           setEvaluatingId(null)

//           // Güncel veriyi aç
//           const res = await fetch('/api/cv-applications')
//           const newData = await res.json()
//           const updated = newData.find((a: CVApplication) => a.id === app.id)
//           if (updated && selectedApp?.id === app.id) {
//             setSelectedApp(updated)
//           }
//         }, 4000)
//       } else {
//         toast.error('n8n bağlantı hatası')
//         setEvaluatingId(null)
//       }
//     } catch (error) {
//       console.error('Hata:', error)
//       // toast.error('Hata oluştu') // n8n might be CORS restricted, but we use proxy in ideal world.
//       // Trying local proxy if exists or direct. Assuming direct worked for user before?
//       // User said "admin side AI suggestion didn't work", implying backend connection issues.
//       // Let's use a proxy here too for safety?
//       // User didn't request proxy for CV, but let's stick to what code was doing, or use a proxy if it fails.
//       // The previous code had localhost:5678. I'll keep it but handle CORS gracefully or suggest Proxy.
//       // Actually, for consistency with Ticket, I should probably create a proxy but sticking to raw fetch for now as requested "Same as before but working".
//       setEvaluatingId(null)
//     }
//   }

//   const updateStatus = async (status: string) => {
//     if (!selectedApp) return
//     try {
//       const res = await fetch(`/api/cv-applications/${selectedApp.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status })
//       })
//       if (res.ok) {
//         toast.success(`Durum güncellendi: ${statusLabels[status]}`)
//         setIsDetailOpen(false)
//         fetchApplications()
//       } else {
//         toast.error('Güncelleme başarısız')
//       }
//     } catch (e) { toast.error('Hata') }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('tr-TR', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric'
//     })
//   }

//   const getScoreColor = (score: number | null) => {
//     if (score === null) return 'text-gray-400'
//     if (score >= 80) return 'text-green-600'
//     if (score >= 60) return 'text-yellow-600'
//     return 'text-red-600'
//   }

//   const openDetail = (app: CVApplication) => {
//     setSelectedApp(app)
//     setIsDetailOpen(true)
//   }

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
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CV Başvuruları</h1>
//           <p className="text-gray-500">İş başvurularını görüntüleyin ve AI ile değerlendirin.</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="border-gray-100 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">Toplam Başvuru</CardTitle>
//             <FileUser className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
//           </CardContent>
//         </Card>
//         {/* ... Other stats same logic ... */}
//       </div>

//       <Card className="border-gray-100 shadow-sm">
//         <CardHeader>
//           <CardTitle>Başvuru Listesi</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="rounded-xl border border-gray-100 overflow-hidden">
//             <Table>
//               <TableHeader className="bg-gray-50/50">
//                 <TableRow>
//                   <TableHead>Ad Soyad</TableHead>
//                   <TableHead>Pozisyon</TableHead>
//                   <TableHead>AI Puanı</TableHead>
//                   <TableHead>Durum</TableHead>
//                   <TableHead>Tarih</TableHead>
//                   <TableHead className="text-right">İşlem</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {applications.map((app) => (
//                   <TableRow key={app.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => openDetail(app)}>
//                     <TableCell className="font-medium">
//                       <div>{app.name}</div>
//                       <div className="text-xs text-gray-500">{app.email}</div>
//                     </TableCell>
//                     <TableCell><Badge variant="outline">{app.position}</Badge></TableCell>
//                     <TableCell>
//                       {app.aiScore !== null ? (
//                         <div className="flex items-center gap-1.5">
//                           <Star className={cn("w-4 h-4", getScoreColor(app.aiScore))} />
//                           <span className={cn("font-bold", getScoreColor(app.aiScore))}>{app.aiScore}</span>
//                         </div>
//                       ) : <span className="text-gray-400 text-xs">-</span>}
//                     </TableCell>
//                     <TableCell>
//                       <Badge className={cn("font-normal border-0", statusColors[app.status])}>
//                         {statusLabels[app.status]}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-gray-500 text-sm">{formatDate(app.createdAt)}</TableCell>
//                     <TableCell className="text-right">
//                       <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openDetail(app); }}>
//                         <Eye className="w-4 h-4 text-gray-500" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
//         <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
//           <DialogHeader>
//             <DialogTitle className="flex justify-between items-center text-xl">
//               <span>{selectedApp?.name}</span>
//               <Badge variant="outline" className="text-base font-normal">{selectedApp?.position}</Badge>
//             </DialogTitle>
//             <DialogDescription>
//               {selectedApp?.email} • {selectedApp?.phone}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="flex-1 overflow-hidden grid grid-cols-2 gap-6 py-4">
//             {/* Left: CV Content */}
//             <div className="flex flex-col h-full overflow-hidden border rounded-lg bg-gray-50">
//               <div className="p-3 bg-white border-b font-medium text-sm text-gray-500 flex justify-between">
//                 <span>CV İçeriği (Parsed)</span>
//                 {/* Could enable download here if file path existed */}
//               </div>
//               <div className="p-4 overflow-y-auto text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed h-full">
//                 {selectedApp?.cvText || "CV metni bulunamadı veya parse edilemedi."}
//               </div>
//             </div>

//             {/* Right: AI Analysis */}
//             <div className="flex flex-col gap-4 h-full overflow-y-auto">
//               <Card className="border-purple-100 bg-purple-50/50">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-purple-700 flex items-center gap-2 text-base">
//                     <Sparkles className="w-4 h-4" /> AI Analizi
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {selectedApp?.aiAnalysis ? (
//                     <div className="text-sm text-gray-800 space-y-2">
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-xs uppercase tracking-wider text-gray-500">Puan:</span>
//                         <span className={cn("text-lg font-bold", getScoreColor(selectedApp.aiScore))}>{selectedApp.aiScore}/100</span>
//                       </div>
//                       <p>{selectedApp.aiAnalysis}</p>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <p className="text-gray-500 text-sm mb-4">Henüz analiz yapılmamış.</p>
//                       <Button
//                         size="sm"
//                         className="bg-purple-600 hover:bg-purple-700"
//                         onClick={() => selectedApp && handleEvaluate(selectedApp)}
//                         disabled={evaluatingId === selectedApp?.id}
//                       >
//                         {evaluatingId === selectedApp?.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
//                         {evaluatingId === selectedApp?.id ? 'Analiz Ediliyor' : 'Şimdi Analiz Et'}
//                       </Button>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               <div className="border rounded-lg p-4 bg-white">
//                 <h4 className="font-medium mb-3 text-sm text-gray-900">Başvuru Durumu</h4>
//                 <div className="flex flex-col gap-2">
//                   <Button
//                     className="w-full justify-start bg-green-600 hover:bg-green-700"
//                     onClick={() => updateStatus('HIRED')}
//                     disabled={selectedApp?.status === 'HIRED'}
//                   >
//                     <CheckCircle className="w-4 h-4 mr-2" /> İşe Al / Onayla
//                   </Button>
//                   <Button
//                     className="w-full justify-start bg-purple-600 hover:bg-purple-700"
//                     onClick={() => updateStatus('SHORTLISTED')}
//                     disabled={selectedApp?.status === 'SHORTLISTED'}
//                   >
//                     <ThumbsUp className="w-4 h-4 mr-2" /> Ön Elemeyi Geçir
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     className="w-full justify-start"
//                     onClick={() => updateStatus('REJECTED')}
//                     disabled={selectedApp?.status === 'REJECTED'}
//                   >
//                     <XCircle className="w-4 h-4 mr-2" /> Reddet
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Kapat</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }