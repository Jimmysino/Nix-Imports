import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Search, X } from 'lucide-react'
import { ClienteForm } from '../components/ClienteForm'
import { Button } from '../components/ui/Button'
import { useClientes } from '../hooks/useClientes'
import { supabase } from '../lib/supabase'
import type { Cliente } from '../types/database'

export function Clientes() {
  const { clientes, loading, error, crearCliente, actualizarCliente } = useClientes()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [conteos, setConteos] = useState<Record<string, number>>({})
  const [errorConteos, setErrorConteos] = useState<string | null>(null)

  useEffect(() => {
    cargarConteos()
  }, [])

  async function cargarConteos() {
    const { data, error } = await supabase.from('pedidos').select('cliente_id')
    if (error) {
      setErrorConteos(error.message)
      return
    }
    const conteo: Record<string, number> = {}
    for (const pedido of data ?? []) {
      if (pedido.cliente_id) conteo[pedido.cliente_id] = (conteo[pedido.cliente_id] ?? 0) + 1
    }
    setConteos(conteo)
  }

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es-AR')
    if (!texto) return clientes
    return clientes.filter((cliente) =>
      cliente.nombre.toLocaleLowerCase('es-AR').includes(texto) ||
      cliente.telefono.toLocaleLowerCase('es-AR').includes(texto)
    )
  }, [clientes, busqueda])

  function nuevoCliente() {
    setClienteEditando(null)
    setMostrarForm(true)
  }

  function editarCliente(cliente: Cliente) {
    setClienteEditando(cliente)
    setMostrarForm(true)
  }

  async function guardarCliente(valores: Parameters<typeof crearCliente>[0]) {
    if (clienteEditando) await actualizarCliente(clienteEditando.id, valores)
    else await crearCliente(valores)
    await cargarConteos()
    setMostrarForm(false)
    setClienteEditando(null)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Clientes</h1>
          <p className="mt-0.5 text-sm text-gray-500">{clientesFiltrados.length} de {clientes.length} clientes</p>
        </div>
        <Button onClick={nuevoCliente} className="gap-2"><Plus size={16} /> Nuevo cliente</Button>
      </div>

      {mostrarForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">{clienteEditando ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <button onClick={() => setMostrarForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <div className="p-6">
            <ClienteForm cliente={clienteEditando} onGuardar={guardarCliente} onCancelar={() => setMostrarForm(false)} />
          </div>
        </div>
      )}

      <div className="mb-4 relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Buscar por nombre o teléfono"
          className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {(error || errorConteos) && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error || errorConteos}</p>}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Cargando clientes...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No se encontraron clientes</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Teléfono</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Pedidos</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{cliente.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{cliente.telefono}</td>
                  <td className="px-4 py-3 text-gray-500">{cliente.email || '—'}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{conteos[cliente.id] ?? 0}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => editarCliente(cliente)} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                      <Pencil size={14} /> Editar
                    </button>
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
