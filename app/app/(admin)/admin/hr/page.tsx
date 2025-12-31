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
  Users,
  Briefcase,
  UserCheck,
  Building2,
  Wallet,
  Plus,
  Download,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

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

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Aktif', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  INACTIVE: { label: 'Pasif', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  ON_LEAVE: { label: 'İzinde', color: 'bg-amber-50 text-amber-600 border-amber-100' }
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
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      } else {
        // Mock data fallback for preview
        setEmployees([
          { id: 1, name: 'Ali AKBIYIK', email: 'ali@akbstore.com', phone: '0530 000 00 00', department: 'Yazılım', position: 'Lead Developer', salary: 120000, status: 'ACTIVE', hireDate: '2023-01-15', _count: { leaves: 2, tickets: 4 } },
          { id: 2, name: 'Ayşe Yılmaz', email: 'ayse@akbstore.com', phone: '0530 111 11 11', department: 'Pazarlama', position: 'Manager', salary: 85000, status: 'ACTIVE', hireDate: '2023-05-20', _count: { leaves: 0, tickets: 1 } },
          { id: 3, name: 'Mehmet Demir', email: 'mehmet@akbstore.com', phone: '0530 222 22 22', department: 'İnsan Kaynakları', position: 'Specialist', salary: 65000, status: 'ON_LEAVE', hireDate: '2024-02-10', _count: { leaves: 10, tickets: 0 } },
        ])
      }
    } catch (error) {
      console.error('Çalışanlar alınamadı:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const totalSalary = employees.reduce((sum, e) => sum + (typeof e.salary === 'string' ? parseFloat(e.salary) : e.salary), 0)
  const departments = [...new Set(employees.map(e => e.department))]

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">İnsan Kaynakları</h1>
          <p className="text-slate-500 font-medium">Organizasyon yapısını ve personel verimliliğini yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-black text-xs uppercase tracking-widest h-11">
            <Download className="w-4 h-4 mr-2" /> Rapor Al
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest h-11 shadow-lg shadow-indigo-200">
            <Plus className="w-4 h-4 mr-2" /> Personel Ekle
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Personel', val: employees.length, icon: Users, color: 'indigo' },
          { label: 'Aktif Görevde', val: employees.filter(e => e.status === 'ACTIVE').length, icon: UserCheck, color: 'emerald' },
          { label: 'Departmanlar', val: departments.length, icon: Building2, color: 'blue' },
          { label: 'Maaş Gideri', val: formatCurrency(totalSalary), icon: Wallet, color: 'purple' }
        ].map((s, i) => (
          <Card key={i} className="border-0 bg-white shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
            <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-20", `bg-${s.color}-600`)} />
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{s.val}</h3>
              </div>
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:rotate-12", `bg-${s.color}-50 text-${s.color}-600`)}>
                <s.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Departments Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.15em] px-2">Departman Dağılımı</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {departments.map((dept) => (
            <Card key={dept} className="border-0 bg-white shadow-sm rounded-2xl hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{dept}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {employees.filter(e => e.department === dept).length} Kişi
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Employee Table Area */}
      <Card className="border-0 bg-white shadow-sm rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Personel Listesi</CardTitle>
            <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-200 font-bold px-3">{employees.length} Kayıt</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 h-12">Personel & Rol</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">İletişim</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Maaş Bilgisi</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Kıdem</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Durum</TableHead>
                <TableHead className="w-20 pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="group border-slate-50 hover:bg-slate-50/40 transition-colors">
                  <TableCell className="pl-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 tracking-tight">{employee.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-0 text-[9px] font-black uppercase px-2">
                          {employee.department}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{employee.position}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Mail className="w-3 h-3 text-slate-300" /> {employee.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone className="w-3 h-3 text-slate-300" /> {employee.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-black text-slate-900 tracking-tight">{formatCurrency(employee.salary)}</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Aylık Net</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {formatDate(employee.hireDate)}
                      </div>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Giriş Tarihi</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border shadow-sm", statusConfig[employee.status]?.color)}>
                      {statusConfig[employee.status]?.label || employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-lg">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
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

// 'use client'

// import { useEffect, useState } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Users, Briefcase } from 'lucide-react'

// interface Employee {
//   id: number
//   name: string
//   email: string
//   phone: string
//   department: string
//   position: string
//   salary: string | number
//   status: string
//   hireDate: string
//   _count: {
//     leaves: number
//     tickets: number
//   }
// }

// const statusColors: Record<string, string> = {
//   ACTIVE: 'bg-green-100 text-green-800',
//   INACTIVE: 'bg-gray-100 text-gray-800',
//   ON_LEAVE: 'bg-yellow-100 text-yellow-800'
// }

// const statusLabels: Record<string, string> = {
//   ACTIVE: 'Aktif',
//   INACTIVE: 'Pasif',
//   ON_LEAVE: 'İzinde'
// }

// export default function HRPage() {
//   const [employees, setEmployees] = useState<Employee[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchEmployees()
//   }, [])

//   const fetchEmployees = async () => {
//     try {
//       const response = await fetch('/api/employees')
//       const data = await response.json()
//       setEmployees(data)
//     } catch (error) {
//       console.error('Çalışanlar alınamadı:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatCurrency = (value: string | number) => {
//     const num = typeof value === 'string' ? parseFloat(value) : value
//     return new Intl.NumberFormat('tr-TR', {
//       style: 'currency',
//       currency: 'TRY'
//     }).format(num)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('tr-TR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p className="text-gray-500">Yükleniyor...</p>
//       </div>
//     )
//   }

//   const totalSalary = employees.reduce((sum, e) => {
//     const salary = typeof e.salary === 'string' ? parseFloat(e.salary) : e.salary
//     return sum + salary
//   }, 0)

//   const departments = [...new Set(employees.map(e => e.department))]

//   return (
//     <div>
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800">İnsan Kaynakları</h1>
//         <p className="text-gray-500">Çalışanları görüntüleyin ve yönetin</p>
//       </div>

//       {/* Özet Kartları */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
//               <Users className="w-4 h-4" />
//               Toplam Çalışan
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold">{employees.length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">
//               Aktif Çalışan
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-green-600">
//               {employees.filter(e => e.status === 'ACTIVE').length}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
//               <Briefcase className="w-4 h-4" />
//               Departman Sayısı
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold">{departments.length}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">
//               Toplam Maaş Gideri
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-2xl font-bold text-blue-600">
//               {formatCurrency(totalSalary)}
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Departmanlara Göre Dağılım */}
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>Departman Dağılımı</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap gap-4">
//             {departments.map((dept) => (
//               <div key={dept} className="bg-gray-100 rounded-lg p-4 min-w-[150px]">
//                 <p className="text-sm text-gray-500">{dept}</p>
//                 <p className="text-2xl font-bold">
//                   {employees.filter(e => e.department === dept).length}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Çalışanlar Tablosu */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="w-5 h-5" />
//             Çalışan Listesi
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Ad Soyad</TableHead>
//                 <TableHead>İletişim</TableHead>
//                 <TableHead>Departman</TableHead>
//                 <TableHead>Pozisyon</TableHead>
//                 <TableHead>Maaş</TableHead>
//                 <TableHead>İşe Başlama</TableHead>
//                 <TableHead>Durum</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {employees.map((employee) => (
//                 <TableRow key={employee.id}>
//                   <TableCell className="font-medium">
//                     {employee.name}
//                   </TableCell>
//                   <TableCell>
//                     <div>
//                       <p className="text-sm">{employee.email}</p>
//                       <p className="text-sm text-gray-500">{employee.phone}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{employee.department}</Badge>
//                   </TableCell>
//                   <TableCell>{employee.position}</TableCell>
//                   <TableCell className="font-medium">
//                     {formatCurrency(employee.salary)}
//                   </TableCell>
//                   <TableCell className="text-gray-500">
//                     {formatDate(employee.hireDate)}
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={statusColors[employee.status]}>
//                       {statusLabels[employee.status]}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }