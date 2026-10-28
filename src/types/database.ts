export type EstadoPedido =
  | 'Solicitado'
  | 'Cotizado'
  | 'Aprobado'
  | 'Comprado'
  | 'En tránsito'
  | 'Recibido'
  | 'Entregado'
  | 'Cancelado'

export type CategoriaTech =
  | 'Celular'
  | 'Laptop'
  | 'Tablet'
  | 'Accesorio'
  | 'Otro'

export interface Cliente {
  id: string
  nombre: string
  telefono: string
  email: string | null
  direccion: string | null
  notas: string | null
  created_at: string
}

export interface Pedido {
  id: string
  codigo: string
  cliente_id: string
  cliente?: Cliente
  producto_nombre: string
  producto_descripcion: string | null
  producto_url: string | null
  categoria: CategoriaTech
  estado: EstadoPedido
  precio_usd: number | null
  costo_envio_usd: number | null
  impuestos_usd: number | null
  comision_porcentaje: number | null
  comision_monto_usd: number | null
  total_usd: number | null
  tipo_cambio: number | null
  notas: string | null
  created_at: string
  updated_at: string
}

export interface HistorialEstado {
  id: string
  pedido_id: string
  estado: EstadoPedido
  fecha: string
  notas: string | null
}

export interface Configuracion {
  id: string
  comision_default: number
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: Cliente
        Insert: Omit<Cliente, 'id' | 'created_at'>
        Update: Partial<Omit<Cliente, 'id' | 'created_at'>>
      }
      pedidos: {
        Row: Pedido
        Insert: Omit<Pedido, 'id' | 'codigo' | 'created_at' | 'updated_at' | 'cliente'>
        Update: Partial<Omit<Pedido, 'id' | 'codigo' | 'created_at' | 'cliente'>>
      }
      historial_estados: {
        Row: HistorialEstado
        Insert: Omit<HistorialEstado, 'id' | 'fecha'>
        Update: never
      }
      configuracion: {
        Row: Configuracion
        Insert: Omit<Configuracion, 'id' | 'updated_at'>
        Update: Partial<Omit<Configuracion, 'id'>>
      }
    }
  }
}
