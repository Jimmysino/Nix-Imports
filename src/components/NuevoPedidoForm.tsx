import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, X } from 'lucide-react'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Textarea } from './ui/Textarea'
import { Button } from './ui/Button'
import type { CategoriaTech, Cliente } from '../types/database'

const categoriaOptions: { value: CategoriaTech; label: string }[] = [
  { value: 'Celular',   label: 'Celular / Smartphone' },
  { value: 'Laptop',    label: 'Laptop / Notebook' },
  { value: 'Tablet',    label: 'Tablet' },
  { value: 'Accesorio', label: 'Accesorio' },
  { value: 'Otro',      label: 'Otro' },
]

const clienteSchema = z.object({
  nombre:    z.string().min(2, 'Mínimo 2 caracteres'),
  telefono:  z.string().min(7, 'Teléfono inválido'),
  email:     z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  notas:     z.string().optional(),
})

const pedidoSchema = z.object({
  cliente_id:             z.string().min(1, 'Seleccioná un cliente'),
  producto_nombre:        z.string().min(2, 'Ingresá el nombre del producto'),
  producto_descripcion:   z.string().optional(),
  producto_url:           z.string().url('URL inválida').optional().or(z.literal('')),
  categoria:              z.enum(['Celular','Laptop','Tablet','Accesorio','Otro']),
  notas:                  z.string().optional(),
})

type PedidoFormValues = z.infer<typeof pedidoSchema>
type ClienteFormValues = z.infer<typeof clienteSchema>

interface NuevoPedidoFormProps {
  clientes: Cliente[]
  onSubmit: (values: PedidoFormValues) => Promise<void>
  onCrearCliente: (values: ClienteFormValues) => Promise<Cliente>
  onCancel: () => void
}

export function NuevoPedidoForm({ clientes, onSubmit, onCrearCliente, onCancel }: NuevoPedidoFormProps) {
  const [mostrarNuevoCliente, setMostrarNuevoCliente] = useState(false)
  const [guardandoCliente, setGuardandoCliente] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const pedidoForm = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: { categoria: 'Celular' },
  })

  const clienteForm = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
  })

  async function handleGuardarCliente(values: ClienteFormValues) {
    setGuardandoCliente(true)
    try {
      const nuevo = await onCrearCliente(values)
      pedidoForm.setValue('cliente_id', nuevo.id)
      setMostrarNuevoCliente(false)
      clienteForm.reset()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar cliente'
      clienteForm.setError('telefono', { message: msg.includes('unique') ? 'Ya existe un cliente con ese teléfono' : msg })
    } finally {
      setGuardandoCliente(false)
    }
  }

  async function handleSubmit(values: PedidoFormValues) {
    setEnviando(true)
    try {
      await onSubmit(values)
    } finally {
      setEnviando(false)
    }
  }

  const clienteSeleccionado = clientes.find(
    (c) => c.id === pedidoForm.watch('cliente_id')
  )

  return (
    <form onSubmit={pedidoForm.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Sección cliente */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cliente</h3>
          {!mostrarNuevoCliente && (
            <button
              type="button"
              onClick={() => setMostrarNuevoCliente(true)}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <UserPlus size={14} />
              Nuevo cliente
            </button>
          )}
        </div>

        {mostrarNuevoCliente ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-blue-700">Crear nuevo cliente</p>
              <button type="button" onClick={() => setMostrarNuevoCliente(false)}>
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Nombre completo"
                required
                placeholder="Juan Pérez"
                {...clienteForm.register('nombre')}
                error={clienteForm.formState.errors.nombre?.message}
              />
              <Input
                label="Teléfono"
                required
                placeholder="+54 9 11 1234-5678"
                {...clienteForm.register('telefono')}
                error={clienteForm.formState.errors.telefono?.message}
              />
              <Input
                label="Email"
                type="email"
                placeholder="juan@email.com"
                {...clienteForm.register('email')}
                error={clienteForm.formState.errors.email?.message}
              />
              <Input
                label="Dirección"
                placeholder="Calle 123, Ciudad"
                {...clienteForm.register('direccion')}
              />
            </div>
            <Button
              type="button"
              size="sm"
              loading={guardandoCliente}
              onClick={clienteForm.handleSubmit(handleGuardarCliente)}
            >
              Guardar cliente
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Select
              label="Seleccionar cliente"
              required
              placeholder="— Seleccioná un cliente —"
              options={clientes.map((c) => ({ value: c.id, label: `${c.nombre} · ${c.telefono}` }))}
              {...pedidoForm.register('cliente_id')}
              error={pedidoForm.formState.errors.cliente_id?.message}
            />
            {clienteSeleccionado && (
              <p className="text-xs text-gray-500 pl-1">
                {clienteSeleccionado.email && `📧 ${clienteSeleccionado.email}`}
                {clienteSeleccionado.email && clienteSeleccionado.direccion && ' · '}
                {clienteSeleccionado.direccion && `📍 ${clienteSeleccionado.direccion}`}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sección producto */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Producto</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Nombre del producto"
            required
            placeholder="iPhone 15 Pro 256GB"
            {...pedidoForm.register('producto_nombre')}
            error={pedidoForm.formState.errors.producto_nombre?.message}
          />
          <Select
            label="Categoría"
            required
            options={categoriaOptions}
            {...pedidoForm.register('categoria')}
            error={pedidoForm.formState.errors.categoria?.message}
          />
        </div>
        <Input
          label="URL del producto"
          placeholder="https://www.ebay.com/itm/..."
          {...pedidoForm.register('producto_url')}
          error={pedidoForm.formState.errors.producto_url?.message}
        />
        <Textarea
          label="Descripción / especificaciones"
          placeholder="Color, memoria, modelo exacto, condición (nuevo/usado)..."
          {...pedidoForm.register('producto_descripcion')}
        />
      </div>

      {/* Notas internas */}
      <Textarea
        label="Notas internas"
        placeholder="Cualquier detalle relevante para este pedido..."
        {...pedidoForm.register('notas')}
      />

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={enviando}>
          Crear pedido
        </Button>
      </div>
    </form>
  )
}
