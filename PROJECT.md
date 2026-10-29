# NIX IMPORTS - Sistema ERP para Importadora

## Contexto del Negocio

**Empresa:** NIX IMPORTS — importadora que opera como intermediaria entre proveedores internacionales y clientes locales.

**Moneda de operación:** Los productos se compran en USD (dólares) y se cotizan/cobran al cliente en moneda local. El admin registra los montos en USD y el sistema debe mostrar el equivalente en moneda local (tipo de cambio manual por ahora).

**Modelo de negocio:** La empresa NO compra inventario propio de tecnología. Funciona bajo demanda: el cliente pide, la empresa importa y cobra comisión por el servicio. La ganancia principal es la comisión sobre cada importación.

### Líneas de negocio

**1. Productos Tecnológicos (MVP1) — Importación por encargo**
- El cliente quiere un producto específico (celular, laptop, tablet, accesorios, etc.)
- Puede traerlo de: eBay, Amazon, tiendas de USA, etc.
- NIX IMPORTS se encarga de: comprar, gestionar el envío internacional, pasar aduana, y entregar al cliente
- Se cobra: precio del producto + costos de importación + comisión (% configurable)
- Tipos de cliente: personas individuales (la mayoría), a veces pequeños negocios

**2. Perfumes (MVP futuro) — Compra y reventa**
- La empresa importa lotes de perfumes directamente de proveedores
- Se vende a dos tipos de clientes:
  - **Minoristas:** compran pocas unidades a precio más alto
  - **Mayoristas:** compran en volumen a precio con descuento
- Aquí SÍ hay inventario propio que gestionar

**Alcance actual:** Solo panel de administrador. No hay portal de cliente ni app móvil.

---

## MVP1 - Gestión de Importaciones de Productos Tecnológicos

### Flujo del negocio (paso a paso)
1. **Solicitud:** Cliente contacta a NIX IMPORTS (WhatsApp, presencial, etc.) y dice qué producto quiere
2. **Registro:** Admin crea el pedido en el sistema con los datos del cliente y el producto (link, descripción)
3. **Cotización:** Admin investiga precios, ingresa costos (producto + envío + impuestos) y el sistema calcula el total con comisión
4. **Aprobación:** Se le envía la cotización al cliente. Si acepta, el pedido pasa a "Aprobado" y el cliente paga (total o anticipo)
5. **Compra:** Admin realiza la compra en el sitio de origen (eBay, Amazon, etc.) y registra el comprobante
6. **Tránsito:** El producto está en camino. Se registra número de tracking y se monitorea
7. **Recepción:** Producto llega a la bodega/oficina de NIX IMPORTS. Se registra en inventario temporal
8. **Entrega:** Se entrega al cliente, se confirma recepción y se cierra el pedido

### Canales de contacto con el cliente
- WhatsApp (principal)
- Presencial
- El sistema NO tiene portal de cliente — toda la comunicación es externa

### Categorías de productos tecnológicos
- Celulares / Smartphones
- Laptops / Notebooks
- Tablets
- Accesorios (cargadores, cases, audífonos, etc.)
- Otros (consolas, componentes, etc.)

---

## Product Backlog - MVP1

### Epic 1: Gestión de Pedidos de Importación

| ID | Historia de Usuario | Prioridad | Puntos | Sprint |
|----|-------------------|-----------|--------|--------|
| NIX-001 | Registrar pedido de importación | Alta | 8 | 1 |
| NIX-002 | Calcular costo total y cotización | Alta | 5 | 1 |
| NIX-003 | Cambiar estado del pedido | Alta | 5 | 1 |
| NIX-004 | Listar pedidos con filtros | Alta | 5 | 1 |
| NIX-005 | Registrar link de compra y tracking | Media | 3 | 2 |

### Epic 2: Gestión de Clientes

| ID | Historia de Usuario | Prioridad | Puntos | Sprint |
|----|-------------------|-----------|--------|--------|
| NIX-006 | Registrar clientes | Alta | 5 | 1 |
| NIX-007 | Historial de pedidos por cliente | Media | 3 | 2 |

### Epic 3: Inventario

| ID | Historia de Usuario | Prioridad | Puntos | Sprint |
|----|-------------------|-----------|--------|--------|
| NIX-008 | Registrar productos en almacén | Alta | 5 | 2 |
| NIX-009 | Marcar producto como entregado | Alta | 3 | 2 |
| NIX-010 | Ver inventario actual | Media | 5 | 2 |

### Epic 4: Configuración y Costos

| ID | Historia de Usuario | Prioridad | Puntos | Sprint |
|----|-------------------|-----------|--------|--------|
| NIX-011 | Configurar comisión | Alta | 3 | 1 |
| NIX-012 | Registrar costos adicionales por pedido | Media | 5 | 2 |

### Epic 5: Dashboard

| ID | Historia de Usuario | Prioridad | Puntos | Sprint |
|----|-------------------|-----------|--------|--------|
| NIX-013 | Dashboard resumen del negocio | Media | 8 | 2 |

### Resumen de puntos

| Sprint | Historias | Puntos totales |
|--------|-----------|----------------|
| 1 | NIX-001, 002, 003, 004, 006, 011 | **31** |
| 2 | NIX-005, 007, 008, 009, 010, 012, 013 | **32** |

---

## Roadmap General

**Dedicación:** ~2 horas diarias
**Duración de sprint:** 2 semanas (≈28 horas por sprint)
**Inicio del proyecto:** 2026-10-28
**Estimación total:** ~4 meses (8 sprints)

| Sprint | Fechas | Enfoque | MVP |
|--------|--------|---------|-----|
| 1 | 28 Oct - 10 Nov | Core: clientes, pedidos, cotización, estados | MVP1 |
| 2 | 11 Nov - 24 Nov | Tracking, inventario, costos adicionales, dashboard básico | MVP1 |
| 3 | 25 Nov - 08 Dic | Reportes, búsqueda avanzada, notificaciones, pulido UI | MVP1 |
| 4 | 09 Dic - 22 Dic | Módulo perfumes: catálogo, precios mayorista/minorista | MVP2 |
| 5 | 23 Dic - 05 Ene | Ventas de perfumes, stock, gestión de proveedores | MVP2 |
| 6 | 06 Ene - 19 Ene | Dashboard avanzado, reportes financieros, métricas | MVP3 |
| 7 | 20 Ene - 02 Feb | Roles/permisos, auditoría, respaldos, seguridad | MVP3 |
| 8 | 03 Feb - 16 Feb | Testing final, bugfixes, deploy producción, documentación | Release |

---

## Sprint 1 - Scope

**Fechas:** 28 Oct - 10 Nov 2026
**Objetivo:** Poder registrar un pedido completo desde la solicitud hasta la cotización.

**Historias incluidas:** NIX-001, NIX-002, NIX-003, NIX-004, NIX-006, NIX-011

### NIX-001: Registrar pedido de importación
**Prioridad:** Alta | **Puntos:** 8 | **Sprint:** 1
**Como** admin, **quiero** registrar un nuevo pedido de importación con los datos del cliente y el producto solicitado, **para** tener control de cada solicitud.

**Descripción:**
El admin recibe una solicitud de un cliente que quiere importar un producto tecnológico (celular, laptop, etc.) desde un sitio como eBay o Amazon. Debe poder crear un pedido asociando al cliente, describiendo el producto y registrando el link de origen.

**Criterios de aceptación:**
- [ ] Puedo crear un pedido seleccionando un cliente existente o creando uno nuevo desde el formulario
- [ ] Puedo ingresar: nombre del producto, descripción, URL de origen, categoría (celular/laptop/tablet/otro)
- [ ] El pedido se crea con estado "Solicitado" y fecha de creación automática
- [ ] El pedido genera un código único visible (NIX-XXXX)
- [ ] Se muestra confirmación al guardar exitosamente
- [ ] No puedo crear un pedido sin cliente ni producto

---

### NIX-002: Calcular costo total y cotización
**Prioridad:** Alta | **Puntos:** 5 | **Sprint:** 1
**Como** admin, **quiero** calcular el costo total del pedido (precio + envío + impuestos + comisión), **para** generar una cotización al cliente.

**Descripción:**
Una vez registrado el pedido, el admin ingresa los costos reales del producto. El sistema calcula automáticamente la comisión según el porcentaje configurado y muestra el costo total que se le cobrará al cliente.

**Criterios de aceptación:**
- [ ] Puedo ingresar: precio del producto (USD), costo de envío internacional, impuestos estimados
- [ ] El sistema aplica automáticamente el % de comisión configurado (NIX-011)
- [ ] Se muestra un desglose: precio + envío + impuestos + comisión = total
- [ ] Puedo ajustar la comisión manualmente para un pedido específico si es necesario
- [ ] Al guardar la cotización, el estado cambia automáticamente a "Cotizado"
- [ ] El total se muestra en la moneda local

---

### NIX-003: Cambiar estado del pedido
**Estado Scrum:** Implementada
**Prioridad:** Alta | **Puntos:** 5 | **Sprint:** 1
**Como** admin, **quiero** cambiar el estado de un pedido, **para** rastrear el progreso de cada importación.

**Descripción:**
Los pedidos pasan por un flujo definido. El admin debe poder avanzar (o retroceder) el estado del pedido, y cada cambio debe quedar registrado con fecha.

**Criterios de aceptación:**
- [ ] Puedo cambiar el estado siguiendo el flujo: Solicitado → Cotizado → Aprobado → Comprado → En tránsito → Recibido → Entregado
- [ ] Puedo marcar un pedido como "Cancelado" desde cualquier estado (excepto Entregado)
- [ ] Cada cambio de estado registra la fecha automáticamente
- [ ] Se muestra visualmente el estado actual y el historial de cambios
- [ ] No puedo saltar estados (ej: de Solicitado a Comprado directamente)

---

### NIX-004: Listar pedidos con filtros
**Estado Scrum:** Implementada
**Prioridad:** Alta | **Puntos:** 5 | **Sprint:** 1
**Como** admin, **quiero** ver una lista de todos los pedidos con filtros por estado y fecha, **para** gestionar el trabajo pendiente.

**Descripción:**
Vista principal de pedidos en formato tabla con la información más relevante y filtros para encontrar rápidamente lo que se necesita.

**Criterios de aceptación:**
- [x] Veo una tabla con: código, cliente, producto, estado, fecha de solicitud, total
- [x] Puedo filtrar por estado (uno o varios)
- [x] Puedo filtrar por rango de fechas
- [x] Puedo buscar por nombre de cliente o producto
- [x] Puedo ordenar por fecha o estado
- [x] Al hacer clic en un pedido, voy a su detalle
- [x] Veo un contador de resultados

---

### NIX-005: Registrar link de compra y tracking
**Estado Scrum:** Implementada
**Prioridad:** Media | **Puntos:** 3 | **Sprint:** 2
**Como** admin, **quiero** registrar el link de compra y los datos de seguimiento de un pedido, **para** localizar el producto comprado y monitorear su tránsito.

**Descripción:**
Después de realizar la compra, el admin puede guardar el enlace utilizado para comprar el producto, el número de tracking y el enlace de seguimiento. Estos datos quedan visibles en el detalle del pedido.

**Criterios de aceptación:**
- [x] Puedo registrar el link de compra del pedido
- [x] Puedo registrar el número de tracking una vez enviado el producto
- [x] Puedo registrar el enlace de seguimiento
- [x] Los datos se guardan y permanecen asociados al pedido
- [x] Los datos se pueden consultar desde el detalle del pedido
- [x] Los enlaces se pueden abrir en otra pestaña
- [x] Los enlaces inválidos se rechazan antes de guardarlos

---

### NIX-006: Registrar clientes
**Estado Scrum:** Implementada
**Prioridad:** Alta | **Puntos:** 5 | **Sprint:** 1
**Como** admin, **quiero** registrar clientes con sus datos de contacto, **para** asociarlos a los pedidos.

**Descripción:**
CRUD básico de clientes. Cada cliente tiene datos de contacto y se puede asociar a uno o más pedidos de importación.

**Criterios de aceptación:**
- [x] Puedo crear un cliente con: nombre completo, teléfono, email (opcional), dirección (opcional), notas
- [x] Puedo editar los datos de un cliente existente
- [x] Puedo ver la lista de todos los clientes con búsqueda por nombre o teléfono
- [x] No puedo crear dos clientes con el mismo teléfono
- [x] Puedo ver cuántos pedidos tiene asociados cada cliente en la lista

---

### NIX-007: Historial de pedidos por cliente
**Estado Scrum:** Implementada
**Prioridad:** Media | **Puntos:** 3 | **Sprint:** 2
**Como** admin, **quiero** consultar los pedidos asociados a un cliente, **para** conocer su historial comercial y dar seguimiento rápidamente.

**Descripción:**
Desde la lista de clientes, el admin puede abrir el historial de pedidos de cada cliente. El historial muestra código, producto, estado, fecha y total de cada pedido, y permite acceder al detalle.

**Criterios de aceptación:**
- [x] Desde un cliente puedo abrir su historial de pedidos
- [x] Veo los pedidos asociados al cliente
- [x] Cada pedido muestra código, producto, estado, fecha y total
- [x] Los pedidos se muestran desde el más reciente
- [x] Puedo navegar al detalle de cada pedido
- [x] Se muestra un mensaje cuando el cliente no tiene pedidos

---

### NIX-008: Registrar productos en almacén
**Estado Scrum:** Implementada
**Prioridad:** Alta | **Puntos:** 5 | **Sprint:** 2
**Como** admin, **quiero** registrar los productos recibidos en el almacén, **para** tener control del inventario temporal antes de entregarlos al cliente.

**Descripción:**
Cuando un pedido llega a la oficina, el admin puede registrar el producto en el inventario y asociarlo opcionalmente a su pedido. La información incluye nombre, número de serie, cantidad, fecha de recepción y notas.

**Criterios de aceptación:**
- [x] Puedo registrar un producto recibido en el almacén
- [x] Puedo asociar el producto a un pedido existente
- [x] Puedo ingresar nombre, número de serie, cantidad, fecha y notas
- [x] Los productos quedan visibles mientras estén pendientes de entrega
- [x] No puedo registrar cantidades menores a uno
- [x] El producto registrado muestra su fecha de recepción

---

### NIX-009: Marcar producto como entregado
**Estado Scrum:** Implementada
**Prioridad:** Alta | **Puntos:** 3 | **Sprint:** 2
**Como** admin, **quiero** marcar un producto del almacén como entregado, **para** mantener actualizado el inventario temporal y saber cuándo se realizó la entrega.

**Descripción:**
Desde el inventario, el admin puede marcar como entregado cada producto que ya salió de la oficina. El sistema registra automáticamente la fecha de entrega y cambia su estado para que deje de contabilizarse como producto pendiente en almacén.

**Criterios de aceptación:**
- [x] Veo una acción para marcar cada producto pendiente como entregado
- [x] El estado cambia de `En almacén` a `Entregado`
- [x] Se registra automáticamente la fecha de entrega
- [x] La fecha de entrega se muestra en el listado
- [x] Los productos entregados dejan de contabilizarse como pendientes en almacén
- [x] El cambio se conserva en Supabase

---

### NIX-010: Ver inventario actual
**Estado Scrum:** Implementada
**Prioridad:** Media | **Puntos:** 5 | **Sprint:** 2
**Como** admin, **quiero** consultar el inventario actual, **para** conocer qué productos están en almacén y cuáles ya fueron entregados.

**Descripción:**
La pantalla de inventario muestra todos los productos registrados, con un resumen de unidades y registros pendientes, además de filtros por nombre, número de serie y estado. Permite identificar rápidamente el inventario disponible y consultar su historial de entregas.

**Criterios de aceptación:**
- [x] Puedo ver la lista de productos registrados en el almacén
- [x] El listado muestra nombre, número de serie, cantidad, fechas y estado
- [x] Puedo buscar productos por nombre o número de serie
- [x] Puedo filtrar el inventario por `En almacén` o `Entregado`
- [x] Puedo ver cuántas unidades están pendientes de entrega
- [x] Puedo ver cuántos productos ya fueron entregados
- [x] El listado refleja los cambios realizados en el inventario

---

### NIX-011: Configurar comisión
**Estado Scrum:** Implementada
**Prioridad:** Alta | **Puntos:** 3 | **Sprint:** 1
**Como** admin, **quiero** configurar el porcentaje de comisión por importación, **para** que se aplique automáticamente a las cotizaciones.

**Descripción:**
La pantalla de configuración permite consultar y modificar el porcentaje de comisión por defecto. El valor se persiste en Supabase y las nuevas cotizaciones lo utilizan automáticamente, mientras que los pedidos ya cotizados conservan su comisión guardada.

**Criterios de aceptación:**
- [x] Puedo establecer un porcentaje de comisión por defecto (ej: 15%)
- [x] El valor se persiste y se mantiene entre sesiones
- [x] Al crear una cotización (NIX-002), se usa este porcentaje automáticamente
- [x] Puedo ver el valor actual de comisión configurado
- [x] El cambio de comisión no afecta pedidos ya cotizados

---

**Entidades principales:**
- **Cliente:** nombre, teléfono, email, dirección
- **Pedido:** cliente, producto_solicitado, url_producto, precio_producto, costo_envio, impuestos, comision_porcentaje, comision_monto, costo_total, estado, fecha_solicitud, notas
- **Configuración:** comision_default (%)

**Estados del pedido:**
`Solicitado → Cotizado → Aprobado → Comprado → En tránsito → Recibido → Entregado → Cancelado`

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React + Vite (SPA) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS |
| **Backend/DB** | Supabase (PostgreSQL + Auth + API REST) |
| **ORM/Cliente** | Supabase JS Client |
| **Contenedores** | Docker + Docker Compose (dev local) |
| **Hosting** | Vercel (frontend) + Supabase Cloud (backend) |
| **CI/CD** | GitHub Actions |
| **Repositorio** | GitHub |
| **Package Manager** | npm |
| **Linter/Formatter** | ESLint + Prettier |
| **Testing** | Vitest |

---

## Estructura del Proyecto

```
nix-imports/
├── .github/
│   └── workflows/          # GitHub Actions (CI/CD)
│       └── ci.yml
├── docker/
│   └── docker-compose.yml  # Supabase local para desarrollo
├── src/
│   ├── assets/             # Imágenes, íconos
│   ├── components/         # Componentes reutilizables UI
│   │   └── ui/             # Botones, inputs, modales, tablas
│   ├── layouts/            # Layout principal del admin
│   ├── pages/              # Páginas/vistas
│   │   ├── Dashboard.tsx
│   │   ├── Pedidos.tsx
│   │   ├── PedidoDetalle.tsx
│   │   ├── Clientes.tsx
│   │   ├── Inventario.tsx
│   │   └── Configuracion.tsx
│   ├── hooks/              # Custom hooks
│   ├── lib/
│   │   └── supabase.ts     # Cliente de Supabase
│   ├── types/              # Tipos TypeScript (Cliente, Pedido, etc.)
│   ├── utils/              # Funciones auxiliares (cálculos, formateo)
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── migrations/         # Migraciones SQL de la base de datos
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── PROJECT.md
```

---

## Estándares de Desarrollo

### Checklist antes de dar una HU por terminada
Antes de declarar cualquier historia como completa, verificar:
- [ ] Todos los criterios de aceptación están implementados
- [ ] Los tipos TypeScript compilan sin errores (`npx tsc --noEmit`)
- [ ] Los errores de Supabase se capturan y muestran al usuario
- [ ] Los estados de carga (loading) tienen indicador visual
- [ ] No hay optimistic updates con IDs falsos — usar refetch
- [ ] El flujo happy path funciona end-to-end contra Supabase real
- [ ] El flujo de error (campo faltante, duplicado, red caída) está cubierto

### Reglas de código
- No agregar autoría de herramientas en los commits
- No dejar `console.log` en el código
- Validación en el frontend con Zod, no confiar solo en el backend
- Cada hook maneja su propio estado de `loading` y `error`

---

## Convención de Commits

Seguimos **Conventional Commits**. Formato: `tipo(scope): descripción`

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Cambio de código sin cambiar comportamiento |
| `style` | Cambios de estilos/UI sin lógica |
| `chore` | Tareas de configuración, dependencias |
| `docs` | Cambios en documentación |

**El scope es el ID de la historia:** `feat(NIX-001)`, `fix(NIX-002)`, etc.

**Ejemplos:**
```
feat(NIX-001): agregar formulario de registro de pedido
fix(NIX-001): mostrar error si falla creacion de pedido
feat(NIX-002): calcular cotizacion con comision automatica
```

**Reglas:**
- Descripción en minúsculas y sin punto final
- Sin tildes ni caracteres especiales en el mensaje
- Un commit por cambio lógico, no un commit por archivo
- No se agrega autoría de herramientas en los commits

---

## Notas
- El sistema es solo para el administrador (no hay portal de cliente)
- MVP1 = solo productos tecnológicos (celulares, laptops, etc.)
- Los perfumes y otras líneas se agregarán en MVPs futuros