alter table pedidos
  add column if not exists link_compra text,
  add column if not exists numero_tracking text,
  add column if not exists url_tracking text;
