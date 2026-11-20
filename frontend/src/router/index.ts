import { createRouter, createWebHistory } from 'vue-router'

// Define las rutas principales de la aplicación.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'ordenes',
      component: () => import('@/views/ordenes/OrdenesView.vue'),
    },
  ],
})

export default router
