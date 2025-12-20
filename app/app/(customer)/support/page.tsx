'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { HeadphonesIcon, Plus, MessageSquare, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

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

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800'
}

const statusLabels: Record<string, string> = {
  OPEN: 'Açık',
  IN_PROGRESS: 'İşlemde',
  RESOLVED: 'Çözüldü',
  CLOSED: 'Kapatıldı'
}

export default function CustomerSupportPage() {
  const router = useRouter()
  const { customer, loading: authLoading } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  
  // Form state
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push('/login')
    }
  }, [customer, authLoading, router])

  useEffect(() => {
    if (customer) {
      fetchTickets()
    }
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
      console.error('Ticketlar alınamadı:', error)
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
        body: JSON.stringify({
          subject,
          description,
          priority,
          customerId: customer.id
        })
      })

      if (response.ok) {
        setSubject('')
        setDescription('')
        setPriority('MEDIUM')
        setShowForm(false)
        fetchTickets()
      } else {
        alert('Ticket oluşturulurken bir hata oluştu')
      }
    } catch (error) {
      console.error('Ticket oluşturma hatası:', error)
      alert('Ticket oluşturulurken bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!customer) {
    return null
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Destek Merkezi</h1>
          <p className="text-gray-500">Sorularınız için bize ulaşın, {customer.name}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Yeni Destek Talebi
        </Button>
      </div>

      {/* Yeni Ticket Formu */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Yeni Destek Talebi Oluştur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konu
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Sorununuzu kısaca özetleyin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Öncelik
                </label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Düşük</SelectItem>
                    <SelectItem value="MEDIUM">Orta</SelectItem>
                    <SelectItem value="HIGH">Yüksek</SelectItem>
                    <SelectItem value="URGENT">Acil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Sorununuzu detaylı bir şekilde anlatın..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Gönderiliyor...
                    </>
                  ) : (
                    'Gönder'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  İptal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ticket Listesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5" />
            Destek Taleplerim
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Henüz destek talebiniz bulunmuyor.</p>
              <p className="text-sm">Yardıma ihtiyacınız varsa yukarıdaki butona tıklayın.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-gray-500">{ticket.ticketNumber}</span>
                      <Badge className={statusColors[ticket.status]}>
                        {statusLabels[ticket.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 mb-1">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>

                  {/* Detay Görünümü */}
                  {selectedTicket?.id === ticket.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Açıklama:</h4>
                        <p className="text-gray-600 bg-gray-100 p-3 rounded">{ticket.description}</p>
                      </div>

                      {ticket.aiSuggestion && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Destek Ekibi Yanıtı:
                          </h4>
                          <p className="text-gray-600 bg-green-50 p-3 rounded border border-green-200">
                            {ticket.aiSuggestion}
                          </p>
                        </div>
                      )}

                      {!ticket.aiSuggestion && ticket.status === 'OPEN' && (
                        <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                          ⏳ Talebiniz inceleniyor. En kısa sürede yanıt verilecektir.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}