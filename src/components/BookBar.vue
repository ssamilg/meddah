<script setup lang="ts">
import { Images, ImageOff } from '@lucide/vue'

defineProps<{
  title: string
  synthetic: boolean
  syntheticLabel: string
  imagesOn: boolean
  imagesLabel: string
  smallerLabel: string
  biggerLabel: string
  canSmaller: boolean
  canBigger: boolean
}>()

const emit = defineEmits<{
  images: []
  smaller: []
  bigger: []
}>()
</script>

<template>
  <div class="mb-3 flex items-center justify-between gap-3 md:mb-4 md:gap-4">
    <div class="min-w-0">
      <p class="truncate text-base text-ink">{{ title }}</p>
      <p v-if="synthetic" class="text-sm text-mute">{{ syntheticLabel }}</p>
    </div>
    <div class="flex shrink-0 items-center gap-1">
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
        class="flex h-9 min-w-8 cursor-pointer items-center justify-center px-1.5 font-sans text-base text-mute hover:text-ink disabled:text-mute/40"
        :aria-label="biggerLabel"
        :disabled="!canBigger"
        @click="emit('bigger')"
      >
        A+
      </button>
      <button
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
