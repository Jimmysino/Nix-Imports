import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Cliente } from '../types/database'

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre')
    if (error) setError(error.message)
    else setClientes(data ?? [])
    setLoading(false)
  }

  async function crearCliente(cliente: Omit<Cliente, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single()
    if (error) throw new Error(error.message)
    setClientes((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    return data
  }

  return { clientes, loading, error, crearCliente, refetch: fetchClientes }
}
