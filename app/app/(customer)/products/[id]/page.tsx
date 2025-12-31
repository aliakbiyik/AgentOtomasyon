'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus, Check, Share2, Heart } from 'lucide-react'
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
    name: string
  }
}

const categoryImages: Record<string, string> = {
  'Telefonlar': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
  'Bilgisayarlar': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
  'Tabletler': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
  'Aksesuarlar': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'Giyilebilir Teknoloji': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
}

const productImages: Record<string, string> = {
  'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
  'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedLoading, setAddedLoading] = useState(false)

  useEffect(() => {
    if (params.id) fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        router.push('/products')
      }
    } catch (error) {
      router.push('/products')
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

  const getProductImage = () => {
    if (!product) return ''
    if (product.image) return product.image
    return productImages[product.name] || categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  }

  const handleAddToCart = () => {
    if (!product) return
    setAddedLoading(true)
    setTimeout(() => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingItem = cart.find((item: any) => item.id === product.id)
        if (existingItem) {
          existingItem.quantity += quantity
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: getProductImage(),
            quantity: quantity
          })
        }
        localStorage.setItem('cart', JSON.stringify(cart))
        window.dispatchEvent(new Event('cart-updated'))
        toast.success(`${product.name} sepetinize eklendi`)
      } catch (error) {
        toast.error('Bir hata oluştu')
      } finally {
        setAddedLoading(false)
      }
    }, 600)
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      {/* Breadcrumb & Top Actions */}
      <div className="flex items-center justify-between mb-8 px-2">
        <Link href="/products" className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Koleksiyona Dön</span>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100"><Share2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-500"><Heart className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
        {/* Left: Product Gallery Style Image */}
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] blur-3xl" />
          <div className="relative bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 aspect-square flex items-center justify-center p-12 lg:sticky lg:top-24">
            <img
              src={getProductImage()}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
            />
            {product.stock <= 5 && product.stock > 0 && (
              <Badge className="absolute top-8 left-8 bg-orange-600 text-white border-0 font-black px-4 py-2 rounded-xl shadow-lg">
                SON {product.stock} ÜRÜN
              </Badge>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {product.category.name}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-black text-slate-900 ml-1">4.9</span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <span className="text-sm font-bold text-slate-400">128 Değerlendirme</span>
            </div>
          </div>

          <p className="text-slate-500 text-lg leading-relaxed font-medium">
            {product.description || "Bu ürün, en yüksek kalite standartlarında üretilmiş olup kullanıcı deneyimini zirveye taşımak için tasarlanmıştır."}
          </p>

          <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-8">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-black text-indigo-600 tracking-tight">
                {formatCurrency(product.price)}
              </span>
              <span className="text-slate-400 font-bold line-through text-xl opacity-50">
                {formatCurrency(Number(product.price) * 1.15)}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {product.stock > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center bg-white rounded-2xl border border-slate-200 p-1 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-black text-lg text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1 h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-lg gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-900/10"
                    onClick={handleAddToCart}
                    disabled={addedLoading}
                  >
                    {addedLoading ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        SEPETE EKLE
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="w-full p-6 bg-red-50 text-red-600 rounded-[2rem] font-bold text-center border border-red-100 uppercase tracking-widest text-sm">
                  Ürün Stokta Bulunmuyor
                </div>
              )}
            </div>
          </div>

          {/* Features Grid - HomePage ile uyumlu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: "Hızlı Kargo", sub: "24 Saatte Kargoda", color: "blue" },
              { icon: Shield, title: "2 Yıl Garanti", sub: "Resmi Distribütör", color: "emerald" },
              { icon: RotateCcw, title: "Kolay İade", sub: "14 Gün İçinde", color: "purple" }
            ].map((f, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl bg-${f.color}-50 flex items-center justify-center text-${f.color}-600`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight">{f.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus, Check } from 'lucide-react'
// import { toast } from 'sonner'

// interface Product {
//   id: number
//   name: string
//   description: string
//   price: string | number
//   stock: number
//   image: string | null
//   category: {
//     name: string
//   }
// }

// const categoryImages: Record<string, string> = {
//   'Telefonlar': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
//   'Bilgisayarlar': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
//   'Tabletler': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
//   'Aksesuarlar': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
//   'Giyilebilir Teknoloji': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
// }

// // Ürün bazlı görseller (Fallback)
// const productImages: Record<string, string> = {
//   'iPhone 15 Pro Max': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
//   'iPhone 15': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
//   // ... diğer mappingler gerekirse buraya eklenebilir veya generic logic kullanılabilir
// }

// export default function ProductDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const [product, setProduct] = useState<Product | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [quantity, setQuantity] = useState(1)
//   const [addedLoading, setAddedLoading] = useState(false)

//   useEffect(() => {
//     if (params.id) {
//       fetchProduct()
//     }
//   }, [params.id])

//   const fetchProduct = async () => {
//     try {
//       const response = await fetch(`/api/products/${params.id}`)
//       if (response.ok) {
//         const data = await response.json()
//         setProduct(data)
//       } else {
//         router.push('/products')
//       }
//     } catch (error) {
//       console.error('Ürün alınamadı:', error)
//       router.push('/products')
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

//   const getProductImage = () => {
//     if (!product) return ''
//     if (product.image) return product.image
//     return productImages[product.name] || categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'
//   }

//   const handleAddToCart = () => {
//     if (!product) return
//     setAddedLoading(true)

//     try {
//       // Simulating network delay for better UX
//       setTimeout(() => {
//         const cart = JSON.parse(localStorage.getItem('cart') || '[]')
//         const existingItem = cart.find((item: any) => item.id === product.id)

//         if (existingItem) {
//           existingItem.quantity += quantity
//         } else {
//           cart.push({
//             id: product.id,
//             name: product.name,
//             price: product.price,
//             image: getProductImage(),
//             quantity: quantity
//           })
//         }

//         localStorage.setItem('cart', JSON.stringify(cart))
//         window.dispatchEvent(new Event('cart-updated')) // Update header badge if exists

//         toast.success(`Sepetinize ${quantity} adet eklendi`)
//         setAddedLoading(false)
//       }, 500)

//     } catch (error) {
//       console.error('Sepete eklenemedi:', error)
//       toast.error('Bir hata oluştu')
//       setAddedLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!product) {
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/30">
//       <div className="container max-w-6xl mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <div className="mb-6">
//           <Link href="/products" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
//             <ArrowLeft className="w-4 h-4" />
//             <span>Ürünlere Dön</span>
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
//           {/* Product Image */}
//           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
//             <div className="aspect-square relative overflow-hidden rounded-2xl">
//               <img
//                 src={getProductImage()}
//                 alt={product.name}
//                 className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
//               />
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="pt-2">
//             <Badge variant="secondary" className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1">
//               {product.category.name}
//             </Badge>
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
//               {product.name}
//             </h1>

//             <div className="flex items-center gap-4 mb-8">
//               <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
//                 {[...Array(5)].map((_, i) => (
//                   <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
//                 ))}
//                 <span className="text-sm font-bold text-yellow-700 ml-1">4.9</span>
//               </div>
//               <span className="text-gray-400">|</span>
//               <span className="text-gray-500 font-medium">128 değerlendirme</span>
//             </div>

//             <p className="text-gray-600 text-lg leading-relaxed mb-8">
//               {product.description}
//             </p>

//             <div className="flex items-end gap-4 mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
//               <div className="text-4xl font-bold text-gray-900">
//                 {formatCurrency(product.price)}
//               </div>
//               {product.stock > 0 && <div className="text-sm text-green-600 font-medium mb-1.5 flex items-center gap-1"><Check className="w-4 h-4" /> Stokta</div>}
//             </div>

//             {/* Stock Status & Actions */}
//             <div className="space-y-6">
//               {product.stock > 0 ? (
//                 <>
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <div className="flex items-center border-2 border-gray-100 rounded-xl bg-white w-fit">
//                       <button
//                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                         className="p-4 hover:bg-gray-50 transition-colors rounded-l-xl text-gray-500 hover:text-gray-900"
//                       >
//                         <Minus className="w-5 h-5" />
//                       </button>
//                       <span className="w-16 text-center font-bold text-lg">{quantity}</span>
//                       <button
//                         onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
//                         className="p-4 hover:bg-gray-50 transition-colors rounded-r-xl text-gray-500 hover:text-gray-900"
//                       >
//                         <Plus className="w-5 h-5" />
//                       </button>
//                     </div>

//                     <Button
//                       size="lg"
//                       className="flex-1 py-8 text-lg font-semibold rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1"
//                       onClick={handleAddToCart}
//                       disabled={addedLoading}
//                     >
//                       {addedLoading ? (
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       ) : (
//                         <>
//                           <ShoppingCart className="w-5 h-5 mr-2" />
//                           Sepete Ekle
//                         </>
//                       )}
//                     </Button>
//                   </div>
//                   {product.stock <= 5 && (
//                     <p className="text-orange-600 font-medium text-sm animate-pulse">
//                       Acele et! Stokta sadece {product.stock} ürün kaldı.
//                     </p>
//                   )}
//                 </>
//               ) : (
//                 <div className="w-full p-4 bg-red-50 text-red-600 rounded-xl font-medium text-center border border-red-100">
//                   Bu ürün şu an stoklarımızda bulunmamaktadır.
//                 </div>
//               )}
//             </div>

//             {/* Features Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-gray-200">
//               <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
//                 <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
//                   <Truck className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900">Hızlı Kargo</h4>
//                   <p className="text-xs text-gray-500">24 saatte kargoda</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
//                 <div className="bg-green-50 p-2.5 rounded-lg text-green-600">
//                   <Shield className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900">Garantili</h4>
//                   <p className="text-xs text-gray-500">2 yıl distribütör</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
//                 <div className="bg-purple-50 p-2.5 rounded-lg text-purple-600">
//                   <RotateCcw className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900">Kolay İade</h4>
//                   <p className="text-xs text-gray-500">14 gün içinde</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }