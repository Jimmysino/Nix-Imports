import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { CostoAdicional, EstadoPedido, HistorialEstado, Pedido } from '../types/database'
import { getSiguienteEstado, puedeCancelar } from '../utils/estados'

export function usePedido(id: string) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [historial, setHistorial] = useState<HistorialEstado[]>([])
  const [costosAdicionales, setCostosAdicionales] = useState<CostoAdicional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) fetchPedido()
  }, [id])

  async function fetchPedido() {
    setLoading(true)
    const [{ data: pedidoData, error: pedidoError }, { data: historialData }, { data: costosData }] = await Promise.all([
      supabase.from('pedidos').select('*, cliente:clientes(*)').eq('id', id).single(),
      supabase.from('historial_estados').select('*').eq('pedido_id', id).order('fecha', { ascending: true }),
      supabase.from('costos_adicionales').select('*').eq('pedido_id', id).order('created_at', { ascending: false }),
    ])
    if (pedidoError) setError(pedidoError.message)
    else {
      setPedido(pedidoData)
      setHistorial(historialData ?? [])
      setCostosAdicionales(costosData ?? [])
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

  async function actualizarCompra(datos: {
    link_compra: string | null
    numero_tracking: string | null
    url_tracking: string | null
  }) {
    if (!pedido) throw new Error('Pedido no encontrado')

    const { data, error } = await supabase
      .from('pedidos')
      .update(datos)
      .eq('id', pedido.id)
      .select('*, cliente:clientes(*)')
      .single()
    if (error) throw new Error(error.message)

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

  async function agregarCostoAdicional(concepto: string, monto: number, notas?: string) {
    if (!pedido) throw new Error('Pedido no encontrado')
    if (!concepto.trim()) throw new Error('Ingresá el concepto del costo')
    if (!Number.isFinite(monto) || monto <= 0) throw new Error('El monto debe ser mayor a cero')

    const { data, error } = await supabase
      .from('costos_adicionales')
      .insert({ pedido_id: pedido.id, concepto: concepto.trim(), monto_usd: monto, notas: notas?.trim() || null })
      .select()
      .single()
    if (error) throw new Error(error.message)

    if (pedido.total_usd !== null) {
      await supabase.from('pedidos').update({ total_usd: pedido.total_usd + monto }).eq('id', pedido.id)
    }
    await fetchPedido()
    return data
  }

  async function eliminarCostoAdicional(costo: CostoAdicional) {
    if (!pedido) throw new Error('Pedido no encontrado')
    const { error } = await supabase.from('costos_adicionales').delete().eq('id', costo.id)
    if (error) throw new Error(error.message)

    if (pedido.total_usd !== null) {
      await supabase.from('pedidos').update({ total_usd: Math.max(0, pedido.total_usd - costo.monto_usd) }).eq('id', pedido.id)
    }
    await fetchPedido()
  }

  return { pedido, historial, costosAdicionales, loading, error, actualizarCotizacion, actualizarCompra, cambiarEstado, agregarCostoAdicional, eliminarCostoAdicional, refetch: fetchPedido }
}
