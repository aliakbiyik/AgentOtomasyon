'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react'

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

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setFeaturedProducts(data.slice(0, 4))
    } catch (error) {
      console.error('Ürünler alınamadı:', error)
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

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-16 mb-12 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            En Yeni Teknoloji Ürünleri
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            iPhone, MacBook, Samsung ve daha fazlası. En uygun fiyatlarla teknolojinin keyfini çıkarın.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Ürünleri İncele
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Ücretsiz Kargo</h3>
            <p className="text-sm text-gray-500">500 TL üzeri siparişlerde</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
          <div className="p-3 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">2 Yıl Garanti</h3>
            <p className="text-sm text-gray-500">Tüm ürünlerde geçerli</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold">Hızlı Teslimat</h3>
            <p className="text-sm text-gray-500">1-3 iş günü içinde</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Öne Çıkan Ürünler</h2>
          <Link href="/products" className="text-blue-600 hover:underline flex items-center gap-1">
            Tümünü Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Yükleniyor...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-6xl">📱</span>
                </div>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {product.category.name}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(product.price)}
                    </span>
                    {product.stock > 0 ? (
                      <Badge className="bg-green-100 text-green-800">Stokta</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Tükendi</Badge>
                    )}
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <Button className="w-full mt-4">
                      Ürünü İncele
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}