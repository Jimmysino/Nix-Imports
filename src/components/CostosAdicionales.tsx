import { useState } from 'react'
import type { FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import type { CostoAdicional } from '../types/database'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { formatUSD } from '../utils/cotizacion'

interface CostosAdicionalesProps {
  costos: CostoAdicional[]
  onAgregar: (concepto: string, monto: number, notas?: string) => Promise<unknown>
  onEliminar: (costo: CostoAdicional) => Promise<void>
}

export function CostosAdicionales({ costos, onAgregar, onEliminar }: CostosAdicionalesProps) {
  const [concepto, setConcepto] = useState('')
  const [monto, setMonto] = useState('')
  const [notas, setNotas] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const total = costos.reduce((suma, costo) => suma + costo.monto_usd, 0)

  async function guardar(event: FormEvent) {
    event.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      await onAgregar(concepto, Number(monto), notas)
      setConcepto('')
      setMonto('')
      setNotas('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el costo')
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(costo: CostoAdicional) {
    setEliminando(costo.id)
    setError(null)
    try {
      await onEliminar(costo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el costo')
    } finally {
      setEliminando(null)
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <form onSubmit={guardar} className="grid gap-3 md:grid-cols-[1fr_140px]">
        <Input label="Concepto" required value={concepto} onChange={(event) => setConcepto(event.target.value)} placeholder="Seguro, almacenamiento, despacho..." />
        <Input label="Monto USD" type="number" min="0.01" step="0.01" required value={monto} onChange={(event) => setMonto(event.target.value)} />
        <div className="md:col-span-2">
          <Textarea label="Notas (opcional)" value={notas} onChange={(event) => setNotas(event.target.value)} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" loading={guardando}>Agregar costo</Button>
        </div>
      </form>

      {costos.length > 0 && (
        <div className="space-y-2">
          {costos.map((costo) => (
            <div key={costo.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2">
              <div>
                <p className="text-sm font-medium text-gray-800">{costo.concepto}</p>
                {costo.notas && <p className="mt-0.5 text-xs text-gray-500">{costo.notas}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">{formatUSD(costo.monto_usd)}</span>
                <button type="button" disabled={eliminando === costo.id} onClick={() => eliminar(costo)} className="text-red-400 hover:text-red-600 disabled:opacity-50" aria-label={`Eliminar ${costo.concepto}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <p className="flex justify-between border-t pt-3 text-sm font-semibold text-gray-800"><span>Total de costos adicionales</span><span>{formatUSD(total)}</span></p>
        </div>
      )}
    </div>
  )
}