'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Shield, Truck, Star, Sparkles, TrendingUp } from 'lucide-react'

const categoryImages: Record<string, string> = {
  'Telefonlar': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
  'Bilgisayarlar': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
  'Tabletler': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
  'Aksesuarlar': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  'Giyilebilir Teknoloji': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setFeaturedProducts(data.sort(() => 0.5 - Math.random()).slice(0, 12))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(value)
  }

  return (
    <div className="space-y-16 pb-12 w-full">

      {/* Hero Section - Zarif ve Profesyonel */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl mt-2">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent skew-x-12 translate-x-40" />

        <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center p-8 md:p-12 lg:p-16">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Premium Teknoloji Koleksiyonu</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Geleceği <span className="text-indigo-400">Şimdi</span> <br />
              Keşfetmeye Başlayın
            </h1>

            <p className="text-sm md:text-lg text-slate-400 max-w-xl leading-relaxed font-medium">
              AKB Store ile en yeni cihazlar, profesyonel teknik destek ve kapınıza kadar gelen güvenli alışveriş deneyimini keşfedin.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-10 h-14 font-bold shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1">
                  Koleksiyonu Gör
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 hidden md:block">
            <div className="relative border border-white/5 rounded-[2.5rem] overflow-hidden bg-slate-800/30 backdrop-blur-sm p-3">
              <img
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80"
                className="w-full h-auto object-cover rounded-[2rem] opacity-90 shadow-2xl"
                alt="Premium Tech"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features - Yatay ve zarif kutular */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: "Hızlı Teslimat", desc: "500₺ üzeri hızlı kargo", color: "blue" },
          { icon: Shield, title: "Orijinal Ürün", desc: "Resmi distribütör garantisi", color: "emerald" },
          { icon: Zap, title: "Anında Destek", desc: "7/24 Teknik yardım hattı", color: "purple" }
        ].map((feature, idx) => (
          <div key={idx} className="flex items-center gap-5 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className={`w-12 h-12 shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center`}>
              <feature.icon className={`w-6 h-6 text-slate-600`} />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{feature.title}</h3>
              <p className="text-slate-500 text-[11px] font-bold mt-0.5">{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-end justify-between mb-10 px-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em]">
              <TrendingUp className="w-3 h-3" /> Trend Ürünler
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Popüler Seçimler</h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-indigo-600 pb-1">
            Tümünü Keşfet
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="bg-slate-200 rounded-[2rem] aspect-square" />
                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group">
                <Card className="h-full border-0 bg-transparent shadow-none">
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-100 mb-5 shadow-sm group-hover:shadow-2xl group-hover:shadow-indigo-500/10 transition-all duration-500">
                    <img
                      src={product.image || categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.stock <= 5 && product.stock > 0 && (
                      <Badge className="absolute top-5 left-5 bg-orange-600/90 backdrop-blur-md border-0 text-[10px] font-black text-white rounded-lg px-3 py-1">
                        AZALDI
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-2 space-y-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] block">{product.category.name}</span>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-base font-black text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-700">4.8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight px-2">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Object.entries(categoryImages).map(([name, image]) => (
            <Link href={`/products?category=${encodeURIComponent(name)}`} key={name} className="group relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-lg">
              <img
                src={image}
                alt={name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-white font-bold text-xl mb-1 tracking-tight">{name}</h3>
                <div className="w-0 group-hover:w-full h-1 bg-indigo-500 transition-all duration-500 rounded-full" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 md:p-20 text-center md:text-left shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/20 blur-[120px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Ayrıcalıklı <br />Teknoloji Deneyimi.
            </h2>
            <p className="text-slate-400 font-medium opacity-80 text-sm md:text-base leading-relaxed">
              En yeni ürünlerden haberdar olmak ve özel indirim fırsatlarını yakalamak için hemen aramıza katılın.
            </p>
          </div>
          <Link href="/products">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-12 h-16 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95">
              ŞİMDİ KEŞFET
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import Image from 'next/image'
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
// import { ArrowRight, Zap, Shield, Truck, Star, Sparkles } from 'lucide-react'

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

// // Kategori bazlı fallback görseller
// const categoryImages: Record<string, string> = {
//   'Telefonlar': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
//   'Bilgisayarlar': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
//   'Tabletler': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
//   'Aksesuarlar': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
//   'Giyilebilir Teknoloji': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
// }

// export default function HomePage() {
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
//   const [allProducts, setAllProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch('/api/products')
//       const data = await response.json()
//       setAllProducts(data)
//       // Farklı kategorilerden ürünler seç
//       const shuffled = [...data].sort(() => 0.5 - Math.random())
//       setFeaturedProducts(shuffled.slice(0, 10))
//     } catch (error) {
//       console.error('Ürünler alınamadı:', error)
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
//     return product.image || categoryImages[product.category.name] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-16 mb-12 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-black/10"></div>
//         <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
//         <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

//         <div className="relative z-10 max-w-2xl">
//           <div className="flex items-center gap-2 mb-4">
//             <Sparkles className="w-5 h-5 text-yellow-300" />
//             <span className="text-sm font-medium text-blue-100">Yeni Sezon Ürünleri</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
//             En Yeni Teknoloji
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
//               Ürünleri
//             </span>
//           </h1>
//           <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed">
//             iPhone, MacBook, Samsung ve daha fazlası. En uygun fiyatlarla teknolojinin keyfini çıkarın.
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <Link href="/products">
//               <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
//                 Alışverişe Başla
//                 <ArrowRight className="w-5 h-5 ml-2" />
//               </Button>
//             </Link>

//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//         <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
//             <Truck className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-800">Ücretsiz Kargo</h3>
//             <p className="text-sm text-gray-500">500₺ üzeri siparişlerde</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
//             <Shield className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-800">2 Yıl Garanti</h3>
//             <p className="text-sm text-gray-500">Tüm ürünlerde geçerli</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
//             <Zap className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-800">Hızlı Teslimat</h3>
//             <p className="text-sm text-gray-500">1-3 iş günü içinde</p>
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="mb-16">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800">Öne Çıkan Ürünler</h2>
//             <p className="text-gray-500 mt-1">En çok tercih edilen ürünlerimiz</p>
//           </div>
//           <Link href="/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
//             Tümünü Gör
//             <ArrowRight className="w-4 h-4" />
//           </Link>
//         </div>

//         {loading ? (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {[...Array(10)].map((_, i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="bg-gray-200 rounded-xl aspect-[4/3] mb-3"></div>
//                 <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {featuredProducts.map((product) => (
//               <Link href={`/products/${product.id}`} key={product.id}>
//                 <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white rounded-xl cursor-pointer h-full">
//                   <div className="aspect-square bg-gray-50 relative overflow-hidden">
//                     <img
//                       src={getProductImage(product)}
//                       alt={product.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                     />
//                     {product.stock <= 5 && product.stock > 0 && (
//                       <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5">
//                         Son {product.stock}
//                       </Badge>
//                     )}
//                     {product.stock === 0 && (
//                       <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5">
//                         Tükendi
//                       </Badge>
//                     )}
//                   </div>
//                   <CardContent className="p-3">
//                     <Badge variant="outline" className="mb-2 text-xs">
//                       {product.category.name}
//                     </Badge>
//                     <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
//                       {product.name}
//                     </h3>
//                     <div className="flex items-center justify-between mt-2">
//                       <span className="text-base font-bold text-blue-600">
//                         {formatCurrency(product.price)}
//                       </span>
//                       <div className="flex items-center gap-0.5 text-yellow-500">
//                         <Star className="w-3 h-3 fill-current" />
//                         <span className="text-xs text-gray-600">4.8</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </Link>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Categories */}
//       <section className="mb-16">
//         <h2 className="text-3xl font-bold text-gray-800 mb-8">Kategoriler</h2>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           {Object.entries(categoryImages).map(([name, image]) => (
//             <Link href={`/products?category=${encodeURIComponent(name)}`} key={name}>
//               <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer group">
//                 <div className="aspect-video relative overflow-hidden">
//                   <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                   <h3 className="absolute bottom-3 left-3 font-semibold text-white">{name}</h3>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* CTA Banner */}
//       <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white mb-8">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-bold mb-2">Özel Fırsatları Kaçırma!</h2>
//             <p className="text-gray-300">Yeni ürünler ve kampanyalardan haberdar ol.</p>
//           </div>
//           <Link href="/products">
//             <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8">
//               Hemen Keşfet
//             </Button>
//           </Link>
//         </div>
//       </section>
//     </div>
//   )
// }