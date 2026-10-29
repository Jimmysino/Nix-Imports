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
  link_compra: string | null
  numero_tracking: string | null
  url_tracking: string | null
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
        Insert: Omit<Cliente, 'id' | 'created_at' | 'email' | 'direccion' | 'notas'> & {
          email?: string | null
          direccion?: string | null
          notas?: string | null
        }
        Update: Partial<Omit<Cliente, 'id' | 'created_at'>>
        Relationships: []
      }
      pedidos: {
        Row: Pedido
        Insert: Omit<Pedido, 'id' | 'codigo' | 'created_at' | 'updated_at' | 'cliente'>
        Update: Partial<Omit<Pedido, 'id' | 'codigo' | 'created_at' | 'cliente'>>
        Relationships: []
      }
      historial_estados: {
        Row: HistorialEstado
        Insert: Omit<HistorialEstado, 'id' | 'fecha'>
        Update: Partial<Omit<HistorialEstado, 'id' | 'pedido_id' | 'fecha'>>
        Relationships: []
      }
      configuracion: {
        Row: Configuracion
        Insert: Omit<Configuracion, 'id' | 'updated_at'>
        Update: Partial<Omit<Configuracion, 'id'>>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
