import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../../../src/components/layout/AppHeader.vue'

describe('AppHeader', () => {
  it('renderiza el título principal del sistema', () => {
    const wrapper = mount(AppHeader)

    expect(wrapper.find('h1').text()).toContain('UX Technology')
  })

  it('muestra la descripción del sistema', () => {
    const wrapper = mount(AppHeader)

    expect(wrapper.text()).toContain('Sistema de gesti')
  })

  it('muestra el indicador de sistema de gestión', () => {
    const wrapper = mount(AppHeader)

    expect(wrapper.text()).toContain('Sistema de gesti')
  })
})
