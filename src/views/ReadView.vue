<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BookBar from '@/components/BookBar.vue'
import SceneRail from '@/components/SceneRail.vue'
import SceneStage from '@/components/SceneStage.vue'
import { useReader } from '@/composables/useReader'
import { useLocale } from '@/composables/useLocale'
import { loadEpisode, loadShow } from '@/lib/library'
import { uiCopy } from '@/i18n'

const route = useRoute()
const { locale } = useLocale()
const copy = computed(() => uiCopy(locale.value))

const episode = computed(() => {
  const showId = String(route.params.showId ?? '')
  const episodeId = String(route.params.episodeId ?? '')
  return loadEpisode(showId, episodeId)
})

const show = computed(() => {
  const showId = String(route.params.showId ?? '')
  return loadShow(showId)
})

const { scenes, index, imagesOn, scene, go, goTo, toggleImages } = useReader(episode)
const imagesLabel = computed(() => (imagesOn.value ? copy.value.imagesOn : copy.value.imagesOff))
const bookTitle = computed(() => episode.value?.title ?? '')
</script>

<template>
  <div class="flex flex-1 flex-col justify-center px-4 py-8">
    <div v-if="!episode" class="mx-auto max-w-xl text-mute">{{ copy.missingEpisode }}</div>
    <div v-else class="mx-auto w-full max-w-5xl">
      <BookBar
        :title="bookTitle"
        :synthetic="Boolean(episode.synthetic || show?.synthetic)"
        :synthetic-label="copy.synthetic"
        :images-on="imagesOn"
        :images-label="imagesLabel"
        @images="toggleImages"
      />

      <SceneStage :scene="scene" :images-on="imagesOn" :empty="copy.empty" />

      <div class="mt-4 flex items-center justify-center gap-4 text-base">
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1.5 text-ink disabled:cursor-not-allowed disabled:text-mute/50"
          :disabled="index === 0"
          @click="go(-1)"
        >
          <ChevronLeft :size="16" :stroke-width="1.75" />
          {{ copy.prev }}
        </button>
        <SceneRail
          :scenes="scenes"
          :index="index"
          :scene-label="copy.scene"
          @select="goTo"
        />
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1.5 text-ink disabled:cursor-not-allowed disabled:text-mute/50"
          :disabled="index >= scenes.length - 1"
          @click="go(1)"
        >
          {{ copy.next }}
          <ChevronRight :size="16" :stroke-width="1.75" />
        </button>
      </div>
    </div>
  </div>
</template>
