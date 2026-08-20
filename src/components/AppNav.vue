<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'

defineProps<{
  language: string
  themeLabel: string
  theme: 'light' | 'dark'
}>()

const emit = defineEmits<{
  locale: []
  theme: []
}>()
</script>

<template>
  <header class="border-b border-line bg-page">
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
      <p class="text-[15px] font-medium tracking-tight">Meddah</p>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="h-9 px-2 text-[13px] text-mute hover:text-ink"
          @click="emit('locale')"
        >
          {{ language }}
        </button>
        <button
          type="button"
          class="flex size-9 items-center justify-center text-mute hover:text-ink"
          :aria-label="themeLabel"
          @click="emit('theme')"
        >
          <Sun v-if="theme === 'dark'" :size="18" :stroke-width="1.6" />
          <Moon v-else :size="18" :stroke-width="1.6" />
        </button>
      </div>
    </div>
  </header>
</template>
