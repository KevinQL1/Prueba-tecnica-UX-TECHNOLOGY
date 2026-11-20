import { describe, expect, it, vi } from 'vitest'

// Simula la creación de la instancia de Axios.
const createMock = vi.hoisted(() => vi.fn(() => ({ mocked: true })))

vi.mock('axios', () => ({
  default: {
    create: createMock,
  },
}))

import api from '../../src/services/api'

describe('Configuración de Axios', () => {
  it('crea una instancia con la URL del entorno', () => {
    expect(createMock).toHaveBeenCalledWith({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
  })

  it('exporta la instancia creada por Axios', () => {
    expect(api).toEqual({ mocked: true })
  })
})
