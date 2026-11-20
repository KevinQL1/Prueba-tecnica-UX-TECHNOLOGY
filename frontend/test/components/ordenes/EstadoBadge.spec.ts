import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EstadoBadge from '../../../src/components/ordenes/EstadoBadge.vue'

describe('EstadoBadge', () => {
  it.each([
    ['Pendiente', 'bg-amber-100'],
    ['En Proceso', 'bg-blue-100'],
    ['Completada', 'bg-emerald-100'],
    ['Cancelada', 'bg-red-100'],
  ] as const)('muestra el estado %s con su estilo correspondiente', (estado, estilo) => {
    const wrapper = mount(EstadoBadge, {
      props: { estado },
    })

    expect(wrapper.text()).toBe(estado)
    expect(wrapper.classes()).toContain(estilo)
  })
})
