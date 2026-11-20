
/**
 * Estados permitidos para una orden de servicio.
 */
export type EstadoOrden =
  | 'Pendiente'
  | 'En Proceso'
  | 'Completada'
  | 'Cancelada'

/**
 * Niveles de prioridad disponibles para una orden.
 */
export type PrioridadOrden =
  | 'Baja'
  | 'Media'
  | 'Alta'
  | 'Crítica'

/**
 * Representa una orden de servicio almacenada en la base de datos.
 */
export interface OrdenServicio {
  id: number
  codigo_orden: string
  cliente_nombre: string
  cantidad_items: number
  valor_total: number | string
  porcentaje_descuento: number | string
  fecha_solicitud: string
  estado: EstadoOrden
  prioridad: PrioridadOrden
  observaciones: string | null
  activo: number
  fecha_creacion: string
  fecha_actualizacion: string
}

/**
 * Datos necesarios para registrar una nueva orden.
 */
export interface CrearOrdenDto {
  codigo_orden: string
  cliente_nombre: string
  cantidad_items: number
  valor_total: number
  porcentaje_descuento: number
  fecha_solicitud: string
  estado: EstadoOrden
  prioridad: PrioridadOrden
  observaciones?: string
}

/**
 * Datos permitidos para actualizar una orden existente.
 */
export type ActualizarOrdenDto = Partial<CrearOrdenDto>
