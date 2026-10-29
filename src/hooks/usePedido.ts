import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { EstadoPedido, HistorialEstado, Pedido } from '../types/database'
import { getSiguienteEstado, puedeCancelar } from '../utils/estados'

export function usePedido(id: string) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [historial, setHistorial] = useState<HistorialEstado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) fetchPedido()
  }, [id])

  async function fetchPedido() {
    setLoading(true)
    const [{ data: pedidoData, error: pedidoError }, { data: historialData }] = await Promise.all([
      supabase.from('pedidos').select('*, cliente:clientes(*)').eq('id', id).single(),
      supabase.from('historial_estados').select('*').eq('pedido_id', id).order('fecha', { ascending: true }),
    ])
    if (pedidoError) setError(pedidoError.message)
    else {
      setPedido(pedidoData)
      setHistorial(historialData ?? [])
    }
    setLoading(false)
  }

  async function actualizarCotizacion(valores: {
    precio_usd: number
    costo_envio_usd: number
    impuestos_usd: number
    comision_porcentaje: number
    comision_monto_usd: number
    total_usd: number
    tipo_cambio: number
  }) {
    if (!pedido) return
    const estadoAnterior = pedido.estado
    if (pedido.estado !== 'Solicitado' && pedido.estado !== 'Cotizado') {
      throw new Error('La cotización solo puede modificarse antes de aprobar el pedido')
    }

    if (valores.precio_usd <= 0 || valores.tipo_cambio <= 0) {
      throw new Error('El precio y el tipo de cambio deben ser mayores a cero')
    }

    const { data, error } = await supabase
      .from('pedidos')
      .update({ ...valores, estado: 'Cotizado' })
      .eq('id', pedido.id)
      .select('*, cliente:clientes(*)')
      .single()
    if (error) throw new Error(error.message)

    if (estadoAnterior === 'Solicitado') {
      const { error: historialError } = await supabase.from('historial_estados').insert({
        pedido_id: pedido.id,
        estado: 'Cotizado',
        notas: 'Cotización generada',
      })
      if (historialError) throw new Error(historialError.message)
    }

    await fetchPedido()
    return data
  }

  async function cambiarEstado(nuevoEstado: EstadoPedido, notas?: string) {
    if (!pedido) return

    // Validar que no se salten estados
    if (nuevoEstado !== 'Cancelado') {
      const siguiente = getSiguienteEstado(pedido.estado)
      if (nuevoEstado === 'Cotizado') {
        throw new Error('Para cotizar el pedido usá el formulario de cotización')
      }
      if (siguiente !== nuevoEstado) {
        throw new Error(`No se puede pasar de "${pedido.estado}" a "${nuevoEstado}" directamente`)
      }
    } else {
      if (!puedeCancelar(pedido.estado)) {
        throw new Error('Este pedido no puede cancelarse')
      }
    }

    const { error } = await supabase
      .from('pedidos')
      .update({ estado: nuevoEstado })
      .eq('id', pedido.id)
    if (error) throw new Error(error.message)

    const { error: historialError } = await supabase.from('historial_estados').insert({
      pedido_id: pedido.id,
      estado: nuevoEstado,
      notas: notas ?? null,
    })
    if (historialError) throw new Error(historialError.message)

    await fetchPedido()
  }

  return { pedido, historial, loading, error, actualizarCotizacion, cambiarEstado, refetch: fetchPedido }
}
