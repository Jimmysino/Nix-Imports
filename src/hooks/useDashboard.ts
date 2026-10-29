import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { EstadoPedido, Pedido } from '../types/database'

const estadosActivos: EstadoPedido[] = [
  'Solicitado',
  'Cotizado',
  'Aprobado',
  'Comprado',
  'En tránsito',
]

interface DashboardData {
  pedidosActivos: number
  pedidosEntregados: number
  totalFacturado: number
  totalComisiones: number
  pedidosRecientes: Pedido[]
  pedidosPorEstado: Array<{ estado: EstadoPedido; cantidad: number }>
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    pedidosActivos: 0,
    pedidosEntregados: 0,
    totalFacturado: 0,
    totalComisiones: 0,
    pedidosRecientes: [],
    pedidosPorEstado: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let activo = true

    async function fetchDashboard() {
      setLoading(true)
      const { data: pedidos, error: queryError } = await supabase
        .from('pedidos')
        .select('*, cliente:clientes(*)')
        .order('created_at', { ascending: false })

      if (!activo) return
      if (queryError) {
        setError(queryError.message)
        setLoading(false)
        return
      }

      const pedidosData = (pedidos ?? []) as Pedido[]
      const entregados = pedidosData.filter((pedido) => pedido.estado === 'Entregado')
      const conteos = pedidosData.reduce<Partial<Record<EstadoPedido, number>>>((result, pedido) => {
        result[pedido.estado] = (result[pedido.estado] ?? 0) + 1
        return result
      }, {})

      setData({
        pedidosActivos: pedidosData.filter((pedido) => estadosActivos.includes(pedido.estado)).length,
        pedidosEntregados: entregados.length,
        totalFacturado: entregados.reduce((total, pedido) => total + (pedido.total_usd ?? 0), 0),
        totalComisiones: entregados.reduce((total, pedido) => total + (pedido.comision_monto_usd ?? 0), 0),
        pedidosRecientes: pedidosData.slice(0, 5),
        pedidosPorEstado: Object.entries(conteos)
          .filter(([, cantidad]) => cantidad > 0)
          .map(([estado, cantidad]) => ({ estado: estado as EstadoPedido, cantidad }))
          .sort((a, b) => a.estado.localeCompare(b.estado, 'es')),
      })
      setError(null)
      setLoading(false)
    }

    void fetchDashboard()
    return () => {
      activo = false
    }
  }, [])

  return { ...data, loading, error }
}
