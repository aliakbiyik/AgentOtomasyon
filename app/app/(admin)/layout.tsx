import Link from 'next/link'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  Users, 
  HeadphonesIcon,
  FileUser,
  Settings
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/sales', label: 'Satışlar', icon: ShoppingCart },
  { href: '/admin/inventory', label: 'Stok', icon: Package },
  { href: '/admin/accounting', label: 'Muhasebe', icon: FileText },
  { href: '/admin/hr', label: 'İnsan Kaynakları', icon: Users },
  { href: '/admin/support', label: 'Destek', icon: HeadphonesIcon },
  { href: '/admin/cv-applications', label: 'CV Başvuruları', icon: FileUser },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">🏪 TechStore</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}