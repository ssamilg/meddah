<script setup lang="ts">
import { Moon, Pencil, Sun } from '@lucide/vue'

defineProps<{
  language: string
  themeLabel: string
  theme: 'light' | 'dark'
  editLabel: string
  editHref: string | undefined
  showTitle: string
}>()

const emit = defineEmits<{
  locale: []
  theme: []
}>()
</script>

<template>
  <header class="border-b border-line bg-page/80">
    <div class="mx-auto flex h-14 w-full max-w-[68rem] items-center justify-between px-6">
      <div class="flex min-w-0 items-baseline gap-2 text-base font-medium leading-none tracking-tight text-ink">
        <RouterLink to="/" class="shrink-0 cursor-pointer">Meddah</RouterLink>
        <template v-if="showTitle">
          <span class="shrink-0 font-normal text-mute" aria-hidden="true">/</span>
          <span class="min-w-0 truncate">{{ showTitle }}</span>
        </template>
        <template v-else>
          <span class="shrink-0 font-normal text-mute" aria-hidden="true">·</span>
          <a
            href="https://ssamilg.dev"
            class="shrink-0 font-literata font-normal tracking-normal text-mute hover:text-ink"
          >
            SSG
          </a>
        </template>
      </div>
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
