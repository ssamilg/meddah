<script setup lang="ts">
import { Maximize2 } from '@lucide/vue'
import { computed, nextTick, ref, watch } from 'vue'
import ImageFocus from '@/components/ImageFocus.vue'
import type { StageLayout } from '@/layout'
import { sceneImage, type Scene } from '@/types/library'

const props = defineProps<{
  scene: Scene | undefined
  imagesOn: boolean
  layout: StageLayout
  readSize: number
  empty: string
  inspectLabel: string
  closeLabel: string
}>()

const focusing = ref(false)
const paperEl = ref<HTMLElement | null>(null)
const imageSrc = computed(() => sceneImage(props.scene))
const stacked = computed(() => props.layout === 'stack')
const compact = computed(() => props.layout === 'mobile')
const canFocus = computed(() => Boolean(props.imagesOn && imageSrc.value))
const readStyle = computed(() => ({ fontSize: `${props.readSize}px` }))

const wrapClass = computed(() => {
  const classes =
    props.layout === 'spread'
      ? 'flex w-full flex-col'
      : 'flex h-full min-h-0 w-full flex-1 flex-col'
  return classes
})

const stageClass = computed(() => {
  let classes
  if (stacked.value) {
    classes = 'flex h-full min-h-0 flex-1 flex-col gap-5'
  } else if (compact.value && props.imagesOn) {
    classes = 'grid h-full min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-4'
  } else if (compact.value) {
    classes = 'grid h-full min-h-0 flex-1 grid-cols-1 gap-4'
  } else if (props.imagesOn) {
    classes = 'grid gap-5 md:grid-cols-2'
  } else {
    classes = 'grid grid-cols-1 gap-5'
  }
  return classes
})

const figureClass = computed(() => {
  let classes = 'overflow-hidden rounded-md bg-well'
  if (stacked.value) {
    classes = `flex min-h-0 w-full flex-[2] items-center justify-center ${classes}`
  } else if (compact.value) {
    classes = `h-[min(10.5rem,28vh)] ${classes}`
  } else {
    classes = `h-[min(24rem,48vh)] lg:h-[min(32rem,58vh)] ${classes}`
  }
  return classes
})

const paperClass = computed(() => {
  let classes = 'paper min-h-0 overflow-auto rounded-md px-5 py-4 font-read md:px-9 md:py-8'
  if (stacked.value && props.imagesOn) {
    classes = `${classes} w-full flex-[3]`
  } else if (stacked.value) {
    classes = `${classes} w-full flex-1`
  } else if (compact.value) {
    classes = `${classes} min-h-0`
  } else if (props.imagesOn) {
    classes = `${classes} h-[min(24rem,48vh)] lg:h-[min(32rem,58vh)]`
  } else {
    classes = `${classes} mx-auto h-[min(24rem,48vh)] w-full max-w-2xl lg:h-[min(32rem,58vh)]`
  }
  return classes
})

const imageClass = computed(() => {
  const classes = stacked.value
    ? 'scene-fade max-h-full max-w-full object-contain'
    : 'scene-fade size-full object-cover'
  return classes
})

function openFocus(): void {
  if (canFocus.value) {
    focusing.value = true
  }
}

watch(imageSrc, (src) => {
  if (!src) {
    focusing.value = false
  }
})

watch(
  () => props.scene?.id,
  async () => {
    await nextTick()
    const paper = paperEl.value
    if (paper) {
      paper.scrollTop = 0
    }
  },
)
</script>

<template>
  <div :class="wrapClass">
    <div class="mx-auto w-full" :class="stageClass">
      <figure v-show="imagesOn" :class="figureClass">
        <button
          v-if="imageSrc"
          type="button"
          class="relative flex size-full cursor-pointer items-center justify-center"
          :aria-label="inspectLabel"
          @click="openFocus"
        >
          <img :key="scene?.id" :src="imageSrc" :alt="scene?.title" :class="imageClass" />
          <span
            class="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-md bg-[#05070c]/55 text-ink"
          >
            <Maximize2 :size="16" :stroke-width="1.75" />
          </span>
        </button>
      </figure>
      <article ref="paperEl" :class="paperClass" :style="readStyle">
        <p v-if="!scene" class="text-mute">{{ empty }}</p>
        <div v-else :key="scene.id" class="scene-fade">
          <h1 class="font-sans text-[1.22em] font-medium leading-snug">{{ scene.title }}</h1>
          <p class="mt-4 max-w-[70ch] whitespace-pre-wrap leading-[1.65]">{{ scene.body }}</p>
        </div>
      </article>
    </div>
    <ImageFocus
      v-if="imageSrc"
      v-model="focusing"
      :src="imageSrc"
      :alt="scene?.title ?? ''"
      :close-label="closeLabel"
    />
  </div>
</template>
