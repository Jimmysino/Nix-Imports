import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { useDashboard } from '../hooks/useDashboard'
import { formatUSD } from '../utils/cotizacion'

export function Dashboard() {
  const navigate = useNavigate()
  const {
    pedidosActivos,
    pedidosEntregados,
    totalFacturado,
    totalComisiones,
    pedidosRecientes,
    pedidosPorEstado,
    clientesRegistrados,
    productosEnAlmacen,
    loading,
    error,
  } = useDashboard()

  const resumen = [
    { titulo: 'Pedidos activos', valor: String(pedidosActivos) },
    { titulo: 'Pedidos entregados', valor: String(pedidosEntregados) },
    { titulo: 'Total facturado', valor: formatUSD(totalFacturado) },
    { titulo: 'Comisiones cobradas', valor: formatUSD(totalComisiones) },
    { titulo: 'Clientes registrados', valor: String(clientesRegistrados) },
    { titulo: 'Productos en almacén', valor: String(productosEnAlmacen) },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen general del negocio</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {resumen.map((item) => (
          <div key={item.titulo} className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
            <p className="text-sm text-gray-500">{item.titulo}</p>
            {loading ? (
              <div className="mt-2 h-8 w-24 animate-pulse rounded bg-gray-100" />
            ) : (
              <p className="mt-1 text-2xl font-semibold text-gray-900">{item.valor}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Pedidos recientes</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-sm text-gray-400">Cargando pedidos...</div>
            ) : pedidosRecientes.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">No hay pedidos todavía</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Cliente</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosRecientes.map((pedido) => (
                    <tr
                      key={pedido.id}
                      onClick={() => navigate(`/pedidos/${pedido.id}`)}
                      className="cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-mono font-medium text-blue-600">{pedido.codigo}</td>
                      <td className="px-4 py-3 text-gray-700">{pedido.cliente?.nombre ?? '—'}</td>
                      <td className="max-w-48 truncate px-4 py-3 text-gray-700">{pedido.producto_nombre || '—'}</td>
                      <td className="px-4 py-3"><Badge estado={pedido.estado} /></td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(pedido.created_at).toLocaleDateString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Pedidos por estado</h2>
          </div>
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-400">Cargando...</div>
          ) : pedidosPorEstado.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No hay datos</div>
          ) : (
            <div className="divide-y divide-gray-100 px-5">
              {pedidosPorEstado.map(({ estado, cantidad }) => (
                <div key={estado} className="flex items-center justify-between py-3">
                  <Badge estado={estado} />
                  <span className="text-sm font-semibold text-gray-700">{cantidad}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
