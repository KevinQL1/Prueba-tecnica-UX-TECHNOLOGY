<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useOrdenes } from '@/composables/useOrdenes'

// Inicializa la lógica de consulta de órdenes.
const {
  ordenes,
  cargando,
  error,
  filtros,
  paginacion,
  cargarOrdenes,
  aplicarFiltros,
  limpiarFiltros,
} = useOrdenes()


// Calcula la cantidad de órdenes que se encuentran en cada estado.
const totalPendientes = computed(
  () => ordenes.value.filter((orden) => orden.estado === 'Pendiente').length,
)

const totalEnProceso = computed(
  () => ordenes.value.filter((orden) => orden.estado === 'En Proceso').length,
)

const totalCompletadas = computed(
  () => ordenes.value.filter((orden) => orden.estado === 'Completada').length,
)

// Consulta los registros cuando se carga la pantalla.
onMounted(() => {
  void cargarOrdenes()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-6 py-8">
      <!-- Título y descripción del módulo. -->
      <section class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p class="text-sm font-medium text-blue-600">
            Administración
          </p>
          <h2 class="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Órdenes de servicio
          </h2>
          <p class="mt-2 text-sm text-slate-500">
            Consulta y administra las órdenes de servicio registradas.
          </p>
        </div>
      </section>

      <!-- Indicadores generales del listado actual. -->
      <section class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Total de órdenes</p>
          <p class="mt-2 text-3xl font-bold text-slate-900">
            {{ paginacion.total }}
          </p>
          <p class="mt-1 text-xs text-slate-400">Registros disponibles</p>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Pendientes</p>
          <p class="mt-2 text-3xl font-bold text-amber-600">
            {{ totalPendientes }}
          </p>
          <p class="mt-1 text-xs text-slate-400">En la página actual</p>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">En proceso</p>
          <p class="mt-2 text-3xl font-bold text-blue-600">
            {{ totalEnProceso }}
          </p>
          <p class="mt-1 text-xs text-slate-400">En la página actual</p>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-slate-500">Completadas</p>
          <p class="mt-2 text-3xl font-bold text-emerald-600">
            {{ totalCompletadas }}
          </p>
          <p class="mt-1 text-xs text-slate-400">En la página actual</p>
        </article>
      </section>

      <!-- Contenedor inicial del listado de órdenes. -->
      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-5">
          <h3 class="font-semibold text-slate-900">
            Listado de órdenes
          </h3>
          <p class="mt-1 text-sm text-slate-500">
            Órdenes registradas en el sistema.
          </p>
        </div>

        <!-- Controles de búsqueda y filtrado de órdenes. -->
        <div class="border-b border-slate-200 bg-slate-50/50 p-5">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          
            <!-- Búsqueda por nombre del cliente. -->
            <div class="md:col-span-2">
              <label
                for="buscar-cliente"
                class="mb-2 block text-sm font-medium text-slate-700"
              >
                Buscar por cliente
              </label>
            
              <input
                id="buscar-cliente"
                v-model="filtros.cliente_nombre"
                type="text"
                placeholder="Escribe el nombre del cliente..."
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                @keyup.enter="aplicarFiltros"
              />
            </div>
          
            <!-- Filtro por estado de la orden. -->
            <div>
              <label
                for="filtrar-estado"
                class="mb-2 block text-sm font-medium text-slate-700"
              >
                Estado de la orden
              </label>
            
              <select
                id="filtrar-estado"
                v-model="filtros.estado"
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option :value="undefined">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        
          <!-- Acciones de búsqueda y limpieza. -->
          <div class="mt-4 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              @click="limpiarFiltros"
            >
              Limpiar filtros
            </button>
          
            <button
              type="button"
              :disabled="cargando"
              class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              @click="aplicarFiltros"
            >
              Buscar órdenes
            </button>
          </div>
        </div>

        <div v-if="cargando" class="p-10 text-center text-sm text-slate-500">
          Cargando órdenes de servicio...
        </div>

        <div v-else-if="error" class="p-10 text-center">
          <p class="font-medium text-red-600">{{ error }}</p>
          <button
            class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            @click="cargarOrdenes"
          >
            Reintentar
          </button>
        </div>

        <div v-else-if="ordenes.length === 0" class="p-10 text-center">
          <p class="font-medium text-slate-700">
            No hay órdenes de servicio disponibles.
          </p>
          <p class="mt-1 text-sm text-slate-500">
            Cuando existan registros, aparecerán en este listado.
          </p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Código
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Cliente
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Prioridad
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Valor total
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="orden in ordenes"
                :key="orden.id"
                class="hover:bg-slate-50"
              >
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {{ orden.codigo_orden }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {{ orden.cliente_nombre }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {{ orden.estado }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {{ orden.prioridad }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {{ orden.valor_total }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="!cargando && !error && paginacion.total > 0"
          class="border-t border-slate-200 px-6 py-4 text-sm text-slate-500"
        >
          Mostrando {{ ordenes.length }} registros de {{ paginacion.total }} órdenes.
        </div>
      </section>
    </main>
  </div>
</template>
