import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { supabase } from '../lib/supabase'
import type { InventarioItem, Pedido } from '../types/database'

export function Inventario() {
  const [items, setItems] = useState<InventarioItem[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [entregando, setEntregando] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pedidoId, setPedidoId] = useState('')
  const [productoNombre, setProductoNombre] = useState('')
  const [numeroSerie, setNumeroSerie] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [fechaRecepcion, setFechaRecepcion] = useState(new Date().toISOString().slice(0, 10))
  const [notas, setNotas] = useState('')

  useEffect(() => {
    Promise.all([
      supabase.from('inventario').select('*').order('fecha_recepcion', { ascending: false }),
      supabase.from('pedidos').select('*').neq('estado', 'Cancelado').order('created_at', { ascending: false }),
    ]).then(([inventarioResult, pedidosResult]) => {
      if (inventarioResult.error) setError(inventarioResult.error.message)
      else setItems(inventarioResult.data ?? [])
      if (pedidosResult.error) setError(pedidosResult.error.message)
      else setPedidos(pedidosResult.data ?? [])
      setLoading(false)
    })
  }, [])

  async function guardar(event: FormEvent) {
    event.preventDefault()
    const cantidadNumero = Number(cantidad)
    if (!productoNombre.trim()) return setError('Ingresá el nombre del producto')
    if (!Number.isInteger(cantidadNumero) || cantidadNumero < 1) return setError('La cantidad debe ser un número entero mayor a cero')

    setGuardando(true)
    setError(null)
    const { data, error } = await supabase.from('inventario').insert({
      pedido_id: pedidoId || null,
      producto_nombre: productoNombre.trim(),
      numero_serie: numeroSerie.trim() || null,
      cantidad: cantidadNumero,
      estado: 'En almacén',
      fecha_recepcion: new Date(`${fechaRecepcion}T12:00:00`).toISOString(),
      fecha_entrega: null,
      notas: notas.trim() || null,
    }).select().single()
    setGuardando(false)
    if (error) {
      setError(error.message)
      return
    }
    setItems((actuales) => [data, ...actuales])
    setMostrarForm(false)
    setPedidoId('')
    setProductoNombre('')
    setNumeroSerie('')
    setCantidad('1')
    setNotas('')
  }

  async function marcarEntregado(id: string) {
    setEntregando(id)
    setError(null)
    const fechaEntrega = new Date().toISOString()
    const { error } = await supabase
      .from('inventario')
      .update({ estado: 'Entregado', fecha_entrega: fechaEntrega })
      .eq('id', id)

    setEntregando(null)
    if (error) {
      setError(error.message)
      return
    }
    setItems((actuales) => actuales.map((item) => item.id === id
      ? { ...item, estado: 'Entregado', fecha_entrega: fechaEntrega }
      : item))
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-0.5 text-sm text-gray-500">{items.filter((item) => item.estado === 'En almacén').length} productos en almacén</p>
        </div>
        <Button onClick={() => setMostrarForm(true)} className="gap-2"><Plus size={16} /> Registrar producto</Button>
      </div>

      {mostrarForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">Registrar producto recibido</h2>
            <button type="button" onClick={() => setMostrarForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={guardar} className="space-y-4 p-6">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Pedido asociado" value={pedidoId} onChange={(event) => {
                const id = event.target.value
                setPedidoId(id)
                const pedido = pedidos.find((item) => item.id === id)
                if (pedido) setProductoNombre(pedido.producto_nombre)
              }} options={pedidos.map((pedido) => ({ value: pedido.id, label: `${pedido.codigo} · ${pedido.producto_nombre}` }))} placeholder="Sin pedido asociado" />
              <Input label="Producto" required value={productoNombre} onChange={(event) => setProductoNombre(event.target.value)} />
              <Input label="Número de serie" value={numeroSerie} onChange={(event) => setNumeroSerie(event.target.value)} />
              <Input label="Cantidad" type="number" min="1" step="1" required value={cantidad} onChange={(event) => setCantidad(event.target.value)} />
              <Input label="Fecha de recepción" type="date" required value={fechaRecepcion} onChange={(event) => setFechaRecepcion(event.target.value)} />
            </div>
            <Textarea label="Notas" value={notas} onChange={(event) => setNotas(event.target.value)} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setMostrarForm(false)}>Cancelar</Button>
              <Button type="submit" loading={guardando}>Registrar producto</Button>
            </div>
          </form>
        </div>
      )}

      {error && !mostrarForm && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando inventario...</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">Todavía no hay productos registrados</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Serie</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Cantidad</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Recepción</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Entrega</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
            </tr></thead>
            <tbody>{items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{item.producto_nombre}</td>
                <td className="px-4 py-3 text-gray-500">{item.numero_serie || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{item.cantidad}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(item.fecha_recepcion).toLocaleDateString('es-AR')}</td>
                <td className="px-4 py-3 text-gray-500">{item.fecha_entrega ? new Date(item.fecha_entrega).toLocaleDateString('es-AR') : '—'}</td>
                <td className="px-4 py-3">
                  {item.estado === 'En almacén' ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="gap-1"
                      loading={entregando === item.id}
                      onClick={() => marcarEntregado(item.id)}
                    >
                      <Check size={14} /> Marcar entregado
                    </Button>
                  ) : (
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">Entregado</span>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}
