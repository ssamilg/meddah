<script setup lang="ts">
import { Images, ImageOff } from '@lucide/vue'

defineProps<{
  title: string
  synthetic: boolean
  syntheticLabel: string
  imagesOn: boolean
  imagesLabel: string
}>()

const emit = defineEmits<{
  images: []
}>()
</script>

<template>
  <div class="mb-4 flex items-center justify-between gap-4">
    <div class="min-w-0">
      <p class="truncate text-[15px] text-ink">{{ title }}</p>
      <p v-if="synthetic" class="text-[13px] text-mute">{{ syntheticLabel }}</p>
    </div>
    <button
      type="button"
      class="flex shrink-0 items-center gap-1.5 text-[13px] text-mute hover:text-ink"
      :aria-pressed="imagesOn"
      @click="emit('images')"
    >
      <Images v-if="imagesOn" :size="16" :stroke-width="1.75" />
      <ImageOff v-else :size="16" :stroke-width="1.75" />
      {{ imagesLabel }}
    </button>
  </div>
</template>
