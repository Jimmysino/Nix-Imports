import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminLayout } from './layouts/AdminLayout'
import { Dashboard } from './pages/Dashboard'
import { Pedidos } from './pages/Pedidos'
import { Clientes } from './pages/Clientes'
import { Inventario } from './pages/Inventario'
import { Configuracion } from './pages/Configuracion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
