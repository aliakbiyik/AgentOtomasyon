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
import { HeadphonesIcon, AlertCircle, CheckCircle, Clock, Sparkles, Loader2 } from 'lucide-react'

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
  assignedTo: {
    name: string
  } | null
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

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
}

const priorityLabels: Record<string, string> = {
  LOW: 'Düşük',
  MEDIUM: 'Orta',
  HIGH: 'Yüksek',
  URGENT: 'Acil'
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [solvingId, setSolvingId] = useState<number | null>(null)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/tickets')
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error('Ticketlar alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSolve = async (ticket: Ticket) => {
    setSolvingId(ticket.id)
    try {
      const response = await fetch('http://localhost:5678/webhook/ticket-solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description
        })
      })
      
      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 3000))
        await fetchTickets()
      } else {
        alert('n8n workflow hatası!')
      }
    } catch (error) {
      console.error('Çözüm önerisi hatası:', error)
      alert('Çözüm önerisi alınırken bir hata oluştu')
    } finally {
      setSolvingId(null)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    )
  }

  const openTickets = tickets.filter(t => t.status === 'OPEN').length
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Destek Merkezi</h1>
        <p className="text-gray-500">Müşteri destek taleplerini yönetin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <HeadphonesIcon className="w-4 h-4" />
              Toplam Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tickets.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Açık
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{openTickets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              İşlemde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{inProgressTickets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Çözüldü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5" />
            Destek Talepleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket No</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Konu</TableHead>
                <TableHead>Öncelik</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.customer.name}</p>
                      <p className="text-sm text-gray-500">{ticket.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">{ticket.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={ticket.aiSuggestion ? "outline" : "default"}
                      onClick={() => handleSolve(ticket)}
                      disabled={solvingId === ticket.id}
                      className="flex items-center gap-1"
                    >
                      {solvingId === ticket.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          n8n çalışıyor...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          {ticket.aiSuggestion ? 'Tekrar Öner' : 'AI Çözüm Öner'}
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

      {tickets.filter(t => t.aiSuggestion).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Çözüm Önerileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.filter(t => t.aiSuggestion).map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{ticket.ticketNumber} - {ticket.subject}</h3>
                    <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{ticket.customer.name}</p>
                  <p className="text-sm bg-green-50 p-3 rounded border border-green-200">{ticket.aiSuggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}