import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { usePedido } from '../hooks/usePedido'
import { useConfiguracion } from '../hooks/useConfiguracion'
import { Badge } from '../components/ui/Badge'
import { CotizacionForm } from '../components/CotizacionForm'
import { CambiarEstado } from '../components/CambiarEstado'
import { formatUSD } from '../utils/cotizacion'

export function PedidoDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pedido, historial, loading, error, actualizarCotizacion, cambiarEstado } = usePedido(id!)
  const { config } = useConfiguracion()

  if (loading) {
    return <div className="p-6 text-sm text-gray-400">Cargando pedido...</div>
  }

  if (error || !pedido) {
    return <div className="p-6 text-sm text-red-500">Error: {error ?? 'Pedido no encontrado'}</div>
  }

  const puedeEditar = pedido.estado === 'Solicitado' || pedido.estado === 'Cotizado'

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/pedidos')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 font-mono">{pedido.codigo}</h1>
              <Badge estado={pedido.estado} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(pedido.created_at).toLocaleDateString('es-AR', { dateStyle: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Cambiar estado */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Estado del pedido</h2>
        <CambiarEstado estadoActual={pedido.estado} onCambiar={cambiarEstado} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Columna izquierda: info del pedido */}
        <div className="col-span-2 space-y-6">

          {/* Datos del producto */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
            <h2 className="font-semibold text-gray-700">Producto solicitado</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-400 w-24 shrink-0">Nombre</span>
                <span className="text-gray-800 font-medium">{pedido.producto_nombre}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-24 shrink-0">Categoría</span>
                <span className="text-gray-700">{pedido.categoria}</span>
              </div>
              {pedido.producto_descripcion && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Descripción</span>
                  <span className="text-gray-700">{pedido.producto_descripcion}</span>
                </div>
              )}
              {pedido.producto_url && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">URL</span>
                  <a
                    href={pedido.producto_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 truncate"
                  >
                    Ver en tienda <ExternalLink size={12} />
                  </a>
                </div>
              )}
              {pedido.notas && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 shrink-0">Notas</span>
                  <span className="text-gray-700">{pedido.notas}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cotización */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700">Cotización</h2>
              {pedido.estado === 'Cotizado' && (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  ✓ Cotizado — {formatUSD(pedido.total_usd)}
                </span>
              )}
            </div>
            {!config ? (
              <p className="text-sm text-gray-400">Cargando configuración...</p>
            ) : (
              <CotizacionForm
                comisionDefault={config.comision_default}
                soloLectura={!puedeEditar}
                valoresIniciales={
                  pedido.precio_usd !== null
                    ? {
                        precio_usd: pedido.precio_usd ?? undefined,
                        costo_envio_usd: pedido.costo_envio_usd ?? undefined,
                        impuestos_usd: pedido.impuestos_usd ?? undefined,
                        comision_porcentaje: pedido.comision_porcentaje ?? undefined,
                        tipo_cambio: pedido.tipo_cambio ?? undefined,
                      }
                    : undefined
                }
                onGuardar={actualizarCotizacion}
              />
            )}
          </div>
        </div>

        {/* Columna derecha: cliente + historial */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
            <h2 className="font-semibold text-gray-700 mb-3">Cliente</h2>
            <p className="text-sm font-medium text-gray-800">{pedido.cliente?.nombre}</p>
            <p className="text-sm text-gray-500">📱 {pedido.cliente?.telefono}</p>
            {pedido.cliente?.email && (
              <p className="text-sm text-gray-500">📧 {pedido.cliente.email}</p>
            )}
            {pedido.cliente?.direccion && (
              <p className="text-sm text-gray-500">📍 {pedido.cliente.direccion}</p>
            )}
          </div>

          {/* Historial */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-semibold text-gray-700 mb-4">Historial</h2>
            <div className="space-y-3">
              {historial.map((h, i) => (
                <div key={h.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${i === historial.length - 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    {i < historial.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs font-medium text-gray-700">{h.estado}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(h.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
