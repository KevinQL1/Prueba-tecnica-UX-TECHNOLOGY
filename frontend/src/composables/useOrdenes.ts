import { ref } from 'vue'
import { ordenesService } from '@/services/ordenes.service'
import type {
  OrdenServicio,
  EstadoOrden,
} from '@/interfaces/orden-servicio.interface'
import type {
  PaginacionOrdenes,
} from '@/interfaces/ordenes-api.interface'

// Gestiona la consulta, los filtros y la paginación de órdenes.
export function useOrdenes() {
  // Almacena las órdenes obtenidas desde el backend.
  const ordenes = ref<OrdenServicio[]>([])

  // Controla el estado de carga de las peticiones.
  const cargando = ref(false)

  // Almacena los mensajes de error.
  const error = ref<string | null>(null)

  // Parámetros de búsqueda y paginación.
  const filtros = ref({
    page: 1,
    limit: 10,
    cliente_nombre: '',
    estado: undefined as EstadoOrden | undefined,
  })

  // Información de paginación devuelta por la API.
  const paginacion = ref<PaginacionOrdenes>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  // Consulta las órdenes utilizando los filtros actuales.
  async function cargarOrdenes(): Promise<void> {
    cargando.value = true
    error.value = null

    try {
      const respuesta = await ordenesService.obtenerTodas({
        page: filtros.value.page,
        limit: filtros.value.limit,
        cliente_nombre: filtros.value.cliente_nombre || undefined,
        estado: filtros.value.estado,
      })

      ordenes.value = respuesta.data
      paginacion.value = respuesta.pagination
    } catch {
      // Informa al usuario cuando no se pueden consultar las órdenes.
      error.value = 'No fue posible cargar las órdenes de servicio.'
      ordenes.value = []
    } finally {
      cargando.value = false
    }
  }

  // Cambia la página actual y consulta nuevamente los registros.
  async function cambiarPagina(page: number): Promise<void> {
    if (page < 1 || page > paginacion.value.totalPages) return

    filtros.value.page = page
    await cargarOrdenes()
  }

  // Cambia la cantidad de registros por página validando el rango permitido.
  async function cambiarLimite(limit: number): Promise<boolean> {
    // Valida que el valor sea un entero entre 1 y 100.
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return false
    }

    filtros.value.limit = limit
    filtros.value.page = 1
    
    await cargarOrdenes()
    
    return true
  }


  // Aplica los filtros desde la primera página.
  async function aplicarFiltros(): Promise<void> {
    filtros.value.page = 1
    await cargarOrdenes()
  }

  // Restablece los filtros y consulta todas las órdenes.
  async function limpiarFiltros(): Promise<void> {
    filtros.value = {
      page: 1,
      limit: 10,
      cliente_nombre: '',
      estado: undefined,
    }

    await cargarOrdenes()
  }

  return {
    ordenes,
    cargando,
    error,
    filtros,
    paginacion,
    cargarOrdenes,
    cambiarPagina,
    cambiarLimite,
    aplicarFiltros,
    limpiarFiltros,
  }
}
