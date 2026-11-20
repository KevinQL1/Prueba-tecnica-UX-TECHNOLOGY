import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import OrdenesView from '@/views/ordenes/OrdenesView.vue'
import { useOrdenes } from '@/composables/useOrdenes'
import { ordenesService } from '@/services/ordenes.service'
import type { OrdenServicio } from '@/interfaces/orden-servicio.interface'

vi.mock('@/composables/useOrdenes', () => ({
  useOrdenes: vi.fn(),
}))

vi.mock('@/services/ordenes.service', () => ({
  ordenesService: {
    crear: vi.fn(),
    actualizar: vi.fn(),
    eliminar: vi.fn(),
  },
}))

const datosFormulario = {
  codigo_orden: 'ORD-003',
  cliente_nombre: 'Cliente nuevo',
  cantidad_items: 3,
  valor_total: 1500000,
  porcentaje_descuento: 10,
  fecha_solicitud: '2026-11-20',
  estado: 'Pendiente' as const,
  prioridad: 'Alta' as const,
  observaciones: 'Observación de prueba',
}

// Simula el formulario y sus eventos sin montar el formulario real.
const OrdenFormStub = defineComponent({
  props: {
    cargando: Boolean,
    orden: {
      type: Object,
      default: null,
    },
  },
  emits: ['submit', 'cancel'],
  setup(_, { emit }) {
    const enviar = () => emit('submit', datosFormulario)
    const cancelar = () => emit('cancel')

    return { enviar, cancelar }
  },
  template: `
    <div data-testid="orden-form">
      <span data-testid="modo-formulario">
        {{ orden ? 'edicion' : 'creacion' }}
      </span>

      <button
        data-testid="enviar-formulario"
        :disabled="cargando"
        @click="enviar"
      >
        Enviar
      </button>

      <button
        data-testid="cancelar-formulario"
        :disabled="cargando"
        @click="cancelar"
      >
        Cancelar
      </button>
    </div>
  `,
})

const ordenesIniciales: OrdenServicio[] = [
  {
    id: 1,
    codigo_orden: 'ORD-001',
    cliente_nombre: 'Cliente pendiente',
    cantidad_items: 2,
    valor_total: 2500000,
    porcentaje_descuento: 10,
    fecha_solicitud: '2026-11-15',
    estado: 'Pendiente',
    prioridad: 'Alta',
    observaciones: null,
    activo: true,
    fecha_creacion: '2026-11-15T10:00:00',
    fecha_actualizacion: '2026-11-15T10:00:00',
  },
  {
    id: 2,
    codigo_orden: 'ORD-002',
    cliente_nombre: 'Cliente en proceso',
    cantidad_items: 1,
    valor_total: 1000000,
    porcentaje_descuento: 5,
    fecha_solicitud: '2026-11-16',
    estado: 'En Proceso',
    prioridad: 'Media',
    observaciones: null,
    activo: true,
    fecha_creacion: '2026-11-16T10:00:00',
    fecha_actualizacion: '2026-11-16T10:00:00',
  },
  {
    id: 3,
    codigo_orden: 'ORD-003',
    cliente_nombre: 'Cliente completado',
    cantidad_items: 4,
    valor_total: 3000000,
    porcentaje_descuento: 0,
    fecha_solicitud: '2026-11-17',
    estado: 'Completada',
    prioridad: 'Baja',
    observaciones: null,
    activo: true,
    fecha_creacion: '2026-11-17T10:00:00',
    fecha_actualizacion: '2026-11-17T10:00:00',
  },
]

const mockUseOrdenes = vi.mocked(useOrdenes)

function configurarComposable(
  opciones: {
    ordenes?: OrdenServicio[]
    cargando?: boolean
    error?: string | null
    total?: number
    page?: number
    totalPages?: number
    limit?: number
  } = {},
) {
  const ordenes = ref(opciones.ordenes ?? ordenesIniciales)
  const cargando = ref(opciones.cargando ?? false)
  const error = ref(opciones.error ?? null)

  const filtros = ref({
    page: opciones.page ?? 1,
    limit: opciones.limit ?? 10,
    cliente_nombre: '',
    estado: undefined as string | undefined,
  })

  const paginacion = ref({
    total: opciones.total ?? ordenes.value.length,
    page: opciones.page ?? 1,
    limit: opciones.limit ?? 10,
    totalPages: opciones.totalPages ?? 1,
  })

  const cargarOrdenes = vi.fn().mockResolvedValue(undefined)
  const cambiarPagina = vi.fn().mockResolvedValue(undefined)
  const cambiarLimite = vi.fn().mockResolvedValue(undefined)
  const aplicarFiltros = vi.fn().mockResolvedValue(undefined)
  const limpiarFiltros = vi.fn().mockResolvedValue(undefined)

  mockUseOrdenes.mockReturnValue({
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
  } as ReturnType<typeof useOrdenes>)

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

function montarVista() {
  return mount(OrdenesView, {
    global: {
      stubs: {
        OrdenForm: OrdenFormStub,
        Teleport: true,
      },
    },
  })
}

function obtenerBoton(wrapper: ReturnType<typeof montarVista>, texto: string) {
  const boton = wrapper.findAll('button').find((elemento) =>
    elemento.text().includes(texto),
  )

  if (!boton) {
    throw new Error(`No se encontró el botón: ${texto}`)
  }

  return boton
}

async function abrirFormulario(wrapper: ReturnType<typeof montarVista>) {
  await obtenerBoton(wrapper, 'Nueva orden').trigger('click')
  await flushPromises()
}

describe('OrdenesView.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    configurarComposable()

    vi.mocked(ordenesService.crear).mockResolvedValue({} as never)
    vi.mocked(ordenesService.actualizar).mockResolvedValue({} as never)
    vi.mocked(ordenesService.eliminar).mockResolvedValue({} as never)

    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  describe('Carga y visualización', () => {
    it('consulta las órdenes al montar la vista', () => {
      const mocks = configurarComposable()

      montarVista()

      expect(mocks.cargarOrdenes).toHaveBeenCalledOnce()
    })

    it('muestra el encabezado del módulo', () => {
      const wrapper = montarVista()

      expect(wrapper.text()).toContain('Nueva orden')
      expect(wrapper.text()).toContain('Órdenes de servicio')
      expect(wrapper.text()).toContain('Consulta y administra')
    })

    it('muestra los registros recibidos', () => {
      const wrapper = montarVista()

      expect(wrapper.text()).toContain('ORD-001')
      expect(wrapper.text()).toContain('Cliente pendiente')
      expect(wrapper.text()).toContain('ORD-002')
      expect(wrapper.text()).toContain('Cliente en proceso')
    })

    it('muestra los indicadores por estado', () => {
      const wrapper = montarVista()
      const indicadores = wrapper.findAll('article')

      expect(indicadores).toHaveLength(4)
      expect(indicadores[0].text()).toContain('3')
      expect(indicadores[1].text()).toContain('1')
      expect(indicadores[2].text()).toContain('1')
      expect(indicadores[3].text()).toContain('1')
    })

    it('muestra el estado de carga', () => {
      configurarComposable({ cargando: true })

      const wrapper = montarVista()

      expect(wrapper.text()).toContain('Cargando órdenes')
      expect(wrapper.find('table').exists()).toBe(false)
    })

    it('muestra el error y permite reintentar', async () => {
      const mocks = configurarComposable({
        error: 'Error al consultar las órdenes',
      })

      const wrapper = montarVista()

      expect(wrapper.text()).toContain('Error al consultar las órdenes')

      await obtenerBoton(wrapper, 'Reintentar').trigger('click')

      expect(mocks.cargarOrdenes).toHaveBeenCalled()
    })

    it('muestra un mensaje cuando no existen registros', () => {
      configurarComposable({
        ordenes: [],
        total: 0,
      })

      const wrapper = montarVista()

      expect(wrapper.text()).toContain('No hay órdenes de servicio')
      expect(wrapper.find('table').exists()).toBe(false)
    })

    it('muestra la información de paginación', () => {
      configurarComposable({
        page: 1,
        totalPages: 3,
        total: 25,
      })

      const wrapper = montarVista()

      expect(wrapper.text()).toContain('Página 1 de 3')
      expect(wrapper.text()).toContain('25 registros en total')
    })

    it('muestra los valores formateados de las órdenes', () => {
      const wrapper = montarVista()

      expect(wrapper.text()).toContain('$')
      expect(wrapper.text()).toContain('%')
      expect(wrapper.text()).toContain('15/11/2026')
    })
  })

  describe('Filtros y búsqueda', () => {
    it('actualiza el nombre del cliente en los filtros', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await wrapper.find('#buscar-cliente').setValue('Cliente pendiente')

      expect(mocks.filtros.value.cliente_nombre).toBe('Cliente pendiente')
    })

    it('actualiza el estado seleccionado', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await wrapper.find('#filtrar-estado').setValue('Pendiente')

      expect(mocks.filtros.value.estado).toBe('Pendiente')
    })

    it('aplica los filtros al pulsar buscar', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await wrapper.find('#buscar-cliente').setValue('Cliente pendiente')
      await wrapper.find('#filtrar-estado').setValue('Pendiente')
      await obtenerBoton(wrapper, 'Buscar órdenes').trigger('click')

      expect(mocks.aplicarFiltros).toHaveBeenCalledOnce()
    })

    it('aplica los filtros al presionar Enter', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await wrapper.find('#buscar-cliente').trigger('keyup.enter')

      expect(mocks.aplicarFiltros).toHaveBeenCalledOnce()
    })

    it('limpia los filtros', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Limpiar filtros').trigger('click')

      expect(mocks.limpiarFiltros).toHaveBeenCalledOnce()
    })

    it('deshabilita la búsqueda mientras está cargando', () => {
      configurarComposable({ cargando: true })

      const wrapper = montarVista()

      expect(obtenerBoton(wrapper, 'Buscar órdenes').attributes('disabled'))
        .toBeDefined()
    })
  })

  describe('Paginación', () => {
    it('cambia a la página anterior', async () => {
      const mocks = configurarComposable({
        page: 2,
        totalPages: 3,
      })

      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Anterior').trigger('click')

      expect(mocks.cambiarPagina).toHaveBeenCalledWith(1)
    })

    it('cambia a la página siguiente', async () => {
      const mocks = configurarComposable({
        page: 1,
        totalPages: 3,
      })

      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Siguiente').trigger('click')

      expect(mocks.cambiarPagina).toHaveBeenCalledWith(2)
    })

    it('deshabilita el botón anterior en la primera página', () => {
      const wrapper = montarVista()

      expect(obtenerBoton(wrapper, 'Anterior').attributes('disabled'))
        .toBeDefined()
    })

    it('deshabilita el botón siguiente en la última página', () => {
      configurarComposable({
        page: 3,
        totalPages: 3,
      })

      const wrapper = montarVista()

      expect(obtenerBoton(wrapper, 'Siguiente').attributes('disabled'))
        .toBeDefined()
    })

    it('actualiza el límite de registros por página', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      const input = wrapper.find('#limite-registros')

      await input.setValue('20')
      await input.trigger('change')

      expect(mocks.cambiarLimite).toHaveBeenCalledWith(20)
    })

    it('restaura el límite anterior cuando se introduce un valor inválido', async () => {
      configurarComposable({ limit: 10 })

      const wrapper = montarVista()
      const input = wrapper.find('#limite-registros')

      await input.setValue('150')
      await input.trigger('change')

      expect((input.element as HTMLInputElement).value).toBe('10')
    })

    it('oculta la paginación cuando no hay registros', () => {
      configurarComposable({
        ordenes: [],
        total: 0,
      })

      const wrapper = montarVista()

      expect(wrapper.text()).not.toContain('registros en total')
    })

    it('oculta la paginación cuando hay un error', () => {
      configurarComposable({
        error: 'Error de consulta',
      })

      const wrapper = montarVista()

      expect(wrapper.text()).not.toContain('registros en total')
    })
  })

  describe('Creación de órdenes', () => {
    it('abre el formulario de creación', async () => {
      const wrapper = montarVista()

      await abrirFormulario(wrapper)

      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="modo-formulario"]').text())
        .toBe('creacion')
    })

    it('crea una orden correctamente', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('[data-testid="enviar-formulario"]').trigger('click')
      await flushPromises()

      expect(ordenesService.crear).toHaveBeenCalledWith(datosFormulario)
      expect(mocks.limpiarFiltros).toHaveBeenCalledOnce()
      expect(wrapper.text()).toContain('La orden se creó correctamente.')
      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(false)
    })

    it('muestra el error general cuando falla la creación', async () => {
      vi.mocked(ordenesService.crear).mockRejectedValueOnce(
        new Error('Error de creación'),
      )

      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('[data-testid="enviar-formulario"]').trigger('click')
      await flushPromises()

      expect(window.alert).toHaveBeenCalledWith(
        'No fue posible crear la orden.',
      )
    })

    it('muestra los mensajes de validación del backend al crear', async () => {
      const error = Object.assign(new Error('Error'), {
        response: {
          data: {
            message: ['Código inválido', 'Cliente inválido'],
          },
        },
      })

      vi.mocked(ordenesService.crear).mockRejectedValueOnce(error)

      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('[data-testid="enviar-formulario"]').trigger('click')
      await flushPromises()

      expect(window.alert).toHaveBeenCalledWith(
        'Código inválido, Cliente inválido',
      )
    })

    it('muestra un mensaje individual del backend al crear', async () => {
      const error = Object.assign(new Error('Error'), {
        response: {
          data: {
            message: 'Código duplicado',
          },
        },
      })

      vi.mocked(ordenesService.crear).mockRejectedValueOnce(error)

      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('[data-testid="enviar-formulario"]').trigger('click')
      await flushPromises()

      expect(window.alert).toHaveBeenCalledWith('Código duplicado')
    })
  })

  describe('Edición de órdenes', () => {
    it('abre el formulario con la orden seleccionada', async () => {
      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Editar').trigger('click')

      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="modo-formulario"]').text())
        .toBe('edicion')
    })

    it('muestra el encabezado correspondiente al modo edición', async () => {
      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Editar').trigger('click')

      expect(wrapper.text()).toContain(
        'Actualiza la información de la orden seleccionada.',
      )
    })

    it('actualiza una orden correctamente', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Editar').trigger('click')
      await wrapper.find('[data-testid="enviar-formulario"]').trigger('click')
      await flushPromises()

      expect(ordenesService.actualizar).toHaveBeenCalledWith(
        1,
        datosFormulario,
      )
      expect(mocks.cargarOrdenes).toHaveBeenCalled()
      expect(wrapper.text()).toContain('La orden se actualizó correctamente.')
      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(false)
    })

    it('muestra el error general cuando falla la actualización', async () => {
      vi.mocked(ordenesService.actualizar).mockRejectedValueOnce(
        new Error('Error de actualización'),
      )

      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Editar').trigger('click')
      await wrapper.find('[data-testid="enviar-formulario"]').trigger('click')
      await flushPromises()

      expect(window.alert).toHaveBeenCalledWith(
        'No fue posible actualizar la orden.',
      )
    })

    it('muestra los errores del backend al actualizar', async () => {
      const error = Object.assign(new Error('Error'), {
        response: {
          data: {
            message: ['Orden inválida', 'Datos incorrectos'],
          },
        },
      })

      vi.mocked(ordenesService.actualizar).mockRejectedValueOnce(error)

      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Editar').trigger('click')
      await wrapper.find('[data-testid="enviar-formulario"]').trigger('click')
      await flushPromises()

      expect(window.alert).toHaveBeenCalledWith(
        'Orden inválida, Datos incorrectos',
      )
    })
  })

  describe('Eliminación de órdenes', () => {
    it('solicita confirmación antes de eliminar', async () => {
      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Eliminar').trigger('click')

      expect(window.confirm).toHaveBeenCalledOnce()
      expect(window.confirm).toHaveBeenCalledWith(
        expect.stringContaining('ORD-001'),
      )
    })

    it('elimina la orden cuando se confirma', async () => {
      const mocks = configurarComposable()
      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Eliminar').trigger('click')
      await flushPromises()

      expect(ordenesService.eliminar).toHaveBeenCalledWith(1)
      expect(mocks.cargarOrdenes).toHaveBeenCalled()
      expect(wrapper.text()).toContain('La orden se eliminó correctamente.')
    })

    it('muestra el error general cuando falla la eliminación', async () => {
      vi.mocked(ordenesService.eliminar).mockRejectedValueOnce(
        new Error('Error de eliminación'),
      )

      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Eliminar').trigger('click')
      await flushPromises()

      expect(window.alert).toHaveBeenCalledWith(
        'No fue posible eliminar la orden.',
      )
    })

    it('muestra los errores del backend al eliminar', async () => {
      const error = Object.assign(new Error('Error'), {
        response: {
          data: {
            message: ['No se puede eliminar', 'Orden relacionada'],
          },
        },
      })

      vi.mocked(ordenesService.eliminar).mockRejectedValueOnce(error)

      const wrapper = montarVista()

      await obtenerBoton(wrapper, 'Eliminar').trigger('click')
      await flushPromises()

      expect(window.alert).toHaveBeenCalledWith(
        'No se puede eliminar, Orden relacionada',
      )
    })
  })

  describe('Cierre del formulario', () => {
    it('cierra el formulario al cancelar', async () => {
      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('[data-testid="cancelar-formulario"]').trigger('click')

      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(false)
    })

    it('cierra el formulario con el botón de cerrar', async () => {
      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('[aria-label="Cerrar formulario"]').trigger('click')

      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(false)
    })

    it('cierra el formulario al pulsar el fondo del modal', async () => {
      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('.fixed.inset-0').trigger('click.self')

      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(false)
    })

    it('permite abrir nuevamente el formulario después de cerrarlo', async () => {
      const wrapper = montarVista()

      await abrirFormulario(wrapper)
      await wrapper.find('[aria-label="Cerrar formulario"]').trigger('click')
      await abrirFormulario(wrapper)

      expect(wrapper.find('[data-testid="orden-form"]').exists()).toBe(true)
    })
  })
})
