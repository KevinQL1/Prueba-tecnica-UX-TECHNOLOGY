import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ordenesService } from '../../src/services/ordenes.service'
import type { OrdenServicio } from '../../src/interfaces/orden-servicio.interface'

// Simula los métodos HTTP de Axios.
const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('../../src/services/api', () => ({
  default: apiMock,
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

describe('ordenesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('consulta todas las órdenes con filtros y paginación', async () => {
    const respuesta = {
      data: [ordenEjemplo],
      pagination: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    }

    apiMock.get.mockResolvedValue({ data: respuesta })

    const params = {
      page: 1,
      limit: 10,
      cliente_nombre: 'Cliente de prueba',
    }

    const resultado = await ordenesService.obtenerTodas(params)

    expect(apiMock.get).toHaveBeenCalledWith('/ordenes', { params })
    expect(resultado).toEqual(respuesta)
  })

  it('consulta una orden por su identificador', async () => {
    apiMock.get.mockResolvedValue({ data: ordenEjemplo })

    const resultado = await ordenesService.obtenerPorId(1)

    expect(apiMock.get).toHaveBeenCalledWith('/ordenes/1')
    expect(resultado).toEqual(ordenEjemplo)
  })

  it('crea una orden y devuelve su información', async () => {
    apiMock.post.mockResolvedValue({ data: ordenEjemplo })

    const datos = {
      codigo_orden: 'OS-001',
      cliente_nombre: 'Cliente de prueba',
      cantidad_items: 3,
      valor_total: 2500000,
      porcentaje_descuento: 10,
      fecha_solicitud: '2026-11-15',
      estado: 'Pendiente' as const,
      prioridad: 'Alta' as const,
    }

    const resultado = await ordenesService.crear(datos)

    expect(apiMock.post).toHaveBeenCalledWith('/ordenes', datos)
    expect(resultado).toEqual(ordenEjemplo)
  })

  it('actualiza una orden existente', async () => {
    const datos = { estado: 'Completada' as const }

    apiMock.put.mockResolvedValue({
      data: { ...ordenEjemplo, ...datos },
    })

    const resultado = await ordenesService.actualizar(1, datos)

    expect(apiMock.put).toHaveBeenCalledWith('/ordenes/1', datos)
    expect(resultado.estado).toBe('Completada')
  })

  it('elimina una orden por su identificador', async () => {
    apiMock.delete.mockResolvedValue({})

    await expect(ordenesService.eliminar(1)).resolves.toBeUndefined()

    expect(apiMock.delete).toHaveBeenCalledWith('/ordenes/1')
  })

  it('propaga los errores cuando falla una petición', async () => {
    const error = new Error('Error de conexión')

    apiMock.get.mockRejectedValue(error)

    await expect(ordenesService.obtenerPorId(1)).rejects.toThrow(
      'Error de conexión',
    )
  })
})
