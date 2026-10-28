import type { EstadoPedido } from '../../types/database'

const estadoStyles: Record<EstadoPedido, string> = {
  Solicitado:   'bg-gray-100 text-gray-700',
  Cotizado:     'bg-yellow-100 text-yellow-700',
  Aprobado:     'bg-blue-100 text-blue-700',
  Comprado:     'bg-indigo-100 text-indigo-700',
  'En tránsito':'bg-orange-100 text-orange-700',
  Recibido:     'bg-teal-100 text-teal-700',
  Entregado:    'bg-green-100 text-green-700',
  Cancelado:    'bg-red-100 text-red-700',
}

interface BadgeProps {
  estado: EstadoPedido
}

export function Badge({ estado }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoStyles[estado]}`}>
      {estado}
    </span>
  )
}
