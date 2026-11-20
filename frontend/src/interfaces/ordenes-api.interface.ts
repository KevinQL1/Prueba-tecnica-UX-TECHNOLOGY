
import type { EstadoOrden, OrdenServicio } from './orden-servicio.interface'

/**
 * Parámetros disponibles para consultar órdenes de servicio.
 */
export interface ConsultarOrdenesParams {
  page?: number
  limit?: number
  cliente_nombre?: string
  estado?: EstadoOrden
}

/**
 * Información de paginación devuelta por el backend.
 */
export interface PaginacionOrdenes {
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Respuesta del endpoint de consulta de órdenes.
 */
export interface RespuestaOrdenes {
  data: OrdenServicio[]
  pagination: PaginacionOrdenes
}
