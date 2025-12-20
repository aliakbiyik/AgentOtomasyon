'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Briefcase } from 'lucide-react'

interface Employee {
  id: number
  name: string
  email: string
  phone: string
  department: string
  position: string
  salary: string | number
  status: string
  hireDate: string
  _count: {
    leaves: number
    tickets: number
  }
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  ON_LEAVE: 'bg-yellow-100 text-yellow-800'
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  ON_LEAVE: 'İzinde'
}

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error('Çalışanlar alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Yükleniyor...</p>
      </div>
    )
  }

  const totalSalary = employees.reduce((sum, e) => {
    const salary = typeof e.salary === 'string' ? parseFloat(e.salary) : e.salary
    return sum + salary
  }, 0)

  const departments = [...new Set(employees.map(e => e.department))]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">İnsan Kaynakları</h1>
        <p className="text-gray-500">Çalışanları görüntüleyin ve yönetin</p>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Toplam Çalışan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Aktif Çalışan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {employees.filter(e => e.status === 'ACTIVE').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Departman Sayısı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{departments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Toplam Maaş Gideri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalSalary)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Departmanlara Göre Dağılım */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Departman Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {departments.map((dept) => (
              <div key={dept} className="bg-gray-100 rounded-lg p-4 min-w-[150px]">
                <p className="text-sm text-gray-500">{dept}</p>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.department === dept).length}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Çalışanlar Tablosu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Çalışan Listesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Departman</TableHead>
                <TableHead>Pozisyon</TableHead>
                <TableHead>Maaş</TableHead>
                <TableHead>İşe Başlama</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.name}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{employee.email}</p>
                      <p className="text-sm text-gray-500">{employee.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.department}</Badge>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(employee.salary)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(employee.hireDate)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[employee.status]}>
                      {statusLabels[employee.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}