import { NavLink, Outlet } from 'react-router-dom'
import { Package, Users, LayoutDashboard, Settings, Boxes } from 'lucide-react'

const navItems = [
  { to: '/',            label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/pedidos',     label: 'Pedidos',     icon: Package },
  { to: '/clientes',    label: 'Clientes',    icon: Users },
  { to: '/inventario',  label: 'Inventario',  icon: Boxes },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
]

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-lg font-bold text-blue-600 tracking-tight">NIX IMPORTS</h1>
          <p className="text-xs text-gray-400 mt-0.5">Panel de administración</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
