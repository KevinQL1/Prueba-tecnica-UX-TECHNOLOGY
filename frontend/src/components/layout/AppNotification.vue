
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

// Define los tipos de notificación disponibles.
type TipoNotificacion = 'success' | 'error' | 'warning'

const props = defineProps<{
  tipo: TipoNotificacion
  titulo: string
  mensaje: string
}>()

const emit = defineEmits<{
  close: []
}>()

// Configura los estilos según el tipo de notificación.
const estilos = computed(() => {
  const configuracion = {
    success: {
      contenedor: 'border-emerald-200 bg-white',
      icono: 'bg-emerald-100 text-emerald-600',
      titulo: 'text-emerald-800',
      simbolo: '✓',
      barra: 'bg-emerald-500',
    },
    error: {
      contenedor: 'border-red-200 bg-white',
      icono: 'bg-red-100 text-red-600',
      titulo: 'text-red-800',
      simbolo: '!',
      barra: 'bg-red-500',
    },
    warning: {
      contenedor: 'border-amber-200 bg-white',
      icono: 'bg-amber-100 text-amber-600',
      titulo: 'text-amber-800',
      simbolo: '!',
      barra: 'bg-amber-500',
    },
  }

  return configuracion[props.tipo]
})

// Cierra automáticamente la notificación después de cinco segundos.
let temporizador: ReturnType<typeof setTimeout>

onMounted(() => {
  temporizador = setTimeout(() => {
    emit('close')
  }, 5000)
})

// Limpia el temporizador cuando se desmonta el componente.
onBeforeUnmount(() => {
  clearTimeout(temporizador)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="scale-95 opacity-0"
    enter-to-class="scale-100 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-95 opacity-0"
  >
    <div
      role="alert"
      aria-live="assertive"
      class="flex w-full items-start gap-4 rounded-2xl border p-6 shadow-2xl"
      :class="estilos.contenedor"
    >
      <span
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
        :class="estilos.icono"
      >
        {{ estilos.simbolo }}
      </span>

      <div class="min-w-0 flex-1">
        <h3 class="text-lg font-bold" :class="estilos.titulo">
          {{ titulo }}
        </h3>

        <p class="mt-2 text-sm leading-relaxed text-slate-600">
          {{ mensaje }}
        </p>

        <!-- Barra que indica el tiempo restante de la notificación. -->
        <div class="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            class="barra-progreso h-full w-full"
            :class="estilos.barra"
          />
        </div>
      </div>

      <button
        type="button"
        aria-label="Cerrar notificación"
        class="rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        @click="emit('close')"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.barra-progreso {
  transform-origin: left;
  animation: notification-progress 5s linear forwards;
}

@keyframes notification-progress {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}
</style>