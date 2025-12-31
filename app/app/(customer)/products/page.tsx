'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, ShoppingCart, Star, SlidersHorizontal, PackageSearch } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Product {
  id: number
  name: string
  description: string
  price: string | number
  stock: number
  image: string | null
  category: {
    id: number
    name: string
  }
}

interface Category {
  id: number
  name: string
  _count: {
    products: number
  }
}

const categoryImages: Record<string, string> = {
  'Telefonlar': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  'Bilgisayarlar': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
  'Tabletler': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
  'Aksesuarlar': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'Giyilebilir Teknoloji': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
}

const productImages: Record<string, string> = {
  'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
  'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
  'Samsung Galaxy S24 Ultra': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
  'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
  'Google Pixel 8 Pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
  'MacBook Pro 14" M3 Pro': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  'MacBook Air 15" M3': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
  'Dell XPS 15': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
  'Lenovo ThinkPad X1 Carbon': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
  'iPad Pro 12.9" M2': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
  'iPad Air': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
  'Samsung Galaxy Tab S9 Ultra': 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=400&fit=crop',
  'AirPods Pro 2': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
  'AirPods Max': 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400&h=400&fit=crop',
  'Samsung Galaxy Buds2 Pro': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
  'Apple MagSafe Şarj Aleti': 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=400&h=400&fit=crop',
  'Apple Watch Ultra 2': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
  'Apple Watch Series 9': 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
  'Samsung Galaxy Watch 6 Classic': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ])
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      toast.error('Ürünler yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const getProductImage = (product: Product) => {
    if (product.image) return product.image;
    return productImages[product.name] || categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === null || product.category.id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: any) => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: getProductImage(product),
          quantity: 1
        })
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      toast.success(`${product.name} sepete eklendi`)
      window.dispatchEvent(new Event('cart-updated'))
    } catch (error) {
      toast.error('Sepete eklenirken bir sorun oluştu')
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="bg-slate-200 rounded-[2rem] aspect-square" />
            <div className="h-4 bg-slate-100 rounded-full w-2/3" />
            <div className="h-4 bg-slate-100 rounded-full w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em]">
            Mağaza / Koleksiyon
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tüm Ürünler</h1>
          <p className="text-slate-500 text-sm font-medium">{filteredProducts.length} ürün bulundu</p>
        </div>
      </div>

      {/* Filters & Search - Floating Effect */}
      <div className="sticky top-20 z-30 py-4 px-2 -mx-2">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl shadow-slate-200/50 rounded-3xl p-3 flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
            <Input
              type="text"
              placeholder="Ürün veya model ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 bg-slate-50 border-none rounded-2xl text-sm focus-visible:ring-2 focus-visible:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 w-full overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "rounded-xl px-6 h-10 text-xs font-bold transition-all",
                  selectedCategory === null
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                Tümü
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "rounded-xl px-6 h-10 text-xs font-bold whitespace-nowrap transition-all",
                    selectedCategory === category.id
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
            <PackageSearch className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Sonuç Bulunamadı</h3>
          <p className="text-slate-500 text-sm max-w-xs text-center leading-relaxed">
            Aramanızla eşleşen ürün bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
          </p>
          <Button
            variant="outline"
            className="mt-8 rounded-xl border-slate-200 font-bold"
            onClick={() => { setSearchTerm(''); setSelectedCategory(null) }}
          >
            Aramayı Sıfırla
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
          {filteredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <Card className="h-full border-0 bg-transparent shadow-none">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 mb-4 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/20 transition-all duration-500">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply opacity-90 group-hover:opacity-100"
                  />

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      className="w-full h-12 bg-white/90 backdrop-blur-md text-slate-900 hover:bg-white border-0 shadow-xl rounded-2xl font-bold gap-2"
                      onClick={(e) => addToCart(e, product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Sepete Ekle
                    </Button>
                  </div>

                  {product.stock <= 5 && product.stock > 0 && (
                    <Badge className="absolute top-5 left-5 bg-orange-500/90 backdrop-blur-md border-0 text-[10px] font-black text-white rounded-lg">
                      SON {product.stock} ÜRÜN
                    </Badge>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                      <Badge className="bg-white text-slate-900 border-0 font-black px-4 py-2 rounded-xl shadow-2xl">
                        TÜKENDİ
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-2 space-y-1.5 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">
                      {product.category.name}
                    </span>
                    <div className="h-1 w-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-slate-400">4.8</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="pt-1">
                    <span className="text-lg font-black text-slate-900 tracking-tight">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import { Search, ShoppingCart, Star } from 'lucide-react'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface Product {
//   id: number
//   name: string
//   description: string
//   price: string | number
//   stock: number
//   image: string | null
//   category: {
//     id: number
//     name: string
//   }
// }

// interface Category {
//   id: number
//   name: string
//   _count: {
//     products: number
//   }
// }

// // Kategori bazlı placeholder görseller (Unsplash)
// const categoryImages: Record<string, string> = {
//   'Telefonlar': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
//   'Bilgisayarlar': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
//   'Tabletler': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
//   'Aksesuarlar': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
//   'Giyilebilir Teknoloji': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
// }

// // Ürün bazlı görseller
// const productImages: Record<string, string> = {
//   'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
//   'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
//   'Samsung Galaxy S24 Ultra': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
//   'Samsung Galaxy S24': 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop',
//   'Google Pixel 8 Pro': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
//   'MacBook Pro 14" M3 Pro': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
//   'MacBook Air 15" M3': 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
//   'Dell XPS 15': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop',
//   'Lenovo ThinkPad X1 Carbon': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
//   'iPad Pro 12.9" M2': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
//   'iPad Air': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
//   'Samsung Galaxy Tab S9 Ultra': 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=400&h=400&fit=crop',
//   'AirPods Pro 2': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
//   'AirPods Max': 'https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=400&h=400&fit=crop',
//   'Samsung Galaxy Buds2 Pro': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
//   'Apple MagSafe Şarj Aleti': 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=400&h=400&fit=crop',
//   'Apple Watch Ultra 2': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
//   'Apple Watch Series 9': 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
//   'Samsung Galaxy Watch 6 Classic': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [categories, setCategories] = useState<Category[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       const [productsRes, categoriesRes] = await Promise.all([
//         fetch('/api/products'),
//         fetch('/api/categories')
//       ])
//       const productsData = await productsRes.json()
//       const categoriesData = await categoriesRes.json()
//       setProducts(productsData)
//       setCategories(categoriesData)
//     } catch (error) {
//       console.error('Veriler alınamadı:', error)
//       toast.error('Ürünler yüklenirken bir hata oluştu')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatCurrency = (value: string | number) => {
//     const num = typeof value === 'string' ? parseFloat(value) : value
//     return new Intl.NumberFormat('tr-TR', {
//       style: 'currency',
//       currency: 'TRY',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(num)
//   }

//   const getProductImage = (product: Product) => {
//     // If product has its own image (from DB or explicit prop), use it.
//     if (product.image) return product.image;
//     // Otherwise fallback to predefined constant images
//     return productImages[product.name] || categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
//   }

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCategory = selectedCategory === null || product.category.id === selectedCategory
//     return matchesSearch && matchesCategory
//   })

//   const addToCart = (e: React.MouseEvent, product: Product) => {
//     e.preventDefault()
//     e.stopPropagation()

//     try {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]')
//       const existingItem = cart.find((item: any) => item.id === product.id)

//       if (existingItem) {
//         existingItem.quantity += 1
//       } else {
//         cart.push({
//           id: product.id,
//           name: product.name,
//           price: product.price,
//           image: getProductImage(product),
//           quantity: 1
//         })
//       }

//       localStorage.setItem('cart', JSON.stringify(cart))
//       toast.success(`${product.name} sepete eklendi`)

//       // Notify other components if needed (custom event)
//       window.dispatchEvent(new Event('cart-updated'))

//     } catch (error) {
//       console.error('Sepet güncelleme hatası:', error)
//       toast.error('Sepete eklenirken bir sorun oluştu')
//     }
//   }

//   if (loading) {
//     return (
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
//         {[...Array(15)].map((_, i) => (
//           <div key={i} className="animate-pulse">
//             <div className="bg-gray-200 rounded-xl aspect-square mb-3"></div>
//             <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
//             <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
//             <div className="h-5 bg-gray-200 rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Ürünler</h1>
//         <p className="text-gray-500">{products.length} ürün listeleniyor</p>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8 sticky top-4 z-10 backdrop-blur-md bg-white/90">
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Search */}
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               type="text"
//               placeholder="Ürün ara..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-12 h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>

//           {/* Category Filter */}
//           <div className="flex gap-2 flex-wrap">
//             <Button
//               variant={selectedCategory === null ? 'default' : 'outline'}
//               onClick={() => setSelectedCategory(null)}
//               className={cn("rounded-xl transition-all", selectedCategory === null && "shadow-md")}
//             >
//               Tümü
//             </Button>
//             {categories.map((category) => (
//               <Button
//                 key={category.id}
//                 variant={selectedCategory === category.id ? 'default' : 'outline'}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className={cn("rounded-xl transition-all", selectedCategory === category.id && "shadow-md")}
//               >
//                 {category.name}
//               </Button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       {filteredProducts.length === 0 ? (
//         <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
//           <div className="text-6xl mb-4 opacity-50">🔍</div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">Ürün bulunamadı</h3>
//           <p className="text-gray-500">Aramanızla eşleşen ürün bulunamadı. Lütfen filtreleri kontrol edin.</p>
//           <Button
//             variant="outline"
//             className="mt-6"
//             onClick={() => { setSearchTerm(''); setSelectedCategory(null) }}
//           >
//             Filtreleri Temizle
//           </Button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//           {filteredProducts.map((product) => (
//             <Link href={`/products/${product.id}`} key={product.id}>
//               <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white rounded-2xl cursor-pointer h-full hover:-translate-y-1">
//                 <div className="aspect-square bg-gray-100 relative overflow-hidden">
//                   <img
//                     src={getProductImage(product)}
//                     alt={product.name}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
//                   />
//                   {product.stock <= 5 && product.stock > 0 && (
//                     <Badge className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs backdrop-blur-sm">
//                       Son {product.stock}
//                     </Badge>
//                   )}
//                   {product.stock === 0 && (
//                     <Badge className="absolute top-2 left-2 bg-red-500/90 text-white text-xs backdrop-blur-sm">
//                       Tükendi
//                     </Badge>
//                   )}
//                 </div>
//                 <CardContent className="p-5 flex flex-col gap-3">
//                   <div>
//                     <Badge variant="secondary" className="mb-2 text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100">
//                       {product.category.name}
//                     </Badge>
//                     <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
//                       {product.name}
//                     </h3>
//                   </div>

//                   <div className="mt-auto flex items-end justify-between gap-2">
//                     <span className="text-lg font-bold text-gray-900">
//                       {formatCurrency(product.price)}
//                     </span>
//                     <Button
//                       size="icon"
//                       className="rounded-full w-10 h-10 shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-95 transition-all"
//                       onClick={(e) => addToCart(e, product)}
//                       disabled={product.stock === 0}
//                     >
//                       <ShoppingCart className="w-5 h-5" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }