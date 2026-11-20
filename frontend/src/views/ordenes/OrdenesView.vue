<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useOrdenes } from '@/composables/useOrdenes'
import EstadoBadge from '@/components/ordenes/EstadoBadge.vue'
import PrioridadBadge from '@/components/ordenes/PrioridadBadge.vue'
import { ref } from 'vue'
import OrdenForm from '@/components/ordenes/OrdenForm.vue'
import { ordenesService } from '@/services/ordenes.service'
import type { CrearOrdenDto, OrdenServicio } from '@/interfaces/orden-servicio.interface'

// Inicializa la lógica de consulta de órdenes.
const {
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

// Controla la visibilidad del formulario de creación.
const mostrarFormulario = ref(false)

// Controla el estado de envío de la nueva orden.
const guardandoOrden = ref(false)

// Almacena los mensajes de resultado de la operación.
const mensajeExito = ref('')

// Almacena la orden seleccionada para editar.
const ordenSeleccionada = ref<OrdenServicio | null>(null)

// Controla si el formulario está en modo edición.
const editandoOrden = ref(false)

// Consulta los registros cuando se carga la pantalla.
onMounted(() => {
  void cargarOrdenes()
})

// Actualiza la cantidad de registros ingresada por el usuario.
async function actualizarLimite(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement

  await cambiarLimite(Number(input.value))

  // Restaura el último valor válido si la entrada fue incorrecta.
  input.value = String(filtros.value.limit)
}

// Crea una orden y actualiza la lista después de guardarla.
const crearOrden = async (datos: CrearOrdenDto) => {
  guardandoOrden.value = true
  mensajeExito.value = ''
  try {
    await ordenesService.crear(datos)
    mostrarFormulario.value = false
    await limpiarFiltros()
    mensajeExito.value = 'La orden se creó correctamente.'
    } catch (error: unknown) {
    let mensaje = 'No fue posible crear la orden.'

    if (error instanceof Error && 'response' in error) {
      const respuesta = error.response as {
        data?: { message?: string | string[] }
      }

      const mensajeRespuesta = respuesta.data?.message

      mensaje = Array.isArray(mensajeRespuesta)
        ? mensajeRespuesta.join(', ')
        : mensajeRespuesta || mensaje
    }

    // Muestra los errores del backend en una alerta emergente.
    window.alert(mensaje)
  } finally {
    guardandoOrden.value = false
  }
}

// Abre el formulario con los datos de la orden seleccionada.
function abrirEdicion(orden: OrdenServicio): void {
  ordenSeleccionada.value = orden
  editandoOrden.value = true
  mensajeExito.value = ''
  mostrarFormulario.value = true
}

// Actualiza una orden y refresca el listado.
const actualizarOrden = async (datos: CrearOrdenDto) => {
  if (!ordenSeleccionada.value) return

  guardandoOrden.value = true

  try {
    await ordenesService.actualizar(ordenSeleccionada.value.id, datos)

    mostrarFormulario.value = false
    ordenSeleccionada.value = null
    editandoOrden.value = false

    await cargarOrdenes()

    mensajeExito.value = 'La orden se actualizó correctamente.'
  } catch (error: unknown) {
    let mensaje = 'No fue posible actualizar la orden.'

    if (error instanceof Error && 'response' in error) {
      const respuesta = error.response as {
        data?: { message?: string | string[] }
      }

      const mensajeRespuesta = respuesta.data?.message

      mensaje = Array.isArray(mensajeRespuesta)
        ? mensajeRespuesta.join(', ')
        : mensajeRespuesta || mensaje
    }

    window.alert(mensaje)
  } finally {
    guardandoOrden.value = false
  }
}

// Cierra el formulario y limpia la orden seleccionada.
function cerrarFormulario(): void {
  if (guardandoOrden.value) return

  mostrarFormulario.value = false
  ordenSeleccionada.value = null
  editandoOrden.value = false
}

// Elimina una orden después de confirmar la acción.
async function eliminarOrden(orden: OrdenServicio): Promise<void> {
  const confirmar = window.confirm(
    `¿Estás seguro de eliminar la orden ${orden.codigo_orden}?`,
  )

  if (!confirmar) return

  try {
    await ordenesService.eliminar(orden.id)

    await cargarOrdenes()

    mensajeExito.value = 'La orden se eliminó correctamente.'
  } catch (error: unknown) {
    let mensaje = 'No fue posible eliminar la orden.'

    if (error instanceof Error && 'response' in error) {
      const respuesta = error.response as {
        data?: { message?: string | string[] }
      }

      const mensajeRespuesta = respuesta.data?.message

      mensaje = Array.isArray(mensajeRespuesta)
        ? mensajeRespuesta.join(', ')
        : mensajeRespuesta || mensaje
    }

    window.alert(mensaje)
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppHeader />

    <main class="mx-auto max-w-7xl px-6 py-8">
      <!-- Encabezado del módulo y acción de creación. -->
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
      
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          @click="cerrarFormulario(); mostrarFormulario = true"
        >
          <span class="text-lg">+</span>
          Nueva orden
        </button>
      </section>

      <!-- Mensaje de creación exitosa. -->
      <div
        v-if="mensajeExito"
        role="status"
        class="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ mensajeExito }}
      </div>

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
                <th class="px-6 py-3 text-center text-xs font-semibold uppercase text-slate-500">
                  Acciones
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
                <td class="whitespace-nowrap px-6 py-4">
                  <EstadoBadge :estado="orden.estado" />
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <PrioridadBadge :prioridad="orden.prioridad" />
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {{ orden.valor_total }}
                </td>
                <td class="whitespace-nowrap px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      class="rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                      @click="abrirEdicion(orden)"
                    >
                      Editar
                    </button>
                  
                    <button
                      type="button"
                      class="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                      @click="eliminarOrden(orden)"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Controles de paginación del listado de órdenes. -->
        <div
          v-if="!cargando && !error && paginacion.total > 0"
          class="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <!-- Información de los registros mostrados. -->
          <div class="text-sm text-slate-500">
            Página {{ paginacion.page }} de {{ paginacion.totalPages }}
            <span class="mx-1">·</span>
            {{ paginacion.total }} registros en total
          </div>
        
          <div class="flex flex-wrap items-center gap-3">
            <!-- Permite definir la cantidad de registros por página. -->
            <div class="flex items-center gap-2">
              <label
                for="limite-registros"
                class="whitespace-nowrap text-sm text-slate-600"
              >
                Registros por página:
              </label>
            
              <input
                id="limite-registros"
                type="number"
                min="1"
                max="100"
                step="1"
                :value="filtros.limit"
                class="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                @change="actualizarLimite"
              />
            </div>

            <!-- Navegación entre páginas. -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                :disabled="paginacion.page <= 1"
                class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                @click="cambiarPagina(paginacion.page - 1)"
              >
                Anterior
              </button>
            
              <button
                type="button"
                :disabled="paginacion.page >= paginacion.totalPages"
                class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                @click="cambiarPagina(paginacion.page + 1)"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- Modal para registrar una nueva orden de servicio. -->
    <Teleport to="body">
      <div
        v-if="mostrarFormulario"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4"
        @click.self="mostrarFormulario = false"
      >
        <section
          class="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-formulario"
        >
          <header class="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h3
                id="titulo-formulario"
                class="text-xl font-bold text-slate-900"
              >
                {{
                  editandoOrden
                    ? 'Actualiza la información de la orden seleccionada.'
                    : 'Completa la información para registrar una nueva orden.'
                }}
              </h3>
            
              <p class="mt-1 text-sm text-slate-500">
                Completa la información para registrar una nueva orden.
              </p>
            </div>
          
            <button
              type="button"
              aria-label="Cerrar formulario"
              :disabled="guardandoOrden"
              class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              @click="mostrarFormulario = false"
            >
              ✕
            </button>
          </header>
        
          <div class="max-h-[75vh] overflow-y-auto p-6">
            <OrdenForm
              :key="ordenSeleccionada?.id ?? 'nueva'"
              :cargando="guardandoOrden"
              :orden="ordenSeleccionada"
              @submit="editandoOrden ? actualizarOrden($event) : crearOrden($event)"
              @cancel="cerrarFormulario"
            />
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>
