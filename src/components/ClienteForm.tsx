import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import type { Cliente } from '../types/database'

export interface ClienteFormValues {
  nombre: string
  telefono: string
  email?: string | null
  direccion?: string | null
  notas?: string | null
}

interface ClienteFormProps {
  cliente?: Cliente | null
  onGuardar: (valores: ClienteFormValues) => Promise<void>
  onCancelar: () => void
}

export function ClienteForm({ cliente, onGuardar, onCancelar }: ClienteFormProps) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [direccion, setDireccion] = useState('')
  const [notas, setNotas] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setNombre(cliente?.nombre ?? '')
    setTelefono(cliente?.telefono ?? '')
    setEmail(cliente?.email ?? '')
    setDireccion(cliente?.direccion ?? '')
    setNotas(cliente?.notas ?? '')
    setError(null)
  }, [cliente])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (nombre.trim().length < 2 || telefono.trim().length < 7) {
      setError('Completá un nombre válido y un teléfono de al menos 7 caracteres')
      return
    }
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Ingresá un email válido')
      return
    }

    setGuardando(true)
    setError(null)
    try {
      await onGuardar({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim() || null,
        direccion: direccion.trim() || null,
        notas: notas.trim() || null,
      })
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'No se pudo guardar el cliente'
      setError(mensaje.includes('unique') || mensaje.includes('duplicate') ? 'Ya existe un cliente con ese teléfono' : mensaje)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre completo" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <Input label="Teléfono" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
      </div>
      <Textarea label="Notas" value={notas} onChange={(e) => setNotas(e.target.value)} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" loading={guardando}>{cliente ? 'Guardar cambios' : 'Crear cliente'}</Button>
      </div>
    </form>
  )
}
