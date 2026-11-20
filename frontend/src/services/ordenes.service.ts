import api from './api'

import type {
  OrdenServicio,
  CrearOrdenDto,
  ActualizarOrdenDto,
} from '@/interfaces/orden-servicio.interface'

import type {
  ConsultarOrdenesParams,
  RespuestaOrdenes,
} from '@/interfaces/ordenes-api.interface'

// Servicio encargado de comunicarse con los endpoints de órdenes.
export const ordenesService = {
  // Consulta las órdenes con filtros y paginación.
  async obtenerTodas(
    params: ConsultarOrdenesParams,
  ): Promise<RespuestaOrdenes> {
    const response = await api.get<RespuestaOrdenes>('/ordenes', {
      params,
    })

    return response.data
  },

  // Consulta el detalle de una orden por su identificador.
  async obtenerPorId(id: number): Promise<OrdenServicio> {
    const response = await api.get<OrdenServicio>(`/ordenes/${id}`)

    return response.data
  },

  // Registra una nueva orden de servicio.
  async crear(datos: CrearOrdenDto): Promise<OrdenServicio> {
    const response = await api.post<OrdenServicio>('/ordenes', datos)

    return response.data
  },

  // Actualiza parcialmente una orden existente.
  async actualizar(
    id: number,
    datos: ActualizarOrdenDto,
  ): Promise<OrdenServicio> {
    const response = await api.put<OrdenServicio>(`/ordenes/${id}`, datos)

    return response.data
  },

  // Elimina lógicamente una orden de servicio.
  async eliminar(id: number): Promise<void> {
    await api.delete(`/ordenes/${id}`)
  },
}
