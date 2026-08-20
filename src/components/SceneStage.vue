<script setup lang="ts">
import { computed } from 'vue'
import { sceneImage, type Scene } from '@/types/library'

const props = defineProps<{
  scene: Scene | undefined
  imagesOn: boolean
  empty: string
}>()

const imageSrc = computed(() => sceneImage(props.scene))
</script>

<template>
  <div
    class="mx-auto grid w-full max-w-5xl gap-5"
    :class="imagesOn ? 'md:grid-cols-2' : 'grid-cols-1'"
  >
    <figure
      v-show="imagesOn"
      class="h-[min(24rem,48vh)] overflow-hidden rounded-md bg-well md:h-[min(32rem,58vh)]"
    >
      <img
        v-if="imageSrc"
        :key="scene?.id"
        :src="imageSrc"
        :alt="scene?.title"
        class="scene-fade size-full object-cover"
      />
    </figure>
    <article
      class="paper h-[min(24rem,48vh)] overflow-auto rounded-md px-7 py-6 font-read md:h-[min(32rem,58vh)] md:px-9 md:py-8"
      :class="imagesOn ? '' : 'mx-auto w-full max-w-2xl'"
    >
      <p v-if="!scene" class="text-base/7 text-mute">{{ empty }}</p>
      <div v-else :key="scene.id" class="scene-fade">
        <h1 class="font-sans text-2xl/8 font-medium">{{ scene.title }}</h1>
        <p class="mt-4 max-w-[70ch] whitespace-pre-wrap text-lg/8">{{ scene.body }}</p>
      </div>
    </article>
  </div>
</template>
