<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ConfirmDialog from '@desk/components/ConfirmDialog.vue'
import ToastHost from '@desk/components/ToastHost.vue'
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="border-b border-line">
      <div class="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
        <RouterLink to="/" class="text-sm font-medium">Meddah desk</RouterLink>
        <p class="text-sm text-mute">localhost:5174</p>
      </div>
    </header>
    <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <RouterView />
    </main>
    <ToastHost />
    <ConfirmDialog />
  </div>
</template>
