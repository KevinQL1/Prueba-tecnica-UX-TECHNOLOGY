import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AppNotification from '@/components/layout/AppNotification.vue'

describe('AppNotification.vue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  // Verifica que se muestre el título y mensaje recibidos.
  it('muestra el título y mensaje de la notificación', () => {
    const wrapper = mount(AppNotification, {
      props: {
        tipo: 'success',
        titulo: 'Orden creada',
        mensaje: 'La orden se creó correctamente.',
      },
    })

    expect(wrapper.text()).toContain('Orden creada')
    expect(wrapper.text()).toContain(
      'La orden se creó correctamente.',
    )

    wrapper.unmount()
  })

  // Verifica que el componente tenga el rol accesible de alerta.
  it('muestra el contenedor con el rol alert', () => {
    const wrapper = mount(AppNotification, {
      props: {
        tipo: 'success',
        titulo: 'Orden creada',
        mensaje: 'Operación exitosa.',
      },
    })

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.find('[role="alert"]').attributes('aria-live'))
      .toBe('assertive')

    wrapper.unmount()
  })

  // Verifica los estilos correspondientes a cada tipo de notificación.
  it.each([
    {
      tipo: 'success' as const,
      contenedor: 'border-emerald-200',
      icono: 'text-emerald-600',
      barra: 'bg-emerald-500',
      simbolo: '✓',
    },
    {
      tipo: 'error' as const,
      contenedor: 'border-red-200',
      icono: 'text-red-600',
      barra: 'bg-red-500',
      simbolo: '!',
    },
    {
      tipo: 'warning' as const,
      contenedor: 'border-amber-200',
      icono: 'text-amber-600',
      barra: 'bg-amber-500',
      simbolo: '!',
    },
  ])(
    'aplica los estilos correspondientes al tipo $tipo',
    ({ tipo, contenedor, icono, barra, simbolo }) => {
      const wrapper = mount(AppNotification, {
        props: {
          tipo,
          titulo: 'Notificación de prueba',
          mensaje: 'Mensaje de prueba.',
        },
      })

      expect(wrapper.find('[role="alert"]').classes())
        .toContain(contenedor)

      expect(wrapper.find('.rounded-full').classes())
        .toContain(icono)

      expect(wrapper.find('.barra-progreso').classes())
        .toContain(barra)

      expect(wrapper.text()).toContain(simbolo)

      wrapper.unmount()
    },
  )

  // Verifica que la barra tenga la clase de animación.
  it('muestra la barra de progreso', () => {
    const wrapper = mount(AppNotification, {
      props: {
        tipo: 'success',
        titulo: 'Orden creada',
        mensaje: 'Operación exitosa.',
      },
    })

    const barra = wrapper.find('.barra-progreso')

    expect(barra.exists()).toBe(true)
    expect(barra.classes()).toContain('barra-progreso')

    wrapper.unmount()
  })

  // Verifica que se emita el evento al cerrar manualmente.
  it('emite el evento close al pulsar el botón de cerrar', async () => {
    const wrapper = mount(AppNotification, {
      props: {
        tipo: 'success',
        titulo: 'Orden creada',
        mensaje: 'Operación exitosa.',
      },
    })

    await wrapper.find('[aria-label="Cerrar notificación"]').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })

  // Verifica que la notificación se cierre automáticamente después de cinco segundos.
  it('emite el evento close después de cinco segundos', () => {
    vi.useFakeTimers()

    const wrapper = mount(AppNotification, {
      props: {
        tipo: 'success',
        titulo: 'Orden creada',
        mensaje: 'Operación exitosa.',
      },
    })

    vi.advanceTimersByTime(4999)

    expect(wrapper.emitted('close')).toBeUndefined()

    vi.advanceTimersByTime(1)

    expect(wrapper.emitted('close')).toHaveLength(1)

    wrapper.unmount()
  })

  // Verifica que el temporizador se limpie al desmontar el componente.
  it('limpia el temporizador cuando se desmonta', () => {
    vi.useFakeTimers()

    const wrapper = mount(AppNotification, {
      props: {
        tipo: 'success',
        titulo: 'Orden creada',
        mensaje: 'Operación exitosa.',
      },
    })

    wrapper.unmount()

    vi.advanceTimersByTime(5000)

    expect(vi.getTimerCount()).toBe(0)
  })
})
