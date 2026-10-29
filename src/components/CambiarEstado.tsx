import { useState } from 'react'
import { ChevronRight, XCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { FLUJO_ESTADOS, getSiguienteEstado, puedeCancelar } from '../utils/estados'
import type { EstadoPedido } from '../types/database'

interface CambiarEstadoProps {
  estadoActual: EstadoPedido
  onCambiar: (nuevoEstado: EstadoPedido, notas?: string) => Promise<void>
}

export function CambiarEstado({ estadoActual, onCambiar }: CambiarEstadoProps) {
  const [cargando, setCargando] = useState(false)
  const [confirmando, setConfirmando] = useState<'avanzar' | 'cancelar' | null>(null)
  const [notas, setNotas] = useState('')
  const [error, setError] = useState<string | null>(null)

  const siguienteEstado = getSiguienteEstado(estadoActual)
  const puedeCancel = puedeCancelar(estadoActual)
  const esFinal = estadoActual === 'Entregado' || estadoActual === 'Cancelado'
  const requiereCotizacion = estadoActual === 'Solicitado'
  const siguienteVisible = requiereCotizacion ? null : siguienteEstado

  async function handleCambiar(nuevoEstado: EstadoPedido) {
    setCargando(true)
    setError(null)
    try {
      await onCambiar(nuevoEstado, notas.trim() || undefined)
      setConfirmando(null)
      setNotas('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado')
    } finally {
      setCargando(false)
    }
  }

  if (esFinal) return null

  return (
    <div className="space-y-3">
      {/* Progreso visual */}
      <div className="flex items-center gap-1 flex-wrap">
        {FLUJO_ESTADOS.map((estado, i) => {
          const idx = FLUJO_ESTADOS.indexOf(estadoActual)
          const pasado = i < idx
          const actual = i === idx
          return (
            <div key={estado} className="flex items-center gap-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                actual ? 'bg-blue-100 text-blue-700' :
                pasado ? 'bg-gray-100 text-gray-400 line-through' :
                'bg-gray-50 text-gray-400'
              }`}>
                {estado}
              </span>
              {i < FLUJO_ESTADOS.length - 1 && (
                <ChevronRight size={12} className="text-gray-300 shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">✗ {error}</p>
      )}

      {/* Panel de confirmación */}
      {confirmando && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          <p className="text-sm text-gray-700">
            {confirmando === 'avanzar'
              ? <>Cambiar estado a <strong>{siguienteEstado}</strong></>
              : <span className="text-red-600">Cancelar este pedido</span>
            }
          </p>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas opcionales sobre este cambio..."
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={confirmando === 'cancelar' ? 'danger' : 'primary'}
              loading={cargando}
              onClick={() => handleCambiar(confirmando === 'avanzar' ? siguienteEstado! : 'Cancelado')}
            >
              Confirmar
            </Button>
            <Button size="sm" variant="secondary" onClick={() => { setConfirmando(null); setNotas('') }}>
              Volver
            </Button>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      {!confirmando && (
        <div className="flex items-center gap-2">
          {requiereCotizacion ? (
            <span className="text-xs text-gray-500">
              Para cotizar este pedido, completá y guardá la cotización arriba.
            </span>
          ) : siguienteVisible && (
            <Button size="sm" onClick={() => setConfirmando('avanzar')}>
              Avanzar a {siguienteVisible}
            </Button>
          )}
          {puedeCancel && (
            <Button size="sm" variant="ghost" onClick={() => setConfirmando('cancelar')}>
              <XCircle size={14} className="text-red-400" />
              <span className="text-red-500">Cancelar pedido</span>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
