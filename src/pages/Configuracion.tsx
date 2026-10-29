import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useConfiguracion } from '../hooks/useConfiguracion'

export function Configuracion() {
  const { config, loading, error, actualizarComision } = useConfiguracion()
  const [comision, setComision] = useState('15')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null)

  useEffect(() => {
    if (config) setComision(String(config.comision_default))
  }, [config])

  async function guardar(event: FormEvent) {
    event.preventDefault()
    const valor = Number(comision)
    if (!Number.isFinite(valor) || valor < 0 || valor > 100) {
      setErrorGuardado('La comisión debe estar entre 0% y 100%')
      return
    }

    setGuardando(true)
    setMensaje(null)
    setErrorGuardado(null)
    try {
      await actualizarComision(valor)
      setMensaje('Comisión guardada correctamente')
    } catch (err) {
      setErrorGuardado(err instanceof Error ? err.message : 'No se pudo guardar la comisión')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-500">Comisión y parámetros generales de importación</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-900">Comisión por defecto</h2>
          <p className="mt-1 text-sm text-gray-500">Se aplica al crear nuevas cotizaciones sin una comisión personalizada.</p>
        </div>

        {loading ? (
          <p className="px-6 py-8 text-sm text-gray-400">Cargando configuración...</p>
        ) : (
          <form onSubmit={guardar} className="space-y-4 p-6">
            {(error || errorGuardado) && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorGuardado ?? error}</p>
            )}
            {mensaje && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{mensaje}</p>}
            <Input
              label="Porcentaje de comisión"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              value={comision}
              onChange={(event) => setComision(event.target.value)}
              disabled={!config}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={guardando} disabled={!config}>Guardar comisión</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
