
<script setup lang="ts">
import type { EstadoOrden } from '@/interfaces/orden-servicio.interface'

// Recibe el estado de la orden desde el componente padre.
const props = defineProps<{
  estado: EstadoOrden
}>()

// Define los estilos visuales para cada estado.
const estilosEstado: Record<EstadoOrden, string> = {
  Pendiente: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  'En Proceso': 'bg-blue-100 text-blue-700 ring-blue-600/20',
  Completada: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
  Cancelada: 'bg-red-100 text-red-700 ring-red-600/20',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset"
    :class="estilosEstado[props.estado]"
  >
    {{ props.estado }}
  </span>
</template>
