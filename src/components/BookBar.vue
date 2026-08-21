<script setup lang="ts">
import { Images, ImageOff } from '@lucide/vue'
import { READ_FONTS, type ReadFont } from '@/composables/useReadFont'
import { STAGE_TEMPLATES, type ShowEpisodeRef, type StageTemplate } from '@/types/library'

defineProps<{
  title: string
  episodes: ShowEpisodeRef[]
  episodeSlug: string
  episodeLabel: string
  synthetic: boolean
  syntheticLabel: string
  imagesOn: boolean
  imagesLabel: string
  hasImage: boolean
  smallerLabel: string
  biggerLabel: string
  canSmaller: boolean
  canBigger: boolean
  font: ReadFont
  fontLabel: string
  canPickLayout: boolean
  template: StageTemplate
  layoutLabel: string
  spreadLabel: string
  stackLabel: string
}>()

const emit = defineEmits<{
  images: []
  smaller: []
  bigger: []
  font: [value: ReadFont]
  episode: [slug: string]
  template: [value: StageTemplate]
}>()

function onFont(event: Event): void {
  const target = event.target as HTMLSelectElement
  const value = target.value
  if (value === 'sans' || value === 'mono' || value === 'serif') {
    emit('font', value)
  }
}

function onEpisode(event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('episode', target.value)
}

function onTemplate(event: Event): void {
  const target = event.target as HTMLSelectElement
  const value = target.value
  if (value === 'spread' || value === 'stack') {
    emit('template', value)
  }
}

const fontNames: Record<ReadFont, string> = {
  sans: 'Onest',
  mono: 'Courier',
  serif: 'Literata',
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
    <div class="min-w-0 grow">
      <select
        v-if="episodes.length > 1"
        class="h-9 max-w-full cursor-pointer truncate border-0 bg-transparent p-0 font-sans text-base text-ink shadow-none"
        :value="episodeSlug"
        :aria-label="episodeLabel"
        @change="onEpisode"
      >
        <option v-for="row in episodes" :key="row.id" :value="row.slug">{{ row.title }}</option>
      </select>
      <p v-else class="truncate text-base text-ink">{{ title }}</p>
      <p v-if="synthetic" class="text-sm text-mute">{{ syntheticLabel }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-1">
      <template v-if="canPickLayout">
        <label class="sr-only" :for="'read-layout'">{{ layoutLabel }}</label>
        <select
          id="read-layout"
          class="h-9 max-w-28 cursor-pointer border-0 bg-transparent p-0 font-sans text-sm text-mute shadow-none hover:text-ink"
          :value="template"
          :aria-label="layoutLabel"
          @change="onTemplate"
        >
          <option v-for="id in STAGE_TEMPLATES" :key="id" :value="id">
            {{ id === 'spread' ? spreadLabel : stackLabel }}
          </option>
        </select>
      </template>
      <label class="sr-only" :for="'read-font'">{{ fontLabel }}</label>
      <select
        id="read-font"
        class="h-9 max-w-28 cursor-pointer border-0 bg-transparent p-0 font-sans text-sm text-mute shadow-none hover:text-ink"
        :value="font"
        :aria-label="fontLabel"
        @change="onFont"
      >
        <option v-for="id in READ_FONTS" :key="id" :value="id">{{ fontNames[id] }}</option>
      </select>
      <button
        type="button"
        class="flex h-9 min-w-8 cursor-pointer items-center justify-center px-1.5 font-sans text-sm text-mute hover:text-ink disabled:text-mute/40"
        :aria-label="smallerLabel"
        :disabled="!canSmaller"
        @click="emit('smaller')"
      >
        A−
      </button>
      <button
        type="button"
        class="flex h-9 min-w-8 cursor-pointer items-center justify-center px-1.5 font-sans text-sm text-mute hover:text-ink disabled:text-mute/40"
        :aria-label="biggerLabel"
        :disabled="!canBigger"
        @click="emit('bigger')"
      >
        A+
      </button>
      <button
        v-if="hasImage"
        type="button"
        class="flex cursor-pointer items-center gap-1.5 px-1.5 text-sm text-mute hover:text-ink"
        :aria-pressed="imagesOn"
        :aria-label="imagesLabel"
        @click="emit('images')"
      >
        <Images v-if="imagesOn" :size="16" :stroke-width="1.75" />
        <ImageOff v-else :size="16" :stroke-width="1.75" />
        <span class="hidden sm:inline">{{ imagesLabel }}</span>
      </button>
    </div>
  </div>
</template>
