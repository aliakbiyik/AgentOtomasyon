'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, ArrowRight, PackageSearch } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CartItem {
  id: number
  name: string
  price: string | number
  quantity: number
  image?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(cart)
    } catch (error) {
      toast.error('Sepet yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    toast.success('Ürün sepetten kaldırıldı')
    window.dispatchEvent(new Event('cart-updated'))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
    toast.success('Sepet temizlendi')
    window.dispatchEvent(new Event('cart-updated'))
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(num)
  }

  const getItemTotal = (item: CartItem) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
    return price * item.quantity
  }

  const getSubTotal = () => {
    return cartItems.reduce((total, item) => total + getItemTotal(item), 0)
  }
  
  const FREE_SHIPPING_THRESHOLD = 1500
  const SHIPPING_COST = 59.90
  const subTotal = getSubTotal()
  const isFreeShipping = subTotal >= FREE_SHIPPING_THRESHOLD
  const shippingCost = isFreeShipping ? 0 : SHIPPING_COST
  const total = subTotal + shippingCost
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subTotal)
  const shippingProgress = Math.min(100, (subTotal / FREE_SHIPPING_THRESHOLD) * 100)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-8">
          <ShoppingBag className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Sepetiniz Boş</h2>
        <p className="text-slate-500 mb-10 max-w-sm text-center leading-relaxed font-medium">
          Görünüşe göre henüz sepetinize bir şey eklememişsiniz. Harika fırsatları keşfetmeye ne dersiniz?
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-12 h-14 font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            ALIŞVERİŞE BAŞLA
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em]">
            Hızlı Ödeme / Kontrol
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-left">Sepetim</h1>
          <p className="text-slate-500 text-sm font-medium">{cartItems.length} farklı ürün seçildi</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={clearCart} 
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-bold text-xs uppercase transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Sepeti Temizle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Progress - Visual Upgrade */}
          <Card className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-xl transition-colors", isFreeShipping ? "bg-emerald-100" : "bg-indigo-50")}>
                    <Truck className={cn("w-5 h-5", isFreeShipping ? "text-emerald-600" : "text-indigo-600")} />
                  </div>
                  <span className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    {isFreeShipping ? "Kargo Ücretiniz Bizden!" : "Kargo Bedava Fırsatı"}
                  </span>
                </div>
                {!isFreeShipping && (
                  <span className="text-xs font-bold text-indigo-600">
                    {formatCurrency(remainingForFreeShipping)} kaldı
                  </span>
                )}
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-1000", isFreeShipping ? "bg-emerald-500" : "bg-indigo-500")}
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-0 bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
                  {/* Item Image */}
                  <div className="relative w-24 h-24 bg-slate-50 rounded-[1.5rem] overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    ) : (
                      <PackageSearch className="w-8 h-8 text-slate-200" />
                    )}
                  </div>

                  {/* Item Content */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <Link href={`/products/${item.id}`} className="hover:text-indigo-600 transition-colors">
                        <h3 className="font-bold text-slate-800 leading-tight">{item.name}</h3>
                      </Link>
                      <p className="font-black text-lg text-slate-900 whitespace-nowrap">
                        {formatCurrency(getItemTotal(item))}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{formatCurrency(item.price)} / Birim</p>

                      <div className="flex items-center gap-4">
                        {/* Quantity Logic */}
                        <div className="flex items-center bg-slate-50 rounded-xl border border-slate-100 p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-10 text-center font-black text-slate-800">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] px-4">
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
             Alışverişiniz 256-bit SSL ve uçtan uca şifreleme ile korunmaktadır.
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <Card className="rounded-[2.5rem] border-0 bg-white shadow-2xl shadow-indigo-500/10 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-8">
                <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-8">
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span className="uppercase tracking-widest text-[10px]">Ara Toplam</span>
                  <span className="text-slate-900 font-black">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span className="flex items-center gap-2 uppercase tracking-widest text-[10px]">
                    Lojistik
                    {isFreeShipping && <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-0 text-[9px] font-black uppercase">Bedava</Badge>}
                  </span>
                  <span className={cn("font-black", isFreeShipping ? "text-emerald-500" : "text-slate-900")}>
                    {isFreeShipping ? '0,00 ₺' : formatCurrency(shippingCost)}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-dashed border-slate-200">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Genel Toplam</span>
                    <span className="text-3xl font-black text-indigo-600 tracking-tighter">{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3 pt-4 pb-10 px-8">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 active:scale-95">
                    ÖDEMEYE GEÇ
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
                <Link href="/products" className="w-full">
                  <Button variant="ghost" className="w-full h-12 text-slate-400 font-bold hover:text-slate-900 transition-colors">
                    Alışverişe Devam Et
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// 'use client'

// import { useEffect, useState } from 'react'
// import Link from 'next/link'
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, ArrowRight } from 'lucide-react'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface CartItem {
//   id: number
//   name: string
//   price: string | number
//   quantity: number
//   image?: string
// }

// export default function CartPage() {
//   const [cartItems, setCartItems] = useState<CartItem[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     loadCart()
//   }, [])

//   const loadCart = () => {
//     try {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]')
//       setCartItems(cart)
//     } catch (error) {
//       console.error('Failed to load cart', error)
//       toast.error('Sepet yüklenirken bir hata oluştu')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const updateQuantity = (id: number, newQuantity: number) => {
//     if (newQuantity < 1) return
    
//     const updatedCart = cartItems.map((item) =>
//       item.id === id ? { ...item, quantity: newQuantity } : item
//     )
//     setCartItems(updatedCart)
//     localStorage.setItem('cart', JSON.stringify(updatedCart))
//     // Optional: toast.success('Sepet güncellendi') 
//   }

//   const removeItem = (id: number) => {
//     const updatedCart = cartItems.filter((item) => item.id !== id)
//     setCartItems(updatedCart)
//     localStorage.setItem('cart', JSON.stringify(updatedCart))
//     toast.success('Ürün sepetten kaldırıldı')
//   }

//   const clearCart = () => {
//     setCartItems([])
//     localStorage.removeItem('cart')
//     toast.success('Sepet temizlendi')
//   }

//   const formatCurrency = (value: string | number) => {
//     const num = typeof value === 'string' ? parseFloat(value) : value
//     return new Intl.NumberFormat('tr-TR', {
//       style: 'currency',
//       currency: 'TRY'
//     }).format(num)
//   }

//   const getItemTotal = (item: CartItem) => {
//     const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
//     return price * item.quantity
//   }

//   const getSubTotal = () => {
//     return cartItems.reduce((total, item) => total + getItemTotal(item), 0)
//   }
  
//   // Example logic for shipping threshold
//   const FREE_SHIPPING_THRESHOLD = 1500
//   const SHIPPING_COST = 59.90
//   const subTotal = getSubTotal()
//   const isFreeShipping = subTotal >= FREE_SHIPPING_THRESHOLD
//   const shippingCost = isFreeShipping ? 0 : SHIPPING_COST
//   const total = subTotal + shippingCost
//   const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subTotal)

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
//         <div className="bg-muted/30 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
//           <ShoppingBag className="w-12 h-12 text-muted-foreground" />
//         </div>
//         <h2 className="text-2xl font-bold text-foreground mb-2">Sepetiniz Boş</h2>
//         <p className="text-muted-foreground mb-8 max-w-md mx-auto">
//           Henüz sepetinize ürün eklemediniz. Fırsatları kaçırmamak için alışverişe hemen başlayın.
//         </p>
//         <Link href="/products">
//           <Button size="lg" className="rounded-full px-8">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Alışverişe Başla
//           </Button>
//         </Link>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-gray-50/50 min-h-screen pb-12">
//       <div className="container max-w-6xl mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sepetim</h1>
//             <p className="text-gray-500 mt-1">{cartItems.length} ürün listeleniyor</p>
//           </div>
//           <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
//             <Trash2 className="w-4 h-4 mr-2" />
//             Sepeti Temizle
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* Cart Items List */}
//           <div className="lg:col-span-8 space-y-4">
//             {/* Free Shipping Progress */}
//             {!isFreeShipping && (
//               <Card className="bg-blue-50 border-blue-100 shadow-sm">
//                 <CardContent className="p-4 flex items-center gap-3 text-blue-800">
//                   <div className="bg-blue-100 p-2 rounded-full">
//                     <Truck className="w-5 h-5 text-blue-600" />
//                   </div>
//                   <div className="text-sm">
//                     <span className="font-semibold text-blue-700">Kargo Bedava</span> için{' '}
//                     <span className="font-bold">{formatCurrency(remainingForFreeShipping)}</span> daha ekleyin!
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <div className="space-y-4">
//               {cartItems.map((item) => (
//                 <Card key={item.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
//                   <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
//                     {/* Image */}
//                     <div className="relative w-full sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 aspect-square">
//                         {item.image ? (
//                            <img 
//                               src={item.image} 
//                               alt={item.name} 
//                               className="w-full h-full object-cover"
//                            />
//                         ) : (
//                            <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
//                         )}
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 w-full">
//                       <div className="flex justify-between items-start mb-2">
//                         <Link href={`/products/${item.id}`} className="hover:underline">
//                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{item.name}</h3>
//                         </Link>
//                         <p className="font-bold text-lg text-blue-600 ml-4 hidden sm:block">
//                           {formatCurrency(getItemTotal(item))}
//                         </p>
//                       </div>
                      
//                       <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mt-4 sm:mt-0">
//                           <p className="text-gray-500 text-sm">{formatCurrency(item.price)} / adet</p>

//                           <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
//                             {/* Quantity */}
//                             <div className="flex items-center border rounded-lg bg-gray-50">
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-9 w-9 text-gray-600 hover:text-black"
//                                 onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                                 disabled={item.quantity <= 1}
//                               >
//                                 <Minus className="w-3 h-3" />
//                               </Button>
//                               <Input
//                                 type="number"
//                                 value={item.quantity}
//                                 onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
//                                 className="w-12 h-9 border-0 bg-transparent text-center focus-visible:ring-0 p-0 text-sm font-medium"
//                                 min="1"
//                               />
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-9 w-9 text-gray-600 hover:text-black"
//                                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                               >
//                                 <Plus className="w-3 h-3" />
//                               </Button>
//                             </div>

//                             {/* Mobile Price Display */}
//                              <p className="font-bold text-lg text-blue-600 sm:hidden">
//                                 {formatCurrency(getItemTotal(item))}
//                              </p>

//                             {/* Remove */}
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => removeItem(item.id)}
//                               className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mr-2"
//                             >
//                               <Trash2 className="w-5 h-5" />
//                             </Button>
//                           </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
            
//             <div className="flex items-center gap-2 text-sm text-gray-500 mt-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
//                <ShieldCheck className="w-5 h-5 text-green-600" />
//                <p>Alışverişiniz 256-bit SSL sertifikası ile korunmaktadır.</p>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-4">
//             <div className="sticky top-24 space-y-6">
//               <Card className="shadow-lg border-primary/10 overflow-hidden">
//                 <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
//                   <CardTitle className="text-xl">Sipariş Özeti</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4 pt-6">
//                   <div className="flex justify-between items-center text-gray-600">
//                     <span>Ara Toplam</span>
//                     <span className="font-medium text-gray-900">{formatCurrency(subTotal)}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-gray-600">
//                     <span className="flex items-center gap-2">
//                        Kargo
//                        {isFreeShipping && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Bedava</Badge>}
//                     </span>
//                     <span className={cn("font-medium", isFreeShipping ? "text-green-600" : "text-gray-900")}>
//                        {isFreeShipping ? '0,00 ₺' : formatCurrency(shippingCost)}
//                     </span>
//                   </div>
                  
//                   <div className="border-t border-dashed my-4"></div>
                  
//                   <div className="flex justify-between items-end">
//                     <span className="text-lg font-bold text-gray-900">Toplam</span>
//                     <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="flex-col gap-3 pt-2 pb-6">
//                   <Link href="/checkout" className="w-full">
//                     <Button className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
//                       Siparişi Tamamla
//                       <ArrowRight className="w-5 h-5 ml-2" />
//                     </Button>
//                   </Link>
//                   <Link href="/products" className="w-full">
//                     <Button variant="outline" className="w-full border-gray-200">
//                       Alışverişe Devam Et
//                     </Button>
//                   </Link>
//                 </CardFooter>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }