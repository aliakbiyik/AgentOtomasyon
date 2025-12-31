'use client'

import Link from 'next/link'
import { ShoppingCart, Home, Package, User, HeadphonesIcon, LogOut, LogIn, Briefcase, Menu, X } from 'lucide-react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function NavBar() {
  const { customer, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏪</span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
              AKB Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/", icon: Home, label: "Ana Sayfa" },
              { href: "/products", icon: Package, label: "Ürünler" },
              { href: "/cart", icon: ShoppingCart, label: "Sepet" },
              { href: "/career", icon: Briefcase, label: "Kariyer" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full transition-all duration-200"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {customer ? (
              <div className="flex items-center gap-1 border-l border-slate-200 ml-2 pl-2">
                <Link
                  href="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full transition-all"
                >
                  <User className="w-4 h-4" />
                  Siparişlerim
                </Link>
                <Link
                  href="/support"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-full transition-all"
                >
                  <HeadphonesIcon className="w-4 h-4" />
                  Destek
                </Link>

                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 bg-slate-50/50 rounded-full px-3 py-1">
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Müşteri</span>
                    <span className="text-sm font-bold text-slate-700">{customer.name.split(' ')[0]}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="ml-4">
                <Button size="sm" className="bg-slate-900 hover:bg-indigo-700 text-white font-semibold px-6 rounded-full transition-all">
                  <LogIn className="w-4 h-4 mr-2" /> Giriş Yap
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-slate-50">
            <nav className="flex flex-col gap-2">
              {[{ href: "/", icon: Home, label: "Ana Sayfa" }, { href: "/products", icon: Package, label: "Ürünler" }, { href: "/career", icon: Briefcase, label: "Kariyer" }].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-4 px-4 py-4 text-slate-700 hover:bg-indigo-50 rounded-2xl font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  <item.icon className="w-5 h-5 text-indigo-600" /> {item.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-50" />
              {customer ? (
                <>
                  <Link href="/orders" className="flex items-center gap-4 px-4 py-4 text-slate-700 hover:bg-indigo-50 rounded-2xl font-semibold" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-5 h-5 text-indigo-600" /> Siparişlerim
                  </Link>
                  <button onClick={logout} className="flex items-center gap-4 px-4 py-4 text-red-600 font-bold">
                    <LogOut className="w-5 h-5" /> Çıkış Yap
                  </button>
                </>
              ) : (
                <Link href="/login" className="px-4 pt-2" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-12 rounded-2xl bg-indigo-600 font-bold text-base">Giriş Yap</Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-900">
        <NavBar />
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10 py-10">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-100 mt-20">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2 space-y-4">
                <span className="text-2xl font-black tracking-tight text-slate-800">AKB Store</span>
                <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                  Yeni nesil teknoloji standartlarını belirleyen, kullanıcı odaklı profesyonel alışveriş deneyimi.
                </p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Agent Otomasyon Projesi © 2025</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest">Hızlı Linkler</h3>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><Link href="/products" className="hover:text-indigo-600 transition-colors">Ürün Koleksiyonu</Link></li>
                  <li><Link href="/cart" className="hover:text-indigo-600 transition-colors">Alışveriş Sepeti</Link></li>
                  <li><Link href="/career" className="hover:text-indigo-600 transition-colors">Kariyer Fırsatları</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-6 text-xs uppercase tracking-widest">Müşteri Destek</h3>
                <ul className="space-y-4 text-sm font-medium text-slate-500">
                  <li><Link href="/support" className="hover:text-indigo-600 transition-colors">Yardım Merkezi</Link></li>
                  <li className="text-slate-900 font-bold">info@akbstore.com</li>
                  <li className="text-slate-900 font-bold">0850 123 45 67</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-50 mt-16 pt-8 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Tüm hakları saklıdır.</span>
              <div className="flex gap-6">
                <span>KVKK</span>
                <span>Gizlilik</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}

// 'use client'

// import Link from 'next/link'
// import { ShoppingCart, Home, Package, User, HeadphonesIcon, LogOut, LogIn, Briefcase, Menu, X } from 'lucide-react'
// import { AuthProvider, useAuth } from '@/lib/auth-context'
// import { Button } from '@/components/ui/button'
// import { useState } from 'react'

// function NavBar() {
//   const { customer, logout } = useAuth()
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   return (
//     <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2">
//             <span className="text-2xl">🏪</span>
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TechStore</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-1">
//             <Link
//               href="/"
//               className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//             >
//               <Home className="w-4 h-4" />
//               Ana Sayfa
//             </Link>
//             <Link
//               href="/products"
//               className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//             >
//               <Package className="w-4 h-4" />
//               Ürünler
//             </Link>
//             <Link
//               href="/cart"
//               className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//             >
//               <ShoppingCart className="w-4 h-4" />
//               Sepet
//             </Link>
//             <Link
//               href="/career"
//               className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//             >
//               <Briefcase className="w-4 h-4" />
//               Kariyer
//             </Link>
            
//             {customer ? (
//               <>
//                 <Link
//                   href="/orders"
//                   className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                 >
//                   <User className="w-4 h-4" />
//                   Siparişlerim
//                 </Link>
//                 <Link
//                   href="/support"
//                   className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                 >
//                   <HeadphonesIcon className="w-4 h-4" />
//                   Destek
//                 </Link>
//                 <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
//                   <span className="text-sm text-gray-600">
//                     Merhaba, <strong className="text-gray-800">{customer.name.split(' ')[0]}</strong>
//                   </span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={logout}
//                     className="text-red-500 hover:text-red-600 hover:bg-red-50"
//                   >
//                     <LogOut className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <Link href="/login" className="ml-2">
//                 <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6">
//                   <LogIn className="w-4 h-4 mr-2" />
//                   Giriş Yap
//                 </Button>
//               </Link>
//             )}
//           </nav>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-4">
//             <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg">
//               <ShoppingCart className="w-6 h-6 text-gray-600" />
//             </Link>
//             <button 
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden py-4 border-t">
//             <nav className="flex flex-col gap-2">
//               <Link href="/" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
//                 <Home className="w-5 h-5" /> Ana Sayfa
//               </Link>
//               <Link href="/products" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
//                 <Package className="w-5 h-5" /> Ürünler
//               </Link>
//               <Link href="/career" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
//                 <Briefcase className="w-5 h-5" /> Kariyer
//               </Link>
//               {customer ? (
//                 <>
//                   <Link href="/orders" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
//                     <User className="w-5 h-5" /> Siparişlerim
//                   </Link>
//                   <Link href="/support" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
//                     <HeadphonesIcon className="w-5 h-5" /> Destek
//                   </Link>
//                 </>
//               ) : (
//                 <Link href="/login" className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
//                   <LogIn className="w-5 h-5" /> Giriş Yap
//                 </Link>
//               )}
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }

// export default function CustomerLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <AuthProvider>
//       <div className="flex flex-col min-h-screen bg-gray-50">
//         <NavBar />

//         {/* Main Content - flex-1 ile kalan alanı doldurur */}
//         <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-8">
//           {children}
//         </main>

//         {/* Footer - her zaman en altta */}
//         <footer className="bg-white border-t mt-auto">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//               {/* Logo & Description */}
//               <div className="col-span-1 md:col-span-2">
//                 <div className="flex items-center gap-2 mb-4">
//                   <span className="text-2xl">🏪</span>
//                   <span className="text-xl font-bold text-gray-800">TechStore</span>
//                 </div>
//                 <p className="text-gray-500 mb-4">
//                   En yeni teknoloji ürünlerini en uygun fiyatlarla sunan güvenilir alışveriş platformu.
//                 </p>
//                 <p className="text-sm text-gray-400">
//                   Agent Otomasyon Bitirme Projesi © 2025
//                 </p>
//               </div>

//               {/* Quick Links */}
//               <div>
//                 <h3 className="font-semibold text-gray-800 mb-4">Hızlı Linkler</h3>
//                 <ul className="space-y-2">
//                   <li><Link href="/products" className="text-gray-500 hover:text-blue-600 transition-colors">Ürünler</Link></li>
//                   <li><Link href="/cart" className="text-gray-500 hover:text-blue-600 transition-colors">Sepetim</Link></li>
//                   <li><Link href="/orders" className="text-gray-500 hover:text-blue-600 transition-colors">Siparişlerim</Link></li>
//                   <li><Link href="/career" className="text-gray-500 hover:text-blue-600 transition-colors">Kariyer</Link></li>
//                 </ul>
//               </div>

//               {/* Support */}
//               <div>
//                 <h3 className="font-semibold text-gray-800 mb-4">Destek</h3>
//                 <ul className="space-y-2">
//                   <li><Link href="/support" className="text-gray-500 hover:text-blue-600 transition-colors">Yardım Merkezi</Link></li>
//                   <li><span className="text-gray-500">info@techstore.com</span></li>
//                   <li><span className="text-gray-500">0850 123 45 67</span></li>
//                 </ul>
//               </div>
//             </div>

//             <div className="border-t mt-8 pt-8 text-center text-gray-400 text-sm">
//               <p>© 2025 TechStore. Tüm hakları saklıdır.</p>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </AuthProvider>
//   )
// }