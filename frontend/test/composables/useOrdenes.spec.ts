import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useOrdenes } from '@/composables/useOrdenes'
import type { OrdenServicio } from '@/interfaces/orden-servicio.interface'

// Simula el servicio para evitar peticiones reales al backend.
const { obtenerTodasMock } = vi.hoisted(() => ({
  obtenerTodasMock: vi.fn(),
}))

vi.mock('@/services/ordenes.service', () => ({
  ordenesService: {
    obtenerTodas: obtenerTodasMock,
  },
}))

const ordenEjemplo: OrdenServicio = {
  id: 1,
  codigo_orden: 'OS-001',
  cliente_nombre: 'Cliente de prueba',
  cantidad_items: 3,
  valor_total: 2500000,
  porcentaje_descuento: 10,
  fecha_solicitud: '2026-11-15',
  estado: 'Pendiente',
  prioridad: 'Alta',
  observaciones: null,
  activo: 1,
  fecha_creacion: '2026-11-15T10:00:00',
  fecha_actualizacion: '2026-11-15T10:00:00',
}

const respuestaEjemplo = {
  data: [ordenEjemplo],
  pagination: {
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 2,
  },
}

describe('useOrdenes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('inicia con los valores predeterminados', () => {
    const composable = useOrdenes()

    expect(composable.ordenes.value).toEqual([])
    expect(composable.cargando.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(composable.filtros.value).toEqual({
      page: 1,
      limit: 10,
      cliente_nombre: '',
      estado: undefined,
    })
    expect(composable.paginacion.value.totalPages).toBe(0)
  })

  it('carga las órdenes y actualiza la paginación', async () => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    await composable.cargarOrdenes()

    expect(obtenerTodasMock).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      cliente_nombre: undefined,
      estado: undefined,
    })
    expect(composable.ordenes.value).toEqual([ordenEjemplo])
    expect(composable.paginacion.value).toEqual(respuestaEjemplo.pagination)
    expect(composable.cargando.value).toBe(false)
    expect(composable.error.value).toBeNull()
  })

  it('envía los filtros actuales al consultar órdenes', async () => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    composable.filtros.value.cliente_nombre = 'Cliente de prueba'
    composable.filtros.value.estado = 'Pendiente'

    await composable.cargarOrdenes()

    expect(obtenerTodasMock).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      cliente_nombre: 'Cliente de prueba',
      estado: 'Pendiente',
    })
  })

  it('maneja errores al cargar órdenes', async () => {
    obtenerTodasMock.mockRejectedValue(new Error('Error de conexión'))

    const composable = useOrdenes()

    await composable.cargarOrdenes()

    expect(composable.error.value).toBe(
      'No fue posible cargar las órdenes de servicio.',
    )
    expect(composable.ordenes.value).toEqual([])
    expect(composable.cargando.value).toBe(false)
  })

 it('cambia a una página válida', async () => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    // Carga primero la paginación para conocer las páginas disponibles.
    await composable.cargarOrdenes()

    obtenerTodasMock.mockClear()

    await composable.cambiarPagina(2)

    expect(composable.filtros.value.page).toBe(2)
    expect(obtenerTodasMock).toHaveBeenCalledTimes(1)
 })

  it.each([0, 3, -1])('ignora una página inválida: %i', async (page) => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    await composable.cargarOrdenes()
    obtenerTodasMock.mockClear()

    await composable.cambiarPagina(page)

    expect(composable.filtros.value.page).toBe(1)
    expect(obtenerTodasMock).not.toHaveBeenCalled()
  })

  it('cambia el límite de registros y reinicia la página', async () => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    composable.filtros.value.page = 2

    await composable.cambiarLimite(20)

    expect(composable.filtros.value.limit).toBe(20)
    expect(composable.filtros.value.page).toBe(1)
    expect(obtenerTodasMock).toHaveBeenCalledTimes(1)
  })

  it.each([0, 101, 1.5, -5])(
    'rechaza un límite inválido: %s',
    async (limit) => {
      const composable = useOrdenes()

      const limiteInicial = composable.filtros.value.limit
      const paginaInicial = composable.filtros.value.page

      const resultado = await composable.cambiarLimite(limit)

      // Verifica que la validación rechace el valor.
      expect(resultado).toBe(false)

      // Comprueba que los filtros permanezcan sin cambios.
      expect(composable.filtros.value.limit).toBe(limiteInicial)
      expect(composable.filtros.value.page).toBe(paginaInicial)
    },
  )

  it('acepta los límites mínimo y máximo permitidos', async () => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    await composable.cambiarLimite(1)
    await composable.cambiarLimite(100)

    expect(composable.filtros.value.limit).toBe(100)
    expect(obtenerTodasMock).toHaveBeenCalledTimes(2)
  })

  it('aplica filtros desde la primera página', async () => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    composable.filtros.value.page = 2
    composable.filtros.value.cliente_nombre = 'Cliente de prueba'

    await composable.aplicarFiltros()

    expect(composable.filtros.value.page).toBe(1)
    expect(obtenerTodasMock).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      cliente_nombre: 'Cliente de prueba',
      estado: undefined,
    })
  })

  it('limpia los filtros y vuelve a los valores iniciales', async () => {
    obtenerTodasMock.mockResolvedValue(respuestaEjemplo)

    const composable = useOrdenes()

    composable.filtros.value.page = 2
    composable.filtros.value.limit = 20
    composable.filtros.value.cliente_nombre = 'Cliente de prueba'
    composable.filtros.value.estado = 'Pendiente'

    await composable.limpiarFiltros()

    expect(composable.filtros.value).toEqual({
      page: 1,
      limit: 10,
      cliente_nombre: '',
      estado: undefined,
    })
    expect(obtenerTodasMock).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      cliente_nombre: undefined,
      estado: undefined,
    })
  })
})
