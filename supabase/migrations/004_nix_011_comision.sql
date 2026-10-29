alter table configuracion
  add constraint configuracion_comision_default_check
  check (comision_default >= 0 and comision_default <= 100);

insert into configuracion (comision_default)
select 15
where not exists (select 1 from configuracion);
