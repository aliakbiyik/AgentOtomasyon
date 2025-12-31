'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Package,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  X,
  Layers,
  ArrowUpDown,
  Archive,
  ChevronRight
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface Product {
  id: number
  name: string
  price: string
  stock: number
  category: { id: number; name: string }
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  minStock: number
  description?: string
  categoryId: number
}

interface Category {
  id: number
  name: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '', price: '', stock: 0, minStock: 5, description: '', categoryId: undefined
  })

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      const mapped = data.map((p: any) => ({
        ...p,
        status: p.stock === 0 ? 'Out of Stock' : p.stock <= p.minStock ? 'Low Stock' : 'In Stock'
      }))
      setProducts(mapped)
    } catch (e) { toast.error('Ürünler yüklenemedi') } finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (e) { console.error(e) }
  }

  const handleSubmit = async () => {
    if (!currentProduct.name || !currentProduct.price || !currentProduct.categoryId) {
      toast.error('Lütfen zorunlu alanları doldurun')
      return
    }

    try {
      const url = isEditMode ? `/api/products/${currentProduct.id}` : '/api/products'
      const method = isEditMode ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentProduct,
          price: parseFloat(currentProduct.price as string),
          categoryId: Number(currentProduct.categoryId),
          stock: Number(currentProduct.stock),
          minStock: Number(currentProduct.minStock)
        })
      })

      if (res.ok) {
        toast.success(isEditMode ? 'Ürün güncellendi' : 'Ürün başarıyla eklendi')
        setIsModalOpen(false)
        fetchProducts()
        resetForm()
      }
    } catch (e) { toast.error('İşlem sırasında bir hata oluştu') }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Ürün envanterden silindi')
        setIsDeleteOpen(false)
        fetchProducts()
      }
    } catch (e) { toast.error('Silme işlemi başarısız') }
  }

  const resetForm = () => {
    setCurrentProduct({ name: '', price: '', stock: 0, minStock: 5, description: '', categoryId: undefined })
    setIsEditMode(false)
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (statusFilter === 'low') return matchesSearch && p.status === 'Low Stock'
    if (statusFilter === 'out') return matchesSearch && p.status === 'Out of Stock'
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Envanter Yönetimi</h1>
          <p className="text-slate-500 font-medium">Stok durumunu izleyin, ürün ekleyin ve güncelleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase tracking-widest h-11">
            <ArrowUpDown className="w-4 h-4 mr-2" /> Dışa Aktar
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest h-11 shadow-lg shadow-indigo-200" onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Yeni Ürün Ekle
          </Button>
        </div>
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Çeşit', val: products.length, icon: Layers, color: 'indigo' },
          { label: 'Toplam Stok', val: products.reduce((a, b) => a + b.stock, 0), icon: Archive, color: 'blue' },
          { label: 'Kritik Seviye', val: products.filter(p => p.status === 'Low Stock').length, icon: AlertTriangle, color: 'amber' },
          { label: 'Tükenen Ürünler', val: products.filter(p => p.status === 'Out of Stock').length, icon: X, color: 'red' }
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

      {/* Inventory Table Area */}
      <Card className="border-0 bg-white shadow-sm rounded-[2rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              {['all', 'low', 'out'].map((f) => (
                <Button
                  key={f}
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-4 rounded-full h-8 transition-all",
                    statusFilter === f ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {f === 'all' ? 'TÜMÜ' : f === 'low' ? 'KRİTİK' : 'TÜKENENLER'}
                </Button>
              ))}
            </div>
            <div className="relative w-full lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
              <Input
                placeholder="Ürün adı ile ara..."
                className="h-11 pl-11 bg-slate-50 border-none rounded-xl text-sm font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20"
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
                <TableHead className="text-[10px] font-black uppercase tracking-widest px-8">Ürün Detayı</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Kategori</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Envanter Durumu</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Birim Fiyat</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 tracking-tight">{product.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">ID: #{product.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-bold text-[10px] border-0 px-3 py-1">
                      {product.category?.name || 'Genel'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1.5 min-w-[140px]">
                      <div className="flex items-center justify-between w-full max-w-[100px] text-[10px] font-black">
                        <span className={cn(
                          product.status === 'Out of Stock' ? "text-red-500" :
                            product.status === 'Low Stock' ? "text-amber-500" : "text-emerald-500"
                        )}>
                          {product.stock} Adet
                        </span>
                        <span className="text-slate-300">/ 100</span>
                      </div>
                      <Progress
                        value={Math.min((product.stock / 100) * 100, 100)}
                        className="h-1.5 w-full max-w-[100px] bg-slate-100 rounded-full overflow-hidden"
                        indicatorClassName={cn(
                          product.status === 'Out of Stock' ? "bg-red-500" :
                            product.status === 'Low Stock' ? "bg-amber-500" : "bg-emerald-500"
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-black text-slate-900 pr-8 tracking-tight">
                    ₺{product.price}
                  </TableCell>
                  <TableCell className="pr-8">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => { setCurrentProduct(product); setIsEditMode(true); setIsModalOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-lg" onClick={() => { setDeleteId(product.id); setIsDeleteOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] border-0 p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-10 pb-0">
            <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {isEditMode ? 'Ürün Verilerini Düzenle' : 'Yeni Envanter Kaydı'}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Ürün bilgilerini güncelleyerek stok verilerini senkronize tutun.
            </DialogDescription>
          </DialogHeader>
          <div className="p-10 space-y-6">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ürün İsmi</Label>
              <Input value={currentProduct.name} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} className="h-12 bg-slate-50 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fiyat (₺)</Label>
                <Input type="number" value={currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} className="h-12 bg-slate-50 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori</Label>
                <Select value={currentProduct.categoryId?.toString()} onValueChange={(v) => setCurrentProduct({ ...currentProduct, categoryId: Number(v) })}>
                  <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold focus:ring-2 focus:ring-indigo-500/20">
                    <SelectValue placeholder="Kategori Seç" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()} className="font-bold py-3">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stok Miktarı</Label>
                <Input type="number" value={currentProduct.stock} onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })} className="h-12 bg-slate-50 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kritik Eşik</Label>
                <Input type="number" value={currentProduct.minStock} onChange={(e) => setCurrentProduct({ ...currentProduct, minStock: Number(e.target.value) })} className="h-12 bg-slate-50 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/20" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ürün Açıklaması</Label>
              <Textarea value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} className="bg-slate-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium p-4 resize-none" rows={3} />
            </div>
          </div>
          <DialogFooter className="bg-slate-50 p-8 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="font-bold text-slate-400">İptal Et</Button>
            <Button onClick={handleSubmit} className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-black px-10 h-12 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs">
              {isEditMode ? 'DEĞİŞİKLİKLERİ KAYDET' : 'ENVANTERE EKLE'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-[2.5rem] border-0 p-10 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-2">
              <Trash2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ürünü Siliyorsunuz</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              Bu ürünü sildiğinizde tüm geçmiş verileri ve stok bilgileri kalıcı olarak kaldırılacaktır. Onaylıyor musunuz?
            </DialogDescription>
          </div>
          <DialogFooter className="mt-8 flex gap-3 sm:justify-center">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="font-bold text-slate-400">VAZGEÇ</Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-xl font-black px-10 h-12 uppercase tracking-widest text-xs shadow-xl shadow-red-200">EVET, KALICI OLARAK SİL</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import {
//   Package,
//   AlertTriangle,
//   Search,
//   Filter,
//   Plus,
//   MoreVertical,
//   Edit,
//   Trash2,
//   X
// } from 'lucide-react'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { toast } from 'sonner'
// import { Progress } from '@/components/ui/progress'
// import { cn } from '@/lib/utils'

// interface Product {
//   id: number
//   name: string
//   price: string
//   stock: number
//   category: { id: number; name: string }
//   status: 'In Stock' | 'Low Stock' | 'Out of Stock'
//   minStock: number
//   description?: string
//   categoryId: number
// }

// interface Category {
//   id: number
//   name: string
// }

// export default function InventoryPage() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all') // all, low, out

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
//     name: '',
//     price: '',
//     stock: 0,
//     minStock: 5,
//     description: '',
//     categoryId: undefined
//   })

//   // Delete State
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false)
//   const [deleteId, setDeleteId] = useState<number | null>(null)

//   useEffect(() => {
//     fetchProducts()
//     fetchCategories()
//   }, [])

//   const fetchProducts = async () => {
//     try {
//       const res = await fetch('/api/products')
//       const data = await res.json()
//       // Map status based on stock logic
//       const mapped = data.map((p: any) => ({
//         ...p,
//         status: p.stock === 0 ? 'Out of Stock' : p.stock <= p.minStock ? 'Low Stock' : 'In Stock'
//       }))
//       setProducts(mapped)
//     } catch (e) { console.error(e) } finally { setLoading(false) }
//   }

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch('/api/categories')
//       const data = await res.json()
//       setCategories(data)
//     } catch (e) { console.error(e) }
//   }

//   const handleSubmit = async () => {
//     if (!currentProduct.name || !currentProduct.price || !currentProduct.categoryId) {
//       toast.error('Lütfen zorunlu alanları doldurun')
//       return
//     }

//     try {
//       const url = isEditMode ? `/api/products/${currentProduct.id}` : '/api/products'
//       const method = isEditMode ? 'PUT' : 'POST'

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...currentProduct,
//           price: parseFloat(currentProduct.price as string),
//           categoryId: Number(currentProduct.categoryId),
//           stock: Number(currentProduct.stock),
//           minStock: Number(currentProduct.minStock)
//         })
//       })

//       if (res.ok) {
//         toast.success(isEditMode ? 'Ürün güncellendi' : 'Ürün eklendi')
//         setIsModalOpen(false)
//         fetchProducts()
//         resetForm()
//       } else {
//         toast.error('İşlem başarısız')
//       }
//     } catch (e) { toast.error('Hata oluştu') }
//   }

//   const handleDelete = async () => {
//     if (!deleteId) return
//     try {
//       const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' })
//       if (res.ok) {
//         toast.success('Ürün silindi')
//         setIsDeleteOpen(false)
//         fetchProducts()
//       } else { toast.error('Silinemedi') }
//     } catch (e) { toast.error('Hata') }
//   }

//   const resetForm = () => {
//     setCurrentProduct({ name: '', price: '', stock: 0, minStock: 5, description: '', categoryId: undefined })
//     setIsEditMode(false)
//   }

//   const openAddModal = () => {
//     resetForm()
//     setIsModalOpen(true)
//   }

//   const openEditModal = (product: Product) => {
//     setCurrentProduct(product)
//     setIsEditMode(true)
//     setIsModalOpen(true)
//   }

//   const openDeleteModal = (id: number) => {
//     setDeleteId(id)
//     setIsDeleteOpen(true)
//   }

//   // Stats
//   const totalProducts = products.length
//   const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0)
//   const lowStockCount = products.filter(p => p.status === 'Low Stock').length
//   const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length

//   const filteredProducts = products.filter(p => {
//     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
//     if (statusFilter === 'all') return matchesSearch
//     if (statusFilter === 'low') return matchesSearch && p.status === 'Low Stock'
//     if (statusFilter === 'out') return matchesSearch && p.status === 'Out of Stock'
//     return matchesSearch
//   })

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Stok Takibi</h1>
//           <p className="text-gray-500">Ürün stoklarını ve envanter durumunu yönetin.</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" className="gap-2">
//             <Filter className="w-4 h-4" />
//             Filtrele
//           </Button>
//           <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={openAddModal}>
//             <Plus className="w-4 h-4" />
//             Yeni Ürün Ekle
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="border-gray-100 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">Toplam Ürün</CardTitle>
//             <Package className="h-4 w-4 text-gray-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-gray-100 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-500">Toplam Stok Adedi</CardTitle>
//             <Package className="h-4 w-4 text-blue-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-600">{totalStock}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-gray-100 shadow-sm bg-red-50/50 border-red-100">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-red-600">Kritik Stok</CardTitle>
//             <AlertTriangle className="h-4 w-4 text-red-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-red-700">{lowStockCount}</div>
//           </CardContent>
//         </Card>
//         <Card className="border-gray-100 shadow-sm bg-gray-50/50">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">Tükenenler</CardTitle>
//             <X className="h-4 w-4 text-gray-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-gray-700">{outOfStockCount}</div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="border-gray-100 shadow-sm">
//         <CardHeader className="pb-0 mb-4">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <div className="flex gap-2">
//               <Button
//                 variant={statusFilter === 'all' ? 'default' : 'outline'}
//                 size="sm"
//                 onClick={() => setStatusFilter('all')}
//               >
//                 Tümü
//               </Button>
//               <Button
//                 variant={statusFilter === 'low' ? 'default' : 'outline'}
//                 size="sm"
//                 className={statusFilter === 'low' ? 'bg-orange-500 hover:bg-orange-600' : ''}
//                 onClick={() => setStatusFilter('low')}
//               >
//                 Kritik
//               </Button>
//               <Button
//                 variant={statusFilter === 'out' ? 'default' : 'outline'}
//                 size="sm"
//                 className={statusFilter === 'out' ? 'bg-red-500 hover:bg-red-600' : ''}
//                 onClick={() => setStatusFilter('out')}
//               >
//                 Tükenenler
//               </Button>
//             </div>
//             <div className="relative w-full sm:w-72">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 placeholder="Ürün ara..."
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
//                   <TableHead>Ürün Adı</TableHead>
//                   <TableHead>Kategori</TableHead>
//                   <TableHead>Stok Durumu</TableHead>
//                   <TableHead>Miktar</TableHead>
//                   <TableHead className="text-right">Fiyat</TableHead>
//                   <TableHead className="w-[100px]"></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredProducts.map((product) => (
//                   <TableRow key={product.id} className="hover:bg-gray-50/50 group">
//                     <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="font-normal text-gray-500 border-gray-200">
//                         {product.category?.name}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {product.status === 'Out of Stock' ? (
//                         <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-0">Tükendi</Badge>
//                       ) : product.status === 'Low Stock' ? (
//                         <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-0">Azaldı</Badge>
//                       ) : (
//                         <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Stokta</Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <span className={cn(
//                           "font-medium",
//                           product.status === 'Out of Stock' ? "text-red-600" :
//                             product.status === 'Low Stock' ? "text-orange-600" : "text-gray-900"
//                         )}>
//                           {product.stock}
//                         </span>
//                         <Progress
//                           value={Math.min((product.stock / 100) * 100, 100)}
//                           className="w-16 h-1.5"
//                           indicatorClassName={cn(
//                             product.status === 'Out of Stock' ? "bg-red-500" :
//                               product.status === 'Low Stock' ? "bg-orange-500" : "bg-green-500"
//                           )}
//                         />
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right font-medium text-gray-900">
//                       ₺{product.price}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(product)}>
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => openDeleteModal(product.id)}>
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Add/Edit Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{isEditMode ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label>Ürün Adı</Label>
//               <Input value={currentProduct.name} onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="grid gap-2">
//                 <Label>Fiyat (₺)</Label>
//                 <Input type="number" value={currentProduct.price} onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} />
//               </div>
//               <div className="grid gap-2">
//                 <Label>Kategori</Label>
//                 <Select
//                   value={currentProduct.categoryId?.toString()}
//                   onValueChange={(v) => setCurrentProduct({ ...currentProduct, categoryId: Number(v) })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Seçiniz" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map(c => (
//                       <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="grid gap-2">
//                 <Label>Stok Adedi</Label>
//                 <Input type="number" value={currentProduct.stock} onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })} />
//               </div>
//               <div className="grid gap-2">
//                 <Label>Kritik Eşik</Label>
//                 <Input type="number" value={currentProduct.minStock} onChange={(e) => setCurrentProduct({ ...currentProduct, minStock: Number(e.target.value) })} />
//               </div>
//             </div>
//             <div className="grid gap-2">
//               <Label>Açıklama</Label>
//               <Textarea value={currentProduct.description || ''} onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button>
//             <Button onClick={handleSubmit}>{isEditMode ? 'Güncelle' : 'Kaydet'}</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation */}
//       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Ürünü Sil</DialogTitle>
//             <DialogDescription>
//               Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>İptal</Button>
//             <Button variant="destructive" onClick={handleDelete}>Evet, Sil</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }