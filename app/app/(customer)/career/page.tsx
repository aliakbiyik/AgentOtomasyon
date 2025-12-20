'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Briefcase, Send, Loader2, CheckCircle } from 'lucide-react'

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
  
  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [position, setPosition] = useState('')
  const [cvText, setCvText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/cv-applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          position,
          cvText
        })
      })

      if (response.ok) {
        setSuccess(true)
        // Formu temizle
        setName('')
        setEmail('')
        setPhone('')
        setPosition('')
        setCvText('')
      } else {
        alert('Başvuru gönderilirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Başvuru hatası:', error)
      alert('Başvuru gönderilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Başvurunuz Alındı!</h2>
            <p className="text-gray-600 mb-6">
              CV'niz AI tarafından değerlendirilecek ve İK ekibimiz en kısa sürede sizinle iletişime geçecektir.
            </p>
            <Button onClick={() => setSuccess(false)}>
              Yeni Başvuru Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Kariyer Fırsatları</h1>
        <p className="text-gray-500">TechStore ailesine katılın! Açık pozisyonlarımıza başvurun.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            İş Başvuru Formu
          </CardTitle>
          <CardDescription>
            Aşağıdaki formu doldurun, CV'niz yapay zeka tarafından değerlendirilecektir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad *
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ad Soyad"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başvurulan Pozisyon *
                </label>
                <Select value={position} onValueChange={setPosition} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pozisyon seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>
                        {pos}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CV / Özgeçmiş *
              </label>
              <Textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Eğitim bilgileriniz, iş deneyimleriniz, yetenekleriniz ve projeleriniz hakkında detaylı bilgi verin..."
                rows={8}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Eğitim, deneyim, yetenekler ve projelerinizi detaylı yazın. AI değerlendirmesi bu bilgilere göre yapılacaktır.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !position}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Başvuruyu Gönder
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Açık Pozisyonlar */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Açık Pozisyonlar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((pos) => (
              <div key={pos} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>{pos}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}