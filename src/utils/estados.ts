import type { EstadoPedido } from '../types/database'

export const FLUJO_ESTADOS: EstadoPedido[] = [
  'Solicitado',
  'Cotizado',
  'Aprobado',
  'Comprado',
  'En tránsito',
  'Recibido',
  'Entregado',
]

export function getSiguienteEstado(actual: EstadoPedido): EstadoPedido | null {
  const idx = FLUJO_ESTADOS.indexOf(actual)
  if (idx === -1 || idx === FLUJO_ESTADOS.length - 1) return null
  return FLUJO_ESTADOS[idx + 1]
}

export function puedeAvanzar(actual: EstadoPedido): boolean {
  return getSiguienteEstado(actual) !== null
}

export function puedeCancelar(actual: EstadoPedido): boolean {
  return actual !== 'Entregado' && actual !== 'Cancelado'
}
