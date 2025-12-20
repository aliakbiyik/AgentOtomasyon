'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { FileUser, Star, Clock, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react'

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

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  SHORTLISTED: 'bg-purple-100 text-purple-800',
  REJECTED: 'bg-red-100 text-red-800',
  HIRED: 'bg-green-100 text-green-800'
}

const statusLabels: Record<string, string> = {
  PENDING: 'Beklemede',
  REVIEWED: 'İncelendi',
  SHORTLISTED: 'Ön Eleme Geçti',
  REJECTED: 'Reddedildi',
  HIRED: 'İşe Alındı'
}

export default function CVApplicationsPage() {
  const [applications, setApplications] = useState<CVApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [evaluatingId, setEvaluatingId] = useState<number | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/cv-applications')
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error('CV başvuruları alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEvaluate = async (app: CVApplication) => {
    setEvaluatingId(app.id)
    try {
      // n8n webhook'una istek gönder
      const response = await fetch('http://localhost:5678/webhook/cv-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: app.id,
          name: app.name,
          position: app.position,
          cvText: app.cvText
        })
      })
      
      if (response.ok) {
        // 3 saniye bekle (n8n işlem yapsın)
        await new Promise(resolve => setTimeout(resolve, 3000))
        // Listeyi yenile
        await fetchApplications()
      } else {
        alert('n8n workflow hatası!')
      }
    } catch (error) {
      console.error('Değerlendirme hatası:', error)
      alert('Değerlendirme sırasında bir hata oluştu')
    } finally {
      setEvaluatingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    )
  }

  const pendingCount = applications.filter(a => a.status === 'PENDING').length
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED').length
  const hiredCount = applications.filter(a => a.status === 'HIRED').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">CV Başvuruları</h1>
        <p className="text-gray-500">İş başvurularını görüntüleyin ve AI ile değerlendirin</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <FileUser className="w-4 h-4" />
              Toplam Başvuru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{applications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              Beklemede
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-600" />
              Ön Eleme Geçti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{shortlistedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              İşe Alındı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{hiredCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* CV Başvuruları Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUser className="w-5 h-5" />
            Başvuru Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Pozisyon</TableHead>
                <TableHead>AI Puanı</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    {app.name}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{app.email}</p>
                      <p className="text-sm text-gray-500">{app.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.position}</Badge>
                  </TableCell>
                  <TableCell>
                    {app.aiScore !== null ? (
                      <div className="flex items-center gap-2">
                        <Star className={`w-4 h-4 ${getScoreColor(app.aiScore)}`} />
                        <span className={`font-bold ${getScoreColor(app.aiScore)}`}>
                          {app.aiScore}/100
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Değerlendirilmedi</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[app.status]}>
                      {statusLabels[app.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(app.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={app.aiScore !== null ? "outline" : "default"}
                      onClick={() => handleEvaluate(app)}
                      disabled={evaluatingId === app.id || !app.cvText}
                      className="flex items-center gap-1"
                    >
                      {evaluatingId === app.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          n8n çalışıyor...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          {app.aiScore !== null ? 'Tekrar Değerlendir' : 'AI Değerlendir'}
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Analizi Olan Başvurular */}
      {applications.filter(a => a.aiAnalysis).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Değerlendirmeleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications
                .filter(a => a.aiAnalysis)
                .map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{app.name}</h3>
                      <Badge className={getScoreColor(app.aiScore)}>
                        {app.aiScore}/100
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{app.position}</p>
                    <p className="text-sm bg-gray-50 p-3 rounded">{app.aiAnalysis}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}