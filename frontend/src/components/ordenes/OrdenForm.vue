
<script setup lang="ts">
import { reactive, ref } from 'vue'

import type {
  CrearOrdenDto,
  EstadoOrden,
  PrioridadOrden,
} from '@/interfaces/orden-servicio.interface'

// Define las propiedades y eventos del formulario.
defineProps<{
  cargando?: boolean
}>()

const emit = defineEmits<{
  submit: [datos: CrearOrdenDto]
  cancel: []
}>()

// Obtiene la fecha local para establecerla como valor inicial.
function obtenerFechaActual(): string {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

// Almacena los datos ingresados en el formulario.
const formulario = reactive<CrearOrdenDto>({
  codigo_orden: '',
  cliente_nombre: '',
  cantidad_items: 1,
  valor_total: 0,
  porcentaje_descuento: 0,
  fecha_solicitud: obtenerFechaActual(),
  estado: 'Pendiente',
  prioridad: 'Media',
  observaciones: '',
})

// Almacena los mensajes de validación de cada campo.
const errores = ref<Record<string, string>>({})

// Opciones permitidas para los estados y prioridades.
const estados: EstadoOrden[] = [
  'Pendiente',
  'En Proceso',
  'Completada',
  'Cancelada',
]

const prioridades: PrioridadOrden[] = [
  'Baja',
  'Media',
  'Alta',
  'Crítica',
]

// Valida los datos antes de emitirlos al componente padre.
function validarFormulario(): boolean {
  errores.value = {}

  if (!formulario.codigo_orden.trim()) {
    errores.value.codigo_orden = 'El código de orden es obligatorio.'
  } else if (formulario.codigo_orden.trim().length > 30) {
    errores.value.codigo_orden = 'El código no puede superar 30 caracteres.'
  }

  if (!formulario.cliente_nombre.trim()) {
    errores.value.cliente_nombre = 'El nombre del cliente es obligatorio.'
  } else if (formulario.cliente_nombre.trim().length > 150) {
    errores.value.cliente_nombre = 'El nombre no puede superar 150 caracteres.'
  }

  if (
    !Number.isInteger(formulario.cantidad_items) ||
    formulario.cantidad_items < 1
  ) {
    errores.value.cantidad_items = 'La cantidad debe ser un entero mayor que cero.'
  }

  if (
    !Number.isFinite(formulario.valor_total) ||
    formulario.valor_total < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(String(formulario.valor_total))
  ) {
    errores.value.valor_total = 'Ingresa un valor válido con máximo dos decimales.'
  }

  if (
    !Number.isFinite(formulario.porcentaje_descuento) ||
    formulario.porcentaje_descuento < 0 ||
    formulario.porcentaje_descuento > 100 ||
    !/^\d+(\.\d{1,2})?$/.test(String(formulario.porcentaje_descuento))
  ) {
    errores.value.porcentaje_descuento =
      'El descuento debe estar entre 0 y 100, con máximo dos decimales.'
  }

  if (!formulario.fecha_solicitud) {
    errores.value.fecha_solicitud = 'La fecha de solicitud es obligatoria.'
  }

  return Object.keys(errores.value).length === 0
}

// Valida y envía una copia de los datos al componente padre.
function enviarFormulario(): void {
  if (!validarFormulario()) return

  emit('submit', {
    ...formulario,
    codigo_orden: formulario.codigo_orden.trim(),
    cliente_nombre: formulario.cliente_nombre.trim(),
    observaciones: formulario.observaciones?.trim() || undefined,
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="enviarFormulario">
    <!-- Código y nombre del cliente. -->
    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <div>
        <label for="codigo-orden" class="mb-2 block text-sm font-medium text-slate-700">
          Código de orden *
        </label>

        <input
          id="codigo-orden"
          v-model="formulario.codigo_orden"
          type="text"
          maxlength="30"
          placeholder="Ej. ORD-2026-001"
          class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p v-if="errores.codigo_orden" class="mt-1 text-xs text-red-600">
          {{ errores.codigo_orden }}
        </p>
      </div>

      <div>
        <label for="cliente-nombre" class="mb-2 block text-sm font-medium text-slate-700">
          Nombre del cliente *
        </label>

        <input
          id="cliente-nombre"
          v-model="formulario.cliente_nombre"
          type="text"
          maxlength="150"
          placeholder="Nombre completo del cliente"
          class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p v-if="errores.cliente_nombre" class="mt-1 text-xs text-red-600">
          {{ errores.cliente_nombre }}
        </p>
      </div>
    </div>

    <!-- Cantidad y valores económicos. -->
    <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div>
        <label for="cantidad-items" class="mb-2 block text-sm font-medium text-slate-700">
          Cantidad de artículos *
        </label>

        <input
          id="cantidad-items"
          v-model.number="formulario.cantidad_items"
          type="number"
          min="1"
          step="1"
          class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        />

        <p v-if="errores.cantidad_items" class="mt-1 text-xs text-red-600">
          {{ errores.cantidad_items }}
        </p>
      </div>

      <div>
        <label for="valor-total" class="mb-2 block text-sm font-medium text-slate-700">
          Valor total *
        </label>

        <input
          id="valor-total"
          v-model.number="formulario.valor_total"
          type="number"
          min="0"
          step="0.01"
          class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        />

        <p v-if="errores.valor_total" class="mt-1 text-xs text-red-600">
          {{ errores.valor_total }}
        </p>
      </div>

      <div>
        <label for="descuento" class="mb-2 block text-sm font-medium text-slate-700">
          Descuento (%) *
        </label>

        <input
          id="descuento"
          v-model.number="formulario.porcentaje_descuento"
          type="number"
          min="0"
          max="100"
          step="0.01"
          class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        />

        <p v-if="errores.porcentaje_descuento" class="mt-1 text-xs text-red-600">
          {{ errores.porcentaje_descuento }}
        </p>
      </div>
    </div>

    <!-- Fecha, estado y prioridad. -->
    <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div>
        <label for="fecha-solicitud" class="mb-2 block text-sm font-medium text-slate-700">
          Fecha de solicitud *
        </label>

        <input
          id="fecha-solicitud"
          v-model="formulario.fecha_solicitud"
          type="date"
          class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        />

        <p v-if="errores.fecha_solicitud" class="mt-1 text-xs text-red-600">
          {{ errores.fecha_solicitud }}
        </p>
      </div>

      <div>
        <label for="estado-orden" class="mb-2 block text-sm font-medium text-slate-700">
          Estado *
        </label>

        <select
          id="estado-orden"
          v-model="formulario.estado"
          class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option v-for="estado in estados" :key="estado" :value="estado">
            {{ estado }}
          </option>
        </select>
      </div>

      <div>
        <label for="prioridad-orden" class="mb-2 block text-sm font-medium text-slate-700">
          Prioridad *
        </label>

        <select
          id="prioridad-orden"
          v-model="formulario.prioridad"
          class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option v-for="prioridad in prioridades" :key="prioridad" :value="prioridad">
            {{ prioridad }}
          </option>
        </select>
      </div>
    </div>

    <!-- Observaciones adicionales. -->
    <div>
      <label for="observaciones" class="mb-2 block text-sm font-medium text-slate-700">
        Observaciones
      </label>

      <textarea
        id="observaciones"
        v-model="formulario.observaciones"
        rows="3"
        placeholder="Información adicional sobre la orden..."
        class="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      ></textarea>
    </div>

    <!-- Acciones del formulario. -->
    <div class="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
      <button
        type="button"
        class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        :disabled="cargando"
        @click="emit('cancel')"
      >
        Cancelar
      </button>

      <button
        type="submit"
        :disabled="cargando"
        class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ cargando ? 'Guardando...' : 'Crear orden' }}
      </button>
    </div>
  </form>
</template>
