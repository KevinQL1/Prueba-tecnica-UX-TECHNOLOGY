import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrioridadBadge from '../../../src/components/ordenes/PrioridadBadge.vue'

describe('PrioridadBadge', () => {
  it.each([
    ['Baja', 'bg-slate-100'],
    ['Media', 'bg-blue-100'],
    ['Alta', 'bg-orange-100'],
    ['Crítica', 'bg-red-100'],
  ] as const)('muestra la prioridad %s con su estilo correspondiente', (prioridad, estilo) => {
    const wrapper = mount(PrioridadBadge, {
      props: { prioridad },
    })

    expect(wrapper.text()).toBe(prioridad)
    expect(wrapper.classes()).toContain(estilo)
  })
})
