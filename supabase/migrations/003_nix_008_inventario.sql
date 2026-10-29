create table if not exists inventario (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid references pedidos(id) on delete set null,
  producto_nombre text not null,
  numero_serie text,
  cantidad integer not null default 1 check (cantidad > 0),
  estado text not null default 'En almacén' check (estado in ('En almacén', 'Entregado')),
  fecha_recepcion timestamptz not null default now(),
  fecha_entrega timestamptz,
  notas text,
  created_at timestamptz default now()
);
