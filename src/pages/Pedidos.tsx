import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDownUp, Plus, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { NuevoPedidoForm } from '../components/NuevoPedidoForm'
import { usePedidos } from '../hooks/usePedidos'
import { useClientes } from '../hooks/useClientes'
import { FLUJO_ESTADOS } from '../utils/estados'
import { formatUSD } from '../utils/cotizacion'
import type { CategoriaTech, EstadoPedido, Pedido } from '../types/database'

type OrdenPedidos = 'fecha-desc' | 'fecha-asc' | 'estado-asc'

export function Pedidos() {
  const navigate = useNavigate()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [exito, setExito] = useState<string | null>(null)
  const [errorForm, setErrorForm] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [estadosSeleccionados, setEstadosSeleccionados] = useState<EstadoPedido[]>([])
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [orden, setOrden] = useState<OrdenPedidos>('fecha-desc')
  const { pedidos, loading, crearPedido } = usePedidos()
  const { clientes, crearCliente } = useClientes()

  const pedidosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es-AR')
    const desde = fechaDesde ? new Date(`${fechaDesde}T00:00:00`) : null
    const hasta = fechaHasta ? new Date(`${fechaHasta}T23:59:59`) : null

    const filtrados = pedidos.filter((pedido: Pedido) => {
      const coincideBusqueda = !texto || [pedido.cliente?.nombre, pedido.producto_nombre]
        .some((valor) => valor?.toLocaleLowerCase('es-AR').includes(texto))
      const coincideEstado = estadosSeleccionados.length === 0 || estadosSeleccionados.includes(pedido.estado)
      const fechaPedido = new Date(pedido.created_at)
      const coincideDesde = !desde || fechaPedido >= desde
      const coincideHasta = !hasta || fechaPedido <= hasta
      return coincideBusqueda && coincideEstado && coincideDesde && coincideHasta
    })

    return [...filtrados].sort((a, b) => {
      if (orden === 'fecha-asc') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (orden === 'estado-asc') return FLUJO_ESTADOS.indexOf(a.estado) - FLUJO_ESTADOS.indexOf(b.estado)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [pedidos, busqueda, estadosSeleccionados, fechaDesde, fechaHasta, orden])

  function alternarEstado(estado: EstadoPedido) {
    setEstadosSeleccionados((actuales) => actuales.includes(estado)
      ? actuales.filter((item) => item !== estado)
      : [...actuales, estado])
  }

  function limpiarFiltros() {
    setBusqueda('')
    setEstadosSeleccionados([])
    setFechaDesde('')
    setFechaHasta('')
    setOrden('fecha-desc')
  }

  async function handleCrearPedido(values: {
    cliente_id: string
    producto_nombre: string
    producto_descripcion?: string
    producto_url?: string
    categoria: CategoriaTech
    notas?: string
  }) {
    setErrorForm(null)
    try {
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
        tipo_cambio: null,
        notas: values.notas ?? null,
      })
      setMostrarForm(false)
      setExito(`Pedido ${pedido.codigo} creado correctamente`)
      setTimeout(() => setExito(null), 4000)
    } catch (err: unknown) {
      setErrorForm(err instanceof Error ? err.message : 'Error al crear el pedido')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {pedidosFiltrados.length} de {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => { setMostrarForm(true); setErrorForm(null) }} className="gap-2">
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
            {errorForm && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                ✗ {errorForm}
              </div>
            )}
            <NuevoPedidoForm
              clientes={clientes}
              onSubmit={handleCrearPedido}
              onCrearCliente={crearCliente}
              onCancel={() => setMostrarForm(false)}
            />
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_180px_190px]">
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por cliente o producto..."
            className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Desde
            <input
              type="date"
              value={fechaDesde}
              onChange={(event) => setFechaDesde(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-blue-500"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            Hasta
            <input
              type="date"
              value={fechaHasta}
              onChange={(event) => setFechaHasta(event.target.value)}
              className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 px-2 text-sm outline-none focus:border-blue-500"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <ArrowDownUp size={14} />
            <select
              value={orden}
              onChange={(event) => setOrden(event.target.value as OrdenPedidos)}
              className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="fecha-desc">Fecha más reciente</option>
              <option value="fecha-asc">Fecha más antigua</option>
              <option value="estado-asc">Estado del flujo</option>
            </select>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {FLUJO_ESTADOS.concat('Cancelado').map((estado) => {
            const seleccionado = estadosSeleccionados.includes(estado)
            return (
              <button
                key={estado}
                type="button"
                onClick={() => alternarEstado(estado)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  seleccionado
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                {estado}
              </button>
            )
          })}
          {(busqueda || estadosSeleccionados.length > 0 || fechaDesde || fechaHasta || orden !== 'fecha-desc') && (
            <button type="button" onClick={limpiarFiltros} className="ml-auto text-xs font-medium text-blue-600 hover:text-blue-700">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla pedidos */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No hay pedidos todavía</p>
            <p className="text-gray-300 text-xs mt-1">Creá el primero con el botón "Nuevo pedido"</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No hay pedidos que coincidan con los filtros</p>
            <button type="button" onClick={limpiarFiltros} className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700">
              Limpiar filtros
            </button>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total USD</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} onClick={() => navigate(`/pedidos/${pedido.id}`)} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono text-blue-600 font-medium">{pedido.codigo}</td>
                  <td className="px-4 py-3 text-gray-700">{pedido.cliente?.nombre ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-48 truncate">{pedido.producto_nombre}</td>
                  <td className="px-4 py-3 text-gray-500">{pedido.categoria}</td>
                  <td className="px-4 py-3"><Badge estado={pedido.estado} /></td>
                  <td className="px-4 py-3 font-medium text-gray-700">{formatUSD(pedido.total_usd)}</td>
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
