create table if not exists costos_adicionales (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  concepto text not null,
  monto_usd numeric(12,2) not null check (monto_usd > 0),
  notas text,
  created_at timestamptz default now()
);

create index if not exists costos_adicionales_pedido_id_idx
  on costos_adicionales(pedido_id);
