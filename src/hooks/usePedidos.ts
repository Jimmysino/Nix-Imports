import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Pedido } from '../types/database'

export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPedidos()
  }, [])

  async function fetchPedidos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, cliente:clientes(*)')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setPedidos(data ?? [])
    setLoading(false)
  }

  async function crearPedido(pedido: Omit<Pedido, 'id' | 'codigo' | 'created_at' | 'updated_at' | 'cliente'>) {
    const { data, error } = await supabase
      .from('pedidos')
      .insert(pedido)
      .select('*, cliente:clientes(*)')
      .single()
    if (error) throw new Error(error.message)
    // Registrar estado inicial en historial
    const { error: historialError } = await supabase.from('historial_estados').insert({
      pedido_id: data.id,
      estado: 'Solicitado',
      notas: 'Pedido creado',
    })
    if (historialError) throw new Error(historialError.message)
    setPedidos((prev) => [data, ...prev])
    return data
  }

  return { pedidos, loading, error, crearPedido, refetch: fetchPedidos }
}
