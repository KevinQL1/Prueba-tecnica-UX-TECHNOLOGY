
<script setup lang="ts">
import type { PrioridadOrden } from '@/interfaces/orden-servicio.interface'

// Recibe la prioridad de la orden desde el componente padre.
const props = defineProps<{
  prioridad: PrioridadOrden
}>()

// Define los estilos visuales para cada nivel de prioridad.
const estilosPrioridad: Record<PrioridadOrden, string> = {
  Baja: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  Media: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  Alta: 'bg-orange-100 text-orange-700 ring-orange-600/20',
  'Crítica': 'bg-red-100 text-red-700 ring-red-600/20',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset"
    :class="estilosPrioridad[props.prioridad]"
  >
    {{ props.prioridad }}
  </span>
</template>
