/**
 * Formatea un valor numérico como moneda colombiana.
 */
export function formatearMoneda(valor: number | string): string {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) return '$ 0,00'

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero)
}

/**
 * Formatea un valor numérico como porcentaje.
 */
export function formatearPorcentaje(valor: number | string): string {
  const numero = Number(valor)

  if (!Number.isFinite(numero)) return '0,00 %'

  return `${new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero)} %`
}

/**
 * Convierte una fecha al formato día/mes/año.
 */
export function formatearFecha(fecha: string): string {
  if (!fecha) return ''

  const [anio, mes, dia] = fecha.slice(0, 10).split('-').map(Number)

  const fechaLocal = new Date(anio, mes - 1, dia)

  if (Number.isNaN(fechaLocal.getTime())) return fecha

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fechaLocal)
}
