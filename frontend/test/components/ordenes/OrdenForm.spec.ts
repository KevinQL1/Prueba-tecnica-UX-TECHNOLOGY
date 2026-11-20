import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import OrdenForm from '../../../src/components/ordenes/OrdenForm.vue'
import type { OrdenServicio } from '../../../src/interfaces/orden-servicio.interface'

// Datos válidos utilizados como base para las pruebas.
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
  observaciones: 'Observación inicial',
  activo: 1,
  fecha_creacion: '2026-11-15T10:00:00',
  fecha_actualizacion: '2026-11-15T10:00:00',
}

// Monta el formulario y permite probar sus diferentes propiedades.
function montarFormulario(props = {}) {
  return mount(OrdenForm, {
    props,
  })
}

// Completa los campos obligatorios con información válida.
async function completarFormulario(wrapper: ReturnType<typeof montarFormulario>) {
  await wrapper.find('#codigo-orden').setValue('OS-002')
  await wrapper.find('#cliente-nombre').setValue('Cliente nuevo')
  await wrapper.find('#cantidad-items').setValue('3')
  await wrapper.find('#valor-total').setValue('2500000')
  await wrapper.find('#descuento').setValue('10')
  await wrapper.find('#fecha-solicitud').setValue('2026-11-20')
}

describe('OrdenForm', () => {
  beforeEach(() => {
    // Cada prueba monta una instancia independiente del formulario.
  })

  describe('Renderizado inicial', () => {
    it('muestra los campos principales del formulario', () => {
      const wrapper = montarFormulario()

      expect(wrapper.find('#codigo-orden').exists()).toBe(true)
      expect(wrapper.find('#cliente-nombre').exists()).toBe(true)
      expect(wrapper.find('#cantidad-items').exists()).toBe(true)
      expect(wrapper.find('#valor-total').exists()).toBe(true)
      expect(wrapper.find('#descuento').exists()).toBe(true)
      expect(wrapper.find('#fecha-solicitud').exists()).toBe(true)
      expect(wrapper.find('#estado-orden').exists()).toBe(true)
      expect(wrapper.find('#prioridad-orden').exists()).toBe(true)
      expect(wrapper.find('#observaciones').exists()).toBe(true)
    })

    it('inicia con los valores predeterminados', () => {
      const wrapper = montarFormulario()

      expect(wrapper.find('#cantidad-items').element.value).toBe('1')
      expect(wrapper.find('#valor-total').element.value).toBe('0')
      expect(wrapper.find('#descuento').element.value).toBe('0')
      expect(wrapper.find('#estado-orden').element.value).toBe('Pendiente')
      expect(wrapper.find('#prioridad-orden').element.value).toBe('Media')
    })

    it('muestra el botón para crear una orden', () => {
      const wrapper = montarFormulario()

      expect(wrapper.find('button[type="submit"]').text()).toBe('Crear orden')
    })

    it('muestra las opciones disponibles de estado y prioridad', () => {
      const wrapper = montarFormulario()

      expect(wrapper.findAll('#estado-orden option')).toHaveLength(4)
      expect(wrapper.findAll('#prioridad-orden option')).toHaveLength(4)
    })
  })

  describe('Creación de órdenes', () => {
    it('emite los datos cuando el formulario es válido', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#observaciones').setValue(' Información adicional ')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toHaveLength(1)
      expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
        codigo_orden: 'OS-002',
        cliente_nombre: 'Cliente nuevo',
        cantidad_items: 3,
        valor_total: 2500000,
        porcentaje_descuento: 10,
        fecha_solicitud: '2026-11-20',
        estado: 'Pendiente',
        prioridad: 'Media',
        observaciones: 'Información adicional',
      })
    })

    it('elimina los espacios de los campos de texto', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#codigo-orden').setValue(' OS-003 ')
      await wrapper.find('#cliente-nombre').setValue(' Cliente con espacios ')
      await wrapper.find('#observaciones').setValue('   ')
      await wrapper.find('form').trigger('submit')

      const datos = wrapper.emitted('submit')?.[0]?.[0] as Record<string, unknown>

      expect(datos.codigo_orden).toBe('OS-003')
      expect(datos.cliente_nombre).toBe('Cliente con espacios')
      expect(datos.observaciones).toBeUndefined()
    })

    it('no emite datos cuando el formulario es inválido', async () => {
      const wrapper = montarFormulario()

      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toBeUndefined()
    })

    it('permite enviar una observación vacía como undefined', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('form').trigger('submit')

      const datos = wrapper.emitted('submit')?.[0]?.[0] as Record<string, unknown>

      expect(datos.observaciones).toBeUndefined()
    })
  })

  describe('Validación del código de orden', () => {
    it('valida que el código sea obligatorio', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#codigo-orden').setValue('')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('El código de orden es obligatorio.')
    })

    it('valida que el código no supere 30 caracteres', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#codigo-orden').setValue('A'.repeat(31))
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('El código no puede superar 30 caracteres.')
    })

    it('acepta un código de exactamente 30 caracteres', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#codigo-orden').setValue('A'.repeat(30))
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toHaveLength(1)
    })
  })

  describe('Validación del cliente', () => {
    it('valida que el nombre del cliente sea obligatorio', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#cliente-nombre').setValue('')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('El nombre del cliente es obligatorio.')
    })

    it('valida que el nombre no supere 150 caracteres', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#cliente-nombre').setValue('A'.repeat(151))
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('El nombre no puede superar 150 caracteres.')
    })

    it('acepta un nombre de exactamente 150 caracteres', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#cliente-nombre').setValue('A'.repeat(150))
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toHaveLength(1)
    })
  })

  describe('Validación de cantidad y valores', () => {
    it('rechaza cantidades menores que uno', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#cantidad-items').setValue('0')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('La cantidad debe ser un entero mayor que cero.')
    })

    it('rechaza cantidades decimales', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#cantidad-items').setValue('1.5')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('La cantidad debe ser un entero mayor que cero.')
    })

    it('rechaza valores totales negativos', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#valor-total').setValue('-1')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('Ingresa un valor válido')
    })

    it('rechaza valores totales con más de dos decimales', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#valor-total').setValue('10.123')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('Ingresa un valor válido')
    })

    it('rechaza descuentos negativos', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#descuento').setValue('-1')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('El descuento debe estar entre 0 y 100')
    })

    it('rechaza descuentos superiores a 100', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#descuento').setValue('101')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('El descuento debe estar entre 0 y 100')
    })

    it('rechaza descuentos con más de dos decimales', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#descuento').setValue('10.123')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('El descuento debe estar entre 0 y 100')
    })

    it('acepta valores económicos con dos decimales', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#valor-total').setValue('1250.50')
      await wrapper.find('#descuento').setValue('10.25')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.emitted('submit')).toHaveLength(1)
    })
  })

  describe('Validación de fecha', () => {
    it('valida que la fecha de solicitud sea obligatoria', async () => {
      const wrapper = montarFormulario()

      await completarFormulario(wrapper)
      await wrapper.find('#fecha-solicitud').setValue('')
      await wrapper.find('form').trigger('submit')

      expect(wrapper.text()).toContain('La fecha de solicitud es obligatoria.')
    })
  })

  describe('Edición de órdenes', () => {
    it('carga los datos de una orden existente', () => {
      const wrapper = montarFormulario({ orden: ordenEjemplo })

      expect((wrapper.find('#codigo-orden').element as HTMLInputElement).value)
        .toBe('OS-001')
      expect((wrapper.find('#cliente-nombre').element as HTMLInputElement).value)
        .toBe('Cliente de prueba')
      expect((wrapper.find('#cantidad-items').element as HTMLInputElement).value)
        .toBe('3')
      expect((wrapper.find('#valor-total').element as HTMLInputElement).value)
        .toBe('2500000')
      expect((wrapper.find('#descuento').element as HTMLInputElement).value)
        .toBe('10')
      expect((wrapper.find('#fecha-solicitud').element as HTMLInputElement).value)
        .toBe('2026-11-15')
      expect(wrapper.find('#observaciones').element.value)
        .toBe('Observación inicial')
    })

    it('muestra el botón para guardar cambios al editar', () => {
      const wrapper = montarFormulario({ orden: ordenEjemplo })

      expect(wrapper.find('button[type="submit"]').text()).toBe('Guardar cambios')
    })

    it('convierte las observaciones nulas en texto vacío', () => {
      const wrapper = montarFormulario({
        orden: { ...ordenEjemplo, observaciones: null },
      })

      expect(wrapper.find('#observaciones').element.value).toBe('')
    })

    it('actualiza los campos cuando cambia la orden seleccionada', async () => {
      const wrapper = montarFormulario({ orden: ordenEjemplo })

      await wrapper.setProps({
        orden: {
          ...ordenEjemplo,
          codigo_orden: 'OS-002',
          cliente_nombre: 'Otro cliente',
        },
      })

      expect(wrapper.find('#codigo-orden').element.value).toBe('OS-002')
      expect(wrapper.find('#cliente-nombre').element.value).toBe('Otro cliente')
    })

    it('restablece el formulario cuando se elimina la orden seleccionada', async () => {
      const wrapper = montarFormulario({ orden: ordenEjemplo })

      await wrapper.setProps({ orden: null })

      expect(wrapper.find('#codigo-orden').element.value).toBe('')
      expect(wrapper.find('#cliente-nombre').element.value).toBe('')
      expect(wrapper.find('#cantidad-items').element.value).toBe('1')
      expect(wrapper.find('#estado-orden').element.value).toBe('Pendiente')
      expect(wrapper.find('#prioridad-orden').element.value).toBe('Media')
    })
  })

  describe('Eventos y estado de carga', () => {
    it('emite el evento cancel al pulsar el botón cancelar', async () => {
      const wrapper = montarFormulario()

      await wrapper.find('button[type="button"]').trigger('click')

      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('deshabilita los botones mientras se guarda', () => {
      const wrapper = montarFormulario({ cargando: true })

      expect(wrapper.find('button[type="button"]').element.disabled).toBe(true)
      expect(wrapper.find('button[type="submit"]').element.disabled).toBe(true)
      expect(wrapper.find('button[type="submit"]').text()).toBe('Guardando...')
    })

    it('habilita los botones cuando termina la carga', async () => {
      const wrapper = montarFormulario({ cargando: true })

      await wrapper.setProps({ cargando: false })

      expect(wrapper.find('button[type="button"]').element.disabled).toBe(false)
      expect(wrapper.find('button[type="submit"]').element.disabled).toBe(false)
      expect(wrapper.find('button[type="submit"]').text()).toBe('Crear orden')
    })

    it('no emite cancel cuando el botón está deshabilitado', async () => {
      const wrapper = montarFormulario({ cargando: true })

      await wrapper.find('button[type="button"]').trigger('click')

      expect(wrapper.emitted('cancel')).toBeUndefined()
    })
  })
})
