<script setup lang="ts">
import rawPiece from '../content/piece.json'
import SceneRail from '@/components/SceneRail.vue'
import SceneStage from '@/components/SceneStage.vue'
import { useReader } from '@/composables/useReader'
import { uiCopy } from '@/i18n'
import { computed } from 'vue'

const { piece, scenes, index, locale, imagesOn, scene, go, goTo, toggleLocale, toggleImages } =
  useReader(rawPiece)

const copy = computed(() => uiCopy(locale.value))
const sceneCount = computed(() => {
  const label = `${index.value + 1} / ${scenes.length}`
  return label
})
</script>

<template>
  <div class="min-h-dvh bg-page text-ink">
    <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
      <header class="flex items-baseline justify-between gap-3">
        <div class="flex items-baseline gap-2">
          <p class="text-sm font-medium">Meddah</p>
          <p v-if="piece" class="text-sm text-mute">{{ piece.title }}</p>
          <p v-if="piece?.synthetic" class="text-xs text-mute">{{ copy.synthetic }}</p>
        </div>
      </header>

      <SceneRail :scenes="scenes" :index="index" :scene-label="copy.scene" @select="goTo" />

      <SceneStage
        :scene="scene"
        :images-on="imagesOn"
        :scene-label="copy.scene"
        :index="index"
        :empty="copy.empty"
      />

      <div class="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          :disabled="index === 0"
          @click="go(-1)"
        >
          {{ copy.prev }}
        </button>
        <p class="min-w-14 text-center text-sm text-mute">{{ sceneCount }}</p>
        <button
          type="button"
          class="btn btn-sm btn-ghost"
          :disabled="index >= scenes.length - 1"
          @click="go(1)"
        >
          {{ copy.next }}
        </button>
        <span class="mx-1 h-4 w-px bg-line" aria-hidden="true" />
        <button type="button" class="btn btn-sm btn-ghost" @click="toggleImages">
          {{ imagesOn ? copy.imagesOn : copy.imagesOff }}
        </button>
        <button type="button" class="btn btn-sm btn-ghost" @click="toggleLocale">
          {{ copy.language }}
        </button>
      </div>
    </div>
  </div>
</template>
