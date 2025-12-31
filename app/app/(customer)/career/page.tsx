'use client'

import { useState } from 'react'
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
import { Briefcase, Send, Loader2, CheckCircle2, Upload, FileText, ChevronRight, X, Sparkles, Heart, Globe, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const positions = [
  'Yazılım Geliştirici',
  'Satış Temsilcisi',
  'Müşteri Hizmetleri',
  'Depo Sorumlusu',
  'Muhasebe Uzmanı',
  'İnsan Kaynakları Uzmanı',
  'Pazarlama Uzmanı',
]

export default function CareerPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fileName, setFileName] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [cvText, setCvText] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf' && !file.type.includes('word')) {
      toast.error('Lütfen sadece PDF veya Word belgesi yükleyin.')
      return
    }
    setCvFile(file)
    setFileName(file.name)
    toast.success('CV dosyası eklendi')
  }

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCvFile(null)
    setFileName('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cvFile && !cvText) {
      toast.error('Lütfen CV yükleyin veya özet bilgi girin')
      return
    }
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('position', position)
      formData.append('cvText', cvText)
      if (cvFile) formData.append('cvFile', cvFile)

      const response = await fetch('/api/cv-applications/apply', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        setSuccess(true)
        setName(''); setEmail(''); setPhone(''); setPosition(''); setCvText(''); setCvFile(null); setFileName('')
      } else {
        toast.error('Başvuru gönderilirken bir hata oluştu')
      }
    } catch (error) {
      toast.error('Sunucu hatası oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mb-8 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Başvurunuz Alındı!</h2>
        <p className="text-slate-500 mb-8 max-w-sm font-medium leading-relaxed">
          TechStore ailesine katılma isteğiniz bizi heyecanlandırdı. İK ekibimiz başvurunuzu titizlikle inceleyecektir.
        </p>
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 mb-10 w-full max-w-md flex gap-4 text-left">
          <Sparkles className="w-6 h-6 text-indigo-600 shrink-0" />
          <p className="text-sm font-bold text-indigo-700 leading-tight uppercase tracking-tight">
            CV'niz yapay zeka destekli sistemimiz tarafından analiz edilecek ve 48 saat içinde size dönüş yapılacaktır.
          </p>
        </div>
        <Button onClick={() => setSuccess(false)} variant="outline" className="h-14 px-8 rounded-2xl font-black border-slate-200">
          YENİ BAŞVURU YAP
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      {/* Hero Section - Premium Technology Branding */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl mb-16 mt-4">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent skew-x-12 translate-x-20" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />

        <div className="relative z-10 px-8 py-16 md:p-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Geleceği Birlikte Kuralım</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter mb-6 uppercase">
            Kariyer Fırsatları
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            TechStore'da sadece bir çalışan değil, teknoloji devriminin bir parçası olursunuz. Yenilikçi ekibimize katılın.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Hibrit Çalışma', 'Özel Sağlık', 'Eğitim Desteği', 'Global Vizyon'].map(benefit => (
              <Badge key={benefit} className="bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-colors">
                {benefit}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start px-2">
        {/* Sidebar / Positions List */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Açık Pozisyonlar</CardTitle>
              <CardDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Aktif İlan Listesi</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {positions.map((pos) => (
                <div
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer group",
                    position === pos
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200"
                      : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <span className={cn("font-bold text-sm", position === pos ? "text-white" : "text-slate-700")}>{pos}</span>
                  {position === pos ? <CheckCircle2 className="w-5 h-5 text-white" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 rounded-[2.5rem] border-0 shadow-2xl p-8 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/20 rounded-full blur-2xl group-hover:bg-indigo-600/40 transition-all" />
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Neden TechStore?</h3>
            <div className="space-y-6">
              {[
                { icon: Heart, text: "İnsan odaklı çalışma kültürü" },
                { icon: Globe, text: "Global projelerde yer alma şansı" },
                { icon: Sparkles, text: "Sürekli gelişim ve eğitim bütçesi" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-400 leading-tight">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Application Form Area */}
        <div className="lg:col-span-8">
          <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Başvuru Formu</CardTitle>
              </div>
              <CardDescription className="text-slate-500 font-medium text-base pt-2">
                Lütfen aşağıdaki bilgileri eksiksiz doldurarak CV dosyanızı sisteme yükleyin.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Ad Soyad</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tam adınız" required className="h-12 bg-slate-50 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">E-posta</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" required className="h-12 bg-slate-50 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Telefon</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" required className="h-12 bg-slate-50 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Pozisyon Seçimi</label>
                    <Select value={position} onValueChange={setPosition} required>
                      <SelectTrigger className="h-12 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 font-bold">
                        <SelectValue placeholder="Bir rol seçin" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos} className="font-bold py-3 cursor-pointer">{pos}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">CV Dosyası (PDF/DOC)</label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300 relative group",
                      dragActive ? "border-indigo-600 bg-indigo-50 shadow-inner scale-[0.99]" : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50",
                      fileName ? "bg-emerald-50/50 border-emerald-200" : ""
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('cvFile')?.click()}
                  >
                    <input id="cvFile" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />

                    {fileName ? (
                      <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in">
                        <div className="bg-emerald-100 p-4 rounded-2xl">
                          <FileText className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-slate-800 tracking-tight">{fileName}</p>
                          <p className="text-xs font-bold text-emerald-600 uppercase">Dosya Sisteme Eklendi</p>
                        </div>
                        <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold" onClick={removeFile}>
                          <X className="w-4 h-4 mr-2" /> KALDIR VE DEĞİŞTİR
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                          <Upload className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-800 tracking-tight">Sürükle veya Dosya Seç</p>
                          <p className="text-slate-400 text-sm font-medium">CV dosyanızı buraya bırakarak hızlıca yükleyin</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Özet / Motivasyon Mesajı</label>
                  <Textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Kendinizden ve hedeflerinizden kısaca bahsedin..."
                    rows={4}
                    className="bg-slate-50 border-none rounded-[1.5rem] focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium p-4 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-[1.01] active:scale-95 shadow-slate-900/10"
                  disabled={loading || !position}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>GÖNDERİLİYOR...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      <span>BAŞVURUYU TAMAMLA</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
// import { Briefcase, Send, Loader2, CheckCircle2, Upload, FileText, ChevronRight, X } from 'lucide-react'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// const positions = [
//   'Yazılım Geliştirici',
//   'Satış Temsilcisi',
//   'Müşteri Hizmetleri',
//   'Depo Sorumlusu',
//   'Muhasebe Uzmanı',
//   'İnsan Kaynakları Uzmanı',
//   'Pazarlama Uzmanı',
// ]

// export default function CareerPage() {
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [fileName, setFileName] = useState('')
//   const [dragActive, setDragActive] = useState(false)

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [phone, setPhone] = useState('')
//   const [position, setPosition] = useState('')
//   const [cvText, setCvText] = useState('')
//   const [cvFile, setCvFile] = useState<File | null>(null)

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true)
//     } else if (e.type === "dragleave") {
//       setDragActive(false)
//     }
//   }

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileSelect(e.dataTransfer.files[0])
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       handleFileSelect(file)
//     }
//   }

//   const handleFileSelect = (file: File) => {
//     // Simple validation
//     if (file.type !== 'application/pdf' && !file.type.includes('word')) {
//       toast.error('Lütfen sadece PDF veya Word belgesi yükleyin.')
//       return
//     }
//     setCvFile(file)
//     setFileName(file.name)
//     toast.success('CV dosyası eklendi')
//   }

//   const removeFile = (e: React.MouseEvent) => {
//     e.stopPropagation()
//     setCvFile(null)
//     setFileName('')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!cvFile && !cvText) {
//       toast.error('Lütfen CV yükleyin veya özet bilgi girin')
//       return
//     }

//     setLoading(true)

//     try {
//       const formData = new FormData()
//       formData.append('name', name)
//       formData.append('email', email)
//       formData.append('phone', phone)
//       formData.append('position', position)
//       formData.append('cvText', cvText)
//       if (cvFile) {
//         formData.append('cvFile', cvFile)
//       }

//       const response = await fetch('/api/cv-applications/apply', {
//         method: 'POST',
//         body: formData
//       })

//       if (response.ok) {
//         setSuccess(true)
//         setName('')
//         setEmail('')
//         setPhone('')
//         setPosition('')
//         setCvText('')
//         setCvFile(null)
//         setFileName('')
//         toast.success('Başvurunuz başarıyla alındı!')
//       } else {
//         toast.error('Başvuru gönderilirken bir hata oluştu')
//       }
//     } catch (error) {
//       console.error('Başvuru hatası:', error)
//       toast.error('Sunucu hatası oluştu')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (success) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center p-4">
//         <div className="max-w-xl w-full">
//           <Card className="border-0 shadow-2xl">
//             <CardContent className="pt-16 pb-16 text-center space-y-6">
//               <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
//                 <CheckCircle2 className="w-12 h-12 text-green-600" />
//               </div>
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Başvurunuz Alındı!</h2>
//                 <p className="text-gray-500 text-lg max-w-sm mx-auto">
//                   TechStore ailesine katılma isteğiniz için teşekkürler. Değerlendirme sürecimiz başlamıştır.
//                 </p>
//               </div>

//               <div className="bg-blue-50 p-4 rounded-lg text-left max-w-sm mx-auto flex gap-3 text-sm text-blue-800 border border-blue-100">
//                 <div className="bg-blue-200 p-1 rounded-full h-fit flex-shrink-0">
//                   <CheckCircle2 className="w-3 h-3 text-blue-700" />
//                 </div>
//                 CV'niz yapay zeka tarafından analiz edilecek ve uygun bulunması durumunda İK ekibimiz sizinle iletişime geçecektir.
//               </div>

//               <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">
//                 Yeni Başvuru Yap
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gray-50/50 min-h-screen pb-12">
//       {/* Hero Section */}
//       <div className="bg-white border-b border-gray-100 pt-16 pb-20 mb-12 text-center px-4">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
//           Kariyer Fırsatları
//         </h1>
//         <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
//           Yenilikçi teknolojilerle e-ticaret dünyasını dönüştürüyoruz. <br />
//           <span className="font-medium text-gray-900">TechStore</span> ailesine katılın ve geleceği birlikte inşa edelim.
//         </p>
//         <div className="flex flex-wrap justify-center gap-3">
//           {['Hibrit Çalışma', 'Özel Sağlık Sigortası', 'Eğitim Desteği', 'Yüksek Prim'].map(benefit => (
//             <Badge key={benefit} variant="secondary" className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 font-normal">
//               {benefit}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <div className="container max-w-5xl mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           {/* Sidebar / Open Positions */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-white border-l-4 border-l-primary/20">
//               <CardHeader>
//                 <CardTitle className="text-lg">Açık Pozisyonlar</CardTitle>
//                 <CardDescription>Şu an aktif olan ilanlarımız</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {positions.map((pos) => (
//                   <div
//                     key={pos}
//                     onClick={() => setPosition(pos)}
//                     className={cn(
//                       "flex items-center gap-3 p-3 text-sm rounded-lg transition-all cursor-pointer",
//                       position === pos ? "bg-white shadow-sm border border-gray-100 font-medium text-primary" : "hover:bg-white/60 text-gray-600"
//                     )}
//                   >
//                     <div className={cn("w-2 h-2 rounded-full", position === pos ? "bg-primary" : "bg-gray-300")}></div>
//                     <span>{pos}</span>
//                     {position === pos && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>

//             <Card className="bg-blue-900 text-white border-0 shadow-lg p-6">
//               <h3 className="text-lg font-bold mb-2">Neden Biz?</h3>
//               <ul className="space-y-3 text-sm text-blue-100 mt-4">
//                 <li className="flex items-start gap-2">
//                   <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-400" />
//                   Sürekli öğrenme ve gelişim kültürü
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-400" />
//                   Global projelerde yer alma fırsatı
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-400" />
//                   Adil ve şeffaf performans değerlendirme
//                 </li>
//               </ul>
//             </Card>
//           </div>

//           {/* Application Form */}
//           <div className="lg:col-span-2">
//             <Card className="border-0 shadow-lg">
//               <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-8 pt-8">
//                 <CardTitle className="flex items-center gap-3 text-2xl">
//                   <div className="bg-primary/10 p-2 rounded-lg">
//                     <Briefcase className="w-6 h-6 text-primary" />
//                   </div>
//                   İş Başvuru Formu
//                 </CardTitle>
//                 <CardDescription className="text-base mt-2">
//                   Aşağıdaki formu doldurarak başvurunuzu tamamlayın. CV'niz AI destekli sistemimiz tarafından analiz edilecektir.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="pt-8">
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Ad Soyad <span className="text-red-500">*</span></label>
//                       <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tam adınız" required className="bg-gray-50 border-gray-200 focus:bg-white" />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">E-posta <span className="text-red-500">*</span></label>
//                       <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@email.com" required className="bg-gray-50 border-gray-200 focus:bg-white" />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Telefon <span className="text-red-500">*</span></label>
//                       <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XX XXX XX XX" required className="bg-gray-50 border-gray-200 focus:bg-white" />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-gray-700">Pozisyon <span className="text-red-500">*</span></label>
//                       <Select value={position} onValueChange={setPosition} required>
//                         <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
//                           <SelectValue placeholder="Pozisyon seçin" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {positions.map((pos) => (
//                             <SelectItem key={pos} value={pos}>{pos}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">CV Dosyası</label>
//                     <div
//                       className={cn(
//                         "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 relative group",
//                         dragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-gray-200 hover:border-primary/50 hover:bg-gray-50",
//                         fileName ? "bg-green-50 border-green-200" : ""
//                       )}
//                       onDragEnter={handleDrag}
//                       onDragLeave={handleDrag}
//                       onDragOver={handleDrag}
//                       onDrop={handleDrop}
//                       onClick={() => document.getElementById('cvFile')?.click()}
//                     >
//                       <input id="cvFile" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />

//                       {fileName ? (
//                         <div className="flex flex-col items-center justify-center gap-2 animate-in zoom-in">
//                           <div className="bg-green-100 p-3 rounded-full">
//                             <FileText className="w-8 h-8 text-green-600" />
//                           </div>
//                           <span className="font-medium text-green-900 text-lg">{fileName}</span>
//                           <p className="text-green-600 text-sm">Dosya başvuruya eklendi</p>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
//                             onClick={removeFile}
//                           >
//                             <X className="w-4 h-4 mr-1" /> Kaldır
//                           </Button>
//                         </div>
//                       ) : (
//                         <div className="space-y-2">
//                           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                             <Upload className="w-8 h-8 text-blue-500" />
//                           </div>
//                           <p className="text-lg font-medium text-gray-700">Dosyayı sürükleyip bırakın</p>
//                           <p className="text-gray-400">veya bilgisayarınızdan seçmek için tıklayın</p>
//                           <div className="pt-2">
//                             <Badge variant="outline" className="font-normal text-xs text-gray-400">PDF, DOC, DOCX</Badge>
//                           </div>
//                         </div>
//                       )}

//                       {dragActive && (
//                         <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
//                           <div className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-primary animate-bounce">
//                             Dosyayı Bırak
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-medium text-gray-700">Özet / Önyazı</label>
//                     <Textarea
//                       value={cvText}
//                       onChange={(e) => setCvText(e.target.value)}
//                       placeholder="Kendinizden kısaca bahsedin..."
//                       rows={4}
//                       className="bg-gray-50 border-gray-200 focus:bg-white resize-none"
//                     />
//                   </div>

//                   <Button type="submit" size="lg" className="w-full text-lg h-12 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30" disabled={loading || !position}>
//                     {loading ? (<><Loader2 className="w-5 h-5 animate-spin mr-2" />Gönderiliyor...</>) : (<><Send className="w-5 h-5 mr-2" />Başvuruyu Gönder</>)}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }