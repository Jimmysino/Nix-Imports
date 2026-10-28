export function calcularCotizacion(
  precio: number,
  envio: number,
  impuestos: number,
  comisionPct: number
) {
  const subtotal = precio + envio + impuestos
  const comisionMonto = parseFloat((subtotal * (comisionPct / 100)).toFixed(2))
  const total = parseFloat((subtotal + comisionMonto).toFixed(2))
  return { comisionMonto, total }
}

export function formatUSD(valor: number | null) {
  if (valor === null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(valor)
}

export function formatLocal(valorUSD: number, tipoCambio: number) {
  const local = valorUSD * tipoCambio
  return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(local)
}
