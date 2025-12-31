'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  HeadphonesIcon,
  Briefcase,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true)
        setIsSidebarOpen(false)
      } else {
        setIsMobile(false)
        setIsSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Satış Yönetimi', icon: ShoppingCart, href: '/admin/sales' },
    { name: 'Stok Takibi', icon: Package, href: '/admin/inventory' },
    { name: 'Muhasebe', icon: FileText, href: '/admin/accounting' },
    { name: 'İK & Personel', icon: Users, href: '/admin/hr' },
    { name: 'CV Başvuruları', icon: Briefcase, href: '/admin/cv-applications' },
    { name: 'Destek Talepleri', icon: HeadphonesIcon, href: '/admin/support' },
  ]

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Dark Mode Professional Style */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen z-50 bg-slate-950 text-slate-300 transition-all duration-300 ease-in-out flex flex-col shadow-2xl",
          isSidebarOpen ? "w-72" : "-translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        {/* Sidebar Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div className={cn("transition-all duration-300 overflow-hidden", !isSidebarOpen && "lg:hidden lg:opacity-0")}>
              <span className="text-xl font-black tracking-tighter text-white">AKB<span className="text-indigo-400">ADMIN</span></span>
            </div>
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
          <p className={cn("text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-2", !isSidebarOpen && "lg:hidden")}>
            Ana Menü
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all relative group",
                  isActive
                    ? "bg-indigo-600/10 text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                  !isSidebarOpen && "lg:justify-center lg:px-0"
                )}>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                  )}
                  <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                  <span className={cn("text-sm transition-all duration-200 whitespace-nowrap", !isSidebarOpen && "lg:hidden")}>
                    {item.name}
                  </span>
                  {isSidebarOpen && isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}

                  {/* Collapsed Tooltip */}
                  {!isSidebarOpen && !isMobile && (
                    <div className="absolute left-full ml-4 w-max bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-50 pointer-events-none shadow-xl border border-slate-800 translate-x-2 group-hover:translate-x-0">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer - Account Area */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/50">
          <div className={cn("flex items-center gap-3 p-3 rounded-2xl bg-white/5 mb-4", !isSidebarOpen && "lg:justify-center lg:p-1 lg:bg-transparent")}>
            <Avatar className={cn("border border-slate-700 transition-all", isSidebarOpen ? "w-10 h-10" : "w-8 h-8")}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-600 text-white text-xs">AD</AvatarFallback>
            </Avatar>
            <div className={cn("flex-1 overflow-hidden transition-all duration-300", !isSidebarOpen && "lg:hidden lg:opacity-0")}>
              <p className="text-xs font-bold text-white truncate uppercase tracking-tight">Ali AKBIYIK</p>
              <p className="text-[10px] text-slate-500 truncate font-medium">Baş Yönetici</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all",
              !isSidebarOpen && "lg:justify-center lg:px-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("w-4 h-4", isSidebarOpen && "mr-3")} />
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Güvenli Çıkış</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Global Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-sm shadow-slate-200/20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-600 hover:bg-slate-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="font-black text-xl text-slate-900 tracking-tight uppercase">
                {menuItems.find(item => item.href === pathname)?.name || 'Kontrol Paneli'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AKB Store Yönetim Merkezi</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center relative mr-2 group">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Hızlı arama..."
                className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-medium"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-slate-500 relative hover:bg-slate-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block" />
            <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100 rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import {
//   LayoutDashboard,
//   ShoppingCart,
//   Package,
//   Users,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   FileText,
//   PieChart,
//   HeadphonesIcon,
//   Briefcase
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { cn } from '@/lib/utils'

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname()
//   const router = useRouter()
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)
//   const [isMobile, setIsMobile] = useState(false)

//   // Responsive check
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setIsMobile(true)
//         setIsSidebarOpen(false)
//       } else {
//         setIsMobile(false)
//         setIsSidebarOpen(true)
//       }
//     }

//     handleResize()
//     window.addEventListener('resize', handleResize)
//     return () => window.removeEventListener('resize', handleResize)
//   }, [])

//   const menuItems = [
//     { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
//     { name: 'Satış Yönetimi', icon: ShoppingCart, href: '/admin/sales' },
//     { name: 'Stok Takibi', icon: Package, href: '/admin/inventory' },
//     { name: 'Muhasebe', icon: FileText, href: '/admin/accounting' },
//     { name: 'İK & Personel', icon: Users, href: '/admin/hr' },
//     { name: 'CV Başvuruları', icon: Briefcase, href: '/admin/cv-applications' },
//     { name: 'Destek Talepleri', icon: HeadphonesIcon, href: '/admin/support' },
//   ]

//   const handleLogout = () => {
//     // Burada logout işlemleri yapılabilir
//     router.push('/')
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Mobile Overlay */}
//       {isMobile && isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed lg:sticky top-0 h-screen z-50 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
//           isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:w-20 lg:translate-x-0"
//         )}
//       >
//         {/* Logo */}
//         <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
//           <div className={cn("flex items-center gap-2 font-bold text-xl text-primary overflow-hidden transition-all", !isSidebarOpen && "lg:hidden")}>
//             <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-lg">A</span>
//             <span className="whitespace-nowrap">Admin Panel</span>
//           </div>
//           <div className={cn("hidden lg:flex items-center justify-center w-full", isSidebarOpen && "hidden")}>
//             <span className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">A</span>
//           </div>
//           {isMobile && (
//             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
//               <X className="w-5 h-5" />
//             </Button>
//           )}
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
//           {menuItems.map((item) => {
//             const isActive = pathname === item.href
//             return (
//               <Link key={item.href} href={item.href}>
//                 <div className={cn(
//                   "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative group",
//                   isActive ? "bg-primary/5 text-primary font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
//                   !isSidebarOpen && "lg:justify-center lg:px-2"
//                 )}>
//                   <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-900")} />
//                   <span className={cn("transition-all duration-200", !isSidebarOpen && "lg:hidden")}>
//                     {item.name}
//                   </span>

//                   {/* Tooltip for collapsed state */}
//                   {!isSidebarOpen && !isMobile && (
//                     <div className="absolute left-full ml-2 w-max bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
//                       {item.name}
//                     </div>
//                   )}
//                 </div>
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-100">
//           {isSidebarOpen ? (
//             <div className="flex items-center gap-3 mb-4">
//               <Avatar className="w-10 h-10 border border-gray-200">
//                 <AvatarImage src="https://github.com/shadcn.png" />
//                 <AvatarFallback>AD</AvatarFallback>
//               </Avatar>
//               <div className="flex-1 overflow-hidden">
//                 <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
//                 <p className="text-xs text-gray-500 truncate">admin@techstore.com</p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex justify-center mb-4">
//               <Avatar className="w-8 h-8 border border-gray-200">
//                 <AvatarFallback>AD</AvatarFallback>
//               </Avatar>
//             </div>
//           )}

//           <Button
//             variant="outline"
//             className={cn("w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100", !isSidebarOpen && "lg:justify-center lg:px-0")}
//             onClick={handleLogout}
//           >
//             <LogOut className={cn("w-4 h-4", isSidebarOpen && "mr-2")} />
//             {isSidebarOpen && "Çıkış Yap"}
//           </Button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
//         {/* Header */}
//         <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8">
//           <div className="flex items-center">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="mr-4 lg:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <Menu className="w-5 h-5" />
//             </Button>
//             <h2 className="font-semibold text-lg text-gray-800">
//               {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
//             </h2>
//           </div>
//           <div className="flex items-center gap-4">
//             {/* Add header actions checking notif etc here */}
//             <Button variant="ghost" size="icon" className="text-gray-500">
//               <Settings className="w-5 h-5" />
//             </Button>
//           </div>
//         </header>

//         {/* Page Content */}
//         <div className="flex-1 overflow-y-auto p-4 lg:p-8">
//           {children}
//         </div>
//       </main>
//     </div>
//   )
// }