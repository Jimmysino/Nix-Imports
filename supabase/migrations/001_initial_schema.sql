-- Clientes
create table clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null unique,
  email text,
  direccion text,
  notas text,
  created_at timestamptz default now()
);

-- Pedidos
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  cliente_id uuid not null references clientes(id),
  producto_nombre text not null,
  producto_descripcion text,
  producto_url text,
  link_compra text,
  numero_tracking text,
  url_tracking text,
  categoria text not null check (categoria in ('Celular','Laptop','Tablet','Accesorio','Otro')),
  estado text not null default 'Solicitado' check (estado in ('Solicitado','Cotizado','Aprobado','Comprado','En tránsito','Recibido','Entregado','Cancelado')),
  precio_usd numeric(10,2),
  costo_envio_usd numeric(10,2),
  impuestos_usd numeric(10,2),
  comision_porcentaje numeric(5,2),
  comision_monto_usd numeric(10,2),
  total_usd numeric(10,2),
  tipo_cambio numeric(10,2),
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Historial de estados del pedido
create table historial_estados (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  estado text not null,
  fecha timestamptz default now(),
  notas text
);

-- Configuración global
create table configuracion (
  id uuid primary key default gen_random_uuid(),
  comision_default numeric(5,2) not null default 15,
  updated_at timestamptz default now()
);

-- Insertar configuración inicial
insert into configuracion (comision_default) values (15);

-- Función para generar código de pedido: NIX-0001, NIX-0002...
create sequence pedido_seq start 1;

create or replace function generar_codigo_pedido()
returns trigger as $$
begin
  new.codigo := 'NIX-' || lpad(nextval('pedido_seq')::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger trigger_codigo_pedido
  before insert on pedidos
  for each row execute function generar_codigo_pedido();

-- Trigger para updated_at en pedidos
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_updated_at
  before update on pedidos
  for each row execute function update_updated_at();
