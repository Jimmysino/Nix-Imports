import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { calcularCotizacion, formatUSD, formatLocal } from '../utils/cotizacion'

const schema = z.object({
  precio_usd:          z.coerce.number().positive('Debe ser mayor a 0'),
  costo_envio_usd:     z.coerce.number().min(0, 'No puede ser negativo'),
  impuestos_usd:       z.coerce.number().min(0, 'No puede ser negativo'),
  comision_porcentaje: z.coerce.number().min(0).max(100, 'Máximo 100%'),
  tipo_cambio:         z.coerce.number().positive('Debe ser mayor a 0'),
})

type CotizacionValues = z.infer<typeof schema>

interface CotizacionFormProps {
  comisionDefault: number
  valoresIniciales?: Partial<CotizacionValues>
  onGuardar: (valores: CotizacionValues & { comision_monto_usd: number; total_usd: number }) => Promise<void>
  soloLectura?: boolean
}

export function CotizacionForm({ comisionDefault, valoresIniciales, onGuardar, soloLectura }: CotizacionFormProps) {
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<CotizacionValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      precio_usd:          valoresIniciales?.precio_usd ?? 0,
      costo_envio_usd:     valoresIniciales?.costo_envio_usd ?? 0,
      impuestos_usd:       valoresIniciales?.impuestos_usd ?? 0,
      comision_porcentaje: valoresIniciales?.comision_porcentaje ?? comisionDefault,
      tipo_cambio:         valoresIniciales?.tipo_cambio ?? 1,
    },
  })

  const valores = watch()
  const { comisionMonto, total } = calcularCotizacion(
    valores.precio_usd || 0,
    valores.costo_envio_usd || 0,
    valores.impuestos_usd || 0,
    valores.comision_porcentaje || 0
  )

  // Resetear a comisión default
  useEffect(() => {
    if (!valoresIniciales?.comision_porcentaje) {
      setValue('comision_porcentaje', comisionDefault)
    }
  }, [comisionDefault])

  async function onSubmit(values: CotizacionValues) {
    setGuardando(true)
    setError(null)
    try {
      await onGuardar({ ...values, comision_monto_usd: comisionMonto, total_usd: total })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar cotización')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          ✗ {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio del producto (USD)"
          type="number"
          step="0.01"
          min="0"
          required
          disabled={soloLectura}
          {...register('precio_usd')}
          error={errors.precio_usd?.message}
        />
        <Input
          label="Costo de envío (USD)"
          type="number"
          step="0.01"
          min="0"
          disabled={soloLectura}
          {...register('costo_envio_usd')}
          error={errors.costo_envio_usd?.message}
        />
        <Input
          label="Impuestos estimados (USD)"
          type="number"
          step="0.01"
          min="0"
          disabled={soloLectura}
          {...register('impuestos_usd')}
          error={errors.impuestos_usd?.message}
        />
        <Input
          label="Comisión (%)"
          type="number"
          step="0.1"
          min="0"
          max="100"
          disabled={soloLectura}
          {...register('comision_porcentaje')}
          error={errors.comision_porcentaje?.message}
        />
        <Input
          label="Tipo de cambio (1 USD = ?)"
          type="number"
          step="0.01"
          min="0"
          required
          disabled={soloLectura}
          {...register('tipo_cambio')}
          error={errors.tipo_cambio?.message}
        />
      </div>

      {/* Desglose */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm">
        <h4 className="font-semibold text-gray-700 mb-3">Desglose de costos</h4>
        <div className="flex justify-between text-gray-600">
          <span>Precio del producto</span>
          <span>{formatUSD(valores.precio_usd || 0)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Envío internacional</span>
          <span>{formatUSD(valores.costo_envio_usd || 0)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Impuestos</span>
          <span>{formatUSD(valores.impuestos_usd || 0)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Comisión NIX ({valores.comision_porcentaje || 0}%)</span>
          <span>{formatUSD(comisionMonto)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-300">
          <span>Total a cobrar (USD)</span>
          <span className="text-blue-600">{formatUSD(total)}</span>
        </div>
        {(valores.tipo_cambio || 0) > 1 && (
          <div className="flex justify-between text-sm text-gray-500">
            <span>Equivalente en moneda local</span>
            <span className="font-medium text-gray-700">$ {formatLocal(total, valores.tipo_cambio || 1)}</span>
          </div>
        )}
      </div>

      {!soloLectura && (
        <div className="flex justify-end">
          <Button type="submit" loading={guardando}>
            Guardar cotización
          </Button>
        </div>
      )}
    </form>
  )
}
