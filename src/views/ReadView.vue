<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BookBar from '@/components/BookBar.vue'
import SceneRail from '@/components/SceneRail.vue'
import SceneStage from '@/components/SceneStage.vue'
import { useReader } from '@/composables/useReader'
import { useLocale } from '@/composables/useLocale'
import { useReadSize } from '@/composables/useReadSize'
import { useStageTemplate } from '@/composables/useStageTemplate'
import { loadEpisode, loadShow } from '@/lib/library'
import { uiCopy } from '@/i18n'
import { resolveTemplate } from '@/types/library'

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
const { size: readSize, canSmaller, canBigger, smaller, bigger } = useReadSize()
const imagesLabel = computed(() => (imagesOn.value ? copy.value.imagesOn : copy.value.imagesOff))
const bookTitle = computed(() => episode.value?.title ?? '')
const preferred = computed(() => resolveTemplate(episode.value, show.value))
const { layout } = useStageTemplate(preferred)
const fill = computed(() => layout.value === 'stack' || layout.value === 'mobile')
const compact = computed(() => layout.value === 'mobile')

const shellClass = computed(() => {
  const classes = fill.value
    ? 'flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-3 md:px-4'
    : 'flex min-h-0 flex-1 flex-col justify-center px-3 py-8 md:px-4'
  return classes
})

const frameClass = computed(() => {
  const width = layout.value === 'stack' ? 'max-w-6xl' : 'max-w-5xl'
  const height = fill.value ? 'h-full min-h-0 flex-1' : 'min-h-0'
  const classes = `mx-auto flex w-full flex-col ${width} ${height}`
  return classes
})

const pageMark = computed(() => {
  const total = scenes.value.length
  const current = total === 0 ? 0 : index.value + 1
  const mark = `${current}/${total}`
  return mark
})
</script>

<template>
  <div :class="shellClass">
    <div v-if="!episode" class="mx-auto max-w-xl text-mute">{{ copy.missingEpisode }}</div>
    <div v-else :class="frameClass">
      <BookBar
        class="shrink-0"
        :title="bookTitle"
        :synthetic="Boolean(episode.synthetic || show?.synthetic)"
        :synthetic-label="copy.synthetic"
        :images-on="imagesOn"
        :images-label="imagesLabel"
        :smaller-label="copy.textSmaller"
        :bigger-label="copy.textBigger"
        :can-smaller="canSmaller"
        :can-bigger="canBigger"
        @images="toggleImages"
        @smaller="smaller"
        @bigger="bigger"
      />

      <SceneStage
        :scene="scene"
        :images-on="imagesOn"
        :layout="layout"
        :read-size="readSize"
        :empty="copy.empty"
        :inspect-label="copy.inspect"
        :close-label="copy.close"
      />

      <div
        class="mt-3 flex shrink-0 items-center justify-center gap-3 pb-[env(safe-area-inset-bottom)] text-base md:gap-4 md:pb-0"
      >
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1.5 text-ink disabled:cursor-not-allowed disabled:text-mute/50"
          :disabled="index === 0"
          @click="go(-1)"
        >
          <ChevronLeft :size="16" :stroke-width="1.75" />
          <span v-if="!compact">{{ copy.prev }}</span>
        </button>
        <p v-if="compact" class="min-w-12 text-center tabular-nums">{{ pageMark }}</p>
        <SceneRail
          v-else
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
          <span v-if="!compact">{{ copy.next }}</span>
          <ChevronRight :size="16" :stroke-width="1.75" />
        </button>
      </div>
    </div>
  </div>
</template>
