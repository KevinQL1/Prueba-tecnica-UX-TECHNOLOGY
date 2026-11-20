<script setup lang="ts">
// Encabezado principal del sistema de gestión.
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="h-6 w-6"
          >
            <path d="M8 6h13M8 12h13M8 18h13" />
            <path d="M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </div>

        <div>
          <h1 class="text-lg font-bold text-slate-900">
            Prueba Técnica - UX Technology 
          </h1>
          <p class="text-xs text-slate-500">
            Gestión de órdenes de servicio
          </p>
        </div>
      </div>

      <div class="hidden items-center gap-2 sm:flex">
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span class="text-sm text-slate-600">
          Sistema de gestión
        </span>
      </div>
    </div>
  </header>
</template>
