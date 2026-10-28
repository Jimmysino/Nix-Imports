import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { HistorialEstado, Pedido } from '../types/database'

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
  }) {
    if (!pedido) return
    const { data, error } = await supabase
      .from('pedidos')
      .update({ ...valores, estado: 'Cotizado' })
      .eq('id', pedido.id)
      .select('*, cliente:clientes(*)')
      .single()
    if (error) throw new Error(error.message)

    const { error: histError } = await supabase.from('historial_estados').insert({
      pedido_id: pedido.id,
      estado: 'Cotizado',
      notas: 'Cotización generada',
    })
    if (histError) throw new Error(histError.message)

    setPedido(data)
    setHistorial((prev) => [...prev, { id: crypto.randomUUID(), pedido_id: pedido.id, estado: 'Cotizado', fecha: new Date().toISOString(), notas: 'Cotización generada' }])
    return data
  }

  return { pedido, historial, loading, error, actualizarCotizacion, refetch: fetchPedido }
}
