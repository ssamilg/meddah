<script setup lang="ts">
import type { Scene } from '@/types/piece'

defineProps<{
  scene: Scene | undefined
  imagesOn: boolean
  sceneLabel: string
  index: number
  empty: string
}>()
</script>

<template>
  <div
    class="mx-auto grid w-full max-w-5xl gap-4"
    :class="imagesOn ? 'md:grid-cols-2' : 'grid-cols-1'"
  >
    <figure
      v-show="imagesOn"
      class="h-[min(32rem,58vh)] overflow-hidden rounded-md bg-panel"
    >
      <img
        v-if="scene"
        :src="scene.image"
        :alt="scene.title"
        class="size-full object-cover"
      />
    </figure>
    <article
      class="h-[min(32rem,58vh)] overflow-auto rounded-md bg-panel p-6"
      :class="imagesOn ? '' : 'mx-auto w-full max-w-2xl'"
    >
      <p v-if="!scene" class="text-base/7 text-mute">{{ empty }}</p>
      <template v-else>
        <p class="text-sm text-mute">
          {{ sceneLabel }} {{ String(index + 1).padStart(2, '0') }}
        </p>
        <h1 class="mt-1 text-xl/7 font-medium">{{ scene.title }}</h1>
        <p class="mt-4 max-w-[70ch] text-base/7">{{ scene.body }}</p>
      </template>
    </article>
  </div>
</template>
