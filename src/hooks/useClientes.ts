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

  async function crearCliente(cliente: Omit<Cliente, 'id' | 'created_at' | 'email' | 'direccion' | 'notas'> & {
    email?: string | null
    direccion?: string | null
    notas?: string | null
  }) {
    const { data, error } = await supabase
      .from('clientes')
      .insert({
        ...cliente,
        email: cliente.email || null,
        direccion: cliente.direccion || null,
        notas: cliente.notas || null,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    setClientes((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)))
    return data
  }

  async function actualizarCliente(id: string, cliente: {
    nombre: string
    telefono: string
    email?: string | null
    direccion?: string | null
    notas?: string | null
  }) {
    const { data, error } = await supabase
      .from('clientes')
      .update({
        ...cliente,
        email: cliente.email || null,
        direccion: cliente.direccion || null,
        notas: cliente.notas || null,
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    setClientes((prev) => prev.map((item) => item.id === id ? data : item))
    return data
  }

  return { clientes, loading, error, crearCliente, actualizarCliente, refetch: fetchClientes }
}
