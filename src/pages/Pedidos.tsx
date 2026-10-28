import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { NuevoPedidoForm } from '../components/NuevoPedidoForm'
import { usePedidos } from '../hooks/usePedidos'
import { useClientes } from '../hooks/useClientes'
import type { CategoriaTech } from '../types/database'

export function Pedidos() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [exito, setExito] = useState<string | null>(null)
  const { pedidos, loading, crearPedido } = usePedidos()
  const { clientes, crearCliente } = useClientes()

  async function handleCrearPedido(values: {
    cliente_id: string
    producto_nombre: string
    producto_descripcion?: string
    producto_url?: string
    categoria: CategoriaTech
    notas?: string
  }) {
    const pedido = await crearPedido({
      cliente_id: values.cliente_id,
      producto_nombre: values.producto_nombre,
      producto_descripcion: values.producto_descripcion ?? null,
      producto_url: values.producto_url || null,
      categoria: values.categoria,
      estado: 'Solicitado',
      precio_usd: null,
      costo_envio_usd: null,
      impuestos_usd: null,
      comision_porcentaje: null,
      comision_monto_usd: null,
      total_usd: null,
      notas: values.notas ?? null,
    })
    setMostrarForm(false)
    setExito(`Pedido ${pedido.codigo} creado correctamente`)
    setTimeout(() => setExito(null), 4000)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} registrado{pedidos.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setMostrarForm(true)} className="gap-2">
          <Plus size={16} />
          Nuevo pedido
        </Button>
      </div>

      {/* Toast éxito */}
      {exito && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <span>✓ {exito}</span>
          <button onClick={() => setExito(null)}><X size={14} /></button>
        </div>
      )}

      {/* Formulario nuevo pedido */}
      {mostrarForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Nuevo pedido de importación</h2>
            <button onClick={() => setMostrarForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="p-6">
            <NuevoPedidoForm
              clientes={clientes}
              onSubmit={handleCrearPedido}
              onCrearCliente={crearCliente}
              onCancel={() => setMostrarForm(false)}
            />
          </div>
        </div>
      )}

      {/* Tabla pedidos */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No hay pedidos todavía</p>
            <p className="text-gray-300 text-xs mt-1">Creá el primero con el botón "Nuevo pedido"</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Código</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono text-blue-600 font-medium">{pedido.codigo}</td>
                  <td className="px-4 py-3 text-gray-700">{pedido.cliente?.nombre ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-48 truncate">{pedido.producto_nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{pedido.categoria}</td>
                  <td className="px-4 py-3"><Badge estado={pedido.estado} /></td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(pedido.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
