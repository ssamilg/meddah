<script setup lang="ts">
import { Moon, Pencil, Sun } from '@lucide/vue'

defineProps<{
  language: string
  themeLabel: string
  theme: 'light' | 'dark'
  editLabel: string
  editHref: string | undefined
}>()

const emit = defineEmits<{
  locale: []
  theme: []
}>()
</script>

<template>
  <header class="border-b border-line bg-page/80">
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
      <RouterLink to="/" class="cursor-pointer text-base font-medium tracking-tight text-ink">
        Meddah
      </RouterLink>
      <div class="flex items-center gap-1">
        <a
          v-if="editHref"
          class="flex h-9 cursor-pointer items-center gap-1 px-2 text-sm text-mute hover:text-ink"
          :href="editHref"
          target="_blank"
          rel="noreferrer"
        >
          <Pencil :size="16" :stroke-width="1.6" />
          {{ editLabel }}
        </a>
        <button
          type="button"
          class="h-9 cursor-pointer px-2 text-sm text-mute hover:text-ink"
          @click="emit('locale')"
        >
          {{ language }}
        </button>
        <button
          type="button"
          class="flex size-9 cursor-pointer items-center justify-center text-mute hover:text-ink"
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
