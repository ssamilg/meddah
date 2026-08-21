<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookBar from '@/components/BookBar.vue'
import SceneRail from '@/components/SceneRail.vue'
import SceneStage from '@/components/SceneStage.vue'
import { useReader } from '@/composables/useReader'
import { useLocale } from '@/composables/useLocale'
import { useReadFont } from '@/composables/useReadFont'
import { useReadSize } from '@/composables/useReadSize'
import { useReadTemplate } from '@/composables/useReadTemplate'
import { useStageTemplate } from '@/composables/useStageTemplate'
import { loadReaderEpisode, loadReaderShow, readerPreview } from '@/lib/library'
import { uiCopy } from '@/i18n'
import { resolveTemplate, sceneImage, type StageTemplate } from '@/types/library'

const route = useRoute()
const router = useRouter()
const { locale } = useLocale()
const copy = computed(() => uiCopy(locale.value))

const preview = computed(() => readerPreview(route.query))

const show = computed(() => {
  const showSlug = String(route.params.showSlug ?? '')
  return loadReaderShow(showSlug, preview.value)
})

const episode = computed(() => {
  const showSlug = String(route.params.showSlug ?? '')
  const episodeSlug = String(route.params.episodeSlug ?? '')
  return loadReaderEpisode(showSlug, episodeSlug, preview.value)
})

const episodeList = computed(() => show.value?.episodes ?? [])

const episodeIndex = computed(() => {
  const current = episode.value
  const i = episodeList.value.findIndex((row) => {
    const hit = current ? row.slug === current.slug || row.id === current.id : false
    return hit
  })
  return i
})

const prevEpisode = computed(() => {
  const i = episodeIndex.value
  const row = i > 0 ? episodeList.value[i - 1] : undefined
  return row
})

const nextEpisode = computed(() => {
  const i = episodeIndex.value
  const last = episodeList.value.length - 1
  const row = i >= 0 && i < last ? episodeList.value[i + 1] : undefined
  return row
})

function openAdjacent(delta: 1 | -1): void {
  const row = delta === 1 ? nextEpisode.value : prevEpisode.value
  const showSlug = String(route.params.showSlug ?? '')
  if (row) {
    let hash = ''
    if (delta === -1) {
      const loaded = loadReaderEpisode(showSlug, row.slug, preview.value)
      const last = loaded?.scenes.at(-1)
      hash = last ? `#${last.id}` : ''
    }
    void router.push({
      name: 'read',
      params: { showSlug, episodeSlug: row.slug },
      query: route.query,
      hash,
    })
  }
}

const { scenes, index, imagesOn, scene, go, goTo, toggleImages } = useReader(episode, openAdjacent)
const { size: readSize, canSmaller, canBigger, smaller, bigger } = useReadSize()
const { font: readFont, setFont } = useReadFont()
const contentTemplate = computed(() => resolveTemplate(episode.value, show.value))
const { template, setTemplate } = useReadTemplate(contentTemplate)
const { layout, canPickLayout } = useStageTemplate(template)
const imagesLabel = computed(() => (imagesOn.value ? copy.value.imagesOn : copy.value.imagesOff))
const bookTitle = computed(() => episode.value?.title ?? '')
const fill = computed(() => layout.value === 'stack' || layout.value === 'mobile')
const compact = computed(() => layout.value === 'mobile')
const hasImage = computed(() => Boolean(sceneImage(scene.value)))
const atStart = computed(() => index.value === 0)
const atEnd = computed(() => scenes.value.length === 0 || index.value >= scenes.value.length - 1)
const prevIsEpisode = computed(() => atStart.value && Boolean(prevEpisode.value))
const nextIsEpisode = computed(() => atEnd.value && Boolean(nextEpisode.value))
const prevLabel = computed(() => (prevIsEpisode.value ? copy.value.prevEpisode : copy.value.prev))
const nextLabel = computed(() => (nextIsEpisode.value ? copy.value.nextEpisode : copy.value.next))
const prevDisabled = computed(() => atStart.value && !prevEpisode.value)
const nextDisabled = computed(() => atEnd.value && !nextEpisode.value)

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

function onPrev(): void {
  if (prevIsEpisode.value) {
    openAdjacent(-1)
  } else {
    go(-1)
  }
}

function onNext(): void {
  if (nextIsEpisode.value) {
    openAdjacent(1)
  } else {
    go(1)
  }
}

function onEpisode(slug: string): void {
  const showSlug = String(route.params.showSlug ?? '')
  if (slug && slug !== episode.value?.slug) {
    void router.push({
      name: 'read',
      params: { showSlug, episodeSlug: slug },
      query: route.query,
      hash: '',
    })
  }
}

function onTemplate(value: StageTemplate): void {
  setTemplate(value)
}

watch(
  () => scene.value?.id,
  (id) => {
    if (id && route.name === 'read' && route.hash !== `#${id}`) {
      void router.replace({ hash: `#${id}` })
    }
  },
)
</script>

<template>
  <div :class="shellClass">
    <div v-if="!episode" class="mx-auto max-w-xl text-mute">{{ copy.missingEpisode }}</div>
    <div v-else :class="frameClass">
      <SceneStage
        :scene="scene"
        :images-on="imagesOn"
        :layout="layout"
        :read-size="readSize"
        :read-font="readFont"
        :empty="copy.empty"
        :inspect-label="copy.inspect"
        :close-label="copy.close"
      >
        <template #bar>
          <BookBar
            class="shrink-0"
            :title="bookTitle"
            :episodes="episodeList"
            :episode-slug="episode.slug"
            :episode-label="copy.episode"
            :synthetic="Boolean(episode.synthetic || show?.synthetic)"
            :synthetic-label="copy.synthetic"
            :images-on="imagesOn"
            :images-label="imagesLabel"
            :has-image="hasImage"
            :smaller-label="copy.textSmaller"
            :bigger-label="copy.textBigger"
            :can-smaller="canSmaller"
            :can-bigger="canBigger"
            :font="readFont"
            :font-label="copy.readFont"
            :can-pick-layout="canPickLayout"
            :template="template"
            :layout-label="copy.layout"
            :spread-label="copy.spread"
            :stack-label="copy.stack"
            @images="toggleImages"
            @smaller="smaller"
            @bigger="bigger"
            @font="setFont"
            @episode="onEpisode"
            @template="onTemplate"
          />
        </template>
      </SceneStage>

      <div
        class="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 pb-[env(safe-area-inset-bottom)] text-base md:gap-4 md:pb-0"
      >
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1.5 text-ink disabled:cursor-not-allowed disabled:text-mute/50"
          :disabled="prevDisabled"
          @click="onPrev"
        >
          <ChevronLeft :size="16" :stroke-width="1.75" />
          <span v-if="!compact || prevIsEpisode">{{ prevLabel }}</span>
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
          :disabled="nextDisabled"
          @click="onNext"
        >
          <span v-if="!compact || nextIsEpisode">{{ nextLabel }}</span>
          <ChevronRight :size="16" :stroke-width="1.75" />
        </button>
      </div>
    </div>
  </div>
</template>
