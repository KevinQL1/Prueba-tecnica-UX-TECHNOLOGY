import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('App', () => {
  it('renderiza el componente RouterView', () => {
    const wrapper = mount(App, {
      global: {
        // Simula RouterView sin necesitar configurar el router.
        stubs: {
          RouterView: true,
        },
      },
    })

    expect(wrapper.find('router-view-stub').exists()).toBe(true)
  })
})
